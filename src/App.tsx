import React, { useState, useMemo, useEffect } from 'react';
import { FULL_LIBRARY } from './library';
import { ItemType, LibraryItem } from './data';
import { Book, FileText, Search, ExternalLink, Library, Globe, Database, BookOpen, ScrollText, Menu, X, Tag, MessageSquare, Clock, Filter, ChevronDown, Download, Sparkles, Loader2, Settings, Key, CheckCircle2, Command, Upload, DownloadCloud, RefreshCw } from 'lucide-react';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import Markdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';
import { fetchAllDynamicContent } from './sync';

interface UserData {
  tags: string[];
  notes: string;
  explanation?: string;
}
type UserDataMap = Record<string, UserData>;

const AI_PROVIDERS = [
  { id: 'gemini', name: 'Google Gemini', desc: 'gemini-2.5-flash' },
  { id: 'openai', name: 'OpenAI', desc: 'gpt-4o-mini' },
  { id: 'groq', name: 'Groq', desc: 'llama3-8b' },
];

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeType, setActiveType] = useState<ItemType | 'all'>('all');
  const [activeSection, setActiveSection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeYear, setActiveYear] = useState<string>('All');
  const [showRecentlyAdded, setShowRecentlyAdded] = useState(false);
  
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('agi_apiKeys');
    if (saved) return JSON.parse(saved);
    const oldKey = localStorage.getItem('agi_apiKey');
    return oldKey ? { gemini: oldKey } : {};
  });

  const [keyStatuses, setKeyStatuses] = useState<Record<string, 'testing' | 'valid' | 'invalid' | 'idle'>>({});
  const validatedKeysRef = useRef<Record<string, string>>({});

  const [userDataMap, setUserDataMap] = useState<UserDataMap>(() => {
    const saved = localStorage.getItem('agi_userData');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const [dynamicPapers, setDynamicPapers] = useState<LibraryItem[]>(() => {
    const saved = localStorage.getItem('agi_dynamicPapers');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem('agi_dynamicPapers', JSON.stringify(dynamicPapers));
  }, [dynamicPapers]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem('agi_userData', JSON.stringify(userDataMap));
  }, [userDataMap]);

  useEffect(() => {
    localStorage.setItem('agi_apiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    const timeouts: Record<string, NodeJS.Timeout> = {};

    Object.entries(apiKeys).forEach(([id, key]) => {
      if (!key || !key.trim()) {
        setKeyStatuses(prev => ({ ...prev, [id]: 'idle' }));
        validatedKeysRef.current[id] = '';
        return;
      }
      
      if (validatedKeysRef.current[id] === key) {
        return;
      }

      setKeyStatuses(prev => ({ ...prev, [id]: 'testing' }));
      
      timeouts[id] = setTimeout(async () => {
        validatedKeysRef.current[id] = key;
        try {
          let ok = false;
          if (id === 'gemini') {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
            ok = res.ok;
          } else if (id === 'openai') {
            const res = await fetch('https://api.openai.com/v1/models', { headers: { 'Authorization': `Bearer ${key}` } });
            ok = res.ok;
          } else if (id === 'groq') {
            const res = await fetch('https://api.groq.com/openai/v1/models', { headers: { 'Authorization': `Bearer ${key}` } });
            ok = res.ok;
          }
          setKeyStatuses(prev => ({ ...prev, [id]: ok ? 'valid' : 'invalid' }));
        } catch (e) {
          setKeyStatuses(prev => ({ ...prev, [id]: 'invalid' }));
        }
      }, 800);
    });

    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, [apiKeys]);

  const combinedLibrary = useMemo(() => {
    const ids = new Set(FULL_LIBRARY.map(item => item.id));
    const uniqueDynamic = dynamicPapers.filter(dp => !ids.has(dp.id));
    return [...FULL_LIBRARY, ...uniqueDynamic];
  }, [dynamicPapers]);

  const sections = useMemo(() => {
    let filteredByType = combinedLibrary;
    if (activeType !== 'all') {
      filteredByType = combinedLibrary.filter(item => item.type === activeType);
    }
    const secs = Array.from(new Set(filteredByType.map(item => item.section)));
    return ['All', ...secs];
  }, [activeType, combinedLibrary]);

  const years = useMemo(() => {
    const yrs = Array.from(new Set(combinedLibrary.map(item => item.year).filter(y => !y.includes('Unknown') && !y.includes('Ongoing') && !y.includes('Annually'))));
    return ['All', ...yrs.sort((a, b) => b.localeCompare(a))];
  }, [combinedLibrary]);

  useEffect(() => {
    if (!sections.includes(activeSection) && activeSection !== 'All') {
      setActiveSection('All');
    }
  }, [sections, activeSection]);

  const filteredItems = useMemo(() => {
    let base = combinedLibrary;
    
    if (showRecentlyAdded) {
      // Return top 20 items
      const sorted = [...base].filter(item => !item.year.includes('Ongoing') && !item.year.includes('Annually') && !item.year.includes('Unknown')).sort((a,b) => b.year.localeCompare(a.year));
      return sorted.slice(0, 20);
    }

    return base.filter(item => {
      if (activeType !== 'all' && item.type !== activeType) return false;
      if (activeSection !== 'All' && item.section !== activeSection) return false;
      if (activeYear !== 'All' && !item.year.includes(activeYear)) return false;
      
      if (searchQuery) {
        const lowerSearch = searchQuery.toLowerCase();
        const tags = userDataMap[item.id]?.tags?.join(' ').toLowerCase() || '';
        return (
          item.title.toLowerCase().includes(lowerSearch) ||
          item.author.toLowerCase().includes(lowerSearch) ||
          item.significance.toLowerCase().includes(lowerSearch) ||
          (item.venue && item.venue.toLowerCase().includes(lowerSearch)) ||
          tags.includes(lowerSearch)
        );
      }
      return true;
    });
  }, [activeType, activeSection, activeYear, searchQuery, showRecentlyAdded, userDataMap]);

  const handleSidebarClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({userDataMap, apiKeys}));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "agi-library-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if(e.target.files && e.target.files.length) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (parsed.userDataMap) setUserDataMap(parsed.userDataMap);
          if (parsed.apiKeys) setApiKeys(parsed.apiKeys);
          alert("Data imported successfully!");
        } catch(err) {
          alert("Invalid file format.");
        }
      };
      e.target.value = '';
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) setIsSettingsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSettingsOpen]);

  const handleSync = async () => {
    if (isSyncing) return;
    try {
      setIsSyncing(true);
      const newItems = await fetchAllDynamicContent();
      
      setDynamicPapers((prev) => {
        const existingIds = new Set(prev.map(p => p.id));
        const toAdd = newItems.filter(p => !existingIds.has(p.id));
        if (toAdd.length === 0) return prev;
        return [...toAdd, ...prev];
      });
      // Added a slight delay for better UX
      setTimeout(() => setIsSyncing(false), 500);
    } catch (err) {
      console.error(err);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const lastSyncDate = localStorage.getItem('agi_lastSyncDate');
    const now = Date.now();
    // Auto sync every 6 hours automatically on load if needed
    if (!lastSyncDate || now - parseInt(lastSyncDate, 10) > 6 * 60 * 60 * 1000) {
      handleSync().then(() => {
        localStorage.setItem('agi_lastSyncDate', now.toString());
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-900 font-sans flex flex-col overflow-hidden h-screen select-none relative">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 relative z-30">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-1 text-slate-500 hover:text-slate-800" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold hidden sm:flex">
            <Library className="w-4 h-4" />
          </div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-800 truncate">
            AGI Library <span className="text-[10px] md:text-xs font-normal text-slate-400 ml-1 md:ml-2">v2.4.0</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl px-12">
          <div className="relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, author, keyword, or personal tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 pl-10 pr-14 text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <Search className="h-4 w-4 stroke-[2.5px]" />
            </div>
            <div className="absolute right-2 top-2 flex items-center gap-1.5">
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 bg-white rounded-md shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm select-none">
                  <Command className="w-3 h-3" /> K
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 text-sm text-slate-500 font-medium">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center justify-center p-2 rounded-lg transition-colors text-slate-700 ${isSyncing ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 hover:bg-slate-200'}`}
            title="Sync Latest ArXiv Papers"
          >
            <RefreshCw className={`w-4 h-4 md:w-4 md:h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700"
            title="Settings & API Key"
          >
            <Settings className="w-4 h-4 md:w-4 md:h-4" />
          </button>
          <button className="hidden sm:block text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700">My Collection</button>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-300"></div>
        </div>
      </header>

      {/* Mobile Search - Only visible on small screens */}
      <div className="md:hidden bg-white px-4 py-2.5 border-b border-slate-200 shrink-0 z-20 shadow-sm relative">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by title, author, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 pl-9 pr-10 text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
          />
          <div className="absolute left-3 top-2.5 text-slate-400">
            <Search className="h-4 w-4 stroke-[2.5px]" />
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600 bg-white rounded-md shadow-sm border border-slate-200">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div className="absolute inset-0 bg-slate-900/30 z-10 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={clsx(
          "absolute inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-6 shrink-0 overflow-y-auto custom-scrollbar transition-transform duration-300 md:static md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <section>
            <div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Discovery</h2>
              <div className="space-y-1 mb-4">
                <FilterButton
                  active={showRecentlyAdded}
                  onClick={() => { setShowRecentlyAdded(true); handleSidebarClick(); }}
                  label="Recently Added"
                  icon={<Clock className="w-3.5 h-3.5" />}
                  count={10}
                />
              </div>

              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resource Type</h2>
              <div className="space-y-1">
                <FilterButton
                  active={!showRecentlyAdded && activeType === 'all'}
                  onClick={() => { setActiveType('all'); setShowRecentlyAdded(false); handleSidebarClick(); }}
                  label="All Resources"
                  count={FULL_LIBRARY.length}
                />
                <FilterButton
                  active={!showRecentlyAdded && activeType === 'book'}
                  onClick={() => { setActiveType('book'); setShowRecentlyAdded(false); handleSidebarClick(); }}
                  label="Books"
                  count={FULL_LIBRARY.filter(i => i.type === 'book').length}
                />
                <FilterButton
                  active={!showRecentlyAdded && activeType === 'paper'}
                  onClick={() => { setActiveType('paper'); setShowRecentlyAdded(false); handleSidebarClick(); }}
                  label="Research Papers"
                  count={FULL_LIBRARY.filter(i => i.type === 'paper').length}
                />
                <FilterButton
                  active={!showRecentlyAdded && activeType === 'resource'}
                  onClick={() => { setActiveType('resource'); setShowRecentlyAdded(false); handleSidebarClick(); }}
                  label="Online Resources"
                  count={FULL_LIBRARY.filter(i => i.type === 'resource').length}
                />
              </div>
            </div>
          </section>

          <section>
            <div>
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Collections</h2>
              <div className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section}
                    onClick={() => { setActiveSection(section); setShowRecentlyAdded(false); handleSidebarClick(); }}
                    className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors flex items-center justify-between ${
                      !showRecentlyAdded && activeSection === section 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate block pr-2">{section}</span>
                    <span className="text-xs opacity-60 shrink-0">
                      {section === 'All' 
                        ? FULL_LIBRARY.filter(i => activeType === 'all' || i.type === activeType).length 
                        : FULL_LIBRARY.filter(i => i.section === section && (activeType === 'all' || i.type === activeType)).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-auto border-t border-slate-100 pt-4">
            <div className="mb-4">
               <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">Filter by Year</h2>
               <div className="relative">
                 <select 
                   className="w-full bg-slate-50 border border-slate-200 text-sm rounded p-1.5 outline-none appearance-none cursor-pointer"
                   value={activeYear}
                   onChange={e => { setActiveYear(e.target.value); setShowRecentlyAdded(false); handleSidebarClick(); }}
                 >
                   {years.map(y => <option key={y} value={y}>{y}</option>)}
                 </select>
                 <ChevronDown className="w-3 h-3 absolute right-2 top-2.5 text-slate-400 pointer-events-none" />
               </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[11px] text-slate-500 italic leading-relaxed uppercase tracking-tighter">
                A comprehensive curation of pre-AGI classics, safety research, and frontiers of intelligence.
              </p>
            </div>
          </section>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {/* Table Header (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-[1fr_150px_60px_160px] lg:grid-cols-[1fr_200px_80px_200px] px-6 py-2 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
            <span>Resource Title & Author</span>
            <span>Publication</span>
            <span>Year</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 md:bg-white">
            <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-slate-200">
               <h2 className="text-xs font-bold text-slate-500 uppercase">
                 {showRecentlyAdded ? 'Recently Added' : (activeSection !== 'All' ? activeSection : 'All Resources')}
                 {activeYear !== 'All' && !showRecentlyAdded && ` • ${activeYear}`}
               </h2>
            </div>
            
            <AnimatePresence initial={false}>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    userData={userDataMap[item.id]} 
                    onSelect={() => setSelectedItem(item)}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center p-8 bg-white"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center mb-4">
                    <Filter className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">No matching items found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">Try adjusting your search query or changing the selected filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="h-12 md:h-10 bg-slate-50 border-t border-slate-200 flex items-center px-4 md:px-6 justify-between shrink-0 text-[10px] md:text-[11px] text-slate-500 font-medium">
            <div className="flex gap-3 md:gap-4 truncate max-w-[65%] md:max-w-none">
              <span className="shrink-0">Items: {filteredItems.length} <span className="hidden sm:inline">{showRecentlyAdded ? '(Recent)' : `of ${FULL_LIBRARY.length}`}</span></span>
              <span className="truncate">Filter: {showRecentlyAdded ? 'Recently Added' : activeSection}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button className="p-1 hover:text-blue-600">Prev</button>
              <div className="flex gap-1">
                <span className="w-5 h-5 bg-blue-600 text-white flex items-center justify-center rounded-sm cursor-pointer">1</span>
              </div>
              <button className="p-1 hover:text-blue-600 ml-1">Next</button>
            </div>
          </div>
        </div>

        {/* Modal for Details / Personal Notes & Tags */}
        <AnimatePresence>
          {selectedItem && (
            <ItemModal 
              item={selectedItem} 
              userData={userDataMap[selectedItem.id]}
              apiKeys={apiKeys}
              keyStatuses={keyStatuses}
              onClose={() => setSelectedItem(null)}
              onSave={(data) => {
                setUserDataMap(prev => ({
                  ...prev,
                  [selectedItem.id]: data
                }));
              }}
            />
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {isSettingsOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                onClick={() => setIsSettingsOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 p-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-500" /> API Settings
                  </h3>
                  <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {Object.values(keyStatuses).filter(s => s === 'valid').length} Running
                  </span>
                  <span className="text-xs text-slate-500">Configure your preferred AI providers.</span>
                </div>

                <div className="space-y-4 mb-6">
                  {AI_PROVIDERS.map(provider => {
                    const status = keyStatuses[provider.id] || 'idle';
                    const isActive = status === 'valid';
                    
                    return (
                      <div key={provider.id} className={`p-3 rounded-lg border transition-colors ${isActive ? 'bg-blue-50/50 border-blue-200' : status === 'invalid' ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{provider.name}</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{provider.desc}</p>
                          </div>
                          {status === 'testing' && <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> CHECKING</span>}
                          {status === 'valid' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> RUNNING</span>}
                          {status === 'invalid' && <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1"><X className="w-3 h-3" /> INVALID</span>}
                        </div>
                        <input 
                          type="password" 
                          placeholder={`Enter ${provider.name} API Key...`}
                          value={apiKeys[provider.id] || ''}
                          onChange={e => {
                            setApiKeys(prev => ({...prev, [provider.id]: e.target.value}));
                            if (validatedKeysRef.current[provider.id]) {
                              validatedKeysRef.current[provider.id] = '';
                            }
                          }}
                          className={`w-full bg-white border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 font-mono shadow-inner outline-none ${
                            status === 'invalid' ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={() => setIsSettingsOpen(false)} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-2">Data Backup</h4>
                  <p className="text-xs text-slate-500 mb-4">Export your personal tags, research notes, AI explanations, and API keys. All data is stored locally.</p>
                  <div className="flex gap-3">
                    <button onClick={handleExportData} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-semibold text-xs hover:bg-slate-100 active:scale-95 transition-all">
                      <DownloadCloud className="w-4 h-4" /> Export
                    </button>
                    <label className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-semibold text-xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer">
                      <Upload className="w-4 h-4" /> Import
                      <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        onChange={handleImportData} 
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function FilterButton({ active, onClick, label, count, icon }: { active: boolean, onClick: () => void, label: string, count?: number, icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between text-sm p-1.5 rounded cursor-pointer transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      {count !== undefined && <span className="text-xs opacity-60">{count}</span>}
    </button>
  );
}

function ItemCard({ item, userData, onSelect }: { item: LibraryItem, userData?: UserData, onSelect: () => void }) {
  const isBook = item.type === 'book';
  const isPaper = item.type === 'paper';

  const hasNotes = Boolean(userData?.notes || (userData?.tags && userData.tags.length > 0));

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onSelect}
      className="flex flex-col md:grid md:grid-cols-[1fr_150px_60px_160px] lg:grid-cols-[1fr_200px_80px_200px] items-start md:items-center px-4 md:px-6 py-4 md:py-3 border-b border-slate-200 md:border-slate-50 hover:bg-blue-50/30 active:bg-blue-50/40 bg-white md:bg-transparent group transition-colors cursor-pointer gap-2 md:gap-0"
    >
      <div className="flex flex-col gap-0.5 md:pr-4 w-full">
        <div className="flex items-start md:items-center gap-1.5">
          <div className="mt-0.5 md:mt-0">
            {isBook ? <BookOpen className="w-3 h-3 text-emerald-600 shrink-0" /> : 
             isPaper ? <ScrollText className="w-3 h-3 text-orange-600 shrink-0" /> : 
             <Globe className="w-3 h-3 text-blue-600 shrink-0" />}
          </div>
          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-1" title={item.title}>
            {item.title}
          </h3>
        </div>
        <p className="text-xs text-slate-500 line-clamp-1 pl-5 md:pl-4">{item.author}</p>
        
        {/* Mobile only elements */}
        <div className="flex items-center gap-2 pl-5 md:hidden mt-1 text-[10px]">
           <span className="text-slate-400 flex items-center">{item.year}</span>
           <span className="text-slate-300">•</span>
           <span className="text-slate-400 line-clamp-1">{item.venue || item.section}</span>
        </div>
        {hasNotes && (
          <div className="flex items-center gap-1.5 pl-5 md:hidden mt-1">
             <MessageSquare className="w-3 h-3 text-blue-500" />
             <span className="text-[10px] text-blue-600 font-medium">Personal notes added</span>
          </div>
        )}
        
        {/* Mobile quick actions */}
        <div className="flex items-center gap-2 pl-5 md:hidden mt-2.5">
          {(isPaper || isBook) && (
            <a 
              href={`https://scholar.google.com/scholar?q=${encodeURIComponent('ext:pdf "' + item.title + '" ' + item.author)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm gap-1.5 active:scale-95"
              onClick={e => e.stopPropagation()}
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </a>
          )}
        </div>

        <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1 hidden lg:block pl-4" title={item.significance}>{item.significance}</p>
        
        {/* Desktop notes indicator */}
        {hasNotes && (
          <div className="hidden md:flex items-center gap-1 pl-4 mt-1">
            <MessageSquare className="w-3 h-3 text-slate-400" />
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Has Notes</span>
          </div>
        )}
      </div>
      
      <div className="hidden md:flex flex-col pr-4">
        <span className="text-xs text-slate-500 line-clamp-1" title={item.venue || item.section}>{item.venue || item.section}</span>
      </div>
      
      <span className="hidden md:inline text-xs font-mono text-slate-400 italic">{item.year}</span>
      
      <div className="hidden md:flex gap-2 justify-end items-center">
        {/* We use stopPropagation so we can open external links without opening the modal */}
        {isPaper ? (
          <>
            <a 
              href={`https://scholar.google.com/scholar?q=${encodeURIComponent('ext:pdf "' + item.title + '" ' + item.author)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold px-2 py-1.5 rounded bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm gap-1"
              onClick={e => e.stopPropagation()}
              title="Download PDF"
            >
              <Download className="w-3 h-3" /> PDF
            </a>
            <a 
              href={`https://arxiv.org/search/query?query=${encodeURIComponent(item.title)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold px-2 py-1.5 rounded bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center shadow-sm"
              onClick={e => e.stopPropagation()}
            >
              arXiv
            </a>
            <a 
              href={`https://scholar.google.com/scholar?q=${encodeURIComponent(item.title + ' ' + item.author)}`}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 bg-white border border-slate-200 rounded flex items-center justify-center hover:border-blue-300 text-slate-600 hover:text-blue-600 shadow-sm transition-all"
              title="Google Scholar"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : isBook ? (
          <>
            <a 
              href={`https://scholar.google.com/scholar?q=${encodeURIComponent('ext:pdf "' + item.title + '" ' + item.author)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold px-2 py-1.5 rounded bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm gap-1"
              onClick={e => e.stopPropagation()}
              title="Download PDF"
            >
              <Download className="w-3 h-3" /> PDF
            </a>
            <a 
              href={`https://www.amazon.com/s?k=${encodeURIComponent(item.title + ' ' + item.author)}`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
              onClick={e => e.stopPropagation()}
            >
              Find Book
              <ExternalLink className="w-3 h-3" />
            </a>
          </>
        ) : (
          <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(item.title + ' ' + item.author)}`}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 bg-white border border-slate-200 rounded flex items-center justify-center hover:border-blue-300 text-slate-600 hover:text-blue-600 shadow-sm transition-all"
            title="Visit Resource"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function ItemModal({ item, userData, apiKeys, keyStatuses, onClose, onSave }: { item: LibraryItem, userData?: UserData, apiKeys: Record<string, string>, keyStatuses: Record<string, string>, onClose: () => void, onSave: (data: UserData) => void }) {
  const [notes, setNotes] = useState(userData?.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(userData?.tags || []);
  const [explanation, setExplanation] = useState(userData?.explanation || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeProviders = AI_PROVIDERS.filter(p => keyStatuses[p.id] === 'valid' || (p.id === 'gemini' && process.env.GEMINI_API_KEY));
  const [selectedProvider, setSelectedProvider] = useState<string>(activeProviders[0]?.id || 'gemini');

  useEffect(() => {
    if (!activeProviders.find(p => p.id === selectedProvider) && activeProviders.length > 0) {
      setSelectedProvider(activeProviders[0].id);
    }
  }, [activeProviders, selectedProvider]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleExplain = async () => {
    let key = apiKeys[selectedProvider];
    if (selectedProvider === 'gemini' && !key) key = process.env.GEMINI_API_KEY as string;
    
    if (!key) {
      setExplanation(`Error: API Key is not set for the selected provider. Please click the settings icon (⚙️) to add your key.`);
      return;
    }
    
    setIsGenerating(true);
    setExplanation("");
    try {
      const prompt = `You are an expert AI researcher. Please explain the significance, core concepts, and impact of the ${item.type} titled "${item.title}" by ${item.author} published in ${item.year}. Provide a comprehensive but accessible summary. Include a 'Key Takeaways' bulleted list. Keep it concise enough for a UI modal, around 2-3 paragraphs plus the bullets.`;
      
      let newExplanation = '';
      
      if (selectedProvider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        newExplanation = response.text || "No explanation could be generated.";
      } else if (selectedProvider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }] })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        newExplanation = data.choices[0].message.content;
      } else if (selectedProvider === 'groq') {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{ role: 'user', content: prompt }] })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        newExplanation = data.choices[0].message.content;
      }
      
      setExplanation(newExplanation);
      onSave({ notes, tags, explanation: newExplanation });
    } catch (error: any) {
      console.error(error);
      setExplanation(`Failed to generate explanation. Error: ${error.message || 'Ensure your API key is valid.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({ notes, tags, explanation });
    onClose();
  };

  const encodedQuery = encodeURIComponent(`${item.title} ${item.author}`);
  const scholarUrl = `https://scholar.google.com/scholar?q=${encodedQuery}`;
  const amazonUrl = `https://www.amazon.com/s?k=${encodedQuery}`;
  const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;

  const isBook = item.type === 'book';
  const isPaper = item.type === 'paper';

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: "100%" }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: "100%" }} 
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col relative z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white border border-slate-200 rounded flex items-center justify-center shrink-0">
              {isBook ? <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" /> : 
               isPaper ? <ScrollText className="w-4 h-4 md:w-5 md:h-5 text-orange-600" /> : 
               <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />}
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{item.type} • {item.year}</p>
              <h2 className="text-sm md:text-base font-bold text-slate-800 line-clamp-1">{item.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
             <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-sm md:text-base text-slate-600 mb-1">{item.author}</p>
            {item.venue && <p className="text-[11px] md:text-xs text-slate-500 font-mono mb-4">{item.venue}</p>}
            
            <div className="p-3 md:p-4 bg-slate-50 rounded-lg text-sm md:text-base text-slate-700 leading-relaxed border border-slate-100 shadow-sm">
              {item.significance}
            </div>
          </div>

          <div className="space-y-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <Tag className="w-4 h-4 text-blue-500" />
                 <h4 className="text-sm font-bold text-slate-800">Personal Tags</h4>
               </div>
               <div className="flex flex-wrap gap-2 mb-2">
                 {tags.map(t => (
                   <span key={t} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded flex items-center gap-1 border border-blue-100">
                     {t}
                     <button onClick={() => removeTag(t)} className="text-blue-400 hover:text-blue-800 focus:outline-none">
                       <X className="w-3 h-3" />
                     </button>
                   </span>
                 ))}
               </div>
               <input 
                 type="text" 
                 placeholder="Add tag and press Enter..." 
                 value={tagInput}
                 onChange={e => setTagInput(e.target.value)}
                 onKeyDown={handleAddTag}
                 className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
               />
            </div>

            <div>
               <div className="flex items-center gap-2 mb-2">
                 <MessageSquare className="w-4 h-4 text-emerald-500" />
                 <h4 className="text-sm font-bold text-slate-800">Research Notes</h4>
               </div>
               <textarea 
                 value={notes}
                 onChange={e => setNotes(e.target.value)}
                 placeholder="Add personal reflections, key takeaways, or follow-up ideas..."
                 className="w-full h-32 md:h-40 bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 custom-scrollbar resize-none"
               />
            </div>
          </div>
          
          {/* AI Explanation Deep Dive */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-100 rounded text-purple-600 font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-slate-800 tracking-tight">AI Deep Dive Explanation</h4>
            </div>
            
            {!explanation && !isGenerating && (
              <div className="flex flex-col gap-3">
                {activeProviders.length > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">Select AI Provider:</span>
                    <select 
                      value={selectedProvider}
                      onChange={e => setSelectedProvider(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 shadow-sm"
                    >
                      {activeProviders.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <button 
                  onClick={handleExplain} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-100 hover:border-purple-200 text-purple-800 rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Generate comprehensive overview and impact summary
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-8 gap-3 bg-slate-50 rounded-lg border border-slate-100">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="text-sm font-medium text-slate-600">Analyzing {item.type} with {AI_PROVIDERS.find(p => p.id === selectedProvider)?.name}...</span>
              </div>
            )}

            {explanation && !isGenerating && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6 text-sm text-slate-800 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-indigo-400" />
                <div className="markdown-body">
                  <Markdown>{explanation}</Markdown>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
                   {activeProviders.length > 1 ? (
                     <div className="flex items-center gap-2 w-full sm:w-auto">
                       <span className="text-xs text-slate-500 font-medium">Re-generate with:</span>
                       <select 
                         value={selectedProvider}
                         onChange={e => setSelectedProvider(e.target.value)}
                         className="bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-purple-400 flex-1 sm:flex-none"
                       >
                         {activeProviders.map(p => (
                           <option key={p.id} value={p.id}>{p.name}</option>
                         ))}
                       </select>
                     </div>
                   ) : (
                     <div className="text-xs text-slate-400 font-medium">Generated by {AI_PROVIDERS.find(p => p.id === selectedProvider)?.name || 'AI'}</div>
                   )}
                   <button 
                     onClick={handleExplain} 
                     className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                   >
                     <Sparkles className="w-3.5 h-3.5" /> Regenerate Analysis
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-slate-100 bg-white flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 shrink-0 pb-safe pb-8 md:pb-6">
          <div className="w-full md:w-auto grid grid-cols-2 md:flex gap-2">
             {(isPaper || isBook) && (
               <a href={`https://scholar.google.com/scholar?q=${encodeURIComponent('ext:pdf "' + item.title + '" ' + item.author)}`} target="_blank" rel="noreferrer" className="w-full md:w-auto text-center font-bold text-[11px] md:text-xs inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-colors border border-red-200 hover:border-red-600 shadow-sm col-span-2 md:col-span-1">
                 <Download className="w-3.5 h-3.5" /> Download PDF
               </a>
             )}
             {isPaper ? (
               <>
                 <a href={`https://arxiv.org/search/query?query=${encodeURIComponent(item.title)}`} target="_blank" rel="noreferrer" className="w-full md:w-auto text-center font-mono text-[11px] md:text-xs font-bold px-3 py-2.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors">
                   Search arXiv
                 </a>
                 <a href={scholarUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto text-center inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium text-[11px] md:text-xs hover:bg-blue-100 transition-colors border border-blue-200">
                   <ExternalLink className="w-3.5 h-3.5" /> Scholar
                 </a>
               </>
             ) : isBook ? (
               <a href={amazonUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto text-center inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-[11px] md:text-xs hover:bg-slate-800 transition-colors shadow-sm col-span-2 md:col-span-1">
                 <ExternalLink className="w-3.5 h-3.5" /> Find on Amazon
               </a>
             ) : (
               <a href={searchUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto text-center inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] md:text-xs hover:bg-slate-200 transition-colors border border-slate-200 col-span-2 md:col-span-1">
                 <ExternalLink className="w-3.5 h-3.5" /> Visit Resource
               </a>
             )}
          </div>
          
          <button onClick={handleSave} className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all text-center">
             Save Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}

