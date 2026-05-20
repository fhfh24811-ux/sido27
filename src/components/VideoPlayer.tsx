/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Anime, Episode, VideoSource } from '../types';
import { useSido } from '../context/SidoContext';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, 
  RotateCcw, Sparkles, Coins, Download, ArrowRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  anime: Anime;
  episode: Episode;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ anime, episode, onClose }) => {
  const { earnPointsFromWatch, currentProfile } = useSido();
  
  // Selection States
  const [selectedSource, setSelectedSource] = useState<VideoSource>(episode.sources[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Points Reward System Tracker
  const [pointsCountdown, setPointsCountdown] = useState(10);
  const [pointsClaimed, setPointsClaimed] = useState(false);
  const [showCoinSplash, setShowCoinSplash] = useState(false);

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // Setup points stopwatch when playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !pointsClaimed && pointsCountdown > 0) {
      timer = setInterval(() => {
        setPointsCountdown(prev => {
          if (prev <= 1) {
            // Countdown ended! Claim points
            setPointsClaimed(true);
            setShowCoinSplash(true);
            earnPointsFromWatch(anime.id, episode.episode_number);
            
            // Clean splash after 3 seconds
            setTimeout(() => {
              setShowCoinSplash(false);
            }, 3000);

            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, pointsClaimed, pointsCountdown, anime.id, episode.episode_number]);

  // Reset counters if episode changes
  useEffect(() => {
    setSelectedSource(episode.sources[0]);
    setPointsCountdown(10);
    setPointsClaimed(false);
    setIsLoading(true);
    setIsPlaying(false);
  }, [episode]);

  // Handle Controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Error playing video:", err));
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleSeek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoDuration, videoRef.current.currentTime + seconds));
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const handleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Helper to format minutes/seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-y-auto pb-10">
      
      {/* Coin splash congratulation effect */}
      <AnimatePresence>
        {showCoinSplash && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="relative w-28 h-28 bg-[#ffcc00] rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/50 border-4 border-white"
            >
              <Coins size={60} className="text-black fill-black" />
            </motion.div>
            <h2 className="text-2xl font-black text-[#ffcc00] mt-6 tracking-wide drop-shadow-lg text-center font-sans">
              تهانينا! كسبت +10 نقاط سيدو 🪙✨
            </h2>
            <p className="text-xs text-gray-300 mt-2 font-medium">
              تتم إضافة نقاطك تلقائياً لتبديلها ببطاقات مجانية!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Navigation Bar */}
      <div className="bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between text-white">
        <button 
          id="close-player-btn"
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-[#ffcc00] py-1 px-3.5 rounded-full bg-white/10 active:scale-95 transition-all font-bold"
        >
          <ArrowRight size={14} />
          <span>رجوع</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] text-yellow-400 font-extrabold tracking-wide block uppercase">
            {anime.name.split(" - ")[0]}
          </span>
          <h2 className="text-xs font-bold font-sans text-white truncate max-w-xs md:max-w-md">
            الحلقة {episode.episode_number}
          </h2>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* 2. Custom Video Stage Container */}
      <div className="relative w-full max-w-4xl mx-auto flex-1 flex items-center justify-center bg-black/40">
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black gap-3">
            <Loader2 className="animate-spin text-[#ffcc00]" size={40} />
            <p className="text-xs text-yellow-400 font-semibold tracking-wide animate-pulse">
              جاري تحميل الخوادم وتأمين البث...
            </p>
          </div>
        )}

        {/* Video Frame */}
        <video
          ref={videoRef}
          src={selectedSource.url}
          className="w-full aspect-video outline-none shadow-2xl rounded-none md:rounded-2xl"
          playsInline
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onDurationChange={(e) => setVideoDuration(e.currentTarget.duration)}
          onClick={togglePlay}
        />

        {/* Floating Countdown Rewards indicator */}
        <div className="absolute top-4 left-4 z-20">
          {!pointsClaimed ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-yellow-500/30 text-[#ffcc00] font-sans text-[10px] font-bold shadow-lg animate-pulse">
              <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
              <span>شاهد {pointsCountdown} ثوانٍ لكسب +10 نقاط! 🎨</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 font-sans text-[10px] font-bold shadow-md">
              <Coins size={11} className="fill-emerald-300" />
              <span>تم تحصيل نقاط المشاهدة لهذه الحلقة! ✅</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom controls and Sources Menu */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-2 text-white">
        
        {/* Custom Progress Bar Bar */}
        <div className="flex items-center gap-3.5 mb-4">
          <span className="text-[10px] font-mono select-none text-gray-400">
            {formatTime(currentTime)}
          </span>
          <input 
            type="range"
            min={0}
            max={videoDuration || 100}
            value={currentTime}
            onChange={handleTimelineChange}
            className="flex-1 accent-[#ffcc00] bg-gray-800 h-1 rounded-lg outline-none cursor-pointer"
          />
          <span className="text-[10px] font-mono select-none text-gray-400">
            {formatTime(videoDuration)}
          </span>
        </div>

        {/* Playback Actions Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            {/* Play Button */}
            <button 
              id="player-toggle-btn"
              onClick={togglePlay}
              className="p-3 bg-[#ffcc00] text-black rounded-full hover:bg-[#ff9900] active:scale-90 transition-all shadow-md"
            >
              {isPlaying ? <Pause size={18} className="fill-black" /> : <Play size={18} className="fill-black ml-0.5" />}
            </button>

            {/* Rewind 10s */}
            <button 
              id="player-rewind-btn"
              onClick={() => handleSeek(-10)}
              className="p-2.5 rounded-full bg-white/5 active:scale-90 transition-colors"
              title="رجوع 10 ثوان"
            >
              <RotateCcw size={16} />
            </button>

            {/* Mute trigger */}
            <button 
              id="player-mute-btn"
              onClick={handleMuteToggle}
              className="p-2.5 rounded-full bg-white/5 active:scale-95 transition-colors"
            >
              {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback speed switcher */}
            <div className="flex items-center rounded-lg bg-white/5 p-0.5 text-[10px] font-sans font-bold">
              {[1, 1.25, 1.5].map(s => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 rounded ${playbackSpeed === s ? 'bg-[#ffcc00] text-black' : 'text-gray-400'}`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Maximize screen */}
            <button 
              id="player-fullscreen-btn"
              onClick={handleFullScreen}
              className="p-2.5 rounded-full bg-[#ffcc00]/10 text-[#ffcc00] active:scale-95"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>

        {/* 4. Quality servers selection */}
        <div className="mt-4">
          <h3 className="text-xs text-yellow-500 font-extrabold mb-2.5 tracking-tight font-sans">
            🎙️ خوادم المشاهدة المتعددة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {episode.sources.map((src, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSource(src);
                  setIsLoading(true);
                  if (isPlaying) videoRef.current?.pause();
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-sans font-semibold text-right transition-all flex items-center justify-between ${
                  selectedSource.label === src.label 
                    ? 'border-[#ffcc00] bg-[#ffcc00]/10 text-[#ffcc00]' 
                    : 'border-white/5 bg-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <span>{src.label}</span>
                <span className={`w-2 h-2 rounded-full ${selectedSource.label === src.label ? 'bg-[#ffcc00] animate-pulse' : 'bg-gray-600'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* 5. Download Trigger options */}
        {episode.download_url && (
          <div className="mt-4 p-3 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 flex items-center justify-between gap-2.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-yellow-300 font-bold">تفضيل التحميل السريع؟</span>
              <p className="text-[9px] text-gray-400 mt-0.5 leading-relaxed">يمكنك تحميل هذه الحلقة بأقصى سرعة مباشرة لمشاهدتها في أي وقت بدون إنترنت!</p>
            </div>
            <a
              id="player-download-link"
              href={episode.download_url}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3 rounded-xl bg-[#ffcc00] text-black text-[10px] font-black tracking-tight hover:bg-yellow-400 transition-colors flex items-center gap-1 active:scale-95 shrink-0"
            >
              <Download size={11} />
              <span>تحميل مجاني</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
