import React from 'react';
import { Icons } from '../constants';

const Clients: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clients</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage client references and logos.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all">
          {Icons.Add}
          Add Client
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-brand-divider shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden ring-1 ring-brand-divider">
              <img src={`https://picsum.photos/seed/client${i}/120/120`} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Client {i}</p>
              <p className="text-xs text-slate-500">Order: {i}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors">
                {Icons.Edit}
              </button>
              <button className="p-2 text-slate-400 hover:text-brand-cta hover:bg-brand-cta/10 rounded-lg transition-colors">
                {Icons.Delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
