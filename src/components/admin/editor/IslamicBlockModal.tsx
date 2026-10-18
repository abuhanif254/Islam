'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Bookmark,
  ShieldCheck,
  Quote,
  AlertTriangle,
  Search,
  Check,
  Sparkles
} from 'lucide-react';
import {
  QURAN_SURAHS,
  HADITH_PRIMARY_BOOKS,
  HADITH_TAHKEEQ_GRADES,
  FIQH_RULINGS,
  CLASSICAL_SCHOLARS
} from '@/data/quran-surahs';
import ArabicPalette from './ArabicPalette';

export type IslamicBlockType = 'quran' | 'hadith' | 'fiqh' | 'quote' | 'warning';

interface IslamicBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertMarkup: (markup: string) => void;
}

export default function IslamicBlockModal({
  isOpen,
  onClose,
  onInsertMarkup
}: IslamicBlockModalProps) {
  const [activeType, setActiveType] = useState<IslamicBlockType>('quran');

  // Quran state
  const [selectedSurahId, setSelectedSurahId] = useState<number>(1);
  const [surahSearch, setSurahSearch] = useState('');
  const [ayahNumber, setAyahNumber] = useState('১-৪');
  const [quranArabic, setQuranArabic] = useState('');
  const [quranTranslit, setQuranTranslit] = useState('');
  const [quranBengali, setQuranBengali] = useState('');

  // Hadith state
  const [hadithBook, setHadithBook] = useState('সহীহুল বুখারী');
  const [hadithNumber, setHadithNumber] = useState('');
  const [hadithGrade, setHadithGrade] = useState('সহীহ (Authentic)');
  const [hadithNarrator, setHadithNarrator] = useState('হযরত আবু হুরায়রা (রা.)');
  const [hadithArabic, setHadithArabic] = useState('');
  const [hadithBengali, setHadithBengali] = useState('');

  // Fiqh state
  const [fiqhTitle, setFiqhTitle] = useState('');
  const [fiqhRuling, setFiqhRuling] = useState('ওয়াজিব (Wajib / আবশ্যকীয়)');
  const [fiqhSource, setFiqhSource] = useState('আল-ফিকহুল ইসলামী ওয়া আদিল্লাতুহু');
  const [fiqhContent, setFiqhContent] = useState('');

  // Quote state
  const [quoteScholar, setQuoteScholar] = useState('শাইখুল ইসলাম ইবনে তাইমিয়্যাহ (রহ.)');
  const [quoteSource, setQuoteSource] = useState('মাজমুউল ফাতাওয়া');
  const [quoteText, setQuoteText] = useState('');

  // Warning state
  const [warningTitle, setWarningTitle] = useState('প্রচলিত ভুল ধারণা বা অনির্ভরযোগ্য বর্ণনা');
  const [warningContent, setWarningContent] = useState('');
  const [warningClarification, setWarningClarification] = useState('');

  if (!isOpen) return null;

  // Filter Surahs
  const filteredSurahs = QURAN_SURAHS.filter((s) => {
    if (!surahSearch.trim()) return true;
    const q = surahSearch.toLowerCase().trim();
    return (
      s.nameBangla.toLowerCase().includes(q) ||
      s.nameArabic.includes(q) ||
      s.id.toString().includes(q) ||
      s.englishMeaning.toLowerCase().includes(q)
    );
  });

  const selectedSurah = QURAN_SURAHS.find((s) => s.id === selectedSurahId) || QURAN_SURAHS[0];

  const handleInsert = () => {
    let markup = '';

    if (activeType === 'quran') {
      const ref = `সূরা ${selectedSurah.nameBangla} (${selectedSurah.id}): আয়াত ${ayahNumber.trim() || '১'}`;
      markup = `\n\n[কুরআন: ${ref}]\n${quranArabic.trim() ? `আরবী: ${quranArabic.trim()}\n` : ''}${
        quranTranslit.trim() ? `উচ্চারণ: ${quranTranslit.trim()}\n` : ''
      }অনুবাদ: "${quranBengali.trim()}"\n[/কুরআন]\n\n`;
    } else if (activeType === 'hadith') {
      const ref = `${hadithBook}${hadithNumber.trim() ? ` — হাদিস নং ${hadithNumber.trim()}` : ''} | তাহকীক: ${hadithGrade}`;
      markup = `\n\n[হাদিস: ${ref}]\n${hadithArabic.trim() ? `মতন: ${hadithArabic.trim()}\n` : ''}${
        hadithNarrator.trim() ? `রাবী: ${hadithNarrator.trim()}\n` : ''
      }অনুবাদ: "${hadithBengali.trim()}"\n[/হাদিস]\n\n`;
    } else if (activeType === 'fiqh') {
      const header = `${fiqhTitle.trim() || 'শরীয়াহ বিধান'} | হুকুম: ${fiqhRuling}${
        fiqhSource.trim() ? ` | তথ্যসূত্র: ${fiqhSource.trim()}` : ''
      }`;
      markup = `\n\n[মাসআলা: ${header}]\n${fiqhContent.trim()}\n[/মাসআলা]\n\n`;
    } else if (activeType === 'quote') {
      const header = `${quoteScholar} | গ্রন্থ: ${quoteSource.trim() || 'মূল সংকলন'}`;
      markup = `\n\n[উক্তি: ${header}]\n${quoteText.trim()}\n[/উক্তি]\n\n`;
    } else if (activeType === 'warning') {
      markup = `\n\n[সতর্কতা: ${warningTitle.trim()}]\nবর্ণনা: ${warningContent.trim()}\nবিশুদ্ধ তাহকীক ও নিরসন: ${warningClarification.trim()}\n[/সতর্কতা]\n\n`;
    }

    onInsertMarkup(markup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141615]/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] dark:bg-[#171F1D] border-2 border-[#141615] w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#0B4F3B] text-white p-4 flex items-center justify-between border-b-2 border-[#141615]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E8A86B]" />
            <h3 className="font-editorial text-lg font-bold">
              ইসলামিক স্কলারলি ব্লক বিল্ডার ৩.০ (Scholarly Block Builder)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#083B2C] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS SELECTOR */}
        <div className="grid grid-cols-5 border-b border-[#DCD7CD] dark:border-[#2A3834] bg-[#FFFFFF] dark:bg-[#1A2421] text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveType('quran')}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-r border-[#DCD7CD] dark:border-[#2A3834] ${
              activeType === 'quran'
                ? 'bg-[#0B4F3B] text-white'
                : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>কুরআন আয়াত</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('hadith')}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-r border-[#DCD7CD] dark:border-[#2A3834] ${
              activeType === 'hadith'
                ? 'bg-[#B85D19] text-white'
                : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>হাদিস তাহকীক</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('fiqh')}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-r border-[#DCD7CD] dark:border-[#2A3834] ${
              activeType === 'fiqh'
                ? 'bg-[#15803D] text-white'
                : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ফিকহী বিধান</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('quote')}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors border-r border-[#DCD7CD] dark:border-[#2A3834] ${
              activeType === 'quote'
                ? 'bg-[#0F766E] text-white'
                : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>সালাফ উক্তি</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('warning')}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
              activeType === 'warning'
                ? 'bg-[#DC2626] text-white'
                : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>সতর্কতা খণ্ডন</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. QURAN BLOCK TAB */}
          {activeType === 'quran' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Surah Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] mb-1">
                    কুরআনুল কারীমের সূরা নির্বাচন করুন (১১৪টি সূরা)
                  </label>
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6E7571]" />
                    <input
                      type="text"
                      placeholder="সূরার নাম বা নম্বর লিখে খুঁজুন..."
                      value={surahSearch}
                      onChange={(e) => setSurahSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                  <select
                    value={selectedSurahId}
                    onChange={(e) => setSelectedSurahId(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    size={4}
                  >
                    {filteredSurahs.map((surah) => (
                      <option key={surah.id} value={surah.id}>
                        {surah.id}. {surah.nameBangla} ({surah.nameArabic}) — {surah.ayahCount} আয়াত [{surah.revelationPlace}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ayah Number Input & Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      নির্দিষ্ট আয়াত নম্বর বা রেঞ্জ
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ১-৫ অথবা ২৫৫"
                      value={ayahNumber}
                      onChange={(e) => setAyahNumber(e.target.value)}
                      className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                  <div className="p-3 bg-[#E6F0EC] dark:bg-[#15332A] border border-[#0B4F3B]/30 text-xs space-y-1">
                    <span className="font-bold text-[#0B4F3B] dark:text-[#4CC39A] block">
                      নির্বাচিত সূরা: সূরা {selectedSurah.nameBangla} ({selectedSurah.nameArabic})
                    </span>
                    <p className="text-[#4A4F4C] dark:text-[#C2C8C5]">
                      অর্থ: {selectedSurah.englishMeaning} • অবতীর্ণ: {selectedSurah.revelationPlace} • মোট আয়াত: {selectedSurah.ayahCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Arabic Virtual Diacritics Palette for Quran */}
              <ArabicPalette onInsert={(symbol) => setQuranArabic((prev) => prev + symbol)} compact />

              {/* Arabic Text */}
              <div>
                <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] mb-1">
                  পবিত্র আয়াতের আরবী ইবারত (Arabic Text with Tashkeel)
                </label>
                <textarea
                  dir="rtl"
                  rows={2}
                  value={quranArabic}
                  onChange={(e) => setQuranArabic(e.target.value)}
                  placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ ..."
                  className="w-full p-3 font-arabic text-xl leading-loose bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47] text-right"
                />
              </div>

              {/* Transliteration */}
              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  উচ্চারণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={quranTranslit}
                  onChange={(e) => setQuranTranslit(e.target.value)}
                  placeholder="যেমন: বিসমিল্লাহির রাহমানির রাহীম..."
                  className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>

              {/* Bengali Translation */}
              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  প্রামাণ্য বঙ্গানুবাদ (Authentic Bengali Translation) *
                </label>
                <textarea
                  rows={2}
                  value={quranBengali}
                  onChange={(e) => setQuranBengali(e.target.value)}
                  placeholder="পরম করুণাময় অসীম দয়ালু আল্লাহর নামে..."
                  className="w-full p-3 text-sm bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>
            </div>
          )}

          {/* 2. HADITH TAHKEEQ TAB */}
          {activeType === 'hadith' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Hadith Book */}
                <div>
                  <label className="block text-xs font-bold text-[#B85D19] mb-1">
                    হাদিস গ্রন্থ
                  </label>
                  <select
                    value={hadithBook}
                    onChange={(e) => setHadithBook(e.target.value)}
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  >
                    {HADITH_PRIMARY_BOOKS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.arabic})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hadith Number */}
                <div>
                  <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                    হাদিস নং / কিতাব
                  </label>
                  <input
                    type="text"
                    value={hadithNumber}
                    onChange={(e) => setHadithNumber(e.target.value)}
                    placeholder="যেমন: ১ (কিতাবুল ঈমান)"
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                </div>

                {/* Tahkeeq Authenticity Grade */}
                <div>
                  <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] mb-1">
                    তাহকীক ও বিশুদ্ধতার মান
                  </label>
                  <select
                    value={hadithGrade}
                    onChange={(e) => setHadithGrade(e.target.value)}
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  >
                    {HADITH_TAHKEEQ_GRADES.map((g) => (
                      <option key={g.grade} value={g.grade}>
                        {g.grade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Narrator */}
              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  রাবী / বর্ণনাকারী সাহাবী
                </label>
                <input
                  type="text"
                  value={hadithNarrator}
                  onChange={(e) => setHadithNarrator(e.target.value)}
                  placeholder="যেমন: হযরত ওমর ইবনুল খাত্তাব (রা.)"
                  className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>

              {/* Arabic Palette */}
              <ArabicPalette onInsert={(symbol) => setHadithArabic((prev) => prev + symbol)} compact />

              {/* Hadith Arabic Matn */}
              <div>
                <label className="block text-xs font-bold text-[#B85D19] mb-1">
                  হাদিসের আরবী মতন (Arabic Matn)
                </label>
                <textarea
                  dir="rtl"
                  rows={2}
                  value={hadithArabic}
                  onChange={(e) => setHadithArabic(e.target.value)}
                  placeholder="إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ..."
                  className="w-full p-3 font-arabic text-xl leading-loose bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47] text-right"
                />
              </div>

              {/* Bengali Translation */}
              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  হাদিসের বঙ্গানুবাদ ও ব্যাখ্যা *
                </label>
                <textarea
                  rows={2}
                  value={hadithBengali}
                  onChange={(e) => setHadithBengali(e.target.value)}
                  placeholder="নিশ্চয়ই সমস্ত আমল নিয়্যতের ওপর নির্ভরশীল..."
                  className="w-full p-3 text-sm bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>
            </div>
          )}

          {/* 3. FIQH RULING TAB */}
          {activeType === 'fiqh' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#15803D] mb-1">
                    ফিকহী মাসআলার শিরোনাম
                  </label>
                  <input
                    type="text"
                    value={fiqhTitle}
                    onChange={(e) => setFiqhTitle(e.target.value)}
                    placeholder="যেমন: সালাতে খুশু বজায় রাখার হুকুম"
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#B85D19] mb-1">
                    শরীয়াহ হুকুম ও ক্যাটেগরি
                  </label>
                  <select
                    value={fiqhRuling}
                    onChange={(e) => setFiqhRuling(e.target.value)}
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  >
                    {FIQH_RULINGS.map((r) => (
                      <option key={r.ruling} value={r.ruling}>
                        {r.ruling}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  ফিকহী প্রামাণ্য গ্রন্থ ও রেফারেন্স
                </label>
                <input
                  type="text"
                  value={fiqhSource}
                  onChange={(e) => setFiqhSource(e.target.value)}
                  placeholder="যেমন: আল-মাবসূত — ইমাম সারাখসী / রদ্দুল মুহতার"
                  className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  মাসআলার বিশদ বিবরণ ও প্রয়োগের শর্তাবলী *
                </label>
                <textarea
                  rows={4}
                  value={fiqhContent}
                  onChange={(e) => setFiqhContent(e.target.value)}
                  placeholder="ফুকাহায়ে কেরামের ঐকমত্যে এই আমলটির হুকুম হলো..."
                  className="w-full p-3 text-sm bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>
            </div>
          )}

          {/* 4. SALAF QUOTE TAB */}
          {activeType === 'quote' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F766E] mb-1">
                    সালাফ / আইম্মায়ে কেরাম
                  </label>
                  <select
                    value={quoteScholar}
                    onChange={(e) => setQuoteScholar(e.target.value)}
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  >
                    {CLASSICAL_SCHOLARS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                    গ্রন্থ বা কিতাবের নাম
                  </label>
                  <input
                    type="text"
                    value={quoteSource}
                    onChange={(e) => setQuoteSource(e.target.value)}
                    placeholder="যেমন: মাজমুউল ফাতাওয়া, খণ্ড ৩"
                    className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  উদ্ধৃতি / মূল্যবান বাণী *
                </label>
                <textarea
                  rows={4}
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="ইমাম (রহ.) বলেন: 'যে ব্যক্তি অন্তরের পরিশুদ্ধি কামনা করে, তার উচিত...' "
                  className="w-full p-3 text-sm italic bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>
            </div>
          )}

          {/* 5. WARNING TAB */}
          {activeType === 'warning' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#DC2626] mb-1">
                  সতর্কতামূলক বিষয়ের শিরোনাম
                </label>
                <input
                  type="text"
                  value={warningTitle}
                  onChange={(e) => setWarningTitle(e.target.value)}
                  placeholder="যেমন: প্রচলিত অনির্ভরযোগ্য বর্ণনা বিষয়ে সাবধানতা"
                  className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  সমাজে প্রচলিত ভুল ধারণা বা জঈফ/মওজু বর্ণনা
                </label>
                <textarea
                  rows={2}
                  value={warningContent}
                  onChange={(e) => setWarningContent(e.target.value)}
                  placeholder="অনেকে বলে থাকেন যে... অথচ এই কথার কোনো সহীহ সনদ পাওয়া যায় না।"
                  className="w-full p-3 text-sm bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] mb-1">
                  বিশুদ্ধ তাহকীক ও সালাফের দিকনির্দেশনা *
                </label>
                <textarea
                  rows={3}
                  value={warningClarification}
                  onChange={(e) => setWarningClarification(e.target.value)}
                  placeholder="মুহাদ্দিসীনে কেরামের মতে এর বিশুদ্ধ পাঠ হলো..."
                  className="w-full p-3 text-sm bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#FFFFFF] dark:bg-[#1A2421] border-t border-[#DCD7CD] dark:border-[#2A3834] p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold border border-[#DCD7CD] dark:border-[#3B4D47] text-[#6E7571] hover:text-[#141615]"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={handleInsert}
            className="px-5 py-2 text-xs font-bold bg-[#0B4F3B] hover:bg-[#083B2C] text-white flex items-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>প্রবন্ধে ব্লকটি যুক্ত করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
