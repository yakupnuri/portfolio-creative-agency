import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { cookieOptions, signToken } from '../auth';
import { UserModel } from '../models/User';
import { BriefModel } from '../models/Brief';
import { ProjectModel } from '../models/Project';
import { ContentModel } from '../models/Content';
import { ClientRefModel } from '../models/ClientRef';
import { CategoryModel } from '../models/Category';
import { requireAuth, requireRole, requireAnyRole } from '../middlewares/rbac';
import { cloudinary } from '../cloudinary';
import { isMongoConnected } from '../db';
import { ENV } from '../env';
import { MediaAssetModel } from '../models/MediaAsset';
import path from 'path';
import fs from 'fs';

export const adminRouter = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

type ProjectTranslation = {
  title?: string;
  category?: string;
  description?: string;
  client?: string;
  role?: string;
};

type Translations = {
  tr?: ProjectTranslation;
  nl?: ProjectTranslation;
  en?: ProjectTranslation;
};

type CategoryTranslation = {
  name?: string;
};

type CategoryTranslations = {
  tr?: CategoryTranslation;
  nl?: CategoryTranslation;
  en?: CategoryTranslation;
};

function autoGenerateTranslations(translations: Translations): Translations {
  const nl = translations.nl || {};
  const result: Translations = { ...translations };

  if (nl.title && !result.tr?.title) {
    result.tr = { ...result.tr, title: nl.title };
  }
  if (nl.title && !result.en?.title) {
    result.en = { ...result.en, title: nl.title };
  }

  if (nl.category && !result.tr?.category) {
    result.tr = { ...result.tr, category: nl.category };
  }
  if (nl.category && !result.en?.category) {
    result.en = { ...result.en, category: nl.category };
  }

  if (nl.description && !result.tr?.description) {
    result.tr = { ...result.tr, description: nl.description };
  }
  if (nl.description && !result.en?.description) {
    result.en = { ...result.en, description: nl.description };
  }

  if (nl.client && !result.tr?.client) {
    result.tr = { ...result.tr, client: nl.client };
  }
  if (nl.client && !result.en?.client) {
    result.en = { ...result.en, client: nl.client };
  }

  if (nl.role && !result.tr?.role) {
    result.tr = { ...result.tr, role: nl.role };
  }
  if (nl.role && !result.en?.role) {
    result.en = { ...result.en, role: nl.role };
  }

  if (nl.techStack && !result.tr?.techStack) {
    result.tr = { ...result.tr, techStack: nl.techStack };
  }
  if (nl.techStack && !result.en?.techStack) {
    result.en = { ...result.en, techStack: nl.techStack };
  }

  if (nl.applications && !result.tr?.applications) {
    result.tr = { ...result.tr, applications: nl.applications };
  }
  if (nl.applications && !result.en?.applications) {
    result.en = { ...result.en, applications: nl.applications };
  }

  if (nl.timeline && !result.tr?.timeline) {
    result.tr = { ...result.tr, timeline: nl.timeline };
  }
  if (nl.timeline && !result.en?.timeline) {
    result.en = { ...result.en, timeline: nl.timeline };
  }

  return result;
}

function autoGenerateTranslationsCategory(translations: CategoryTranslations): CategoryTranslations {
  const nl = translations.nl || {};
  const result: CategoryTranslations = { ...translations };

  if (nl.name && !result.tr?.name) {
    result.tr = { ...result.tr, name: nl.name };
  }
  if (nl.name && !result.en?.name) {
    result.en = { ...result.en, name: nl.name };
  }

  return result;
}

adminRouter.post('/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'validation_error' });
  const user = await UserModel.findOne({ email: parsed.data.email });
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = signToken({ uid: String(user._id), role: user.role, email: user.email });
  res.cookie('auth_token', token, cookieOptions());
  return res.json({ email: user.email, role: user.role });
});

adminRouter.post('/auth/logout', requireAuth, async (_req, res) => {
  res.clearCookie('auth_token', cookieOptions());
  return res.json({ ok: true });
});

adminRouter.get('/auth/me', requireAuth, async (req, res) => {
  const u = (req as any).user;
  return res.json({ email: u.email, role: u.role });
});

adminRouter.post('/auth/bootstrap', async (req, res) => {
  if (!isMongoConnected()) return res.status(503).json({ error: 'db_not_connected' });
  const count = await UserModel.countDocuments();
  if (count > 0) return res.status(403).json({ error: 'already_initialized' });
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'validation_error' });
  const hash = await bcrypt.hash(parsed.data.password, 10);
  const created = await UserModel.create({ email: parsed.data.email, passwordHash: hash, role: 'owner' });
  return res.json({ id: String(created._id) });
});

adminRouter.get('/auth/status', async (_req, res) => {
  const dbConnected = isMongoConnected();
  const count = dbConnected ? await UserModel.countDocuments() : 0;
  return res.json({ initialized: count > 0, dbConnected });
});

adminRouter.get('/users', requireAuth, requireRole('owner'), async (_req, res) => {
  const users = await UserModel.find().lean();
  res.json(users.map(u => ({ id: String(u._id), email: u.email, role: u.role, createdAt: u.createdAt })));
});
adminRouter.post('/users', requireAuth, requireRole('owner'), async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6), role: z.enum(['owner', 'admin', 'editor']) });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  const hash = await bcrypt.hash(p.data.password, 10);
  const created = await UserModel.create({ email: p.data.email, passwordHash: hash, role: p.data.role });
  res.json({ id: String(created._id) });
});
adminRouter.patch('/users/:id', requireAuth, requireRole('owner'), async (req, res) => {
  const schema = z.object({ role: z.enum(['owner', 'admin', 'editor']).optional(), password: z.string().min(6).optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  const update: any = {};
  if (p.data.role) update.role = p.data.role;
  if (p.data.password) update.passwordHash = await bcrypt.hash(p.data.password, 10);
  await UserModel.findByIdAndUpdate(req.params.id, update);
  res.json({ ok: true });
});
adminRouter.delete('/users/:id', requireAuth, requireRole('owner'), async (req, res) => {
  await UserModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

adminRouter.get('/briefs', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (_req, res) => {
  const items = await BriefModel.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});
adminRouter.get('/briefs/:id', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  const item = await BriefModel.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ error: 'not_found' });
  res.json(item);
});
adminRouter.patch('/briefs/:id', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({ status: z.enum(['new', 'reviewing', 'proposal_sent', 'won', 'lost']).optional(), internalNotes: z.string().optional(), tags: z.array(z.string()).optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  await BriefModel.findByIdAndUpdate(req.params.id, p.data);
  res.json({ ok: true });
});



adminRouter.get('/content/:key', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  const key = req.params.key as any;
  const doc = await ContentModel.findOne({ key });
  res.json(doc || { key, draft: {}, publishedVersion: {} });
});
adminRouter.patch('/content/:key', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  const key = req.params.key as any;
  await ContentModel.updateOne({ key }, { $set: { draft: req.body, updatedAt: new Date() } }, { upsert: true });
  res.json({ ok: true });
});
adminRouter.patch('/content/:key/publish', requireAuth, requireRole('owner'), async (req, res) => {
  const key = req.params.key as any;
  const doc = await ContentModel.findOne({ key });
  const draft = doc?.draft || {};
  await ContentModel.updateOne({ key }, { $set: { publishedVersion: draft, updatedAt: new Date() } }, { upsert: true });
  res.json({ ok: true });
});

adminRouter.get('/clients', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (_req, res) => {
  const list = await ClientRefModel.find().sort({ order: 1 }).lean();
  res.json(list);
});
adminRouter.post('/clients', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({ name: z.string(), logoUrl: z.string().optional(), order: z.number().optional(), published: z.boolean().optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  const created = await ClientRefModel.create(p.data);
  res.json({ id: String(created._id) });
});
adminRouter.patch('/clients/:id', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({ name: z.string().optional(), logoUrl: z.string().optional(), order: z.number().optional(), published: z.boolean().optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  await ClientRefModel.findByIdAndUpdate(req.params.id, p.data);
  res.json({ ok: true });
});
adminRouter.delete('/clients/:id', requireAuth, requireRole('owner'), async (req, res) => {
  await ClientRefModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

adminRouter.post('/media/upload', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({ file: z.string(), alt: z.string().optional(), caption: z.string().optional(), tags: z.array(z.string()).optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  const preferCloudinary = !!(ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET);
  try {
    if (preferCloudinary) {
      console.log('Uploading to Cloudinary...');
      const result = await cloudinary.uploader.upload(p.data.file, { folder: 'abdulhamit-portfolio' });
      console.log('Cloudinary upload result:', result);
      const doc = await MediaAssetModel.create({
        source: 'upload', storage: 'cloudinary', url: result.secure_url, preview: result.secure_url,
        format: result.format, bytes: result.bytes, width: result.width, height: result.height,
        alt: p.data.alt, caption: p.data.caption, tags: p.data.tags || [], cloudinary_public_id: result.public_id
      });
      return res.json({ id: String(doc._id), url: doc.url, storage: 'cloudinary', public_id: result.public_id });
    } else {
      const match = p.data.file.match(/^data:(.+);base64,(.*)$/);
      if (!match) return res.status(400).json({ error: 'invalid_base64' });
      const ext = (match[1].split('/')[1] || 'png').split(';')[0];
      const buf = Buffer.from(match[2], 'base64');
      const name = `upload_${Date.now()}.${ext}`;
      const dir = path.join(process.cwd(), 'server', 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, name), buf);
      const base = `${(req as any).protocol || 'http'}://${req.get('host')}`;
      const url = `${base}/uploads/${name}`;
      const doc = await MediaAssetModel.create({ source: 'upload', storage: 'local', url, preview: url, local_path: path.join(dir, name), alt: p.data.alt, caption: p.data.caption, tags: p.data.tags || [] });
      return res.json({ id: String(doc._id), url: doc.url, storage: 'local', local_path: `uploads/${name}` });
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'upload_failed', message: error?.message });
  }
});

adminRouter.get('/media/cloudinary/list', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (_req, res) => {
  try {
    const items: any[] = [];
    const result = await cloudinary.search
      .expression('resource_type:image AND type:upload')
      .max_results(100)
      .execute();
    
    (result.resources || []).forEach((r: any) => {
      items.push({
        public_id: r.public_id,
        url: r.secure_url,
        format: r.format,
        bytes: r.bytes,
        width: r.width,
        height: r.height,
        created_at: r.created_at
      });
    });
    res.json(items);
  } catch (e: any) {
    console.error('Cloudinary list error:', e);
    res.json([]);
  }
});

adminRouter.get('/diagnostics/cloudinary', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (_req, res) => {
  try {
    const hasConfig = !!(ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET);
    if (!hasConfig) return res.status(503).json({ ok: false, reason: 'not_configured' });
    console.log('Testing Cloudinary with config:', { 
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME, 
      has_key: !!ENV.CLOUDINARY_API_KEY, 
      has_secret: !!ENV.CLOUDINARY_API_SECRET 
    });
    const result = await cloudinary.search
      .expression('resource_type:image AND type:upload')
      .max_results(1)
      .execute();
    return res.json({ ok: true, count: result.total_count || 0 });
  } catch (e: any) {
    console.error('Cloudinary error:', e);
    return res.status(502).json({ ok: false, reason: 'api_error', message: e?.message || 'unknown_error' });
  }
});

adminRouter.get('/media/pixabay/search', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'query_required' });
  if (!ENV.PIXABAY_API_KEY) return res.status(503).json({ error: 'pixabay_not_configured' });
  try {
    const url = `https://pixabay.com/api/?key=${ENV.PIXABAY_API_KEY}&q=${encodeURIComponent(q)}&image_type=photo&per_page=30&lang=tr&safesearch=true`;
    console.log('Fetching Pixabay:', url);
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Pixabay API error: ${r.status}`);
    const j = await r.json();
    const items = (j.hits || []).map((h: any) => ({
      id: h.id,
      url: h.largeImageURL,
      preview: h.previewURL,
      tags: h.tags,
      width: h.imageWidth,
      height: h.imageHeight
    }));
    res.json(items);
  } catch (error: any) {
    console.error('Pixabay search error:', error);
    res.status(500).json({ error: 'pixabay_search_failed', message: error?.message });
  }
});

adminRouter.get('/media/local/list', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  try {
    const dir = path.join(process.cwd(), 'server', 'uploads');
    if (!fs.existsSync(dir)) return res.json([]);
    const files = fs.readdirSync(dir).filter(f => !fs.statSync(path.join(dir, f)).isDirectory());
    const base = `${req.protocol}://${req.get('host')}`;
    const items = files.map(f => ({ id: f, url: `${base}/uploads/${f}`, preview: `${base}/uploads/${f}`, source: 'local' }));
    res.json(items);
  } catch {
    res.json([]);
  }
});

adminRouter.post('/uploads/local', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({ file: z.string(), alt: z.string().optional(), caption: z.string().optional(), tags: z.array(z.string()).optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  try {
    const b64 = p.data.file;
    const match = b64.match(/^data:(.+);base64,(.*)$/);
    if (!match) return res.status(400).json({ error: 'invalid_base64' });
    const ext = (match[1].split('/')[1] || 'png').split(';')[0];
    const buf = Buffer.from(match[2], 'base64');
    const name = `upload_${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), 'server', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, name), buf);
    const base = `${req.protocol}://${req.get('host')}`;
    const url = `${base}/uploads/${name}`;
    const doc = await MediaAssetModel.create({ source: 'upload', storage: 'local', url, preview: url, local_path: path.join(dir, name), alt: p.data.alt, caption: p.data.caption, tags: p.data.tags || [] });
    return res.json({ id: String(doc._id), url: doc.url, storage: 'local' });
  } catch {
    return res.status(500).json({ error: 'upload_failed' });
  }
});

adminRouter.get('/media/all', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (_req, res) => {
  try {
    const { ProjectModel } = await import('../models/Project');
    const { ClientRefModel } = await import('../models/ClientRef');
    const { ContentModel } = await import('../models/Content');
    const mediaAssets = await MediaAssetModel.find().lean();
    const projects = await ProjectModel.find({ isDeleted: false }).lean();
    const clients = await ClientRefModel.find().lean();
    const contents = await ContentModel.find().lean();
    const items: any[] = [];
    projects.forEach(p => {
      if ((p as any).coverImage) items.push({ source: 'projects', url: (p as any).coverImage });
      ((p as any).galleryImages || []).forEach((u: string) => items.push({ source: 'projects', url: u }));
    });
    clients.forEach(c => { if ((c as any).logoUrl) items.push({ source: 'clients', url: (c as any).logoUrl }); });
    contents.forEach(c => {
      const anyC: any = c;
      const draft = anyC.draft || {};
      const pub = anyC.publishedVersion || {};
      [...(draft.slides || []), ...(pub.slides || [])].forEach((s: any) => { if (s?.url) items.push({ source: 'content', url: s.url }); });
    });
    mediaAssets.forEach(a => { items.push({ source: 'assets', url: (a as any).url }); });
    res.json(items);
  } catch {
    res.json([]);
  }
});

adminRouter.get('/media/assets', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const storage = String(req.query.storage || '').trim();
  const source = String(req.query.source || '').trim();
  const from = String(req.query.from || '').trim();
  const to = String(req.query.to || '').trim();
  const filter: any = {};
  if (storage) filter.storage = storage;
  if (source) filter.source = source;
  const items = await MediaAssetModel.find(filter).sort({ createdAt: -1 }).lean();
  const withinDate = items.filter(i => {
    const t = new Date(i.createdAt).getTime();
    const okFrom = from ? t >= new Date(from).getTime() : true;
    const okTo = to ? t <= new Date(to).getTime() : true;
    return okFrom && okTo;
  });
  const searched = q ? withinDate.filter(i => {
    const name = (i.cloudinary_public_id || i.local_path || i.url || '').toLowerCase();
    const tags = (i.tags || []).join(' ').toLowerCase();
    return name.includes(q) || tags.includes(q);
  }) : withinDate;
  res.json(searched);
});

adminRouter.post('/media/import/pixabay', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({ url: z.string().url(), alt: z.string().optional(), caption: z.string().optional(), tags: z.array(z.string()).optional() });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error' });
  const preferCloudinary = !!(ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET);
  try {
    console.log('Importing from Pixabay:', p.data.url);
    const r = await fetch(p.data.url);
    const buf = Buffer.from(await r.arrayBuffer());
    const b64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
    if (preferCloudinary) {
      console.log('Uploading to Cloudinary from Pixabay...');
      const result = await cloudinary.uploader.upload(b64, { folder: 'abdulhamit-portfolio' });
      console.log('Pixabay import result:', result);
      const doc = await MediaAssetModel.create({
        source: 'pixabay', storage: 'cloudinary', url: result.secure_url, preview: result.secure_url,
        format: result.format, bytes: result.bytes, width: result.width, height: result.height,
        alt: p.data.alt, caption: p.data.caption, tags: p.data.tags || [], cloudinary_public_id: result.public_id
      });
      return res.json({ id: String(doc._id), url: doc.url, storage: 'cloudinary' });
    } else {
      const name = `pixabay_${Date.now()}.jpg`;
      const dir = path.join(process.cwd(), 'server', 'uploads');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, name), buf);
      const base = `${req.protocol}://${req.get('host')}`;
      const url = `${base}/uploads/${name}`;
      const doc = await MediaAssetModel.create({ source: 'pixabay', storage: 'local', url, preview: url, local_path: path.join(dir, name), alt: p.data.alt, caption: p.data.caption, tags: p.data.tags || [] });
      return res.json({ id: String(doc._id), url: doc.url, storage: 'local' });
    }
  } catch (error: any) {
    console.error('Pixabay import error:', error);
    return res.status(500).json({ error: 'import_failed', message: error?.message });
  }
});

adminRouter.get('/categories', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (_req, res) => {
  const items = await CategoryModel.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(items);
});
adminRouter.post('/categories', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({
    slug: z.string(),
    isActive: z.boolean().optional(),
    order: z.number().optional(),
    translations: z.object({
      tr: z.object({ name: z.string().optional() }).optional(),
      nl: z.object({ name: z.string() }),
      en: z.object({ name: z.string().optional() }).optional()
    })
  });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error', details: p.error });
  
  const autoTranslations = autoGenerateTranslationsCategory(p.data.translations || {});
  
  const created = await CategoryModel.create({ 
    ...p.data, 
    translations: autoTranslations 
  });
  res.json({ id: String(created._id) });
});
adminRouter.patch('/categories/:id', requireAuth, requireAnyRole(['owner', 'admin']), async (req, res) => {
  const schema = z.object({
    slug: z.string().optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional(),
    translations: z.object({
      tr: z.object({ name: z.string().optional() }).optional(),
      nl: z.object({ name: z.string().optional() }),
      en: z.object({ name: z.string().optional() }).optional()
    }).optional()
  });
  const p = schema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'validation_error', details: p.error });
  
  const autoTranslations = autoGenerateTranslationsCategory(p.data.translations || {});
  
  await CategoryModel.findByIdAndUpdate(req.params.id, { 
    ...p.data, 
    translations: autoTranslations, 
    updatedAt: new Date() 
  });
  res.json({ ok: true });
});
adminRouter.delete('/categories/:id', requireAuth, requireRole('owner'), async (req, res) => {
  await CategoryModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Projects CRUD endpoints
adminRouter.get('/projects', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (_req, res) => {
  const items = await ProjectModel.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
  res.json(items);
});

adminRouter.get('/projects/:id', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  const item = await ProjectModel.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ error: 'not_found' });
  res.json(item);
});

adminRouter.post('/projects', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  try {
    const schema = z.object({
      slug: z.string(),
      year: z.string().optional(),
      coverImage: z.string().optional(),
      galleryImages: z.array(z.string()).optional(),
      isFeatured: z.boolean().optional(),
      categorySlug: z.string().optional(),
      published: z.boolean().optional(),
      translations: z.object({
        tr: z.object({ 
          title: z.string().optional(), 
          category: z.string().optional(),
          description: z.string().optional(),
          client: z.string().optional(),
          role: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          applications: z.array(z.string()).optional(),
          timeline: z.string().optional()
        }).optional(),
        nl: z.object({ 
          title: z.string(), 
          category: z.string().optional(),
          description: z.string().optional(),
          client: z.string().optional(),
          role: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          applications: z.array(z.string()).optional(),
          timeline: z.string().optional()
        }),
        en: z.object({ 
          title: z.string().optional(), 
          category: z.string().optional(),
          description: z.string().optional(),
          client: z.string().optional(),
          role: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          applications: z.array(z.string()).optional(),
          timeline: z.string().optional()
        }).optional()
      })
    });
    
    const p = schema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'validation_error', details: p.error });
    
    console.log('POST /admin/projects', p.data);
    
    const existing = await ProjectModel.findOne({ slug: p.data.slug });
    if (existing) {
      return res.status(400).json({ error: 'slug_exists', slug: p.data.slug });
    }
    
    const autoTranslations = autoGenerateTranslations(p.data.translations);
    
    await ProjectModel.create({ 
      ...p.data, 
      translations: autoTranslations,
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('POST /admin/projects error:', error);
    res.status(500).json({ error: 'server_error', details: error?.toString() });
  }
});

adminRouter.patch('/projects/:id', requireAuth, requireAnyRole(['owner', 'admin', 'editor']), async (req, res) => {
  try {
    const schema = z.object({
      slug: z.string().optional(),
      year: z.string().optional(),
      coverImage: z.string().optional(),
      galleryImages: z.array(z.string()).optional(),
      isFeatured: z.boolean().optional(),
      categorySlug: z.string().optional(),
      published: z.boolean().optional(),
      translations: z.object({
        tr: z.object({ 
          title: z.string().optional(), 
          category: z.string().optional(),
          description: z.string().optional(),
          client: z.string().optional(),
          role: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          applications: z.array(z.string()).optional(),
          timeline: z.string().optional()
        }).optional(),
        nl: z.object({ 
          title: z.string().optional(), 
          category: z.string().optional(),
          description: z.string().optional(),
          client: z.string().optional(),
          role: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          applications: z.array(z.string()).optional(),
          timeline: z.string().optional()
        }).optional(),
        en: z.object({ 
          title: z.string().optional(), 
          category: z.string().optional(),
          description: z.string().optional(),
          client: z.string().optional(),
          role: z.string().optional(),
          techStack: z.array(z.string()).optional(),
          applications: z.array(z.string()).optional(),
          timeline: z.string().optional()
        }).optional()
      }).optional()
    });
    
    const p = schema.safeParse(req.body);
    if (!p.success) return res.status(400).json({ error: 'validation_error', details: p.error });
    
    console.log('PATCH /admin/projects/:id', { 
      id: req.params.id, 
      data: p.data 
    });
    
    const autoTranslations = autoGenerateTranslations(p.data.translations || {});
    
    const updated = await ProjectModel.findByIdAndUpdate(
      req.params.id, 
      { ...p.data, translations: autoTranslations, updatedAt: new Date() }, 
      { new: true }
    );
    console.log('Updated project:', updated);
    
    if (!updated) {
      console.error('Project not found with ID:', req.params.id);
      return res.status(404).json({ error: 'not_found', id: req.params.id });
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error('PATCH /admin/projects/:id error:', error);
    res.status(500).json({ error: 'server_error', details: error?.toString() });
  }
});

adminRouter.delete('/projects/:id', requireAuth, requireRole('owner'), async (req, res) => {
  await ProjectModel.findByIdAndUpdate(req.params.id, { isDeleted: true, updatedAt: new Date() });
  res.json({ ok: true });
});
