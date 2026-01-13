import React from 'react';
export default function AboutFiles() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Hakkımda • Dosyalar</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="CV dosya URL" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Ek dosya URL" />
      </div>
    </div>
  );
}
