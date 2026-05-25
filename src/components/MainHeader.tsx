/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSido } from '../context/SidoContext';
import { LoginModal } from './LoginModal';
import { LogOut, Award, User, ShieldAlert } from 'lucide-react';

interface MainHeaderProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export const MainHeader: React.FC<MainHeaderProps> = ({ onTabChange, activeTab }) => {
  const { currentUser, logout } = useSido();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="bg-[#120f22]/95 border-b border-purple-950/20 backdrop-blur-md sticky top-0 z-40 px-4 py-3 shrink-0 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 1. Profile information / Login trigger */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="header-logout-btn"
                onClick={logout}
                className="p-2 rounded-xl bg-red-950/10 border border-red-950/20 text-red-400 hover:text-red-500 hover:bg-red-950/30 transition-all shrink-0 active:scale-90"
                title="تسجيل الخروج"
              >
                <LogOut size={13} />
              </button>

              <div 
                id="header-avatar-btn"
                onClick={() => onTabChange('profile')} 
                className="flex items-center gap-2 bg-[#07050f]/80 p-1.5 pl-3.5 rounded-2xl border border-white/5 cursor-pointer active:scale-95 transition-transform"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.username} 
                  className="w-7 h-7 rounded-xl object-cover bg-purple-900/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-white flex items-center gap-1">
                    <span>{currentUser.username}</span>
                    {currentUser.role === 'admin' && (
                      <span className="px-1 text-[8px] rounded bg-yellow-500/10 text-yellow-500 font-extrabold border border-yellow-500/25">أدمن</span>
                    )}
                  </h4>
                  <span className="text-[9px] text-yellow-400 font-bold block -mt-1 font-mono">
                    ⭐ {currentUser.points} نقة
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <button
              id="header-login-trigger-btn"
              onClick={() => setShowLogin(true)}
              className="py-1.5 px-4 rounded-xl bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black text-[11px] font-black hover:opacity-90 active:scale-95 transition-transform"
            >
              تسجيل الدخول / البدء
            </button>
          )}
        </div>

        {/* 2. Platform logo & Name title */}
        <div 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform"
        >
          <div className="text-right">
            <h1 className="text-sm font-black text-white font-display tracking-wide flex items-center gap-1 justify-end">
              <span>سيدو SIDO</span>
              <span className="text-[#ffcc00] group-hover:rotate-12 transition-transform">🐉</span>
            </h1>
            <p className="text-[9px] text-[#887aaa] font-medium font-sans">بوابتك لمشاهدة الأنمي والدراما مجاناً</p>
          </div>
        </div>

      </div>

      {/* Login register portal trigger modal */}
      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} />
      )}
    </header>
  );
};
