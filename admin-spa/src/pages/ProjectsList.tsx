import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../constants';
import { UserRole } from '../types';
import { useAuth } from '../App';
import { apiService } from '../services/api';

type Project = {
  id: string;
  slug: string;
  year?: string;
  coverImage?: string;
  isFeatured: boolean;
  published: boolean;
  isDeleted: boolean;
  translations: {
    tr: { title: string; category: string };
    nl: { title: string; category: string };
    en: { title: string; category: string };
  };
  categorySlug?: string;
  updatedAt: string;
  createdAt: string;
};

const ProjectsList: React.FC = () => {
  const { auth } = useAuth();
  const [language, setLanguage] = useState<'tr' | 'nl' | 'en'>('tr');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    apiService.get('/admin/projects').then(items => {
      const mapped: Project[] = items.map((p: any) => ({
        id: String(p._id),
        slug: p.slug,
        year: p.year,
        coverImage: p.coverImage,
        isFeatured: !!p.isFeatured,
        published: !!p.published,
        isDeleted: !!p.isDeleted,
        translations: p.translations,
        categorySlug: p.categorySlug,
        updatedAt: p.updatedAt,
        createdAt: p.createdAt
      }));
      setProjects(mapped);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    apiService.get('/admin/categories').then(items => {
      setCategories(items);
    }).catch(() => {});
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.translations[language].title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || p.translations[language].category === categoryFilter || p.categorySlug === categoryFilter;
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'published' ? p.published :
        !p.published;
      const matchesDeleted = !p.isDeleted;
      return matchesSearch && matchesCategory && matchesStatus && matchesDeleted;
    });
  }, [projects, searchTerm, categoryFilter, statusFilter, language]);

  const togglePublish = (id: string, next: boolean) => {
    if (auth.user?.role !== UserRole.OWNER) {
       alert("Sadece Owner yayınlayabilir/kaldırabilir.");
       return;
    }
    apiService.patch(`/admin/projects/${id}/publish`, { published: next }).then(() => {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, published: next, updatedAt: new Date().toISOString() } : p));
    }).catch(() => {});
  };

  const softDelete = (id: string) => {
    if (auth.user?.role === UserRole.EDITOR) {
      alert("Editörler projeleri silemez.");
      return;
    }
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    apiService.delete(`/admin/projects/${id}`).then(() => {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true, published: false } : p));
    }).catch(() => {});
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(p => {
      if (!p.isDeleted) {
        cats.add(p.translations[language].category);
      }
    });
    return Array.from(cats).sort();
  }, [projects, language]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Proje Yönetimi</h1>
          <p className="text-slate-500 mt-2 font-medium">Portfolyo projelerinizi yönetin.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as 'tr' | 'nl' | 'en')}
            className="px-4 py-2 rounded-xl text-sm font-bold border border-brand-divider bg-white text-slate-600"
          >
            <option value="tr">Türkçe</option>
            <option value="nl">Nederlands</option>
            <option value="en">English</option>
          </select>
          <Link to="/projects/new" className="flex items-center gap-2 bg-[#2AB7CA] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#2AB7CA]/20 hover:bg-[#2AB7CA]/90 transition-all">
            {Icons.Add}
            Yeni Proje
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {Icons.Search}
            </span>
            <input 
              type="text" 
              placeholder="Proje ara..." 
              className="w-full pl-12 pr-4 py-3 bg-brand-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm font-bold border border-brand-divider bg-white text-slate-600"
            >
              <option value="">Tüm Kategoriler</option>
              {uniqueCategories.map((cat, index) => (
                <option key={`${cat}-${index}`} value={cat}>{cat}</option>
              ))}
            </select>
            <button 
              onClick={() => setStatusFilter(statusFilter === 'all' ? 'published' : statusFilter === 'published' ? 'draft' : 'all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                statusFilter === 'all' 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : statusFilter === 'published'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-slate-600 border-brand-divider'
              }`}
            >
              {statusFilter === 'all' ? 'Tümü' : statusFilter === 'published' ? 'Yayınlanan' : 'Taslak'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group relative bg-white rounded-3xl overflow-hidden border border-brand-divider hover:shadow-xl transition-all">
              <div className="aspect-[4/5] overflow-hidden bg-brand-light-gray relative">
                <img 
                  src={project.coverImage || 'https://via.placeholder.com/400x500'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={project.translations[language].title}
                />
                {project.isFeatured && (
                  <div className="absolute top-4 left-4 bg-[#FE4A49] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    Öne Çıkan
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${
                    project.published ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-brand-bg'
                  }`}>
                    {project.published ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FE4A49] block font-sans">
                  {project.translations[language].category}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight font-display line-clamp-2">
                  {project.translations[language].title}
                </h3>
                {project.year && (
                  <p className="text-sm text-slate-500 font-medium">
                    {project.year}
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-brand-divider">
                  <span className="text-xs text-slate-400">
                    {new Date(project.updatedAt).toLocaleDateString('tr-TR')}
                  </span>
                  <div className="flex items-center gap-2">
                    {auth.user?.role === UserRole.OWNER && (
                      <button 
                        onClick={() => togglePublish(project.id, !project.published)}
                        className={`p-2 rounded-lg transition-colors ${
                          project.published ? 'text-slate-400 hover:text-[#FE4A49]' : 'text-[#2AB7CA] hover:bg-[#2AB7CA]/10'
                        }`}
                        title={project.published ? 'Yayından kaldır' : 'Yayınla'}
                      >
                        {Icons.Publish}
                      </button>
                    )}
                    <Link
                      to={`/projects/${project.id}`}
                      className="p-2 text-slate-400 hover:text-[#2AB7CA] hover:bg-[#2AB7CA]/10 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      {Icons.Edit}
                    </Link>
                    {auth.user?.role !== UserRole.EDITOR && (
                      <button 
                        onClick={() => softDelete(project.id)} 
                        className="p-2 text-slate-400 hover:text-[#FE4A49] hover:bg-[#FE4A49]/10 rounded-lg transition-colors"
                        title="Sil"
                      >
                        {Icons.Delete}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium text-lg">
              {searchTerm || categoryFilter || statusFilter !== 'all' 
                ? 'Aramanıza uygun proje bulunamadı.' 
                : 'Henüz proje eklenmemiş.'}
            </p>
            {!searchTerm && !categoryFilter && statusFilter === 'all' && (
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-2 mt-6 bg-[#2AB7CA] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#2AB7CA]/20 hover:bg-[#2AB7CA]/90 transition-all"
              >
                {Icons.Add}
                İlk Projeyi Ekle
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
