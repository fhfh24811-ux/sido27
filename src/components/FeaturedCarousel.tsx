/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Anime } from '../types';
import { ChevronRight, ChevronLeft, Play, Star, Sparkles } from 'lucide-react';

interface FeaturedCarouselProps {
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ animeList, onSelectAnime }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Set up default slides when the database is empty so the site looks premium
  const defaultSlides = [
    {
      id: "promo-1",
      name: "منصتك الشخصية لخدمة البث الرقمي أصبحت جاهزة! 🌌",
      description: "أهلاً بك في تطبيق البث المتكامل. كمسؤول للموقع، يمكنك التوجه إلى لوحة التحكم بالأسفل للبدء في تعبئة المحتوى، الحلقات، السيرفرات السريعة، وعرضها لجمهورك فوراً بجودة بلاتینیوم فائقة.",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
      type: "turkish",
      language: "لوحة الأدمن سهلة الاستخدام ⚡",
      badge: "دعم متميز 👑",
      status: "ongoing" as const,
      rating: 10
    },
    {
      id: "promo-2",
      name: "مسلسلات ومسرحيات وأنميات مدبلجة ومترجمة 🎬",
      description: "منصة ذكية مجهزة بالكامل ونظام نقاط ومكافآت يومية لتشجيع المشاهدين على البقاء والتفاعل داخل الموقع، وتجاوب كامل مع الحواسيب والهواتف والشاشات اللوحية.",
      image: "https://images.unsplash.com/photo-1541829019-213700462520?w=1200&q=80",
      type: "anime-subbed",
      language: "أداء فائق السرعة",
      badge: "تصميم عصري ✨",
      status: "completed" as const,
      rating: 9.8
    }
  ];

  const slides: (Anime | typeof defaultSlides[0])[] = animeList.length > 0 
    ? [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 5) // Top 5 highest rated works
    : defaultSlides;

  // Auto scroll effect
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getArabicTypeLabel = (type: string) => {
    switch (type) {
      case 'anime-subbed': return 'أنمي مترجم 🏮';
      case 'anime-dubbed': return 'أنمي مدبلج 👼';
      case 'movies': return 'فيلم سينمائي 🎬';
      case 'turkish': return 'مسلسل تركي 🇹🇷';
      default: return 'عمل غير مصنف';
    }
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full bg-[#120f22]/40 rounded-3xl overflow-hidden border border-white/5 h-[280px] md:h-[350px] shadow-2xl group text-right">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <img 
          src={currentSlide.image} 
          alt={currentSlide.name} 
          className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 duration-1000 select-none"
          referrerPolicy="no-referrer"
        />
        {/* Multilayer ambient radial and linear dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07050f] via-[#07050f]/60 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07050f]/90 via-transparent to-[#07050f]/20" />
      </div>

      {/* Content wrapper */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10 max-w-2xl ml-auto">
        <div className="space-y-2 md:space-y-3">
          
          {/* Metadata Badges line */}
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <span className="px-2.5 py-0.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[#ffcc00] text-[8px] md:text-[9px] font-black flex items-center gap-1">
              <Sparkles size={10} className="fill-current" />
              <span>{currentSlide.badge || 'تحديث دوري'}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-lg bg-purple-900/40 border border-purple-500/20 text-purple-300 text-[8px] md:text-[9px] font-black">
              {getArabicTypeLabel(currentSlide.type)}
            </span>

            <span className={`px-2 py-0.5 rounded-lg text-[8px] md:text-[9px] font-black ${
              currentSlide.status === 'completed' 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
            }`}>
              {currentSlide.status === 'completed' ? 'كامل ومكتمل ✅' : 'مستمر التحديث ⚡'}
            </span>
          </div>

          {/* Title with outstanding display typography */}
          <h2 className="text-base md:text-2xl font-black text-white leading-snug drop-shadow-md line-clamp-2">
            {currentSlide.name}
          </h2>

          {/* Short description with customizable clamps */}
          <p className="text-[10px] md:text-xs text-gray-300 font-medium leading-relaxed max-w-xl line-clamp-3 select-none">
            {currentSlide.description}
          </p>

          {/* Action buttons line */}
          <div className="pt-2 flex items-center gap-3 justify-end">
            
            {/* Rating Stars static decoration */}
            <div className="flex items-center gap-1 text-yellow-400 text-xs font-black font-mono ml-auto flex-row-reverse bg-black/40 backdrop-blur px-2.5 py-1 rounded-xl border border-white/5">
              <Star size={11} className="fill-current" />
              <span>{currentSlide.rating ? currentSlide.rating.toFixed(1) : '9.0'}</span>
            </div>

            <span className="text-[9px] text-gray-400 font-bold ml-1">
              {currentSlide.language}
            </span>

            {/* Click to play or action trigger */}
            {animeList.length > 0 ? (
              <button
                id={`carousel-watch-btn-${currentSlide.id}`}
                onClick={() => onSelectAnime(currentSlide as Anime)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-black font-black text-[10px] md:text-xs flex items-center gap-1.5 shadow-lg shadow-yellow-500/10 active:scale-95 duration-150 cursor-pointer"
              >
                <span>شاهد الآن</span>
                <Play size={10} className="fill-current" />
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] text-gray-400 font-semibold select-none">
                جاهز لرفع حلقاتك 🏮
              </span>
            )}

          </div>

        </div>
      </div>

      {/* Manual Sliding controls (Hidden on small, visible on hovering md device states) */}
      {slides.length > 1 && (
        <>
          {/* Back button */}
          <button 
            id="carousel-prev"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur border border-white/5 text-white hover:bg-[#ffcc00] hover:text-black transition-all opacity-0 group-hover:opacity-100 duration-300 active:scale-90 z-20"
            title="السابق"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next button */}
          <button 
            id="carousel-next"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur border border-white/5 text-white hover:bg-[#ffcc00] hover:text-black transition-all opacity-0 group-hover:opacity-100 duration-300 active:scale-90 z-20"
            title="التالي"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Bottom sliding dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              id={`carousel-dot-${i}`}
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'w-5 bg-[#ffcc00]' : 'w-1.5 bg-white/30 hover:bg-white/60'
              }`}
              title={`الشريحة ${i + 1}`}
            />
          ))}
        </div>
      )}

    </div>
  );
};
