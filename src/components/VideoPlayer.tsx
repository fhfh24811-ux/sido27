/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSido } from '../context/SidoContext';
import { Episode } from '../types';
import { X, Play, Pause, RotateCw, Volume2, Award, Tv, Minimize, VolumeX, Star } from 'lucide-react';

interface VideoPlayerProps {
  episode: Episode;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ episode, onClose }) => {
  const { rewardPoints, currentUser } = useSido();

  // Standard player toggles
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(1); // represented in percentage
  const [server, setServer] = useState('سيرفر سيدو السريع (SIDO Main)');
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [notificationText, setNotificationText] = useState('');

  const getQualitiesForServer = (srv: string) => {
    if (srv.includes('MAX')) {
      return [
        { val: '1080p', label: '1080p (FHD فائقة)' },
        { val: '720p', label: '720p (HD سريعة)' },
        { val: 'Auto', label: 'تلقائي (Adaptive 2K)' }
      ];
    } else if (srv.includes('Downloader') || srv.includes('التحميل')) {
      return [
        { val: '4k', label: '2160p (4K سينمائية)' },
        { val: '1080p', label: '1080p (أصلية كاملة)' },
        { val: '720p', label: '720p (مضغوطة)' }
      ];
    } else {
      return [
        { val: '1080p', label: '1080p (سيرفر رئيسي)' },
        { val: '720p', label: '720p (متوسطة)' },
        { val: '480p', label: '480p (موفر الحزمة)' },
        { val: 'Auto', label: 'تلقائي (Auto Speed)' }
      ];
    }
  };

  const showQualityNotification = (currentServer: string, currentQuality: string) => {
    setNotificationText(`🔄 جاري تبديل البث.. دقة ${currentQuality} عبر ${currentServer}`);
    setIsPlaying(false);
    setProgress(1); // reset progress to simulate video loading!
    
    setTimeout(() => {
      setNotificationText(`✅ متصل الآن بجودة ${currentQuality} عبر ${currentServer} الاستجابة (12ms) ⚡`);
      setIsPlaying(true);
    }, 1200);
  };

  // Episode Rating States
  const [rating, setRating] = useState<number>(() => {
    const saved = localStorage.getItem(`sido_rating_${episode.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState<boolean>(() => {
    return localStorage.getItem(`sido_rating_submitted_${episode.id}`) === 'true';
  });
  const [ratingFeedbackTag, setRatingFeedbackTag] = useState<string>('');
  const isAwardGained = localStorage.getItem(`sido_rating_points_gained_${episode.id}`) === 'true';

  const handleRateEpisode = (selectedStar: number) => {
    if (hasRated) return;
    
    setRating(selectedStar);
    localStorage.setItem(`sido_rating_${episode.id}`, selectedStar.toString());
    
    if (currentUser && !isAwardGained) {
      localStorage.setItem(`sido_rating_points_gained_${episode.id}`, 'true');
      rewardPoints(10, 'rate-episode');
    }
    
    localStorage.setItem(`sido_rating_submitted_${episode.id}`, 'true');
    setHasRated(true);
  };

  const handleSelectTagSubmit = (tag: string) => {
    setRatingFeedbackTag(tag);
  };

  // Reward countdown
  const [timeLeft, setTimeLeft] = useState(12); // Watch for 12 seconds to earn points!
  const [pointsClaimed, setPointsClaimed] = useState(false);

  // Auto tick timer for progress bar and free rewards points
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        // Increment progress limit 100
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1.2;
        });

        // Decrement reward timer to zero
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (!pointsClaimed) {
              setPointsClaimed(true);
              // Reward user points
              rewardPoints(70, 'watch-episode');
            }
            return 0;
          }
          return prev - 1;
        });

      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, pointsClaimed, rewardPoints]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Black ambient backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Primary player chassis */}
      <div className="relative w-full max-w-xl bg-black border border-white/5 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col text-right">
        
        {/* Top bar controls */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent p-2 rounded-t-xl">
          <button
            id="player-dismiss-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 text-white hover:text-red-400 active:scale-95 transition-all"
          >
            <X size={14} />
          </button>

          <span className="text-white text-[10px] font-black truncate">{episode.title}</span>
        </div>

        {/* 1. Main visual viewport screen */}
        <div className="relative aspect-video w-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Mock background animation or actual video-styled screen */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-20 filter blur-sm scale-110 pointer-events-none"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-yellow-500/5 to-transparent animate-pulse" />
            )}
          </div>

          {/* Sido Watermark Logo */}
          <span className="absolute bottom-16 right-5 text-[10px] font-black tracking-widest text-[#ffcc00]/50 select-none pointer-events-none z-10">
            SIDO WORLD 🐉
          </span>

          {/* Big center playing action */}
          <button
            id="player-center-play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-10 w-14 h-14 rounded-full bg-yellow-500 text-black flex items-center justify-center active:scale-90 duration-300 shadow shadow-yellow-500/20"
          >
            {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
          </button>

          {/* Points rewarding active ticker floating display */}
          <div className="absolute top-16 right-4 left-4 z-10 flex items-center justify-center">
            {pointsClaimed ? (
              <div className="px-3.5 py-1.5 rounded-full bg-yellow-400 text-black text-[9px] font-black flex items-center gap-1.5 animate-bounce">
                <Award size={11} className="fill-current" />
                <span>تم إيداع +٧٠ نقطة مكافأة المشاهدة في حساب سيدو الخاص بك! 🎉</span>
              </div>
            ) : (
              currentUser ? (
                <div className="px-3 py-1 bg-black/70 border border-white/5 rounded-full text-[9px] font-bold text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                  <span>شاهد الأنمي لـ <b className="text-[#ffcc00] font-mono">{timeLeft}</b> ثانية إضافية للحصول على مكافأة المشاهدة!</span>
                </div>
              ) : (
                <div className="px-3 py-1 bg-black/75 rounded-full text-[9px] text-red-400 font-bold border border-red-500/10">
                  ⚠️ غير مسجل سجل دخولك للحصول على مكافآت نقاط المشاهدة
                </div>
              )
            )}
          </div>

        </div>

        {/* 2. Control dock panel overlay */}
        <div className="bg-[#120f22] p-4 space-y-3 shrink-0">
          
          {/* Progress Timeline seek bar */}
          <div className="space-y-1">
            <div className="relative w-full h-1 bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[8px] font-bold text-gray-500 font-mono">
              <span>{Math.floor((progress/100) * 24)}:50</span>
              <span>24:00</span>
            </div>
          </div>

          {/* Buttons console deck */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mute toggle icon */}
              <button
                id="player-mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <button
                id="player-mini-toggle"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => alert('ميزة شاشات التلفزيون المتكاملة تتطلب تثبيت تطبيق سيدو للجوال! 📺')}
              >
                <Tv size={15} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-yellow-400/10 text-[8px] font-black text-[#ffcc00] border border-yellow-400/20">
                {videoQuality === 'Auto' ? 'تلقائي' : videoQuality}
              </span>
              <span className="text-[10px] text-white font-bold leading-none font-sans">
                الحلقة {episode.episode_number} من الأنمي
              </span>
            </div>
          </div>

          {/* Multi servers and quality selection dynamic boxes */}
          <div className="border-t border-white/5 pt-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[9px] text-[#ffcc00] font-bold flex items-center gap-1.5 flex-row-reverse">
                <span>سيرفر البث والجودة ⚡</span>
              </span>
              <span className="text-[9px] text-gray-500 font-bold">يرجى تغيير الجودة أو السيرفر إذا شعرت بالبطء 🏮</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-right">
              {/* Server selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-gray-400 font-bold">الملقم والسيرفر</label>
                <select
                  id="player-server-select"
                  value={server}
                  onChange={(e) => {
                    const newServer = e.target.value;
                    setServer(newServer);
                    // Match a default quality for the chosen server
                    const available = getQualitiesForServer(newServer);
                    const defaultQual = available[0].val;
                    setVideoQuality(defaultQual);
                    showQualityNotification(newServer, defaultQual);
                  }}
                  className="bg-[#07050f] border border-white/5 text-[9px] text-gray-300 font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-yellow-500/50 cursor-pointer"
                >
                  <option value="سيرفر سيدو السريع (SIDO Main)">سيرفر سيدو السريع (SIDO Main)</option>
                  <option value="سيرفر مكس للألياف (MAX Mirror)">سيرفر مكس للألياف (MAX Mirror)</option>
                  <option value="سيرفر التحميل المباشر الآمن (Downloader)">سيرفر التحميل المباشر الآمن (Downloader)</option>
                </select>
              </div>

              {/* Quality selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[8px] text-gray-400 font-bold">جودة الفيديو والدقة</label>
                <select
                  id="player-quality-select"
                  value={videoQuality}
                  onChange={(e) => {
                    const newQuality = e.target.value;
                    setVideoQuality(newQuality);
                    showQualityNotification(server, newQuality);
                  }}
                  className="bg-[#07050f] border border-white/5 text-[9px] text-gray-300 font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-yellow-500/50 cursor-pointer"
                >
                  {getQualitiesForServer(server).map((q) => (
                    <option key={q.val} value={q.val}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notification toast simulation */}
            {notificationText && (
              <div className="text-[9px] text-yellow-400 font-bold bg-yellow-400/5 p-2 rounded-xl border border-yellow-400/10 text-center animate-pulse">
                {notificationText}
              </div>
            )}
          </div>

          {/* Episode Rating Section */}
          <div className="border-t border-white/5 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              {/* Dynamic summary label */}
              <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 flex-row-reverse">
                <span>تقييم جودة الحلقة:</span>
                <span className="text-yellow-400 font-mono">
                  ★ {(4.5 + (episode.episode_number % 5) * 0.1).toFixed(1)}
                </span>
                <span className="text-gray-600 text-[8px]">({85 + (episode.episode_number + 7) * 4} تقييم)</span>
              </div>

              {/* Status or reward claim notification */}
              {hasRated ? (
                <span className="text-[9px] text-green-400 font-black flex items-center gap-1">
                  ❇️ شكراً على تقييمك!
                </span>
              ) : (
                currentUser && (
                  <span className="text-[8px] text-[#ffcc00] font-bold bg-[#ffcc00]/5 px-2 py-0.5 rounded border border-[#ffcc00]/10 shrink-0 animate-pulse">
                    +١٠ نقاط مكافأة تقييم 💡
                  </span>
                )
              )}
            </div>

            {/* Interactive Stars Row */}
            <div className="flex items-center justify-between gap-3 bg-[#07050f]/60 p-2.5 rounded-2xl border border-white/5">
              
              {/* Star buttons */}
              <div className="flex items-center gap-1 flex-row-reverse">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || rating) >= star;
                  return (
                    <button
                      id={`star-rating-btn-${star}`}
                      key={star}
                      type="button"
                      onMouseEnter={() => !hasRated && setHoverRating(star)}
                      onMouseLeave={() => !hasRated && setHoverRating(0)}
                      onClick={() => handleRateEpisode(star)}
                      className="p-0.5 text-gray-600 hover:scale-125 transition-all text-sm enabled:cursor-pointer disabled:cursor-default"
                      disabled={hasRated}
                    >
                      <Star 
                        size={16} 
                        className={`transition-colors ${isActive ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} 
                      />
                    </button>
                  );
                })}
              </div>

              {/* Text label feedback */}
              <span className="text-[9px] text-[#887aaa] font-bold">
                {hoverRating === 5 || rating === 5 ? 'خرافية وتعمل بسلاسة! 🔥' :
                 hoverRating === 4 || rating === 4 ? 'ممتازة جداً البث رائع 👍' :
                 hoverRating === 3 || rating === 3 ? 'جيدة ومرضية 🏮' :
                 hoverRating === 2 || rating === 2 ? 'مقبولة ولكن تحتاج تحسينات ⚡' :
                 hoverRating === 1 || rating === 1 ? 'سيئة أو لا تعمل إطلاقاً! ⚠️' :
                 'صوّت لجودة بث الحلقة والترجمة'}
              </span>

            </div>

            {/* Feedback tags details */}
            {!hasRated && rating > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-end mt-1">
                {[
                  'جودة خارقة 🌌', 
                  'ترجمة دقيقة ✍️', 
                  'دبلجة رائعة 💎', 
                  'سيرفر صاروخي ⚡', 
                  'تقطيع طفيف 🔊'
                ].map((tag) => (
                  <button
                    id={`rating-tag-btn-${tag}`}
                    key={tag}
                    onClick={() => handleSelectTagSubmit(tag)}
                    className={`text-[8px] px-2 py-1 rounded-xl font-black transition-all border ${
                      ratingFeedbackTag === tag 
                        ? 'bg-yellow-400 text-black border-transparent' 
                        : 'bg-[#07050f] text-[#887aaa] border-white/5 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Thank you notice message feedback */}
            {hasRated && (
              <div className="p-2 rounded-xl bg-green-500/5 border border-green-500/10 text-[9px] text-green-400 text-right leading-relaxed font-semibold">
                🎉 تم حفظ تقييمك {rating} نجوم بنجاح! شكراً لك {currentUser?.username || 'يا صديقي الأوتاكو'}، تقييماتك تساعد في تحسين البث ومصادر الترجمة. {ratingFeedbackTag && `(التعليق: ${ratingFeedbackTag})`}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
