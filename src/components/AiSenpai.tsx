/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSido } from '../context/SidoContext';
import { Sparkles, Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const AiSenpai: React.FC = () => {
  const { currentProfile } = useSido();

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        role: 'model',
        text: `أوهايو غوزايماس يا صديقي ${currentProfile.username}-تشان! 🌸🐉\n\nأنا **سينباي سيدو (Senpai Sido)**، مستشارك ومساعدك الأوتاكو الأسطوري الشاهد على كل تحف وعجائب الأنمي والدراما!\n\nقل لي... كيف هو مزاجك اليوم؟ أو ما هو تصنيف الأنمي الذي تحلم بمشاهدته الليلة؟ دعني أرسم لك دليلاً غنياً بالحماس! 🎌✨`
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto Scroll ref
  const autoScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    autoScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userQuery = inputText.trim();
    setInputText('');
    
    // Add User message
    const updatedMessages = [...messages, { role: 'user' as const, text: userQuery }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map chat messages history for context continuity
      const chatHistory = updatedMessages.slice(1, -1); // Skip first model greeting, exclude last user message

      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userQuery, chatHistory }),
      });

      const data = await response.json();
      
      // Add Model reply
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      console.error("Failed to query AI advisor:", err);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          text: "دايجوبو ديس كا؟ 😢 طاقة الأثير مجهدة مؤقتاً بسبب تداخل بوابات الرياتسو... يرجى معاودة المحاولة أو التحدث معي كالعادة بعد وهلة!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      {
        role: 'model',
        text: `أوهايو غوزايماس يا بطل! 🍥 دعنا نبدأ مغامرة أوتاكو جديدة تماماً. بماذا تود أن تهمس لي بخصوص ذوقك في الأنمي والمسلسلات اليوم؟ ⚔️`
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-lg mx-auto bg-[#120f22]/30 rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
      
      {/* 1. Header with clear button */}
      <div className="bg-purple-950/20 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-[#ffcc00] flex items-center justify-center text-black font-black text-sm">
            🐉
          </div>
          <div>
            <h3 className="text-xs font-black text-white flex items-center gap-1">
              <span>سينباي سيدو الذكي</span>
              <Sparkles size={10} className="text-[#ffcc00] fill-[#ffcc00]" />
            </h3>
            <span className="text-[9px] text-gray-500 font-medium">مستشار الأوتاكو والدراما التفاعلية</span>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={clearChatHistory}
          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 active:scale-95 transition-colors"
          title="مسح المحادثة وتجديد الطاقة"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* 2. Chat messages stage */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pr-2">
        {messages.map((msg, idx) => {
          const isModel = msg.role === 'model';
          return (
            <motion.div
              id={`chat-msg-${idx}`}
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 max-w-[85%] ${isModel ? 'self-start' : 'self-end flex-row-reverse ml-auto'}`}
            >
              {/* Profile indicator ball */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${isModel ? 'bg-[#ffcc00] text-black font-black' : 'bg-purple-600 text-white'}`}>
                {isModel ? '🐉' : <User size={10} />}
              </div>

              {/* Message bubble balloon */}
              <div className={`py-2.5 px-3.5 rounded-2xl text-[11px] leading-relaxed relative ${
                isModel 
                  ? 'bg-purple-950/10 border border-purple-950/20 text-gray-200 rounded-tr-none text-right font-medium' 
                  : 'bg-gradient-to-r from-yellow-500 to-[#ffcc00] text-[#07050f] rounded-tl-none text-right font-bold shadow'
              }`}>
                {msg.text.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className={line.trim() === '' ? 'h-2' : 'mt-1 first:mt-0'}>
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* AI Thinking/Querying Loader */}
        {loading && (
          <div className="flex gap-2 max-w-[85%] self-start animate-pulse">
            <div className="w-6 h-6 rounded-full bg-[#ffcc00] text-black flex items-center justify-center font-black text-[10px]">
              🐉
            </div>
            <div className="py-2 px-3 rounded-2xl rounded-tr-none bg-purple-950/10 border border-purple-950/20 text-[10px] text-gray-400 flex items-center gap-1.5 font-bold font-sans">
              <Loader2 className="animate-spin text-yellow-500" size={10} />
              <span>جاري صب تمائم الأنمي السحرية...</span>
            </div>
          </div>
        )}

        {/* Anchor point */}
        <div ref={autoScrollRef} />
      </div>

      {/* 3. Text Message input bar form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-purple-950/5 border-t border-white/5 flex gap-2">
        <input
          id="chat-input-text"
          type="text"
          placeholder="أدخل مزاجك.. مثال: أنمي أكشن ياباني حماسي وقوي!"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-[#07050f] border border-white/5 text-white placeholder-gray-600 text-[11px] font-bold focus:outline-none focus:border-[#ffcc00] disabled:opacity-50"
        />

        <button
          id="chat-send-btn"
          type="submit"
          disabled={!inputText.trim() || loading}
          className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40 shrink-0"
        >
          <Send size={14} className="fill-black ml-0.5" />
        </button>
      </form>

    </div>
  );
};
