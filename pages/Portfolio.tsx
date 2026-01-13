
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryType } from '../types';
import { useLanguage } from '../LanguageContext';

type Project = {
  id: string;
  slug: string;
  year?: string;
  coverImage?: string;
  isFeatured: boolean;
  translations: {
    tr: { title: string; category: string };
    nl: { title: string; category: string };
    en: { title: string; category: string };
  };
};

const Portfolio = () => {
  const { language } = useLanguage();
  const withLang = (path: string) => `${path}?lang=${language}`;
  const [activeFilter, setActiveFilter] = useState<CategoryType | 'Hepsi'>('Hepsi');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        const response = await fetch(`${API_BASE}/api/public/projects`);
        const data = await response.json();
        const mapped: Project[] = data.map((p: any) => ({
          id: String(p._id),
          slug: p.slug,
          year: p.year,
          coverImage: p.coverImage,
          isFeatured: !!p.isFeatured,
          translations: p.translations
        }));
        setProjects(mapped);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        const response = await fetch(`${API_BASE}/api/public/categories`);
        const data = await response.json();
        const cats: string[] = data.map((c: any) => c.translations[language].name);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchProjects();
    fetchCategories();
  }, [language]);

  const filters: (CategoryType | 'Hepsi')[] = ['Hepsi', ...categories];

  const filteredProjects = activeFilter === 'Hepsi' 
    ? projects 
    : projects.filter(p => p.translations[language].category === activeFilter);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-turquoise border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="max-w-3xl mb-20">
        <h1 className="text-6xl md:text-8xl font-black uppercase mb-8 leading-[0.85] font-display italic">
          Seçili <br/><span className="text-brand-turquoise not-italic">İşler</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg font-sans">Marka ruhunu yakalayan, tipografi odaklı çalışmalarımız.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-20 font-sans">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeFilter === f 
                ? 'bg-brand-red text-white shadow-xl shadow-brand-red/20 border-transparent' 
                : 'bg-white border border-brand-light-gray text-gray-400 hover:border-brand-turquoise hover:text-brand-turquoise'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredProjects.map(project => (
           <Link to={withLang(`/work/${project.slug}`)} key={project.id} className="group flex flex-col gap-6">
             <div className="aspect-[3/4] overflow-hidden rounded-[2rem] bg-brand-light-gray relative">
                <img src={project.coverImage || 'https://via.placeholder.com/400x500'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={project.translations[language].title} />
                {project.isFeatured && (
                  <div className="absolute top-4 left-4 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                    Öne Çıkan
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="material-symbols-outlined text-white text-6xl">add</span>
                </div>
             </div>
             <div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red mb-2 block font-sans">{project.translations[language].category}</span>
               <h3 className="text-3xl font-black uppercase tracking-tight font-display">{project.translations[language].title}</h3>
             </div>
           </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-400 font-medium text-lg">
            {activeFilter === 'Hepsi' ? 'Henüz proje eklenmemiş.' : 'Bu kategoride proje bulunamadı.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
