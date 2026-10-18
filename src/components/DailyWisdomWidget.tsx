'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Play,
  Pause,
  Copy,
  Check,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  BookOpen
} from 'lucide-react';
import { DAILY_WISDOM_ITEMS, DailyWisdomItem, getTodayWisdom } from '@/data/daily-wisdom';

interface DailyWisdomWidgetProps {
  onGenerateCard?: (wisdom: DailyWisdomItem) => void;
}

export default function DailyWisdomWidget({ onGenerateCard }: DailyWisdomWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize with today's item on mount
  useEffect(() => {
    const today = getTodayWisdom();
    const idx = DAILY_WISDOM_ITEMS.findIndex((w) => w.id === today.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
    }
  }, []);

  const currentItem = DAILY_WISDOM_ITEMS[currentIndex] || DAILY_WISDOM_ITEMS[0];

  // Stop audio on item change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentIndex]);

  const toggleAudio = () => {
    if (!audioRef.current || !currentItem.audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Audio play failed', e);
      });
    }
  };

  const handleCopy = () => {
    const text = `“${currentItem.bengali}”\n\n${currentItem.arabic}\n— ${currentItem.reference}\n\nউৎস: ইসলাম পোর্টাল (https://islam.portal.com)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const nextWisdom = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_WISDOM_ITEMS.length);
  };

  const prevWisdom = () => {
    setCurrentIndex((prev) => (prev - 1 + DAILY_WISDOM_ITEMS.length) % DAILY_WISDOM_ITEMS.length);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#1A2421] border-2 border-[#141615] dark:border-[#3B4D47] shadow-sm">
      {/* HEADER */}
      <div className="bg-[#0B4F3B] text-white px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-[#E8A86B]" />
          <span>দৈনিক প্রজ্ঞাময় বাণী ({currentItem.type === 'quran' ? 'কুরআন' : 'হাদিস'})</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevWisdom}
            aria-label="পূর্ববর্তী বাণী"
            className="p-1 hover:bg-[#083B2C] text-[#FAF8F5] transition-colors"
            title="পূর্ববর্তী বাণী"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-[#D5E6DF] px-1">
            {currentIndex + 1}/{DAILY_WISDOM_ITEMS.length}
          </span>
          <button
            type="button"
            onClick={nextWisdom}
            aria-label="পরবর্তী বাণী"
            className="p-1 hover:bg-[#083B2C] text-[#FAF8F5] transition-colors"
            title="পরবর্তী বাণী"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#B85D19]">
          <span className="px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#B85D19]/30">
            {currentItem.categoryTitle}
          </span>
          {currentItem.audioUrl && (
            <span className="text-[10px] text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              <span>প্রামাণ্য অডিও তিলাওয়াত</span>
            </span>
          )}
        </div>

        {/* ARABIC */}
        <p
          dir="rtl"
          className="font-arabic text-xl sm:text-2xl leading-loose text-right text-[#0B4F3B] dark:text-[#4CC39A] font-bold"
        >
          {currentItem.arabic}
        </p>

        {/* TRANSLITERATION */}
        {currentItem.transliteration && (
          <p className="text-xs text-[#6E7571] dark:text-[#9BA39F] italic">
            উচ্চারণ: {currentItem.transliteration}
          </p>
        )}

        {/* BENGALI */}
        <p className="text-sm sm:text-base font-bold text-[#141615] dark:text-[#FAF8F5] leading-relaxed">
          “{currentItem.bengali}”
        </p>

        {/* REFERENCE & LESSON */}
        <div className="p-3 bg-[#FAF8F5] dark:bg-[#232F2B] border-l-3 border-[#B85D19] space-y-1 text-xs">
          <div className="font-bold text-[#B85D19]">
            {currentItem.reference}
          </div>
          <p className="text-[#6E7571] dark:text-[#C5CCC8] leading-relaxed">
            <strong>শিক্ষা:</strong> {currentItem.lesson}
          </p>
        </div>

        {/* AUDIO PLAYER (IF AVAILABLE) */}
        {currentItem.audioUrl && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-[#0B4F3B]/30 flex items-center justify-between gap-3">
            <audio
              ref={audioRef}
              src={currentItem.audioUrl}
              onEnded={() => setIsPlaying(false)}
              onError={() => setIsPlaying(false)}
            />
            <button
              type="button"
              onClick={toggleAudio}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>থামান</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>তিলাওয়াত শুনুন</span>
                </>
              )}
            </button>

            {/* Pulsing visualizer effect when playing */}
            {isPlaying && (
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-[#0B4F3B] dark:bg-emerald-400 animate-pulse rounded-full" />
                <span className="w-1 h-5 bg-[#B85D19] animate-pulse delay-75 rounded-full" />
                <span className="w-1 h-2 bg-[#0B4F3B] dark:bg-emerald-400 animate-pulse delay-150 rounded-full" />
                <span className="w-1 h-4 bg-[#B85D19] animate-pulse delay-200 rounded-full" />
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTONS (COPY, CARD, SHARE) */}
        <div className="pt-2 border-t border-[#DCD7CD] dark:border-[#26332F] flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-bold border border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#0B4F3B] inline-flex items-center gap-1.5 transition-colors"
            title="বাণীটি কপি করুন"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400">কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6E7571]" />
                <span>কপি করুন</span>
              </>
            )}
          </button>

          {onGenerateCard && (
            <button
              type="button"
              onClick={() => onGenerateCard(currentItem)}
              className="px-2.5 py-1 text-xs font-bold bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#B85D19] text-[#B85D19] hover:bg-[#B85D19] hover:text-white inline-flex items-center gap-1.5 transition-colors"
              title="সোশ্যাল মিডিয়ার জন্য ছবি কার্ড তৈরি করুন"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>কার্ড বানান</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
