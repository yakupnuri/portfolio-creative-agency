import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const Setup: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    MONGODB_URI: '',
    CLOUDINARY_CLOUD_NAME: '',
    CLOUDINARY_API_KEY: '',
    CLOUDINARY_API_SECRET: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/setup/status`)
      .then(r => r.json())
      .then(d => { setConfigured(d.configured); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && configured) {
      navigate(`/?lang=${language}`);
    }
  }, [loading, configured, language]);

  const label = (nl: string, tr: string, en: string) => language === 'nl' ? nl : language === 'tr' ? tr : en;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    fetch(`${API_BASE}/api/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(async r => {
      if (!r.ok) throw new Error('failed');
      const j = await r.json();
      if (j.ok) {
        navigate(`/?lang=${language}`);
      } else {
        alert(label('Configuratie is mislukt.', 'Yapılandırma başarısız.', 'Configuration failed.'));
      }
    }).catch(() => {
      alert(label('Configuratie is mislukt.', 'Yapılandırma başarısız.', 'Configuration failed.'));
    }).finally(() => setSubmitting(false));
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-20"><h1 className="text-3xl font-black">Loading...</h1></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-black uppercase mb-8 font-display italic">
        {label('Eerste Installatie', 'İlk Kurulum', 'First Setup')}
      </h1>
      <p className="text-gray-600 mb-10 font-sans">
        {label('Server configuratie nodig.', 'Sunucu yapılandırması gerekli.', 'Server configuration required.')}
      </p>
      <form onSubmit={submit} className="bg-white rounded-2xl border border-brand-light-gray p-8 space-y-6">
        {[
          { k: 'MONGODB_URI', ph: 'mongodb+srv://...' },
          { k: 'CLOUDINARY_CLOUD_NAME', ph: 'cloud name' },
          { k: 'CLOUDINARY_API_KEY', ph: 'api key' },
          { k: 'CLOUDINARY_API_SECRET', ph: 'api secret' }
        ].map(f => (
          <div key={f.k} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{f.k}</label>
            <input
              type="text"
              required
              placeholder={f.ph}
              value={(form as any)[f.k]}
              onChange={e => setForm({ ...form, [f.k]: e.target.value })}
              className="w-full h-14 bg-brand-off-white border-0 rounded-xl focus:ring-2 ring-brand-turquoise px-4 font-bold"
            />
          </div>
        ))}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-brand-red text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-red/20 disabled:opacity-60"
            disabled={submitting}
          >
            {label('Opslaan en starten', 'Kaydet ve başlat', 'Save and start')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setup;
