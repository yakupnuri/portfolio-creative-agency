import React, { useEffect, useState, useRef } from 'react';
import { apiService } from '../../services/api';
import MediaLibrary from '../../components/core/MediaLibraryCore';
import { MediaItem } from '../../types';
import { useAuth } from '../../App';

// --- TYPES ---
type Placement = 'background' | 'left' | 'right';
type Slide = {
  url: string;
  placement?: Placement;
  duration?: number;
  isActive?: boolean;
  margins?: { top?: number; right?: number; bottom?: number; left?: number };
  transform?: { scale?: number; offsetX?: number; offsetY?: number };
  
  // Unique Text Content per Slide
  title?: string;
  titleHighlight?: string;
  highlightNewLine?: boolean;
  titleSmall?: boolean;
  subtitle?: string;
  description?: string;
  cta?: string;
  ctaUrl?: string;
  cta2?: string;
  cta2Url?: string;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  bgColor?: string;
};

type HeroDraft = {
  // Legacy/Global fields (deprecated)
  // title?: string; 
  // subtitle?: string;
  active?: boolean;
  slides?: Slide[];
};

// --- ICONS ---
const Icons = {
  Desktop: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Mobile: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-12H4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  ArrowDown: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
};

export default function HomeHero() {
  const { auth } = useAuth();
  const [draft, setDraft] = useState<HeroDraft>({ slides: [] });
  const [published, setPublished] = useState<HeroDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [libraryOpen, setLibraryOpen] = useState(false);
  
  // Slide Management
  const [selectedSlideIdx, setSelectedSlideIdx] = useState<number | null>(null);
  
  // Preview Loop State
  const [previewIdx, setPreviewIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0.45); // Default zoom scale
  const [previewWidth, setPreviewWidth] = useState(1280);
  const [previewHeight, setPreviewHeight] = useState(720);

  // RBAC
  const isOwner = auth.user.role === 'owner';
  const isEditor = auth.user.role === 'editor';
  const canPublish = isOwner || auth.user.role === 'admin';
  const canDelete = !isEditor;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    apiService.get('/admin/content/home_hero').then((doc: any) => {
      const d = doc?.draft || {};
      const parsed = parseDraft(d);
      setDraft(parsed);
      setPublished(parseDraft(doc?.publishedVersion || {}));
      
      // If there are slides, select the first one by default
      if (parsed.slides && parsed.slides.length > 0) {
        setSelectedSlideIdx(0);
      }
    }).catch(() => {});
  };

  const parseDraft = (d: any): HeroDraft => ({
    // title: d.title, // legacy removed
    // subtitle: d.subtitle, // legacy removed
    active: typeof d.active === 'boolean' ? d.active : true,
    slides: (d.slides || []).map((s: any) => ({
      url: s.url,
      placement: s.placement || 'background',
      duration: s.duration || 5,
      isActive: typeof s.isActive === 'boolean' ? s.isActive : true,
      margins: s.margins,
      transform: s.transform,
      
      // Map global fields to slide fields if slide fields are missing (migration)
      title: s.title ?? (d.title || ''),
      titleHighlight: s.titleHighlight ?? (d.titleHighlight || ''),
      highlightNewLine: s.highlightNewLine ?? (!!d.highlightNewLine),
      titleSmall: s.titleSmall ?? (!!d.titleSmall),
      subtitle: s.subtitle ?? (d.subtitle || ''),
      description: s.description ?? (d.description || ''),
      cta: s.cta ?? (d.cta || ''),
      ctaUrl: s.ctaUrl ?? (d.ctaUrl || ''),
      cta2: s.cta2 ?? (d.cta2 || ''),
      cta2Url: s.cta2Url ?? (d.cta2Url || ''),
      textAlign: s.textAlign ?? (d.textAlign || 'left'),
      textColor: s.textColor ?? (d.textColor || ''),
      bgColor: s.bgColor ?? (d.bgColor || ''),
    }))
  });

  const update = (patch: Partial<HeroDraft>) => setDraft(prev => ({ ...prev, ...patch }));

  // Preview Loop Logic
  useEffect(() => {
    const slides = draft.slides || [];
    if (slides.length <= 1 || !isPlaying) return;
    
    // If a slide is selected for editing, lock preview to it
    if (selectedSlideIdx !== null) {
      setPreviewIdx(selectedSlideIdx);
      return;
    }

    const currentSlide = slides[previewIdx];
    const ms = (currentSlide?.duration || 5) * 1000;
    
    const t = setTimeout(() => {
      setPreviewIdx(prev => (prev + 1) % slides.length);
    }, ms);
    return () => clearTimeout(t);
  }, [draft.slides, previewIdx, isPlaying, selectedSlideIdx]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await apiService.patch('/admin/content/home_hero', draft);
    } catch {
      alert('Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    try {
      await apiService.patch('/admin/content/home_hero', draft);
      await apiService.patch('/admin/content/home_hero/publish', {});
      setPublished(draft);
    } catch {
      alert('Yayınlama hatası');
    } finally {
      setPublishing(false);
    }
  };

  const handleToggleActive = async () => {
    if (!canPublish) return;
    const newState = !published?.active;
    const newDraft = { ...draft, active: newState };
    setDraft(newDraft);
    await apiService.patch('/admin/content/home_hero', newDraft);
    await apiService.patch('/admin/content/home_hero/publish', {});
    setPublished(newDraft);
  };

  // Slide Ops
  const updateSlide = (i: number, patch: Partial<Slide>) => {
    const arr = [...(draft.slides || [])];
    arr[i] = { ...arr[i], ...patch };
    update({ slides: arr });
  };
  
  const moveSlide = (i: number, dir: -1 | 1) => {
    const arr = [...(draft.slides || [])];
    if (i + dir < 0 || i + dir >= arr.length) return;
    const temp = arr[i];
    arr[i] = arr[i + dir];
    arr[i + dir] = temp;
    update({ slides: arr });
    if (selectedSlideIdx === i) setSelectedSlideIdx(i + dir);
  };

  const removeSlide = (i: number) => {
    if (!canDelete) return;
    const arr = (draft.slides || []).filter((_, idx) => idx !== i);
    update({ slides: arr });
    if (selectedSlideIdx === i) setSelectedSlideIdx(null);
    else if (selectedSlideIdx !== null && selectedSlideIdx > i) setSelectedSlideIdx(selectedSlideIdx - 1);
  };

  // --- RENDER HELPERS ---
  const selectedSlide = selectedSlideIdx !== null ? (draft.slides || [])[selectedSlideIdx] : null;
  const currentPreviewSlide = (draft.slides || [])[previewIdx] || (draft.slides || [])[0];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#F4F4F8]">
      
      {/* LEFT PANEL: EDITOR */}
      <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col gap-4 bg-white">
          <div className="flex flex-col gap-1">
             <h1 className="text-xl font-bold text-slate-900 tracking-tight font-['Inter']">Hero Slider Editor</h1>
             <div className="flex items-center gap-2">
               <span className={`w-2 h-2 rounded-full ${published?.active ? 'bg-[#2AB7CA]' : 'bg-slate-300'}`}></span>
               <span className="text-xs font-medium text-slate-500">{published?.active ? 'Yayında' : 'Pasif'}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
               onClick={handleSaveDraft} 
               disabled={saving}
               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all text-xs font-bold"
             >
               {saving ? '...' : <><Icons.Save /> Kaydet</>}
             </button>
             {canPublish && (
               <button 
                 onClick={handlePublish}
                 disabled={publishing} 
                 className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2AB7CA] text-white shadow-lg shadow-[#2AB7CA]/20 hover:shadow-[#2AB7CA]/40 hover:-translate-y-0.5 transition-all text-xs font-bold"
               >
                 {publishing ? '...' : <><Icons.Check /> Yayınla</>}
               </button>
             )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* 1. Slides Navigation / List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Slaytlar ({draft.slides?.length || 0})</h3>
               <button onClick={() => setLibraryOpen(true)} className="flex items-center gap-1 text-[#2AB7CA] text-xs font-bold hover:underline">
                 <Icons.Plus /> Yeni Ekle
               </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(draft.slides || []).map((slide, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedSlideIdx(i)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedSlideIdx === i ? 'border-[#2AB7CA] ring-2 ring-[#2AB7CA]/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <img src={slide.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xs">
                    #{i + 1}
                  </div>
                  {/* Active Indicator */}
                  <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${i === previewIdx ? 'bg-[#FED766]' : 'bg-transparent'}`}></div>
                </div>
              ))}
              
              {/* Add New Button (Placeholder style) */}
              <button 
                onClick={() => setLibraryOpen(true)}
                className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-[#2AB7CA] hover:border-[#2AB7CA] hover:bg-[#F0F9FA] transition-all gap-1"
              >
                <Icons.Plus />
                <span className="text-[10px] font-bold">Yeni</span>
              </button>
            </div>
          </section>

          {/* 2. Selected Slide Settings (Dynamic Content) */}
          {selectedSlideIdx !== null && selectedSlide ? (
            <div className="animate-fade-in space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#2AB7CA] text-white flex items-center justify-center text-xs">{selectedSlideIdx + 1}</span>
                  Slayt Ayarları
                </h3>
                <div className="flex items-center gap-2">
                   <button onClick={() => moveSlide(selectedSlideIdx, -1)} disabled={selectedSlideIdx === 0} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30"><Icons.ArrowUp /></button>
                   <button onClick={() => moveSlide(selectedSlideIdx, 1)} disabled={selectedSlideIdx === (draft.slides?.length || 0) - 1} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30"><Icons.ArrowDown /></button>
                   {canDelete && <button onClick={() => removeSlide(selectedSlideIdx)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Icons.Trash /></button>}
                </div>
              </div>

              {/* Text Content Form */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">İçerik</h4>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    className="w-full p-3 bg-[#F4F4F8] rounded-xl border-transparent focus:border-[#2AB7CA] focus:bg-white transition-all text-sm font-medium outline-none" 
                    placeholder="Başlık (Örn: ENTER HEADLINE)" 
                    value={selectedSlide.title || ''} 
                    onChange={e => updateSlide(selectedSlideIdx, { title: e.target.value })} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      className="w-full p-3 bg-[#F4F4F8] rounded-xl border-transparent focus:border-[#2AB7CA] focus:bg-white transition-all text-sm font-medium outline-none" 
                      placeholder="Highlight Metni" 
                      value={selectedSlide.titleHighlight || ''} 
                      onChange={e => updateSlide(selectedSlideIdx, { titleHighlight: e.target.value })} 
                    />
                     <label className="flex items-center gap-3 p-3 bg-[#F4F4F8] rounded-xl cursor-pointer">
                      <input type="checkbox" checked={!!selectedSlide.highlightNewLine} onChange={e => updateSlide(selectedSlideIdx, { highlightNewLine: e.target.checked })} className="text-[#2AB7CA] focus:ring-[#2AB7CA] rounded" />
                      <span className="text-xs font-bold text-slate-600">Highlight Alt Satır</span>
                    </label>
                  </div>
                  <textarea 
                    className="w-full p-3 bg-[#F4F4F8] rounded-xl border-transparent focus:border-[#2AB7CA] focus:bg-white transition-all text-sm font-medium outline-none resize-none h-24" 
                    placeholder="Alt Başlık / Açıklama" 
                    value={selectedSlide.subtitle || ''} 
                    onChange={e => updateSlide(selectedSlideIdx, { subtitle: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CTA Buton 1</label>
                    <input className="w-full p-3 bg-[#F4F4F8] rounded-xl text-sm outline-none" placeholder="Metin" value={selectedSlide.cta || ''} onChange={e => updateSlide(selectedSlideIdx, { cta: e.target.value })} />
                    <input className="w-full p-3 bg-[#F4F4F8] rounded-xl text-sm outline-none" placeholder="URL" value={selectedSlide.ctaUrl || ''} onChange={e => updateSlide(selectedSlideIdx, { ctaUrl: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">CTA Buton 2</label>
                    <input className="w-full p-3 bg-[#F4F4F8] rounded-xl text-sm outline-none" placeholder="Metin" value={selectedSlide.cta2 || ''} onChange={e => updateSlide(selectedSlideIdx, { cta2: e.target.value })} />
                    <input className="w-full p-3 bg-[#F4F4F8] rounded-xl text-sm outline-none" placeholder="URL" value={selectedSlide.cta2Url || ''} onChange={e => updateSlide(selectedSlideIdx, { cta2Url: e.target.value })} />
                  </div>
                </div>

                 <div className="flex items-center gap-4 p-4 bg-[#F4F4F8] rounded-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Hiza:</span>
                      <div className="flex bg-white rounded-lg p-1 shadow-sm">
                        {['left', 'center', 'right'].map((align) => (
                          <button 
                            key={align}
                            onClick={() => updateSlide(selectedSlideIdx, { textAlign: align as any })}
                            className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${selectedSlide.textAlign === align ? 'bg-[#2AB7CA] text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-4 w-px bg-slate-300"></div>
                     <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Font Küçük:</span>
                      <input type="checkbox" checked={!!selectedSlide.titleSmall} onChange={e => updateSlide(selectedSlideIdx, { titleSmall: e.target.checked })} />
                     </div>
                 </div>
              </section>

              {/* Visual Settings */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Görsel & Yerleşim</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400">Görsel Yerleşimi</label>
                     <select 
                       className="w-full p-3 text-sm rounded-xl border-transparent bg-[#F4F4F8] focus:bg-white focus:border-[#2AB7CA] outline-none"
                       value={selectedSlide.placement || 'background'}
                       onChange={e => updateSlide(selectedSlideIdx, { placement: e.target.value as any })}
                     >
                       <option value="background">Arkaplan</option>
                       <option value="left">Sol Kart</option>
                       <option value="right">Sağ Kart</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400">Süre (sn)</label>
                     <input 
                       type="number" min={1}
                       className="w-full p-3 text-sm rounded-xl border-transparent bg-[#F4F4F8] focus:bg-white focus:border-[#2AB7CA] outline-none"
                       value={selectedSlide.duration || 5}
                       onChange={e => updateSlide(selectedSlideIdx, { duration: Number(e.target.value) })}
                     />
                   </div>
                </div>
                
                {selectedSlide.placement !== 'background' && (
                   <div className="p-4 bg-[#F4F4F8] rounded-2xl space-y-3">
                      <label className="text-[10px] font-bold text-slate-400">Kart İç Boşlukları (Margin)</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['top', 'right', 'bottom', 'left'].map(side => (
                          <div key={side}>
                            <input 
                              type="number" 
                              placeholder={side[0].toUpperCase()}
                              className="w-full p-2 text-xs rounded-lg bg-white border border-slate-200 text-center focus:border-[#2AB7CA] outline-none"
                              value={(selectedSlide.margins as any)?.[side] || 0}
                              onChange={e => updateSlide(selectedSlideIdx, { margins: { ...(selectedSlide.margins || {}), [side]: Number(e.target.value) } })}
                            />
                            <span className="text-[9px] text-slate-400 block text-center mt-1 uppercase">{side}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                )}
              </section>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Icons.Edit />
              </div>
              <p className="text-sm font-medium">Düzenlemek için yukarıdan bir slayt seçin</p>
              <button onClick={() => setLibraryOpen(true)} className="mt-4 text-[#2AB7CA] text-xs font-bold hover:underline">
                + Yeni Slayt Ekle
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end items-center">
           <div className="text-[10px] text-slate-400">
             Son düzenleme: Taslak
           </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW */}
      <div className="w-1/2 flex flex-col relative bg-[#E5E5E5]">
        {/* Preview Toolbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-xl px-4 py-2 flex items-center gap-4 z-20 border border-slate-100">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { setViewMode('desktop'); setZoomLevel(0.45); setPreviewWidth(1280); setPreviewHeight(720); }}
              className={`p-2 rounded-full transition-all ${viewMode === 'desktop' ? 'bg-slate-100 text-[#2AB7CA]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Icons.Desktop />
            </button>
            <button 
              onClick={() => { setViewMode('mobile'); setZoomLevel(0.65); setPreviewWidth(375); setPreviewHeight(812); }}
              className={`p-2 rounded-full transition-all ${viewMode === 'mobile' ? 'bg-slate-100 text-[#2AB7CA]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Icons.Mobile />
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-200"></div>
          
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-slate-400">ZOOM</span>
             <input 
               type="range" 
               min="0.2" 
               max="1.5" 
               step="0.05" 
               value={zoomLevel} 
               onChange={e => setZoomLevel(parseFloat(e.target.value))}
               className="w-24 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2AB7CA]"
             />
             <span className="text-[10px] font-bold text-slate-500 w-8 text-right">{Math.round(zoomLevel * 100)}%</span>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
             <span>W:</span>
             <input 
               type="number" 
               value={previewWidth} 
               onChange={e => setPreviewWidth(Number(e.target.value))}
               className="w-12 p-1 bg-slate-100 rounded text-slate-600 text-center outline-none focus:ring-1 focus:ring-[#2AB7CA]"
             />
             <span>H:</span>
             <input 
               type="number" 
               value={previewHeight} 
               onChange={e => setPreviewHeight(Number(e.target.value))}
               className="w-12 p-1 bg-slate-100 rounded text-slate-600 text-center outline-none focus:ring-1 focus:ring-[#2AB7CA]"
             />
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-[#E5E5E5]">
           <div className="relative flex items-center justify-center w-full h-full">
             <div 
               style={{
                 width: `${previewWidth}px`,
                 height: `${previewHeight}px`,
                 transform: `scale(${zoomLevel})`,
                 transformOrigin: 'center center',
               }}
               className={`bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden relative ${
                 viewMode === 'mobile' 
                   ? 'rounded-[40px] border-[12px] border-slate-900' 
                   : 'rounded-none shadow-none'
               }`}
             >
                {/* Actual Hero Component Logic (Full Scale) */}
                <div className="w-full h-full overflow-y-auto bg-white relative group">
                   {/* Progress Bar */}
                   {(draft.slides || []).length > 1 && (
                     <div className="absolute top-0 left-0 w-full h-1 bg-black/10 z-50">
                       <div 
                          key={previewIdx} 
                          className="h-full bg-[#FED766]" 
                          style={{ 
                            width: '100%', 
                            animation: `progress ${(draft.slides?.[previewIdx]?.duration || 5)}s linear forwards` 
                          }} 
                       ></div>
                     </div>
                   )}
  
                   {/* Slide Render - FULL SIZE CLASSES RESTORED */}
                   {currentPreviewSlide ? (
                      currentPreviewSlide.placement === 'background' ? (
                        <div className="relative w-full h-full">
                           <img 
                             src={currentPreviewSlide.url} 
                             className="absolute inset-0 w-full h-full object-cover"
                             style={{
                                paddingTop: `${currentPreviewSlide.margins?.top || 0}px`,
                                paddingRight: `${currentPreviewSlide.margins?.right || 0}px`,
                                paddingBottom: `${currentPreviewSlide.margins?.bottom || 0}px`,
                                paddingLeft: `${currentPreviewSlide.margins?.left || 0}px`,
                             }}
                           />
                           <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)' }}></div>
                           <div className="relative h-full flex items-center px-20">
                              <div className={`w-full max-w-4xl ${currentPreviewSlide.textAlign === 'center' ? 'mx-auto text-center' : currentPreviewSlide.textAlign === 'right' ? 'ml-auto text-right' : ''}`}>
                                 <h1 className={`${currentPreviewSlide.titleSmall ? 'text-5xl' : 'text-7xl'} font-black text-white uppercase italic tracking-tighter leading-none mb-10 drop-shadow-lg`}>
                                   {currentPreviewSlide.title} {currentPreviewSlide.highlightNewLine ? <br/> : ' '}
                                   <span className="text-[#2AB7CA] underline decoration-[#FED766] decoration-4 underline-offset-8 not-italic">{currentPreviewSlide.titleHighlight}</span>
                                 </h1>
                                 <p className="text-2xl text-white/90 font-medium mb-10 max-w-2xl drop-shadow-md">{currentPreviewSlide.subtitle}</p>
                                 <div className={`flex flex-wrap gap-6 ${currentPreviewSlide.textAlign === 'center' ? 'justify-center' : currentPreviewSlide.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                    {currentPreviewSlide.cta && (
                                      <button className="px-10 py-5 bg-[#FE4A49] text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-[#FE4A49]/30 hover:translate-y-1 transition-transform">
                                        {currentPreviewSlide.cta}
                                      </button>
                                    )}
                                    {currentPreviewSlide.cta2 && (
                                      <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/40 text-white rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-white/20 transition-all">
                                        {currentPreviewSlide.cta2}
                                      </button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center bg-white px-20">
                           <div className={`w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center`}>
                              {currentPreviewSlide.placement === 'left' && (
                                 <div className="flex justify-center">
                                   <div className="relative aspect-square w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-black/5 rotate-2 transform transition-all duration-700 hover:rotate-0">
                                     <img 
                                       src={currentPreviewSlide.url} 
                                       className="w-full h-full object-cover" 
                                       style={{
                                        paddingTop: `${currentPreviewSlide.margins?.top || 0}px`,
                                        paddingRight: `${currentPreviewSlide.margins?.right || 0}px`,
                                        paddingBottom: `${currentPreviewSlide.margins?.bottom || 0}px`,
                                        paddingLeft: `${currentPreviewSlide.margins?.left || 0}px`,
                                     }}
                                     />
                                   </div>
                                 </div>
                              )}
                              
                              <div className={`${currentPreviewSlide.placement === 'right' ? 'order-first' : ''} ${currentPreviewSlide.textAlign === 'center' ? 'text-center' : currentPreviewSlide.textAlign === 'right' ? 'text-right' : 'text-left'}`}>
                                 <h1 className={`${currentPreviewSlide.titleSmall ? 'text-5xl' : 'text-7xl'} font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-10`}>
                                   {currentPreviewSlide.title} {currentPreviewSlide.highlightNewLine ? <br/> : ' '} 
                                   <span className="text-[#2AB7CA] underline decoration-[#FED766] decoration-4 underline-offset-8 not-italic">{currentPreviewSlide.titleHighlight}</span>
                                 </h1>
                                 <p className="text-2xl text-slate-600 font-medium mb-12 max-w-2xl">{currentPreviewSlide.subtitle}</p>
                                 <div className={`flex flex-wrap gap-6 ${currentPreviewSlide.textAlign === 'center' ? 'justify-center' : currentPreviewSlide.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                    {currentPreviewSlide.cta && (
                                      <button className="px-10 py-5 bg-[#FE4A49] text-white rounded-2xl font-black uppercase tracking-widest text-lg shadow-2xl shadow-[#FE4A49]/30 hover:translate-y-1 transition-transform">
                                        {currentPreviewSlide.cta}
                                      </button>
                                    )}
                                    {currentPreviewSlide.cta2 && (
                                      <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-slate-800 transition-all">
                                        {currentPreviewSlide.cta2}
                                      </button>
                                    )}
                                 </div>
                              </div>
  
                              {currentPreviewSlide.placement === 'right' && (
                                 <div className="flex justify-center">
                                   <div className="relative aspect-square w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-black/5 -rotate-2 transform transition-all duration-700 hover:rotate-0">
                                     <img 
                                       src={currentPreviewSlide.url} 
                                       className="w-full h-full object-cover" 
                                       style={{
                                        paddingTop: `${currentPreviewSlide.margins?.top || 0}px`,
                                        paddingRight: `${currentPreviewSlide.margins?.right || 0}px`,
                                        paddingBottom: `${currentPreviewSlide.margins?.bottom || 0}px`,
                                        paddingLeft: `${currentPreviewSlide.margins?.left || 0}px`,
                                     }}
                                     />
                                   </div>
                                 </div>
                              )}
                           </div>
                        </div>
                      )
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400">
                       Slayt yok
                     </div>
                   )}
                </div>
             </div>
           </div>
        </div>
      </div>

      {libraryOpen && (
        <MediaLibrary
          onClose={() => setLibraryOpen(false)}
          onSelect={(item: MediaItem) => {
            // Default new slide content
            const newSlide: Slide = { 
              url: item.url, 
              placement: 'background', 
              duration: 5, 
              isActive: true,
              title: 'YENİ BAŞLIK',
              titleHighlight: 'Highlight',
              subtitle: 'Alt başlık buraya...',
              cta: 'Detaylar',
              textAlign: 'left'
            };
            update({ 
              slides: [...(draft.slides || []), newSlide]
            });
            setLibraryOpen(false);
            setSelectedSlideIdx((draft.slides || []).length); // Select the new one
          }}
        />
      )}
      
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
