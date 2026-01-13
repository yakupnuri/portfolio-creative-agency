
import React, { useState } from 'react';

const GetOffer = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('Logo Design');

  const services = [
    { icon: 'brush', label: 'Graphic Design' },
    { icon: 'design_services', label: 'Logo Design', badge: 'Popular' },
    { icon: 'book_2', label: 'Book Cover' },
    { icon: 'menu_book', label: 'Catalog' },
    { icon: 'share', label: 'Social Media' }
  ];

  return (
    <div className="max-w-[960px] mx-auto px-6 py-12 lg:py-20 flex flex-col gap-12">
      <div className="text-center md:text-left">
        <h1 className="text-4xl lg:text-6xl font-black mb-4">Let's Build Something <span className="text-primary">Great</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
          Tell me about your project needs. I'll review your brief and get back to you with a custom offer within 24 hours.
        </p>
      </div>

      <div className="w-full">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {step} of 3</span>
            <p className="text-xl font-bold">Service Selection</p>
          </div>
          <span className="text-gray-400 font-bold">{Math.round((step / 3) * 100)}% Completed</span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col gap-12">
        <section>
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2"><span className="material-symbols-outlined text-primary">category</span> Select a Service</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {services.map(s => (
              <div
                key={s.label}
                onClick={() => setSelectedService(s.label)}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedService === s.label ? 'border-primary bg-primary/5 shadow-inner' : 'border-transparent bg-gray-50 dark:bg-background-dark hover:border-gray-200'
                }`}
              >
                {s.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-yellow text-[10px] font-black uppercase px-2 py-0.5 rounded-full">{s.badge}</span>}
                <div className={`size-12 rounded-full mb-4 flex items-center justify-center ${selectedService === s.label ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray-400'}`}>
                   <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                </div>
                <p className="text-sm font-bold">{s.label}</p>
                {selectedService === s.label && <span className="material-symbols-outlined absolute top-2 right-2 text-primary">check_circle</span>}
              </div>
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>

        <section className="flex flex-col gap-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">edit_note</span> Project Details</h3>
              <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">For: {selectedService}</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold">Project Name *</label>
                <input type="text" className="w-full h-14 rounded-xl border-gray-100 bg-gray-50 dark:bg-background-dark p-4 outline-none focus:ring-primary" placeholder="e.g. Rebrand for Eco Coffee Shop" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Budget Range</label>
                <select className="w-full h-14 rounded-xl border-gray-100 bg-gray-50 dark:bg-background-dark p-4 outline-none focus:ring-primary appearance-none">
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $2,500</option>
                  <option>$2,500 - $5,000</option>
                  <option>$5,000+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Desired Deadline</label>
                <input type="date" className="w-full h-14 rounded-xl border-gray-100 bg-gray-50 dark:bg-background-dark p-4 outline-none focus:ring-primary" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold">Description *</label>
                <textarea className="w-full h-40 rounded-xl border-gray-100 bg-gray-50 dark:bg-background-dark p-4 outline-none focus:ring-primary" placeholder="Tell me about your business goals..."></textarea>
              </div>
           </div>
        </section>

        <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-400 flex items-center gap-2"><span className="material-symbols-outlined text-lg">lock</span> Your info is secure and private.</p>
          <div className="flex gap-4">
            <button className="h-12 px-8 rounded-lg border border-gray-200 font-bold hover:bg-gray-50">Back</button>
            <button className="h-12 px-10 rounded-lg bg-primary text-white font-bold flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 transition-all">
              Next Step <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetOffer;
