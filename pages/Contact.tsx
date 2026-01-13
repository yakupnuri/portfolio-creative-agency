
import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div className="flex flex-col justify-center gap-10">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-yellow/20 w-fit">
            <span className="size-2 rounded-full bg-accent-yellow"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-700 dark:text-yellow-400">Open for new projects</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            Ready to bring your <span className="text-primary">ideas</span> to life?
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
            I'm currently available for freelance work. Fill out the form or book a quick call to discuss your next big move.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="mailto:hello@portfolio.com" className="p-6 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-primary transition-all group">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Email Me</p>
              <p className="font-bold">hello@portfolio.com</p>
            </div>
          </a>
          <a href="tel:+15550000000" className="p-6 bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-primary transition-all group">
            <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Call Me</p>
              <p className="font-bold">+1 (555) 000-0000</p>
            </div>
          </a>
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl border border-gray-100 flex items-center justify-between gap-6">
           <div>
             <h3 className="text-lg font-bold">Prefer a face-to-face?</h3>
             <p className="text-gray-400">Schedule a 15-min discovery call.</p>
           </div>
           <button className="h-12 px-6 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90">
             <span className="material-symbols-outlined text-xl">calendar_month</span> Book a Call
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <h3 className="text-2xl font-bold mb-8">Send a Message</h3>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Name</label>
              <input type="text" className="w-full h-12 rounded-lg border-gray-100 bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary outline-none" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Email</label>
              <input type="email" className="w-full h-12 rounded-lg border-gray-100 bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary outline-none" placeholder="Your Email" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Project Type</label>
            <select className="w-full h-12 rounded-lg border-gray-100 bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary outline-none">
              <option>Web Design</option>
              <option>Branding</option>
              <option>App Development</option>
              <option>Consulting</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Message</label>
            <textarea className="w-full h-40 rounded-lg border-gray-100 bg-gray-50 dark:bg-background-dark focus:ring-primary focus:border-primary outline-none p-4" placeholder="Tell me about your project..."></textarea>
          </div>
          <button className="w-full h-14 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2">
            Send Request <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
