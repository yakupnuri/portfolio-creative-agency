import React from 'react';
export default function ContactCalendarLinks() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">İletişim • Takvim / Harici Linkler</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Takvim linki" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Harici link 1" />
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Harici link 2" />
      </div>
    </div>
  );
}
