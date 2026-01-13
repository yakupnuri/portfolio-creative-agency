import React from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../../constants';
import { useLanguage } from '../../LanguageContext';

export default function Featured() {
  const { t, language } = useLanguage();
  const withLang = (path: string) => `${path}?lang=${language}`;
  return (
    <section className="bg-white py-32 border-y border-brand-light-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-brand-red font-black text-xs uppercase tracking-[0.2em] mb-4 block underline decoration-brand-yellow decoration-2 underline-offset-4 font-sans">{t('featured.title')}</span>
            <h2 className="text-5xl font-black uppercase font-display italic">{t('nav.work')}</h2>
          </div>
          <Link to={withLang('/work')} className="font-black uppercase text-xs tracking-widest hover:text-brand-turquoise border-b-2 border-brand-turquoise pb-2 font-sans">{t('featured.all')}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {PROJECTS.slice(0, 2).map((project, i) => (
            <Link to={withLang(`/work/${project.slug}`)} key={project.id} className={`group block ${i % 2 !== 0 ? 'md:mt-20' : ''}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-brand-light-gray relative mb-6">
                <img src={project.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={project.translations[language].title} />
                <div className="absolute top-6 left-6 flex gap-2 font-sans">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase">{project.translations[language].category}</span>
                </div>
              </div>
              <h3 className="text-3xl font-black uppercase mb-2 font-display">{project.translations[language].title}</h3>
              <p className="text-gray-500 font-bold text-sm tracking-wide font-sans">{project.year} — {project.translations[language].client}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
