/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSido } from '../context/SidoContext';
import { PlusCircle, ListPlus, Flame, ShieldAlert, Check, HelpCircle, Trash2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { currentUser, allAnime, addNewAnime, deleteAnime, addNewEpisode } = useSido();

  // Create Anime Form states
  const [animeName, setAnimeName] = useState('');
  const [animeDesc, setAnimeDesc] = useState('');
  const [animeImg, setAnimeImg] = useState('');
  const [animeType, setAnimeType] = useState('anime-subbed');
  const [animeLang, setAnimeLang] = useState('مترجم للعربية');
  const [animeBadge, setAnimeBadge] = useState('جديد');
  const [animeRating, setAnimeRating] = useState('8.5');
  const [animeStatus, setAnimeStatus] = useState<'ongoing' | 'completed'>('ongoing');

  const [animeSuccess, setAnimeSuccess] = useState(false);
  const [animeErr, setAnimeErr] = useState('');

  // Create Episode Form states
  const [epAnimeId, setEpAnimeId] = useState('');
  const [epTitle, setEpTitle] = useState('');
  const [epVideoUrl, setEpVideoUrl] = useState('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [epNumber, setEpNumber] = useState('1');

  const [epSuccess, setEpSuccess] = useState(false);
  const [epErr, setEpErr] = useState('');

  // Block rendering if the active user is not an administrator
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <ShieldAlert size={48} className="text-red-500 mb-3 animate-pulse" />
        <h3 className="text-sm font-black text-white">غير مصرح لك بدخول هذه المنطقة</h3>
        <p className="text-[10px] text-gray-500 mt-1 max-w-xs leading-relaxed">
          هذه لوحة تحكم سرية مخصصة للأدمن فقط لإضافة الأنميات والحلقات وإدارة قواعد البيانات. يرجى تسجيل الدخول بحساب الأدمن الخاص بك للتحكم.
        </p>
      </div>
    );
  }

  const handleCreateAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnimeErr('');
    setAnimeSuccess(false);

    if (!animeName.trim() || !animeImg.trim()) {
      setAnimeErr('الرجاء تعبئة اسم الأنمي ورابط صورة الغلاف على الأقل!');
      return;
    }

    const payload = {
      name: animeName.trim(),
      description: animeDesc.trim(),
      image: animeImg.trim(),
      type: animeType as any,
      language: animeLang.trim(),
      badge: animeBadge.trim(),
      rating: parseFloat(animeRating) || 8.5,
      status: animeStatus
    };

    const isSuccess = await addNewAnime(payload);
    if (isSuccess) {
      setAnimeSuccess(true);
      // Clean inputs
      setAnimeName('');
      setAnimeDesc('');
      setAnimeImg('');
      setAnimeLang('مترجم للعربية');
      setAnimeBadge('جديد');
      setAnimeRating('8.5');
      setTimeout(() => setAnimeSuccess(false), 3000);
    } else {
      setAnimeErr('حدث خطأ أثناء الاتصال بالخادم الرئيسي لقاعدة البيانات.');
    }
  };

  const handleCreateEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEpErr('');
    setEpSuccess(false);

    if (!epAnimeId) {
      setEpErr('الرجاء اختيار الأنمي المستهدف أولاً!');
      return;
    }
    if (!epTitle.trim() || !epVideoUrl.trim()) {
      setEpErr('الرجاء تعبئة عنوان الحلقة ورابط الفيديو الخاص بها!');
      return;
    }

    const payload = {
      anime_id: epAnimeId,
      title: epTitle.trim(),
      video_url: epVideoUrl.trim(),
      episode_number: parseInt(epNumber) || 1
    };

    const isSuccess = await addNewEpisode(payload);
    if (isSuccess) {
      setEpSuccess(true);
      setEpTitle('');
      setEpNumber((prev) => (parseInt(prev) + 1).toString()); // increment ep number automatically!
      setTimeout(() => setEpSuccess(false), 3000);
    } else {
      setEpErr('حدث خطأ أثناء ربط الحلقة التلفزيونية.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6 text-right">
      
      {/* 1. Header Hero section */}
      <div className="bg-[#120f22]/70 p-5 rounded-3xl border border-yellow-500/20 shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl" />
        <h2 className="text-base font-black text-white flex items-center gap-2 justify-end">
          <span>لوحة تحكم سيدو SIDO الإدارية</span>
          <Flame size={15} className="text-yellow-400" />
        </h2>
        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
          أهلاً بك يا منشئ المحتوى! يمكنك من هنا بناء قاعدة بيانات الأنميات الخاصة بالموقع بالكامل من الصفر. أضف أسماء الأنمايت، روابط صور البوسترات، وبث الحلقات فورياً لتظهر لجميع عملائك في نفس اللحظة!
        </p>

        {/* Counter indicators */}
        <div className="grid grid-cols-2 gap-3 mt-4 border-t border-white/5 pt-4">
          <div className="bg-[#07050f]/60 p-3 rounded-2xl text-center">
            <span className="text-lg font-black text-yellow-400 font-mono">{allAnime.length}</span>
            <span className="block text-[8px] text-gray-500 font-bold mt-0.5">أنميات في قاعدة البيانات</span>
          </div>
          <div className="bg-[#07050f]/60 p-3 rounded-2xl text-center">
            <span className="text-lg font-black text-purple-400 font-mono">١,٠٠٠+</span>
            <span className="block text-[8px] text-gray-500 font-bold mt-0.5">جاهزية دعمConcurrent Users</span>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Form A: ADD NEW ANIME */}
        <div className="bg-[#120f22]/50 p-5 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-white/5">
            <span>١. إضافة أنمي أو مسلسل كرتوني جديد</span>
            <PlusCircle size={14} className="text-yellow-400" />
          </h3>

          {animeSuccess && (
            <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-[#ffcc00] text-[10px] items-center gap-1 flex justify-center font-bold">
              <Check size={11} /> 
              <span>تم إدراج الأنمي الجديد بنجاح في الموقع!</span>
            </div>
          )}

          {animeErr && (
            <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-2xl text-red-400 text-[10px] font-bold text-center">
              ⚠️ {animeErr}
            </div>
          )}

          <form onSubmit={handleCreateAnime} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-extrabold block">اسم وتسمية الأنمي (بالعربية)</label>
              <input
                id="admin-anime-name"
                type="text"
                placeholder="مثال: هجوم العمالقة أو قاتل الشياطين..."
                value={animeName}
                onChange={(e) => setAnimeName(e.target.value)}
                className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-extrabold block">رابط صورة بوستر الغلاف</label>
              <input
                id="admin-anime-image"
                type="text"
                placeholder="الصق رابط صورة URL مباشر..."
                value={animeImg}
                onChange={(e) => setAnimeImg(e.target.value)}
                className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs text-left text-white focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-extrabold block">وصف وقصة الأنمي</label>
              <textarea
                id="admin-anime-desc"
                placeholder="اكتب نبذة أو تلميحات تشويقية حول قصة العمل ليقرأها المشاهدون..."
                value={animeDesc}
                onChange={(e) => setAnimeDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-semibold text-white focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-extrabold block">تصنيف القسم</label>
                <select
                  id="admin-anime-type"
                  value={animeType}
                  onChange={(e) => setAnimeType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none"
                >
                  <option value="anime-subbed">أنمي مترجم للعربية</option>
                  <option value="anime-dubbed">أنمي مدبلج للأطفال</option>
                  <option value="movies">أفلام كرتون وسينما</option>
                  <option value="turkish">دراما ومسلسلات تركية</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-extrabold block">اللغة والترجمة</label>
                <input
                  id="admin-anime-lang"
                  type="text"
                  placeholder="مثال: ياباني (مترجم) أو مدبلج"
                  value={animeLang}
                  onChange={(e) => setAnimeLang(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-extrabold block">شارة التميز (Badge)</label>
                <input
                  id="admin-anime-badge"
                  type="text"
                  placeholder="مثال: جديد , رائج , حصري..."
                  value={animeBadge}
                  onChange={(e) => setAnimeBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-extrabold block">تقييم مبدئي من ١٠</label>
                <input
                  id="admin-anime-rating"
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={animeRating}
                  onChange={(e) => setAnimeRating(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-extrabold block">حالة العمل الإنتاجي</label>
              <select
                id="admin-anime-status"
                value={animeStatus}
                onChange={(e) => setAnimeStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-[#ffcc00] focus:outline-none"
              >
                <option value="ongoing">مكتبة مستمرة (تحت العرض والتحديث التلقائي) ⚡</option>
                <option value="completed">عمل مكتمل الحلقات (حصري كامل جاهز) ✅</option>
              </select>
            </div>

            <button
              id="admin-submit-anime"
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-black font-extrabold text-xs active:scale-95 duration-200 shadow shadow-yellow-500/10"
            >
              🚀 حفظ وإدراج العمل في المكتبة فوراً
            </button>
          </form>
        </div>

        {/* Form B: ADD EPISODES */}
        <div className="bg-[#120f22]/50 p-5 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-white/5">
            <span>٢. إضافة وربط الحلقات بالأنمي المستهدف</span>
            <ListPlus size={14} className="text-purple-400" />
          </h3>

          {epSuccess && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 text-[10px] items-center gap-1 flex justify-center font-bold">
              <Check size={11} /> 
              <span>تم إرفاق الحلقة بنجاح وسيكون الرقم التلقائي القادم جاهزاً!</span>
            </div>
          )}

          {epErr && (
            <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-2xl text-red-400 text-[10px] font-bold text-center">
              ⚠️ {epErr}
            </div>
          )}

          {allAnime.length === 0 ? (
            <div className="text-center py-12 text-[10px] text-gray-500 bg-black/10 rounded-2xl">
              يرجى إضافة أنمي واحد على الأقل في القائمة الأولى أولاً لتتمكن من إدراج حلقات له! 🏮
            </div>
          ) : (
            <form onSubmit={handleCreateEpisode} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-extrabold block">اختر الأنمي المستهدف</label>
                <select
                  id="admin-ep-anime"
                  value={epAnimeId}
                  onChange={(e) => setEpAnimeId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none"
                >
                  <option value="">-- اختر من القائمة لتعديله --</option>
                  {allAnime.map((an) => (
                    <option key={an.id} value={an.id}>{an.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-gray-400 font-extrabold block">عنوان الحلقة</label>
                <input
                  id="admin-ep-title"
                  type="text"
                  placeholder="مثال: البداية الجديدة أو حلقة حماسية..."
                  value={epTitle}
                  onChange={(e) => setEpTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-[9px] text-gray-400 font-extrabold block">رابط تشغيل الفيديو المباشر (Direct Video Stream URL)</label>
                  <input
                    id="admin-ep-video"
                    type="text"
                    placeholder="الصق رابط فيديو MP4 أو HLS مباشر..."
                    value={epVideoUrl}
                    onChange={(e) => setEpVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs text-left text-white focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-gray-400 font-extrabold block">رقم الحلقة</label>
                  <input
                    id="admin-ep-number"
                    type="number"
                    min="1"
                    value={epNumber}
                    onChange={(e) => setEpNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-900/10 rounded-2xl text-[9px] text-gray-400 flex items-start gap-1.5">
                <HelpCircle size={13} className="text-purple-400 shrink-0 mt-0.5" />
                <span>يرجى استخدام روابط دفق مباشرة مثل أوعية التخزين أو روابط تجريبية مثل الأنبوب للاختبار. يدعم مشغل سيدو المدمج جميع روابط الفيديو المباشرة والدمج! ✨</span>
              </div>

              <button
                id="admin-submit-ep"
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs active:scale-95 duration-200"
              >
                🔗 ربط الحلقة بالأنمي المختار ونشرها فوراً
              </button>
            </form>
          )}
        </div>

      </div>

      {/* 3. Manage & Delete Existing Anime */}
      <div className="bg-[#120f22]/50 p-5 rounded-3xl border border-white/5 space-y-4">
        <h3 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-white/5">
          <span>٣. إدارة وحذف أعمال الأنمي والمسلسلات الحالية</span>
          <Trash2 size={14} className="text-red-400" />
        </h3>
        {allAnime.length === 0 ? (
          <div className="text-center py-6 text-[10px] text-gray-500">
            لا توجد أعمال لعرضها وحذفها حالياً!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {allAnime.map((an) => (
              <div key={an.id} className="p-3 bg-[#07050f]/60 rounded-2xl border border-white/5 flex items-center justify-between gap-3 text-right">
                <button
                  id={`admin-delete-anime-${an.id}`}
                  onClick={async () => {
                    if (confirm(`هل أنت متأكد من رغبتك في حذف عمل "${an.name}" بالكامل مع جميع حلقاته وتعليقاته؟`)) {
                      await deleteAnime(an.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-red-650 hover:bg-red-700 text-white transition-all active:scale-90"
                  title="حذف هذا العمل"
                >
                  <Trash2 size={13} />
                </button>
                <div className="flex-1">
                  <span className="text-[11px] font-black text-white block">{an.name}</span>
                  <span className="text-[9px] text-gray-500 block mt-0.5">{an.type === 'anime-subbed' ? 'مترجم' : an.type === 'anime-dubbed' ? 'مدبلج' : an.type === 'movies' ? 'فيلم' : 'دراما'} • {an.language}</span>
                </div>
                <img src={an.image} alt={an.name} className="w-9 h-12 rounded object-cover bg-gray-900" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
