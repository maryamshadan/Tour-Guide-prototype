
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ViewState, User, Monument, SafetyLevel, POI, Badge, NavigationStep, Contact, Contribution, Language } from './types';
import { ShieldIcon, MapIcon, CameraIcon, UserIcon, AlertIcon, PhoneIcon, MicIcon, HotelIcon, UtensilsIcon, BadgeIcon, ArrowUpIcon, ArrowLeftIcon, ArrowRightIcon, FlagIcon, PencilIcon, CheckIcon, CloudIcon, CloudOffIcon, RefreshIcon, TrashIcon, FlashIcon, ImageIcon } from './components/Icons';
import { Logo } from './components/Logo';
import { identifyLandmark, getChatResponse } from './services/geminiService';
import { db } from './services/database';
import { syncService } from './services/syncService';
import { MONUMENTS, BADGES } from './constants';
import { UI_STRINGS } from './translations';

// Declare Leaflet and Speech Recognition globals
declare global {
    interface Window {
        L: any;
        webkitSpeechRecognition: any;
    }
}

// --- Components ---

// 0. Auth View (Login Page)
const AuthView = ({ onLogin, language }: { onLogin: (user: User) => void, language: Language }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const t = UI_STRINGS[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    
    const newUser: User = {
      name,
      email,
      language,
      emergencyContacts: [{ id: '1', name: 'Telangana Police', phone: '100' }],
      badges: [],
      visitedMonuments: []
    };

    await db.saveUser(newUser);
    setTimeout(() => {
        onLogin(newUser);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="h-full bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 animate-fade-in">
        <div className="mb-10 text-center flex flex-col items-center">
            <Logo className="w-24 h-24 mb-6" />
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">TourGuide</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">{t.header_tagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[1.5rem] outline-none focus:border-primary-500 transition-all font-bold"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-[1.5rem] outline-none focus:border-primary-500 transition-all font-bold"
                />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-600/30 active:scale-95 transition-all disabled:opacity-50"
            >
                {loading ? 'Creating Profile...' : 'Start Your Journey'}
            </button>
        </form>

        <p className="mt-12 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
            Your safety and heritage companion for Telangana.
        </p>
    </div>
  );
};

// 1. Layout Component
interface LayoutProps {
  children: React.ReactNode;
  view: ViewState;
  setView: (view: ViewState) => void;
  sosActive: boolean;
  triggerSOS: () => void;
  sosOverlay: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOnline: boolean;
  isSyncing: boolean;
  language: Language;
  setLanguage: (l: Language) => void;
  offlineOverride: boolean;
  setOfflineOverride: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, view, setView, sosActive, triggerSOS, sosOverlay, darkMode, toggleDarkMode, isOnline, isSyncing, language, setLanguage, offlineOverride, setOfflineOverride }) => {
  const t = UI_STRINGS[language];
  const effectiveOffline = !isOnline || offlineOverride;
  
  if (view === 'AUTH') return <main className="h-full">{children}</main>;

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 p-3 flex justify-between items-center shadow-sm z-30 select-none">
            <div onClick={() => setView('HOME')} className="cursor-pointer">
              <Logo className="w-10 h-10" showText={true} language={language} />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                {(['en', 'hi', 'te'] as Language[]).map(l => (
                  <button 
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${language === l ? 'bg-white dark:bg-slate-600 shadow-sm text-primary-600' : 'text-slate-400'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setOfflineOverride(!offlineOverride)} 
                className={`p-2 rounded-full transition-colors ${effectiveOffline ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                  {isSyncing ? <RefreshIcon className="w-5 h-5 animate-spin" /> : effectiveOffline ? <CloudOffIcon className="w-5 h-5" /> : <CloudIcon className="w-5 h-5 text-green-500" />}
              </button>

              <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  {darkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={triggerSOS} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center shadow-md animate-pulse-fast">
                  <AlertIcon className="w-4 h-4 mr-1" /> {t.btn_sos}
              </button>
            </div>
        </header>

        {effectiveOffline && (
            <div className="bg-amber-500 text-white px-4 py-1.5 text-[10px] font-bold flex justify-between items-center z-20 shadow-inner uppercase tracking-wider">
                <span className="flex items-center gap-2">
                    <CloudOffIcon className="w-3 h-3" /> {t.status_offline}
                </span>
                {isOnline && (
                    <button onClick={() => setOfflineOverride(false)} className="bg-white/20 px-2 py-0.5 rounded">
                        {t.go_online}
                    </button>
                )}
            </div>
        )}
        
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>

        <nav className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 h-20 pb-4 flex justify-around items-center z-30 shadow-lg">
          <button onClick={() => setView('HOME')} className={`flex flex-col items-center gap-1 ${view === 'HOME' ? 'text-primary-600' : 'text-slate-400'}`}>
            <MapIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t.nav_map}</span>
          </button>
          <button onClick={() => setView('LIST')} className={`flex flex-col items-center gap-1 ${view === 'LIST' ? 'text-primary-600' : 'text-slate-400'}`}>
            <RefreshIcon className="w-6 h-6 rotate-90" />
            <span className="text-[10px] font-bold">{t.nav_list}</span>
          </button>
          <button onClick={() => setView('CAMERA')} className={`flex flex-col items-center gap-1 ${view === 'CAMERA' ? 'text-primary-600' : 'text-slate-400'}`}>
            <div className={`p-1.5 rounded-full ${view === 'CAMERA' ? 'bg-primary-600 text-white -mt-4 shadow-xl' : ''}`}>
              <CameraIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">{t.nav_guide}</span>
          </button>
          <button onClick={() => setView('VOICE_ASSISTANT')} className={`flex flex-col items-center gap-1 ${view === 'VOICE_ASSISTANT' ? 'text-primary-600' : 'text-slate-400'}`}>
            <MicIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t.nav_voice}</span>
          </button>
          <button onClick={() => setView('PROFILE')} className={`flex flex-col items-center gap-1 ${view === 'PROFILE' ? 'text-primary-600' : 'text-slate-400'}`}>
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">{t.nav_profile}</span>
          </button>
        </nav>

        {sosActive && sosOverlay}
    </div>
  );
};

// 2. Map View Component
const MapView = ({ monuments, onMonumentSelect, onEnterAR, selectedMonument }: { monuments: Monument[], onMonumentSelect: (m: Monument) => void, onEnterAR: () => void, selectedMonument: Monument | null }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerClusterGroup = useRef<any>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = useMemo(() => {
    const types = Array.from(new Set(monuments.map(m => m.type)));
    return ['All', ...types];
  }, [monuments]);

  const filteredMonuments = useMemo(() => {
    if (filter === 'All') return monuments;
    return monuments.filter(m => m.type === filter);
  }, [monuments, filter]);

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstance.current) {
      navigator.geolocation.getCurrentPosition((pos) => {
        mapInstance.current.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1.5 });
      });
    }
  };

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = window.L.map(mapContainer.current, {
      center: [17.3850, 78.4867],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
      className: 'map-tiles-sepia'
    }).addTo(mapInstance.current);

    markerClusterGroup.current = window.L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 40
    });
    mapInstance.current.addLayer(markerClusterGroup.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!markerClusterGroup.current) return;
    
    markerClusterGroup.current.clearLayers();

    filteredMonuments.forEach(m => {
      const isSelected = selectedMonument?.id === m.id;
      const marker = window.L.marker([m.lat, m.lon], {
        icon: window.L.divIcon({
          className: 'custom-marker-icon',
          html: `
            <div class="relative w-12 h-12 flex items-center justify-center">
              ${isSelected ? '<div class="marker-pulse"></div>' : ''}
              <div class="w-10 h-10 bg-white dark:bg-slate-800 rounded-full border-2 ${isSelected ? 'border-primary-600 scale-110' : 'border-white shadow-lg'} overflow-hidden transition-all">
                 <img src="${m.imageUrl}" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full ${m.safetyScore > 80 ? 'bg-nature-500' : 'bg-accent-500'} border-2 border-white shadow-sm flex items-center justify-center">
                 ${m.cached ? '<div class="w-1.5 h-1.5 bg-white rounded-full"></div>' : ''}
              </div>
            </div>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 48]
        })
      });

      marker.on('click', () => onMonumentSelect(m));
      markerClusterGroup.current.addLayer(marker);
    });
  }, [filteredMonuments, selectedMonument, onMonumentSelect]);

  useEffect(() => {
    if (selectedMonument && mapInstance.current) {
      mapInstance.current.flyTo([selectedMonument.lat, selectedMonument.lon], 16, { duration: 1.2 });
    }
  }, [selectedMonument]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full z-0" />
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-10">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 dark:border-slate-700 pointer-events-auto max-w-[200px]">
           <MapIcon className="w-5 h-5 text-primary-600" />
           <span className="text-xs font-black truncate tracking-tight">{filter === 'All' ? 'Telangana Sites' : `${filter}s`}</span>
        </div>
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button onClick={handleLocateMe} className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 text-primary-600 active:scale-95 transition-all">
            <RefreshIcon className="w-6 h-6" />
          </button>
          <button onClick={onEnterAR} className="bg-primary-600 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-all border border-white/20">
            <CameraIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 overflow-x-auto no-scrollbar flex px-6 gap-3 z-10">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg transition-all border ${
              filter === cat 
              ? 'bg-primary-600 text-white border-primary-600 scale-105' 
              : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-500 border-slate-100 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

// 3. Monument List View
const ListView = ({ monuments, onSelect, language }: { monuments: Monument[], onSelect: (m: Monument) => void, language: Language }) => {
  const [search, setSearch] = useState('');
  const t = UI_STRINGS[language];
  const filtered = monuments.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 p-6 overflow-hidden animate-fade-in">
        <h2 className="text-3xl font-black mb-6 tracking-tight dark:text-white pt-4">{t.monument_list_title}</h2>
        <div className="relative mb-6">
            <input 
              type="text" 
              placeholder={t.search_placeholder} 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:border-primary-500 transition-colors shadow-sm outline-none"
            />
            <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-10">
            {filtered.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => onSelect(m)}
                  className="bg-white dark:bg-slate-800 p-3 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer"
                >
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-inner">
                        <img 
                            src={m.imageUrl} 
                            className="w-full h-full object-cover" 
                            alt={m.name} 
                            referrerPolicy="no-referrer" 
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-slate-800 dark:text-white tracking-tight">{m.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.type}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <ShieldIcon className={`w-3.5 h-3.5 ${m.safetyScore > 80 ? 'text-nature-500' : 'text-accent-500'}`} />
                            <span className="text-[10px] font-black">{m.safetyScore}%</span>
                            {m.cached && <div className="text-[8px] bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-2 py-0.5 rounded-full font-black uppercase">Offline</div>}
                        </div>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-slate-300 mr-2" />
                </div>
            ))}
        </div>
    </div>
  );
};

// 4. Detail Panel
const DetailPanel = ({ monument, isOffline, user, onClose, onNavigate }: { monument: Monument, isOffline: boolean, user: User | null, onClose: () => void, onNavigate: () => void }) => {
  const [stories, setStories] = useState<Contribution[]>([]);
  const [nearbyPOIs, setNearbyPOIs] = useState<POI[]>([]);
  const [newStory, setNewStory] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const t = UI_STRINGS[user?.language || 'en'];

  useEffect(() => { 
    loadStories(); 
    loadNearbyPOIs();
  }, [monument.id]);

  const loadStories = async () => {
    const list = await db.getContributions(monument.id);
    setStories(list.sort((a, b) => b.timestamp - a.timestamp));
  };

  const loadNearbyPOIs = async () => {
    const allPois = await db.getAllPOIs();
    // Filter POIs within approx 5km (rough lat/lon calculation for demo)
    const nearby = allPois.filter(p => {
        const dLat = Math.abs(p.lat - monument.lat);
        const dLon = Math.abs(p.lon - monument.lon);
        return dLat < 0.05 && dLon < 0.05;
    }).slice(0, 10);
    setNearbyPOIs(nearby);
  };

  const handlePostStory = async () => {
    if (!newStory.trim() || !user) return;
    setIsPosting(true);
    const contribution: Omit<Contribution, 'id'> = {
        userId: user.email,
        userName: user.name,
        type: 'STORY',
        content: newStory,
        monumentId: monument.id,
        timestamp: Date.now(),
        synced: 0
    };
    await db.addContribution(contribution);
    setNewStory('');
    await loadStories();
    setIsPosting(false);
  };

  const getPoiIcon = (type: string) => {
    switch (type) {
        case 'HOTEL': return <HotelIcon className="w-5 h-5" />;
        case 'RESTAURANT': return <UtensilsIcon className="w-5 h-5" />;
        case 'POLICE': return <ShieldIcon className="w-5 h-5" />;
        case 'HOSPITAL': return <AlertIcon className="w-5 h-5" />;
        default: return <MapIcon className="w-5 h-5" />;
    }
  };

  const getPoiColor = (type: string) => {
    switch (type) {
        case 'HOTEL': return 'bg-blue-500';
        case 'RESTAURANT': return 'bg-orange-500';
        case 'POLICE': return 'bg-slate-700';
        case 'HOSPITAL': return 'bg-red-500';
        default: return 'bg-primary-500';
    }
  };

  return (
    <div className="absolute inset-0 z-50 animate-slide-up bg-white dark:bg-slate-900 overflow-y-auto no-scrollbar">
        <div className="relative h-80 bg-slate-200 dark:bg-slate-800">
            <img src={monument.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <button onClick={onClose} className="absolute top-6 left-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white shadow-xl">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-6 right-6 text-white">
                <h2 className="text-4xl font-black font-serif tracking-tight drop-shadow-lg">{monument.name}</h2>
                <p className="text-xs uppercase tracking-[0.3em] font-black opacity-80 mb-2">{monument.type}</p>
            </div>
        </div>

        {isOffline && (
            <div className={`px-8 py-3 flex items-center justify-between border-b ${monument.cached ? 'bg-nature-500 text-white border-nature-600' : 'bg-red-500 text-white border-red-600'}`}>
                <div className="flex items-center gap-3">
                    {monument.cached ? <CheckIcon className="w-5 h-5" /> : <AlertIcon className="w-5 h-5" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {monument.cached ? 'Local Data Verified' : 'No Local Data Available'}
                    </span>
                </div>
            </div>
        )}

        <div className="p-8 pb-32">
            <div className="flex justify-between items-center mb-10">
                <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-nature-500/10 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                            <ShieldIcon className="w-7 h-7 text-nature-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{monument.safetyScore}% Safe</span>
                    </div>
                </div>
                <button 
                  onClick={onNavigate} 
                  className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary-600/30 active:scale-95 transition-all"
                >
                  Navigate
                </button>
            </div>

            <section className="mb-10">
                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
                  <PencilIcon className="w-3.5 h-3.5" /> The Story
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-base">
                  {monument.description}
                </p>
            </section>

            <section className="mb-10">
                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
                  <FlagIcon className="w-3.5 h-3.5" /> Historical Depth
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border-l-8 border-primary-500 shadow-sm">
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-serif italic text-lg">
                      {monument.history}
                   </p>
                </div>
            </section>

            {/* NEW: Nearby Amenities Section */}
            <section className="mb-14 overflow-hidden">
                <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
                  <MapIcon className="w-3.5 h-3.5" /> {t.nearby_amenities}
                </h3>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-2 px-2">
                    {nearbyPOIs.length > 0 ? (
                        nearbyPOIs.map(poi => (
                            <div key={poi.id} className="min-w-[160px] bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3">
                                <div className={`w-10 h-10 ${getPoiColor(poi.type)} text-white rounded-2xl flex items-center justify-center shadow-md`}>
                                    {getPoiIcon(poi.type)}
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-1">{poi.name}</h5>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{poi.type}</p>
                                </div>
                                {poi.rating && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-black text-nature-600">★ {poi.rating}</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-4 text-slate-400 text-[10px] italic font-bold">No verified amenities nearby.</div>
                    )}
                </div>
            </section>

            <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" /> {t.community_stories}
                    </h3>
                </div>
                <div className="mb-8 space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <textarea 
                            value={newStory}
                            onChange={e => setNewStory(e.target.value)}
                            placeholder={t.add_story_placeholder}
                            className="w-full bg-transparent text-sm resize-none h-20 outline-none p-2 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        />
                        <div className="flex justify-end mt-2">
                            <button 
                                onClick={handlePostStory}
                                disabled={!newStory.trim() || isPosting}
                                className="bg-primary-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95"
                            >
                                {t.btn_post}
                            </button>
                        </div>
                    </div>
                    {stories.length === 0 ? (
                        <p className="text-center text-slate-400 text-xs italic py-6">{t.community_stories_empty}</p>
                    ) : (
                        stories.map((s, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 animate-fade-in">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-3.5 h-3.5 text-primary-600" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-800 dark:text-white">{s.userName}</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase ml-auto">{new Date(s.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    </div>
  );
};

// 5. Camera View Component (with robust upload and camera streaming)
const CameraView = ({ language, isOffline, onNavigateTo, onSelectMonument }: { language: Language, isOffline: boolean, onNavigateTo: () => void, onSelectMonument: (m: Monument) => void }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [matchedMonument, setMatchedMonument] = useState<Monument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = UI_STRINGS[language];

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(s);
      setError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied. Please verify permissions.");
    }
  };

  const toggleFlash = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    const capabilities = (track.getCapabilities() as any) || {};
    if (capabilities.torch) {
      try {
        await track.applyConstraints({ advanced: [{ torch: !flashOn }] } as any);
        setFlashOn(!flashOn);
      } catch (e) { console.warn("Flash toggle failed", e); }
    }
  };

  const performIdentification = async (base64: string) => {
    setScanning(true); setResult(null); setMatchedMonument(null); setError(null);
    try {
      const data = await identifyLandmark(base64, language);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setResult(data);
      const match = MONUMENTS.find(m => 
        data.name.toLowerCase().includes(m.name.toLowerCase()) || 
        m.name.toLowerCase().includes(data.name.toLowerCase())
      );
      if (match) setMatchedMonument(match);
    } catch (err) { 
      console.error("ID Error:", err);
      setError("Heritage recognition failed. Ensure you have an internet connection."); 
    } finally { setScanning(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      if (resultStr && resultStr.includes(',')) {
        const base64 = resultStr.split(',')[1];
        performIdentification(base64);
      } else {
        setError("Invalid image file format.");
        setScanning(false);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const captureAndIdentify = async () => {
    if (!videoRef.current || isOffline || scanning) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      performIdentification(base64);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  return (
    <div className="h-full bg-black relative flex flex-col overflow-hidden perspective-1000">
        {!stream && !error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-white">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                  <CameraIcon className="w-10 h-10 text-slate-400" />
                </div>
                <button onClick={startCamera} className="bg-primary-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95">{t.camera_btn_enable}</button>
            </div>
        ) : (
            <div className="flex-1 relative overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className={`w-full h-full object-cover grayscale-[0.2] transition-opacity duration-500 ${error ? 'opacity-20' : 'opacity-100'}`} 
                />
                
                {/* HUD Elements */}
                <div className="absolute inset-0 pointer-events-none z-10 preserve-3d">
                    <div className="ar-hud-bracket ar-hud-tl animate-pulse opacity-30"></div>
                    <div className="ar-hud-bracket ar-hud-tr animate-pulse opacity-30"></div>
                    <div className="ar-hud-bracket ar-hud-bl animate-pulse opacity-30"></div>
                    <div className="ar-hud-bracket ar-hud-br animate-pulse opacity-30"></div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="absolute top-20 left-6 right-6 z-50 bg-red-600/90 text-white p-4 rounded-2xl shadow-2xl animate-fade-in text-center font-bold text-xs">
                        {error}
                        <button onClick={startCamera} className="block w-full mt-2 text-[10px] underline uppercase">Retry Connection</button>
                    </div>
                )}

                {/* Side Controls */}
                <div className="absolute top-6 right-6 z-40 flex flex-col gap-4">
                    <button onClick={toggleFlash} className={`p-4 rounded-2xl backdrop-blur-md border transition-all ${flashOn ? 'bg-primary-500 border-primary-500 text-white' : 'bg-black/40 text-white/80 border-white/20'}`}>
                        <FlashIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 text-white/80 active:scale-95 transition-all">
                        <ImageIcon className="w-5 h-5" />
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileUpload} 
                        />
                    </button>
                </div>

                {/* Recognition Result Overlay */}
                {result && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none p-8 animate-fade-in preserve-3d">
                        <div className="relative group pointer-events-auto transform rotate-x-10 preserve-3d">
                            <div className="absolute -top-32 left-1/2 w-[1px] h-32 bg-gradient-to-t from-primary-400 to-transparent"></div>
                            
                            <div className="bg-slate-950/80 backdrop-blur-3xl rounded-[2.5rem] p-8 ar-node-shadow border border-white/10 text-white max-w-[320px] relative overflow-hidden animate-slide-up">
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '15px 15px'}}></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="pr-6">
                                            <h4 className="text-2xl font-black font-serif italic mb-1 tracking-tight">{result.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-primary-400 text-[8px] font-black uppercase tracking-widest">ID LOCK ACQUIRED</span>
                                            </div>
                                        </div>
                                        <button onClick={() => {setResult(null); setMatchedMonument(null);}} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                            <TrashIcon className="w-4 h-4 text-white/40" />
                                        </button>
                                    </div>
                                    
                                    <p className="text-slate-300 text-xs leading-relaxed mb-6 font-medium opacity-90 line-clamp-4 italic">"{result.description}"</p>
                                    
                                    <div className="flex gap-4">
                                        {matchedMonument ? (
                                            <button onClick={() => onSelectMonument(matchedMonument)} className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-2">
                                                <FlagIcon className="w-3.5 h-3.5" /> ARCHIVE
                                            </button>
                                        ) : (
                                            <button onClick={onNavigateTo} className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl active:scale-95">MAP VIEW</button>
                                        )}
                                        <button onClick={() => {setResult(null); setMatchedMonument(null);}} className="px-6 bg-white/10 text-white py-3 rounded-xl font-black uppercase text-[9px] tracking-widest border border-white/10 active:scale-95">CLOSE</button>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-16 -right-8 animate-bounce-subtle">
                                <div className="bg-red-500/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2 max-w-[200px]">
                                     <AlertIcon className="w-4 h-4 text-white shrink-0" />
                                     <span className="text-[7px] font-black text-white uppercase leading-tight tracking-wide">{result.safetyTip}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!result && (
                    <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-6 z-40 pointer-events-auto">
                        <button 
                            disabled={isOffline || scanning}
                            onClick={captureAndIdentify}
                            className={`group relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${isOffline || scanning ? 'opacity-30' : 'active:scale-90'}`}
                        >
                            <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-spin-slow group-hover:border-primary-500"></div>
                            <div className="absolute inset-4 rounded-full border-2 border-white flex items-center justify-center">
                                <div className={`w-12 h-12 bg-white rounded-full transition-transform duration-300 ${scanning ? 'scale-0' : 'scale-100 shadow-2xl'}`}></div>
                            </div>
                            {scanning && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                        <div className="bg-black/50 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 flex items-center gap-3">
                             <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-primary-500 animate-ping' : 'bg-green-500'}`}></div>
                             <span className="text-white text-[8px] font-black uppercase tracking-[0.2em]">{scanning ? 'Processing Frame...' : t.camera_hint}</span>
                        </div>
                    </div>
                )}

                {scanning && <div className="absolute inset-x-0 h-0.5 bg-primary-500 shadow-[0_0_20px_blue] animate-scan-line z-20 pointer-events-none"></div>}
            </div>
        )}
    </div>
  );
};

// 6. Voice Assistant Component
const VoiceAssistant = ({ language, isOffline }: { language: Language, isOffline: boolean }) => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [thinking, setThinking] = useState(false);
  const t = UI_STRINGS[language];

  const startListening = () => {
    if (isOffline) return;
    const SpeechRecognition = window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (!transcript) return;
      setMessages(prev => [...prev, { role: 'user', text: transcript }]);
      setThinking(true);
      try {
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const response = await getChatResponse(history, transcript, language);
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'model', text: "Lost connection to the cloud." }]);
      } finally { setThinking(false); }
    };
    recognition.start();
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden animate-fade-in">
        <div className="p-8 pt-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary-600 rounded-[2rem] shadow-2xl flex items-center justify-center mb-6">
                <MicIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-2">{t.voice_title}</h2>
            <p className="text-slate-400 text-sm font-bold opacity-70 uppercase tracking-widest">{t.voice_subtitle}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 space-y-4 no-scrollbar py-6">
            {messages.length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-20"><Logo className="w-24 h-24 grayscale" /></div>}
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    <div className={`max-w-[80%] p-5 rounded-3xl text-sm font-medium shadow-sm ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-700'}`}>{m.text}</div>
                </div>
            ))}
            {thinking && <div className="flex justify-start animate-pulse"><div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-3xl rounded-tl-none"><div className="flex gap-1"><div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" /><div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" /></div></div></div>}
        </div>
        <div className="p-10 pb-16 flex flex-col items-center">
            {isOffline ? <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl flex items-center gap-2 border border-red-100"><CloudOffIcon className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">{t.error_offline}</span></div> : <button onClick={startListening} disabled={isListening || thinking} className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${isListening ? 'scale-110 shadow-2xl bg-red-500' : 'bg-primary-600 shadow-xl shadow-primary-600/20 active:scale-90'}`}>{isListening && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />}<MicIcon className={`w-8 h-8 text-white ${isListening ? 'animate-pulse' : ''}`} /></button>}
        </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('AUTH');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('tg_lang') as Language) || 'en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineOverride, setOfflineOverride] = useState(() => localStorage.getItem('tg_offline') === 'true');
  const [isSyncing, setIsSyncing] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tg_dark') === 'true');
  const [monuments, setMonuments] = useState<Monument[]>(MONUMENTS);
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);

  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const isActuallyOffline = !isOnline || offlineOverride;
  const t = UI_STRINGS[language];

  useEffect(() => {
    localStorage.setItem('tg_lang', language);
    localStorage.setItem('tg_offline', String(offlineOverride));
    localStorage.setItem('tg_dark', String(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [language, offlineOverride, darkMode]);

  useEffect(() => {
    const triggerSync = async () => {
        if (isOnline && !offlineOverride) {
            setIsSyncing(true);
            try {
                await syncService.syncContributions();
            } catch (err) {
                console.error("Sync Error:", err);
            } finally {
                setIsSyncing(false);
            }
        }
    };
    triggerSync();
  }, [isOnline, offlineOverride]);

  useEffect(() => {
    const handleNet = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleNet);
    window.addEventListener('offline', handleNet);
    const cachedIds = JSON.parse(localStorage.getItem('tg_cached_monuments') || '[]');
    const initialMonuments = MONUMENTS.map(m => ({ ...m, cached: cachedIds.includes(m.id) }));
    setMonuments(initialMonuments);
    db.init().then(() => {
        // Simple User Check
        const transaction = (db as any).db?.transaction(['users'], 'readonly');
        const store = transaction?.objectStore('users');
        const request = store?.openCursor();
        if (request) {
           request.onsuccess = (event: any) => {
               const cursor = event.target.result;
               if (cursor) {
                   setUser(cursor.value);
                   setView('HOME');
               } else {
                   setView('AUTH');
               }
           };
        }
    });
    return () => { window.removeEventListener('online', handleNet); window.removeEventListener('offline', handleNet); };
  }, []);

  const handleAddContact = async () => {
    if (!newContactName || !newContactPhone || !user) return;
    const newContact: Contact = { id: Date.now().toString(), name: newContactName, phone: newContactPhone };
    const updatedUser = { ...user, emergencyContacts: [...user.emergencyContacts, newContact] };
    setUser(updatedUser);
    await db.saveUser(updatedUser);
    setNewContactName(''); setNewContactPhone(''); setIsAddingContact(false);
  };

  const handleDeleteContact = async (id: string) => {
    if (!user || !window.confirm(t.confirm_delete)) return;
    const updatedUser = { ...user, emergencyContacts: user.emergencyContacts.filter(c => c.id !== id) };
    setUser(updatedUser);
    await db.saveUser(updatedUser);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('HOME');
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out? Your profile data will remain on this device.")) {
        setUser(null);
        setView('AUTH');
    }
  };

  const sosOverlay = (
    <div className="fixed inset-0 bg-red-600 z-[100] text-white p-8 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-ping"><AlertIcon className="w-20 h-20" /></div>
      <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">SOS ACTIVE</h1>
      <p className="text-lg mb-12 max-w-xs font-medium opacity-90">Emergency units and your primary contacts have been sent your live coordinates.</p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
         <button onClick={() => window.open('tel:100')} className="bg-white text-red-600 py-5 rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all">CALL POLICE</button>
         <button onClick={() => setView('FAKE_CALL')} className="bg-white/10 text-white py-4 rounded-3xl font-bold border border-white/20 active:scale-95">START FAKE CALL</button>
         <button onClick={() => setSosActive(false)} className="text-white/60 py-4 font-bold uppercase tracking-widest text-[10px]">Deactivate Alert</button>
      </div>
    </div>
  );

  return (
    <Layout 
      view={view} setView={setView} sosActive={sosActive} triggerSOS={() => setSosActive(true)} sosOverlay={sosOverlay}
      darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)}
      isOnline={isOnline} isSyncing={isSyncing} language={language} setLanguage={setLanguage}
      offlineOverride={offlineOverride} setOfflineOverride={setOfflineOverride}
    >
      {view === 'AUTH' && <AuthView onLogin={handleLoginSuccess} language={language} />}
      {view === 'HOME' && <MapView monuments={monuments} onMonumentSelect={setSelectedMonument} onEnterAR={() => setView('CAMERA')} selectedMonument={selectedMonument} />}
      {view === 'LIST' && <ListView monuments={monuments} onSelect={setSelectedMonument} language={language} />}
      {view === 'CAMERA' && <CameraView language={language} isOffline={isActuallyOffline} onNavigateTo={() => setView('HOME')} onSelectMonument={(m) => { setSelectedMonument(m); setView('HOME'); }} />}
      {view === 'VOICE_ASSISTANT' && <VoiceAssistant language={language} isOffline={isActuallyOffline} />}
      {view === 'PROFILE' && (
        <div className="h-full bg-white dark:bg-slate-950 overflow-y-auto pb-32 animate-fade-in">
           <div className="p-8 pb-4 pt-10">
              <div className="flex items-center gap-6 mb-4">
                 <div className="relative">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400">
                       <UserIcon className="w-8 h-8" />
                    </div>
                 </div>
                 <div className="flex-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{user?.name}</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{user?.email}</p>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${isSyncing ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30' : 'bg-nature-50 dark:bg-nature-950/20 border-nature-100 dark:border-nature-900/30'}`}>
                       {isSyncing ? <RefreshIcon className="w-3 h-3 text-primary-600 animate-spin" /> : <CheckIcon className="w-3 h-3 text-nature-600" />}
                       <span className={`text-[8px] font-black uppercase tracking-widest ${isSyncing ? 'text-primary-600' : 'text-nature-600'}`}>
                          {isSyncing ? 'Syncing...' : isOnline ? 'Heritage Archive Ready' : 'Offline Mode'}
                       </span>
                    </div>
                 </div>
              </div>
           </div>

           <section className="px-8 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.4em]">{t.emergency_contacts}</h3>
                {!isAddingContact && (
                  <button onClick={() => setIsAddingContact(true)} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-primary-600 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest active:scale-95">
                    {t.add_contact}
                  </button>
                )}
              </div>

              {isAddingContact && (
                  <div className="mb-6 bg-slate-50 dark:bg-slate-900 p-6 rounded-[2rem] border border-primary-100 dark:border-primary-900/30 space-y-4 animate-fade-in">
                     <div>
                        <input 
                          type="text" 
                          placeholder={t.contact_name}
                          value={newContactName} 
                          onChange={e => setNewContactName(e.target.value)} 
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl text-sm outline-none font-bold" 
                        />
                     </div>
                     <div>
                        <input 
                          type="tel" 
                          placeholder={t.contact_phone}
                          value={newContactPhone} 
                          onChange={e => setNewContactPhone(e.target.value)} 
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl text-sm outline-none font-bold font-mono" 
                        />
                     </div>
                     <div className="flex gap-2 pt-2">
                        <button onClick={handleAddContact} className="flex-1 bg-primary-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Save Contact</button>
                        <button onClick={() => setIsAddingContact(false)} className="px-6 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">✕</button>
                     </div>
                  </div>
              )}

              <div className="space-y-4 pb-8">
                {user?.emergencyContacts.map(c => (
                  <div key={c.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 pr-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                       <PhoneIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-800 dark:text-white tracking-tight text-base">{c.name}</p>
                      <p className="text-slate-400 text-[10px] font-mono font-bold tracking-widest">{c.phone}</p>
                    </div>
                    <div className="flex">
                       <button onClick={() => window.open(`tel:${c.phone}`)} className="p-4 text-primary-600 active:scale-90">
                          <PhoneIcon className="w-5 h-5" />
                       </button>
                       <button onClick={() => handleDeleteContact(c.id)} className="p-4 text-red-500 active:scale-90">
                          <TrashIcon className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 pb-12 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800"
                  >
                      Sign Out
                  </button>
              </div>
           </section>
        </div>
      )}

      {view === 'FAKE_CALL' && (
        <div className="absolute inset-0 z-[110] bg-slate-900 text-white flex flex-col items-center justify-between p-12 py-24 animate-fade-in">
            <div className="text-center"><div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-6"><UserIcon className="w-12 h-12 text-slate-500" /></div><h2 className="text-3xl font-black">Emergency Service</h2><p className="text-slate-500 font-bold uppercase tracking-widest mt-2 animate-pulse">Incoming Call...</p></div>
            <div className="flex gap-16"><button onClick={() => setView('HOME')} className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl active:scale-95"><PhoneIcon className="w-8 h-8 rotate-[135deg]" /></button><button onClick={() => alert("Call connected (Simulated)")} className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl active:scale-95"><PhoneIcon className="w-8 h-8" /></button></div>
        </div>
      )}

      {selectedMonument && <DetailPanel monument={selectedMonument} isOffline={isActuallyOffline} user={user} onClose={() => setSelectedMonument(null)} onNavigate={() => { setSelectedMonument(null); setView('HOME'); }} />}
    </Layout>
  );
};

export default App;
