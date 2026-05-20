/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSido } from '../context/SidoContext';
import { Coins, Flame, Bell } from 'lucide-react';

interface MainHeaderProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ onTabChange, activeTab }) => {
  const { currentProfile, claimDailyLogin } = useSido();

  const handleClaim = () => {
    const res = claimDailyLogin();
    alert(res.message);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#07050f]/90 backdrop-blur-md border-b border-purple-950/40 px-4 py-3 pb-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Sido Logo Brand */}
        <div 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <span className="text-3xl animate-bounce duration-1000">🐉</span>
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-black tracking-widest text-[#ffcc00] -mb-1">
              SIDO <span className="text-xs text-white opacity-80 font-sans font-semibold">سيدو</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-sans tracking-tight">مسلسلات وأنمي</span>
          </div>
        </div>

        {/* Right side actions (Coin Badge & Notifications) */}
        <div className="flex items-center gap-2">
          {/* Sido Currency Badge */}
          <button 
            id="coin-badge-btn"
            onClick={() => onTabChange('prizes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border ${activeTab === 'prizes' ? 'border-[#ffcc00] bg-yellow-500/20' : 'border-yellow-500/20'} text-[#ffcc00] font-sans text-xs font-bold active:scale-95 transition-all shadow-lg`}
          >
            <Coins size={14} className="animate-spin duration-3000" />
            <span>{currentProfile.points}</span>
            <span className="text-[10px] text-yellow-400/80 font-medium">نقطة</span>
          </button>

          {/* Quick Daily Bonus */}
          <button 
            id="daily-bonus-btn"
            onClick={handleClaim}
            className="flex items-center justify-center p-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:text-[#ffcc00] hover:border-[#ffcc00] transition-colors active:scale-90"
            title="المكافأة اليومية"
          >
            <Flame size={16} className="text-orange-500 animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
};
