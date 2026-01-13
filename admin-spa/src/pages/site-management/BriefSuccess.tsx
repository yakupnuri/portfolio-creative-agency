import React from 'react';
export default function BriefSuccess() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Brief • Başarı Sayfası</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Başarı mesajı" />
      </div>
    </div>
  );
}
