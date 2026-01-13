import React from 'react';
export default function ContactForm() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">İletişim • Form</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <input className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Form başlığı" />
        <textarea rows={6} className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Form açıklaması" />
      </div>
    </div>
  );
}
