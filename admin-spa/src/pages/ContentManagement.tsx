import React from 'react';
import { Icons } from '../constants';

const ContentPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Content</h1>
          <p className="text-slate-500 mt-2 font-medium">Edit homepage, about, services, process and contact content.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all">
          {Icons.Publish}
          Publish Draft
        </button>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-brand-divider shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Homepage Title</label>
            <input className="w-full p-4 bg-brand-bg border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 text-sm font-semibold transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Homepage Subtitle</label>
            <input className="w-full p-4 bg-brand-bg border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 text-sm font-semibold transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">About (Rich Text)</label>
            <textarea rows={8} className="w-full p-4 bg-brand-bg border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 text-sm font-semibold transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
