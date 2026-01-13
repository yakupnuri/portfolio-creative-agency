import React from 'react';
export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">İletişim • Bilgiler</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="E-posta" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Telefon" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Adres" />
      </div>
    </div>
  );
}
