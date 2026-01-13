import React from 'react';
import { useLanguage } from '../../LanguageContext';

export default function Process() {
  const { t, language } = useLanguage();
  return (
    <section className="py-32 bg-brand-off-white">
      <div className="max-w-7xl mx-auto px-6">
         <div className="max-w-2xl mb-20">
           <h2 className="text-5xl font-black uppercase mb-6 leading-tight font-display italic">
             {t('process.title')} <span className="text-brand-red not-italic">{t('process.title.red')}</span>
           </h2>
           <p className="text-gray-500 font-medium text-lg leading-relaxed">{t('process.subtitle')}</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 font-sans">
           {[
             { n: '01', t: 'Discovery', nl: 'Briefing en onderzoek.', tr: 'Briefing ve araştırma.', en: 'Briefing and research.', c: 'bg-brand-turquoise' },
             { n: '02', t: 'Ideation', nl: 'Concept en schetsen.', tr: 'Konsept ve eskiz.', en: 'Concept and sketches.', c: 'bg-brand-yellow' },
             { n: '03', t: 'Design', nl: 'Visualisatie en uitvoering.', tr: 'Görselleştirme ve uygulama.', en: 'Visualization and execution.', c: 'bg-brand-red' },
             { n: '04', t: 'Delivery', nl: 'Finale bestanden en support.', tr: 'Final dosyalar ve destek.', en: 'Final files and support.', c: 'bg-black' }
           ].map(step => (
             <div key={step.n} className="relative group">
               <div className={`w-12 h-1 px-0.5 ${step.c} mb-8`}></div>
               <span className="text-[10px] font-black text-gray-400 mb-4 block tracking-[0.2em]">{step.n}</span>
               <h4 className="text-2xl font-black uppercase mb-4 font-display">{step.t}</h4>
               <p className="text-gray-500 text-sm font-medium leading-relaxed">{(step as any)[language]}</p>
             </div>
           ))}
         </div>
      </div>
    </section>
  );
}
