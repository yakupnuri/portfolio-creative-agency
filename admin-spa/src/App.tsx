import React, { useEffect, useState, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectsList from './pages/ProjectsList';
import ProjectsDetail from './pages/ProjectsDetail';
import ProjectsCategories from './pages/ProjectsCategories';
import Briefs from './pages/Briefs';
import Clients from './pages/Clients';
import ContentPage from './pages/ContentManagement';
import Users from './pages/Users';
import HomeHero from './pages/site-management/HomeHero';
import HomeFeaturedProjects from './pages/site-management/HomeFeaturedProjects';
import HomeServices from './pages/site-management/HomeServices';
import HomeAbout from './pages/site-management/HomeAbout';
import HomeProcess from './pages/site-management/HomeProcess';
import HomeReferences from './pages/site-management/HomeReferences';
import HomeCTA from './pages/site-management/HomeCTA';
import ServicesList from './pages/site-management/ServicesList';
import ServicesBriefSettings from './pages/site-management/ServicesBriefSettings';
import AboutBiography from './pages/site-management/AboutBiography';
import AboutSkills from './pages/site-management/AboutSkills';
import AboutFiles from './pages/site-management/AboutFiles';
import ContactInfo from './pages/site-management/ContactInfo';
import ContactForm from './pages/site-management/ContactForm';
import ContactCalendarLinks from './pages/site-management/ContactCalendarLinks';
import BriefServiceSelection from './pages/site-management/BriefServiceSelection';
import BriefStep2 from './pages/site-management/BriefStep2';
import BriefSuccess from './pages/site-management/BriefSuccess';
import FooterMenuLinks from './pages/site-management/FooterMenuLinks';
import FooterSocial from './pages/site-management/FooterSocial';
import FooterLegal from './pages/site-management/FooterLegal';
import { AuthState, User, UserRole } from './types';
import { Icons } from './constants';
import MediaLibraryPage from './pages/MediaLibraryPage';

const AuthContext = React.createContext<{
  auth: AuthState;
  login: (user: User) => void;
  logout: () => void;
} | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: UserRole[] }> = ({ children, roles }) => {
  const { auth } = useAuth();
  if (auth.isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && auth.user && !roles.includes(auth.user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

type NavItem = { label: string; path?: string; icon?: React.ReactNode; roles?: UserRole[]; children?: NavItem[] };

const Sidebar: React.FC = () => {
  const { auth, logout } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: Icons.Dashboard },
    { label: 'Briefs', path: '/briefs', icon: Icons.Briefs, roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.EDITOR] },
    { label: 'Clients', path: '/clients', icon: Icons.Clients, roles: [UserRole.OWNER, UserRole.ADMIN] },
    { label: 'Content', path: '/content', icon: Icons.Content, roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.EDITOR] },
    { label: 'Medya Kütüphanesi', path: '/media-library', icon: Icons.Content, roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.EDITOR] },
    { label: 'Team', path: '/users', icon: Icons.Users, roles: [UserRole.OWNER] },
    {
      label: 'Web Sitesi Yönetimi',
      icon: Icons.Settings,
      children: [
        {
          label: 'Ana Sayfa',
          children: [
            { label: 'Hero', path: '/site/home/hero' },
            { label: 'Öne Çıkan Projeler', path: '/site/home/featured-projects' },
            { label: 'Hizmetler', path: '/site/home/services' },
            { label: 'Hakkımda (Home)', path: '/site/home/about' },
            { label: 'Süreç (Process)', path: '/site/home/process' },
            { label: 'Referanslar', path: '/site/home/references' },
            { label: 'CTA / Brief Alanı', path: '/site/home/cta' }
          ]
        },
        {
          label: 'Projeler',
          children: [
            { label: 'Proje Listesi', path: '/projects/list', roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.EDITOR] },
            { label: 'Yeni Proje Ekle', path: '/projects/new', roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.EDITOR] },
            { label: 'Kategoriler', path: '/projects/categories', roles: [UserRole.OWNER, UserRole.ADMIN] }
          ]
        },
        {
          label: 'Hizmetler Sayfası',
          children: [
            { label: 'Hizmet Listesi', path: '/site/services/list' },
            { label: 'Brief Form Ayarları', path: '/site/services/brief-settings' }
          ]
        },
        {
          label: 'Hakkımda Sayfası',
          children: [
            { label: 'Biyografi', path: '/site/about/biography' },
            { label: 'Yetkinlikler', path: '/site/about/skills' },
            { label: 'Dosyalar (CV vb.)', path: '/site/about/files' }
          ]
        },
        {
          label: 'İletişim Sayfası',
          children: [
            { label: 'İletişim Bilgileri', path: '/site/contact/info' },
            { label: 'Contact Form', path: '/site/contact/form' },
            { label: 'Takvim / Harici Linkler', path: '/site/contact/calendar-links' }
          ]
        },
        {
          label: 'Brief Sayfası',
          children: [
            { label: 'Hizmet Seçimi', path: '/site/brief/service-selection' },
            { label: 'Adım 2 Form Alanları', path: '/site/brief/step-2' },
            { label: 'Başarı Sayfası', path: '/site/brief/success' }
          ]
        },
        {
          label: 'Footer',
          children: [
            { label: 'Menü Linkleri', path: '/site/footer/menu-links' },
            { label: 'Sosyal Medya', path: '/site/footer/social' },
            { label: 'Yasal Metinler', path: '/site/footer/legal' }
          ]
        }
      ]
    }
  ];
  return (
    <aside className="w-64 bg-white border-r border-brand-divider flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-brand-divider">
        <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span className="text-brand-primary">AG</span> Admin
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const can = !item.roles || (auth.user && item.roles.includes(auth.user.role));
          if (!can) return null;
          if (!item.children) {
            return (
              <Link
                key={item.path || item.label}
                to={item.path || '#'}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === item.path
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-slate-500 hover:bg-brand-bg hover:text-slate-900'
                }`}
              >
                <span className="opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            );
          }
          const key = item.label;
          const open = !!expanded[key];
          return (
            <div key={key} className="space-y-1">
              <button
                onClick={() => toggle(key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  open ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-500 hover:bg-brand-bg hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3"><span className="opacity-70">{item.icon}</span>{item.label}</span>
                <span className="material-symbols-outlined">{open ? 'expand_less' : 'expand_more'}</span>
              </button>
              {open && (
                <div className="pl-3 space-y-1">
                  {item.children.map(child => {
                    if (child.children) {
                      const subKey = `${key}/${child.label}`;
                      const subOpen = !!expanded[subKey];
                      return (
                        <div key={subKey}>
                          <button
                            onClick={() => toggle(subKey)}
                            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              subOpen ? 'bg-brand-bg text-slate-900' : 'text-slate-500 hover:bg-brand-bg hover:text-slate-900'
                            }`}
                          >
                            <span>{child.label}</span>
                            <span className="material-symbols-outlined text-[18px]">{subOpen ? 'expand_less' : 'expand_more'}</span>
                          </button>
                          {subOpen && (
                            <div className="pl-3 space-y-1">
                              {child.children.map(leaf => (
                                <Link
                                  key={leaf.path || leaf.label}
                                  to={leaf.path || '#'}
                                  className={`block px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    location.pathname === leaf.path
                                      ? 'bg-brand-primary/10 text-brand-primary'
                                      : 'text-slate-500 hover:bg-brand-bg hover:text-slate-900'
                                  }`}
                                >
                                  {leaf.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={child.path || child.label}
                        to={child.path || '#'}
                        className={`block px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          location.pathname === child.path
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'text-slate-500 hover:bg-brand-bg hover:text-slate-900'
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-brand-divider">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
            {auth.user?.email.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{auth.user?.email}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{auth.user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-brand-cta hover:bg-brand-cta/10 transition-all"
        >
          {Icons.Logout}
          Logout
        </button>
      </div>
    </aside>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-screen bg-brand-bg">
    <Sidebar />
    <main className="flex-1 p-8 overflow-x-hidden">
      {children}
    </main>
  </div>
);

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true });
  useEffect(() => {
    fetch('/api/admin/auth/me', { credentials: 'include' })
      .then(async r => r.ok ? r.json() : null)
      .then(me => {
        if (me) setAuth({ user: { id: 'self', email: me.email, role: me.role as UserRole, createdAt: new Date().toISOString() }, isAuthenticated: true, isLoading: false });
        else setAuth({ user: null, isAuthenticated: false, isLoading: false });
      })
      .catch(() => setAuth({ user: null, isAuthenticated: false, isLoading: false }));
  }, []);
  const login = useCallback((user: User) => setAuth({ user, isAuthenticated: true, isLoading: false }), []);
  const logout = useCallback(() => {
    fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' }).finally(() => {
      setAuth({ user: null, isAuthenticated: false, isLoading: false });
      window.location.hash = '#/login';
    });
  }, []);
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={auth.isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/projects/list" element={<ProtectedRoute><MainLayout><ProjectsList /></MainLayout></ProtectedRoute>} />
          <Route path="/projects/new" element={<ProtectedRoute><MainLayout><ProjectsDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><MainLayout><ProjectsDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/projects/categories" element={<ProtectedRoute roles={[UserRole.OWNER, UserRole.ADMIN]}><MainLayout><ProjectsCategories /></MainLayout></ProtectedRoute>} />
          <Route path="/briefs" element={<ProtectedRoute><MainLayout><Briefs /></MainLayout></ProtectedRoute>} />
          <Route path="/clients" element={<ProtectedRoute roles={[UserRole.OWNER, UserRole.ADMIN]}><MainLayout><Clients /></MainLayout></ProtectedRoute>} />
          <Route path="/content" element={<ProtectedRoute><MainLayout><ContentPage /></MainLayout></ProtectedRoute>} />
          <Route path="/media-library" element={<ProtectedRoute><MainLayout><MediaLibraryPage /></MainLayout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={[UserRole.OWNER]}><MainLayout><Users /></MainLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/site/home/hero" element={<ProtectedRoute><MainLayout><HomeHero /></MainLayout></ProtectedRoute>} />
          <Route path="/site/home/featured-projects" element={<ProtectedRoute><MainLayout><HomeFeaturedProjects /></MainLayout></ProtectedRoute>} />
          <Route path="/site/home/services" element={<ProtectedRoute><MainLayout><HomeServices /></MainLayout></ProtectedRoute>} />
          <Route path="/site/home/about" element={<ProtectedRoute><MainLayout><HomeAbout /></MainLayout></ProtectedRoute>} />
          <Route path="/site/home/process" element={<ProtectedRoute><MainLayout><HomeProcess /></MainLayout></ProtectedRoute>} />
          <Route path="/site/home/references" element={<ProtectedRoute><MainLayout><HomeReferences /></MainLayout></ProtectedRoute>} />
          <Route path="/site/home/cta" element={<ProtectedRoute><MainLayout><HomeCTA /></MainLayout></ProtectedRoute>} />
          <Route path="/site/services/list" element={<ProtectedRoute><MainLayout><ServicesList /></MainLayout></ProtectedRoute>} />
          <Route path="/site/services/brief-settings" element={<ProtectedRoute><MainLayout><ServicesBriefSettings /></MainLayout></ProtectedRoute>} />
          <Route path="/site/about/biography" element={<ProtectedRoute><MainLayout><AboutBiography /></MainLayout></ProtectedRoute>} />
          <Route path="/site/about/skills" element={<ProtectedRoute><MainLayout><AboutSkills /></MainLayout></ProtectedRoute>} />
          <Route path="/site/about/files" element={<ProtectedRoute><MainLayout><AboutFiles /></MainLayout></ProtectedRoute>} />
          <Route path="/site/contact/info" element={<ProtectedRoute><MainLayout><ContactInfo /></MainLayout></ProtectedRoute>} />
          <Route path="/site/contact/form" element={<ProtectedRoute><MainLayout><ContactForm /></MainLayout></ProtectedRoute>} />
          <Route path="/site/contact/calendar-links" element={<ProtectedRoute><MainLayout><ContactCalendarLinks /></MainLayout></ProtectedRoute>} />
          <Route path="/site/brief/service-selection" element={<ProtectedRoute><MainLayout><BriefServiceSelection /></MainLayout></ProtectedRoute>} />
          <Route path="/site/brief/step-2" element={<ProtectedRoute><MainLayout><BriefStep2 /></MainLayout></ProtectedRoute>} />
          <Route path="/site/brief/success" element={<ProtectedRoute><MainLayout><BriefSuccess /></MainLayout></ProtectedRoute>} />
          <Route path="/site/footer/menu-links" element={<ProtectedRoute><MainLayout><FooterMenuLinks /></MainLayout></ProtectedRoute>} />
          <Route path="/site/footer/social" element={<ProtectedRoute><MainLayout><FooterSocial /></MainLayout></ProtectedRoute>} />
          <Route path="/site/footer/legal" element={<ProtectedRoute><MainLayout><FooterLegal /></MainLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
