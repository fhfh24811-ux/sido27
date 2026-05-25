/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSido } from '../context/SidoContext';
import { Lightbulb, Send, MessageSquarePlus, ThumbsUp, HelpCircle } from 'lucide-react';

export const SuggestionsPanel: React.FC = () => {
  const { currentUser, suggestions, addSuggestion, voteSuggestion } = useSido();

  // New suggestion form states
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('ترجمة وحلقات');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('الرجاء تسجيل الدخول أولاً لتتمكن من وضع اقتراح للعمل عليه! 🚪✨');
      return;
    }
    if (!inputText.trim()) return;

    await addSuggestion(inputText.trim(), category);
    setInputText('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6 text-right">
      
      {/* Introduction Hero header */}
      <div className="bg-[#120f22]/70 p-5 rounded-3xl border border-yellow-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-base font-black text-white flex items-center justify-end gap-1.5">
          <span>صندوق مشاركة الأفكار والاقتراحات</span>
          <Lightbulb size={16} className="text-yellow-400" />
        </h2>
        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
          صوت الأصدقاء والأوتـاكـو هو أساس تطور منصة سيدو! اطرح فكرتك أو الأنمي الذي تود إدراجه في القائمة، ودع الزملاء يصوتون على اقتراحاتك. أكثر الأفكار تداولاً سنقوم بتبنيها وتحقيقها فورياً.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Form panel to submit ideas: 1 column */}
        <div className="bg-[#120f22]/50 p-5 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-xs font-black text-white flex items-center justify-end gap-1.5 pb-2 border-b border-white/5">
            <span>اطرح فكرتك الذهبية</span>
            <MessageSquarePlus size={14} className="text-yellow-400" />
          </h3>

          {success && (
            <div className="p-3 bg-yellow-400/10 border border-yellow-400/20 text-[#ffcc00] rounded-2xl text-[10px] font-bold text-center animate-pulse">
              🎉 تم نشر فكرتك بنجاح في لوحة الملاحظات!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-extrabold block">تصنيف الفكرة</label>
              <select
                id="suggestion-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-bold text-white focus:outline-none"
              >
                <option value="ترجمة وحلقات">ترجمة وحلقات جديدة 🏮</option>
                <option value="تطوير واجهة">تحسينات في شكل وتصميم الموقع 🎨</option>
                <option value="سيرفرات دفق">خدمات البث وسرعة التشغيل ⚡</option>
                <option value="أفكار عامة">أفكار وملاحظات عامة 🔮</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-gray-400 font-extrabold block">تفاصيل الفكرة بوضوح</label>
              <textarea
                id="suggestion-text-input"
                rows={4}
                placeholder="اكتب فكرتك أو الأنميات التي تحبها وتريد منا توفيرها فوراً..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-3 py-2 bg-[#07050f] border border-white/5 rounded-2xl text-xs font-semibold text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <button
              id="submit-suggestion-btn"
              type="submit"
              disabled={!inputText.trim()}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-black font-extrabold text-xs active:scale-95 duration-200 disabled:opacity-40 flex items-center justify-center gap-1.5 shadow"
            >
              <Send size={11} className="fill-current" />
              <span>نشر اقتراحي للعلن</span>
            </button>
          </form>

          {!currentUser && (
            <div className="text-[9px] text-red-400 font-bold border border-red-500/15 p-2 bg-red-950/10 rounded-xl leading-relaxed">
              ⚠️ يرجى تسجيل الدخول أولاً لتتمكن من كتابة الأفكار والتفاعل مع الآخرين.
            </div>
          )}
        </div>

        {/* Public Feed suggestions: 2 columns */}
        <div className="md:col-span-2 space-y-3.5">
          <h3 className="text-xs font-black text-white flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-[10px] text-gray-500 font-sans font-bold">({suggestions.length}) فكرة نشطة</span>
            <span>بث الأفكار الحالية وأعلى التصويتات</span>
          </h3>

          {suggestions.length ? (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {suggestions.map((sug) => {
                const alreadyVoted = currentUser && sug.voted_by && sug.voted_by.includes(currentUser.username);
                return (
                  <div 
                    key={sug.id} 
                    className="p-4 rounded-3xl bg-[#120f22]/55 border border-white/5 hover:border-yellow-500/10 duration-200 space-y-3 relative text-right"
                  >
                    
                    {/* Top row details */}
                    <div className="flex items-center justify-between">
                      <button
                        id={`vote-btn-${sug.id}`}
                        onClick={() => {
                          if (!currentUser) {
                            alert('سجّل الدخول أولاً للتصويت والمساعدة في فرز الأفكار! 🚪✨');
                            return;
                          }
                          voteSuggestion(sug.id);
                        }}
                        className={`py-1.5 px-3 rounded-xl text-[10px] font-black flex items-center gap-1.5 active:scale-90 transition-all ${
                          alreadyVoted
                            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/25'
                            : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                        }`}
                      >
                        <ThumbsUp size={11} className={alreadyVoted ? 'fill-current' : ''} />
                        <span className="font-mono text-xs">{sug.votes} أصوات</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-[#ffcc00] font-black bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10">
                          {sug.category}
                        </span>
                        <span className="text-[10px] text-white font-extrabold">{sug.username}</span>
                      </div>
                    </div>

                    {/* text contents */}
                    <p className="text-[11px] text-gray-200 font-semibold leading-relaxed font-sans">{sug.text}</p>

                    {/* date indicators */}
                    <div className="text-[8px] text-gray-600 font-bold flex items-center gap-1 justify-end">
                      <span>{new Date(sug.created_at).toLocaleDateString('ar-EG')}</span>
                      <span>• نشر في</span>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl bg-black/10 text-gray-500 text-[10px] font-sans">
              لا توجد اقتراحات مضافة حالياً. كن أول من يضع فكرة ذهبية! 💡🚀
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
