import React from 'react';
export default function HomeFeaturedProjects() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Ana Sayfa • Öne Çıkan Projeler</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="p-4 bg-brand-bg rounded-xl">
              <input className="w-full p-3 bg-white rounded-lg border border-brand-divider" placeholder={`Proje ${i} Slug`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
