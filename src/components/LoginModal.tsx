/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSido } from '../context/SidoContext';
import { X, User, Lock, Sparkles, Smile } from 'lucide-react';

interface LoginModalProps {
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { login, register, error } = useSido();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setSuccessMsg('');

    let success = false;
    if (isRegister) {
      success = await register(username, password);
      if (success) {
        setSuccessMsg('🎉 تهانينا! تم إنشاء حسابك وحصلت على ١٥٠ نقطة ترحيبية!');
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      }
    } else {
      success = await login(username, password);
      if (success) {
        setSuccessMsg('✅ بنجاح! جاري تحميل عالم الأنمي الخاص بك...');
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-[#07050f]/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Box layout */}
      <div className="relative w-full max-w-sm bg-[#120f22] border border-purple-900/40 rounded-3xl p-6 shadow-2xl z-10 text-right overflow-hidden">
        
        {/* Abstract light effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5 relative">
          {onClose && (
            <button 
              id="close-login-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={15} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">🐉</span>
            <span className="text-xs font-black text-[#ffcc00] font-display">منصة سيدو</span>
          </div>
        </div>

        <div className="text-center mb-6 relative">
          <h2 className="text-base font-black text-white">
            {isRegister ? 'إنشاء حساب جديد في سيدو' : 'تسجيل الدخول في حسابك'}
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 font-medium leading-relaxed">
            {isRegister 
              ? 'انضم لأكثر من ألف صديق وتفاعل مع الأنميات وصندوق الاقتراحات فوراً!' 
              : 'شاهد الأنميات المفضلة لديك وسجّل تقدمك واكسب نقاط الجوائز!'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-950/20 border border-red-900/40 text-red-400 text-[10px] font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-bold text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold block">اسم المستخدم (بالأحرف أو العربية)</label>
            <div className="relative">
              <input
                id="login-username-input"
                type="text"
                placeholder="أدخل اسم المستخدم..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-[#07050f] border border-white/5 text-white placeholder-gray-600 font-medium text-xs focus:outline-none focus:border-[#ffcc00]"
              />
              <User size={13} className="absolute top-3.5 right-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold block">كلمة المرور الأمنية</label>
            <div className="relative">
              <input
                id="login-password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-[#07050f] border border-[#07050f] text-white placeholder-gray-600 font-medium text-xs focus:outline-none focus:border-[#ffcc00]"
              />
              <Lock size={13} className="absolute top-3.5 right-4 text-gray-500" />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-2xl bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black font-extrabold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
            ) : (
              <>
                <Sparkles size={11} className="fill-current" />
                <span>{isRegister ? 'إنشاء حساب جديد وجني المكافأة' : 'دخول إلى حسابي الآن'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center relative border-t border-white/5 pt-3">
          <button
            id="toggle-auth-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setSuccessMsg('');
            }}
            className="text-[10px] text-yellow-400 font-black hover:underline"
          >
            {isRegister 
              ? 'هل تمتلك حساب بالفعل؟ انقر لتسجيل الدخول 🚪' 
              : 'ليس لديك حساب مسبق؟ أنشئ حسابك فوراً وحصل على هدايا ترحيبية! ✨'}
          </button>
        </div>

      </div>
    </div>
  );
};
