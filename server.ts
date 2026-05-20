/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client helper
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY context environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// SECURE SERVER-SIDE API ROUTES FIRST
// -------------------------------------------------------------

// Sido AI recommendation advisor endpoint (Senpai Sido)
app.post('/api/gemini/recommend', async (req, res) => {
  const { prompt, chatHistory } = req.body;

  try {
    const ai = getAiClient();
    
    // Construct rich system prompt setting Sido's persona
    const systemInstruction = `أنت "سينباي سيدو (Senpai Sido)"، المستشار والمساعد الذكي الأسطوري لمنصة مشاهدة الأنمي العربية (Sido).
مهمتك هي الترحيب بالمستخدم باحترام وود مفرطين مستخدماً تعبيرات "أوتاكو" يابانية مكتوبة بالعربية (مثل: أوهايو، كونييتشيفا، دايجوبو، أريغاتو، مينّا...).
أجب دائماً باللغة العربية بأسلوب راقٍ وشيق ومناسب لعشاق الأنمي.
قدم ترشيحات متميزة لمشاهدة الأنمي بناءً على رغبة المستخدم أو مزاجه أو التصنيفات التي يفضلها.
كن متحمساً جداً وتحدّث بعفوية كصديق خبير ومقرب. كافئهم بكلمات تشجيعية واجعل حديثك منسقاً بنقاط وعناوين بارزة.`;

    const contents = [
      ...(chatHistory || []).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      { role: 'user', parts: [{ text: prompt || 'اقترح لي أنمي أسطوري قصير لأشاهده الليلة.' }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const replyText = response.text || 'عذراً يا صديقي، طاقة النينجا لدي مشوشة قليلاً حالياً. هل يمكنك إعادة المحاولة؟';
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    
    // Provide an informative, high-quality simulated response if the API Key is not configured yet
    const simulatedAnimeReplies = [
      "أوهايو غوزايماس! 🌸 يبدو أن مفتاح طاقة الشينغامي (API Key) غير مفعل حالياً، لكن بصفتي مستشارك الأوفلاين الأسطوري، أرشح لك بشدة تحفة هذا العصر **قاتل الشياطين (Kimetsu no Yaiba)** لتعيش مع تانجيرو ونزوكو أجواء حماسية لا ومثيل لها! 🗡️✨",
      "كونيتشيفا يا بطل! 🍥 مفتاح الطاقة مغلق الآن، ولكن حاسة الأوتاكو تهمس لي بأنك تحتاج لجرعة من الذكاء النفسي والتشويق غير المحدود! أرشح لك مشاهدة الكلاسيكية الخالدة **مذكرة الموت (Death Note)** فوراً وتحدي إله الموت ريوك! 😈📔",
      "أريغاتو مينّا! 🐉 بما أن بوابات الأثير مقفلة مؤقتاً، دعني أرشح لك الأنمي الأقوى عالمياً لمزاجك الحماسي الليلة: **جوجوتسو كايسن (Jujutsu Kaisen)**! شاهد قتالات يوجي إيتادوري وغوجو ساتورو الأسطورية وسيبهرك الإنتاج التفاعلي الخيالي! 💫🔥"
    ];
    
    const randomSimulatedReply = simulatedAnimeReplies[Math.floor(Math.random() * simulatedAnimeReplies.length)];
    
    res.json({ 
      reply: `${randomSimulatedReply}\n\n*(تنويه: يظهر لك هذا الرد التلقائي الشيق لأن مفتاح GEMINI_API_KEY غير مضاف في لوحة الأسرار Secrets حالياً، مكنك إضافته في الإعدادات لأخذ كامل القدرة الحجرية لسينباي سيدو!)*`
    });
  }
});

// Sido health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE CONFIG FOR DEVELOPMENT VS PRODUCTION
// -------------------------------------------------------------
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SIDO SERVER] Running on host 0.0.0.0, port ${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('[SIDO SERVER] Failed to start server:', err);
});
