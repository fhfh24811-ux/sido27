/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSido } from '../context/SidoContext';
import { Anime, Episode, Comment } from '../types';
import { X, Play, Heart, Bookmark, Calendar, MessageSquare, Send, Check } from 'lucide-react';

interface AnimeDetailsModalProps {
  anime: Anime;
  onClose: () => void;
}

export const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({ anime, onClose }) => {
  const { 
    currentUser, addToWatchlist, removeFromWatchlist, watchlist,
    playEpisode, fetchEpisodes, fetchComments, postComment
  } = useSido();

  // Dialog lists states
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  
  // States loads
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  // Check watchlist statuses
  const isFav = watchlist.some(w => w.anime_id === anime.id && w.type === 'fav');
  const isLater = watchlist.some(w => w.anime_id === anime.id && w.type === 'later');
  const isWatched = watchlist.some(w => w.anime_id === anime.id && w.type === 'watched');

  // Load episodes and comments dynamically
  const loadData = useCallback(async () => {
    try {
      setLoadingEpisodes(true);
      const epList = await fetchEpisodes(anime.id);
      setEpisodes(epList || []);
      setLoadingEpisodes(false);

      setLoadingComments(true);
      const cList = await fetchComments(anime.id);
      setComments(cList || []);
      setLoadingComments(false);
    } catch (err) {
      console.error('Error loading anime details data modal', err);
    }
  }, [anime.id, fetchEpisodes, fetchComments]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle posting a comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('الرجاء تسجيل الدخول أولاً لتستطيع التعليق والتفاعل مع الأصدقاء! 🚪✨');
      return;
    }
    if (!newCommentText.trim()) return;

    const success = await postComment(anime.id, newCommentText.trim());
    if (success) {
      setNewCommentText('');
      // Reload comments
      const cList = await fetchComments(anime.id);
      setComments(cList || []);
    }
  };

  const toggleWatchlistType = async (type: 'fav' | 'later' | 'watched') => {
    if (!currentUser) {
      alert('الرجاء تسجيل الدخول أولاً لإضافة الأعمال لقائمتك الخاصة! 🚪📚');
      return;
    }

    const isActive = watchlist.some(w => w.anime_id === anime.id && w.type === type);
    if (isActive) {
      await removeFromWatchlist(anime.id);
    } else {
      await addToWatchlist(anime.id, type);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div 
        className="absolute inset-0 bg-[#07050f]/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main card stage */}
      <div className="relative w-full max-w-2xl bg-[#120f22] border border-purple-900/30 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
        
        {/* 1. Header with details background */}
        <div className="relative h-[180px] shrink-0">
          <img 
            src={anime.image} 
            alt={anime.name} 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
          {/* Dense bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120f22] via-transparent to-black/30" />

          {/* Absolute close button */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/60 text-white hover:text-yellow-400 active:scale-95 transition-all"
          >
            <X size={15} />
          </button>

          {/* Quick titles */}
          <div className="absolute bottom-4 right-5 text-right pl-5">
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-black text-[9px] font-black uppercase tracking-wider">
              ⭐ {anime.rating} من ١٠
            </span>
            <h2 className="text-base md:text-xl font-black text-white mt-1.5 drop-shadow-md">
              {anime.name}
            </h2>
            <p className="text-[10px] text-gray-300 line-clamp-1 font-medium mt-1">
              تصنيف العمل: {anime.language} • {anime.type === 'movies' ? 'فيلم كرتون كامل' : 'مسلسل جاري'}
            </p>
          </div>
        </div>

        {/* 2. Scrollable details content */}
        <div className="flex-1 overflow-y-auto p-5 text-right space-y-6">
          
          {/* Description section */}
          <div className="space-y-1.5 bg-[#07050f]/40 p-3.5 rounded-2xl border border-white/5">
            <h3 className="text-[11px] text-yellow-500 font-extrabold font-sans">قصة ونبذة عن هذا العمل</h3>
            <p className="text-xs text-gray-200 leading-relaxed font-semibold">
              {anime.description}
            </p>
          </div>

          {/* Watchlist management quick triggers */}
          <div className="grid grid-cols-3 gap-2">
            <button
              id="details-fav-btn"
              onClick={() => toggleWatchlistType('fav')}
              className={`py-2 px-3 rounded-xl border text-[10px] font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                isFav
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Heart size={12} className={isFav ? 'fill-current' : ''} />
              <span>{isFav ? 'في المفضلة' : 'أضف للمفضلة'}</span>
            </button>

            <button
              id="details-later-btn"
              onClick={() => toggleWatchlistType('later')}
              className={`py-2 px-3 rounded-xl border text-[10px] font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                isLater
                  ? 'bg-yellow-500/10 border-[#ffcc00]/30 text-yellow-400'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark size={12} className={isLater ? 'fill-current' : ''} />
              <span>{isLater ? 'لاحقاً' : 'سأشاهده لاحقاً'}</span>
            </button>

            <button
              id="details-watched-btn"
              onClick={() => toggleWatchlistType('watched')}
              className={`py-2 px-3 rounded-xl border text-[10px] font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                isWatched
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Check size={12} />
              <span>{isWatched ? 'شاهدته بالكامل' : 'تم من قبلي'}</span>
            </button>
          </div>

          {/* Episodes Listing Grid */}
          <div className="space-y-3">
            <h3 className="text-xs text-white font-black flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-sans font-bold">({episodes.length}) حلقة متوفرة</span>
              <span>📦 الحلقات الكاملة المتوفرة</span>
            </h3>

            {loadingEpisodes ? (
              <div className="py-8 text-center text-[10px] text-gray-500">جاري تجميع حلقات سينباي... 🏮</div>
            ) : episodes.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {episodes.map((ep) => (
                  <button
                    id={`episode-play-btn-${ep.id}`}
                    key={ep.id}
                    onClick={() => playEpisode(ep)}
                    className="p-3 rounded-xl bg-[#07050f]/80 border border-white/5 hover:border-yellow-400/40 hover:bg-[#07050f] text-right text-xs font-bold active:scale-95 duration-200 flex items-center justify-between gap-1"
                  >
                    <Play size={11} className="text-yellow-400 fill-yellow-400" />
                    <div className="truncate">
                      <span className="text-[9px] text-[#ffcc00] block">حلقة {ep.episode_number}</span>
                      <span className="text-white text-[10px] truncate block">{ep.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 rounded-2xl bg-black/10 text-gray-500 text-[10px] leading-relaxed">
                لا توجد حلقات مضافة لهذا الأنمي من قبل الأدمن حالياً 🏮
                {currentUser?.role === 'admin' && (
                  <span className="block text-[#ffcc00] font-bold mt-1.5">يمكنك إضافة حلقات لهذا العمل في مبوبة "لوحة التحكم" في الأسفل! ✨</span>
                )}
              </div>
            )}
          </div>

          {/* Comments and Chat overlay */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h3 className="text-xs text-white font-black flex items-center gap-1.5 justify-end">
              <span className="text-[10px] text-gray-500 font-sans font-bold">({comments.length}) تعليق</span>
              <MessageSquare size={13} className="text-purple-400" />
              <span>تفاعل ونقاشات الأصدقاء حول العمل</span>
            </h3>

            {/* Comment Post Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                id="comment-input-text"
                type="text"
                placeholder={currentUser ? "اكتب تعليقك ورأيك في هذا العمل..." : "سجّل الدخول لتستطيع وضع تعليقاتك..."}
                disabled={!currentUser}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#07050f] border border-white/5 text-white placeholder-gray-600 text-[11px] font-bold focus:outline-none focus:border-[#ffcc00] disabled:opacity-40"
              />
              <button
                id="submit-comment-btn"
                type="submit"
                disabled={!currentUser || !newCommentText.trim()}
                className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center active:scale-95 disabled:opacity-40 shrink-0"
              >
                <Send size={13} className="ml-0.5" />
              </button>
            </form>

            {/* Comments Lists */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {loadingComments ? (
                <div className="text-center py-4 text-[9px] text-gray-500">جاري قراءة لوحة التعليقات... 💬</div>
              ) : comments.length ? (
                comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-[#07050f]/30 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-gray-600">{new Date(c.created_at).toLocaleDateString('ar-EG')}</span>
                      <span className="text-yellow-400 font-black flex items-center gap-1">
                        <span>{c.username}</span>
                        <span className="w-4 h-4 rounded bg-purple-950 flex items-center justify-center text-[7px] text-white font-mono">ID</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-200 font-medium leading-relaxed font-sans">{c.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[9px] text-gray-600">كن أول من يترك انطباعاً متميزاً حول هذا الأنمي الرهيب! 🌸</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
