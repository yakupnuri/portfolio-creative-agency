
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

type Project = {
  id: string;
  slug: string;
  year?: string;
  coverImage?: string;
  galleryImages?: string[];
  isFeatured: boolean;
  translations: {
    tr: { title: string; category: string; description?: string; client?: string; role?: string };
    nl: { title: string; category: string; description?: string; client?: string; role?: string };
    en: { title: string; category: string; description?: string; client?: string; role?: string };
  };
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        const response = await fetch(`${API_BASE}/api/public/projects/${slug}`);
        const data = await response.json();
        if (!data || data.error) {
          setProject(null);
        } else {
          setProject({
            id: String(data._id),
            slug: data.slug,
            year: data.year,
            coverImage: data.coverImage,
            galleryImages: data.galleryImages,
            isFeatured: !!data.isFeatured,
            translations: data.translations
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-turquoise border-t-transparent"></div>
      </div>
    );
  }

  if (!project) return <Navigate to="/work" />;

  const tContent = project.translations[language];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Detail Hero */}
      <section className="bg-white border-b border-brand-light-gray pt-20 pb-40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-brand-red font-black text-xs uppercase tracking-[0.3em] mb-4 block font-sans">{tContent.category}</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9] font-display italic">{tContent.title}</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12 font-sans">{tContent.description}</p>
            
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-brand-light-gray font-sans">
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 block mb-1 tracking-widest">Müşteri</span>
                <span className="font-black text-sm uppercase">{tContent.client || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-gray-400 block mb-1 tracking-widest">Yıl</span>
                <span className="font-black text-sm uppercase">{project.year || '-'}</span>
              </div>
              {tContent.role && (
                <div className="col-span-2">
                  <span className="text-[10px] font-black uppercase text-gray-400 block mb-1 tracking-widest">Rol</span>
                  <span className="font-black text-sm uppercase">{tContent.role}</span>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-7">
             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-brand-light-gray shadow-2xl">
                <img src={project.coverImage || 'https://via.placeholder.com/800x1000'} className="w-full h-full object-cover" alt={tContent.title} />
             </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black uppercase mb-16 font-display">Galeri</h2>
        {project.galleryImages && project.galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {project.galleryImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-[3rem] overflow-hidden">
                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i + 1}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem]">
            <p className="text-gray-400 font-medium">Henüz galeri görseli eklenmedi.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-40 text-center px-6">
         <h2 className="text-4xl md:text-7xl font-black uppercase mb-10 tracking-tighter font-display italic">
           Benzer Bir Hikaye <br/><span className="text-brand-turquoise not-italic">Yazalım mı?</span>
         </h2>
         <Link to="/brief">
           <button className="bg-brand-red text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-brand-red/20 font-sans">Projeyi Başlat</button>
         </Link>
      </section>
    </div>
  );
};

export default ProjectDetail;
