import React from 'react';
export default function HomeProcess() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Ana Sayfa • Süreç</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="p-4 bg-brand-bg rounded-xl" placeholder={`Adım ${i} Başlık`} />
            <input className="p-4 bg-brand-bg rounded-xl" placeholder={`Adım ${i} Açıklama`} />
          </div>
        ))}
      </div>
    </div>
  );
}
