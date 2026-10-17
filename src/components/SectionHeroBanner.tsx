'use client';

import React from 'react';
import Link from 'next/link';
import { SectionPage, ThemeMode } from '@/types';
import { Bookmark, Sparkles, BookOpen, Layers, ExternalLink, ChevronRight } from 'lucide-react';

export const SECTION_HERO_DATA: Record<
  string,
  {
    arabicVerse: string;
    transliteration?: string;
    translation: string;
    reference: string;
    keyStats: { label: string; value: string }[];
  }
> = {
  allah: {
    arabicVerse: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
    transliteration: 'আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল কাইয়্যুম, লা তা’খুযুহু সিনাতুঁও ওয়ালা নাওম...',
    translation:
      'আল্লাহ, যিনি ছাড়া কোনো সত্য উপাস্য নেই; তিনি চিরঞ্জীব, সবকিছুর ধারক। তন্দ্রা ও নিদ্রা তাঁকে স্পর্শ করে না।',
    reference: 'সূরা আল-বাক্বারাহ, আয়াত: ২৫৫ (আয়াতুল কুরসী)',
    keyStats: [
      { label: 'মৌলিক ভিত্তি', value: 'তাওহীদ ও আকীদা' },
      { label: 'আসমাউল হুসনা', value: '৯৯টি গুণবাচক নাম' },
      { label: 'ক্যাটেগরি', value: '১০টি বিশেষায়িত অধ্যায়' },
    ],
  },
  angels: {
    arabicVerse:
      'الْحَمْدُ لِلَّهِ فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا أُولِي أَجْنِحَةٍ',
    transliteration: 'আলহামদু লিল্লাহি ফাতিরিস সামাওয়াতি ওয়াল আরদি জায়িলিল মালাইকাতি রুসুলান...',
    translation:
      'সকল প্রশংসা আল্লাহর, যিনি আসমান ও জমিনের স্রষ্টা এবং ফেরেশতাদেরকে বার্তাবাহক করেছেন, যারা দুই দুই, তিন তিন ও চার চার ডানাবিশিষ্ট।',
    reference: 'সূরা ফাতির, আয়াত: ১',
    keyStats: [
      { label: 'প্রধান ফেরেশতা', value: '৪ জন উলুল আযম' },
      { label: 'ক্যাটেগরি', value: '১২টি অধ্যায়' },
      { label: 'সৃষ্টিতত্ত্ব', value: 'নূরের সৃষ্টি ও দায়িত্ব' },
    ],
  },
  quran: {
    arabicVerse: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
    transliteration: 'ইন্না নাহনু নায্যালনায যিকরা ওয়া ইন্না লাহু লাহাফিযূন।',
    translation:
      'নিশ্চয় আমিই এই উপদেশ (কুরআন) অবতীর্ণ করেছি এবং অবশ্যই আমি নিজেই এর চিরন্তন সংরক্ষক।',
    reference: 'সূরা আল-হিজর, আয়াত: ৯',
    keyStats: [
      { label: 'মোট সূরা', value: '১১৪টি পূর্ণাঙ্গ সূরা' },
      { label: 'মাক্কী ও মাদানী', value: '৮৬ মাক্কী • ২৮ মাদানী' },
      { label: 'মোট আয়াত', value: '৬,২৩৬টি আয়াত' },
    ],
  },
  hadith: {
    arabicVerse: 'وَمَا آتَاكُمُ الرَّسُولُ فَخُذُوهُ وَمَا نَهَاكُمْ عَنْهُ فَانتَهُوا',
    transliteration: 'ওয়া মা আতাকুমুর রাসূলু ফাখুযূহু ওয়া মা নাহাকুম আনহু ফানতাহূ...',
    translation:
      'রাসূল তোমাদেরকে যা দেন তা তোমরা গ্রহণ করো, আর যা থেকে তিনি তোমাদের নিষেধ করেন তা থেকে বিরত থাকো।',
    reference: 'সূরা আল-হাশর, আয়াত: ৭',
    keyStats: [
      { label: 'আকর গ্রন্থ', value: '১৬টি প্রামাণ্য কিতাব' },
      { label: 'সিহাহ সিত্তাহ', value: '৬টি বিশুদ্ধ সংকলন' },
      { label: 'সনদ বিশ্লেষণ', value: 'সহীহ, হাসান ও সুনান' },
    ],
  },
  prophets: {
    arabicVerse: 'وَلَقَدْ بَعَثْنَا فِي كُلِّ أُمَّةٍ رَّسُولًا أَنِ اعْبُدُوا اللَّهَ وَاجْتَنِبُوا الطَّاغُوتَ',
    transliteration: 'ওয়া লাক্বাদ বাআছনা ফী কুল্লি উম্মাতিন রাসূলা...',
    translation:
      'আর আমি নিশ্চয় প্রত্যেক উম্মতের মধ্যেই রাসূল প্রেরণ করেছি এই মর্মে যে, তোমরা কেবল আল্লাহরই ইবাদত করো এবং তাগুতকে বর্জন করো।',
    reference: 'সূরা আন-নাহল, আয়াত: ৩৬',
    keyStats: [
      { label: 'কুরআনে বর্ণিত নবী', value: '২৫ জন সম্মানিত নবী' },
      { label: 'উলুল আযম রাসূল', value: '৫ জন শ্রেষ্ঠ রাসূল' },
      { label: 'নবুওয়াতী মিশন', value: 'তাওহীদের দাওয়াত' },
    ],
  },
  sahabi: {
    arabicVerse:
      'وَالسَّابِقُونَ الْأَوَّلُونَ مِنَ الْمُهَاجِرِينَ وَالْأَنصَارِ وَالَّذِينَ اتَّبَعُوهُم بِإِحْسَانٍ رَّضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ',
    transliteration: 'ওয়াস সাবিকূনাল আউয়ালূনা মিনাল মুহাজিরীনা ওয়াল আনসার...',
    translation:
      'মুহাজির ও আনসারদের মধ্যে যারা প্রথম অগ্রগামী এবং যারা নিষ্ঠার সাথে তাঁদের অনুসরণ করেছে, আল্লাহ তাঁদের প্রতি সন্তুষ্ট হয়েছেন এবং তাঁরাও আল্লাহর প্রতি সন্তুষ্ট হয়েছেন।',
    reference: 'সূরা আত-তাওবাহ, আয়াত: ১০০',
    keyStats: [
      { label: 'নির্বাচিত সাহাবী', value: '২৭ জন শ্রেষ্ঠ ব্যক্তিত্ব' },
      { label: 'খোলাফায়ে রাশেদীন', value: '৪ জন খলীফা' },
      { label: 'আশারায়ে মুবাশশারা', value: '১০ জন জান্নাতী সাহাবী' },
    ],
  },
  fiqh: {
    arabicVerse: 'يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ وَأُولِي الْأَمْرِ مِنكُمْ',
    transliteration: 'ইয়া আইয়্যূহাল্লাযীনা আমানূ আতীউল্লাহা ওয়া আতীউর রাসূলা ওয়া উলিল আমরি মিনকুম...',
    translation:
      'হে ঈমানদারগণ! তোমরা আল্লাহর আনুগত্য করো, রাসূলের আনুগত্য করো এবং তোমাদের মধ্যকার দায়িত্বশীল ও প্রাজ্ঞ আলেমগণের আনুগত্য করো।',
    reference: 'সূরা আন-নিসা, আয়াত: ৫৯',
    keyStats: [
      { label: 'প্রামাণ্য ফিকহ গ্রন্থ', value: '১৪টি আকর কিতাব' },
      { label: 'মাযহাব ও গবেষণা', value: 'চার মাযহাব ও ফাতওয়া' },
      { label: 'বিষয়বস্তু', value: 'ইবাদত, মুআমালাত, জীবন' },
    ],
  },
  jannat: {
    arabicVerse: 'إِنَّ الْمُتَّقِينَ فِي جَنَّاتٍ وَنَعِيمٍ ۝ فَاكِهِينَ بِمَا آتَاهُمْ رَبُّهُمْ',
    transliteration: 'ইন্নাল মুত্তাকীনা ফী জান্নাতিঁও ওয়া নাঈম...',
    translation:
      'নিশ্চয় মুত্তাকীরা থাকবে জান্নাতসমূহে এবং অফুরন্ত নিয়ামতের মাঝে। তাঁদের প্রতিপালক যা তাঁদের দান করেছেন, তা নিয়ে তাঁরা আনন্দিত থাকবে।',
    reference: 'সূরা আত-তূর, আয়াত: ১৭–১৮',
    keyStats: [
      { label: 'জান্নাতের স্তর', value: '১২টি স্তর ও নিয়ামত' },
      { label: 'সুরম্য দরজা', value: '৮টি মহিমান্বিত তোরণ' },
      { label: 'সর্বোচ্চ মাকাম', value: 'জান্নাতুল ফিরদাউস' },
    ],
  },
  jahannam: {
    arabicVerse: 'فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ ۖ أُعِدَّتْ لِلْكَافِرِينَ',
    transliteration: 'ফাত্তাকুন নারাল্লাতী ওয়াকূদুহান নাসু ওয়াল হিজারাহ, উইদ্দাত লিল কাফিরীন।',
    translation:
      'অতএব তোমরা সেই আগুনকে ভয় করো, যার জ্বালানি হবে মানুষ ও পাথর; যা প্রস্তুত রাখা হয়েছে সত্যপ্রত্যাখ্যানকারীদের জন্য।',
    reference: 'সূরা আল-বাক্বারাহ, আয়াত: ২৪',
    keyStats: [
      { label: 'জাহান্নামের স্তর', value: '১২টি স্তর ও সতর্কবার্তা' },
      { label: 'কঠোর প্রহরা', value: '৭টি প্রবেশদ্বার' },
      { label: 'আমল', value: 'মুক্তির নবুওয়াতী দোয়া' },
    ],
  },
};

interface SectionHeroBannerProps {
  section: SectionPage;
  themeMode?: ThemeMode;
  onOpenDirectory?: () => void;
}

export default function SectionHeroBanner({
  section,
  themeMode = 'paper',
  onOpenDirectory,
}: SectionHeroBannerProps) {
  // Normalize section ID for data lookup (e.g. feresta -> angels, nabi -> prophets)
  const lookupId =
    section.id === 'feresta'
      ? 'angels'
      : section.id === 'nabi'
      ? 'prophets'
      : section.id;

  const heroData = SECTION_HERO_DATA[lookupId] || SECTION_HERO_DATA.quran;

  return (
    <section className="bg-[#FFFFFF] dark:bg-[#171F1D] border-2 border-[#141615] p-5 sm:p-7 shadow-sm mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* LEFT COLUMN: TITLE & INTRO (7 COLS) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B85D19] bg-[#F6ECE3] dark:bg-[#2C241E] px-2.5 py-0.5 border border-[#B85D19]">
              ইসলামিক বিশ্বকোষ • {section.name}
            </span>
            <span className="text-[11px] font-mono text-[#0B4F3B] dark:text-[#4CC39A] bg-[#E6F0EC] dark:bg-[#1E2E28] px-2.5 py-0.5 border border-[#176B52]">
              {section.categories.length}টি প্রামাণ্য ক্যাটেগরি
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B4F3B] dark:text-[#4CC39A]">
              {section.name}
            </h1>
            <span className="font-serif text-xl sm:text-2xl text-[#B85D19] font-medium" dir="rtl">
              {section.arabicTitle}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4A4F4C] dark:text-[#C2C8C5] leading-relaxed">
            {section.tagline}
          </p>

          <p className="text-xs text-[#6E7571] dark:text-[#8D9692] leading-relaxed line-clamp-2">
            {section.description}
          </p>

          {/* STATS CHIPS */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {heroData.keyStats.map((st, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] dark:bg-[#111615] border border-[#DCD7CD] dark:border-[#26332F] p-2 text-center"
              >
                <div className="text-[10px] text-[#6E7571] dark:text-[#8D9692] uppercase font-semibold">
                  {st.label}
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#141615] dark:text-[#FAF8F5] mt-0.5">
                  {st.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ARABIC CITATION CALLOUT (5 COLS) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] dark:bg-[#111615] border-2 border-[#141615] p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DCD7CD] dark:border-[#26332F]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B85D19]">
              <Bookmark className="w-3.5 h-3.5" />
              <span>প্রামাণ্য মূল দলিল</span>
            </div>
            <span className="text-[10px] font-mono text-[#6E7571] dark:text-[#8D9692]">
              {heroData.reference}
            </span>
          </div>

          <div
            dir="rtl"
            className="text-right font-serif text-base sm:text-lg text-[#0B4F3B] dark:text-[#4CC39A] font-semibold leading-relaxed"
          >
            {heroData.arabicVerse}
          </div>

          <p className="text-xs text-[#141615] dark:text-[#FAF8F5] leading-relaxed italic">
            "{heroData.translation}"
          </p>

          {onOpenDirectory && (
            <div className="pt-2 border-t border-[#DCD7CD] dark:border-[#26332F] flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenDirectory}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] hover:underline"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>সকল ২৪২টি ক্যাটেগরি ডিরেক্টরি</span>
              </button>
              <Link
                href={`/${section.slug}/`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#B85D19] hover:underline"
              >
                <span>নিবেদিত পেজ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
