import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth/status').then(r => r.json()).then(s => {
      if (!s.initialized) window.location.hash = '#/register';
    }).catch(() => {});
    const remembered = localStorage.getItem('remember_email');
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    }).then(async r => {
      if (!r.ok) throw new Error('failed');
      const me = await fetch('/api/admin/auth/me', { credentials: 'include' }).then(x => x.json());
      const role = (me.role as UserRole) || UserRole.EDITOR;
      login({ id: 'self', email: me.email, role, createdAt: new Date().toISOString() });
      if (remember) localStorage.setItem('remember_email', email);
      else localStorage.removeItem('remember_email');
      window.location.hash = '#/dashboard';
    }).catch(() => alert('Giriş başarısız')).finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl shadow-brand-primary/10 border border-brand-divider space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            <span className="text-brand-primary">AG</span> Admin
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Secure authentication for portfolio management.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="e.g. owner@abdulhamitgulen.com"
              className="w-full p-4 bg-brand-bg border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 text-sm font-semibold transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Security Key</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                placeholder="123456"
                className="w-full pr-12 p-4 bg-brand-bg border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 text-sm font-semibold transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Beni hatırla
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all ${
              isLoading ? 'bg-brand-primary/50 cursor-not-allowed text-white' : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-brand-primary/20'
            }`}
          >
            {isLoading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>

        <div className="pt-6 text-center border-t border-brand-divider">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            RBAC Protected System
          </p>
          <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold text-slate-400">
             <span className="hover:text-brand-primary transition-colors cursor-default">Owner Access</span>
             <span className="hover:text-brand-primary transition-colors cursor-default">Admin Panel</span>
             <span className="hover:text-brand-primary transition-colors cursor-default">Editor Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
