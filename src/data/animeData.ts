/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Anime, Episode } from '../types';

export const POPULAR_ANIME: Anime[] = [
  {
    id: 1,
    name: "جوجوتسو كايسن - Jujutsu Kaisen",
    description: "في عالم تتغذى فيه الشياطين على البشر المجهلين، فقدت أجزاء من الشيطان الأسطوري والمهاب ريومين سوكونا وتشتتت. إذا استهلك أي شيطان أجزاء جسم سوكونا، فإن القوة التي يكتسبونها يمكن أن تدمر العالم الذي نعرفه. ولحسن الحظ، هناك مدرسة غامضة من سحرة جوجوتسو الذين يعيشون لحماية الوجود الحي من الموتى الأحياء!",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    type: "anime-subbed",
    language: "مترجم",
    year: "2020",
    rating: 8.7,
    episodes_count: 24,
    genre: "أكشن / خيال / شونين",
    badge: "🔥 رائج الآن",
    duration: "24 دقيقة"
  },
  {
    id: 2,
    name: "قاتل الشياطين - Kimetsu no Yaiba",
    description: "منذ العصور القديمة، وفرت الإشاعات عن الشياطين آكلة البشر الحافز للناس لعدم المغامرة في الليل. تقول الأسطورة أيضًا أن قاتل الشياطين يجوب الليل، ويصطاد هذه الشياطين المتعطشة للدماء. بالنسبة لـ تانجيرو كامادو، ستصبح هذه الشائعات قريباً واقعاً قاسياً يعصف بحياته...",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    type: "anime-dubbed",
    language: "مدبلج",
    year: "2019",
    rating: 8.9,
    episodes_count: 26,
    genre: "أكشن / مغامرة / شيطاني",
    badge: "⭐ مميز",
    duration: "23 دقيقة"
  },
  {
    id: 3,
    name: "هجوم العمالقة - Shingeki no Kyojin",
    description: "قبل مئات السنين، أوشك البشر على الفناء على يد العمالقة. عمالقة يبلغ طولهم عدة أمتار، يبدو أنهم يفتقرون للذكاء، يلتهمون البشر مسببين الرعب لهم. ومما يثير الاستغراب أنهم يفعلون ذلك من أجل المتعة لا كمصدر للغذاء. نجا عدد قليل من البشر وبنوا جدراناً عملاقة تحميهم.",
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&auto=format&fit=crop&q=80",
    type: "anime-subbed",
    language: "مترجم ومدبلج",
    year: "2013",
    rating: 9.1,
    episodes_count: 75,
    genre: "رعب / غموض / عسكري",
    badge: "🔥 أسطوري",
    duration: "24 دقيقة"
  },
  {
    id: 4,
    name: "ون بيس - One Piece",
    description: "الملك الراحل غول دي. روجر كشف قبل إعدامه عن وجود كنز أسطوري يدعى ون بيس، يقع في مكان ما في الجراند لاين. هذا الخبر دفع الآلاف من المغامرين لركوب البحار لبدء عصر القراصنة العظيم، باحثين عن الكنز ومطالبين بلقب ملك القراصنة القادم.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    type: "anime-subbed",
    language: "مترجم",
    year: "1999",
    rating: 9.2,
    episodes_count: 1090,
    genre: "شونين / مغامرات / كوميدي",
    badge: "🔥 مستمر",
    duration: "24 دقيقة"
  },
  {
    id: 5,
    name: "مذكرة الموت - Death Note",
    description: "ياغامي لايت هو طالب ذكي للغاية، يبغض الجريمة والفساد المتفشي في العالم. تنقلب حياته رأساً على عقب عندما يعثر على دفتر مذكرات غامض يحمل اسم 'مذكرة الموت'، أسقطها إله الموت ريوك. التعليمات تقول أن أي شخص يكتب اسمه في المذكرة يموت فوراً.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    type: "anime-subbed",
    language: "مترجم",
    year: "2006",
    rating: 9.0,
    episodes_count: 37,
    genre: "ذكاء / غموض / نفسي",
    badge: "⭐ كامل",
    duration: "23 دقيقة"
  },
  {
    id: 6,
    name: "المخطوفة - Spirited Away",
    description: "أثناء انتقال عائلتها إلى منزلهم الجديد، تضل عائلة تشيهيرو طريقها وتدخل نفقاً غامضاً يقودهم إلى عالم سحري غريب تسكنه الأرواح والوحوش. بعد تحول والديها إلى خنازير، يتعين على تشيهيرو البالغة من العمر 10 سنوات العمل في حمام عام تديره ساحرة شريرة لاستعادة والديها.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    type: "movies",
    language: "مترجم ومدبلج",
    year: "2001",
    rating: 8.6,
    episodes_count: 1,
    genre: "فيلم / خيال / عائلي",
    badge: "🏆 أوسكار",
    duration: "ساعتان و5 دقائق"
  },
  {
    id: 7,
    name: "قيامة أرطغرل - Resurrection Ertugrul",
    description: "مسلسل تركي تاريخي يحكي قصة البطل أرطغرل بن سليمان شاه، والد عثمان الأول مؤسس الدولة العثمانية. يعرض المسلسل صراعات قبيلة قايي المسلمة مع المغول والصليبيين والبيزنطيين، ورحلتهم الطويلة في البحث عن وطن آمن يستقرون فيه.",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&auto=format&fit=crop&q=80",
    type: "turkish",
    language: "مدبلج",
    year: "2014",
    rating: 8.8,
    episodes_count: 179,
    genre: "تاريخي / أكشن / دراما",
    badge: "👑 تركي شهير",
    duration: "45 دقيقة"
  },
  {
    id: 8,
    name: "ناروتو شيبودن - Naruto Shippuden",
    description: "بعد عامين ونصف من التدريب مع جيرايا، يعود الفتى ناروتو إلى قريته كونوها ليواصل سعيه لتحقيق حلمه بأن يصبح الهوكاجي وتأقلم أصدقائه مع التهديد المتصاعد لمنظمة الأكاتسكي التي تسعى لسرقة وحوش الجيدو المسجونة بداخل الجينشوريكي.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    type: "anime-dubbed",
    language: "مدبلج",
    year: "2007",
    rating: 8.6,
    episodes_count: 500,
    genre: "شونين / نينجا / قوة خارقة",
    badge: "✨ ذكريات",
    duration: "24 دقيقة"
  }
];

// Helper to generate mock episodes dynamically for any anime
export function generateEpisodes(animeId: number, count: number): Episode[] {
  const anime = POPULAR_ANIME.find(a => a.id === animeId);
  const animeName = anime ? anime.name.split(" - ")[0] : "أنمي";
  const numToGen = Math.min(count, 30); // limit load size, generate up to 30 episodes for interactive demo

  const episodes: Episode[] = [];
  for (let i = 1; i <= numToGen; i++) {
    episodes.push({
      id: animeId * 1000 + i,
      anime_id: animeId,
      episode_number: i,
      title: `الحلقة ${i} : بداية الطريق والقوة الجديدة لـ ${animeName}`,
      sources: [
        { label: "سيرفر سيدو السريع (FHD 1080p)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
        { label: "جوجل درايف الاحتياطي (HD 720p)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        { label: "سيرفر متعدد الجودات (SD 480p)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
      ],
      download_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    });
  }
  return episodes;
}
