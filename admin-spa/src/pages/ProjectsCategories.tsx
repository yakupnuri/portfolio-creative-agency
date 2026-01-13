import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';
import { UserRole } from '../types';
import { useAuth } from '../App';
import { apiService } from '../services/api';

type Category = {
  id: string;
  slug: string;
  isActive: boolean;
  order: number;
  translations: {
    tr: { name: string };
    nl: { name: string };
    en: { name: string };
  };
  createdAt: string;
  updatedAt: string;
};

const ProjectsCategories: React.FC = () => {
  const { auth } = useAuth();
  const [language, setLanguage] = useState<'tr' | 'nl' | 'en'>('tr');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    slug: '',
    order: 0,
    translations: {
      tr: { name: '' },
      nl: { name: '' },
      en: { name: '' }
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    apiService.get('/admin/categories').then(items => {
      const mapped: Category[] = items.map((c: any) => ({
        id: String(c._id),
        slug: c.slug,
        isActive: !!c.isActive,
        order: c.order || 0,
        translations: c.translations,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }));
      setCategories(mapped.sort((a, b) => a.order - b.order));
    }).catch(() => {});
  };

  const handleCreate = async () => {
    if (!newCategory.slug.trim()) {
      alert('Lütfen slug alanını doldurun.');
      return;
    }
    if (!newCategory.translations.tr.name.trim() || !newCategory.translations.nl.name.trim() || !newCategory.translations.en.name.trim()) {
      alert('Lütfen tüm dillerde kategori adını doldurun.');
      return;
    }
    try {
      await apiService.post('/admin/categories', newCategory);
      setNewCategory({
        slug: '',
        order: 0,
        translations: { tr: { name: '' }, nl: { name: '' }, en: { name: '' } }
      });
      fetchCategories();
      alert('Kategori başarıyla oluşturuldu!');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Oluşturma başarısız oldu!');
    }
  };

  const handleUpdate = async (id: string, data: Partial<Category>) => {
    try {
      await apiService.patch(`/admin/categories/${id}`, data);
      fetchCategories();
      setEditingId(null);
      alert('Kategori başarıyla güncellendi!');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Güncelleme başarısız oldu!');
    }
  };

  const handleDelete = async (id: string) => {
    if (auth.user?.role !== UserRole.OWNER) {
      alert('Sadece Owner kategorileri silebilir.');
      return;
    }
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;
    try {
      await apiService.delete(`/admin/categories/${id}`);
      fetchCategories();
      alert('Kategori başarıyla silindi!');
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Silme başarısız oldu!');
    }
  };

  const toggleActive = (id: string, isActive: boolean) => {
    handleUpdate(id, { isActive });
  };

  const updateOrder = (id: string, newOrder: number) => {
    handleUpdate(id, { order: newOrder });
  };

  const filteredCategories = categories.filter(c =>
    c.translations[language].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kategori Yönetimi</h1>
          <p className="text-slate-500 mt-2 font-medium">Proje kategorilerini yönetin.</p>
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
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-brand-divider shadow-sm space-y-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {Icons.Search}
          </span>
          <input 
            type="text" 
            placeholder="Kategori ara..." 
            className="w-full pl-12 pr-4 py-3 bg-brand-bg border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-brand-bg p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">Yeni Kategori Ekle</h3>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCategory.slug}
                onChange={(e) => {
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '');
                  setNewCategory({ ...newCategory, slug: value });
                }}
                className={`w-full px-4 py-3 bg-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all ${
                  !newCategory.slug.trim() ? 'ring-2 ring-red-300' : ''
                }`}
                placeholder="kategori-slug"
              />
              <p className="text-xs text-slate-400 mt-1">
                Sadece küçük harf, rakam ve tire (-) kullanabilirsiniz.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                Sıralama
              </label>
              <input
                type="number"
                value={newCategory.order}
                onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                placeholder="0"
              />
            </div>

            {(['tr', 'nl', 'en'] as const).map(lang => (
              <div key={lang}>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Kategori Adı ({lang === 'tr' ? 'TR' : lang === 'nl' ? 'NL' : 'EN'})
                </label>
                <input
                  type="text"
                  value={newCategory.translations[lang].name}
                  onChange={(e) => {
                    const updated = { ...newCategory };
                    updated.translations[lang].name = e.target.value;
                    setNewCategory(updated);
                  }}
                  className="w-full px-4 py-3 bg-white border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                  placeholder="Kategori adı girin..."
                />
              </div>
            ))}

            <button
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 bg-[#2AB7CA] text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-[#2AB7CA]/20 hover:bg-[#2AB7CA]/90 transition-all"
            >
              {Icons.Add}
              Kategori Oluştur
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">Mevcut Kategoriler</h3>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 bg-brand-bg rounded-2xl">
                <p className="text-slate-400 font-medium">
                  {searchTerm ? 'Aramanıza uygun kategori bulunamadı.' : 'Henüz kategori eklenmemiş.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCategories.map((category, index) => (
                  <div 
                    key={category.id}
                    className="bg-white p-4 rounded-xl border border-brand-divider hover:border-[#2AB7CA] transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="number"
                            value={category.order}
                            onChange={(e) => updateOrder(category.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-brand-bg border-none rounded-lg text-xs font-bold text-center"
                            min="0"
                          />
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                            category.isActive ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-brand-bg'
                          }`}>
                            {category.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            /{category.slug}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {category.translations[language].name}
                        </p>
                        <div className="flex gap-4 mt-1 text-xs text-slate-500">
                          <span>TR: {category.translations.tr.name}</span>
                          <span>NL: {category.translations.nl.name}</span>
                          <span>EN: {category.translations.en.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(category.id, !category.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            category.isActive ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={category.isActive ? 'Pasife al' : 'Aktife al'}
                        >
                          {category.isActive ? Icons.CheckCircle : Icons.CheckCircle}
                        </button>
                        <button
                          onClick={() => setEditingId(editingId === category.id ? null : category.id)}
                          className="p-2 text-slate-400 hover:text-[#2AB7CA] hover:bg-[#2AB7CA]/10 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          {Icons.Edit}
                        </button>
                        {auth.user?.role === UserRole.OWNER && (
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-slate-400 hover:text-[#FE4A49] hover:bg-[#FE4A49]/10 rounded-lg transition-colors"
                            title="Sil"
                          >
                            {Icons.Delete}
                          </button>
                        )}
                      </div>
                    </div>

                    {editingId === category.id && (
                      <div className="mt-4 pt-4 border-t border-brand-divider space-y-3">
                        {(['tr', 'nl', 'en'] as const).map(lang => (
                          <div key={lang}>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                              Ad ({lang === 'tr' ? 'TR' : lang === 'nl' ? 'NL' : 'EN'})
                            </label>
                            <input
                              type="text"
                              defaultValue={category.translations[lang].name}
                              onBlur={(e) => {
                                handleUpdate(category.id, {
                                  translations: {
                                    ...category.translations,
                                    [lang]: { ...category.translations[lang], name: e.target.value }
                                  }
                                });
                              }}
                              className="w-full px-4 py-2 bg-brand-bg border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#2AB7CA]/20 transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCategories;
