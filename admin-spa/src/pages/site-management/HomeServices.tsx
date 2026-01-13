import React from 'react';
export default function HomeServices() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Ana Sayfa • Hizmetler</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-4 bg-brand-bg rounded-xl" placeholder={`Hizmet ${i} Başlık`} />
            <input className="p-4 bg-brand-bg rounded-xl" placeholder={`Hizmet ${i} Kısa Açıklama`} />
          </div>
        ))}
      </div>
    </div>
  );
}
