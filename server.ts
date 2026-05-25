/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Database Storage Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interfaces
interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'user';
  points: number;
  avatar: string;
  created_at: string;
}

interface Anime {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  type: 'anime-subbed' | 'anime-dubbed' | 'movies' | 'turkish';
  language: string;
  badge: string;
  status?: 'completed' | 'ongoing';
}

interface Episode {
  id: string;
  anime_id: string;
  title: string;
  video_url: string;
  episode_number: number;
}

interface WatchlistItem {
  username: string;
  anime_id: string;
  type: 'fav' | 'later' | 'watched';
}

interface Suggestion {
  id: string;
  username: string;
  category: string;
  text: string;
  votes: number;
  voted_by: string[];
  created_at: string;
}

interface Comment {
  id: string;
  anime_id: string;
  username: string;
  text: string;
  created_at: string;
}

interface Database {
  users: User[];
  animeList: Anime[];
  episodes: Episode[];
  watchlist: WatchlistItem[];
  suggestions: Suggestion[];
  comments: Comment[];
}

// Bootstrap blank database JSON if empty
const bootstrapDb = (): Database => {
  return {
    users: [],
    animeList: [],
    episodes: [],
    watchlist: [],
    suggestions: [
      {
        id: "1",
        username: "محب المنصة",
        category: "تطوير عام",
        text: "نتمنى توفير سيرفرات سريعة وجودات متعددة للبث المباشر للأصدقاء!",
        votes: 5,
        voted_by: [],
        created_at: new Date().toISOString()
      }
    ],
    comments: []
  };
};

const readDb = (): Database => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const fresh = bootstrapDb();
      fs.writeFileSync(DB_PATH, JSON.stringify(fresh, null, 2), 'utf8');
      return fresh;
    }
    const text = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    console.error('Error reading DB:', err);
    return bootstrapDb();
  }
};

const writeDb = (db: Database) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
};

// Initialize Gemini SDK safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// --- API ROUTES ---

// 1. Authentication APIs
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'الرجاء إدخال اسم المستخدم وكلمة المرور' });
  }

  const db = readDb();
  const lowerUser = username.trim().toLowerCase();
  const userExists = db.users.some(u => u.username.toLowerCase() === lowerUser);

  if (userExists) {
    return res.status(400).json({ error: 'اسم المستخدم هذا مسجل مسبقاً' });
  }

  // The very first registered user becomes an admin automatically to control the website!
  const isFirstUser = db.users.length === 0;
  const role = isFirstUser ? 'admin' : 'user';

  const newUser: User = {
    id: Math.random().toString(36).substring(2, 9),
    username: username.trim(),
    password, // Store simply or encrypted
    role,
    points: 150, // Welcome points
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  // Strip password in response
  const { password: _, ...userSafe } = newUser;
  res.json({ success: true, user: userSafe });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'الرجاء إدخال اسم المستخدم وكلمة المرور' });
  }

  const db = readDb();
  const lowerUser = username.trim().toLowerCase();
  const found = db.users.find(u => u.username.toLowerCase() === lowerUser && u.password === password);

  if (!found) {
    return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  }

  const { password: _, ...userSafe } = found;
  res.json({ success: true, user: userSafe });
});

// Get user status/score
app.get('/api/users/:username', (req, res) => {
  const db = readDb();
  const found = db.users.find(u => u.username.toLowerCase() === req.params.username.toLowerCase());
  if (!found) {
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  }
  const { password: _, ...userSafe } = found;
  res.json(userSafe);
});

// Update user points (e.g. Daily reward or watching points)
app.post('/api/users/:username/reward', (req, res) => {
  const { amount, action } = req.body; // e.g. amount 50, action "daily-wheel"
  const db = readDb();
  const uIndex = db.users.findIndex(u => u.username.toLowerCase() === req.params.username.toLowerCase());
  if (uIndex === -1) {
    return res.status(404).json({ error: 'المستخدم غير موجود' });
  }

  db.users[uIndex].points = Math.max(0, db.users[uIndex].points + (amount || 0));
  writeDb(db);

  const { password: _, ...userSafe } = db.users[uIndex];
  res.json({ success: true, user: userSafe });
});

// 2. Anime & Catalog APIs
app.get('/api/anime', (req, res) => {
  const db = readDb();
  res.json(db.animeList);
});

// Admin-only: create new Anime catalog item
app.post('/api/anime', (req, res) => {
  const { name, description, image, type, language, badge, rating, status, requesterRole } = req.body;
  if (!name || !image || !type) {
    return res.status(400).json({ error: 'الحقول المطلوبة مفقودة' });
  }

  if (requesterRole !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح لك بإضافة أعمال جديدة' });
  }

  const db = readDb();
  const newAnime: Anime = {
    id: Math.random().toString(36).substring(2, 9),
    name: name.trim(),
    description: description || 'لا يوجد وصف حالياً لهذا العمل الفني المتميز.',
    image: image.trim(),
    rating: parseFloat(rating) || 8.5,
    type: type, // 'anime-subbed' | 'anime-dubbed' | 'movies' | 'turkish'
    language: language || 'مترجم للعربية',
    badge: badge || 'جديد',
    status: status || 'ongoing'
  };

  db.animeList.push(newAnime);
  writeDb(db);

  res.json({ success: true, anime: newAnime });
});

// Admin-only: delete an Anime catalog item (and associated episodes/comments)
app.delete('/api/anime/:id', (req, res) => {
  const { requesterRole } = req.body;
  if (requesterRole !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح لك بحذف أعمال' });
  }

  const db = readDb();
  db.animeList = db.animeList.filter(an => an.id !== req.params.id);
  db.episodes = db.episodes.filter(ep => ep.anime_id !== req.params.id);
  db.comments = db.comments.filter(com => com.anime_id !== req.params.id);
  db.watchlist = db.watchlist.filter(w => w.anime_id !== req.params.id);
  writeDb(db);

  res.json({ success: true });
});

// 3. Episodes APIs
app.get('/api/anime/:animeId/episodes', (req, res) => {
  const db = readDb();
  const list = db.episodes.filter(ep => ep.anime_id === req.params.animeId);
  // Sort by episode number
  list.sort((a, b) => a.episode_number - b.episode_number);
  res.json(list);
});

app.post('/api/episodes', (req, res) => {
  const { anime_id, title, video_url, episode_number, requesterRole } = req.body;
  if (!anime_id || !title || !video_url) {
    return res.status(400).json({ error: 'بيانات غير كافية لإنشاء حلقة' });
  }

  if (requesterRole !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح لك بإضافة حلقات' });
  }

  const db = readDb();
  const newEp: Episode = {
    id: Math.random().toString(36).substring(2, 9),
    anime_id,
    title,
    video_url,
    episode_number: parseInt(episode_number) || 1
  };

  db.episodes.push(newEp);
  writeDb(db);

  res.json({ success: true, episode: newEp });
});

// Admin-only: delete specific Episode
app.delete('/api/episodes/:id', (req, res) => {
  const { requesterRole } = req.body;
  if (requesterRole !== 'admin') {
    return res.status(403).json({ error: 'غير مصرح لك بحذف حلقات' });
  }

  const db = readDb();
  db.episodes = db.episodes.filter(ep => ep.id !== req.params.id);
  writeDb(db);

  res.json({ success: true });
});

// 4. Watchlist APIs
app.get('/api/users/:username/watchlist', (req, res) => {
  const db = readDb();
  const list = db.watchlist.filter(w => w.username.toLowerCase() === req.params.username.toLowerCase());
  res.json(list);
});

app.post('/api/watchlist', (req, res) => {
  const { username, anime_id, type } = req.body; // type: fav or later or watched
  if (!username || !anime_id || !type) {
    return res.status(400).json({ error: 'الحقول مفقودة' });
  }

  const db = readDb();
  // Check if exists
  const existingIndex = db.watchlist.findIndex(
    w => w.username.toLowerCase() === username.toLowerCase() && w.anime_id === anime_id
  );

  if (existingIndex !== -1) {
    // Update category type
    db.watchlist[existingIndex].type = type;
  } else {
    // Add new
    db.watchlist.push({ username, anime_id, type });
  }

  writeDb(db);
  res.json({ success: true });
});

app.delete('/api/watchlist', (req, res) => {
  const { username, anime_id } = req.body;
  const db = readDb();
  db.watchlist = db.watchlist.filter(
    w => !(w.username.toLowerCase() === username.toLowerCase() && w.anime_id === anime_id)
  );
  writeDb(db);
  res.json({ success: true });
});

// 5. Suggestions APIs
app.get('/api/suggestions', (req, res) => {
  const db = readDb();
  // Sort suggestions by votes descending
  const list = [...db.suggestions].sort((a, b) => b.votes - a.votes);
  res.json(list);
});

app.post('/api/suggestions', (req, res) => {
  const { username, category, text } = req.body;
  if (!username || !text) {
    return res.status(400).json({ error: 'محتوى الاقتراح فارغ!' });
  }

  const db = readDb();
  const newSuggestion: Suggestion = {
    id: Math.random().toString(36).substring(2, 9),
    username,
    category: category || 'عام',
    text,
    votes: 1,
    voted_by: [username],
    created_at: new Date().toISOString()
  };

  db.suggestions.push(newSuggestion);
  writeDb(db);
  res.json({ success: true, suggestion: newSuggestion });
});

app.post('/api/suggestions/:id/vote', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'اسم المستخدم مفقود للتصويت' });
  }

  const db = readDb();
  const sug = db.suggestions.find(s => s.id === req.params.id);
  if (!sug) {
    return res.status(404).json({ error: 'الاقتراح غير موجود' });
  }

  if (!sug.voted_by) {
    sug.voted_by = [];
  }

  const hasVoted = sug.voted_by.includes(username);
  if (hasVoted) {
    // Downvote/Cancel vote
    sug.voted_by = sug.voted_by.filter(u => u !== username);
    sug.votes = Math.max(0, sug.votes - 1);
  } else {
    // Upvote
    sug.voted_by.push(username);
    sug.votes += 1;
  }

  writeDb(db);
  res.json({ success: true, suggestion: sug });
});

// 6. Comments APIs
app.get('/api/anime/:animeId/comments', (req, res) => {
  const db = readDb();
  const list = db.comments.filter(c => c.anime_id === req.params.animeId);
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  res.json(list);
});

app.post('/api/comments', (req, res) => {
  const { anime_id, username, text } = req.body;
  if (!anime_id || !username || !text) {
    return res.status(400).json({ error: 'محتوى التعليق فارغ' });
  }

  const db = readDb();
  const newComment: Comment = {
    id: Math.random().toString(36).substring(2, 9),
    anime_id,
    username,
    text,
    created_at: new Date().toISOString()
  };

  db.comments.push(newComment);
  writeDb(db);

  res.json({ success: true, comment: newComment });
});

// 7. Sido AI Advisor with Gemini SDK
app.post('/api/gemini/recommend', async (req, res) => {
  const { prompt, chatHistory } = req.body;
  if (!prompt) {
    return res.json({ reply: 'تحدث معي يا صديقي! أخبرني باسم أنمي تحبه أو نوع تود رؤية توصيات بخصوصه. 🏮🐉' });
  }

  if (!ai) {
    // No API key fallback
    return res.json({
      reply: `مرحباً بك! طاقة الأثير مجهدة حالياً لعدم توفر مفتاح Gemini الذكي.\n\nتوصية بديلة سريعة:\nأنصحك حالياً بمشاهدة التحفة الفنية **"بطل الدرع (The Rising of the Shield Hero)"** أو أنمي المغامرات الرهيب **"قاتل الشياطين (Demon Slayer)"**! حافلان بالقتالات الأسطورية والعواطف العميقة ✨⚔️`
    });
  }

  try {
    // Format conversation history into guidelines array
    const systemPrompt = `You are "Sido Senpai (سينباي سيدو)", a super enthusiastic Anime and Drama assistant in a platform called 'SIDO (سيدو)'. Keep your language very warm, full of slang of otakus (like "أوهايو", "دايجوبو ديس كا", "باتوساي", etc.), and use Arabic. Reply in a well-formatted descriptive manner with bullet points. Suggest some great titles to watch.`;

    const contents = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      // Map history to standard contents parameter for generateContent ({ role: string, parts: { text: string }[] })
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8
      }
    });

    res.json({ reply: response.text || 'اعتذر يا أوتاكو، لم أفهم ذوقك بدقة. أعد صياغة مزاجك الحماسي وسأرشدك فوراً! 🍥🐉' });
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    res.json({
      reply: 'دايجوبو ديس كا؟ 😢 طاقة الأثير منقطعة مؤقتاً بسبب تداخل بوابات الرياتسو... يرجى معاودة سؤالي في أي لحظة!'
    });
  }
});

// Production serving / development Vite middleware integration
async function startServer() {
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
