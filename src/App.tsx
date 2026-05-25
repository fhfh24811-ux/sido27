/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SidoProvider, useSido } from './context/SidoContext';
import { MainHeader } from './components/MainHeader';
import { MobileNavbar } from './components/MobileNavbar';
import { AnimeCard } from './components/AnimeCard';
import { AnimeDetailsModal } from './components/AnimeDetailsModal';
import { VideoPlayer } from './components/VideoPlayer';
import { AdminPanel } from './components/AdminPanel';
import { PointsDashboard } from './components/PointsDashboard';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { AiSenpai } from './components/AiSenpai';
import { LoginModal } from './components/LoginModal';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { 
  PlusCircle, Sparkles, BookOpen, Star, HelpCircle, 
  Search, SlidersHorizontal, Heart, Trash2, Calendar, ShieldCheck, X
} from 'lucide-react';

export function SidoApp() {
  const {
    currentUser, allAnime, watchlist, activeAnime, activeEpisode,
    searchTerm, setSearchTerm, selectedType, setSelectedType,
    selectedLanguage, setSelectedLanguage,
    viewAnimeDetails, closePlayer, removeFromWatchlist
  } = useSido();

  const [activeTab, setActiveTab] = useState('home');
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Click outside handling for search suggestions
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#catalog-search-wrapper')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeSuggestions = searchTerm.trim()
    ? allAnime.filter(anime => 
        anime.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (anime.description && anime.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Filter & Search Logic
  const filteredAnime = allAnime.filter(anime => {
    const matchesSearch = anime.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          anime.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || anime.type === selectedType;
    const matchesLanguage = selectedLanguage === 'all' || anime.language.includes(selectedLanguage);
    
    return matchesSearch && matchesType && matchesLanguage;
  });

  // Load watchlist full elements
  const userWatchlistAnime = allAnime.filter(anime => 
    watchlist.some(w => w.anime_id === anime.id)
  );

  return (
    <div className="min-h-screen bg-[#07050f] text-[#f0eeff] flex flex-col relative font-sans overflow-x-hidden pb-16">
      
      {/* 1. Header component */}
      <MainHeader onTabChange={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} activeTab={activeTab} />

      {/* 2. Primary layout view ports */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 relative">
        
        {/* TAB 1: HOME CATALOG FEED */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* Catalog Hero slider / banner info */}
            <FeaturedCarousel 
              animeList={allAnime} 
              onSelectAnime={viewAnimeDetails} 
            />

            {/* Catalog Content - IF empty showcase admin guidelines */}
            {allAnime.length === 0 ? (
              <div className="py-12 px-6 rounded-3xl bg-[#120f22]/50 border border-yellow-500/15 text-center max-w-lg mx-auto space-y-5">
                <span className="text-4xl block animate-bounce">📦</span>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-white">قاعدة بيانات المحتويات فارغة حالياً</h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                    بناءً على اختيارك "لاتوضياف انميات انا اريد اضافته بنفسي"، تبدأ المنصة نظيفة تماماً دون مسلسلات افتراضية.
                  </p>
                  <div className="p-3 bg-[#07050f] rounded-2xl border border-white/5 text-[10px] text-gray-500 text-right leading-relaxed font-medium">
                    ✨ <b>التعليمات البسيطة للبدء:</b>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>اضغط على "تسجيل الدخول / البدء" في الأعلى وأنشئ حسابك.</li>
                      <li><b>الحساب الأول</b> الذي تسجله في الموقع سيتم تعيين رتبته تلقائياً كـ <b>أدمن كامل الصلاحيات</b>!</li>
                      <li>بعد التسجيل، ستظهر لك مبوبة <b>"لوحة التحكم"</b> في الأسفل.</li>
                      <li>يمكنك من لوحة التحكم إدخال الأنميات من غوغل وبث حلقاتها فورياً لتظهر هنا!</li>
                    </ol>
                  </div>
                </div>

                {!currentUser ? (
                  <button
                    id="no-anime-register-call"
                    onClick={() => setShowLoginOverlay(true)}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-black font-extrabold text-xs active:scale-95 duration-200"
                  >
                    📝 تفعيل وضع الأدمن والبدء في الإضافة الآن
                  </button>
                ) : (
                  <button
                    id="no-anime-admin-call"
                    onClick={() => {
                      if (currentUser.role === 'admin') setActiveTab('admin');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs active:scale-95 duration-200"
                  >
                    ⚙️ الدخول للوحة التحكم لإدارته بنفسي
                  </button>
                )}
              </div>
            ) : (
              // Case: Anime lists have entries
              <div className="space-y-4">
                
                {/* Search console & Categories select filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-right">
                  
                  {/* Categorized filter selection labels */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 shrink-0 flex-row-reverse justify-end">
                    {[
                      { id: 'all', title: 'الكل دقة عالية' },
                      { id: 'anime-subbed', title: 'أنمي مترجم 🏮' },
                      { id: 'anime-dubbed', title: 'أنمي مدبلج 👼' },
                      { id: 'movies', title: 'أفلام سينمائية 🎬' },
                      { id: 'turkish', title: 'مسلسلات تركية (مترجم/مدبلج) 🇹🇷' }
                    ].map((tab) => (
                      <button
                        id={`category-filter-${tab.id}`}
                        key={tab.id}
                        onClick={() => setSelectedType(tab.id)}
                        className={`text-[10px] font-black px-3.5 py-1.5 rounded-full duration-150 active:scale-95 shrink-0 ${
                          selectedType === tab.id
                            ? 'bg-yellow-400 text-black shadow'
                            : 'bg-[#120f22] text-[#887aaa] hover:text-white'
                        }`}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>

                  {/* Search and Advanced Filter sliders */}
                  <div className="flex items-center gap-2 w-full sm:w-80">
                    <button
                      id="toggle-filter-btn"
                      onClick={() => setShowFilters(!showFilters)}
                      className="p-3 rounded-2xl bg-[#120f22] text-gray-400 hover:text-white border border-transparent hover:border-white/5"
                    >
                      <SlidersHorizontal size={13} />
                    </button>

                    <div className="relative flex-1" id="catalog-search-wrapper">
                      <input
                        id="catalog-search-input"
                        type="text"
                        placeholder="ابحث عن أنمي المفضلة لديك..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full px-4 py-2.5 pr-10 pl-8 rounded-2xl bg-[#120f22] border border-white/5 text-xs text-right text-white placeholder-gray-600 font-bold focus:outline-none focus:border-[#ffcc00]"
                      />
                      <Search size={13} className="absolute top-3.5 right-4 text-gray-500 animate-pulse" />
                      
                      {searchTerm && (
                        <button 
                          onClick={() => { 
                            setSearchTerm(''); 
                            setShowSuggestions(false); 
                          }}
                          className="absolute top-3.5 left-3.5 p-0.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                          title="مسح البحث"
                        >
                          <X size={11} />
                        </button>
                      )}

                      {/* Intelligent Search Suggestions Dropdown */}
                      {showSuggestions && activeSuggestions.length > 0 && (
                        <div className="absolute top-full right-0 left-0 mt-2 bg-[#120f22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-right backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="px-3 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between">
                            <button 
                              onClick={() => setShowSuggestions(false)}
                              className="text-[9px] text-gray-500 hover:text-white transition-all flex items-center gap-1"
                            >
                              <X size={10} />
                              <span>إغلاق</span>
                            </button>
                            <span className="text-[9px] text-[#ffcc00] font-black">اقتراحات البحث الذكي ⚡</span>
                          </div>
                          <div className="p-1.5 max-h-60 overflow-y-auto space-y-1">
                            {activeSuggestions.map((anime) => (
                              <button
                                id={`search-suggestion-item-${anime.id}`}
                                key={anime.id}
                                onClick={() => {
                                  viewAnimeDetails(anime);
                                  setShowSuggestions(false);
                                }}
                                className="w-full p-2 hover:bg-[#ffcc00]/5 hover:border-l-2 hover:border-l-[#ffcc00] rounded-xl flex items-center gap-3 justify-between text-right group/item transition-all"
                              >
                                <span className="text-[9px] text-yellow-500 bg-yellow-400/10 px-1.5 py-0.5 rounded font-bold font-mono shrink-0 flex items-center gap-0.5">
                                  ★ {anime.rating ? anime.rating.toFixed(1) : '9.0'}
                                </span>

                                <div className="flex-1 min-w-0 pr-1">
                                  <span className="text-[10px] font-black text-white group-hover/item:text-[#ffcc00] block truncate">
                                    {anime.name}
                                  </span>
                                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                                    <span className="text-[8px] text-gray-400 font-medium">
                                      {anime.language}
                                    </span>
                                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded ${
                                      anime.status === 'completed' 
                                        ? 'bg-emerald-500/10 text-emerald-400' 
                                        : 'bg-sky-500/10 text-sky-400'
                                    }`}>
                                      {anime.status === 'completed' ? 'مكتمل ✅' : 'مستمر ⚡'}
                                    </span>
                                    <span className="text-[8px] text-purple-400 bg-purple-900/10 px-1.5 py-0.5 rounded-sm">
                                      {anime.type === 'anime-subbed' ? 'مترجم' : anime.type === 'anime-dubbed' ? 'مدبلج' : anime.type === 'movies' ? 'فيلم' : 'دراما'}
                                    </span>
                                  </div>
                                </div>

                                <img 
                                  src={anime.image} 
                                  alt={anime.name} 
                                  className="w-7 h-9 rounded object-cover bg-gray-900 shrink-0" 
                                  referrerPolicy="no-referrer"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Additional advanced filters drawer panel */}
                {showFilters && (
                  <div className="p-4 rounded-2xl bg-[#120f22]/60 border border-white/5 text-right grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">ترتيب النتائج</label>
                      <select 
                        id="filter-sort-by"
                        className="w-full px-3 py-2 bg-[#07050f] rounded-xl text-[10px] font-bold text-white focus:outline-none"
                      >
                        <option>الأحدث تحديثاً</option>
                        <option>أعلى تقييم مشاهدة</option>
                        <option>أبجدياً (أ - ي)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">اللغة والدبلجة</label>
                      <select 
                        id="filter-lang-by"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-3 py-2 bg-[#07050f] rounded-xl text-[10px] font-bold text-white focus:outline-none"
                      >
                        <option value="all">كل اللغات</option>
                        <option value="مترجم">مترجم للعربية</option>
                        <option value="مدبلج">مدبلج بالكامل</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Dynamic Anime Grid */}
                {filteredAnime.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4.5">
                    {filteredAnime.map((anime) => (
                      <AnimeCard 
                        key={anime.id} 
                        anime={anime} 
                        onSelect={viewAnimeDetails} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center rounded-3xl bg-black/10 text-gray-500 text-[11px] leading-relaxed">
                    لم نجد أي أعمال فنية تطابق معايير بحثك المكتوبة حالياً 🏮
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TAB 2: LIBRARY / WATCHLIST VIEW */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6 text-right">
            
            <div className="bg-[#120f22]/70 p-5 rounded-3xl border border-purple-500/10">
              <h2 className="text-base font-black text-white flex items-center justify-end gap-1.5">
                <span>مكتبتي ومفضلتي الشخصية</span>
                <Heart size={16} className="text-red-500 fill-current" />
              </h2>
              <p className="text-[10px] text-gray-500 mt-1">هنا يظهر سجل مشاهداتك الفني، والأعمال التي قمت بحفظها للمشاهدة لاحقاً في حسابك الشخصي.</p>
            </div>

            {!currentUser ? (
              <div className="max-w-md mx-auto py-12 px-6 rounded-3xl bg-[#120f22]/30 border border-white/5 text-center space-y-4">
                <span className="text-3xl block">🔑</span>
                <h3 className="text-xs font-black text-white">تسجيل الدخول مطلوب</h3>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">يرجى تسجيل الدخول أو إنشاء حسابك لحفظ الأنميات والمفضلات والوصول إلى سجل مشاهداتك في أي لحظة ومن أي جهاز!</p>
                <button
                  id="watchlist-login-call"
                  onClick={() => setShowLoginOverlay(true)}
                  className="w-full max-w-xs py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-black font-extrabold text-[11px] active:scale-95 duration-200"
                >
                  الدخول / البدء الآن
                </button>
              </div>
            ) : userWatchlistAnime.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4.5">
                {userWatchlistAnime.map((anime) => {
                  const item = watchlist.find(w => w.anime_id === anime.id);
                  return (
                    <div key={anime.id} className="relative group">
                      <AnimeCard 
                        anime={anime} 
                        onSelect={viewAnimeDetails} 
                      />
                      {/* Floating Delete watchlist marker */}
                      <button
                        id={`delete-watchlist-${anime.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(anime.id);
                        }}
                        className="absolute bottom-2 right-2 p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg active:scale-90 transition-all z-20"
                        title="إزالة من مكتبتي"
                      >
                        <Trash2 size={11} />
                      </button>
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[8px] font-black text-yellow-400 z-10">
                        {item?.type === 'fav' ? 'مفضلة' : item?.type === 'later' ? 'لاحقاً' : 'تمت المشاهدة'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center rounded-3xl bg-[#120f22]/30 border border-white/5 text-gray-500 text-[11px] leading-relaxed max-w-lg mx-auto">
                مكتبتك الشخصية فارغة حالياً 🍃<br />
                تصفح الواجهة الرئيسية للموقع وأضف بعض الأنميات الرهيبة لقائمتك التفاعلية!
              </div>
            )}

          </div>
        )}

        {/* TAB 3: SMART AI BOT RECOM */}
        {activeTab === 'ai' && <AiSenpai />}

        {/* TAB 4: REWARD POINTS AND DAILY WHEEL */}
        {activeTab === 'prizes' && <PointsDashboard />}

        {/* TAB 5: SUGGESTIONS PUBLIC BOARD */}
        {activeTab === 'suggestions' && <SuggestionsPanel />}

        {/* TAB 6: ADMIN PRIVATE CONSOLE */}
        {activeTab === 'admin' && <AdminPanel />}

        {/* TAB 7: PROFILE OVERVIEW */}
        {activeTab === 'profile' && currentUser && (
          <div className="max-w-2xl mx-auto space-y-6 text-right pb-12">
            
            {/* Header info card */}
            <div className="bg-[#120f22]/70 p-6 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-3">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.username} 
                className="w-16 h-16 rounded-2xl object-cover bg-purple-900/30"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-1.5 justify-center">
                  <span>{currentUser.username}</span>
                  {currentUser.role === 'admin' && (
                    <span className="px-1.5 text-[8px] rounded bg-yellow-400/10 text-yellow-400 font-extrabold border border-yellow-400/20">الأدمن المالك</span>
                  )}
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">صديق وفي لمنصة سيدو - عضو مسجل منذ عام ٢٠٢٦</p>
              </div>

              {/* Status and scores indicators */}
              <div className="grid grid-cols-2 gap-4 mt-2 w-full max-w-md">
                <div className="bg-[#07050f] p-3 rounded-2xl border border-white/5 text-center">
                  <span className="text-xl font-black text-yellow-400 font-mono">⭐ {currentUser.points}</span>
                  <span className="block text-[8px] text-gray-500 font-bold mt-0.5">مجموع النقاط</span>
                </div>
                <div className="bg-[#07050f] p-3 rounded-2xl border border-white/5 text-center">
                  <span className="text-xl font-black text-purple-400 font-mono">١,٠٠٠+</span>
                  <span className="block text-[8px] text-gray-500 font-bold mt-0.5">جاهزية خادم الكلاود دفق</span>
                </div>
              </div>
            </div>

            {/* Loyalty levels metrics */}
            <div className="bg-[#120f22]/40 p-5 rounded-3xl border border-white/5 space-y-4">
              <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                <span>مستوى ترقية الأوتاكو الخاص بك</span>
                <ShieldCheck size={14} className="text-yellow-400" />
              </h4>

              {/* Fake level state indicators bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-gray-500">
                  <span>المستوى التالي: أوتاكو بلاتيني</span>
                  <span>أوتاكو مبتدئ</span>
                </div>
                <div className="w-full h-2 bg-purple-950/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-yellow-400 w-1/3" />
                </div>
                <p className="text-[9px] text-[#887aaa] leading-relaxed">شاهد المزيد من الحلقات وتفاعل مع الأصدقاء لترقية حسابك والحصول على رموز تعليقات نادرة!</p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 3. Bottom mobile bar navigation tabs always visible */}
      <MobileNavbar activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* 4. Active details modal screen */}
      {activeAnime && (
        <AnimeDetailsModal 
          anime={activeAnime} 
          onClose={() => viewAnimeDetails(null)} 
        />
      )}

      {/* 5. Responsive interactive video player container */}
      {activeEpisode && (
        <VideoPlayer 
          episode={activeEpisode} 
          onClose={closePlayer} 
        />
      )}

      {/* 6. Authentications login interface drawer fallback screen */}
      {showLoginOverlay && (
        <LoginModal onClose={() => setShowLoginOverlay(false)} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <SidoProvider>
      <SidoApp />
    </SidoProvider>
  );
}
