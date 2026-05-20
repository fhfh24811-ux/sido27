/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Anime, Episode } from '../types';
import { useSido } from '../context/SidoContext';
import { generateEpisodes } from '../data/animeData';
import { 
  X, Star, Heart, Clock, Check, ListChecks, Play, 
  ChevronRight, Calendar, Info, Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface AnimeDetailsModalProps {
  anime: Anime;
  onClose: () => void;
}

export const AnimeDetailsModal: React.FC<AnimeDetailsModalProps> = ({ anime, onClose }) => {
  const { 
    watchlist, addToWatchlist, removeFromWatchlist, 
    ratings, rateAnime, playEpisode 
  } = useSido();

  // Highlight state index on hover for custom ratings
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Compile dynamic episodes list
  const episodesList = useMemo(() => {
    return generateEpisodes(anime.id, anime.episodes_count);
  }, [anime.id, anime.episodes_count]);

  // Find personal state indicators
  const currentWatchlistItem = watchlist.find(item => item.anime_id === anime.id);
  const currentPersonalRating = ratings.find(item => item.anime_id === anime.id)?.rating || 0;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Background click handler */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Sheet Content container */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full max-w-2xl bg-[#120f22] rounded-t-3xl sm:rounded-3xl border-t sm:border border-purple-950/40 overflow-hidden shadow-2xl flex flex-col justify-end max-h-[92vh] sm:max-h-[85vh]"
      >
        
        {/* Header thumbnail and overview info */}
        <div className="relative">
          {/* Header images banner background */}
          <div className="absolute inset-0 h-44 overflow-hidden">
            <img 
              src={anime.image} 
              alt={anime.name} 
              className="w-full h-full object-cover blur-md opacity-25 scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120f22] to-transparent" />
          </div>

          {/* Quick exit button */}
          <button 
            id="close-details-btn"
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-black/50 text-white hover:text-[#ffcc00] hover:bg-black/80 transition-all active:scale-90"
          >
            <X size={16} />
          </button>

          {/* Core metadata card overlap */}
          <div className="relative z-10 pt-8 px-4 pb-4 flex gap-4">
            <div className="w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-purple-500/10 shrink-0">
              <img 
                src={anime.image} 
                alt={anime.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 flex flex-col justify-end pt-8">
              <span className="text-[10px] text-yellow-400 font-extrabold flex items-center gap-1">
                <Award size={10} />
                <span>{anime.genre}</span>
              </span>
              <h2 className="text-sm sm:text-lg font-black text-white leading-tight mt-1 line-clamp-2">
                {anime.name}
              </h2>
              
              <div className="flex items-center gap-2 mt-2 font-sans">
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-black/40 text-[#ffcc00] text-[10px] font-bold">
                  <Star size={9} className="fill-[#ffcc00]" />
                  <span>{anime.rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-gray-400">📅 {anime.year}</span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] text-gray-400">{anime.duration || "24 دقيقة"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content body tabs and scrollable items */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-5">
          
          {/* Detailed description */}
          <div className="bg-[#07050f]/50 rounded-2xl p-3 border border-purple-950/10">
            <h4 className="text-[10px] text-yellow-400 font-extrabold flex items-center gap-1 mb-1.5 uppercase tracking-wider font-sans">
              <Info size={10} className="stroke-[2.5px]" />
              <span>قصة الأنمي ومآثر الأبطال</span>
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed font-normal">
              {anime.description}
            </p>
          </div>

          {/* Controls: Watchlist toggles & star ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
            
            {/* Watchlist management */}
            <div>
              <h4 className="text-[10px] text-gray-400 font-extrabold mb-2.5 tracking-tight font-sans">
                📂 إدارة قائمة الألعاب والمشاهدة
              </h4>
              <div className="flex gap-2 flex-wrap">
                {/* Favorites button */}
                <button
                  id="watchlist-toggle-fav"
                  onClick={() => currentWatchlistItem?.type === 'fav' ? removeFromWatchlist(anime.id) : addToWatchlist(anime.id, 'fav')}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 ${
                    currentWatchlistItem?.type === 'fav'
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      : 'border-white/5 bg-white/5 text-gray-300'
                  }`}
                >
                  <Heart size={11} className={currentWatchlistItem?.type === 'fav' ? 'fill-rose-400' : ''} />
                  <span>المفضلة</span>
                </button>

                {/* Watch later button */}
                <button
                  id="watchlist-toggle-later"
                  onClick={() => currentWatchlistItem?.type === 'later' ? removeFromWatchlist(anime.id) : addToWatchlist(anime.id, 'later')}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 ${
                    currentWatchlistItem?.type === 'later'
                      ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                      : 'border-white/5 bg-white/5 text-gray-300'
                  }`}
                >
                  <Clock size={11} />
                  <span>لاحقاً</span>
                </button>

                {/* Finished button */}
                <button
                  id="watchlist-toggle-watched"
                  onClick={() => currentWatchlistItem?.type === 'watched' ? removeFromWatchlist(anime.id) : addToWatchlist(anime.id, 'watched')}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 active:scale-95 ${
                    currentWatchlistItem?.type === 'watched'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'border-white/5 bg-white/5 text-gray-300'
                  }`}
                >
                  <Check size={11} />
                  <span>تمت مشاهدته</span>
                </button>
              </div>
            </div>

            {/* Loyalty Rating slider */}
            <div>
              <h4 className="text-[10px] text-gray-400 font-extrabold mb-2.5 tracking-tight font-sans">
                ⭐ تقييمك الخاص للألبوم
              </h4>
              <div className="flex items-center gap-1 bg-white/5 px-4 py-2 rounded-2xl justify-center border border-white/5">
                {[1, 2, 3, 4, 5].map(starIdx => {
                  const isHighlighted = hoverRating !== null ? starIdx <= hoverRating : starIdx <= currentPersonalRating;
                  return (
                    <button
                      id={`star-btn-${starIdx}`}
                      key={starIdx}
                      onMouseEnter={() => setHoverRating(starIdx)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => rateAnime(anime.id, starIdx)}
                      className="text-2xl transition-all duration-100 hover:scale-125 focus:outline-none"
                    >
                      <span className={isHighlighted ? 'text-[#ffcc00]' : 'text-gray-600'}>★</span>
                    </button>
                  );
                })}
                {currentPersonalRating > 0 && (
                  <span className="text-[10px] text-emerald-400 font-black mr-2 font-sans bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    تم التقييم!
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Episode items listings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs text-yellow-500 font-extrabold flex items-center gap-1 font-sans">
                <ListChecks size={13} />
                <span>جميع الحلقات ({anime.episodes_count})</span>
              </h3>
              <span className="text-[9px] text-gray-500 font-sans tracking-wide">اختر حلقة لبدء البث المباشر</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {episodesList.map((ep) => (
                <button
                  id={`episode-row-${ep.id}`}
                  key={ep.id}
                  onClick={() => playEpisode(anime, ep)}
                  className="flex items-center justify-between p-2.5 text-right rounded-2xl bg-white/5 border border-white/5 hover:border-[#ffcc00]/30 hover:bg-[#ffcc00]/5 transition-all text-xs active:scale-[0.99] group/row"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-black/40 text-[#ffcc00] text-[10px] font-extrabold font-sans">
                      {ep.episode_number}
                    </span>
                    <span className="font-sans text-[11px] font-semibold text-gray-200 line-clamp-1 group-hover/row:text-[#ffcc00] transition-colors">
                      {ep.title.split(" : ")[1] || ep.title}
                    </span>
                  </div>

                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ffcc00]/10 text-[#ffcc00] group-hover/row:bg-[#ffcc00] group-hover/row:text-black transition-all shrink-0">
                    <Play size={10} className="fill-current ml-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
