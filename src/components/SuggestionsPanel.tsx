/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSido } from '../context/SidoContext';
import { MessageSquare, Plus, ThumbsUp, HelpCircle, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const SuggestionsPanel: React.FC = () => {
  const { currentProfile, suggestions, addSuggestion, voteSuggestion } = useSido();

  // New suggestion inputs
  const [newText, setNewText] = useState('');
  const [newCat, setNewCat] = useState('عام');

  const categories = ["عام", "ترجمة وحلقات", "تصنيفات", "مزايا تقنية"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    addSuggestion(newText, newCat);
    setNewText('');
    alert("شكرًا لك! تم إرسال اقتراحك المتميز بنجاح لصندوق الأفكار 💡✨");
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-12 px-1">
      
      {/* 1. Header Overview message */}
      <div className="text-center py-2">
        <span className="text-xs text-yellow-400 font-extrabold flex items-center justify-center gap-1">
          <MessageSquare size={13} className="text-yellow-400 fill-yellow-400/20" />
          <span>صندوق أفكار واقتراحات الأعضاء</span>
        </span>
        <h2 className="text-sm font-bold text-white mt-1">ساهم في تطوير وتحديث منصة سيدو</h2>
        <p className="text-[10px] text-gray-500 mt-1">اكتب اقتراحاتك بخصوص إضافة سلاسل أنمي جديدة، خيارت تعديل أو تحسين للمشغل والموقع!</p>
      </div>

      {/* 2. New Idea Form element */}
      <form onSubmit={handleSubmit} className="bg-[#120f22] p-4 rounded-3xl border border-purple-950/20 space-y-3.5 shadow-xl">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-400 font-bold block">ما هو اقتراحك أو الإضافة التي تود تواجدها؟</label>
          <textarea
            id="suggestion-textarea"
            placeholder="مثال: إضافة قسم مسلسلات كرتون الثمانينات المدبلجة..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-[#07050f] border border-white/5 text-white placeholder-gray-600 font-sans text-xs focus:outline-none focus:border-[#ffcc00] resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold font-sans">قسم الاقتراح:</span>
            <select
              id="suggestion-category"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="py-1 px-3.5 rounded-xl bg-[#07050f] border border-white/5 text-[11px] font-bold text-yellow-400 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-[#120f22] text-white">{c}</option>
              ))}
            </select>
          </div>

          <button
            id="submit-suggestion-btn"
            type="submit"
            className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black font-extrabold text-xs active:scale-95 transition-transform flex items-center gap-1.5 shadow"
          >
            <Send size={11} className="fill-current" />
            <span>إرسال الاقتراح</span>
          </button>
        </div>
      </form>

      {/* 3. Suggestions list */}
      <div className="space-y-3.5">
        <h3 className="text-xs text-yellow-500 font-extrabold flex items-center gap-1 font-sans">
          <span>💡 الأفكار النشطة المصوت عليها ({suggestions.length})</span>
        </h3>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {suggestions.map((item) => {
            const hasVoted = item.voted_by.includes(currentProfile.username);
            return (
              <div
                id={`suggestion-card-${item.id}`}
                key={item.id}
                className="p-4 rounded-2xl bg-[#120f22]/50 border border-white/5 flex items-start gap-3 hover:border-white/10 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[9px] font-black font-sans uppercase">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans font-bold">
                      بواسطة: {item.username}
                    </span>
                  </div>

                  <p className="text-xs font-sans text-gray-200 leading-relaxed font-semibold">
                    {item.text}
                  </p>

                  <span className="text-[9px] text-gray-600 font-mono block">
                    {new Date(item.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <button
                  id={`vote-btn-${item.id}`}
                  onClick={() => voteSuggestion(item.id)}
                  className={`py-1.5 px-3 rounded-xl border flex flex-col items-center gap-1 active:scale-90 transition-all shrink-0 ${
                    hasVoted
                      ? 'bg-yellow-500/15 border-[#ffcc00] text-[#ffcc00]'
                      : 'border-white/5 bg-[#07050f]/60 text-gray-400 hover:border-white/25 hover:text-white'
                  }`}
                  title={hasVoted ? 'إلغاء التصويت' : 'تصويت للأعلى'}
                >
                  <ThumbsUp size={11} className={hasVoted ? 'fill-current' : ''} />
                  <span className="text-[11px] font-mono font-black">{item.votes}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
