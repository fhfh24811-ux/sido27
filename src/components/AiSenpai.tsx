/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSido } from '../context/SidoContext';
import { MessageSquare, Send, Sparkles, Bot, CornerDownLeft } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const AiSenpai: React.FC = () => {
  const { currentUser } = useSido();

  // Initial greeting statement
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'كونيتشيوا! أوهايو يا صديقي الأوتاكو! 🐉🌸\nأنا سينباي سيدو (Sido Senpai) مرشدك الذكي المدعوم بـ Gemini الذكاء الاصطناعي.\nأخبرني: ما هو مزاجك اليوم؟ غامض؟ حماسي؟ رومانسي؟ أم كلاسيكي؟ وسوف أرشدك لأروع الأنميات والمسلسلات التي تناسب ذوقك وتماثل رغبتك الرائعة فوراً!'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setLoading(true);

    // Append to messages list
    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);

    try {
      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          // sending latest 6 messages to keep context window light and highly responsive
          chatHistory: updatedMessages.slice(-6)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: 'model', text: data.reply || 'آسف يا صديقي، طاقة الأثير منخفضة ولا أستطيع الرد بدقة الآن.' }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: 'دايجوبو ديس كا؟ 😢 يبدو أن الخادم الرئيسي يواجه حملاً مرتفعاً حالياً.' }]);
      }
    } catch (err) {
      console.error('Gemini advisor error:', err);
      setMessages((prev) => [...prev, { role: 'model', text: 'فشل الاتصال الراديوي مع سينباي. يرجى تكرار المحاولة!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 h-[calc(100vh-140px)] flex flex-col justify-between text-right">
      
      {/* Introduction floating header */}
      <div className="bg-[#120f22]/70 p-4 rounded-2xl border border-yellow-500/10 shrink-0 mb-3 flex items-center justify-between gap-2.5">
        <div className="text-right">
          <h2 className="text-xs font-black text-white flex items-center gap-1.5 justify-end">
            <span>سينباي سيدو الذكي SIDO AI</span>
            <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
          </h2>
          <p className="text-[9px] text-gray-500 mt-0.5 leading-relaxed">مرشدك الآلي الذكي للدراما وتوصيات الأنميات المخصصة</p>
        </div>
        <Bot size={22} className="text-[#ffcc00] shrink-0" />
      </div>

      {/* Messages stream viewport */}
      <div className="flex-1 bg-black/25 rounded-3xl border border-white/5 overflow-y-auto p-4 space-y-3.5 mb-3.5 select-text">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex items-start gap-2 max-w-[85%] ${m.role === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
          >
            {/* Avatar thumbnail */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
              {m.role === 'user' ? <span className="text-[10px] font-black font-sans">أنا</span> : <span className="text-xs">🏮</span>}
            </div>

            {/* Bubble body text */}
            <div className={`p-3.5 rounded-2xl text-[11px] font-semibold leading-relaxed font-sans ${
              m.role === 'user' 
                ? 'bg-gradient-to-tr from-purple-650 to-indigo-600 text-white rounded-tr-none' 
                : 'bg-[#120f22] text-gray-100 rounded-tl-none border border-white/5'
            }`}>
              <div className="whitespace-pre-line text-right leading-relaxed font-semibold">
                {m.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2 ml-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center border border-yellow-500/20">
              <span className="text-xs">🏮</span>
            </div>
            <div className="p-3.5 rounded-3xl bg-[#120f22] text-gray-400 text-[10px] flex items-center gap-1.5 border border-white/5">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
              <span>جاري تحليل قاعدة ذوقك الأسطوري... 🍥</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input console area */}
      <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
        <input
          id="chat-user-input"
          type="text"
          placeholder="مثال: اقترح لي أنمي قتالي يحمل غموض وأساطير سحرية..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-2xl bg-[#120f22] border border-white/5 text-white placeholder-gray-600 text-[11px] font-bold focus:outline-none focus:border-[#ffcc00] disabled:opacity-55"
        />
        <button
          id="chat-send-submit"
          type="submit"
          disabled={loading || !input.trim()}
          className="w-12 h-12 rounded-2xl bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-black hover:opacity-90 active:scale-95 flex items-center justify-center shrink-0 disabled:opacity-40"
        >
          <Send size={15} className="ml-0.5 fill-current" />
        </button>
      </form>

    </div>
  );
};
