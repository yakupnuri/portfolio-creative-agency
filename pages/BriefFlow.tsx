
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefData } from '../types';
import { SERVICES } from '../constants';
import { useLanguage } from '../LanguageContext';

const BriefFlow = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BriefData>>({
    serviceId: SERVICES[0].id
  });
  const [submitting, setSubmitting] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      serviceType: formData.serviceId || '',
      name: formData.fullName || '',
      email: formData.email || '',
      phone: formData.phone,
      company: formData.company,
      budgetRange: formData.budget,
      deadline: formData.deadline,
      message: formData.message,
      serviceSpecificData: formData.brandName ? { brandName: formData.brandName } : undefined
    };
    setSubmitting(true);
    fetch(`${API_BASE}/api/brief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('failed');
        return r.json();
      })
      .then(() => setStep(4))
      .catch(() => alert(language === 'nl' ? 'Verzenden mislukt.' : language === 'tr' ? 'Gönderim başarısız.' : 'Submission failed.'))
      .finally(() => setSubmitting(false));
  };

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-40 text-center animate-in zoom-in duration-500">
        <div className="size-24 bg-brand-turquoise rounded-full mx-auto flex items-center justify-center text-white mb-8">
           <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>
        <h1 className="text-6xl font-black uppercase mb-6 font-display italic">{t('brief.success.title')}</h1>
        <p className="text-gray-600 text-xl font-medium leading-relaxed mb-10 font-sans">
          {t('brief.success.text')}
        </p>
        <button 
          onClick={() => navigate(`/?lang=${language}`)}
          className="bg-brand-red text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-red/20 font-sans"
        >
          {language === 'nl' ? 'Terug naar Home' : language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
        </button>
      </div>
    );
  }

  const currentService = SERVICES.find(s => s.id === formData.serviceId);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="mb-16">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display italic leading-none">
            {t('brief.title')} <span className="text-brand-turquoise underline decoration-brand-yellow decoration-2 underline-offset-4 not-italic">{t('brief.title.blue')}</span>
          </h1>
          <span className="text-xs font-black text-gray-400 tracking-widest font-sans uppercase">{t('brief.step')} {step} / 3</span>
        </div>
        <div className="h-2 w-full bg-brand-light-gray rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-turquoise transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-brand-light-gray p-8 md:p-16 shadow-2xl shadow-gray-100 font-sans">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-3xl font-black uppercase mb-10 font-display italic">{language === 'nl' ? 'Wat gaan we maken?' : language === 'tr' ? 'Ne Üretiyoruz?' : 'What are we making?'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {SERVICES.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setFormData({ ...formData, serviceId: s.id })}
                  className={`p-10 rounded-3xl border-2 transition-all cursor-pointer group flex items-center gap-6 ${
                    formData.serviceId === s.id 
                      ? 'border-brand-turquoise bg-brand-turquoise/5' 
                      : 'border-brand-light-gray hover:border-brand-turquoise'
                  }`}
                >
                  <div className={`size-16 rounded-2xl flex items-center justify-center transition-colors ${formData.serviceId === s.id ? 'bg-brand-turquoise text-white' : 'bg-brand-off-white text-gray-400'}`}>
                    <span className="material-symbols-outlined text-4xl">{s.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-xl mb-1 font-display tracking-wide">{s.translations[language].title}</h3>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{language === 'nl' ? 'Vanaf' : language === 'tr' ? 'Başlayan fiyat' : 'From'} {s.priceStart}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 flex justify-end">
               <button type="button" onClick={nextStep} className="bg-brand-red text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-red/20 hover:scale-105 transition-all">
                 {t('brief.next')}
               </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
            <h2 className="text-3xl font-black uppercase mb-10 font-display italic">{language === 'nl' ? 'Project Details' : language === 'tr' ? 'Proje Detayları' : 'Project Details'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{language === 'nl' ? 'Naam' : language === 'tr' ? 'Ad Soyad' : 'Full Name'} *</label>
                <input required type="text" className="w-full h-14 bg-brand-off-white border-0 rounded-xl focus:ring-2 ring-brand-turquoise px-4 font-bold" 
                  value={formData.fullName || ''} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{language === 'nl' ? 'E-mail' : 'Email'} *</label>
                <input required type="email" className="w-full h-14 bg-brand-off-white border-0 rounded-xl focus:ring-2 ring-brand-turquoise px-4 font-bold" 
                  value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{language === 'nl' ? 'Budgetbereik' : language === 'tr' ? 'Bütçe Aralığı' : 'Budget Range'}</label>
                <select className="w-full h-14 bg-brand-off-white border-0 rounded-xl focus:ring-2 ring-brand-turquoise px-4 font-bold appearance-none"
                  value={formData.budget || ''} onChange={e => setFormData({...formData, budget: e.target.value})}>
                  <option>€500 - €1.500</option>
                  <option>€1.500 - €3.000</option>
                  <option>€3.000 - €5.000</option>
                  <option>€5.000+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Deadline</label>
                <input type="date" className="w-full h-14 bg-brand-off-white border-0 rounded-xl focus:ring-2 ring-brand-turquoise px-4 font-bold"
                  value={formData.deadline || ''} onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              
              {formData.serviceId === 'logo' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{language === 'nl' ? 'Merknaam en Sector' : language === 'tr' ? 'Marka Adı ve Sektör' : 'Brand Name and Sector'}</label>
                  <input type="text" placeholder="e.g. Vortex Tech - Software" className="w-full h-14 bg-brand-off-white border-0 rounded-xl focus:ring-2 ring-brand-turquoise px-4 font-bold"
                    value={formData.brandName || ''} onChange={e => setFormData({...formData, brandName: e.target.value})} />
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{language === 'nl' ? 'Uw Behoeften / Bericht' : language === 'tr' ? 'İhtiyaçlar / Mesaj' : 'Your Needs / Message'}</label>
                <textarea className="w-full h-40 bg-brand-off-white border-0 rounded-2xl focus:ring-2 ring-brand-turquoise p-4 font-bold" 
                  placeholder={language === 'nl' ? 'Vertel kort over uw project...' : language === 'tr' ? 'Projenizden bahsedin...' : 'Briefly describe your project...'}
                  value={formData.message || ''} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
            </div>

            <div className="mt-16 flex justify-between items-center">
               <button type="button" onClick={prevStep} className="font-black uppercase text-xs tracking-[0.3em] border-b-2 border-black pb-1 hover:text-brand-turquoise hover:border-brand-turquoise transition-all">
                 {t('brief.prev')}
               </button>
               <button type="button" onClick={nextStep} className="bg-brand-red text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-red/20" disabled={!formData.fullName || !formData.email}>
                 {t('brief.summary')}
               </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-3xl font-black uppercase mb-10 font-display italic">{language === 'nl' ? 'Laatste Controle' : language === 'tr' ? 'Son Kontrol' : 'Final Check'}</h2>
            <div className="bg-brand-off-white rounded-3xl p-8 space-y-6">
              <div className="flex justify-between border-b border-brand-light-gray pb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{language === 'nl' ? 'Dienst' : language === 'tr' ? 'Hizmet' : 'Service'}</span>
                <span className="font-black uppercase font-display text-xl">{currentService?.translations[language].title}</span>
              </div>
              <div className="flex justify-between border-b border-brand-light-gray pb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{language === 'nl' ? 'Klant' : language === 'tr' ? 'Müşteri' : 'Client'}</span>
                <span className="font-black">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-brand-light-gray pb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</span>
                <span className="font-black">{formData.budget}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{language === 'nl' ? 'Samenvatting' : 'Summary'}</span>
                <p className="text-sm text-gray-600 font-bold italic">"{formData.message}"</p>
              </div>
            </div>

            <div className="mt-16 flex justify-between items-center">
               <button type="button" onClick={prevStep} className="font-black uppercase text-xs tracking-widest border-b-2 border-black pb-1 hover:text-brand-turquoise transition-all">{language === 'nl' ? 'Aanpassen' : 'Edit'}</button>
               <button type="submit" className="bg-brand-turquoise text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-turquoise/20 disabled:opacity-60" disabled={submitting}>
                 {t('brief.submit')}
               </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default BriefFlow;
