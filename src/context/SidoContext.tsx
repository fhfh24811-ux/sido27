/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime, Episode, PointTransaction, WatchlistItem, Idea, Profile, AnimeRating } from '../types';
import { POPULAR_ANIME, generateEpisodes } from '../data/animeData';

interface SidoContextProps {
  currentProfile: Profile;
  watchlist: WatchlistItem[];
  ratings: AnimeRating[];
  transactions: PointTransaction[];
  suggestions: Idea[];
  allAnime: Anime[];
  activeAnime: Anime | null;
  activeEpisode: Episode | null;
  searchTerm: string;
  selectedType: string; // 'all' | 'anime-subbed' | 'anime-dubbed' | 'movies' | 'turkish'
  selectedLanguage: 'all' | 'مترجم' | 'مدبلج';
  
  // State Setters & Actions
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedLanguage: (lang: 'all' | 'مترجم' | 'مدبلج') => void;
  playEpisode: (anime: Anime, ep: Episode) => void;
  closePlayer: () => void;
  viewAnimeDetails: (anime: Anime | null) => void;
  
  // Watchlist Actions
  addToWatchlist: (animeId: number, type: 'fav' | 'later' | 'watched') => void;
  removeFromWatchlist: (animeId: number) => void;
  
  // Rating Actions
  rateAnime: (animeId: number, rating: number) => void;
  
  // Points & Profile Actions
  claimDailyLogin: () => { success: boolean; message: string; pointsEarned: number };
  earnPointsFromWatch: (animeId: number, epNumber: number) => void;
  claimReferral: (code: string) => { success: boolean; message: string };
  redeemGiftCard: (pointsCost: number, cardValue: string) => { success: boolean; message: string };
  resetUserData: () => void;
  
  // Suggestions Actions
  addSuggestion: (text: string, category: string) => void;
  voteSuggestion: (id: number) => void;
}

const SidoContext = createContext<SidoContextProps | undefined>(undefined);

export const SidoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // -----------------------------------------
  // 1. Initial Default Profiles & Storage Fetch
  // -----------------------------------------
  const [currentProfile, setCurrentProfile] = useState<Profile>(() => {
    const stored = localStorage.getItem('sido_profile');
    if (stored) return JSON.parse(stored);
    
    // Default profile for first time visitor
    return {
      username: `سيدو_${Math.floor(1000 + Math.random() * 9000)}`,
      points: 100, // Starts with +100 signup bonus points standard
      lastDailyLogin: null,
      referralCode: `SIDO${Math.floor(100000 + Math.random() * 900000)}`
    };
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const stored = localStorage.getItem('sido_watchlist');
    return stored ? JSON.parse(stored) : [];
  });

  const [ratings, setRatings] = useState<AnimeRating[]>(() => {
    const stored = localStorage.getItem('sido_ratings');
    return stored ? JSON.parse(stored) : [];
  });

  const [transactions, setTransactions] = useState<PointTransaction[]>(() => {
    const stored = localStorage.getItem('sido_transactions');
    if (stored) return JSON.parse(stored);
    
    // Add default signup bonus transaction list
    return [{
      id: 'signup-bonus',
      amount: 100,
      type: 'signup_bonus',
      note: 'مكافأة تسجيل حساب سيدو أنمي الجديد 🎇',
      created_at: new Date().toISOString()
    }];
  });

  const [suggestions, setSuggestions] = useState<Idea[]>(() => {
    const stored = localStorage.getItem('sido_suggestions');
    if (stored) return JSON.parse(stored);
    
    // Populated initial ideas
    return [
      {
        id: 1,
        text: "نريد ترجمة حصرية أسرع لحلقات ون بيس فور نزولها في اليابان",
        category: "ترجمة وحلقات",
        username: "محارب_الشونين",
        votes: 34,
        voted_by: [],
        created_at: new Date(Date.now() - 48 * 3600000).toISOString()
      },
      {
        id: 2,
        text: "إضافة خيار تحميل مجمع للمواسم الكاملة بروابط مباشرة سريعة سحابية",
        category: "مزايا تقنية",
        username: "أوتاكو_القرن",
        votes: 21,
        voted_by: [],
        created_at: new Date(Date.now() - 24 * 3600000).toISOString()
      },
      {
        id: 3,
        text: "تصنيفات خاصة بالأنميات الرياضية الكلاسيكية كـ سلام دانك و كابتن ماجد",
        category: "تصنيفات",
        username: "أسطورة_الملعب",
        votes: 12,
        voted_by: [],
        created_at: new Date(Date.now() - 12 * 3600000).toISOString()
      }
    ];
  });

  // -----------------------------------------
  // 2. Playback and Selection State
  // -----------------------------------------
  const [activeAnime, setActiveAnime] = useState<Anime | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'مترجم' | 'مدبلج'>('all');

  // -----------------------------------------
  // Cache state changes to LocalStorage
  // -----------------------------------------
  useEffect(() => {
    localStorage.setItem('sido_profile', JSON.stringify(currentProfile));
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem('sido_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('sido_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('sido_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sido_suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  // -----------------------------------------
  // Context Actions Handler
  // -----------------------------------------
  const playEpisode = (anime: Anime, ep: Episode) => {
    setActiveAnime(anime);
    setActiveEpisode(ep);
  };

  const closePlayer = () => {
    setActiveEpisode(null);
  };

  const viewAnimeDetails = (anime: Anime | null) => {
    setActiveAnime(anime);
    if (!anime) {
      setActiveEpisode(null);
    }
  };

  const addToWatchlist = (animeId: number, type: 'fav' | 'later' | 'watched') => {
    setWatchlist(prev => {
      const filtered = prev.filter(item => item.anime_id !== animeId);
      return [...filtered, { anime_id: animeId, type, created_at: new Date().toISOString() }];
    });
  };

  const removeFromWatchlist = (animeId: number) => {
    setWatchlist(prev => prev.filter(item => item.anime_id !== animeId));
  };

  const rateAnime = (animeId: number, rating: number) => {
    setRatings(prev => {
      const filtered = prev.filter(item => item.anime_id !== animeId);
      return [...filtered, { anime_id: animeId, rating }];
    });
  };

  const claimDailyLogin = () => {
    const todayStr = new Date().toDateString();
    
    // Check if claimed today already
    if (currentProfile.lastDailyLogin === todayStr) {
      return { success: false, message: 'لقد استلمت جائزتك اليومية بالفعل! عد غداً للمزيد 🎁', pointsEarned: 0 };
    }
    
    // Points rule: Friday carries DOUBLE points (+100 instead of +50)
    const isFriday = new Date().getDay() === 5;
    const pointsToAdd = isFriday ? 100 : 50;
    
    // Update profile
    setCurrentProfile(prev => ({
      ...prev,
      points: prev.points + pointsToAdd,
      lastDailyLogin: todayStr
    }));

    // Log transaction
    const newTx: PointTransaction = {
      id: `daily-${Date.now()}`,
      amount: pointsToAdd,
      type: 'daily_login',
      note: isFriday ? 'تسجيل دخول يوم الجمعة المبارك (نقاط مضاعفة! 🌟)' : 'تسجيل الدخول اليومي السريع ⚡',
      created_at: new Date().toISOString()
    };
    
    setTransactions(prev => [newTx, ...prev]);
    return { success: true, message: `مبروك! حصلت على +${pointsToAdd} نقطة سيدو 🏆`, pointsEarned: pointsToAdd };
  };

  const earnPointsFromWatch = (animeId: number, epNumber: number) => {
    const anime = POPULAR_ANIME.find(a => a.id === animeId);
    const animeTitle = anime ? anime.name.split(" - ")[0] : "الحلقة";
    
    const pointsToAdd = 10;
    
    // Update points
    setCurrentProfile(prev => ({
      ...prev,
      points: prev.points + pointsToAdd
    }));

    const newTx: PointTransaction = {
      id: `watch-${Date.now()}`,
      amount: pointsToAdd,
      type: 'watch',
      note: `مشاهدة الحلقة ${epNumber} من أنمي ${animeTitle} 🍿`,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const claimReferral = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (!cleaned.startsWith("SIDO") || cleaned.length < 8) {
      return { success: false, message: "رمز الإحالة غير صحيح أو غير متطابق ❌" };
    }
    if (cleaned === currentProfile.referralCode) {
      return { success: false, message: "لا يمكنك استخدام رمز الإحالة الخاص بك ⛔" };
    }

    const pointsToAdd = 200;
    setCurrentProfile(prev => ({
      ...prev,
      points: prev.points + pointsToAdd
    }));

    const newTx: PointTransaction = {
      id: `ref-${Date.now()}`,
      amount: pointsToAdd,
      type: 'referral',
      note: `تفعيل دعوة صديق سيدو بنجاح (رمز: ${cleaned}) 🤝`,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, message: `تم تفعيل الرمز بنجاح! كسبت +${pointsToAdd} نقطة سيدو 🎉` };
  };

  const redeemGiftCard = (pointsCost: number, cardValue: string) => {
    if (currentProfile.points < pointsCost) {
      return { success: false, message: "عذراً! ليس لديك نقاط كافية لتبديل هذه البطاقة 🪙" };
    }

    // Deduct points
    setCurrentProfile(prev => ({
      ...prev,
      points: prev.points - pointsCost
    }));

    const newTx: PointTransaction = {
      id: `redeem-${Date.now()}`,
      amount: -pointsCost,
      type: 'redeem',
      note: `استرداد بطاقة هدايا سيدو بقيمة ${cardValue} 🎟️`,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);

    return { success: true, message: `رائع! تم طلب بطاقة بقيمة ${cardValue}. تواصل مع الإدارة لاستلام الكود الخاص بها 🥳` };
  };

  const resetUserData = () => {
    const freshProfile = {
      username: `سيدو_${Math.floor(1000 + Math.random() * 9000)}`,
      points: 100,
      lastDailyLogin: null,
      referralCode: `SIDO${Math.floor(100000 + Math.random() * 900000)}`
    };
    const freshTx: PointTransaction[] = [{
      id: 'signup-bonus',
      amount: 100,
      type: 'signup_bonus',
      note: 'مكافأة تسجيل حساب سيدو أنمي الجديد 🎇',
      created_at: new Date().toISOString()
    }];
    
    setCurrentProfile(freshProfile);
    setWatchlist([]);
    setRatings([]);
    setTransactions(freshTx);
    setActiveAnime(null);
    setActiveEpisode(null);
  };

  const addSuggestion = (text: string, category: string) => {
    if (!text.trim()) return;
    const newId = suggestions.length ? Math.max(...suggestions.map(s => s.id)) + 1 : 1;
    const newIdea: Idea = {
      id: newId,
      text: text.trim(),
      category: category,
      username: currentProfile.username,
      votes: 1,
      voted_by: [currentProfile.username],
      created_at: new Date().toISOString()
    };
    setSuggestions(prev => [newIdea, ...prev]);
  };

  const voteSuggestion = (id: number) => {
    setSuggestions(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const userHasVoted = item.voted_by.includes(currentProfile.username);
      if (userHasVoted) {
        // Undo vote
        return {
          ...item,
          votes: item.votes - 1,
          voted_by: item.voted_by.filter(u => u !== currentProfile.username)
        };
      } else {
        // Cast vote
        return {
          ...item,
          votes: item.votes + 1,
          voted_by: [...item.voted_by, currentProfile.username]
        };
      }
    }));
  };

  return (
    <SidoContext.Provider value={{
      currentProfile,
      watchlist,
      ratings,
      transactions,
      suggestions,
      allAnime: POPULAR_ANIME,
      activeAnime,
      activeEpisode,
      searchTerm,
      selectedType,
      selectedLanguage,
      
      setSearchTerm,
      setSelectedType,
      setSelectedLanguage,
      playEpisode,
      closePlayer,
      viewAnimeDetails,
      
      addToWatchlist,
      removeFromWatchlist,
      rateAnime,
      
      claimDailyLogin,
      earnPointsFromWatch,
      claimReferral,
      redeemGiftCard,
      resetUserData,
      
      addSuggestion,
      voteSuggestion
    }}>
      {children}
    </SidoContext.Provider>
  );
};

export const useSido = () => {
  const context = useContext(SidoContext);
  if (!context) throw new Error('useSido must be used inside SidoProvider');
  return context;
};
