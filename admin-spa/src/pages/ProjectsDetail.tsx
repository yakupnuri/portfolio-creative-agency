import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Icons } from '../constants';
import { UserRole } from '../types';
import { useAuth } from '../App';
import { apiService } from '../services/api';
import MediaLibrary from '../components/MediaLibrary';
import { MediaItem } from '../types';

type ProjectTranslation = {
  title: string;
  category: string;
  description?: string;
  client?: string;
  role?: string;
  techStack?: string[];
  applications?: string[];
  timeline?: string;
};

type Project = {
  id: string;
  slug: string;
  year?: string;
  coverImage?: string;
  galleryImages?: string[];
  isFeatured: boolean;
  published: boolean;
  translations: {
    tr: ProjectTranslation;
    nl: ProjectTranslation;
    en: ProjectTranslation;
  };
  categorySlug?: string;
};

type Category = {
  id: string;
  slug: string;
  translations: {
    tr: { name: string };
    nl: { name: string };
    en: { name: string };
  };
  isActive: boolean;
};

const ProjectsDetail: React.FC = () => {
  const { auth } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [language, setLanguage] = useState<'tr' | 'nl' | 'en'>('tr');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'cover' | 'gallery'>('cover');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ tr: '', nl: '', en: '', slug: '' });
  const [project, setProject] = useState<Project>({
    id: '',
    slug: '',
    year: new Date().getFullYear().toString(),
    coverImage: '',
    galleryImages: [],
    isFeatured: false,
    published: false,
    translations: {
      tr: { title: '', category: '', description: '', client: '', role: '', techStack: [], applications: [], timeline: '' },
      nl: { title: '', category: '', description: '', client: '', role: '', techStack: [], applications: [], timeline: '' },
      en: { title: '', category: '', description: '', client: '', role: '', techStack: [], applications: [], timeline: '' }
    }
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    apiService.get('/admin/categories').then(items => {
      console.log('Categories loaded:', items);
      setCategories(items.filter((c: any) => c.isActive));
    }).catch((error) => {
      console.error('Failed to load categories:', error);
      alert('Kategoriler yüklenemedi. Lütfen tekrar deneyin.');
    });
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setProject({
        id: '',
        slug: '',
        year: new Date().getFullYear().toString(),
        coverImage: '',
        galleryImages: [],
        isFeatured: false,
        published: false,
        translations: {
          tr: { title: '', category: '', description: '', client: '', role: '', techStack: [], applications: [], timeline: '' },
          nl: { title: '', category: '', description: '', client: '', role: '', techStack: [], applications: [], timeline: '' },
          en: { title: '', category: '', description: '', client: '', role: '', techStack: [], applications: [], timeline: '' }
        }
      });
    } else if (id && id !== 'new') {
      apiService.get(`/admin/projects/${id}`).then((p: any) => {
        setProject({
          id: String(p._id),
          slug: p.slug,
          year: p.year || '',
          coverImage: p.coverImage || '',
          galleryImages: p.galleryImages || [],
          isFeatured: !!p.isFeatured,
          published: !!p.published,
          translations: p.translations,
          categorySlug: p.categorySlug
        });
      }).catch(() => {
        navigate('/admin/projects');
      }).finally(() => setLoading(false));
    }
  }, [id, isNew, navigate]);

  // Ensure loading is set to false for new routes
  useEffect(() => {
    if (id === 'new') {
      setLoading(false);
    }
  }, [id]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (lang: 'tr' | 'nl' | 'en', title: string) => {
    const newProject = { ...project };
    newProject.translations[lang].title = title;
    if (lang === 'tr' && isNew) {
      newProject.slug = generateSlug(title);
    }
    setProject(newProject);
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      const data = {
        slug: project.slug,
        year: project.year,
        coverImage: project.coverImage,
        galleryImages: project.galleryImages,
        isFeatured: project.isFeatured,
        categorySlug: project.categorySlug,
        published: publish,
        translations: project.translations
      };

      console.log('Saving project:', { isNew, projectId: project.id, data });

      if (isNew || !project.id) {
        console.log('Creating new project...');
        const result = await apiService.post('/admin/projects', data);
        console.log('Create result:', result);
        navigate('/projects/list');
      } else {
        console.log(`Updating project with ID: ${project.id}`);
        const result = await apiService.patch(`/admin/projects/${project.id}`, data);
        console.log('Update result:', result);
      }
      if (publish) {
        alert('Proje başarıyla yayınlandı!');
      } else {
        alert('Proje kaydedildi!');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMsg = error?.message || error?.toString() || 'Kaydetme başarısız oldu!';
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (item: MediaItem) => {
    if (mediaTarget === 'cover') {
      setProject({ ...project, coverImage: item.url });
    } else {
      setProject({ ...project, galleryImages: [...(project.galleryImages || []), item.url] });
    }
    setShowMediaLibrary(false);
  };

  const removeGalleryImage = (index: number) => {
    setProject({
      ...project,
      galleryImages: project.galleryImages?.filter((_, i) => i !== index) || []
    });
  };

  const handleAddCategory = async () => {
    if (!newCategory.tr.trim()) return;
    try {
      const slug = newCategory.slug || generateSlug(newCategory.tr);
      await apiService.post('/admin/categories', {
        slug,
        isActive: true,
        translations: {
          tr: { name: newCategory.tr },
          nl: { name: newCategory.nl },
          en: { name: newCategory.en }
        }
      });
      const updatedCategories = await apiService.get('/admin/categories');
      setCategories(updatedCategories.filter((c: any) => c.isActive));
      setNewCategory({ tr: '', nl: '', en: '', slug: '' });
      setShowCategoryModal(false);
    } catch {
      alert('Kategori eklenemedi');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2AB7CA] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {isNew ? 'Yeni Proje' : 'Proje Düzenle'}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isNew ? 'Yeni bir proje ekleyin' : 'Proje detaylarını düzenleyin'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/projects/list"
            className="flex items-center gap-2 bg-white border border-brand-divider text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            İptal
          </Link>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Icons.Save}
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          {auth.user?.role === UserRole.OWNER && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-2 bg-[#FE4A49] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#FE4A49]/20 hover:bg-[#FE4A49]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {Icons.Publish}
              {saving ? 'Yayınlanıyor...' : 'Yayınla'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Dil Seçimi
              </label>
              <div className="flex gap-2">
                {(['tr', 'nl', 'en'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all border ${
                      language === lang
                        ? 'bg-[#2AB7CA] text-white border-[#2AB7CA]'
                        : 'bg-white text-slate-600 border-brand-divider hover:border-[#2AB7CA]'
                    }`}
                  >
                    {lang === 'tr' ? 'Türkçe' : lang === 'nl' ? 'Nederlands' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Başlık ({language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : 'EN'})
                </label>
                <input
                  type="text"
                  value={project.translations[language].title}
                  onChange={(e) => handleTitleChange(language, e.target.value)}
                  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="Proje başlığı girin..."
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Kategori
                </label>
                <div className="flex gap-2">
                  <select
                    value={project.translations[language].category}
                    onChange={(e) => {
                      const newProject = { ...project };
                      newProject.translations[language].category = e.target.value;
                      const selectedCategory = categories.find(c => c.translations[language].name === e.target.value);
                      if (selectedCategory) {
                        newProject.categorySlug = selectedCategory.slug;
                      }
                      setProject(newProject);
                    }}
                    className="flex-1 px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  >
                    <option value="">Kategori seçin...</option>
                    {categories.map((cat, index) => (
                      <option key={`${cat.id}-${index}-${language}`} value={cat.translations[language].name}>
                        {cat.translations[language].name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-4 bg-[#2AB7CA] text-white rounded-2xl hover:bg-[#2AB7CA]/90 transition-all"
                    title="Yeni Kategori Ekle"
                  >
                    {Icons.Add}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Açıklama ({language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : 'EN'})
              </label>
              <textarea
                value={project.translations[language].description || ''}
                onChange={(e) => {
                  const newProject = { ...project };
                  newProject.translations[language].description = e.target.value;
                  setProject(newProject);
                }}
                rows={6}
                className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all resize-none"
                placeholder="Detaylı açıklama girin..."
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Müşteri ({language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : 'EN'})
                </label>
                <input
                  type="text"
                  value={project.translations[language].client || ''}
                  onChange={(e) => {
                    const newProject = { ...project };
                    newProject.translations[language].client = e.target.value;
                    setProject(newProject);
                  }}
                  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="Müşteri adı girin..."
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  Rol ({language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : 'EN'})
                </label>
                <input
                  type="text"
                  value={project.translations[language].role || ''}
                  onChange={(e) => {
                    const newProject = { ...project };
                    newProject.translations[language].role = e.target.value;
                    setProject(newProject);
                  }}
                  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="Rol girin..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Teknoloji Stack ({language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : 'EN'})
              </label>
              <textarea
                value={(project.translations[language].techStack || []).join('\n')}
                onChange={(e) => {
                  const newProject = { ...project };
                  newProject.translations[language].techStack = e.target.value.split('\n').filter(item => item.trim());
                  setProject(newProject);
                }}
                rows={4}
                className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all resize-none"
                placeholder="Teknolojileri satır başına bir girin..."
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Uygulamalar ({language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : 'EN'})
              </label>
              <textarea
                value={(project.translations[language].applications || []).join('\n')}
                onChange={(e) => {
                  const newProject = { ...project };
                  newProject.translations[language].applications = e.target.value.split('\n').filter(item => item.trim());
                  setProject(newProject);
                }}
                rows={4}
                className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all resize-none"
                placeholder="Uygulamaları satır başına bir girin..."
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Proje Zaman Çizelgesi ({language === 'tr' ? 'TR' : language === 'nl' ? 'NL' : 'EN'})
              </label>
              <textarea
                value={project.translations[language].timeline || ''}
                onChange={(e) => {
                  const newProject = { ...project };
                  newProject.translations[language].timeline = e.target.value;
                  setProject(newProject);
                }}
                rows={4}
                className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all resize-none"
                placeholder="Proje zaman çizelgesini girin..."
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Galeri Görselleri
              </label>
              <button
                onClick={() => {
                  setMediaTarget('gallery');
                  setShowMediaLibrary(true);
                }}
                className="flex items-center gap-2 bg-[#2AB7CA] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#2AB7CA]/90 transition-all"
              >
                {Icons.Add}
                Görsel Ekle
              </button>
            </div>
            {project.galleryImages && project.galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.galleryImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      className="w-full aspect-square object-cover rounded-2xl"
                      alt={`Gallery ${index + 1}`}
                    />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 bg-[#FE4A49] text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {Icons.Close}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-brand-divider rounded-2xl">
                <p className="text-slate-400 font-medium">
                  Henüz galeri görseli eklenmedi.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Kapak Görseli
              </label>
              {project.coverImage ? (
                <div className="relative group">
                  <img
                    src={project.coverImage}
                    className="w-full aspect-[4/5] object-cover rounded-2xl"
                    alt="Cover"
                  />
                  <button
                    onClick={() => {
                      setMediaTarget('cover');
                      setShowMediaLibrary(true);
                    }}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2"
                  >
                    {Icons.Edit}
                    Değiştir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMediaTarget('cover');
                    setShowMediaLibrary(true);
                  }}
                  className="w-full aspect-[4/5] border-2 border-dashed border-brand-divider rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-[#2AB7CA] hover:text-[#2AB7CA] transition-all"
                >
                  {Icons.Image}
                  <span className="text-sm font-medium">Görsel Seç</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Slug (URL)
              </label>
              <input
                type="text"
                value={project.slug}
                onChange={(e) => setProject({ ...project, slug: e.target.value })}
                className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                placeholder="proje-slug"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Yıl
              </label>
              <input
                type="text"
                value={project.year}
                onChange={(e) => setProject({ ...project, year: e.target.value })}
                className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                placeholder="2024"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-brand-bg rounded-2xl">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Öne Çıkar
                </label>
                <p className="text-slate-500 text-sm mt-1">
                  Ana sayfada gösterilsin mi?
                </p>
              </div>
              <button
                onClick={() => setProject({ ...project, isFeatured: !project.isFeatured })}
                className={`w-16 h-8 rounded-full transition-colors ${
                  project.isFeatured ? 'bg-[#2AB7CA]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                    project.isFeatured ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMediaLibrary && (
        <MediaLibrary
          onSelect={handleImageSelect}
          onClose={() => setShowMediaLibrary(false)}
        />
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Yeni Kategori Ekle</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {Icons.Close}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Türkçe Adı
                </label>
                <input
                  type="text"
                  value={newCategory.tr}
                  onChange={(e) => setNewCategory({ ...newCategory, tr: e.target.value })}
                  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="Kategori adı..."
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Nederlands Adı
                </label>
                <input
                  type="text"
                  value={newCategory.nl}
                  onChange={(e) => setNewCategory({ ...newCategory, nl: e.target.value })}
                  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="Categorie naam..."
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  English Name
                </label>
                <input
                  type="text"
                  value={newCategory.en}
                  onChange={(e) => setNewCategory({ ...newCategory, en: e.target.value })}
                  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="Category name..."
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full px-6 py-4 bg-brand-bg border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="kategori-slug"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-6 py-4 bg-[#2AB7CA] text-white rounded-2xl font-bold hover:bg-[#2AB7CA]/90 transition-all"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsDetail;
