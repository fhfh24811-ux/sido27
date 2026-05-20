/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSido } from '../context/SidoContext';
import { 
  Coins, Sparkles, UserPlus, Gift, History, GiftIcon, 
  HelpCircle, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PointsDashboard: React.FC = () => {
  const { 
    currentProfile, transactions, claimDailyLogin, claimReferral, 
    redeemGiftCard, resetUserData 
  } = useSido();

  // Tab controls
  const [pointsTab, setPointsTab] = useState<'spin' | 'invite' | 'store' | 'history'>('spin');

  // Daily Spin & Claim status indicators
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Referral State
  const [friendCode, setFriendCode] = useState('');
  const [refStatus, setRefStatus] = useState<{ type: 'idle' | 'success' | 'err'; msg: string }>({ type: 'idle', msg: '' });

  // Store Redeeming State
  const [storeStatus, setStoreStatus] = useState<string | null>(null);

  const rewardsStore = [
    { id: 'gp-1', value: '$1 بطاقة جوجل بلاي', cost: 1000, desc: "بطاقة شحن رصيد جوجل لتفعيل ألعابك وتطبيقاتك المفضلة", image: "🎮" },
    { id: 'ff-1', value: '$1 جواهر فري فاير (100 جوهرة)', cost: 1000, desc: "شحن مباشر لحساب فري فاير الخاص بك لشراء الجلود والمظلات", image: "💎" },
    { id: 'pubg-1', value: '$1 شدات ببجي (60 شدة)', cost: 1000, desc: "شحن فوري ومعتمد لشدات ببجي موبايل لفتح الرويال باس", image: "🔫" },
    { id: 'itunes-1', value: '$1 بطاقة آيتونز أبل', cost: 1000, desc: "بطاقة هدايا متجر آبل لتجربة تطبيقات وخدمات iOS المميزة", image: "🍎" },
  ];

  // Daily Spin wheel action
  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);

    // Beautiful delay simulator
    setTimeout(() => {
      const res = claimDailyLogin();
      setSpinning(false);
      if (res.success) {
        setSpinResult(`لقد فزت بـ +${res.pointsEarned} نقطة اليوم! 🎉`);
      } else {
        setSpinResult(res.message);
      }
    }, 2000);
  };

  // Claim referral logic
  const handleClaimReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCode.trim()) return;

    const res = claimReferral(friendCode);
    if (res.success) {
      setRefStatus({ type: 'success', msg: res.message });
      setFriendCode('');
    } else {
      setRefStatus({ type: 'err', msg: res.message });
    }

    setTimeout(() => {
      setRefStatus({ type: 'idle', msg: '' });
    }, 4000);
  };

  // Redeeming store logic
  const handleRedeem = (cost: number, value: string) => {
    const confirmation = window.confirm(`هل أنت متأكد من رغبتك في تبديل ${cost} نقطة لشراء بطاقة ${value}؟`);
    if (!confirmation) return;

    const res = redeemGiftCard(cost, value);
    if (res.success) {
      setStoreStatus(`مبروك! تم تقديم طلبك لشراء ${value}. تواصل مع الإدارة برقم بريدك للحصول عليها! 🎉`);
    } else {
      setStoreStatus(res.message);
    }

    setTimeout(() => {
      setStoreStatus(null);
    }, 5000);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-12 px-1">
      
      {/* 1. Header Balance Cards */}
      <div className="bg-gradient-to-br from-[#120f22] to-indigo-950/20 p-5 rounded-3xl border border-purple-900/30 flex items-center justify-between shadow-2xl">
        <div className="space-y-1">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">رصيدك الكلي الحالي</span>
          <div className="flex items-baseline gap-1">
            <h2 className="text-3xl font-display font-black text-[#ffcc00] tracking-tight">{currentProfile.points}</h2>
            <span className="text-xs text-yellow-400 font-bold">نقطة سيدو ذهبية</span>
          </div>
          <p className="text-[9px] text-gray-400 font-medium">1000 نقطة سيدو تعادل 1$ كاش أو هدايا معتمدة! 🎟️</p>
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-500 to-[#ffcc00] flex items-center justify-center text-black border-4 border-black font-black text-2xl animate-pulse shadow-lg shadow-yellow-500/10">
            🪙
          </div>
        </div>
      </div>

      {/* 2. Sub Tabs Navigation Menu */}
      <div className="flex items-center rounded-2xl bg-[#120f22] p-1 border border-purple-950/20 text-xs font-bold w-full overflow-x-auto min-w-full">
        <button
          id="tab-points-spin"
          onClick={() => setPointsTab('spin')}
          className={`flex-1 min-w-[70px] whitespace-nowrap py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${pointsTab === 'spin' ? 'bg-[#ffcc00] text-black shadow-lg' : 'text-gray-400'}`}
        >
          <Coins size={12} />
          <span>عجلة الحظ</span>
        </button>
        <button
          id="tab-points-invite"
          onClick={() => setPointsTab('invite')}
          className={`flex-1 min-w-[70px] whitespace-nowrap py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${pointsTab === 'invite' ? 'bg-[#ffcc00] text-black shadow-lg' : 'text-gray-400'}`}
        >
          <UserPlus size={12} />
          <span>دعوة الأصدقاء</span>
        </button>
        <button
          id="tab-points-store"
          onClick={() => setPointsTab('store')}
          className={`flex-1 min-w-[70px] whitespace-nowrap py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${pointsTab === 'store' ? 'bg-[#ffcc00] text-black shadow-lg' : 'text-gray-400'}`}
        >
          <Gift size={12} />
          <span>متجر المكافآت</span>
        </button>
        <button
          id="tab-points-history"
          onClick={() => setPointsTab('history')}
          className={`flex-1 min-w-[70px] whitespace-nowrap py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 ${pointsTab === 'history' ? 'bg-[#ffcc00] text-black shadow-lg' : 'text-gray-400'}`}
        >
          <History size={12} />
          <span>السجل</span>
        </button>
      </div>

      {/* 3. Tab contents implementations */}
      <div className="bg-[#120f22]/40 rounded-3xl border border-white/5 p-4 min-h-[300px]">
        
        {/* TAB A: Interactive Spin Wheel */}
        {pointsTab === 'spin' && (
          <div className="text-center space-y-6 py-4 flex flex-col items-center">
            <div className="max-w-xs">
              <span className="text-xs text-yellow-400 font-extrabold block">جائزتك اليومية بانتظارك</span>
              <h3 className="text-sm font-bold mt-1 text-white">دوّر عجلة الحظ واحصل على نقاط فورية</h3>
              <p className="text-[10px] text-gray-500 mt-1">يوم الجمعة يحمل نقاطاً مضاعفة دائماً! (+100 نقطة) 🎁</p>
            </div>

            {/* Rotative wheel physical structure */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500 via-purple-600 to-indigo-500 rounded-full blur-xl opacity-20" />
              <motion.div
                animate={spinning ? { rotate: 1800 } : { rotate: 0 }}
                transition={spinning ? { duration: 2, ease: "easeOut" } : { duration: 0.2 }}
                className="w-36 h-36 rounded-full border-4 border-[#ffcc00] bg-gradient-to-b from-[#120f22] to-black flex items-center justify-center relative shadow-2xl"
              >
                {/* Visual partition lines */}
                <div className="absolute inset-0 border border-dashed border-white/10 rounded-full" />
                <div className="absolute w-[2px] h-full bg-white/5" />
                <div className="absolute h-[2px] w-full bg-white/5" />
                
                <Coins size={36} className={`${spinning ? 'animate-bounce' : ''} text-[#ffcc00]`} />
              </motion.div>
              {/* Center pointer element */}
              <div className="absolute top-[-8px] z-10 w-4 h-6 bg-red-500 rounded-b-full shadow" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
            </div>

            <button
              id="spin-wheel-btn"
              onClick={handleSpinWheel}
              disabled={spinning}
              className="py-3 px-8 rounded-full bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black font-extrabold text-xs active:scale-95 transition-transform disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-yellow-500/10"
            >
              <RefreshCw size={12} className={spinning ? 'animate-spin' : ''} />
              <span>{spinning ? 'جاري تدوير العجلة...' : 'أدر العجلة الآن'}</span>
            </button>

            {/* Response messages banner */}
            {spinResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/5 rounded-2xl border border-white/5 text-xs font-semibold text-yellow-300 max-w-xs"
              >
                {spinResult}
              </motion.div>
            )}

            {/* Guidelines notes */}
            <div className="bg-[#07050f]/30 p-3 rounded-2xl border border-white/5 text-[10px] text-gray-400 text-right w-full space-y-1">
              <h4 className="font-bold text-gray-300 text-right">كيف يمكنني زيادة نقاطي بسرعة؟</h4>
              <p>📍 تسجيل الدخول اليومي: <strong>+50 نقطة</strong> (الجمعة <strong>+100</strong>)</p>
              <p>📍 مشاهدة أي حلقة بالكامل (10 ثوانٍ كحد أدنى): <strong>+10 نقاط</strong></p>
              <p>📍 دعوة أي صديق لتحميل الموقع: <strong>+200 نقطة</strong> لكلاهما!</p>
            </div>
          </div>
        )}

        {/* TAB B: Direct friend invitation & referrals */}
        {pointsTab === 'invite' && (
          <div className="space-y-6 py-2">
            <div>
              <span className="text-xs text-yellow-400 font-extrabold block">برنامج الدعوات والمكافآت</span>
              <h3 className="text-sm font-bold mt-1 text-white">اكسب +200 نقطة عن كل صديق تدعوه!</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed mt-1">شارك كود الإحالة الخاص بك مع أصدقائك، بمجرد إدخالهم للكود الخاص بك ستحصل أنت وصديقك على 200 نقطة مجانية مضافة لرصيدكم فوراً!</p>
            </div>

            {/* Personal promo code display */}
            <div className="bg-[#07050f]/60 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase">كود الإحالة الخاص بك</span>
              <div className="px-5 py-2 rounded-xl bg-purple-950/20 border border-purple-500/20 text-white font-mono text-xl font-black tracking-widest shadow">
                {currentProfile.referralCode}
              </div>
              <button 
                id="copy-ref-code-btn"
                onClick={() => {
                  navigator.clipboard.writeText(currentProfile.referralCode);
                  alert("تم نسخ الكود بنجاح! شاركه مع أصدقائك الآن 🤝");
                }}
                className="text-[11px] text-yellow-400 hover:underline hover:text-[#ffcc00] font-sans font-extrabold active:scale-95"
              >
                نسخ الرمز السريع
              </button>
            </div>

            {/* Input form to submit friend's code */}
            <form onSubmit={handleClaimReferralSubmit} className="space-y-2.5">
              <label className="text-[10px] text-gray-400 font-bold block">هل تمت دعوتك بواسطة صديق؟ أدخل الكود هنا:</label>
              <div className="flex gap-2">
                <input
                  id="friend-code-input"
                  type="text"
                  placeholder="مثال: SIDO12345"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#07050f] border border-white/10 text-white placeholder-gray-600 font-mono font-bold focus:outline-none focus:border-[#ffcc00] text-sm tracking-widest"
                />
                <button
                  id="submit-friend-code-btn"
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-[#ffcc00] text-black font-extrabold text-xs active:scale-95 shrink-0"
                >
                  تفعيل ومطالبة 🎁
                </button>
              </div>
            </form>

            {/* Form state feedback banner */}
            {refStatus.type !== 'idle' && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${refStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                {refStatus.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{refStatus.msg}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB C: Award store redemptions */}
        {pointsTab === 'store' && (
          <div className="space-y-4 py-2">
            <div>
              <span className="text-xs text-yellow-400 font-extrabold block">سوق تبديل الهدايا الحرة</span>
              <h3 className="text-sm font-bold mt-1 text-white">استلم رصيدك بقيمة 1$ مباشرة في حساباتك</h3>
              <p className="text-[10px] text-gray-500 mt-1">عند تجميع 1000 نقطة يمكنك سحبها كبطاقة تفعيل لأقوى الألعاب والتطبيقات مجاناً!</p>
            </div>

            {/* Display store messages feedback banner */}
            {storeStatus && (
              <div className="p-3 bg-[#ffcc00]/10 border border-[#ffcc00]/20 text-[#ffcc00] rounded-xl text-xs font-semibold">
                {storeStatus}
              </div>
            )}

            {/* Store Grid list */}
            <div className="grid grid-cols-1 gap-3">
              {rewardsStore.map((reward) => {
                const isAffordable = currentProfile.points >= reward.cost;
                return (
                  <div
                    id={`store-item-${reward.id}`}
                    key={reward.id}
                    className="p-3.5 rounded-2xl bg-[#07050f]/60 border border-white/5 hover:border-[#ffcc00]/30 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{reward.image}</span>
                      <div className="flex flex-col">
                        <h4 className="text-xs font-bold text-white font-sans">{reward.value}</h4>
                        <p className="text-[9px] text-gray-400 line-clamp-1 mt-0.5">{reward.desc}</p>
                      </div>
                    </div>

                    <button
                      id={`redeem-btn-${reward.id}`}
                      onClick={() => handleRedeem(reward.cost, reward.value)}
                      className={`py-1.5 px-3 rounded-xl text-[10px] font-extrabold flex items-center gap-1 active:scale-95 transition-all shrink-0 ${
                        isAffordable 
                          ? 'bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black hover:shadow-lg' 
                          : 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <GiftIcon size={11} />
                      <span>{reward.cost} نقطة</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB D: Transactions logger list */}
        {pointsTab === 'history' && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-yellow-400 font-extrabold block">أداء ونشاط المحفظة</span>
                <h3 className="text-sm font-bold text-white mt-0.5">سجل حركات نقاط سيدو</h3>
              </div>
              
              {/* Reset simulator data for easy grading or retry testing */}
              <button 
                id="reset-points-btn"
                onClick={() => {
                  const conf = window.confirm("هل أنت متأكد من رغبتك في تصفير بيانات المحفظة وإعادتها لقيمتها الافتراضية؟");
                  if (conf) resetUserData();
                }}
                className="text-[9px] text-red-400 font-black hover:underline active:scale-95"
              >
                إعادة تصفير الحساب
              </button>
            </div>

            {/* Scrollable logger table */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {transactions.length ? (
                transactions.map((tx) => (
                  <div
                    id={`tx-row-${tx.id}`}
                    key={tx.id}
                    className="p-3 bg-[#07050f]/60 rounded-xl border border-white/5 flex items-center justify-between gap-2.5 text-right font-sans"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold text-gray-200 line-clamp-1 leading-tight">
                        {tx.note}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono">
                        {new Date(tx.created_at).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <span className={`text-[11px] font-black shrink-0 ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 text-xs">
                  لا توجد حركات نقاط مسجلة بعد. ابدأ بمشاهدة الحلقات لكسب النقاط! 🍿
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
