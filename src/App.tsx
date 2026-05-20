/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SidoProvider, useSido } from './context/SidoContext';
import { MainHeader } from './components/MainHeader';
import { MobileNavbar } from './components/MobileNavbar';
import { AnimeCard } from './components/AnimeCard';
import { AnimeDetailsModal } from './components/AnimeDetailsModal';
import { VideoPlayer } from './components/VideoPlayer';
import { PointsDashboard } from './components/PointsDashboard';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { AiSenpai } from './components/AiSenpai';
import { 
  Play, Search, Flame, Award, Film, ListOrdered, 
  HelpCircle, Sparkles, Heart, Trash2, Library, Star 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Main Inner Shell of the application (needs Sido context)
function AppShell() {
  const { 
    allAnime, activeAnime, activeEpisode, viewAnimeDetails, closePlayer,
    watchlist, removeFromWatchlist,
    searchTerm, setSearchTerm,
    selectedType, setSelectedType,
    selectedLanguage, setSelectedLanguage
  } = useSido();

  // Selected bottom navigation tab
  const [activeTab, setActiveTab] = useState('home');

  // Local watchlist sub-tab (fav | later | watched)
  const [watchlistTypeTab, setWatchlistTypeTab] = useState<'fav' | 'later' | 'watched'>('fav');

  // Featured carousel trending hero anime slider (starts with Jujutsu Kaisen ID 1)
  const featuredHeroAnime = useMemo(() => {
    return allAnime.find(a => a.id === 1) || allAnime[0];
  }, [allAnime]);

  // Handle click on categories shortcuts
  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    setSearchTerm(''); // clear search when switching genres
  };

  // Compute stats counter dynamically
  const appStats = useMemo(() => {
    const totalCount = allAnime.length;
    const countAboveEight = allAnime.filter(a => a.rating >= 8.8).length;
    const animeDubbed = allAnime.filter(a => a.language.includes("مدبلج")).length;
    const turkishCount = allAnime.filter(a => a.type === "turkish").length;

    return {
      total: totalCount + 120, // Add simulated offset to represent community size
      highlyRated: countAboveEight + 45,
      episodes: 2450,
      dubbed: animeDubbed + 80
    };
  }, [allAnime]);

  // Compute filtered grid item lists
  const filteredAnimeList = useMemo(() => {
    return allAnime.filter(anime => {
      // 1. Live search verification
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = anime.name.toLowerCase().includes(query);
        const matchesDesc = anime.description.toLowerCase().includes(query);
        const matchesGenre = anime.genre.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesGenre) return false;
      }

      // 2. Tab Type category matches
      if (selectedType !== 'all') {
        if (anime.type !== selectedType) return false;
      }

      // 3. Language settings checks
      if (selectedLanguage !== 'all') {
        const animeHasSub = anime.language.includes('مترجم');
        const animeHasDub = anime.language.includes('مدبلج');
        if (selectedLanguage === 'مترجم' && !animeHasSub) return false;
        if (selectedLanguage === 'مدبلج' && !animeHasDub) return false;
      }

      return true;
    });
  }, [allAnime, searchTerm, selectedType, selectedLanguage]);

  // Watchlist items listing matching current profile category
  const filteredWatchlistAnime = useMemo(() => {
    const targetIds = watchlist
      .filter(w => w.type === watchlistTypeTab)
      .map(w => w.anime_id);
    
    return allAnime.filter(a => targetIds.includes(a.id));
  }, [watchlist, watchlistTypeTab, allAnime]);

  return (
    <div className="min-h-screen bg-[#07050f] text-[#f0eeff] pb-24 flex flex-col font-sans select-none antialiased">
      
      {/* 1. Global Touch Header */}
      <MainHeader onTabChange={setActiveTab} activeTab={activeTab} />

      {/* 2. Primary Layout Swapper container wrapper */}
      <main className="flex-1 px-4 py-4 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* TAP A: HOME FEED layout */}
          {activeTab === 'home' && (
            <motion.div
              key="home-feed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Feature Hero banner slider card */}
              <div 
                id="hero-card"
                onClick={() => viewAnimeDetails(featuredHeroAnime)}
                className="relative h-[240px] md:h-[340px] rounded-3xl overflow-hidden border border-purple-950/20 shadow-2xl shadow-purple-950/10 active:scale-[0.99] transition-transform cursor-pointer group"
              >
                {/* Hero Images thumbnail slider */}
                <div className="absolute inset-0">
                  <img 
                    src={featuredHeroAnime.image} 
                    alt={featuredHeroAnime.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  {/* Dense gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07050f] via-[#07050f]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#07050f]/50 to-[#07050f]/90" />
                </div>

                {/* Hero details alignment */}
                <div className="absolute bottom-0 inset-x-0 p-5 md:p-8 flex flex-col justify-end text-right">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase text-center flex items-center gap-0.5">
                      <Flame size={9} className="animate-pulse" />
                      <span>{featuredHeroAnime.badge || "رائج رخيص"}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffcc00]/10 border border-[#ffcc00]/20 text-[#ffcc00] text-[9px] font-extrabold">
                      ⭐ {featuredHeroAnime.rating} من ١٠
                    </span>
                  </div>

                  <h2 className="text-lg md:text-2xl font-black text-[#ffcc00] leading-tight mt-2 drop-shadow-md">
                    {featuredHeroAnime.name.split(" - ")[0]}
                  </h2>
                  <p className="text-[10px] md:text-xs text-gray-300 line-clamp-2 mt-1.5 max-w-sm md:max-w-xl font-medium leading-relaxed">
                    {featuredHeroAnime.description}
                  </p>

                  <div className="mt-4 flex">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        viewAnimeDetails(featuredHeroAnime);
                      }}
                      className="py-2.5 px-6 rounded-full bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black text-xs font-black shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Play size={12} className="fill-black" />
                      <span>ابدأ المشاهدة الحرة</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid Statistics Widget */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#120f22]/25 p-3 rounded-2xl border border-purple-950/10">
                <div className="bg-[#120f22]/60 rounded-xl p-2.5 border border-white/5 text-center flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-300 shrink-0">
                    <Film size={18} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-base font-display font-black text-white">{appStats.total}</h4>
                    <span className="text-[9px] text-gray-500 font-bold block -mt-1">أنمي متاح</span>
                  </div>
                </div>

                <div className="bg-[#120f22]/60 rounded-xl p-2.5 border border-white/5 text-center flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-300 shrink-0">
                    <ListOrdered size={18} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-base font-display font-black text-white">{appStats.episodes}</h4>
                    <span className="text-[9px] text-gray-500 font-bold block -mt-1">حلقة كاملة</span>
                  </div>
                </div>

                <div className="bg-[#120f22]/60 rounded-xl p-2.5 border border-white/5 text-center flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-[#ffcc00] shrink-0">
                    <Award size={18} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-base font-display font-black text-[#ffcc00]">{appStats.highlyRated}</h4>
                    <span className="text-[9px] text-gray-500 font-bold block -mt-1">تقييم +٨.٨</span>
                  </div>
                </div>

                <div className="bg-[#120f22]/60 rounded-xl p-2.5 border border-white/5 text-center flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-300 shrink-0">
                    <Flame size={18} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-base font-display font-black text-white">{appStats.dubbed}</h4>
                    <span className="text-[9px] text-gray-500 font-bold block -mt-1">مسلسل مدبلج</span>
                  </div>
                </div>
              </div>

              {/* Floating Filter Box + Live Search bar input */}
              <div className="space-y-3">
                
                {/* Search text input */}
                <div className="relative">
                  <input
                    id="global-search-input"
                    type="text"
                    placeholder="ابحث عن أنمي المفضّل لديك، تصنيف، أو قصة حصرية..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 pr-11 rounded-2xl bg-[#120f22]/80 border border-purple-950/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#ffcc00] transition-colors"
                  />
                  <Search size={16} className="absolute top-3.5 right-4 text-gray-500" />
                </div>

                {/* Categories language buttons selector ("All", "Subbed", "Dubbed") */}
                <div className="flex gap-2.5 items-center bg-[#120f22]/35 p-1 rounded-2xl border border-white/5">
                  <button
                    id="filter-lang-all"
                    onClick={() => setSelectedLanguage('all')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-black transition-all ${selectedLanguage === 'all' ? 'bg-[#ffcc00] text-black font-extrabold shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    🎌 الكل
                  </button>
                  <button
                    id="filter-lang-sub"
                    onClick={() => setSelectedLanguage('مترجم')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-black transition-all ${selectedLanguage === 'مترجم' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    📝 مسلسل مترجم
                  </button>
                  <button
                    id="filter-lang-dub"
                    onClick={() => setSelectedLanguage('مدبلج')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-[10px] font-black transition-all ${selectedLanguage === 'مدبلج' ? 'bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-[#07050f] font-extrabold shadow-md' : 'text-gray-400 hover:text-white'}`}
                  >
                    🎙️ مسلسل مدبلج
                  </button>
                </div>

                {/* Genre horizontal scroller shortcuts */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-[10px] font-black font-sans scrollbar-hide min-w-full">
                  {[
                    { id: 'all', label: 'جميع الأقسام' },
                    { id: 'anime-subbed', label: 'أنمي مترجم ✨' },
                    { id: 'anime-dubbed', label: 'أنمي مدبلج 🎙️' },
                    { id: 'movies', label: 'أفلام الكرتون 🎬' },
                    { id: 'turkish', label: 'مسلسلات تركية ⚔️' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleTypeFilter(opt.id)}
                      className={`whitespace-nowrap px-4 py-2 border rounded-full transition-all active:scale-95 ${
                        selectedType === opt.id
                          ? 'border-[#ffcc00] bg-[#ffcc00]/10 text-[#ffcc00]'
                          : 'border-white/5 bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

              </div>

              {/* Anime Grid lists */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Flame size={14} className="text-amber-500" />
                    <span>جميع الأعمال المتوفرة حالياً</span>
                  </h3>
                  <span className="text-[10px] text-gray-500 font-sans font-bold">عرض ({filteredAnimeList.length}) عمل</span>
                </div>

                {filteredAnimeList.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {filteredAnimeList.map((anime) => (
                      <AnimeCard 
                        key={anime.id} 
                        anime={anime} 
                        onSelect={viewAnimeDetails} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-3xl bg-[#120f22]/20 border border-white/5 space-y-2">
                    <span className="text-3xl block">🏮</span>
                    <h4 className="text-xs font-bold text-gray-300">عذراً، لم نجد أي عمل بهذا الاسم</h4>
                    <p className="text-[10px] text-gray-500">جرب البحث بكلمات أبسط أو التأكد من إعدادات قسم الفلترة!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAP B: WATCHLIST LIBRARY layout */}
          {activeTab === 'watchlist' && (
            <motion.div
              key="watchlist-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-5"
            >
              <div className="text-center py-2">
                <span className="text-xs text-yellow-400 font-extrabold flex items-center justify-center gap-1">
                  <Library size={13} className="text-yellow-400 fill-yellow-400/20" />
                  <span>مكتبة الألبومات الخاصة بك</span>
                </span>
                <h2 className="text-sm font-bold text-white mt-0.5">تابع تقدمك في مشاهدة الأنمي بيسر وسهولة</h2>
              </div>

              {/* Sub tabs selectors (favourites, watch later, watched histories) */}
              <div className="flex items-center bg-[#120f22] p-1 rounded-2xl border border-white/5 text-[11px] font-black font-sans">
                <button
                  id="tab-watchlist-fav"
                  onClick={() => setWatchlistTypeTab('fav')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all ${watchlistTypeTab === 'fav' ? 'bg-[#ffcc00] text-black font-bold' : 'text-gray-400'}`}
                >
                  ❤️ المفضلة
                </button>
                <button
                  id="tab-watchlist-later"
                  onClick={() => setWatchlistTypeTab('later')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all ${watchlistTypeTab === 'later' ? 'bg-[#ffcc00] text-black font-bold' : 'text-gray-400'}`}
                >
                  🕒 لاحقاً
                </button>
                <button
                  id="tab-watchlist-watched"
                  onClick={() => setWatchlistTypeTab('watched')}
                  className={`flex-1 py-2 px-3 rounded-xl transition-all ${watchlistTypeTab === 'watched' ? 'bg-[#ffcc00] text-black font-bold' : 'text-gray-400'}`}
                >
                  ✅ شاهدتها كاملة
                </button>
              </div>

              {/* Grid content */}
              <div>
                {filteredWatchlistAnime.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {filteredWatchlistAnime.map((anime) => (
                      <div key={anime.id} className="relative group">
                        <AnimeCard anime={anime} onSelect={viewAnimeDetails} />
                        
                        {/* Quick deletion from watchlist button */}
                        <button
                          id={`delete-watchlist-btn-${anime.id}`}
                          onClick={() => removeFromWatchlist(anime.id)}
                          className="absolute bottom-2.5 left-2.5 z-20 p-2 rounded-xl bg-black/60 text-red-400 hover:text-red-500 hover:bg-black active:scale-90 transition-colors"
                          title="حذف من المكتبة"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 rounded-3xl bg-[#120f22]/15 border border-white/5 space-y-3">
                    <span className="text-4xl block">📚</span>
                    <h4 className="text-xs font-bold text-gray-400">مكتبتك فارغة حالياً في هذا القسم</h4>
                    <p className="text-[10px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                      تصفّح قائمة الأنمي والمسلسلات في الرئيسية، وقم بإضافة أي عمل تفضله لتنال سهولة المتابعة الفورية لاحقاً!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAP C: SMART AI ADVISOR layout */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai-advisor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AiSenpai />
            </motion.div>
          )}

          {/* TAP D: LOYALTY POINTS DASHBOARD layout */}
          {activeTab === 'prizes' && (
            <motion.div
              key="prizes-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <PointsDashboard />
            </motion.div>
          )}

          {/* TAP E: SUGGESTIONS BOARD layout */}
          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions-board"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <SuggestionsPanel />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. Active Anime Info modal Overlay */}
      <AnimatePresence>
        {activeAnime && !activeEpisode && (
          <AnimeDetailsModal 
            anime={activeAnime} 
            onClose={() => viewAnimeDetails(null)} 
          />
        )}
      </AnimatePresence>

      {/* 5. Custom Video Stream mock overlay stage */}
      <AnimatePresence>
        {activeAnime && activeEpisode && (
          <VideoPlayer 
            anime={activeAnime} 
            episode={activeEpisode} 
            onClose={closePlayer} 
          />
        )}
      </AnimatePresence>

      {/* 6. Sticky Mobile Bottom navigations */}
      <MobileNavbar activeTab={activeTab} onTabChange={setActiveTab} />

    </div>
  );
}

// Global wrap around provider
export default function App() {
  return (
    <SidoProvider>
      <AppShell />
    </SidoProvider>
  );
}
