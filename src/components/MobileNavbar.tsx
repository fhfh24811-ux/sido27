/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSido } from '../context/SidoContext';
import { Home, Heart, Bot, Gift, Lightbulb, Settings2 } from 'lucide-react';

interface MobileNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useSido();

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#120f22]/95 border-t border-purple-950/20 backdrop-blur-md z-40 pb-safe-bottom shadow-2xl">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2.5 px-3">
        
        {/* 1. Home Feed */}
        <button
          id="nav-tab-home"
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all py-1 px-3.5 rounded-2xl ${
            activeTab === 'home'
              ? 'text-yellow-400 bg-yellow-500/5'
              : 'text-[#887aaa] hover:text-white'
          }`}
        >
          <Home size={16} className={activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
          <span className="text-[9px] font-bold font-sans">الرئيسية</span>
        </button>

        {/* 2. Library/Watchlist */}
        <button
          id="nav-tab-watchlist"
          onClick={() => handleTabClick('watchlist')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all py-1 px-3.5 rounded-2xl ${
            activeTab === 'watchlist'
              ? 'text-yellow-400 bg-yellow-500/5'
              : 'text-[#887aaa] hover:text-white'
          }`}
        >
          <Heart size={16} className={activeTab === 'watchlist' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
          <span className="text-[9px] font-bold font-sans">مكتبتي</span>
        </button>

        {/* 3. AI Chat Advisor */}
        <button
          id="nav-tab-ai"
          onClick={() => handleTabClick('ai')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all py-1 px-3.5 rounded-2xl relative ${
            activeTab === 'ai'
              ? 'text-yellow-400 bg-yellow-500/5'
              : 'text-[#887aaa] hover:text-white'
          }`}
        >
          <Bot size={16} className={activeTab === 'ai' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
          <span className="text-[9px] font-bold font-sans">سينباي AI</span>
          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping pointer-events-none" />
        </button>

        {/* 4. Reward Points Prizes Wheel */}
        <button
          id="nav-tab-prizes"
          onClick={() => handleTabClick('prizes')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all py-1 px-3.5 rounded-2xl ${
            activeTab === 'prizes'
              ? 'text-yellow-400 bg-yellow-500/5'
              : 'text-[#887aaa] hover:text-white'
          }`}
        >
          <Gift size={16} className={activeTab === 'prizes' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
          <span className="text-[9px] font-bold font-sans font-sans">الهدايا</span>
        </button>

        {/* 5. Suggestions Box board */}
        <button
          id="nav-tab-suggestions"
          onClick={() => handleTabClick('suggestions')}
          className={`flex flex-col items-center gap-1 active:scale-95 transition-all py-1 px-3.5 rounded-2xl ${
            activeTab === 'suggestions'
              ? 'text-yellow-400 bg-yellow-500/5'
              : 'text-[#887aaa] hover:text-white'
          }`}
        >
          <Lightbulb size={16} className={activeTab === 'suggestions' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
          <span className="text-[9px] font-bold font-sans font-sans">أفكار</span>
        </button>

        {/* 6. Admin Panel (Conditional trigger) */}
        {currentUser && currentUser.role === 'admin' && (
          <button
            id="nav-tab-admin"
            onClick={() => handleTabClick('admin')}
            className={`flex flex-col items-center gap-1 active:scale-95 transition-all py-1 px-3.5 rounded-2xl ${
              activeTab === 'admin'
                ? 'text-yellow-400 bg-yellow-500/5'
                : 'text-red-400 font-extrabold hover:text-red-300'
            }`}
          >
            <Settings2 size={16} className={activeTab === 'admin' ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
            <span className="text-[9px] font-black font-sans">لوحة التحكم</span>
          </button>
        )}

      </div>
    </nav>
  );
};
