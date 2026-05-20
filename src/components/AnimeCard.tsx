/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Anime } from '../types';
import { Play, Star } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (anime: Anime) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  // Determine CSS class for language banner based on sub/dub types
  const getLanguageDetails = () => {
    const isD = anime.language.includes("مدبلج");
    const isS = anime.language.includes("مترجم");
    if (isD && isS) {
      return { text: "📝 مترجم | 🎙️ مدبلج", cls: "bg-gradient-to-l from-violet-600 to-indigo-600 text-white" };
    }
    if (isD) {
      return { text: "🎙️ مدبلج", cls: "bg-gradient-to-l from-[#ffcc00] to-[#ff9900] text-[#07050f]" };
    }
    return { text: "📝 مترجم", cls: "bg-gradient-to-l from-blue-600 to-indigo-600 text-white" };
  };

  const { text: langText, cls: langCls } = getLanguageDetails();

  return (
    <div 
      id={`anime-card-${anime.id}`}
      onClick={() => onSelect(anime)}
      className="group relative flex flex-col bg-[#120f22] rounded-2xl overflow-hidden border border-purple-950/20 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
    >
      {/* Top badges (Rating and Language tag) */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#07050f]/80 backdrop-blur-md text-[#ffcc00] text-[10px] font-bold shadow">
          <Star size={8} className="fill-[#ffcc00] stroke-[#ffcc00]" />
          <span>{anime.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className={`absolute top-2 right-2 z-10 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold shadow-md ${langCls}`}>
        {langText}
      </div>

      {/* Ongoing / Badge tag bottom of thumbnail */}
      {anime.badge && (
        <span className="absolute bottom-16.5 right-2 z-10 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-black tracking-tight shadow">
          {anime.badge}
        </span>
      )}

      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={anime.image} 
          alt={anime.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120f22] via-[#120f22]/20 to-transparent opacity-80" />

        {/* Hover / Active Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 bg-[#07050f]/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#ffcc00] text-black shadow-lg shadow-yellow-500/20 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} className="fill-black ml-0.5" />
          </div>
        </div>
      </div>

      {/* Body content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="line-clamp-1 font-bold text-xs text-white group-hover:text-[#ffcc00] transition-colors leading-relaxed">
            {anime.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-gray-400 font-sans">
            <span>📅 {anime.year}</span>
            <span>•</span>
            <span className="truncate">{anime.genre.split(" / ")[0]}</span>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(anime);
          }}
          className="mt-3 flex items-center justify-center gap-1 w-full py-1.5 rounded-xl bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black text-[10px] font-extrabold transition-all hover:shadow-lg hover:shadow-yellow-500/10 active:scale-95"
        >
          <Play size={10} className="fill-black" />
          <span>مشاهدة الآن</span>
        </button>
      </div>
    </div>
  );
};
