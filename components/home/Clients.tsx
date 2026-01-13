import React from 'react';
import { CLIENTS } from '../../constants';

export default function Clients() {
  return (
    <section className="py-20 border-t border-brand-light-gray grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all">
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
         <div className="flex flex-wrap justify-between items-center gap-10 font-sans">
           {CLIENTS.map(c => <span key={c} className="text-2xl font-black uppercase tracking-tighter">{c}</span>)}
         </div>
      </div>
    </section>
  );
}
