import React from 'react';
export default function HomeCTA() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Ana Sayfa • CTA / Brief</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="CTA Başlık" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="CTA Buton Metni" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Brief Form Linki" />
      </div>
    </div>
  );
}
