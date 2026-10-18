'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, HelpCircle } from 'lucide-react';

interface ArabicPaletteProps {
  onInsert?: (char: string) => void;
  compact?: boolean;
}

export const ARABIC_HONORIFICS = [
  { symbol: 'ﷺ', name: 'সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম', short: 'রাসূল (সা.)' },
  { symbol: 'ﷻ', name: 'জাল্লা জালালুহু', short: 'আল্লাহ (তাআলা)' },
  { symbol: 'ؑ', name: 'আলাইহিস সালাম', short: 'নবী/ফেরেশতা (আ.)' },
  { symbol: 'ؓ', name: 'রাদিয়াল্লাহু আনহু/আনহা', short: 'সাহাবী (রা.)' },
  { symbol: 'ؒ', name: 'রহমাতুল্লাহি আলাইহি', short: 'বুযুর্গ/ইমাম (রহ.)' },
  { symbol: '﷽', name: 'বিসমিল্লাহির রাহমানির রাহীম', short: 'বিসমিল্লাহ' },
  { symbol: '۝', name: 'আয়াত সমাপ্তি প্রতীক (Ayah Sign)', short: 'আয়াত' },
  { symbol: '۞', name: 'রুব উল হিযব (Rub el Hizb)', short: 'হিযব' },
];

export const ARABIC_TASHKEEL = [
  { char: '\u064E', name: 'ফাতহা / যবর (َ)', sample: 'بَ' },
  { char: '\u0650', name: 'কাসরা / যের (ِ)', sample: 'بِ' },
  { char: '\u064F', name: 'দাম্মা / পেশ (ُ)', sample: 'بُ' },
  { char: '\u064B', name: 'ফাতহাতাইন / দুই যবর (ً)', sample: 'باً' },
  { char: '\u064D', name: 'কাসরাতাইন / দুই যের (ٍ)', sample: 'بٍ' },
  { char: '\u064C', name: 'দাম্মাতাইন / দুই পেশ (ٌ)', sample: 'بٌ' },
  { char: '\u0652', name: 'সুকুন / জযম (ْ)', sample: 'بْ' },
  { char: '\u0651', name: 'তাশদীদ (ّ)', sample: 'بّ' },
  { char: '\u0670', name: 'খাড়া যবর (ٰ)', sample: 'بٰ' },
  { char: '\u0656', name: 'খাড়া যের (ٖ)', sample: 'بٖ' },
  { char: '\u0657', name: 'উল্টো পেশ (ٗ)', sample: 'بٗ' },
  { char: 'ء', name: 'হামযাহ (ء)', sample: 'ء' },
  { char: 'آ', name: 'আলিফ মাদ (آ)', sample: 'آ' },
];

export default function ArabicPalette({ onInsert, compact = false }: ArabicPaletteProps) {
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const handleClick = (symbol: string) => {
    if (onInsert) {
      onInsert(symbol);
    }
    // Also copy to clipboard for comfort
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(symbol).catch(() => {});
    }
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 1200);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#1A2421] border border-[#DCD7CD] dark:border-[#2A3834] p-2.5 space-y-2">
      <div className="flex items-center justify-between text-xs border-b border-[#DCD7CD] dark:border-[#2A3834] pb-1.5">
        <span className="font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B85D19]" />
          <span>আরবী ভার্চুয়াল তাশকীল ও সম্মানসূচক প্যালেট</span>
        </span>
        <span className="text-[11px] text-[#6E7571] dark:text-[#9BA39F]">
          {copiedSymbol ? `✓ '${copiedSymbol}' কপি হয়েছে` : 'ক্লিক করে ইনসার্ট বা কপি করুন'}
        </span>
      </div>

      {/* HONORIFICS ROW */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase text-[#B85D19] mr-1">সম্মানসূচক:</span>
        {ARABIC_HONORIFICS.map((item) => (
          <button
            key={item.symbol}
            type="button"
            onClick={() => handleClick(item.symbol)}
            title={`${item.name} (${item.symbol})`}
            className="px-2 py-1 bg-white dark:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#0B4F3B] hover:bg-[#E6F0EC] dark:hover:bg-[#15332A] text-sm font-serif transition-colors rounded-none shadow-xs flex items-center gap-1"
          >
            <span className="text-base text-[#0B4F3B] dark:text-[#4CC39A]">{item.symbol}</span>
            {!compact && <span className="text-[10px] text-[#6E7571] dark:text-[#9BA39F]">{item.short}</span>}
          </button>
        ))}
      </div>

      {/* TASHKEEL / DIACRITICS ROW */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-dashed border-[#DCD7CD] dark:border-[#2A3834]">
        <span className="text-[10px] font-bold uppercase text-[#0B4F3B] dark:text-[#4CC39A] mr-1">হরকত:</span>
        {ARABIC_TASHKEEL.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => handleClick(item.char)}
            title={`${item.name}`}
            className="w-7 h-7 bg-white dark:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#B85D19] hover:bg-[#FFF6E5] dark:hover:bg-[#2B2118] text-sm font-serif transition-colors flex items-center justify-center font-bold text-[#141615] dark:text-[#E8E6E1]"
          >
            {item.sample}
          </button>
        ))}
      </div>
    </div>
  );
}
