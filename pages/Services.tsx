
import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { useLanguage } from '../LanguageContext';

const Services = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 font-sans">
      <div className="max-w-3xl mb-24">
        <h1 className="text-6xl md:text-8xl font-black uppercase mb-8 leading-[0.85] font-display italic">
          Neler <br/><span className="text-brand-red not-italic">Sunuyoruz?</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg">Markanızın ihtiyacı olan görsel dili kurmak için profesyonel tasarım hizmetleri.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SERVICES.map(s => (
          <div key={s.id} className="bg-white rounded-[2.5rem] p-12 border border-brand-light-gray hover:border-brand-turquoise transition-all group flex flex-col md:flex-row gap-10 items-start">
             <div className="size-20 bg-brand-turquoise/10 rounded-3xl flex items-center justify-center text-brand-turquoise group-hover:bg-brand-turquoise group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-4xl">{s.icon}</span>
             </div>
             <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-black uppercase font-display">{s.translations[language].title}</h3>
                  <span className="text-xs font-black text-gray-400 bg-brand-off-white px-3 py-1 rounded-full font-sans tracking-widest">{s.priceStart}+</span>
                </div>
                <p className="text-gray-500 font-medium leading-relaxed mb-8 font-sans">{s.translations[language].description}</p>
                <Link to="/brief">
                  <button className="flex items-center gap-2 font-black uppercase text-xs tracking-[0.2em] group-hover:text-brand-turquoise transition-colors font-sans">
                    Hemen Brief Gönder <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </Link>
             </div>
          </div>
        ))}
      </div>

      <div className="mt-32 bg-brand-yellow rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 text-black font-sans">
         <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight tracking-tighter font-display italic">İhtiyacınız Listede Yok mu?</h2>
            <p className="font-bold text-lg">Özel projeler ve uzun vadeli iş birlikleri için iletişime geçin.</p>
         </div>
         <Link to="/contact">
            <button className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Soru Sor</button>
         </Link>
      </div>
    </div>
  );
};

export default Services;
