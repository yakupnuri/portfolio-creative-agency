import React from 'react';
export default function BriefServiceSelection() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Brief • Hizmet Seçimi</h1>
      <div className="bg-white p-6 rounded-2xl border border-brand-divider space-y-4">
        <select className="w-full p-4 bg-brand-bg rounded-xl">
          <option key="web-tasarim">Web Tasarım</option>
          <option key="ui-ux">UI/UX</option>
          <option key="dansmanlik">Danışmanlık</option>
        </select>
      </div>
    </div>
  );
}
