
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { Language } from '../types';
import Navbar from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  const withLang = (path: string) => `${path}?lang=${language}`;

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam && ['nl', 'tr', 'en'].includes(langParam) && langParam !== language) {
      setLanguage(langParam as Language);
    }
  }, [location.pathname]);

  useEffect(() => {
    const current = searchParams.get('lang');
    if (current !== language) {
      const next = new URLSearchParams(searchParams);
      next.set('lang', language);
      setSearchParams(next, { replace: true });
    }
  }, [language, location.pathname]);

  useEffect(() => {
    fetch(`${API_BASE}/api/setup/status`)
      .then(r => r.json())
      .then(d => {
        if (!d.configured && location.pathname !== '/setup') {
          navigate(`/setup?lang=${language}`);
        }
      })
      .catch(() => {});
  }, [location.pathname, language]);

  const navLinks = [
    { name: t('nav.work'), path: '/work' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-off-white font-sans">
      <Navbar navLinks={navLinks} onToggleMenu={() => setMenuOpen(!menuOpen)} />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white p-10 flex flex-col gap-6 animate-in slide-in-from-top duration-300 md:hidden overflow-y-auto font-sans">
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-black uppercase tracking-widest">MENU</span>
            <button onClick={() => setMenuOpen(false)}><span className="material-symbols-outlined text-4xl">close</span></button>
          </div>
          <div className="flex gap-4 mb-4">
             {(['nl', 'tr', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setMenuOpen(false); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                    language === lang ? 'bg-brand-turquoise text-white' : 'bg-brand-off-white text-gray-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
          </div>
          {navLinks.map(link => (
            <Link key={link.path} to={withLang(link.path)} onClick={() => setMenuOpen(false)} className="text-5xl font-black hover:text-brand-turquoise tracking-tighter font-display italic">{link.name}</Link>
          ))}
          <Link to={withLang('/brief')} onClick={() => setMenuOpen(false)} className="mt-auto">
            <button className="w-full bg-brand-red text-white py-6 rounded-2xl text-xl font-black uppercase tracking-widest">{t('nav.brief')}</button>
          </Link>
        </div>
      )}

      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-light-gray py-20 mt-20 font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h2 className="text-4xl font-black mb-6 uppercase leading-tight font-display italic">
              {t('footer.cta')} <br/><span className="text-brand-turquoise not-italic">{t('footer.cta.blue')}</span>
            </h2>
            <p className="text-gray-500 max-w-sm mb-8 font-medium leading-relaxed">{t('footer.text')}</p>
            <div className="flex gap-4">
              <a href="#" className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-turquoise hover:text-white transition-all"><span className="material-symbols-outlined text-sm">alternate_email</span></a>
              <a href="#" className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-turquoise hover:text-white transition-all"><span className="material-symbols-outlined text-sm">link</span></a>
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Navigation</h3>
            <ul className="space-y-4 font-bold text-sm">
              <li><Link to={withLang('/work')} className="hover:text-brand-turquoise transition-colors">{t('nav.work')}</Link></li>
              <li><Link to={withLang('/services')} className="hover:text-brand-turquoise transition-colors">{t('nav.services')}</Link></li>
              <li><Link to={withLang('/brief')} className="hover:text-brand-turquoise transition-colors">{t('nav.brief')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Contact</h3>
            <p className="font-bold text-sm mb-2">hello@alexstudio.design</p>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Alexandria, Netherlands</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-brand-light-gray flex flex-col md:flex-row justify-between text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
           <span>© 2024 Alex Design Studio</span>
           <span>Holland & Turkey & Global</span>
        </div>
      </footer>
    </div>
  );
};
