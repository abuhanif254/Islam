const fs = require('fs');
const path = require('path');

// Read surahList
const surahScript = fs.readFileSync(path.join(__dirname, 'verify_surahs.js'), 'utf8');
const surahs = eval(surahScript.substring(surahScript.indexOf('const surahList = ['), surahScript.indexOf('console.log(')).replace('const surahList = ', ''));

// Helper to slugify
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// 1. ALLAH Categories
const allahCategories = [
  {
    id: 'tawheed-fundamentals',
    slug: 'tawheed-fundamentals',
    name: 'তাওহীদের মূলনীতি ও প্রকারভেদ',
    arabicName: 'أصول التوحيد وأقسامه',
    badge: 'আকীদা দর্শন',
    group: 'তাওহীদ ও আকীদা',
    articleCount: 14,
    shortDesc: 'তাওহীদুর রুবূবিয়্যাহ, উলূহিয়্যাহ ও আসমা ওয়াস সিফাতের বিশদ তাহকীকী বিশ্লেষণ।',
    metaInfo: 'তাওহীদ • ঈমান • আকীদা'
  },
  {
    id: 'asmaul-husna',
    slug: 'asmaul-husna',
    name: 'আসমাউল হুসনা (৯৯টি গুণবাচক নাম)',
    arabicName: 'الأسماء الحسنى',
    badge: '৯৯ নাম',
    group: 'আসমাউল হুসনা',
    articleCount: 99,
    shortDesc: 'মহান আল্লাহর প্রতিটি পবিত্র নামের অর্থ, তাৎপর্য, মুমিনের আত্মশুদ্ধি ও দোয়ায় প্রয়োগ।',
    metaInfo: 'আল্লাহর নাম • মারিফাত'
  },
  {
    id: 'ar-rahman-raheem',
    slug: 'ar-rahman-raheem',
    name: 'আর-রাহমান ও আর-রাহীম',
    arabicName: 'الرحمن الرحيم',
    badge: 'রহমত ও দয়া',
    group: 'আসমাউল হুসনা',
    articleCount: 12,
    shortDesc: 'পরম করুণাময় ও অসীম দয়ালু রবের সার্বজনীন ও বিশেষ করুণার রূপরেখা।',
    metaInfo: 'রহমত • সিফাত'
  },
  {
    id: 'al-malik-quddus',
    slug: 'al-malik-quddus',
    name: 'আল-মালিক ও আল-কুদ্দুস',
    arabicName: 'الملك القدوس',
    badge: 'সার্বভৌমত্ব',
    group: 'আসমাউল হুসনা',
    articleCount: 10,
    shortDesc: 'নিখিল জাহানের নিরঙ্কুশ বাদশাহ ও সকল ত্রুটি-বিচ্যুতিমুক্ত মহাপবিত্র সত্তা।',
    metaInfo: 'সার্বভৌমত্ব • পবিত্রতা'
  },
  {
    id: 'as-salam-mumin',
    slug: 'as-salam-mumin',
    name: 'আস-সালাম ও আল-মুমিন',
    arabicName: 'السلام المؤمن',
    badge: 'শান্তি ও নিরাপত্তা',
    group: 'আসমাউল হুসনা',
    articleCount: 8,
    shortDesc: 'শান্তিদাতা ও নিরাপত্তা প্রদানকারী রবের আশ্রয়ে মানব হৃদয়ের প্রশান্তি।',
    metaInfo: 'শান্তি • নিরাপত্তা'
  },
  {
    id: 'al-aziz-hakim',
    slug: 'al-aziz-hakim',
    name: 'আল-আযীয ও আল-হাকীম',
    arabicName: 'العزيز الحكيم',
    badge: 'পরাক্রম ও প্রজ্ঞা',
    group: 'আসমাউল হুসনা',
    articleCount: 11,
    shortDesc: 'মহাপরাক্রমশালী ও মহাপ্রজ্ঞাময় সত্তা যাঁর প্রতিটি হুকুমের পেছনে রয়েছে অসীম হিকমত।',
    metaInfo: 'শক্তি • প্রজ্ঞা'
  },
  {
    id: 'al-hayy-qayyum',
    slug: 'al-hayy-qayyum',
    name: 'আল-হাইয়্যুল কাইয়্যুম',
    arabicName: 'الحي القيوم',
    badge: 'চিরঞ্জীব সত্তা',
    group: 'আসমাউল হুসনা',
    articleCount: 9,
    shortDesc: 'চিরঞ্জীব ও নিখিল বিশ্বের ধারক — ইসমে আযমের অন্যতম মূল স্তম্ভ।',
    metaInfo: 'ইসমে আযম • আয়াতুল কুরসী'
  },
  {
    id: 'al-ghafur-wadud',
    slug: 'al-ghafur-wadud',
    name: 'আল-গফুর ও আল-ওয়াদূদ',
    arabicName: 'الغفور الودود',
    badge: 'ক্ষমা ও ভালোবাসা',
    group: 'আসমাউল হুসনা',
    articleCount: 15,
    shortDesc: 'অফুরন্ত ক্ষমাশীল ও বান্দার প্রতি অগাধ ভালোবাসাময় প্রতিপালক।',
    metaInfo: 'মাগফিরাত • প্রেম'
  },
  {
    id: 'divine-love-nearness',
    slug: 'divine-love-nearness',
    name: 'আল্লাহর নৈকট্য ও ভালোবাসা',
    arabicName: 'محبة الله والقرب منه',
    badge: 'ইহসান ও তাসাউফ',
    group: 'তাওহীদ ও আকীদা',
    articleCount: 16,
    shortDesc: 'বান্দার অন্তরে রবের প্রতি নিখাদ ভালোবাসা, আশা ও ভীতি সঞ্চারের মাধ্যম।',
    metaInfo: 'মুহাব্বত • আত্মশুদ্ধি'
  },
  {
    id: 'creation-wisdom',
    slug: 'creation-wisdom',
    name: 'সৃষ্টিতত্ত্ব, কুদরত ও হিকমত',
    arabicName: 'التفكر في خلق الله',
    badge: 'সৃষ্টি ও বিজ্ঞান',
    group: 'সৃষ্টিতত্ত্ব ও হিকমত',
    articleCount: 18,
    shortDesc: 'মহাবিশ্ব, ছায়াপথ, মানবদেহ ও প্রকৃতির নিখুঁত ভারসাম্যে আল্লাহর একত্বের সাক্ষ্য।',
    metaInfo: 'মহাবিশ্ব • চিন্তাশীলতা'
  }
];

// 2. ANGELS Categories (All Angels Names)
const angelCategories = [
  {
    id: 'jibrail-as',
    slug: 'jibrail-as',
    name: 'হযরত জিবরাঈল (আ.)',
    arabicName: 'جبريل عليه السلام',
    badge: 'রূহুল কুদুস',
    group: 'প্রধান ফেরেশতা',
    articleCount: 18,
    shortDesc: 'ওহীর বাহক, নবীগণের শিক্ষক এবং ফেরেশতাকুলের প্রধান সেনাপতি।',
    metaInfo: 'ওহী • রূহুল আমীন'
  },
  {
    id: 'mikail-as',
    slug: 'mikail-as',
    name: 'হযরত মীকাঈল (আ.)',
    arabicName: 'ميكائيل عليه السلام',
    badge: 'রিযিক ও প্রকৃতি',
    group: 'প্রধান ফেরেশতা',
    articleCount: 10,
    shortDesc: 'মেঘমালা, বৃষ্টিপাত ও নিখিল সৃষ্টির খাদ্য ও জীবিকা বণ্টনের দায়িত্বে নিয়োজিত।',
    metaInfo: 'বৃষ্টিপাত • জীবিকা'
  },
  {
    id: 'israfil-as',
    slug: 'israfil-as',
    name: 'হযরত ইসরাফীল (আ.)',
    arabicName: 'إسرافيل عليه السلام',
    badge: 'শিঙ্গা ফুৎকারক',
    group: 'প্রধান ফেরেশতা',
    articleCount: 11,
    shortDesc: 'মহাপ্রলয় ও কিয়ামত দিবসের পুনরুত্থানের জন্য শিঙ্গায় ফুৎকার প্রদানের দায়িত্বে নিয়োজিত।',
    metaInfo: 'কিয়ামত • সুর'
  },
  {
    id: 'malakul-mawt',
    slug: 'malakul-mawt',
    name: 'হযরত মালাকুল মাউত / আজরাঈল (আ.)',
    arabicName: 'ملك الموت عليه السلام',
    badge: 'মৃত্যুর ফেরেশতা',
    group: 'প্রধান ফেরেশতা',
    articleCount: 14,
    shortDesc: 'রূহ কবজ ও মানুষের মৃত্যুর দায়িত্বে নিয়োজিত সম্মানিত প্রধান ফেরেশতা।',
    metaInfo: 'মৃত্যু • পরকাল'
  },
  {
    id: 'munkar-nakir',
    slug: 'munkar-nakir',
    name: 'মুনকার ও নাকীর',
    arabicName: 'منكر ونكير',
    badge: 'কবরের সওয়ালকারী',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 8,
    shortDesc: 'কবরের প্রথম ঘাটিতে রবের পরিচয়, দ্বীন ও নবী সম্পর্কে তিন প্রশ্নের দায়িত্বপ্রাপ্ত ফেরেশতাদ্বয়।',
    metaInfo: 'কবর • বরযখ'
  },
  {
    id: 'malik-hell-guard',
    slug: 'malik-hell-guard',
    name: 'মালিক (জাহান্নামের প্রধান প্রহরী)',
    arabicName: 'مالك خازن النار',
    badge: 'জাহান্নামের রক্ষক',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 6,
    shortDesc: 'জাহান্নামের অগ্নি ও কঠোর শাস্তির ব্যবস্থাপনায় নিয়োজিত প্রধান ফেরেশতা।',
    metaInfo: 'জাহান্নাম • প্রহরী'
  },
  {
    id: 'ridwan-jannah-guard',
    slug: 'ridwan-jannah-guard',
    name: 'রিদওয়ান (জান্নাতের প্রধান প্রহরী)',
    arabicName: 'رضوان خازن الجنان',
    badge: 'জান্নাতের রক্ষক',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 7,
    shortDesc: 'জান্নাতের সুসংবাদপ্রাপ্ত মুমিনদের অভ্যর্থনা ও জান্নাতের তোরণ রক্ষক সম্মানিত ফেরেশতা।',
    metaInfo: 'জান্নাত • সালাম'
  },
  {
    id: 'kiraman-katibin',
    slug: 'kiraman-katibin',
    name: 'কিরামান কাতিবীন (আমল লিপিকারক)',
    arabicName: 'الكرام الكاتبون',
    badge: 'আমল লিপিকারক',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 9,
    shortDesc: 'মানুষের ডানে ও বামে সার্বক্ষণিক ভালো ও মন্দ কর্ম লিপিবদ্ধকারী সম্মানিত ফেরেশতাদ্বয়।',
    metaInfo: 'আমলনামা • হিসাব'
  },
  {
    id: 'hamalatul-arsh',
    slug: 'hamalatul-arsh',
    name: 'হামালাতুল আরশ (আরশ বহনকারী ফেরেশতা)',
    arabicName: 'حملة العرش',
    badge: 'আরশ বাহক',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 8,
    shortDesc: 'আল্লাহর মহান আরশ বহনকারী ও বিশ্বাসীদের ক্ষমার জন্য সার্বক্ষণিক দোয়ারত ফেরেশতামণ্ডলী।',
    metaInfo: 'আরশ • দুআ'
  },
  {
    id: 'harut-marut',
    slug: 'harut-marut',
    name: 'হারুত ও মারুত',
    arabicName: 'هاروت وماروت',
    badge: 'ব্যাবিলনের পরীক্ষা',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 6,
    shortDesc: 'ব্যাবিলনে মানুষদের পরীক্ষার উদ্দেশ্যে প্রেরিত ঐতিহাসিক দুই ফেরেশতা।',
    metaInfo: 'ব্যাবিলন • জাদু প্রতিরোধ'
  },
  {
    id: 'baytul-mamur-angels',
    slug: 'baytul-mamur-angels',
    name: 'বায়তুল মা\'মুর তাওয়াফকারী ফেরেশতাগণ',
    arabicName: 'ملائكة البيت المعمور',
    badge: 'সপ্তম আসমান',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 5,
    shortDesc: 'সপ্তম আকাশে বায়তুল মা\'মুরে প্রতিদিন ৭০,০০০ নতুন ফেরেশতার ধারাবাহিক ইবাদত ও তাওয়াফ।',
    metaInfo: 'তাওয়াফ • আসমান'
  },
  {
    id: 'zabaniyah',
    slug: 'zabaniyah',
    name: 'জাবানিয়াহ (জাহান্নামের কঠোর রক্ষী বাহিনী)',
    arabicName: 'الزبانية',
    badge: '১৯ প্রহরী',
    group: 'দায়িত্ব ও কর্মপরিধি',
    articleCount: 6,
    shortDesc: 'জাহান্নামে অবাধ্য পাপীদের নিয়ন্ত্রণকারী ১৯ জন মহা পরাক্রমশালী ও কঠোর ফেরেশতা।',
    metaInfo: 'জাহান্নাম • শাস্তি'
  }
];

// 3. QURAN Categories (All 114 Surahs)
const quranCategories = surahs.map((s) => {
  let id = `surah-${s.no}`;
  let slug = `surah-${s.no}`;
  if (s.no === 1) {
    id = 'surah-fatiha';
    slug = 'surah-fatiha';
  } else if (s.no === 2) {
    id = 'surah-baqarah';
    slug = 'surah-baqarah';
  }
  return {
    id,
    slug,
    name: `সূরা ${s.name} (আয়াত: ${s.ayahs})`,
    arabicName: `سورة ${s.ar}`,
    badge: `${s.type} • আয়াত ${s.ayahs}`,
    group: s.type === 'মাক্কী' ? 'মাক্কী সূরা' : 'মাদানী সূরা',
    articleCount: Math.max(3, Math.floor(s.ayahs / 10)),
    shortDesc: s.desc,
    metaInfo: `সূরা নং ${s.no} • ${s.type} • আয়াত: ${s.ayahs}`
  };
});

// 4. HADITH Categories (All Hadith Books)
const hadithCategories = [
  {
    id: 'sahih-bukhari',
    slug: 'sahih-bukhari',
    name: 'সহীহুল বুখারী (ইমাম বুখারী রহ.)',
    arabicName: 'صحيح البخاري',
    badge: 'আসাহহুল কুতুব',
    group: 'সিহাহ সিত্তাহ',
    articleCount: 45,
    shortDesc: 'কুরআনের পর সর্বাধিক বিশুদ্ধ গ্রন্থ। ৭,৫৬৩টি হাদিসের সংকলন ও গভীর ফিকহী অনুচ্ছেদ।',
    metaInfo: 'ইমাম বুখারী • সিহাহ সিত্তাহ'
  },
  {
    id: 'sahih-muslim',
    slug: 'sahih-muslim',
    name: 'সহীহ মুসলিম (ইমাম মুসলিম রহ.)',
    arabicName: 'صحيح مسلم',
    badge: 'উচ্চাঙ্গ সনদ',
    group: 'সিহাহ সিত্তাহ',
    articleCount: 38,
    shortDesc: 'অনুপম বিন্যাস, পুনরাবৃত্তিমুক্ত ধারাবাহিক সনদ ও বিশুদ্ধতার অনন্য মানদণ্ড।',
    metaInfo: 'ইমাম মুসলিম • সিহাহ সিত্তাহ'
  },
  {
    id: 'sunan-abu-dawud',
    slug: 'sunan-abu-dawud',
    name: 'সুনানে আবু দাউদ (ইমাম আবু দাউদ রহ.)',
    arabicName: 'سنن أبي داود',
    badge: 'আহকামের হাদিস',
    group: 'সিহাহ সিত্তাহ',
    articleCount: 28,
    shortDesc: 'আইন ও ফিকহী মাসআলা বিষয়ক প্রামাণ্য হাদিসের সবচেয়ে নির্ভরযোগ্য আধার।',
    metaInfo: 'ইমাম আবু দাউদ • সুনান'
  },
  {
    id: 'jami-at-tirmidhi',
    slug: 'jami-at-tirmidhi',
    name: 'জামে আত-তিরমিযী (ইমাম তিরমিযী রহ.)',
    arabicName: 'جامع الترمذي',
    badge: 'হাদিসের মান ও ফিকহ',
    group: 'সিহাহ সিত্তাহ',
    articleCount: 30,
    shortDesc: 'হাদিসের সহীহ-হাসান মান নির্ণয় এবং চার মাজহাবের ফুকাহাগণের মতামতের সারসংক্ষেপ।',
    metaInfo: 'ইমাম তিরমিযী • সুনান'
  },
  {
    id: 'sunan-an-nasai',
    slug: 'sunan-an-nasai',
    name: 'সুনানে আন-নাসায়ী (ইমাম নাসায়ী রহ.)',
    arabicName: 'سنن النسائي',
    badge: 'সূক্ষ্ম সনদ বিশ্লেষণ',
    group: 'সিহাহ সিত্তাহ',
    articleCount: 26,
    shortDesc: 'সনদ যাচাইয়ে ইমাম নাসায়ীর অনন্য সতর্কতা ও ইবাদতের ধারাবাহিক আহকাম।',
    metaInfo: 'ইমাম নাসায়ী • সুনান'
  },
  {
    id: 'sunan-ibn-majah',
    slug: 'sunan-ibn-majah',
    name: 'সুনানে ইবনে মাজাহ (ইমাম ইবনে মাজাহ রহ.)',
    arabicName: 'سنن ابن ماجه',
    badge: 'সিহাহ সিত্তাহ ষষ্ঠ',
    group: 'সিহাহ সিত্তাহ',
    articleCount: 22,
    shortDesc: 'চমৎকার ফিকহী তারতীব ও বহু অনন্য দুর্লভ হাদিসের সমৃদ্ধ সংকলন।',
    metaInfo: 'ইমাম ইবনে মাজাহ • সুনান'
  },
  {
    id: 'muwatta-imam-malik',
    slug: 'muwatta-imam-malik',
    name: 'মুওয়াত্তা ইমাম মালিক (ইমাম মালিক রহ.)',
    arabicName: 'موطأ الإمام مالك',
    badge: 'মদিনার ফিকহ ও হাদিস',
    group: 'নির্বাচিত সংকলন',
    articleCount: 25,
    shortDesc: 'ইসলামের ইতিহাসের সর্বপ্রথম সুবিন্যস্ত হাদিস ও ফিকহ সংকলন।',
    metaInfo: 'ইমাম মালিক • মদিনা'
  },
  {
    id: 'musnad-ahmad',
    slug: 'musnad-ahmad',
    name: 'মুসনাদে আহমাদ (ইমাম আহমাদ ইবনে হাম্বল রহ.)',
    arabicName: 'مسند الإمام أحمد',
    badge: 'হাদিস বিশ্বকোষ',
    group: 'নির্বাচিত সংকলন',
    articleCount: 35,
    shortDesc: 'প্রায় চল্লিশ হাজার হাদিস সম্বলিত সর্ববৃহৎ প্রামাণ্য হাদিস কোষ।',
    metaInfo: 'ইমাম আহমাদ • মুসনাদ'
  },
  {
    id: 'sunan-ad-darimi',
    slug: 'sunan-ad-darimi',
    name: 'সুনানে আদ-দারেমী (ইমাম দারেমী রহ.)',
    arabicName: 'سنن الدارمي',
    badge: 'উসূল ও সুন্নাহ',
    group: 'নির্বাচিত সংকলন',
    articleCount: 18,
    shortDesc: 'ইলমের মর্যাদা ও সুন্নাহ অনুসরণের মৌলিক নির্দেশনাময় বিখ্যাত সুনান গ্রন্থ।',
    metaInfo: 'ইমাম দারেমী • সুনান'
  },
  {
    id: 'sahih-ibn-hibban',
    slug: 'sahih-ibn-hibban',
    name: 'সহীহ ইবনে হিব্বান',
    arabicName: 'صحيح ابن حبان',
    badge: 'বিশুদ্ধ সংকলন',
    group: 'নির্বাচিত সংকলন',
    articleCount: 20,
    shortDesc: 'ইমাম ইবনে হিব্বান (রহ.) কর্তৃক সংকলিত উচ্চমানের সহীহ হাদিস গ্রন্থ।',
    metaInfo: 'ইবনে হিব্বান • সহীহ'
  },
  {
    id: 'sahih-ibn-khuzaymah',
    slug: 'sahih-ibn-khuzaymah',
    name: 'সহীহ ইবনে খুযায়মাহ',
    arabicName: 'صحيح ابن خزيمة',
    badge: 'নির্ভরযোগ্য সহীহ',
    group: 'নির্বাচিত সংকলন',
    articleCount: 16,
    shortDesc: 'ইমামুল আইম্মাহ ইবনে খুযায়মাহ (রহ.)-এর অতি নির্ভরযোগ্য বিশুদ্ধ হাদিস সংকলন।',
    metaInfo: 'ইবনে খুযায়মাহ • তাহকীক'
  },
  {
    id: 'mustadrak-al-hakim',
    slug: 'mustadrak-al-hakim',
    name: 'মুসতাদরাকে হাকিম (ইমাম হাকিম রহ.)',
    arabicName: 'المستدرك على الصحيحين',
    badge: 'বুখারী-মুসলিমের শর্ত',
    group: 'উসূলুল হাদিস',
    articleCount: 24,
    shortDesc: 'বুখারী ও মুসলিমের শর্তানুযায়ী সহীহ হওয়া সত্ত্বেও ছুটে যাওয়া হাদিসসমূহের সংকলন।',
    metaInfo: 'ইমাম হাকিম • মুসতাদরাক'
  },
  {
    id: 'riyadus-saliheen',
    slug: 'riyadus-saliheen',
    name: 'রিয়াদুস সালেহীন (ইমাম নববী রহ.)',
    arabicName: 'رياض الصالحين',
    badge: 'আমল ও আখলাক',
    group: 'উসূলুল হাদিস',
    articleCount: 32,
    shortDesc: 'বিশ্বজুড়ে সর্বাধিক পঠিত আত্মশুদ্ধি, চরিত্র গঠন ও দৈনন্দিন আমলের হাদিস সংকলন।',
    metaInfo: 'ইমাম নববী • আমল'
  },
  {
    id: 'bulughul-maram',
    slug: 'bulughul-maram',
    name: 'বুলুগুল মারাম (হাফেজ ইবনে হাজার রহ.)',
    arabicName: 'بلوغ المرام من أدلة الأحكام',
    badge: 'ফিকহী দলিলের আধার',
    group: 'উসূলুল হাদিস',
    articleCount: 25,
    shortDesc: 'শরীয়তের হুকুম-আহকামের মূল দলিল সম্বলিত আলেমদের পাঠ্য মৌলিক গ্রন্থ।',
    metaInfo: 'ইবনে হাজার আসকালানী • ফিকহ'
  },
  {
    id: 'mishkatul-masabih',
    slug: 'mishkatul-masabih',
    name: 'মিশকাতুল মাসাবীহ (খতীব তাবরিযী রহ.)',
    arabicName: 'مشكاة المصابيح',
    badge: 'দরসি হাদিস কোষ',
    group: 'উসূলুল হাদিস',
    articleCount: 30,
    shortDesc: 'মাদরাসা ও বিশ্ববিদ্যালয়ের সর্বোচ্চ পঠিত جامع হাদিস পাঠ্যবই।',
    metaInfo: 'খতীব তাবরিযী • মিশকাত'
  },
  {
    id: 'shuab-al-iman',
    slug: 'shuab-al-iman',
    name: 'শুআবুল ঈমান (ইমাম বায়হাকী রহ.)',
    arabicName: 'شعب الإيمان للبيهقي',
    badge: 'ঈমানের ৭৭ শাখা',
    group: 'উসূলুল হাদিস',
    articleCount: 20,
    shortDesc: 'ঈমানের সত্তরটিরও বেশি শাখার প্রামাণ্য হাদিস ও গভীর ব্যাখ্যা।',
    metaInfo: 'ইমাম বায়হাকী • ঈমান'
  }
];

// 5. PROPHETS Categories (All 25 Quranic Prophets)
const prophetList = [
  { id: 'prophet-muhammad', slug: 'prophet-muhammad', name: 'মুহাম্মদ (সা.)', ar: 'محمد صلى الله عليه وسلم', badge: 'খাতামুন নাবিয়্যীন', group: 'উলুল আযম (শ্রেষ্ঠ ৫ রাসূল)', desc: 'সর্বশ্রেষ্ঠ ও সর্বশেষ রাসূল, যাঁর ওপর কুরআন নাযিল হয়েছে এবং যিনি রহমাতুল্লিল আলামীন।' },
  { id: 'prophet-ibrahim', slug: 'prophet-ibrahim', name: 'ইবরাহীম (আ.)', ar: 'إبراهيم عليه السلام', badge: 'খলীলুল্লাহ', group: 'উলুল আযম (শ্রেষ্ঠ ৫ রাসূল)', desc: 'মুসলিম জাতির পিতা, একনিষ্ঠ তাওহীদের প্রতীক এবং কাবা শরীফের পুনর্নির্মাণকারী।' },
  { id: 'prophet-musa', slug: 'prophet-musa', name: 'মূসা (আ.)', ar: 'موسى عليه السلام', badge: 'কালীমুল্লাহ', group: 'উলুল আযম (শ্রেষ্ঠ ৫ রাসূল)', desc: 'বনী ইসরাঈলের নবী, যাঁর সাথে আল্লাহ সরাসরি কথা বলেছেন এবং যিনি তাওরাত প্রাপ্ত।' },
  { id: 'prophet-isa', slug: 'prophet-isa', name: 'ঈসা (আ.)', ar: 'عيسى عليه السلام', badge: 'রূহুল্লাহ ও মাসীহ', group: 'উলুল আযম (শ্রেষ্ঠ ৫ রাসূল)', desc: 'পবিত্র মারইয়ামের গর্ভে পিতা ছাড়া অলৌকিক জন্ম নেওয়া নবী, যিনি ইঞ্জীল প্রাপ্ত।' },
  { id: 'prophet-nuh', slug: 'prophet-nuh', name: 'নূহ (আ.)', ar: 'نوح عليه السلام', badge: 'প্রথম উলুল আযম', group: 'উলুল আযম (শ্রেষ্ঠ ৫ রাসূল)', desc: 'দ্বিতীয় মানবপিতা, যিনি সাড়ে নয়শত বছর ধৈর্যসহকারে মূর্তিপূজার বিরুদ্ধে দাওয়াত দিয়েছেন।' },
  { id: 'prophet-adam', slug: 'prophet-adam', name: 'আদম (আ.)', ar: 'آدم عليه السلام', badge: 'প্রথম মানব ও নবী', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'মানবজাতির আদি পিতা, যাঁকে আল্লাহ নিজ কুদরতি হাতে সৃষ্টি করেছেন এবং সেজদার নির্দেশ দিয়েছিলেন।' },
  { id: 'prophet-idris', slug: 'prophet-idris', name: 'ইদরীস (আ.)', ar: 'إدريس عليه السلام', badge: 'উচ্চ মর্যাদাপ্রাপ্ত', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'প্রথম কলম দিয়ে লেখা শুরুকারী এবং রবের বিশেষ রহমতে চতুর্থ আসমানে উন্নীত নবী।' },
  { id: 'prophet-hud', slug: 'prophet-hud', name: 'হূদ (আ.)', ar: 'هود عليه السلام', badge: 'আদ জাতির নবী', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'অহংকারী শক্তিশালী আদ জাতির প্রতি প্রেরিত তাওহীদের মহান বাণীবাহক।' },
  { id: 'prophet-salih', slug: 'prophet-salih', name: 'সালিহ (আ.)', ar: 'صالح عليه السلام', badge: 'সামূদ জাতির নবী', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'সামূদ জাতির পাহাড় কেটে তৈরি অট্টালিকা ও অলৌকিক উটনীর ঐতিহাসিক মুজিযার নবী।' },
  { id: 'prophet-lut', slug: 'prophet-lut', name: 'লূত (আ.)', ar: 'لوط عليه السلام', badge: 'সাদুমের নবী', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'অশ্লীলতা ও সমকামিতার বিরুদ্ধে দাঁড়িয়ে চরম সত্যের দাওয়াত দানকারী নবী।' },
  { id: 'prophet-ismail', slug: 'prophet-ismail', name: 'ইসমাঈল (আ.)', ar: 'إسماعيل عليه السلام', badge: 'জবীহুল্লাহ', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'পিতার আনুগত্যে কুরবানীর জন্য নিজেকে সঁপে দেওয়া আত্মত্যাগী নবী ও আরবের আদি পিতা।' },
  { id: 'prophet-ishaq', slug: 'prophet-ishaq', name: 'ইসহাক (আ.)', ar: 'إسحاق عليه السلام', badge: 'বার্ধক্যের নিয়ামত', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'ইবরাহীম (আ.) ও সারাহর ঘরে আল্লাহর রহমতের সুসংবাদপ্রাপ্ত পুণ্যবান নবী।' },
  { id: 'prophet-yaqub', slug: 'prophet-yaqub', name: 'ইয়াকূব (আ.)', ar: 'يعقوب عليه السلام (إسرائيل)', badge: 'ইসরাঈল', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'ইউসুফ (আ.)-এর বিরহে ধৈর্য ধারণকারী ও বনী ইসরাঈলের বারো গোত্রের পিতা।' },
  { id: 'prophet-yusuf', slug: 'prophet-yusuf', name: 'ইউসুফ (আ.)', ar: 'يوسف عليه السلام', badge: 'আহসানুল কাসাস', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'কূপের অন্ধকূপ থেকে মিশরের রাজপ্রাসাদের অর্থ ও খাদ্যমন্ত্রী হওয়া পুত-পবিত্র সত্যবাদী নবী।' },
  { id: 'prophet-ayyub', slug: 'prophet-ayyub', name: 'আইয়ূব (আ.)', ar: 'أيوب عليه السلام', badge: 'ধৈর্যের প্রতীক', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'দীর্ঘ অসুস্থতা ও দারিদ্র্যের মাঝেও রবের প্রশংসায় নিমগ্ন থাকা সর্বোচ্চ সবরকারী নবী।' },
  { id: 'prophet-shuaib', slug: 'prophet-shuaib', name: 'শুআইব (আ.)', ar: 'شعيب عليه السلام', badge: 'খতীবুল আম্বিয়া', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'মাদইয়ানবাসীদের ওজনে কারচুপি ও অর্থনৈতিক দুর্নীতির বিরুদ্ধে বিপ্লবী দাওয়াত দানকারী।' },
  { id: 'prophet-harun', slug: 'prophet-harun', name: 'হারূন (আ.)', ar: 'هارون عليه السلام', badge: 'মূসা (আ.)-এর ভাই', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'বাগ্মী, কোমল হৃদয়ের নবী যিনি মূসা (আ.)-এর সহযোগী হিসেবে বনী ইসরাঈলে প্রেরিত হন।' },
  { id: 'prophet-dhulkifl', slug: 'prophet-dhulkifl', name: 'যুল-কিফল (আ.)', ar: 'ذو الكفل عليه السلام', badge: 'অঙ্গীকার পূরণকারী', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'দিনভর রোজা ও রাতভর ইবাদতে কাটানো দায়িত্বশীল ও ন্যায়পরায়ণ নবী।' },
  { id: 'prophet-dawud', slug: 'prophet-dawud', name: 'দাউদ (আ.)', ar: 'داود عليه السلام', badge: 'যাবুর ও ন্যায়বিচার', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'যালূতকে হত্যাকারী, লোহাকে মোমের মতো গলানোর ক্ষমতাপ্রাপ্ত এবং সুমধুর কণ্ঠের নবী।' },
  { id: 'prophet-sulayman', slug: 'prophet-sulayman', name: 'সুলাইমান (আ.)', ar: 'سليمان عليه السلام', badge: 'অতুলনীয় সাম্রাজ্য', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'বায়ু, জিন, পশু-পাখির ভাষা বুঝার মুজিযাপ্রাপ্ত সুবিশাল সাম্রাজ্যের ন্যায়পরায়ণ শাসক।' },
  { id: 'prophet-ilyas', slug: 'prophet-ilyas', name: 'ইলিয়াস (আ.)', ar: 'إلياس عليه السلام', badge: 'বা\'ল পূজার বিরোধী', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'বনী ইসরাঈলে বা\'ল দেবতার পূজার বিরুদ্ধে একনিষ্ঠ তাওহীদের পতাকাবাহী নবী।' },
  { id: 'prophet-alyasa', slug: 'prophet-alyasa', name: 'আল-ইয়াসা (আ.)', ar: 'اليسع عليه السلام', badge: 'সৎকর্মশীল নবী', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'ইলিয়াস (আ.)-এর উত্তরসূরী হিসেবে তাওহীদের প্রচারকারী সম্মানিত নবী।' },
  { id: 'prophet-yunus', slug: 'prophet-yunus', name: 'ইউনুস (আ.)', ar: 'يونس عليه السلام', badge: 'যুন-নূন (মাছের পেটে)', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'নিনেভা নগরীর নবী যিনি গভীর সমুদ্রের তলে মাছের পেটে বসে বিখ্যাত তাসবীহ পাঠ করেছিলেন।' },
  { id: 'prophet-zakariya', slug: 'prophet-zakariya', name: 'যাকারিয়া (আ.)', ar: 'زكريا عليه السلام', badge: 'মারইয়ামের অভিভাবক', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'বায়তুল মুকাদ্দাসের খিদমতগার ও বার্ধক্যে ইয়াহইয়া (আ.)-এর জন্মলাভকারী শহীদ নবী।' },
  { id: 'prophet-yahya', slug: 'prophet-yahya', name: 'ইয়াহইয়া (আ.)', ar: 'يحيى عليه السلام', badge: 'শৈশবেই প্রজ্ঞাবান', group: 'বনী ইসরাঈল ও অন্যান্য নবী', desc: 'আল্লাহভীতি, কোমলতা ও সত্যের পক্ষে অবিচল থাকার কারণে জীবন উৎসর্গকারী নবী।' }
];

const prophetCategories = prophetList.map((p, idx) => ({
  id: p.id,
  slug: p.slug,
  name: `হযরত ${p.name}`,
  arabicName: p.ar,
  badge: p.badge,
  group: p.group,
  articleCount: idx === 0 ? 25 : 12,
  shortDesc: p.desc,
  metaInfo: `নবী ক্রম #${idx + 1} • ${p.badge}`
}));

// 6. SAHABI Categories (Prominent Companions)
const sahabiList = [
  { id: 'abu-bakr-ra', slug: 'abu-bakr-ra', name: 'আবু বকর সিদ্দিক (রা.)', ar: 'أبو بكر الصديق رضي الله عنه', badge: 'প্রথম খলীফা ও আস-সিদ্দিক', group: 'খুলাফায়ে রাশেদীন', desc: 'নবীজির হিজরতের সাথী, উম্মতের সর্বশ্রেষ্ঠ ব্যক্তি এবং কুরআন সংকলনের ঐতিহাসিক রূপকার।' },
  { id: 'umar-ibn-khattab-ra', slug: 'umar-ibn-khattab-ra', name: 'ওমর ইবনুল খাত্তাব (রা.)', ar: 'عمر بن الخطاب رضي الله عنه', badge: 'দ্বিতীয় খলীফা ও আল-ফারুক', group: 'খুলাফায়ে রাশেদীন', desc: 'সত্য ও মিথ্যার পার্থক্যকারী, অর্ধ পৃথিবীর ইনসাফভিত্তিক রাষ্ট্রনায়ক ও সোনালী বিচারক।' },
  { id: 'uthman-ibn-affan-ra', slug: 'uthman-ibn-affan-ra', name: 'উসমান ইবনে আফফান (রা.)', ar: 'عثمان بن عفان رضي الله عنه', badge: 'তৃতীয় খলীফা ও যুন্নুরাইন', group: 'খুলাফায়ে রাশেদীন', desc: 'দুই নূরের অধিকারী, লাজুকতার প্রতীক এবং পবিত্র কুরআনের প্রামাণ্য মুসহাফ বিশ্বব্যাপী প্রেরণকারী।' },
  { id: 'ali-ibn-abi-talib-ra', slug: 'ali-ibn-abi-talib-ra', name: 'আলী ইবনে আবী তালিব (রা.)', ar: 'علي بن أبي طالب رضي الله عنه', badge: 'চতুর্থ খলীফা ও আসাদুল্লাহ', group: 'খুলাফায়ে রাশেদীন', desc: 'আল্লাহর সিংহ, খায়বারের বিজয়ী মহাবীর এবং জ্ঞানের নগরীর সিংহদ্বার।' },
  { id: 'talha-ibn-ubaydillah-ra', slug: 'talha-ibn-ubaydillah-ra', name: 'তালহা ইবনে উবায়দুল্লাহ (রা.)', ar: 'طلحة بن عبيد الله رضي الله عنه', badge: 'জীবন্ত শহীদ', group: 'আশারায়ে মুবাশশারাহ', desc: 'উহুদের যুদ্ধে তীর নিজের হাতে বুক পেতে গ্রহণকারী মহান বীর।' },
  { id: 'zubayr-ibn-alawwam-ra', slug: 'zubayr-ibn-alawwam-ra', name: 'যুবাইর ইবনুল আওয়াম (রা.)', ar: 'الزبير بن العوام رضي الله عنه', badge: 'হাওয়ারিয়্যুর রাসূল', group: 'আশারায়ে মুবাশশারাহ', desc: 'ইসলামের প্রথম তরবারি উত্তোলনকারী এবং রাসূলুল্লাহ (সা.)-এর পরম বিশ্বস্ত সঙ্গী।' },
  { id: 'abdur-rahman-ibn-awf-ra', slug: 'abdur-rahman-ibn-awf-ra', name: 'আব্দুর রহমান ইবনে আউফ (রা.)', ar: 'عبد الرحمن بن عوف رضي الله عنه', badge: 'উদার জান্নাতী ব্যবসায়ী', group: 'আশারায়ে মুবাশশারাহ', desc: 'ব্যবসায়ের বরকত ও কোটি কোটি স্বর্ণমুদ্রা আল্লাহর রাস্তায় অকাতরে দানকারী সাহাবী।' },
  { id: 'sad-ibn-abi-waqqas-ra', slug: 'sad-ibn-abi-waqqas-ra', name: 'সা\'দ ইবনে আবী ওয়াক্কাস (রা.)', ar: 'سعد بن أبي وقاص رضي الله عنه', badge: 'মুস্তাজাবুদ দাওয়াহ', group: 'আশারায়ে মুবাশশারাহ', desc: 'প্রথম তীর নিক্ষেপকারী সাহাবী, কাদিসিয়ার পারস্য বিজয়ী সেনাপতি ও দোয়াকবুলপ্রাপ্ত।' },
  { id: 'said-ibn-zayd-ra', slug: 'said-ibn-zayd-ra', name: 'সাঈদ ইবনে যায়েদ (রা.)', ar: 'سعيد بن زيد رضي الله عنه', badge: 'প্রাথমিক ঈমানদার', group: 'আশারায়ে মুবাশশারাহ', desc: 'ওমর (রা.)-এর ভগ্নিপতি ও মক্কার দারুল আরকামের শুরুর দিকের জান্নাতের সুসংবাদপ্রাপ্ত।' },
  { id: 'abu-ubaydah-ibn-aljarrah-ra', slug: 'abu-ubaydah-ibn-aljarrah-ra', name: 'আবু উবাইদাহ ইবনুল জাররাহ (রা.)', ar: 'أبو عبيدة بن الجراح رضي الله عنه', badge: 'আমীনুল উম্মাহ', group: 'আশারায়ে মুবাশশারাহ', desc: 'এই উম্মতের পরম বিশ্বস্ত ব্যক্তি এবং সিরিয়া অভিযানের প্রধান সেনাপতি।' },
  { id: 'bilal-ibn-rabah-ra', slug: 'bilal-ibn-rabah-ra', name: 'বেলাল ইবনে রাবাহ (রা.)', ar: 'بلال بن رباح رضي الله عنه', badge: 'মুয়াযযিনুর রাসূল', group: 'মুহাজির ও আনসার', desc: 'উত্তপ্ত মরুভূমিতে আহাদ আহাদ বলে ঈমানে অটল থাকা কা\'বার ছাদের প্রথম মুয়াযযিন।' },
  { id: 'khalid-bin-walid-ra', slug: 'khalid-bin-walid-ra', name: 'খালেদ বিন ওয়ালীদ (রা.)', ar: 'خالد بن الوليد رضي الله عنه', badge: 'সাইফুল্লাহ (আল্লাহর তরবারি)', group: 'মুহাজির ও আনসার', desc: 'জীবনের কোনো যুদ্ধে পরাজিত না হওয়া ইসলামের অপরাজেয় সর্বাধিনায়ক।' },
  { id: 'salman-al-farsi-ra', slug: 'salman-al-farsi-ra', name: 'সালমান ফারসী (রা.)', ar: 'سلمان الفارسي رضي الله عنه', badge: 'সত্যসন্ধানী পণ্ডিত', group: 'মুহাজির ও আনসার', desc: 'খন্দকের যুদ্ধে পরিখা খননের সামরিক দূরদর্শী পরামর্শক ও আহলে বাইতের সম্মানিত সদস্য।' },
  { id: 'abu-dharr-al-ghifari-ra', slug: 'abu-dharr-al-ghifari-ra', name: 'আবু যার গিফারী (রা.)', ar: 'أبو ذر الغفاري رضي الله عنه', badge: 'দরিদ্রের কণ্ঠস্বর', group: 'মুহাজির ও আনসার', desc: 'চরম সত্যবাদী, দুনিয়াবিমুখ এবং সাদাসিধে জীবনের প্রতীক সাহাবী।' },
  { id: 'ammar-ibn-yasir-ra', slug: 'ammar-ibn-yasir-ra', name: 'আম্মার ইবনে ইয়াসির (রা.)', ar: 'عمار بن ياسر رضي الله عنه', badge: 'ঈমানের খাঁটি প্রতীক', group: 'মুহাজির ও আনসার', desc: 'প্রথম শহীদ পিতা-মাতার সন্তান যাঁর ঈমানকে স্বয়ং আল্লাহ পাক কুরআনে প্রশংসা করেছেন।' },
  { id: 'abdullah-ibn-masud-ra', slug: 'abdullah-ibn-masud-ra', name: 'আব্দুল্লাহ ইবনে মাসউদ (রা.)', ar: 'عبد الله بن مسعود رضي الله عنه', badge: 'শ্রেষ্ঠ ফকীহ ও কারী', group: 'মুহাজির ও আনসার', desc: 'রাসূলুল্লাহ (সা.)-এর কণ্ঠের মতো নিখুঁত তিলাওয়াতকারী ও কুফার ফিকহ ধারার ভিত্তিপ্রস্তর।' },
  { id: 'abdullah-ibn-abbas-ra', slug: 'abdullah-ibn-abbas-ra', name: 'আব্দুল্লাহ ইবনে আব্বাস (রা.)', ar: 'عبد الله بن عباس رضي الله عنه', badge: 'মুফাসসিরুল কুরআন', group: 'মুহাজির ও আনসার', desc: 'কুরআনের শ্রেষ্ঠ ব্যাখ্যাদাতা ও রাসূলুল্লাহ সা.-এর দোয়াপ্রাপ্ত হিবরুল উম্মাহ।' },
  { id: 'abdullah-ibn-umar-ra', slug: 'abdullah-ibn-umar-ra', name: 'আব্দুল্লাহ ইবনে ওমর (রা.)', ar: 'عبد الله بن عمر رضي الله عنه', badge: 'সুন্নাহর নিখুঁত অনুসারী', group: 'মুহাজির ও আনসার', desc: 'নবীজির প্রতিটি পদক্ষেপ ও সুন্নাহ হুবহু অনুসরণে প্রবাদতুল্য আবেদ সাহাবী।' },
  { id: 'anas-ibn-malik-ra', slug: 'anas-ibn-malik-ra', name: 'আনাস ইবনে মালিক (রা.)', ar: 'أنس بن مالك رضي الله عنه', badge: 'খিদমতগার সাহাবী', group: 'মুহাজির ও আনসার', desc: 'দশ বছর নবীজি (সা.)-এর ব্যক্তিগত খিদমতে নিয়োজিত থাকা শীর্ষ হাদিস বর্ণনাকারী।' },
  { id: 'abu-hurairah-ra', slug: 'abu-hurairah-ra', name: 'আবু হুরায়রা (রা.)', ar: 'أبو هريرة رضي الله عنه', badge: 'সর্বোচ্চ হাদিস বর্ণনাকারী', group: 'মুহাজির ও আনসার', desc: 'আসহাবে সুফফার শীর্ষ ছাত্র যিনি ৫,৩৭৪টি হাদিস উম্মতের কাছে পৌঁছে দিয়েছেন।' },
  { id: 'muadh-ibn-jabal-ra', slug: 'muadh-ibn-jabal-ra', name: 'মুআজ ইবনে জাবাল (রা.)', ar: 'معاذ بن جبل رضي الله عنه', badge: 'হালাল-হারামের শ্রেষ্ঠ জ্ঞানী', group: 'মুহাজির ও আনসার', desc: 'কিয়ামতের দিন আলেমগণের অগ্রভাগে এক ধনুক ব্যবধানে এগিয়ে থাকা মহান ফকীহ।' },
  { id: 'hamzah-ibn-abdul-muttalib-ra', slug: 'hamzah-ibn-abdul-muttalib-ra', name: 'হামযাহ ইবনে আব্দুল মুত্তালিব (রা.)', ar: 'حمزة بن عبد المطلب رضي الله عنه', badge: 'সাইয়্যিদুশ শুহাদা', group: 'মুহাজির ও আনসার', desc: 'উহুদের বীর সেনানী, নবীজির প্রিয় চাচা ও শহীদগণের চিরন্তন সরদার।' },
  { id: 'musab-ibn-umayr-ra', slug: 'musab-ibn-umayr-ra', name: 'মুসআব ইবনে উমায়ের (রা.)', ar: 'مصعب بن عمير رضي الله عنه', badge: 'মদিনার প্রথম দাঈ', group: 'মুহাজির ও আনসার', desc: 'বিলাসী জীবন ত্যাগ করে ইসলাম গ্রহণকারী ও মদিনায় ইসলামের ভিত্তি স্থাপনকারী শহীদ।' },
  { id: 'sad-ibn-muadh-ra', slug: 'sad-ibn-muadh-ra', name: 'সা\'দ ইবনে মুআজ (রা.)', ar: 'سعد بن معاذ رضي الله عنه', badge: 'আরশ কাঁপানো বীর', group: 'মুহাজির ও আনসার', desc: 'আওস গোত্রের নেতা যাঁর শাহাদাতে মহান আল্লাহর আরশ প্রকম্পিত হয়েছিল।' },
  { id: 'khadijah-bint-khuwaylid-ra', slug: 'khadijah-bint-khuwaylid-ra', name: 'খাদিজাতুল কুবরা (রা.)', ar: 'خديجة بنت خويلد رضي الله عنها', badge: 'প্রথম মুসলিম ও উম্মুল মুমিনীন', group: 'মুহাজির ও আনসার', desc: 'ওহী নাযিলের চরম সংকটকালে নবীজির একমাত্র সান্ত্বনা ও রবের পক্ষ থেকে সালামপ্রাপ্ত নারী।' },
  { id: 'aisha-bint-abi-bakr-ra', slug: 'aisha-bint-abi-bakr-ra', name: 'আয়েশা সিদ্দিকা (রা.)', ar: 'عائشة بنت أبي بكر رضي الله عنها', badge: 'উম্মুল মুমিনীন ও শীর্ষ ফকীহা', group: 'মুহাজির ও আনসার', desc: 'উম্মতের শীর্ষ নারী ফকীহা যিনি ইসলামের দুই সহস্রাধিক হাদিস সংরক্ষণ করেছেন।' },
  { id: 'fatimatuz-zahra-ra', slug: 'fatimatuz-zahra-ra', name: 'ফাতিমাতুজ জাহরা (রা.)', ar: 'فاطمة الزهراء رضي الله عنها', badge: 'জান্নাতী নারীদের নেত্রী', group: 'মুহাজির ও আনসার', desc: 'নবীজি (সা.)-এর কলিজার টুকরা ও জান্নাতের সকল সম্মানিত নারীদের নেত্রী।' }
];

const sahabiCategories = sahabiList.map((s, idx) => ({
  id: s.id,
  slug: s.slug,
  name: `হযরত ${s.name}`,
  arabicName: s.ar,
  badge: s.badge,
  group: s.group,
  articleCount: idx < 4 ? 20 : 10,
  shortDesc: s.desc,
  metaInfo: `সাহাবী ক্রম #${idx + 1} • ${s.badge}`
}));

// 7. FIQH Categories (All Fiqh Books)
const fiqhCategories = [
  {
    id: 'al-hidayah',
    slug: 'al-hidayah',
    name: 'আল-হিদায়া (ইমাম বুরহানুদ্দীন আল-মারগীনানী)',
    arabicName: 'الهداية شرح بداية المبتدي',
    badge: 'হানাফী ফিকহ ভিত্তি',
    group: 'ইবাদত',
    articleCount: 30,
    shortDesc: 'হানাফী ফিকহের সবচেয়ে প্রভাবশালী গ্রন্থ, যা দলিলের গভীরতা ও যৌক্তিক বিন্যাসের জন্য অতুলনীয়।',
    metaInfo: 'ইমাম মারগীনানী • হানাফী'
  },
  {
    id: 'fatawa-alamgiri',
    slug: 'fatawa-alamgiri',
    name: 'ফাতাওয়ায়ে হিন্দিয়া / আলমগীরী',
    arabicName: 'الفتاوى الهندية (العالمكيرية)',
    badge: 'উপমহাদেশীয় ফতোয়া বিশ্বকোষ',
    group: 'অর্থনীতি ও মুয়ামালাত',
    articleCount: 40,
    shortDesc: 'বাদশাহ আওরঙ্গজেবের নির্দেশে ৫০০ শীর্ষ ফকীহ আলেম কর্তৃক প্রণীত বিশাল ইসলামী আইনের বিশ্বকোষ।',
    metaInfo: '৫০০ ফকীহ বোর্ড • আইনকোষ'
  },
  {
    id: 'raddul-muhtar',
    slug: 'raddul-muhtar',
    name: 'রদ্দুল মুহতার / ফাতাওয়ায়ে শামী (ইমাম ইবনে আবিদীন)',
    arabicName: 'رد المحتار على الدر المختار',
    badge: 'চূড়ান্ত ফতোয়ার আধার',
    group: 'পারিবারিক ও সামাজিক',
    articleCount: 35,
    shortDesc: 'হানাফী মাযহাবের যেকোনো চূড়ান্ত ফতোয়া নির্ধারণের ক্ষেত্রে সর্বাধিক নির্ভরযোগ্য ও স্বীকৃত গ্রন্থ।',
    metaInfo: 'আল্লামা ইবনে আবিদীন • ফতোয়া'
  },
  {
    id: 'al-umm',
    slug: 'al-umm',
    name: 'আল-উম্ম (ইমাম শাফেয়ী রহ.)',
    arabicName: 'كتاب الأم للإمام الشافعي',
    badge: 'শাফেয়ী মাযহাব মূল',
    group: 'ইবাদত',
    articleCount: 25,
    shortDesc: 'ইমাম শাফেয়ী (রহ.)-এর সরাসরি রচিত শাফেয়ী ফিকহ ও উসূলের মূল উৎস।',
    metaInfo: 'ইমাম শাফেয়ী • উসূল'
  },
  {
    id: 'al-majmu',
    slug: 'al-majmu',
    name: 'আল-মাজমূ শরহুল মুহাযযাব (ইমাম নববী রহ.)',
    arabicName: 'المجموع شرح المهذب',
    badge: 'তুলনামূলক ফিকহ',
    group: 'ইবাদত',
    articleCount: 32,
    shortDesc: 'সকল মাযহাবের তুলনামূলক দলিল পর্যালোচনা ও ফিকহ শাস্ত্রের এক অনন্য রত্নভাণ্ডার।',
    metaInfo: 'ইমাম নববী • তুলনামূলক ফিকহ'
  },
  {
    id: 'al-mudawwanah',
    slug: 'al-mudawwanah',
    name: 'আল-মুদাওয়ানাতুল কুবরা (ইমাম সাহনূন)',
    arabicName: 'المدونة الكبرى',
    badge: 'মালিকী মাযহাব',
    group: 'অর্থনীতি ও মুয়ামালাত',
    articleCount: 20,
    shortDesc: 'ইমাম মালিক (রহ.)-এর শীর্ষ ছাত্র ইবনুল কাসিমের মতামতের ভিত্তিতে সংকলিত মালিকী ফিকহের মূল ভিত্তি।',
    metaInfo: 'ইমাম সাহনূন • মালিকী'
  },
  {
    id: 'bidayat-al-mujtahid',
    slug: 'bidayat-al-mujtahid',
    name: 'বিদায়াতুল মুজতাহিদ (ইমাম ইবনে রুশদ রহ.)',
    arabicName: 'بداية المجتهد ونهاية المقتصد',
    badge: 'ইখতিলাফ ও যুক্তি',
    group: 'পারিবারিক ও সামাজিক',
    articleCount: 28,
    shortDesc: 'ফুকাহাদের মতভেদের কারণ ও দলিলের তুলনামূলক যৌক্তিক বিশ্লেষণ।',
    metaInfo: 'ইবনে রুশদ • ইখতিলাফ'
  },
  {
    id: 'al-mughni',
    slug: 'al-mughni',
    name: 'আল-মুগনী (ইমাম ইবনে কুদামা রহ.)',
    arabicName: 'المغني لابن قدامة',
    badge: 'হাম্বলী মাযহাব',
    group: 'ইবাদত',
    articleCount: 30,
    shortDesc: 'হাম্বলী মাযহাবের প্রামাণ্য বিশ্বকোষ এবং সকল মাযহাবের দলিলের সুবিশাল এনসাইক্লোপিডিয়া।',
    metaInfo: 'ইবনে কুদামা • হাম্বলী'
  },
  {
    id: 'fiqh-us-sunnah',
    slug: 'fiqh-us-sunnah',
    name: 'ফিকহুস সুন্নাহ (সাইয়্যিদ সাবিক)',
    arabicName: 'فقه السنة',
    badge: 'সহজ আধুনিক বিন্যাস',
    group: 'ইবাদত',
    articleCount: 22,
    shortDesc: 'কুরআন ও সহীহ সুন্নাহর ভিত্তিতে দৈনন্দিন ব্যবহারিক জীবনের সহজবোধ্য ফিকহ সংকলন।',
    metaInfo: 'সাইয়্যিদ সাবিক • সুন্নাহ'
  },
  {
    id: 'fatawa-usmani',
    slug: 'fatawa-usmani',
    name: 'ফাতাওয়ায়ে উসমানী (মুফতি তকী উসমানী)',
    arabicName: 'فتاوى عثماني',
    badge: 'আধুনিক যুগের ফতোয়া',
    group: 'অর্থনীতি ও মুয়ামালাত',
    articleCount: 26,
    shortDesc: 'আধুনিক ইসলামিক ব্যাংকিং, ডিজিটাল কারেন্সি, চিকিৎসা বিজ্ঞান ও আধুনিক জীবনের ফিকহী সমাধান।',
    metaInfo: 'মুফতি তকী উসমানী • আধুনিক ফিকহ'
  },
  {
    id: 'kifayatul-mufti',
    slug: 'kifayatul-mufti',
    name: 'কিফায়াতুল মুফতি (মুফতি কিফায়াতুল্লাহ দেহলভী)',
    arabicName: 'كفاية المفتي',
    badge: 'উপমহাদেশীয় ফিকহ',
    group: 'পারিবারিক ও সামাজিক',
    articleCount: 20,
    shortDesc: 'হানাফী ফিকহের আলোকে ব্যক্তিগত, পারিবারিক ও সামাজিক জীবনের হাজারো প্রশ্নের সমাধান।',
    metaInfo: 'মুফতি কিফায়াতুল্লাহ • সমাধান'
  },
  {
    id: 'fatawa-lajnah',
    slug: 'fatawa-lajnah',
    name: 'ফাতাওয়ায়ে লাজনাতুদ দায়িমাহ',
    arabicName: 'فتاوى اللجنة الدائمة',
    badge: 'স্থায়ী ফতোয়া বোর্ড',
    group: 'ইবাদত',
    articleCount: 24,
    shortDesc: 'সৌদি আরবের শীর্ষ আলেম পরিষদের সমন্বিত প্রামাণ্য গবেষণামূলক ফতোয়াসমূহ।',
    metaInfo: 'লাজনাহ দায়িমাহ • সমকালীন'
  },
  {
    id: 'nurul-idah',
    slug: 'nurul-idah',
    name: 'নূরুল ঈযাহ (ইমাম হাসান শুশুনবুলালী)',
    arabicName: 'نور الإيضاح ونجاة الأرواح',
    badge: 'তাহারাত ও সালাত গাইড',
    group: 'ইবাদত',
    articleCount: 18,
    shortDesc: 'পবিত্রতা, সালাত ও রোজার প্রাথমিক ও বিশুদ্ধ নিয়মাবলির বিশ্বখ্যাত পাঠ্যবই।',
    metaInfo: 'শুশুনবুলালী • সালাত'
  },
  {
    id: 'mukhtasar-quduri',
    slug: 'mukhtasar-quduri',
    name: 'মুখতাসারুল কুদূরী (ইমাম আবুল হুসাইন আল-কুদূরী)',
    arabicName: 'مختصر القدوري',
    badge: 'মৌলিক মতনের আধার',
    group: 'অর্থনীতি ও মুয়ামালাত',
    articleCount: 25,
    shortDesc: 'হানাফী ফিকহের সংক্ষিপ্ত অথচ পূর্ণাঙ্গ মূলগ্রন্থ যা হাজার বছর ধরে সমাদৃত।',
    metaInfo: 'ইমাম কুদূরী • মতন'
  }
];

// 8. JANNAT Categories (NEW!)
const jannatCategories = [
  {
    id: 'jannatul-firdaus',
    slug: 'jannatul-firdaus',
    name: 'জান্নাতুল ফিরদাউস (সর্বোচ্চ স্তর)',
    arabicName: 'جنة الفردوس الأعلى',
    badge: 'সর্বোচ্চ স্তর',
    group: 'জান্নাতের স্তর ও দরজা',
    articleCount: 18,
    shortDesc: 'জান্নাতের সর্বোচ্চ ও সর্বোত্তম স্তর, যার ছাদ হলো মহান আল্লাহর আরশ এবং যেখান থেকে নহরসমূহ প্রবাহিত।',
    metaInfo: 'ফিরদাউস • আরশের নিচে'
  },
  {
    id: 'jannatul-adn',
    slug: 'jannatul-adn',
    name: 'জান্নাতুল আদন (স্থায়ী সুরম্য বাগান)',
    arabicName: 'جنات عدن',
    badge: 'চিরস্থায়ী নিবাস',
    group: 'জান্নাতের স্তর ও দরজা',
    articleCount: 14,
    shortDesc: 'মুমিনদের চিরস্থায়ী বসবাসের জন্য বিশেষভাবে প্রস্তুতকৃত সুরক্ষিত সুরম্য উদ্যান।',
    metaInfo: 'আদন • বাসস্থান'
  },
  {
    id: 'jannatun-naim',
    slug: 'jannatun-naim',
    name: 'জান্নাতুন নাঈম (অনাবিল নেয়ামতের উদ্যান)',
    arabicName: 'جنات النعيم',
    badge: 'নিয়ামতের সাগর',
    group: 'জান্নাতের স্তর ও দরজা',
    articleCount: 12,
    shortDesc: 'অফুরন্ত সুখ-শান্তি, সুস্বাদু পানীয় ও আরামদায়ক শয্যায় পরিপূর্ণ জান্নাতের স্তর।',
    metaInfo: 'নাঈম • সুখ'
  },
  {
    id: 'jannatul-mawa',
    slug: 'jannatul-mawa',
    name: 'জান্নাতুল মা\'ওয়া (মুত্তাকীদের আশ্রয়স্থল)',
    arabicName: 'جنة المأوى',
    badge: 'পরম আশ্রয়',
    group: 'জান্নাতের স্তর ও দরজা',
    articleCount: 10,
    shortDesc: 'সিদরাতুল মুনতাহার নিকটে অবস্থিত শহীদ ও মুত্তাকীদের পরম নিরাপদ আশ্রয়স্থল।',
    metaInfo: 'মা\'ওয়া • আশ্রয়'
  },
  {
    id: 'darus-salam',
    slug: 'darus-salam',
    name: 'দারুস সালাম (শান্তির চিরন্তন আলয়)',
    arabicName: 'دار السلام',
    badge: 'শান্তিময় আলয়',
    group: 'জান্নাতের স্তর ও দরজা',
    articleCount: 11,
    shortDesc: 'যেখানে কোনো ভয়, ক্লান্তি, শোক ও অসুস্থতা থাকবে না — কেবল শান্তি আর সালাম।',
    metaInfo: 'সালাম • নিরাপত্তা'
  },
  {
    id: 'jannatul-khuld',
    slug: 'jannatul-khuld',
    name: 'জান্নাতুল খুলদ ও দারুল মুক্বামাহ',
    arabicName: 'جنة الخلد ودار المقامة',
    badge: 'চিরন্তন আবাস',
    group: 'জান্নাতের স্তর ও দরজা',
    articleCount: 10,
    shortDesc: 'চিরস্থায়ী জীবনের জান্নাত যেখানে মৃত্যু, বার্ধক্য বা ক্লান্তি কখনো স্পর্শ করবে না।',
    metaInfo: 'খুলদ • অমরত্ব'
  },
  {
    id: 'eight-gates-of-jannah',
    slug: 'eight-gates-of-jannah',
    name: 'জান্নাতের আটটি দরজা (বাবুস সালাত, রাইয়ান)',
    arabicName: 'أبواب الجنة الثمانية',
    badge: 'প্রবেশদ্বার',
    group: 'জান্নাতের স্তর ও দরজা',
    articleCount: 15,
    shortDesc: 'বাবুস সালাত, বাযুল জিহাদ, বাবুর রাইয়ান (রোজাদারদের জন্য), বাবুস সাদাকাহসহ আটটি সিংহদ্বার।',
    metaInfo: 'দরজা • রাইয়ান'
  },
  {
    id: 'kawthar-salsabil-rivers',
    slug: 'kawthar-salsabil-rivers',
    name: 'কওসার, সালসাবীল ও জান্নাতী নহরসমূহ',
    arabicName: 'أنهار الجنة والكوثر',
    badge: 'স্বচ্ছ নহরমালা',
    group: 'জান্নাতের নেয়ামত',
    articleCount: 16,
    shortDesc: 'দুধ, খাঁটি মধু, নিষ্কলুষ পানি ও সুবাসিত পানীয়ের চারটি প্রবাহিত মহাসমুদ্র ও নহর।',
    metaInfo: 'কওসার • নহর'
  },
  {
    id: 'food-drinks-jannah',
    slug: 'food-drinks-jannah',
    name: 'জান্নাতবাসীদের খাদ্য, ফলমূল ও পানীয়',
    arabicName: 'طعام أهل الجنة وشرابهم',
    badge: 'সুস্বাদু নেয়ামত',
    group: 'জান্নাতের নেয়ামত',
    articleCount: 14,
    shortDesc: 'পাখির ভুনা গোশত, কখনো নষ্ট না হওয়া ফলমূল, কাফুর ও তাসনীমের সুবাসিত শারাব।',
    metaInfo: 'খাদ্য • তাসনীম'
  },
  {
    id: 'palaces-attire-houris',
    slug: 'palaces-attire-houris',
    name: 'জান্নাতের সুরম্য প্রাসাদ, অলংকার ও হুর-গেলমান',
    arabicName: 'قصور الجنة والحور العين',
    badge: 'সৌন্দর্য ও প্রাসাদ',
    group: 'জান্নাতের নেয়ামত',
    articleCount: 15,
    shortDesc: 'স্বর্ণ-রৌপ্যের ইট নির্মিত সুউচ্চ অট্টালিকা, রেশমী পোশাক ও পবিত্র সহধর্মিণীগণ।',
    metaInfo: 'প্রাসাদ • অলংকার'
  },
  {
    id: 'didar-of-allah',
    slug: 'didar-of-allah',
    name: 'আল্লাহর দিদার (জান্নাতের সর্বশ্রেষ্ঠ নিয়ামত)',
    arabicName: 'رؤية الله تعالى في الجنة',
    badge: 'পরম প্রাপ্তি',
    group: 'জান্নাতের নেয়ামত',
    articleCount: 20,
    shortDesc: 'পূর্ণিমার চাঁদের মতো স্বচক্ষে রব্বুল আলামীনের পবিত্র রূপ দর্শন — জান্নাতের সর্বোচ্চ সম্মান।',
    metaInfo: 'দিদার • দর্শন'
  },
  {
    id: 'deeds-leading-to-jannah',
    slug: 'deeds-leading-to-jannah',
    name: 'জান্নাত লাভের আমল ও পাথেয়',
    arabicName: 'الأعمال الموجبة للجنة',
    badge: 'আমল ও পথনির্দেশ',
    group: 'জান্নাত লাভের আমল',
    articleCount: 18,
    shortDesc: 'বিশুদ্ধ তাওহীদ, নিয়মিত সালাত, সদ্ব্যবহার, এতিমের লালন-পালন ও আত্মশুদ্ধিমূলক আমল।',
    metaInfo: 'আমল • জান্নাত'
  }
];

// 9. JAHANNAM Categories (NEW!)
const jahannamCategories = [
  {
    id: 'jahannam-upper',
    slug: 'jahannam-upper',
    name: 'জাহান্নাম (কঠিন শাস্তির প্রধান আবাস)',
    arabicName: 'جهنم وبئس المصير',
    badge: 'প্রথম স্তর',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 16,
    shortDesc: 'পবিত্র কুরআনে সর্বাধিক উল্লিখিত জাহান্নামের স্তর যেখানে অবাধ্য পাপীদের প্রবেশ করানো হবে।',
    metaInfo: 'জাহান্নাম • শাস্তি'
  },
  {
    id: 'ladha-fire',
    slug: 'ladha-fire',
    name: 'লাযা (মাংস-চামড়া খসিয়ে দেওয়া অগ্নি)',
    arabicName: 'لظى نزاعة للشوى',
    badge: 'দ্বিতীয় স্তর',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 11,
    shortDesc: 'লেলিহান তীব্র অগ্নিশিখা যা মুহূর্তের মধ্যে মানুষের মাথার খুলি ও গায়ের চামড়া ভস্মীভূত করে দেয়।',
    metaInfo: 'লাযা • অগ্নিশিখা'
  },
  {
    id: 'hutamah-crusher',
    slug: 'hutamah-crusher',
    name: 'হুতামাহ (চূর্ণবিচূর্ণকারী লেলিহান আগুন)',
    arabicName: 'الحطمة نار الله الموقدة',
    badge: 'তৃতীয় স্তর',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 12,
    shortDesc: 'আল্লাহর প্রজ্বলিত আগুন যা মানুষের শরীর ভেদ করে হৃদয় পর্যন্ত পৌঁছে দগ্ধ করে।',
    metaInfo: 'হুতামাহ • হৃদয়'
  },
  {
    id: 'sair-blaze',
    slug: 'sair-blaze',
    name: 'সাঈর (প্রজ্জ্বলিত উত্তপ্ত অগ্নিকুণ্ড)',
    arabicName: 'السعير وعذاب الحريق',
    badge: 'চতুর্থ স্তর',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 10,
    shortDesc: 'শয়তান ও অবাধ্য কাফেরদের জন্য প্রস্তুত রাখা তীব্র স্ফুলিঙ্গ ছড়ানো জ্বলন্ত আগুন।',
    metaInfo: 'সাঈর • অগ্নিকুণ্ড'
  },
  {
    id: 'saqar-scorcher',
    slug: 'saqar-scorcher',
    name: 'সাক্বার (যা কাউকে ছাড়েও না, রাখেও না)',
    arabicName: 'سقر وما أدراك ما سقر',
    badge: 'পঞ্চম স্তর',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 14,
    shortDesc: 'বে-নামাযী, মিসকীনদের অন্নদানে নিরুৎসাহিতকারী ও বিচার দিবস অস্বীকারকারীদের জন্য নির্ধারিত স্থান।',
    metaInfo: 'সাক্বার • সালাত'
  },
  {
    id: 'jaheem-furnace',
    slug: 'jaheem-furnace',
    name: 'জাহীম (অতিশয় উত্তপ্ত অগ্নিকূপ)',
    arabicName: 'الجحيم وبرزت الجحيم',
    badge: 'ষষ্ঠ স্তর',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 12,
    shortDesc: 'সীমালঙ্ঘনকারী অহংকারী ব্যক্তিদের জন্য উন্মোচিত বিশাল জ্বলন্ত অগ্নিকূপ।',
    metaInfo: 'জাহীম • অহংকার'
  },
  {
    id: 'hawiyah-abyss',
    slug: 'hawiyah-abyss',
    name: 'হাবিয়া (অতীব গভীর অন্ধকারের অতল গহ্বর)',
    arabicName: 'الهاوية نار حامية',
    badge: 'সপ্তম স্তর (তলদেশ)',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 15,
    shortDesc: 'জাহান্নামের সর্বনিম্ন তলদেশ — চরম অন্ধকার ও উত্তপ্ত আগুনের অতলস্পর্শী গহ্বর।',
    metaInfo: 'হাবিয়া • তলদেশ'
  },
  {
    id: 'seven-gates-hell',
    slug: 'seven-gates-hell',
    name: 'জাহান্নামের ৭টি দরজা ও পাপের স্তর',
    arabicName: 'أبواب جهنم السبعة',
    badge: 'প্রবেশ তোরণ',
    group: 'জাহান্নামের স্তর ও নাম',
    articleCount: 12,
    shortDesc: 'পাপের ধরন ও তীব্রতা অনুযায়ী জাহান্নামে প্রবেশের জন্য নির্ধারিত সাতটি লৌহ সিংহদ্বার।',
    metaInfo: '৭টি দরজা • প্রবেশদ্বার'
  },
  {
    id: 'zaqqum-boiling-hamim',
    slug: 'zaqqum-boiling-hamim',
    name: 'যাক্কুম বৃক্ষ ও ফুটন্ত পানি (হাম্যিম)',
    arabicName: 'شجرة الزقوم والحميم',
    badge: 'জাহান্নামের খাবার',
    group: 'জাহান্নামের শাস্তি ও খাদ্য',
    articleCount: 14,
    shortDesc: 'শয়তানের মাথার ন্যায় বিষাক্ত কণ্টকময় যাক্কুম ফল এবং পেট গলিয়ে দেওয়া ফুটন্ত তরল।',
    metaInfo: 'যাক্কুম • হাম্যিম'
  },
  {
    id: 'ghislin-sadid-torture',
    slug: 'ghislin-sadid-torture',
    name: 'গিসলীন ও সাদীদের শাস্তি (রক্ত-পুঁজ মিশ্রিত পানীয়)',
    arabicName: 'الغسلين والصديد',
    badge: 'পুঁজমিশ্রিত পানীয়',
    group: 'জাহান্নামের শাস্তি ও খাদ্য',
    articleCount: 10,
    shortDesc: 'জাহান্নামীদের দেহ নিঃসৃত তীব্র দুর্গন্ধযুক্ত পুঁজ ও রক্তমিশ্রিত উত্তপ্ত তরল।',
    metaInfo: 'গিসলীন • শাস্তি'
  },
  {
    id: 'chains-iron-collars',
    slug: 'chains-iron-collars',
    name: 'লোহার শেকল, বেড়ি ও জাবানিয়াহ ফেরেশতাগণ',
    arabicName: 'السلاسل والأغلال والزبانية',
    badge: 'বেড়ি ও শেকল',
    group: 'জাহান্নামের শাস্তি ও খাদ্য',
    articleCount: 11,
    shortDesc: 'সত্তুর গজ দীর্ঘ শেকলে আবদ্ধকরণ, অগ্নিময় পোশাক এবং কঠোর প্রহরীদের নিয়ন্ত্রণ।',
    metaInfo: 'শেকল • জাবানিয়াহ'
  },
  {
    id: 'salvation-from-hellfire',
    slug: 'salvation-from-hellfire',
    name: 'জাহান্নাম থেকে মুক্তির আমল, রোনাজারি ও দোয়া',
    arabicName: 'الاستعاذة والنجاة من النار',
    badge: 'মুক্তির পাথেয়',
    group: 'জাহান্নাম থেকে মুক্তির দোয়া',
    articleCount: 18,
    shortDesc: 'আল্লাহুম্মা আজিরনা মিনান নার — জাহান্নামের আগুন থেকে সুরক্ষার প্রামাণ্য নবুওয়াতী দোয়া ও আমল।',
    metaInfo: 'আজিরনা মিনান নার • তওবা'
  }
];

const SECTIONS = [
  {
    id: 'allah',
    slug: 'allah',
    name: 'আল্লাহ',
    arabicTitle: 'الله جل جلاله',
    tagline: 'তাওহীদ, আসমাউল হুসনা (৯৯টি গুণবাচক নাম), সিফাত ও বিশুদ্ধ আকীদার প্রামাণ্য বিশ্বকোষ',
    description: 'মহান রাব্বুল আলামীনের পরিচয়, তাঁর একত্ববাদ (তাওহীদ), গুণবাচক নামসমূহের তাত্ত্বিক ও ব্যবহারিক প্রভাব এবং বান্দার সাথে রবের সম্পর্ক বিষয়ক মৌলিক প্রবন্ধসমূহ।',
    filterGroups: ['সব ক্যাটেগরি', 'তাওহীদ ও আকীদা', 'আসমাউল হুসনা', 'সৃষ্টিতত্ত্ব ও হিকমত'],
    categories: allahCategories
  },
  {
    id: 'angels',
    slug: 'angels',
    name: 'ফেরেস্তা',
    arabicTitle: 'الملائكة الكرام',
    tagline: 'নূরানী সৃষ্টি, প্রধান চার ফেরেশতা ও তাদের সার্বিক দায়িত্বের দলিলভিত্তিক পর্যালোচনা',
    description: 'ফেরেশতাগণের অস্তিত্ব, চার প্রধান ফেরেশতা ও তাঁদের কর্মবণ্টন, কিরামান কাতিবীন এবং মানুষের পার্থিব ও পরলৌকিক জীবনে ফেরেশতাদের ভূমিকা।',
    filterGroups: ['সব ক্যাটেগরি', 'প্রধান ফেরেশতা', 'দায়িত্ব ও কর্মপরিধি'],
    categories: angelCategories
  },
  {
    id: 'quran',
    slug: 'quran',
    name: 'কোরআন',
    arabicTitle: 'القرآن الكريم',
    tagline: '১১৪টি সূরার প্রামাণ্য তাফসীর, ব্যাকরণ, শানে নুযূল ও সমকালীন জীবনদর্শন',
    description: 'সূরা আল-ফাতিহা থেকে শুরু করে আন-নাস পর্যন্ত ১১৪টি সূরার বিশদ আলোচনা, প্রাচীন ও আধুনিক মুফাসসিরদের অভিমত এবং আয়াতসমূহের প্রামাণ্য বিশ্লেষণ।',
    filterGroups: ['সব সূরা', 'মাক্কী সূরা', 'মাদানী সূরা'],
    categories: quranCategories
  },
  {
    id: 'hadith',
    slug: 'hadith',
    name: 'হাদিস',
    arabicTitle: 'الحديث النبوي الشريف',
    tagline: 'সিহাহ সিত্তাহ ও প্রধান হাদিস গ্রন্থসমূহের প্রামাণ্য তাহকীক ও জীবনঘনিষ্ঠ ব্যাখ্যা',
    description: 'সহীহ বুখারী, সহীহ মুসলিম, সুনান গ্রন্থসমূহ ও উসূলুল হাদিস। সনদ ও মতনের বিশুদ্ধতা যাচাই এবং আধুনিক জীবনে সুন্নাহর বাস্তব প্রয়োগ।',
    filterGroups: ['সব গ্রন্থ', 'সিহাহ সিত্তাহ', 'নির্বাচিত সংকলন', 'উসূলুল হাদিস'],
    categories: hadithCategories
  },
  {
    id: 'prophets',
    slug: 'prophets',
    name: 'নবী',
    arabicTitle: 'قصص الأنبياء والمرسلين',
    tagline: 'আদম (আ.) থেকে মুহাম্মদ (সা.) — ২৫ জন আম্বিয়ায়ে কেরামের প্রামাণ্য সিরাত ও ইতিহাস',
    description: 'কুরআনে বর্ণিত ২৫ জন সম্মানিত নবী ও রাসূলের সংগ্রামী জীবন, দাওয়াতী কর্মপদ্ধতি, অলৌকিক মুজিযা এবং উম্মতের জন্য সার্বক্ষণিক শিক্ষণীয় দিক।',
    filterGroups: ['সব নবী', 'উলুল আযম (শ্রেষ্ঠ ৫ রাসূল)', 'বনী ইসরাঈল ও অন্যান্য নবী'],
    categories: prophetCategories
  },
  {
    id: 'sahabi',
    slug: 'sahabi',
    name: 'সাহাবী',
    arabicTitle: 'الصحابة الكرام رضي الله عنهم',
    tagline: 'খুলাফায়ে রাশেদীন, আশারায়ে মুবাশশারাহ ও সোনালী প্রজন্মের জীবনাদর্শ',
    description: 'সাহাবায়ে কিরামের অতুলনীয় ঈমান, কুরবানী, রাষ্ট্র পরিচালনা, ইনসাফ ও হাদিস সংরক্ষণে তাঁদের অবিস্মরণীয় অবদান সংক্রান্ত গবেষণাধর্মী প্রবন্ধাবলী।',
    filterGroups: ['সব সাহাবী', 'খুলাফায়ে রাশেদীন', 'আশারায়ে মুবাশশারাহ', 'মুহাজির ও আনসার'],
    categories: sahabiCategories
  },
  {
    id: 'fiqh',
    slug: 'fiqh',
    name: 'ফিকহ ও জীবন',
    arabicTitle: 'الفقه والحياة',
    tagline: 'চার মাযহাবের প্রামাণ্য ফিকহ গ্রন্থ ও আধুনিক জীবনের শরীয়াহভিত্তিক সমাধান',
    description: 'আল-হিদায়া, ফাতাওয়ায়ে আলমগীরী, রদ্দুল মুহতার, আল-উম্ম, আল-মাজমূসহ ক্লাসিক্যাল ও সমকালীন ফতোয়া গ্রন্থসমূহের দলিলের আলোকে সমাধান।',
    filterGroups: ['সব গ্রন্থ', 'ইবাদত', 'অর্থনীতি ও মুয়ামালাত', 'পারিবারিক ও সামাজিক'],
    categories: fiqhCategories
  },
  {
    id: 'jannat',
    slug: 'jannat',
    name: 'জান্নাত',
    arabicTitle: 'الجنة ونعيمها',
    tagline: 'মুমিনদের চিরস্থায়ী শান্তির আবাস, জান্নাতের স্তর, নিয়ামত, নদী ও সুরম্য প্রাসাদের বিবরণ',
    description: 'পবিত্র কুরআন ও সহীহ হাদিসের আলোকে জান্নাতের আটটি দরজা, জান্নাতের স্তরসমূহ (জান্নাতুল ফিরদাউস, নাঈম, আদন), কওসার নদী, আল্লাহর দিদার এবং জান্নাতবাসীদের চিরন্তন জীবনের প্রামাণ্য বিশ্বকোষ।',
    filterGroups: ['সব ক্যাটেগরি', 'জান্নাতের স্তর ও দরজা', 'জান্নাতের নেয়ামত', 'জান্নাত লাভের আমল'],
    categories: jannatCategories
  },
  {
    id: 'jahannam',
    slug: 'jahannam',
    name: 'জাহান্নাম',
    arabicTitle: 'جهنم وعذابها',
    tagline: 'অবিশ্বাসীদের শাস্তির আবাস, জাহান্নামের স্তর, আগুন, যাক্কুম ও কঠিন শাস্তির বিবরণ',
    description: 'পবিত্র কুরআন ও সহীহ হাদিসের প্রামাণ্য বর্ণনায় জাহান্নামের ৭টি স্তর ও দরজা, উত্তপ্ত আগুন, ফুটন্ত পানি, যাক্কুম বৃক্ষ, হাবিয়া, সাক্বার এবং জাহান্নাম থেকে মুক্তিলাভের আত্মশুদ্ধিমূলক পাথেয়।',
    filterGroups: ['সব ক্যাটেগরি', 'জাহান্নামের স্তর ও নাম', 'জাহান্নামের শাস্তি ও খাদ্য', 'জাহান্নাম থেকে মুক্তির দোয়া'],
    categories: jahannamCategories
  }
];

const fileContent = `import { SectionPage, CategoryItem } from '@/types';

export const SECTIONS_DATA: SectionPage[] = ${JSON.stringify(SECTIONS, null, 2)};

export function getAllSections(): SectionPage[] {
  return SECTIONS_DATA;
}

export function getSectionById(id: string): SectionPage | undefined {
  if (id === 'feresta') return SECTIONS_DATA.find((sec) => sec.id === 'angels');
  if (id === 'nabi') return SECTIONS_DATA.find((sec) => sec.id === 'prophets');
  return SECTIONS_DATA.find((sec) => sec.id === id);
}

export function getSectionBySlug(slug: string): SectionPage | undefined {
  if (slug === 'feresta') return SECTIONS_DATA.find((sec) => sec.id === 'angels');
  if (slug === 'nabi') return SECTIONS_DATA.find((sec) => sec.id === 'prophets');
  return SECTIONS_DATA.find((sec) => sec.slug === slug || sec.id === slug);
}

export function getCategoryBySlug(
  sectionSlug: string,
  categorySlug: string
): { section: SectionPage; category: CategoryItem } | undefined {
  const section = getSectionBySlug(sectionSlug);
  if (!section) return undefined;
  const category = section.categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );
  if (!category) return undefined;
  return { section, category };
}

export function getAllCategories(): { section: SectionPage; category: CategoryItem }[] {
  const result: { section: SectionPage; category: CategoryItem }[] = [];
  SECTIONS_DATA.forEach((section) => {
    section.categories.forEach((category) => {
      result.push({ section, category });
    });
  });
  return result;
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'sections.ts'), fileContent, 'utf8');
console.log('src/data/sections.ts updated with comprehensive categories! Total sections:', SECTIONS.length);
SECTIONS.forEach(s => console.log(` - ${s.name} (${s.id}): ${s.categories.length} categories`));

module.exports = { SECTIONS };

