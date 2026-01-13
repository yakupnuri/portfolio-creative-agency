import React from 'react';
export default function ProjectsDetail() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Projeler • Detay</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Şablon seçimi" />
        <textarea rows={6} className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Detay yerleşimi açıklaması" />
      </div>
    </div>
  );
}
