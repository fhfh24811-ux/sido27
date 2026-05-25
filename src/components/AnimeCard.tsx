/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Anime } from '../types';
import { Star, PlayCircle } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  // Helper to translate english tags to beautiful Arabic badges
  const getArabicTypeLabel = (t: string) => {
    switch (t) {
      case 'anime-subbed':
        return 'أنمي مترجم';
      case 'anime-dubbed':
        return 'أنمي مدبلج';
      case 'movies':
        return 'أفلام كرتون';
      case 'turkish':
        return 'مسلسلات تركية';
      default:
        return 'عمل فني';
    }
  };

  return (
    <div 
      id={`anime-card-${anime.id}`}
      onClick={() => onSelect(anime)}
      className="bg-[#120f22]/70 rounded-2xl border border-white/5 overflow-hidden group hover:border-[#ffcc00]/40 active:scale-[0.98] transition-all duration-300 cursor-pointer flex flex-col relative"
    >
      
      {/* 1. Image poster with overlays */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-purple-950/10 shrink-0">
        <img 
          src={anime.image} 
          alt={anime.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Placeholder standard fallbacks
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop`;
          }}
        />

        {/* Dynamic dark gradient to bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Left-top corner Badge rating */}
        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur text-yellow-400 text-[9px] font-extrabold flex items-center gap-0.5 shadow-sm">
          <Star size={8} className="fill-[#ffcc00] text-[#ffcc00]" />
          <span>{anime.rating}</span>
        </span>

        {/* Right-top Dynamic Badge (e.g. "حصري", "جديد") */}
        {anime.badge && (
          <span className="absolute top-2.5 right-2.5 z-10 px-2.5 py-0.5 rounded-lg bg-purple-600 text-white text-[8px] font-black uppercase tracking-wider shadow">
            {anime.badge}
          </span>
        )}

        {/* Left-bottom corner Anime Type name */}
        <span className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded bg-purple-900/90 text-white text-[8px] font-black border border-purple-500/20">
          {getArabicTypeLabel(anime.type)}
        </span>

        {/* Animated Slide-Up Description Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#07050f]/95 to-[#120f22]/95 p-3.5 flex flex-col justify-between text-right opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
          <div className="flex justify-between items-center">
            <span className="px-1.5 py-0.5 rounded bg-[#ffcc00] text-black text-[8px] font-black">
              {getArabicTypeLabel(anime.type)}
            </span>
            <div className="flex items-center gap-0.5 text-yellow-400 text-[9px] font-bold">
              <Star size={8} className="fill-[#ffcc00] text-[#ffcc00]" />
              <span>{anime.rating}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-[9px] text-[#ffcc00] font-black block">قصة ونبذة:</span>
            <p className="text-[9px] text-gray-200 font-semibold leading-relaxed line-clamp-5 select-none text-right">
              {anime.description || 'لا يوجد وصف مضاف لهذا العمل حالياً'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[8px] text-purple-400 font-bold">
            <span>انقر للمشاهدة الآن 🎬</span>
            <span className="text-[#ffcc00]">بث سريع ⚡</span>
          </div>
        </div>
      </div>

      {/* 2. Content descriptions */}
      <div className="p-3 text-right flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-[11px] font-black leading-snug text-white line-clamp-1 group-hover:text-[#ffcc00] duration-200">
            {anime.name}
          </h4>
        </div>

        <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold font-sans mt-2.5 border-t border-white/5 pt-1.5 shrink-0">
          <span className="text-[#ffcc00] font-black">{anime.language}</span>
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${
            anime.status === 'completed' 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
              : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
          }`}>
            {anime.status === 'completed' ? 'مكتمل ✅' : 'مستمر ⚡'}
          </span>
        </div>
      </div>

    </div>
  );
};
