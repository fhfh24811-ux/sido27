/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tv, Heart, Sparkles, Gift, MessageSquare } from 'lucide-react';

interface MobileNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Tv },
    { id: 'watchlist', label: 'مكتبتي', icon: Heart },
    { id: 'ai', label: 'مستشار الذكي', icon: Sparkles, highlight: true },
    { id: 'prizes', label: 'النقاط', icon: Gift },
    { id: 'suggestions', label: 'الاقتراحات', icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#120f22]/95 backdrop-blur-lg border-t border-purple-950/40 px-2 py-2 pb-3 shadow-2xl">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 tap-highlight-transparent active:scale-90"
            >
              {/* Highlight background glow for active AI bubble */}
              {tab.highlight && (
                <span className="absolute -top-1.5 w-8 h-8 rounded-full bg-yellow-500/20 blur-md animate-pulse z-0" />
              )}

              <div
                className={`relative z-10 p-1 rounded-lg transition-transform duration-300 ${
                  isActive
                    ? tab.highlight
                      ? 'text-[#ffcc00] scale-110'
                      : 'text-[#ffcc00] scale-105'
                    : 'text-gray-400'
                }`}
              >
                <IconComponent
                  size={isActive ? (tab.highlight ? 22 : 20) : 18}
                  className={`transition-all ${
                    isActive && !tab.highlight ? 'stroke-[2.5px]' : ''
                  } ${isActive && tab.highlight ? 'animate-bounce' : ''}`}
                />
              </div>

              {/* Text label */}
              <span
                className={`relative z-10 text-[9px] mt-0.5 tracking-wide transition-all ${
                  isActive 
                    ? 'text-[#ffcc00] font-bold' 
                    : 'text-gray-500 font-medium'
                }`}
              >
                {tab.label}
              </span>

              {/* Glowing active line indicator */}
              {isActive && (
                <span className="absolute bottom-[-2px] w-5 h-[2px] bg-[#ffcc00] rounded-full shadow-lg shadow-[#ffcc00]/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
