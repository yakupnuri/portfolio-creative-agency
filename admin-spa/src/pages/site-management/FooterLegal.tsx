import React from 'react';
export default function FooterLegal() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Footer • Yasal Metinler</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <textarea rows={10} className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Yasal metinler" />
      </div>
    </div>
  );
}
