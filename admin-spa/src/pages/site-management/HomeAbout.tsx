import React from 'react';
export default function HomeAbout() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Ana Sayfa • Hakkımda</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <textarea rows={8} className="w-full p-4 bg-brand-bg rounded-xl" placeholder="Kısa biyografi" />
      </div>
    </div>
  );
}
