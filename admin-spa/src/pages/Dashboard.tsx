import React from 'react';
import { Icons } from '../constants';

const StatCard: React.FC<{ title: string, value: string | number, change?: string, icon: React.ReactNode }> = ({ title, value, change, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-brand-divider shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-brand-bg text-brand-primary rounded-2xl">
        {icon}
      </div>
      {change && (
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-brand-cta bg-brand-cta/10'}`}>
          {change}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-semibold mb-1">{title}</h3>
    <p className="text-3xl font-black text-slate-900">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 mt-2 font-medium">Welcome back, here's what's happening with your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={24} change="+2" icon={Icons.Projects} />
        <StatCard title="Active Briefs" value={8} change="+3" icon={Icons.Briefs} />
        <StatCard title="Client Reach" value="1.2k" change="+12%" icon={Icons.Clients} />
        <StatCard title="Published Content" value={14} icon={Icons.Publish} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-[2rem] border border-brand-divider p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Briefs</h2>
            <button className="text-brand-primary font-bold text-sm hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-brand-bg rounded-2xl transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-slate-400 group-hover:text-brand-primary transition-colors">
                  {Icons.Briefs}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">Brief from Client {i}</h4>
                  <p className="text-xs text-slate-500">Website Redesign • 2 hours ago</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-brand-highlight/20 text-brand-primary rounded-full uppercase tracking-widest">
                  New
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-brand-divider p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Latest Projects</h2>
            <button className="text-brand-primary font-bold text-sm hover:underline">View all</button>
          </div>
          <div className="space-y-4">
             {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-brand-bg rounded-2xl transition-colors cursor-pointer group">
                <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden">
                   <img src={`https://picsum.photos/seed/${i+100}/300/200`} className="w-full h-full object-cover" alt="Project cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">E-Commerce App Design</h4>
                  <p className="text-xs text-slate-500 font-medium">UI/UX Design • Updated 1 day ago</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-green-50 text-green-600 rounded-full uppercase tracking-widest">
                  Published
                </span>
              </div>
            ))}
            <div className="p-8 border-2 border-dashed border-brand-divider rounded-[2rem] flex flex-col items-center justify-center text-slate-400 gap-2 hover:border-brand-primary/20 hover:text-brand-primary/60 transition-all cursor-pointer">
              {Icons.Add}
              <span className="text-sm font-bold">New Project Entry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
