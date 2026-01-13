import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { Language } from '../types';
import logo from '../logo.png';

type NavLink = { name: string; path: string };

export default function Navbar({ navLinks, onToggleMenu }: { navLinks: NavLink[]; onToggleMenu: () => void }) {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const withLang = (path: string) => `${path}?lang=${language}`;
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-brand-off-white/80 backdrop-blur-md border-b border-brand-light-gray">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Logo" className="h-12 w-auto rounded-lg group-hover:scale-105 transition-transform" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={withLang(link.path)}
              className={`text-xs font-black uppercase tracking-widest transition-colors hover:text-brand-turquoise ${
                location.pathname === link.path ? 'text-brand-turquoise underline decoration-2 underline-offset-8' : 'text-gray-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="text-[10px] font-black uppercase px-3 py-1 rounded bg-brand-off-white text-gray-600 hover:text-brand-turquoise border border-brand-light-gray"
            >
              {language}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-brand-light-gray rounded-xl shadow-lg">
                {(['nl', 'tr', 'en'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang); setOpen(false); }}
                    className={`block w-full text-left px-3 py-2 text-[10px] font-black uppercase hover:bg-brand-bg ${
                      language === lang ? 'text-brand-turquoise' : 'text-gray-600'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to={withLang('/brief')}>
            <button className="bg-brand-red text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-red/20 hover:scale-105 transition-all">
              {t('nav.brief')}
            </button>
          </Link>
        </nav>
        <button onClick={onToggleMenu} className="md:hidden text-gray-900">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </header>
  );
}
