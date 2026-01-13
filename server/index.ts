import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { z } from 'zod';
import { ENV, setRuntimeEnv } from './env';
import { isConfigured, saveConfig, loadConfig } from './configStore';
import { cloudinary } from './cloudinary';
import { connectMongo } from './db';
import { createBrief } from './repositories/briefRepo';
import { ProjectModel } from './models/Project';
import { CategoryModel } from './models/Category';
import cookieParser from 'cookie-parser';
import { adminRouter } from './routes/admin';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://abdulhamitgulen.com',
      'https://admin.abdulhamitgulen.com'
    ];
    const isAllowed =
      !origin ||
      allowed.includes(origin) ||
      (origin?.startsWith('http://admin.abdulhamitgulen.com') || origin?.startsWith('https://admin.abdulhamitgulen.com'));
    if (isAllowed) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('tiny'));
app.use(cookieParser());

const uploadsDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.get('/api/setup/status', (_req, res) => {
  const configured = isConfigured();
  return res.json({
    configured,
    required: ['MONGODB_URI', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'PIXABAY_API_KEY']
  });
});

const setupSchema = z.object({
  MONGODB_URI: z.string().min(10),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  PIXABAY_API_KEY: z.string().min(1).optional()
});

app.post('/api/setup', async (req, res) => {
  const parsed = setupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'validation_error', details: parsed.error.flatten() });
  }
  const cfg = parsed.data;
  saveConfig(cfg);
  setRuntimeEnv({
    MONGODB_URI: cfg.MONGODB_URI,
    CLOUDINARY_CLOUD_NAME: cfg.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: cfg.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: cfg.CLOUDINARY_API_SECRET,
    PIXABAY_API_KEY: cfg.PIXABAY_API_KEY
  });
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET
  });
  const ok = await connectMongo();
  return res.json({ ok });
});

const briefSchema = z.object({
  serviceType: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  budgetRange: z.string().optional(),
  deadline: z.string().optional(),
  message: z.string().optional(),
  serviceSpecificData: z.record(z.any()).optional()
});

app.post('/api/brief', async (req, res) => {
  const parsed = briefSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'validation_error', details: parsed.error.flatten() });
  }
  try {
    const saved = await createBrief(parsed.data);
    return res.status(201).json({ id: (saved as any)._id });
  } catch (e) {
    return res.status(500).json({ error: 'server_error' });
  }
});

app.get('/api/public/projects', async (_req, res) => {
  try {
    const list = await ProjectModel.find({ published: true, isDeleted: false }).sort({ createdAt: -1 }).lean();
    return res.json(list);
  } catch {
    return res.json([]);
  }
});

app.get('/api/public/projects/:slug', async (req, res) => {
  try {
    const proj = await ProjectModel.findOne({ slug: req.params.slug, published: true, isDeleted: false }).lean();
    if (!proj) return res.status(404).json({ error: 'not_found' });
    return res.json(proj);
  } catch {
    return res.status(500).json({ error: 'server_error' });
  }
});

app.get('/api/public/categories', async (_req, res) => {
  try {
    const list = await CategoryModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
    return res.json(list);
  } catch {
    return res.json([]);
  }
});

app.use('/api/admin', adminRouter);

app.get('/api/public/content/:key', async (req, res) => {
  const { ContentModel } = await import('./models/Content');
  try {
    const doc = await ContentModel.findOne({ key: req.params.key }).lean();
    const anyDoc: any = doc;
    return res.json(anyDoc?.publishedVersion || {});
  } catch {
    return res.json({});
  }
});

app.get('/api/hero', async (_req, res) => {
  const cfg = loadConfig();
  return res.json({ url: cfg.HERO_URL || '' });
});

async function ensureHeroImage() {
  try {
    const cfg = loadConfig();
    if (cfg.HERO_URL) return;
    if (!(ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET)) return;
    const fs = await import('fs');
    const path = await import('path');
    const heroLocal = path.join(process.cwd(), 'hero.png');
    const heroParent = path.join(process.cwd(), '..', 'hero.png');
    const heroPath = fs.existsSync(heroLocal) ? heroLocal : (fs.existsSync(heroParent) ? heroParent : '');
    if (!heroPath) return;
    const result = await cloudinary.uploader.upload(heroPath, { folder: 'abdulhamit-portfolio' });
    saveConfig({ ...cfg, HERO_PUBLIC_ID: result.public_id, HERO_URL: result.secure_url });
    console.log('hero_uploaded', result.public_id);
  } catch (e) {
    console.warn('hero_upload_failed');
  }
}

connectMongo().finally(() => {
  app.listen(ENV.PORT, () => {
    console.log(`api_ready ${ENV.PORT}`);
  });
  ensureHeroImage();
});
