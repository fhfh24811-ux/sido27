/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSido } from '../context/SidoContext';
import { Gift, Award, Star, Zap, ShoppingCart, HelpCircle } from 'lucide-react';

export const PointsDashboard: React.FC = () => {
  const { currentUser, rewardPoints } = useSido();

  // Spin Wheel States
  const [spinning, setSpinning] = useState(false);
  const [degree, setDegree] = useState(0);
  const [wonValue, setWonValue] = useState<number | null>(null);

  // Shop states
  const [buyingBadge, setBuyingBadge] = useState<string | null>(null);

  const handleSpin = () => {
    if (!currentUser) {
      alert('الرجاء تسجيل الدخول أولاً لتتمكن من تدوير العجلة والحصول على النقاط اليومية المجانية السحب! 🚪✨');
      return;
    }
    if (spinning) return;

    setSpinning(true);
    setWonValue(null);

    // Pick random prize out of [30, 50, 100, 150, 200, 500]
    const pOptions = [30, 50, 100, 150, 200, 500];
    const itemIndex = Math.floor(Math.random() * pOptions.length);
    const prize = pOptions[itemIndex];

    // Compute rotation angles
    const baseRotations = 5; // spins
    const segmentAngle = 360 / pOptions.length;
    const computedRotation = (baseRotations * 360) + (itemIndex * segmentAngle);

    setDegree(computedRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonValue(prize);
      // Update points on backend DB dynamically!
      rewardPoints(prize, 'spin-wheel');
    }, 4000); // 4 seconds spin duration
  };

  const buyPremiumPrize = (pointsCost: number, prizeTitle: string) => {
    if (!currentUser) return;
    if (currentUser.points < pointsCost) {
      alert('❌ عذراً يا صديقي! نقاطك الحالية لا تكفي لشراء هذا الامتياز بعد. شاهد المزيد من الحلقات واكسب النقاط من عجلة الحظ! 🐉');
      return;
    }

    // Deduct points (backend endpoint support subtraction)
    rewardPoints(-pointsCost, `buy-${prizeTitle}`);
    alert(`🎉 تهانينا! قمت بشراء "${prizeTitle}" بنجاح! سيتم تطبيق الامتياز على حسابك فوراً!`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6 text-right">
      
      {/* Overview display */}
      <div className="bg-[#120f22]/80 p-5 rounded-3xl border border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-right">
          <h2 className="text-base font-black text-white flex items-center gap-1.5 justify-end">
            <span>متجر الهدايا ونظام النقاط التفاعلي</span>
            <Award size={16} className="text-[#ffcc00]" />
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 max-w-sm">
            اكسب النقاط مجاناً بمجرد تدوير عجلة الحظ اليومية أو بمشاهدة حلقات الأنمي، ثم استخدمها لاستبدالها بهدايا وامتيازات حساب حصرية!
          </p>
        </div>

        {currentUser ? (
          <div className="bg-[#07050f] py-2.5 px-6 rounded-2xl border border-yellow-500/20 text-center shadow-lg">
            <span className="text-xs text-gray-400 font-bold block">رصيد نقاطك الحالي</span>
            <span className="text-xl font-black text-[#ffcc00] font-mono">⭐ {currentUser.points}</span>
            <span className="block text-[8px] text-gray-400 mt-0.5 font-bold">نقطة ذهبية في سيدو</span>
          </div>
        ) : (
          <div className="py-2.5 px-4 rounded-2xl bg-red-950/15 border border-red-900/10 text-red-400 text-[10px] font-black leading-relaxed">
            ⚠️ يرجى تسجيل الدخول للحصول على نقاط وحفظها!
          </div>
        )}
      </div>

      {/* Main Wheel Grid area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left column: Spin to Win Wheel */}
        <div className="bg-[#120f22]/50 p-6 rounded-3xl border border-white/5 space-y-5 text-center flex flex-col items-center">
          <div className="text-right w-full">
            <h3 className="text-xs font-black text-white flex items-center justify-end gap-1.5 border-b border-white/5 pb-2">
              <span>عجلة الحظ اليومية للأوتاكو</span>
              <Gift size={14} className="text-yellow-400" />
            </h3>
            <p className="text-[9px] text-gray-400 mt-1">يمكنك لف العجلة مرة واحدة يومياً لتلقي نقاط مجانية تتراوح من ٣٠ إلى ٥٠٠ نقطة!</p>
          </div>

          {/* Virtual animated Wheel graphic */}
          <div className="relative w-44 h-44 my-4 flex items-center justify-center">
            
            {/* Pointer arrow on top */}
            <div className="absolute top-0 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-yellow-400 z-20 drop-shadow" />

            {/* Circle Wheel body */}
            <div 
              style={{ 
                transform: `rotate(${degree}deg)`,
                transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
              }}
              className="w-full h-full rounded-full border-4 border-[#ffcc00]/50 bg-gradient-to-tr from-[#120f22] to-purple-950 relative overflow-hidden flex items-center justify-center z-10 shadow-2xl"
            >
              {/* Inner details or stripes */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_50%,_indigo_100%)] opacity-35" />
              
              {/* Prize segmented numbers */}
              <span className="absolute top-3 font-mono text-[9px] font-black text-white rotate-0">500⭐</span>
              <span className="absolute right-3 font-mono text-[9px] font-black text-white rotate-95">200⭐</span>
              <span className="absolute bottom-3 font-mono text-[9px] font-black text-white rotate-180">150⭐</span>
              <span className="absolute left-3 font-mono text-[9px] font-black text-white -rotate-90">100⭐</span>
              
              <div className="w-12 h-12 rounded-full bg-[#120f22] border-2 border-yellow-400 flex items-center justify-center text-xs font-black text-yellow-500 z-10 shadow">
                SIDO
              </div>
            </div>
          </div>

          <button
            id="prizes-spin-btn"
            onClick={handleSpin}
            disabled={spinning}
            className="w-full max-w-xs py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-black font-extrabold text-xs active:scale-95 duration-200 shadow-lg cursor-pointer disabled:opacity-40"
          >
            {spinning ? '🔮 يرجى الانتظار، دفق الحظ مستمر...' : '🎰 جرب حظك الحماسي الآن!'}
          </button>

          {wonValue !== null && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black rounded-2xl w-full animate-bounce">
              🎉 رائع جداً! لقد فزت بـ <span className="font-mono text-xs">{wonValue}</span> نقطة مضافة لحسابك فوراً!
            </div>
          )}
        </div>

        {/* Right column: Point spending store */}
        <div className="bg-[#120f22]/50 p-5 rounded-3xl border border-white/5 space-y-4">
          <div className="text-right">
            <h3 className="text-xs font-black text-white flex items-center justify-end gap-1.5 border-b border-white/5 pb-2">
              <span>سوق استبدال الجوائز والامتيازات</span>
              <Zap size={14} className="text-purple-400" />
            </h3>
            <p className="text-[9px] text-gray-400 mt-1">استبدل نقاطك بحزم مميزة تظهر بجانب اسمك في واجهات التعليقات والمنصة!</p>
          </div>

          {/* Catalog prizes elements */}
          <div className="space-y-3">
            
            {/* Item 1 */}
            <div className="p-3 rounded-2xl bg-[#07050f]/60 hover:bg-[#07050f] border border-white/5 transition-all flex items-center justify-between gap-2 text-right">
              <button
                id="buy-prize-1"
                onClick={() => buyPremiumPrize(100, 'شعار الأوتاكو الذهبي')}
                className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black active:scale-95 transition-all shrink-0"
              >
                شراء بـ 100⭐
              </button>
              <div>
                <h4 className="text-[11px] font-black text-white flex items-center gap-1.5 justify-end">
                  <span>شعار "الأوتاكو الأسطوري"</span>
                  <span className="px-1 text-[8px] rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-black">شعارات</span>
                </h4>
                <p className="text-[9px] text-[#887aaa] mt-0.5">رمز تاجي ذهبي مضيء يظهر بجوار اسم مستخدمك في التعليقات العامة.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-3 rounded-2xl bg-[#07050f]/60 hover:bg-[#07050f] border border-white/5 transition-all flex items-center justify-between gap-2 text-right">
              <button
                id="buy-prize-2"
                onClick={() => buyPremiumPrize(250, 'خيار جودة بث فائقة الكريستال')}
                className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black active:scale-95 transition-all shrink-0"
              >
                شراء بـ 250⭐
              </button>
              <div>
                <h4 className="text-[11px] font-black text-white flex items-center gap-1.5 justify-end">
                  <span>جودة بث البلاتينيوم الفائقة 4K</span>
                  <span className="px-1 text-[8px] rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-black">بث مباشر</span>
                </h4>
                <p className="text-[9px] text-[#887aaa] mt-0.5">فتح سيرفرات الدفق فائقة السرعة بدون إعلانات للقرارات الكبيرة.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-3 rounded-2xl bg-[#07050f]/60 hover:bg-[#07050f] border border-white/5 transition-all flex items-center justify-between gap-2 text-right">
              <button
                id="buy-prize-3"
                onClick={() => buyPremiumPrize(400, 'الترقية الاستثنائية لمرشد الروبوت')}
                className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black active:scale-95 transition-all shrink-0"
              >
                شراء بـ 400⭐
              </button>
              <div>
                <h4 className="text-[11px] font-black text-white flex items-center gap-1.5 justify-end">
                  <span>ترقية مرشد الروبوت الذكي سينباي</span>
                  <span className="px-1 text-[8px] rounded bg-green-500/15 text-green-400 border border-green-500/20 font-black">ذكاء اصطناعي</span>
                </h4>
                <p className="text-[9px] text-[#887aaa] mt-0.5">يزيد مستويات دقة التوصيات بمساعد Gemini الذكي ليناسب ذوقك الاستثنائي.</p>
              </div>
            </div>

          </div>

          {/* Quests guidelines */}
          <div className="bg-[#07050f]/60 p-3 rounded-2xl border border-white/5 space-y-2 mt-4">
            <span className="text-[9px] text-gray-400 block font-bold">🎯 كيف تجني المزيد من النقاط والمكافآت؟</span>
            <div className="flex items-center justify-between text-[8px] text-gray-500 font-semibold">
              <span className="text-yellow-400">+٧٠ نقطة</span>
              <span>• مشاهدة حلقة أنمي لمدة ١٢ ثانية على الأقل</span>
            </div>
            <div className="flex items-center justify-between text-[8px] text-gray-500 font-semibold">
              <span className="text-purple-400">+١٥٠ نقطة</span>
              <span>• التسجيل الترحيبي لأول مرة على منصة سيدو</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
