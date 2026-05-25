/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Anime, Episode, WatchlistItem, Suggestion, Comment } from '../types';

interface SidoContextType {
  currentUser: User | null;
  allAnime: Anime[];
  watchlist: WatchlistItem[];
  suggestions: Suggestion[];
  activeAnime: Anime | null;
  activeEpisode: Episode | null;
  loading: boolean;
  error: string | null;

  // Search & Filtering
  searchTerm: string;
  setSearchTerm: (t: string) => void;
  selectedType: string;
  setSelectedType: (t: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (t: string) => void;

  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  rewardPoints: (amount: number, action: string) => Promise<void>;
  
  refreshAnime: () => Promise<void>;
  addNewAnime: (data: Omit<Anime, 'id'>) => Promise<boolean>;
  deleteAnime: (id: string) => Promise<boolean>;
  addNewEpisode: (data: Omit<Episode, 'id'>) => Promise<boolean>;
  deleteEpisode: (id: string) => Promise<boolean>;
  fetchEpisodes: (animeId: string) => Promise<Episode[]>;

  addToWatchlist: (animeId: string, type: 'fav' | 'later' | 'watched') => Promise<void>;
  removeFromWatchlist: (animeId: string) => Promise<void>;
  loadWatchlist: () => Promise<void>;

  addSuggestion: (text: string, category: string) => Promise<void>;
  voteSuggestion: (id: string) => Promise<void>;
  loadSuggestions: () => Promise<void>;

  fetchComments: (animeId: string) => Promise<Comment[]>;
  postComment: (animeId: string, text: string) => Promise<boolean>;

  viewAnimeDetails: (anime: Anime | null) => void;
  playEpisode: (episode: Episode | null) => void;
  closePlayer: () => void;
}

const SidoContext = createContext<SidoContextType | undefined>(undefined);

export const SidoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('sido_user');
    return cached ? JSON.parse(cached) : null;
  });

  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const [activeAnime, setActiveAnime] = useState<Anime | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter properties
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  // Load baseline values from API
  const refreshAnime = useCallback(async () => {
    try {
      const res = await fetch('/api/anime');
      if (res.ok) {
        const list = await res.json();
        setAllAnime(list);
      }
    } catch (err) {
      console.error('Failed to load anime list', err);
    }
  }, []);

  const loadWatchlist = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.username}/watchlist`);
      if (res.ok) {
        const list = await res.json();
        setWatchlist(list);
      }
    } catch (err) {
      console.error('Failed to load watchlist', err);
    }
  }, [currentUser]);

  const loadSuggestions = useCallback(async () => {
    try {
      const res = await fetch('/api/suggestions');
      if (res.ok) {
        const list = await res.json();
        setSuggestions(list);
      }
    } catch (err) {
      console.error('Failed to load suggestions', err);
    }
  }, []);

  useEffect(() => {
    refreshAnime();
    loadSuggestions();
  }, [refreshAnime, loadSuggestions]);

  useEffect(() => {
    if (currentUser) {
      loadWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [currentUser, loadWatchlist]);

  // Sync user object to local cache
  const updateCachedUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('sido_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sido_user');
    }
  };

  // Login handler
  const login = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل تسجيل الدخول');
        return false;
      }
      updateCachedUser(data.user);
      return true;
    } catch (err) {
      setError('خطأ في الاتصال بالخادم الرئيسي');
      return false;
    }
  };

  // Register handler
  const register = async (username: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشلت عملية إنشاء الحساب');
        return false;
      }
      updateCachedUser(data.user);
      return true;
    } catch (err) {
      setError('خطأ في الاتصال بالخادم الرئيسي');
      return false;
    }
  };

  const logout = () => {
    updateCachedUser(null);
    setActiveAnime(null);
    setActiveEpisode(null);
  };

  // Add Points reward
  const rewardPoints = async (amount: number, action: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.username}/reward`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, action })
      });
      if (res.ok) {
        const data = await res.json();
        updateCachedUser(data.user);
      }
    } catch (err) {
      console.error('Error updating points', err);
    }
  };

  // Add new anime catalogs
  const addNewAnime = async (data: Omit<Anime, 'id'>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch('/api/anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, requesterRole: currentUser.role })
      });
      if (res.ok) {
        await refreshAnime();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add new anime listing', err);
      return false;
    }
  };

  const deleteAnime = async (id: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch(`/api/anime/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterRole: currentUser.role })
      });
      if (res.ok) {
        await refreshAnime();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete anime Listing', err);
      return false;
    }
  };

  // Add individual Episode
  const addNewEpisode = async (data: Omit<Episode, 'id'>): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch('/api/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, requesterRole: currentUser.role })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to add new episode', err);
      return false;
    }
  };

  const deleteEpisode = async (id: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    try {
      const res = await fetch(`/api/episodes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterRole: currentUser.role })
      });
      return res.ok;
    } catch (err) {
      console.error('Failed to delete episode', err);
      return false;
    }
  };

  // Get episodes of custom anime list
  const fetchEpisodes = async (animeId: string): Promise<Episode[]> => {
    try {
      const res = await fetch(`/api/anime/${animeId}/episodes`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Failed fetch episodes', err);
    }
    return [];
  };

  // Watchlist Actions management
  const addToWatchlist = async (animeId: string, type: 'fav' | 'later' | 'watched') => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username, anime_id: animeId, type })
      });
      if (res.ok) {
        await loadWatchlist();
      }
    } catch (err) {
      console.error('Failed adding entry to watchlist', err);
    }
  };

  const removeFromWatchlist = async (animeId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username, anime_id: animeId })
      });
      if (res.ok) {
        await loadWatchlist();
      }
    } catch (err) {
      console.error('Failed removing entry from watchlist', err);
    }
  };

  // Suggestion actions
  const addSuggestion = async (text: string, category: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username, category, text })
      });
      if (res.ok) {
        await loadSuggestions();
      }
    } catch (err) {
      console.error('Failed sending suggestion', err);
    }
  };

  const voteSuggestion = async (id: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/suggestions/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username })
      });
      if (res.ok) {
        await loadSuggestions();
      }
    } catch (err) {
      console.error('Failed voting suggest', err);
    }
  };

  // Comments feed API
  const fetchComments = async (animeId: string): Promise<Comment[]> => {
    try {
      const res = await fetch(`/api/anime/${animeId}/comments`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Failed comments list fetch', err);
    }
    return [];
  };

  const postComment = async (animeId: string, text: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anime_id: animeId, username: currentUser.username, text })
      });
      return res.ok;
    } catch (err) {
      console.error('comment failed', err);
      return false;
    }
  };

  // Simple visual swappers
  const viewAnimeDetails = (anime: Anime | null) => {
    setActiveAnime(anime);
    setActiveEpisode(null);
  };

  const playEpisode = (episode: Episode | null) => {
    setActiveEpisode(episode);
  };

  const closePlayer = () => {
    setActiveEpisode(null);
  };

  return (
    <SidoContext.Provider value={{
      currentUser, allAnime, watchlist, suggestions,
      activeAnime, activeEpisode, loading, error,
      searchTerm, setSearchTerm,
      selectedType, setSelectedType,
      selectedLanguage, setSelectedLanguage,

      login, register, logout, rewardPoints,
      refreshAnime, addNewAnime, deleteAnime, addNewEpisode, deleteEpisode, fetchEpisodes,
      addToWatchlist, removeFromWatchlist, loadWatchlist,
      addSuggestion, voteSuggestion, loadSuggestions,
      fetchComments, postComment,
      viewAnimeDetails, playEpisode, closePlayer
    }}>
      {children}
    </SidoContext.Provider>
  );
};

export const useSido = () => {
  const context = useContext(SidoContext);
  if (context === undefined) {
    throw new Error('useSido must be used within SidoProvider');
  }
  return context;
};
