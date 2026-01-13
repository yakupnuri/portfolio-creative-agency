import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';
import { Brief, BriefStatus, UserRole } from '../types';
import { useAuth } from '../App';
import { apiService } from '../services/api';

const Briefs: React.FC = () => {
  const { auth } = useAuth();
  const [briefs, setBriefs] = useState<Brief[]>([]);

  useEffect(() => {
    apiService.get('/admin/briefs').then((items) => {
      const mapped: Brief[] = items.map((b: any) => ({
        id: b._id,
        clientName: b.name,
        email: b.email,
        projectType: b.serviceType,
        budget: b.budgetRange || '',
        status: (b.status || 'new') as BriefStatus,
        internalNotes: b.internalNotes || '',
        tags: b.tags || [],
        createdAt: b.createdAt
      }));
      setBriefs(mapped);
    }).catch(() => {});
  }, []);

  const updateStatus = (id: string, newStatus: BriefStatus) => {
    if (auth.user?.role === UserRole.EDITOR) return;
    apiService.patch(`/admin/briefs/${id}`, { status: newStatus }).then(() => {
      setBriefs(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    }).catch(() => {});
  };

  const statusColors: Record<BriefStatus, string> = {
    [BriefStatus.NEW]: 'bg-brand-primary/10 text-brand-primary',
    [BriefStatus.REVIEWING]: 'bg-brand-highlight/20 text-slate-700',
    [BriefStatus.PROPOSAL_SENT]: 'bg-blue-50 text-blue-700',
    [BriefStatus.WON]: 'bg-green-50 text-green-700',
    [BriefStatus.LOST]: 'bg-brand-cta/10 text-brand-cta'
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Briefs</h1>
        <p className="text-slate-500 mt-2 font-medium">Potential inquiries and client projects in the pipeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {briefs.map((brief) => (
          <div key={brief.id} className="bg-white p-8 rounded-[2.5rem] border border-brand-divider shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-lg hover:border-brand-primary/20 transition-all">
            <div className="w-full md:w-2/3 space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-slate-900">{brief.clientName}</h3>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${statusColors[brief.status]}`}>
                  {brief.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-slate-600 font-medium">{brief.projectType} • <span className="text-slate-400">{brief.budget}</span></p>
              
              <div className="flex flex-wrap gap-2">
                {brief.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-brand-bg text-slate-500 rounded-lg">#{tag}</span>
                ))}
              </div>

              {brief.internalNotes && (
                <div className="p-4 bg-brand-bg rounded-2xl border-l-4 border-brand-primary/30">
                  <p className="text-xs text-slate-500 font-medium italic">"{brief.internalNotes}"</p>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-3 justify-end items-end h-full">
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(brief.createdAt).toLocaleDateString()}</p>
               <div className="flex gap-2">
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-primary transition-colors">
                    Reply
                 </button>
                 {auth.user?.role !== UserRole.EDITOR && (
                   <select 
                    value={brief.status}
                    onChange={(e) => updateStatus(brief.id, e.target.value as BriefStatus)}
                    className="bg-brand-bg border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                   >
                     {Object.values(BriefStatus).map(s => (
                       <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                     ))}
                   </select>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Briefs;
