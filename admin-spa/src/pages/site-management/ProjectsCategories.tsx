import React from 'react';
export default function ProjectsCategories() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Projeler • Kategoriler</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        {[1,2,3].map(i => (
          <input key={i} className="w-full p-4 bg-brand-bg rounded-xl" placeholder={`Kategori ${i}`} />
        ))}
      </div>
    </div>
  );
}
