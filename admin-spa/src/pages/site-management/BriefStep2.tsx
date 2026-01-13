import React from 'react';
export default function BriefStep2() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Brief • Adım 2</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Bütçe aralığı" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Teslim tarihi" />
        <textarea rows={6} className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Ek açıklama" />
      </div>
    </div>
  );
}
