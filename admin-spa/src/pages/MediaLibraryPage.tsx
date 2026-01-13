import React, { useState } from 'react';
import MediaLibrary from '../components/core/MediaLibraryCore';
import { MediaItem } from '../types';

export default function MediaLibraryPage() {
  const [selected, setSelected] = useState<MediaItem | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Medya Kütüphanesi</h1>
          <p className="text-slate-600">Medya yönetimi.</p>
        </div>
      </div>
      
      {selected && (
         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <span className="material-symbols-outlined">check_circle</span>
            <div>
              <p className="font-bold text-sm">Medya Seçildi</p>
              <p className="text-xs opacity-80">{selected.name}</p>
            </div>
            <button onClick={() => setSelected(null)} className="ml-auto hover:bg-green-100 p-1.5 rounded-full transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
         </div>
      )}

      <MediaLibrary inline onClose={() => {}} onSelect={(item) => setSelected(item)} />
    </div>
  );
}