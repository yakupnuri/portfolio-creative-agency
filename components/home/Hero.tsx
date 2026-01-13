import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../LanguageContext';

export default function Hero() {
  const { t, language } = useLanguage();
  const withLang = (path: string) => `${path}?lang=${language}`;
  
  type Slide = {
    url: string;
    placement: "background"|"left"|"right";
    duration: number;
    isActive: boolean;
    title?: string;
    titleHighlight?: string;
    highlightNewLine?: boolean;
    titleSmall?: boolean;
    subtitle?: string;
    description?: string;
    cta?: string;
    ctaUrl?: string;
    cta2?: string;
    cta2Url?: string;
    textAlign?: 'left' | 'center' | 'right';
    textColor?: string;
    bgColor?: string;
    margins?: { top?: number; right?: number; bottom?: number; left?: number };
  };

  const [slides, setSlides] = useState<Slide[]>([]);
  const [active, setActive] = useState<boolean>(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/public/content/home_hero`).then(r => r.json()).then((d: any) => {
      setActive(typeof d.active === 'boolean' ? d.active : true);
      
      const list = (d.slides || []).map((s: any) => ({
        url: s.url,
        duration: s.duration || 5,
        placement: (s.placement || 'background'),
        isActive: s.isActive !== false,
        margins: s.margins,
        
        // Map fields with fallback to global legacy fields
        title: s.title !== undefined ? s.title : (d.title || ''),
        titleHighlight: s.titleHighlight !== undefined ? s.titleHighlight : (d.titleHighlight || t('hero.title.highlight')),
        highlightNewLine: s.highlightNewLine !== undefined ? s.highlightNewLine : (d.highlightNewLine || false),
        titleSmall: s.titleSmall !== undefined ? s.titleSmall : (d.titleSmall || false),
        subtitle: s.subtitle !== undefined ? s.subtitle : (d.subtitle || ''),
        description: s.description !== undefined ? s.description : (d.description || ''),
        cta: s.cta !== undefined ? s.cta : (d.cta || ''),
        ctaUrl: s.ctaUrl !== undefined ? s.ctaUrl : (d.ctaUrl || ''),
        cta2: s.cta2 !== undefined ? s.cta2 : (d.cta2 || ''),
        cta2Url: s.cta2Url !== undefined ? s.cta2Url : (d.cta2Url || ''),
        textAlign: s.textAlign !== undefined ? s.textAlign : (d.textAlign || 'left'),
        textColor: s.textColor !== undefined ? s.textColor : (d.textColor || ''),
        bgColor: s.bgColor !== undefined ? s.bgColor : (d.bgColor || '')
      })).filter((s: Slide) => !!s.url && s.isActive);
      
      setSlides(list);
    }).catch(() => {});
  }, [t]);

  useEffect(() => {
    if (!active) return;
    if ((slides || []).length <= 1) return;
    const currentDuration = (slides[idx]?.duration || 5) * 1000;
    const t = setTimeout(() => setIdx(prev => ((prev + 1) % slides.length)), currentDuration);
    return () => clearTimeout(t);
  }, [slides, idx, active]);

  const currentSlide = slides[idx];
  if (!active || !currentSlide) return null;

  return (
    <>
    {currentSlide.placement === 'background' ? (
      <section className="relative min-h-[70vh] md:min_h-[85vh] overflow-hidden" style={{ backgroundColor: currentSlide.bgColor || undefined }}>
        <img 
          src={currentSlide.url} 
          alt="Hero görseli" 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" 
          style={{
            paddingTop: `${currentSlide.margins?.top || 0}px`,
            paddingRight: `${currentSlide.margins?.right || 0}px`,
            paddingBottom: `${currentSlide.margins?.bottom || 0}px`,
            paddingLeft: `${currentSlide.margins?.left || 0}px`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 100%)' }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-40">
          <div className={`max-w-4xl ${currentSlide.textAlign === 'center' ? 'mx-auto text-center' : currentSlide.textAlign === 'right' ? 'ml-auto text-right' : ''}`}>
            <h1 className={`${currentSlide.titleSmall ? 'text-5xl md:text-7xl' : 'text-6xl md:text-8xl'} font-black leading-tight tracking-tighter mb-10 uppercase font-display italic`} style={{ color: currentSlide.textColor || undefined }}>
              {(currentSlide.title || t('hero.title'))}{currentSlide.highlightNewLine ? <br /> : ' '}<span className="text-brand-turquoise underline decoration-brand-yellow decoration-4 underline-offset-8 not-italic">{currentSlide.titleHighlight}</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mb-6" style={{ color: currentSlide.textColor ? `${currentSlide.textColor}CC` : undefined }}>
              {currentSlide.subtitle || t('hero.subtitle')}
            </p>
            {currentSlide.description && (
              <p className="text-base md:text-lg font-medium leading-relaxed max-w-2xl mb-12" style={{ color: currentSlide.textColor ? `${currentSlide.textColor}99` : undefined }}>
                {currentSlide.description}
              </p>
            )}
            <div className={`flex flex-wrap gap-4 font-sans ${currentSlide.textAlign === 'center' ? 'justify-center' : currentSlide.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
              <Link to={currentSlide.ctaUrl || withLang('/brief')}>
                <button className="bg-brand-red text-white px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-brand-red/30 hover:-translate-y-1 transition-all">
                  {currentSlide.cta || t('hero.cta.brief')}
                </button>
              </Link>
              {currentSlide.cta2 && (
                <Link to={currentSlide.cta2Url || withLang('/work')}>
                  <button className="bg-white/90 backdrop-blur border-2 border-white/60 px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:border-brand-turquoise transition-all">
                    {currentSlide.cta2}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    ) : (
      <section className="relative w-full h-[85vh] flex items-center bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
            {currentSlide.placement === 'left' && (
              <div className="order-1 flex justify-center">
                <div className="group relative aspect-[4/3] w-full max-w-[520px] lg:max-w-[600px] rounded-[50px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-8 ring-white/20 rotate-3 transform transition-all duration-1000 hover:rotate-0 hover:scale-105 hover:shadow-[0_35px_70px_-10px_rgba(0,0,0,0.4)] hover:ring-white/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <img src={currentSlide.url} alt="Hero görseli" className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" 
                     style={{
                        paddingTop: `${currentSlide.margins?.top || 0}px`,
                        paddingRight: `${currentSlide.margins?.right || 0}px`,
                        paddingBottom: `${currentSlide.margins?.bottom || 0}px`,
                        paddingLeft: `${currentSlide.margins?.left || 0}px`,
                     }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            )}
            <div className={`order-2 ${currentSlide.placement === 'right' ? 'md:order-1' : ''} ${currentSlide.textAlign === 'center' ? 'text-center' : currentSlide.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
              <h1 className={`${currentSlide.titleSmall ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-5xl md:text-7xl lg:text-8xl'} font-black leading-none tracking-tighter mb-6 lg:mb-10 uppercase font-display italic`} style={{ color: currentSlide.textColor || undefined }}>
                {(currentSlide.title || t('hero.title'))}{currentSlide.highlightNewLine ? <br /> : ' '}<span className="text-[#2AB7CA] underline decoration-[#FED766] decoration-4 underline-offset-8 not-italic">{currentSlide.titleHighlight}</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-xl lg:max-w-2xl mb-4 lg:mb-6" style={{ color: currentSlide.textColor ? `${currentSlide.textColor}CC` : '#475569' }}>
                {currentSlide.subtitle || t('hero.subtitle')}
              </p>
              {currentSlide.description && (
                <p className="text-base md:text-lg font-medium leading-relaxed max-w-xl lg:max-w-2xl mb-8 lg:mb-12" style={{ color: currentSlide.textColor ? `${currentSlide.textColor}99` : '#64748b' }}>
                  {currentSlide.description}
                </p>
              )}
              <div className={`flex flex-wrap gap-4 lg:gap-6 font-sans ${currentSlide.textAlign === 'center' ? 'justify-center' : currentSlide.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                <Link to={currentSlide.ctaUrl || withLang('/brief')}>
                  <button className="bg-[#FE4A49] text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-base lg:text-lg font-black uppercase tracking-widest shadow-2xl shadow-[#FE4A49]/30 hover:-translate-y-1 transition-all">
                    {currentSlide.cta || t('hero.cta.brief')}
                  </button>
                </Link>
                {currentSlide.cta2 && (
                  <Link to={currentSlide.cta2Url || withLang('/work')}>
                    <button className="bg-slate-900 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl text-base lg:text-lg font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                      {currentSlide.cta2}
                    </button>
                  </Link>
                )}
              </div>
            </div>
            {currentSlide.placement === 'right' && (
              <div className="order-3 flex justify-center">
                <div className="group relative aspect-[4/3] w-full max-w-[520px] lg:max-w-[600px] rounded-[50px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-8 ring-white/20 -rotate-3 transform transition-all duration-1000 hover:rotate-0 hover:scale-105 hover:shadow-[0_35px_70px_-10px_rgba(0,0,0,0.4)] hover:ring-white/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <img src={currentSlide.url} alt="Hero görseli" className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" 
                      style={{
                        paddingTop: `${currentSlide.margins?.top || 0}px`,
                        paddingRight: `${currentSlide.margins?.right || 0}px`,
                        paddingBottom: `${currentSlide.margins?.bottom || 0}px`,
                        paddingLeft: `${currentSlide.margins?.left || 0}px`,
                     }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )}
    </>
  );
}
