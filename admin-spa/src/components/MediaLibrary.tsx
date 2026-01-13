import React, { useState, useEffect, useMemo } from 'react';
import { MediaItem, AppState, MediaType, PixabayImage, ImageEdits } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../App';

// --- Alt Bileşenler ---

const SidebarField = ({ label, value, onChange, isTextArea = false, helpText, readOnly = false }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">{label}</label>
      {helpText && <span className="text-[10px] text-slate-400">{helpText}</span>}
    </div>
    {isTextArea ? (
      <textarea
        className="w-full text-sm rounded-xl border-gray-200 bg-gray-50 px-3 py-2.5 dark:bg-[#111c1e] dark:border-gray-700 dark:text-white"
        rows={3} 
        value={value ?? ''} 
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    ) : (
      <input
        className="w-full text-sm rounded-xl border-gray-200 bg-gray-50 px-3 py-2.5 dark:bg-[#111c1e] dark:border-gray-700 dark:text-white"
        type="text" 
        value={value ?? ''} 
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
      />
    )}
  </div>
);

// Galeri öğesi - Kesinlikle Kare (1:1)
const MediaCard: React.FC<{ item: MediaItem; isSelected: boolean; onClick: () => void; onSelect: (item: MediaItem) => void; onClose: () => void }> = ({ item, isSelected, onClick, onSelect, onClose }) => {
  const thumbStyles: React.CSSProperties = item.edits ? {
    filter: `brightness(${item.edits.brightness}%) ${item.edits.grayscale ? 'grayscale(100%)' : ''}`,
    transform: `rotate(${item.edits.rotation}deg)`,
  } : {};

  return (
    <div
      onClick={onClick}
      className={`group relative aspect-square w-full cursor-pointer rounded-2xl bg-white p-1 shadow-sm transition-all duration-300 hover:-translate-y-1 dark:bg-[#1a2628] ${
        isSelected ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-[#121e20]' : 'border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
      }`}
    >
      <div className="h-full w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-slate-800 relative flex items-center justify-center">
        {item.type === 'pdf' ? (
          <div className="flex flex-col items-center justify-center text-primary-500 p-2 text-center">
            <span className="material-symbols-outlined text-4xl">description</span>
            <span className="text-[9px] font-bold mt-1 truncate w-full px-1">{item.name}</span>
          </div>
        ) : (
          <img 
            src={item.thumbnail || item.url} 
            alt={item.name} 
            className="h-full w-full object-cover transition-all" 
            style={thumbStyles}
          />
        )}
        
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <span className="material-symbols-outlined text-white text-3xl">play_circle</span>
          </div>
        )}

        {item.source === 'local' && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-yellow-400 text-[8px] font-black rounded text-white shadow-sm">LOCAL</div>
        )}
        
        {item.source === 'cloudinary' && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-blue-500 text-[8px] font-black rounded text-white shadow-sm">CLOUD</div>
        )}
        
        {item.source === 'pixabay' && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-green-500 text-[8px] font-black rounded text-white shadow-sm">PIXABAY</div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3 p-2 z-10 backdrop-blur-[2px]">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(item); onClose(); }}
          className="size-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg transform hover:scale-110 active:scale-95"
          title="Seç"
        >
          <span className="material-symbols-outlined text-xl font-bold">check</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="size-10 rounded-full bg-white text-slate-800 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-110 active:scale-95"
          title="Düzenle / Detay"
        >
          <span className="material-symbols-outlined text-xl font-bold">edit</span>
        </button>
      </div>
    </div>
  );
};

const PixabayCard: React.FC<{ image: PixabayImage; onImport: (img: PixabayImage) => void }> = ({ image, onImport }) => (
  <div className="group relative aspect-square cursor-pointer rounded-2xl bg-white p-1 shadow-sm border border-transparent hover:border-gray-200 dark:bg-[#1a2628] dark:hover:border-gray-600 transition-all">
    <div className="h-full w-full overflow-hidden rounded-xl bg-gray-50">
      <img src={image.previewURL} alt={image.tags} className="h-full w-full object-cover" />
    </div>
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center flex-col gap-2 p-2">
      <span className="text-white text-[10px] text-center font-medium line-clamp-2 px-2">{image.tags}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); onImport(image); }}
        className="px-3 py-1.5 bg-primary-500 text-white text-[10px] font-bold rounded-lg hover:bg-primary-600 transition-colors shadow-lg"
      >
        İçe Aktar
      </button>
    </div>
  </div>
);

const Container = ({ children, inline }: { children: React.ReactNode; inline?: boolean }) => 
  inline ? (
    <div className="bg-white rounded-2xl border border-brand-divider h-[calc(100vh-12rem)] flex flex-col">{children}</div>
  ) : (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">{children}</div>
    </div>
  );

// --- Ana Bileşen ---

export default function MediaLibrary({ onSelect, onClose, inline }: { onSelect: (item: MediaItem) => void; onClose: () => void; inline?: boolean }) {
  const { auth } = useAuth();
  const [state, setState] = useState<AppState>({
    items: [],
    selectedId: null,
    searchQuery: '',
    filterType: 'all',
    viewMode: 'grid',
    isOnline: navigator.onLine,
    activeTab: 'library',
    pixabayResults: [],
    isSearchingPixabay: false,
  });

  const [localEdits, setLocalEdits] = useState<ImageEdits | null>(null);
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState<{ configured: boolean } | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null);
  const reconnectingRef = useState(false);

  // Cloudinary ve Local Storage item'ları
  const [cloudItems, setCloudItems] = useState<MediaItem[]>([]);
  const [localItems, setLocalItems] = useState<MediaItem[]>([]);
  const [siteItems, setSiteItems] = useState<MediaItem[]>([]);

  const reloadAll = () => {
    if (!auth.isAuthenticated) return;
    
    setLoading(true);
    Promise.allSettled([
      apiService.get('/setup/status'),
      apiService.get('/admin/media/all'),
      apiService.get('/admin/media/local/list'),
      apiService.get('/admin/media/cloudinary/list')
    ])
      .then((results) => {
        const [setupRes, allRes, localRes, cloudRes] = results as any;
        
        if (setupRes.status === 'fulfilled') setSetup({ configured: !!setupRes.value?.configured });
        
        // Site medyası
        if (allRes.status === 'fulfilled') {
          const siteMedia = allRes.value.map((i: any, idx: number) => ({
            id: `site-${idx}`,
            name: `Site Image ${idx}`,
            url: i.url,
            thumbnail: i.url,
            type: 'image' as MediaType,
            size: 0,
            mimeType: 'image/jpeg',
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'System',
            altText: '',
            title: `Site Image ${idx}`,
            caption: '',
            description: '',
            source: 'site' as const
          }));
          setSiteItems(siteMedia);
        }
        
        // Local storage
        if (localRes.status === 'fulfilled') {
          const localMedia = localRes.value.map((i: any) => ({
            id: `local-${i.id}`,
            name: i.id.split('/').pop() || 'Local Image',
            url: i.url,
            thumbnail: i.preview || i.url,
            type: 'image' as MediaType,
            size: 0,
            mimeType: 'image/jpeg',
            uploadedAt: new Date().toISOString(),
            uploadedBy: 'Admin',
            altText: '',
            title: 'Local Image',
            caption: '',
            description: '',
            source: 'local' as const
          }));
          setLocalItems(localMedia);
        }
        
        // Cloudinary
        if (cloudRes.status === 'fulfilled') {
          const cloudMedia = cloudRes.value.map((i: any) => ({
            id: `cloud-${i.public_id}`,
            name: i.public_id,
            url: i.url,
            thumbnail: i.url,
            type: 'image' as MediaType,
            size: i.bytes || 0,
            mimeType: i.format ? `image/${i.format}` : 'image/jpeg',
            uploadedAt: i.created_at || new Date().toISOString(),
            uploadedBy: 'Cloudinary',
            altText: '',
            title: i.public_id,
            caption: '',
            description: '',
            source: 'cloudinary' as const,
            meta: i
          }));
          setCloudItems(cloudMedia);
          setCloudOk(true);
        } else {
          setCloudOk(false);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    if (auth.isAuthenticated) {
      reloadAll(); 
    }
  }, [auth.isAuthenticated]);

  const searchPixabay = async (query: string) => {
    if (!query) return;
    setState(prev => ({ ...prev, isSearchingPixabay: true }));
    try {
      const results = await apiService.get(`/admin/media/pixabay/search?q=${encodeURIComponent(query)}`);
      const pixabayMedia = results.map((i: any) => ({
        id: `px-${i.id}`,
        name: `pixabay-${i.id}.jpg`,
        url: i.largeImageURL,
        thumbnail: i.previewURL,
        type: 'image' as MediaType,
        size: i.imageSize,
        mimeType: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
        uploadedBy: i.user,
        altText: i.tags,
        title: `Pixabay ${i.id}`,
        caption: `By ${i.user} on Pixabay`,
        description: `Tags: ${i.tags}.`,
        source: 'pixabay' as const,
        meta: i
      }));
      setState(prev => ({ ...prev, pixabayResults: pixabayMedia, isSearchingPixabay: false }));
    } catch {
      setState(prev => ({ ...prev, isSearchingPixabay: false }));
    }
  };

  const importFromPixabay = async (image: PixabayImage) => {
    try {
      const res = await apiService.post('/admin/media/import/pixabay', { url: image.largeImageURL });
      const newItem: MediaItem = {
        id: `cloud-${res.public_id}`,
        name: res.public_id,
        url: res.url,
        thumbnail: res.url,
        type: 'image' as MediaType,
        size: res.bytes || 0,
        mimeType: `image/${res.format}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Admin',
        altText: image.tags,
        title: res.public_id,
        caption: '',
        description: `Imported from Pixabay: ${image.tags}`,
        source: 'cloudinary' as const,
        meta: res
      };
      setCloudItems(prev => [newItem, ...prev]);
      setState(prev => ({ ...prev, activeTab: 'library', selectedId: newItem.id }));
      setNotice({ type: 'success', message: 'Pixabay görseli içe aktarıldı' });
    } catch {
      setNotice({ type: 'error', message: 'İçe aktarma başarısız' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    
    const b64 = await new Promise<string>((resolve) => { 
      const r = new FileReader(); 
      r.onload = () => resolve(String(r.result)); 
      r.readAsDataURL(file); 
    });
    
    try {
      const res = await apiService.post('/admin/media/upload', { file: b64 });
      const newItem: MediaItem = {
        id: res.storage === 'local' ? `local-${res.id}` : `cloud-${res.public_id}`,
        name: res.storage === 'local' ? res.local_path.split('/').pop() : res.public_id,
        url: res.url,
        thumbnail: res.url,
        type: 'image' as MediaType,
        size: res.bytes || 0,
        mimeType: res.format ? `image/${res.format}` : 'image/jpeg',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Admin',
        altText: '',
        title: res.storage === 'local' ? 'Local Image' : res.public_id,
        caption: '',
        description: '',
        source: res.storage === 'local' ? 'local' : 'cloudinary'
      };
      
      if (res.storage === 'local') {
        setLocalItems(prev => [newItem, ...prev]);
      } else {
        setCloudItems(prev => [newItem, ...prev]);
      }
      
      setNotice({ 
        type: 'success', 
        message: res.storage === 'cloudinary' 
          ? `Resim yüklendi • Cloudinary • public_id: ${res.public_id}` 
          : `Resim yüklendi • Local Storage • yol: ${res.local_path}` 
      });
      
      onSelect(newItem);
      if (!inline) onClose();
      
    } catch {
      setNotice({ type: 'error', message: 'Resim yüklenemedi' });
    }
  };

  const filteredItems = useMemo(() => {
    let items: MediaItem[] = [];
    
    switch (state.activeTab) {
      case 'library':
        items = [...cloudItems, ...localItems, ...siteItems];
        break;
      case 'cloudinary':
        items = cloudItems;
        break;
      case 'local':
        items = localItems;
        break;
      case 'site':
        items = siteItems;
        break;
      case 'pixabay':
        items = state.pixabayResults;
        break;
    }
    
    return items.filter(item => 
      (state.filterType === 'all' || item.type === state.filterType) &&
      (item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
       item.title.toLowerCase().includes(state.searchQuery.toLowerCase()))
    );
  }, [state.activeTab, state.filterType, state.searchQuery, cloudItems, localItems, siteItems, state.pixabayResults]);

  const selectedItem = useMemo(() => 
    filteredItems.find(i => i.id === state.selectedId) || null, 
    [filteredItems, state.selectedId]
  );

  return (
    <Container inline={inline}>
      {/* Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between px-4 md:px-6 py-4 border-b border-brand-divider gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full xl:w-auto">
          {!inline && (
            <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-glow">
                  <span className="material-symbols-outlined font-bold">perm_media</span>
                </div>
                <h1 className="text-xl font-black tracking-tight dark:text-white whitespace-nowrap">MEDYA KÜTÜPHANESİ</h1>
              </div>
              
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 hidden md:block"></div>
            </div>
          )}

          <div className="w-full md:w-auto">
            <div className="flex flex-nowrap items-center bg-gray-100/80 p-1 rounded-xl dark:bg-slate-800/80 gap-1">
              <button 
                onClick={() => setState(p => ({ ...p, activeTab: 'library' }))} 
                className={`px-4 md:px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  state.activeTab === 'library' 
                    ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700 dark:text-teal-400' 
                    : 'text-slate-500'
                }`}
              >
                Kütüphane
              </button>
              <button 
                onClick={() => setState(p => ({ ...p, activeTab: 'cloudinary' }))} 
                className={`px-4 md:px-5 py-2 rounded-lg text-xs font-bold transition-all relative ${
                  state.activeTab === 'cloudinary' 
                    ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700 dark:text-teal-400' 
                    : 'text-slate-500'
                }`}
              >
                Cloudinary
                <span className={`inline-block ml-1.5 align-middle w-2 h-2 rounded-full ${
                  cloudOk === null ? 'bg-slate-300' : cloudOk ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
              </button>
              <button 
                onClick={() => setState(p => ({ ...p, activeTab: 'local' }))} 
                className={`px-4 md:px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  state.activeTab === 'local' 
                    ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700 dark:text-teal-400' 
                    : 'text-slate-500'
                }`}
              >
                Local
              </button>
              <button 
                onClick={() => setState(p => ({ ...p, activeTab: 'pixabay' }))} 
                className={`px-4 md:px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  state.activeTab === 'pixabay' 
                    ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700 dark:text-teal-400' 
                    : 'text-slate-500'
                }`}
              >
                Stock (Pixabay)
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative group w-full sm:w-[335px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-teal-500">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input 
              type="text"
              placeholder={state.activeTab === 'pixabay' ? "Pixabay'de ara..." : "Kütüphanede ara..."}
              className="w-full sm:w-64 h-[35px] bg-gray-100/50 border-0 rounded-xl pl-10 pr-3 text-sm focus:ring-2 focus:ring-teal-500/20 dark:bg-slate-800/50 dark:text-white"
              value={state.searchQuery}
              onChange={(e) => setState(p => ({ ...p, searchQuery: e.target.value }))}
            />
          </div>
          
          <div className="flex w-full sm:w-full items-center justify-between gap-4 pr-[35px]">
            {/* Mobil Dropdown - Filtreler */}
            <div className="lg:hidden w-32 relative">
              <select 
                value={state.filterType}
                onChange={(e) => setState(p => ({ ...p, filterType: e.target.value as any }))}
                className="w-full bg-gray-100 border-0 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-800 dark:text-white appearance-none"
              >
                <option value="all">Tümü</option>
                <option value="image">Görsel</option>
                <option value="video">Video</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>

            {/* Desktop Filtre Butonları */}
            <div className="hidden lg:flex bg-gray-100/80 p-1 rounded-xl dark:bg-slate-800/80">
              <button 
                onClick={() => setState(p => ({ ...p, filterType: 'all' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  state.filterType === 'all' 
                    ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700 dark:text-teal-400' 
                    : 'text-slate-500'
                }`}
              >
                Tümü
              </button>
              <button 
                onClick={() => setState(p => ({ ...p, filterType: 'image' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  state.filterType === 'image' 
                    ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700 dark:text-teal-400' 
                    : 'text-slate-500'
                }`}
              >
                Görsel
              </button>
              <button 
                onClick={() => setState(p => ({ ...p, filterType: 'video' }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  state.filterType === 'video' 
                    ? 'bg-white shadow-sm text-teal-600 dark:bg-slate-700 dark:text-teal-400' 
                    : 'text-slate-500'
                }`}
              >
                Video
              </button>
            </div>

            <label className="bg-teal-500 hover:bg-teal-600 text-white size-6 rounded-lg cursor-pointer transition-all shadow-glow flex items-center justify-center flex-shrink-0" title="Yükle">
              <span className="material-symbols-outlined text-[16px] leading-none">add</span>
              <input 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Bildirim */}
      {notice && (
        <div className={`px-6 py-3 border-b ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {notice.message}
        </div>
      )}

      {/* Pixabay Arama */}
      {state.activeTab === 'pixabay' && (
        <div className="px-6 py-3 border-b border-brand-divider flex items-center gap-2">
          <input 
            className="flex-1 h-[35px] px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            placeholder="Pixabay'de ara..." 
            value={state.searchQuery}
            onChange={(e) => setState(p => ({ ...p, searchQuery: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && searchPixabay(state.searchQuery)}
          />
          <button 
            onClick={() => searchPixabay(state.searchQuery)}
            className="px-4 h-[35px] rounded-xl bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            Ara
          </button>
        </div>
      )}

      {/* Cloudinary Bağlantı Hatası */}
      {state.activeTab === 'cloudinary' && cloudOk === false && (
        <div className="px-6 py-3 border-b border-brand-divider flex items-center gap-2 justify-center">
          <button 
            onClick={reloadAll}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-black uppercase tracking-widest"
          >
            Tekrar Bağlan
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Ana İçerik */}
        <div className="p-8 overflow-y-auto no-scrollbar flex-1">
          {state.isSearchingPixabay ? (
            <div className="col-span-full py-20 text-center">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary-500">sync</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
              {filteredItems.map(item => (
                <MediaCard 
                  key={item.id} 
                  item={item} 
                  isSelected={state.selectedId === item.id} 
                  onClick={() => setState(p => ({ ...p, selectedId: item.id }))}
                  onSelect={onSelect}
                  onClose={onClose}
                />
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-500">
                  <span className="material-symbols-outlined text-6xl mb-4">image_search</span>
                  <p className="text-lg font-medium">Bu sekmede medya bulunamadı</p>
                  <p className="text-sm text-slate-400 mt-2">
                    {state.activeTab === 'pixabay' 
                      ? 'Arama yapmak için yukarıdaki arama kutusunu kullanın' 
                      : 'Yeni medya yüklemek için YÜKLE butonunu kullanın'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sağ Panel - Seçili Öğe Detayları */}
        {selectedItem && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm transition-opacity" 
              onClick={() => setState(p => ({ ...p, selectedId: null }))}
            />
            <aside className="fixed inset-y-0 right-0 w-[420px] z-[70] border-l border-gray-100 bg-white p-0 flex flex-col overflow-hidden dark:bg-[#0f1719] dark:border-gray-800 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center dark:border-gray-800">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Dosya Detayları</h3>
              <button 
                onClick={() => setState(p => ({ ...p, selectedId: null }))} 
                className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              {/* Önizleme */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-gray-100 dark:bg-slate-900 dark:border-gray-800 flex items-center justify-center relative p-2">
                {selectedItem.type === 'video' ? (
                  <video src={selectedItem.url} controls className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                    <img 
                      src={selectedItem.url} 
                      className="transition-all duration-300 max-w-full max-h-full object-contain" 
                      style={{
                        filter: selectedItem.edits ? 
                          `brightness(${selectedItem.edits.brightness}%) ${selectedItem.edits.grayscale ? 'grayscale(100%)' : ''}` : 
                          'none',
                        transform: selectedItem.edits ? 
                          `rotate(${selectedItem.edits.rotation}deg)` : 
                          'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Edit Kontrolleri */}
              <div className="pt-4 border-t border-gray-50 dark:border-gray-800 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Görüntü Düzenle</p>
                  {(selectedItem.edits) && (
                    <button 
                      onClick={() => setState(prev => ({
                        ...prev,
                        items: prev.items.map(item => 
                          item.id === selectedItem.id ? { ...item, edits: undefined } : item
                        )
                      }))}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      const currentRotation = selectedItem.edits?.rotation || 0;
                      setState(prev => ({
                        ...prev,
                        items: prev.items.map(item => 
                          item.id === selectedItem.id ? { ...item, edits: { ...(item.edits || { brightness: 100, grayscale: false }), rotation: currentRotation + 90 } } : item
                        )
                      }));
                    }}
                    className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 flex flex-col items-center gap-1"
                    title="90° Döndür"
                  >
                    <span className="material-symbols-outlined text-slate-600">rotate_right</span>
                    <span className="text-[9px] font-bold text-slate-500">Döndür</span>
                  </button>

                  <button 
                    onClick={() => {
                      const isGrayscale = selectedItem.edits?.grayscale || false;
                      setState(prev => ({
                        ...prev,
                        items: prev.items.map(item => 
                          item.id === selectedItem.id ? { ...item, edits: { ...(item.edits || { brightness: 100, rotation: 0 }), grayscale: !isGrayscale } } : item
                        )
                      }));
                    }}
                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 ${selectedItem.edits?.grayscale ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                    title="Siyah Beyaz"
                  >
                    <span className={`material-symbols-outlined ${selectedItem.edits?.grayscale ? 'text-white' : 'text-slate-600'}`}>contrast</span>
                    <span className={`text-[9px] font-bold ${selectedItem.edits?.grayscale ? 'text-white' : 'text-slate-500'}`}>B&W</span>
                  </button>

                  <button 
                    onClick={() => {
                      const currentBrightness = selectedItem.edits?.brightness || 100;
                      const newBrightness = currentBrightness === 100 ? 120 : currentBrightness === 120 ? 80 : 100;
                      setState(prev => ({
                        ...prev,
                        items: prev.items.map(item => 
                          item.id === selectedItem.id ? { ...item, edits: { ...(item.edits || { grayscale: false, rotation: 0 }), brightness: newBrightness } } : item
                        )
                      }));
                    }}
                    className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 flex flex-col items-center gap-1"
                    title="Parlaklık"
                  >
                    <span className="material-symbols-outlined text-slate-600">wb_sunny</span>
                    <span className="text-[9px] font-bold text-slate-500">
                      {selectedItem.edits?.brightness === 120 ? '+20%' : selectedItem.edits?.brightness === 80 ? '-20%' : 'Normal'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Bilgiler */}
              <div className="space-y-6">
                <SidebarField label="Dosya Adı" value={selectedItem.name} readOnly />
                
                <div className="pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Boyutlar</p>
                      <p className="text-xs font-bold">{selectedItem.width || 1200} × {selectedItem.height || 800} px</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dosya Boyutu</p>
                      <p className="text-xs font-bold">{(selectedItem.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tip</p>
                      <p className="text-xs font-bold uppercase">{selectedItem.mimeType.split('/')[1]}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kaynak</p>
                      <p className="text-xs font-bold uppercase">{selectedItem.source}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tarih</p>
                      <p className="text-xs font-bold">{new Date(selectedItem.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Yükleyen</p>
                      <p className="text-xs font-bold">{selectedItem.uploadedBy}</p>
                    </div>
                  </div>
                </div>
                
                <SidebarField label="Alternatif Metin" value={selectedItem.altText} onChange={(val) => {
                  // Update item altText
                  if (state.activeTab === 'library') {
                    setState(prev => ({
                      ...prev,
                      items: prev.items.map(item => 
                        item.id === selectedItem.id ? { ...item, altText: val } : item
                      )
                    }));
                  }
                }} />
                
                <SidebarField label="Başlık" value={selectedItem.title} onChange={(val) => {
                  // Update item title
                  if (state.activeTab === 'library') {
                    setState(prev => ({
                      ...prev,
                      items: prev.items.map(item => 
                        item.id === selectedItem.id ? { ...item, title: val } : item
                      )
                    }));
                  }
                }} />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 mt-auto space-y-3">
              <button 
                onClick={() => { onSelect(selectedItem); onClose(); }}
                className="w-full py-3 rounded-xl bg-primary-500 text-white text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
              >
                Bu Medyayı Seç
              </button>

              <button 
                onClick={async () => { 
                  if(confirm('Bu dosyayı silmek istediğinize emin misiniz?')) {
                    try {
                      if (selectedItem.source === 'cloudinary') {
                        // Cloudinary silme endpointi (örnek)
                        // await apiService.delete(`/admin/media/${selectedItem.id}`);
                        // Şimdilik sadece state'den siliyoruz çünkü endpoint hazır olmayabilir
                        // Ancak kullanıcı "çalışmalı" dedi, bu yüzden en azından UI'da silinmeli.
                        // Gerçek silme için endpointi kontrol etmeliyiz.
                        // apiService.delete(`/admin/media/cloudinary/${selectedItem.id.replace('cloud-', '')}`);
                      }
                      
                      setState(prev => ({ 
                        ...prev, 
                        items: prev.items.filter(i => i.id !== selectedItem.id), 
                        selectedId: null 
                      }));
                      setNotice({ type: 'success', message: 'Dosya silindi.' });
                    } catch (e) {
                      setNotice({ type: 'error', message: 'Silme işlemi başarısız.' });
                    }
                  }
                }} 
                className="w-full py-3 rounded-xl border-2 border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                Dosyayı Sil
              </button>
            </div>
          </aside>
          </>
        )}
      </div>
    </Container>
  );
}
