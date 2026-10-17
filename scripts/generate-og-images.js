const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const OG_DIR = path.join(__dirname, '..', 'public', 'og');
if (!fs.existsSync(OG_DIR)) {
  fs.mkdirSync(OG_DIR, { recursive: true });
}

const CARDS_DATA = [
  {
    filename: 'default.png',
    badge: 'প্রামাণ্য ডিজিটাল বিশ্বকোষ ও গবেষণা পোর্টাল',
    title: 'ইসলাম',
    arabic: 'الإسلام',
    tagline: 'কুরআন, সহীহ সুন্নাহ ও সালাফে সালেহীনের বিশুদ্ধ মানহাজভিত্তিক প্রকাশনা',
    subtext: '৯টি শাস্ত্রীয় বিভাগ • ২৪২টি প্রামাণ্য ক্যাটেগরি • ৬৪ জেলার সালাতের সময়সূচি',
    citation: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  },
  {
    filename: 'home.png',
    badge: 'আন্তর্জাতিক সংস্করণ • প্রামাণ্য ইসলামিক জ্ঞানকোষ',
    title: 'ইসলাম',
    arabic: 'الإسلام',
    tagline: 'সত্য, প্রজ্ঞা ও শাশ্বত জীবনাদর্শের প্রামাণ্য ওয়েব পোর্টাল',
    subtext: 'তাফসীর • সহীহ হাদিস • নবী ও সাহাবীদের জীবনী • ফিকহী মাসআলা',
    citation: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  },
  {
    filename: 'allah.png',
    badge: 'ইসলামিক বিশ্বকোষ • প্রথম বিভাগ',
    title: 'আল্লাহ',
    arabic: 'الله جل جلاله',
    tagline: 'তাওহীদ, আসমাউল হুসনা (৯৯টি গুণবাচক নাম) ও সিফাত বিশ্বকোষ',
    subtext: 'রুবূবিয়্যাহ, উলূহিয়্যাহ ও বিশুদ্ধ আকীদার প্রামাণ্য গবেষণা প্রবন্ধমালা',
    citation: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
  },
  {
    filename: 'angels.png',
    badge: 'ইসলামিক বিশ্বকোষ • দ্বিতীয় বিভাগ',
    title: 'ফেরেশতা ও গায়েব জগত',
    arabic: 'الملائكة الكرام',
    tagline: 'নূরানী সৃষ্টি, ৪ জন প্রধান ফেরেশতা ও তাদের দায়িত্বের পূর্ণাঙ্গ বিবরণ',
    subtext: 'জিবরীল (আ.), মীকাঈল (আ.) ও আরশ বহনকারী ফেরেশতাগণের মর্যাদা',
    citation: 'الْحَمْدُ لِلَّهِ فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا',
  },
  {
    filename: 'quran.png',
    badge: 'ইসলামিক বিশ্বকোষ • তৃতীয় বিভাগ',
    title: 'পবিত্র কুরআনুল কারীম',
    arabic: 'القرآن الكريم',
    tagline: '১১৪টি পূর্ণাঙ্গ সূরা, শানে নুযূল, পটভূমি ও প্রামাণ্য তাফসীর গ্রন্থমালা',
    subtext: 'মাক্কী ও মাদানী সূরা বিভাজন • ৬,২৩৬টি আয়াতের শাব্দিক ও ভাবার্থ বিশ্লেষণ',
    citation: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
  },
  {
    filename: 'hadith.png',
    badge: 'ইসলামিক বিশ্বকোষ • চতুর্থ বিভাগ',
    title: 'সহীহ হাদিস ও সুন্নাহ',
    arabic: 'الحديث النبوي الشريف',
    tagline: 'সিহাহ সিত্তাহসহ ১৬টি আকর কিতাবের প্রামাণ্য সংকলন ও সনদ তাহকীক',
    subtext: 'সহীহ বুখারী • সহীহ মুসলিম • সুনান গ্রন্থসমূহ ও বিশুদ্ধ নবুওয়াতী সুন্নাহ',
    citation: 'وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا',
  },
  {
    filename: 'prophets.png',
    badge: 'ইসলামিক বিশ্বকোষ • পঞ্চম বিভাগ',
    title: 'নবী ও রাসূলগণ',
    arabic: 'قصص الأنبياء والمرسلين',
    tagline: 'কুরআনে বর্ণিত ২৫ জন পয়গম্বরের প্রামাণ্য ইতিহাস ও দাওয়াতী শিক্ষা',
    subtext: 'আদম (আ.) থেকে সর্বশ্রেষ্ঠ ও সর্বশেষ নবী মুহাম্মদ (সা.)-এর পবিত্র সিরাত',
    citation: 'وَلَقَدْ بَعَثْنَا فِي كُلِّ أُمَّةٍ رَّسُولًا أَنِ اعْبُدُوا اللَّهَ',
  },
  {
    filename: 'sahabi.png',
    badge: 'ইসলামিক বিশ্বকোষ • ষষ্ঠ বিভাগ',
    title: 'সাহাবায়ে কিরাম',
    arabic: 'الصحابة الكرام رضي الله عنهم',
    tagline: 'খোলাফায়ে রাশেদীন, আশারায়ে মুবাশশারা ও শ্রেষ্ঠ সাহাবীদের ঈমানী জীবনগাথা',
    subtext: 'মুহাজির ও আনসারগণের ত্যাগ, ইলম, জিহাদ ও চারিত্রিক উৎকর্ষের দলিল',
    citation: 'وَالسَّابِقُونَ الْأَوَّلُونَ مِنَ الْمُهَاجِرِينَ وَالْأَنصَارِ رَضِيَ اللَّهُ عَنْهُمْ',
  },
  {
    filename: 'fiqh.png',
    badge: 'ইসলামিক বিশ্বকোষ • সপ্তম বিভাগ',
    title: 'ইসলামী ফিকহ ও জীবন',
    arabic: 'الفقه الإسلامي والحياة',
    tagline: '১৪টি আকর গ্রন্থ, চার মাযহাবের ফাতওয়া ও দৈনন্দিন জীবনের শরীয়াহ বিধান',
    subtext: 'তাহারাত • সালাত • সাওম • যাকাত • হজ্ব • হালাল-হারাম ও সমকালীন মাসআলা',
    citation: 'يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ',
  },
  {
    filename: 'jannat.png',
    badge: 'ইসলামিক বিশ্বকোষ • অষ্টম বিভাগ',
    title: 'জান্নাত ও এর নেয়ামতসমূহ',
    arabic: 'الجنة ونعيمها',
    tagline: 'জান্নাতের ১২টি স্তর, ৮টি সুরম্য তোরণ ও মুত্তাকীদের চিরন্তন প্রতিদান',
    subtext: 'জান্নাতুল ফিরদাউস লাভের আমল, জান্নাতীদের মর্যাদা ও অফুরন্ত নিয়ামতের বিবরণ',
    citation: 'إِنَّ الْمُتَّقِينَ فِي جَنَّاتٍ وَنَعِيمٍ',
  },
  {
    filename: 'jahannam.png',
    badge: 'ইসলামিক বিশ্বকোষ • নবম বিভাগ',
    title: 'জাহান্নাম ও এর সতর্কবার্তা',
    arabic: 'جهنم وعذابها',
    tagline: 'জাহান্নামের ১২টি স্তর, ৭টি প্রবেশদ্বার ও জাহান্নামের আগুন থেকে বাঁচার আমল',
    subtext: 'কুরআন ও হাদিসের সতর্কবাণী • ক্ষমার নবুওয়াতী দোয়া ও আত্মশুদ্ধির পথ',
    citation: 'فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ',
  },
  {
    filename: 'prayer-times.png',
    badge: 'সালাতের ওয়াক্ত ইঞ্জিন • ইসলামিক ফাউন্ডেশন মানদণ্ড',
    title: 'সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার',
    arabic: 'أوقات الصلاة والتقويم الهجري',
    tagline: 'বাংলাদেশের ৬৪ জেলার আজকের পাঁচ ওয়াক্ত সালাত, সাহরী ও ইফতারের সময়সূচি',
    subtext: 'ফজর • যোহর • আসর (হানাফী ও শাফেয়ী) • মাগরিব • ইশা • তাহাজ্জুদ',
    citation: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
  },
];

function generateSvgCard(card) {
  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#083B2C" />
      <stop offset="50%" stop-color="#0B4F3B" />
      <stop offset="100%" stop-color="#05281E" />
    </linearGradient>

    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E8A86B" />
      <stop offset="50%" stop-color="#F2C597" />
      <stop offset="100%" stop-color="#B85D19" />
    </linearGradient>

    <!-- Subtle Islamic Geometric Pattern -->
    <pattern id="islamicGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="60" height="60" fill="none" stroke="#FAF8F5" stroke-opacity="0.03" stroke-width="1" />
      <circle cx="30" cy="30" r="15" fill="none" stroke="#FAF8F5" stroke-opacity="0.04" stroke-width="1" />
      <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" fill="none" stroke="#E8A86B" stroke-opacity="0.03" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGradient)" />
  <rect width="1200" height="630" fill="url(#islamicGrid)" />

  <!-- Outer Elegant Gold Border -->
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#B85D19" stroke-width="3" />
  <rect x="32" y="32" width="1136" height="566" fill="none" stroke="#E8A86B" stroke-width="1" stroke-opacity="0.6" />

  <!-- Corner Ornamental Accent Markers -->
  <g fill="#E8A86B">
    <!-- Top Left -->
    <rect x="20" y="20" width="12" height="12" />
    <rect x="36" y="36" width="6" height="6" />
    <!-- Top Right -->
    <rect x="1168" y="20" width="12" height="12" />
    <rect x="1158" y="36" width="6" height="6" />
    <!-- Bottom Left -->
    <rect x="20" y="598" width="12" height="12" />
    <rect x="36" y="588" width="6" height="6" />
    <!-- Bottom Right -->
    <rect x="1168" y="598" width="12" height="12" />
    <rect x="1158" y="588" width="6" height="6" />
  </g>

  <!-- Big Watermark Emblem in Background -->
  <g transform="translate(940, 315) scale(3.5)" opacity="0.07">
    <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="#FAF8F5" stroke-width="3" />
    <rect x="-30" y="-30" width="60" height="60" transform="rotate(45)" fill="none" stroke="#FAF8F5" stroke-width="3" />
    <circle cx="0" cy="0" r="14" fill="#FAF8F5" />
  </g>

  <!-- Top Badge Bar -->
  <g transform="translate(64, 75)">
    <!-- 8-pointed star emblem small -->
    <g transform="translate(18, 14) scale(0.5)">
      <rect x="-18" y="-18" width="36" height="36" fill="#B85D19" stroke="#E8A86B" stroke-width="2" />
      <rect x="-18" y="-18" width="36" height="36" transform="rotate(45)" fill="#B85D19" stroke="#E8A86B" stroke-width="2" />
      <circle cx="0" cy="0" r="6" fill="#FAF8F5" />
    </g>

    <rect x="42" y="0" width="460" height="28" fill="#083B2C" stroke="#176B52" stroke-width="1.5" rx="3" />
    <text x="56" y="19" font-family="'Hind Siliguri', -apple-system, sans-serif" font-size="14" font-weight="700" fill="#E8A86B" letter-spacing="1">
      ${card.badge}
    </text>
  </g>

  <!-- Central Header: Bengali Title + Arabic Calligraphy -->
  <g transform="translate(64, 185)">
    <text x="0" y="0" font-family="'Noto Serif Bengali', 'Hind Siliguri', serif" font-size="64" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">
      ${card.title}
    </text>
    <text x="0" y="65" font-family="'Amiri', 'Traditional Arabic', serif" font-size="44" font-weight="700" fill="#E8A86B" direction="rtl">
      ${card.arabic}
    </text>
  </g>

  <!-- Divider Line -->
  <line x1="64" y1="285" x2="680" y2="285" stroke="#B85D19" stroke-width="2.5" />
  <circle cx="688" cy="285" r="4" fill="#E8A86B" />

  <!-- Description / Tagline -->
  <g transform="translate(64, 335)">
    <text x="0" y="0" font-family="'Hind Siliguri', sans-serif" font-size="26" font-weight="700" fill="#FAF8F5">
      ${card.tagline}
    </text>
    <text x="0" y="42" font-family="'Hind Siliguri', sans-serif" font-size="20" font-weight="500" fill="#D5E6DF">
      ${card.subtext}
    </text>
  </g>

  <!-- Quranic / Hadith Citation Callout Box -->
  <g transform="translate(64, 430)">
    <rect x="0" y="0" width="1072" height="76" fill="#05281E" stroke="#176B52" stroke-width="1.5" rx="4" />
    <rect x="0" y="0" width="6" height="76" fill="#B85D19" />
    <text x="28" y="46" font-family="'Amiri', serif" font-size="26" font-weight="700" fill="#E8A86B" direction="rtl">
      ${card.citation}
    </text>
  </g>

  <!-- Bottom Authority Bar -->
  <g transform="translate(64, 560)">
    <text x="0" y="0" font-family="'Hind Siliguri', sans-serif" font-size="16" font-weight="700" fill="#FFFFFF">
      islam.org.bd
    </text>
    <text x="110" y="0" font-family="'Hind Siliguri', sans-serif" font-size="15" font-weight="500" fill="#8DA69C">
      • পবিত্র কুরআন ও সহীহ সুন্নাহর প্রামাণ্য প্রকাশনা
    </text>
    <text x="1072" y="0" font-family="'Hind Siliguri', sans-serif" font-size="14" font-weight="600" fill="#E8A86B" text-anchor="end">
      E-E-A-T তাহকীককৃত জ্ঞানকোষ
    </text>
  </g>
</svg>
`;
}

async function buildAllCards() {
  console.log('Generating 1200x630 OpenGraph cards...');
  for (const card of CARDS_DATA) {
    const svgContent = generateSvgCard(card);
    const outputPath = path.join(OG_DIR, card.filename);
    await sharp(Buffer.from(svgContent))
      .png({ quality: 95, compressionLevel: 8 })
      .toFile(outputPath);
    console.log(`✓ Generated ${card.filename} (1200x630)`);
  }
  console.log('All OpenGraph cards generated successfully in public/og/');
}

buildAllCards().catch((err) => {
  console.error('Error generating cards:', err);
  process.exit(1);
});
