'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Compass,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  X,
  Bell,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  ShieldCheck
} from 'lucide-react';
import {
  calculatePrayerTimes,
  BANGLADESH_CITIES,
  DayPrayerSchedule,
  toBengaliDigits,
  formatTimeBn,
} from '@/lib/prayer-times';
import { getHijriDate, HijriDateInfo, MAJOR_ISLAMIC_EVENTS } from '@/lib/hijri-calendar';

interface PrayerTimesAndHijriWidgetProps {
  themeMode?: 'paper' | 'sepia' | 'dark';
}

export default function PrayerTimesAndHijriWidget({
  themeMode = 'paper',
}: PrayerTimesAndHijriWidgetProps) {
  const [selectedCity, setSelectedCity] = useState<string>('dhaka');
  const [asrMadhab, setAsrMadhab] = useState<'hanafi' | 'shafii'>('hanafi');
  const [moonAdjustment, setMoonAdjustment] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate schedules
  const prayerSchedule: DayPrayerSchedule = useMemo(() => {
    return calculatePrayerTimes(currentTime, selectedCity, asrMadhab);
  }, [currentTime, selectedCity, asrMadhab]);

  const hijriDate: HijriDateInfo = useMemo(() => {
    return getHijriDate(currentTime, moonAdjustment);
  }, [currentTime, moonAdjustment]);

  // Group 64 districts by administrative division for clean navigation
  const groupedCities = useMemo(() => {
    const groups: Record<string, [string, (typeof BANGLADESH_CITIES)[string]][]> = {};
    for (const [k, c] of Object.entries(BANGLADESH_CITIES)) {
      const div = c.divisionBn || 'অন্যান্য';
      if (!groups[div]) groups[div] = [];
      groups[div].push([k, c]);
    }
    return Object.entries(groups);
  }, []);

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#141615] border-b-2 border-[#141615] text-[#141615] dark:text-[#FAF8F5] transition-colors">
      {/* 1. TOP COMPACT STATUS RIBBON */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* LEFT: HIJRI DATE & ISLAMIC DAY */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
            <Calendar className="w-3.5 h-3.5 text-[#B85D19]" />
            <span className="font-editorial text-xs sm:text-sm">{hijriDate.fullDateBn}</span>
            <span className="font-serif text-xs text-[#B85D19] hidden md:inline" dir="rtl">
              ({hijriDate.fullDateAr})
            </span>
          </div>

          {hijriDate.isWhiteDay && (
            <span className="bg-[#E6F0EC] dark:bg-[#1E2E28] text-[#0B4F3B] dark:text-[#4CC39A] px-2 py-0.5 text-[10px] font-bold border border-[#176B52]">
              ★ আইয়ামে বীজের নফল রোযা
            </span>
          )}

          {hijriDate.upcomingEvent && (
            <span className="bg-[#F6ECE3] dark:bg-[#2C241E] text-[#B85D19] px-2 py-0.5 text-[10px] font-bold border border-[#B85D19]">
              আসন্ন: {hijriDate.upcomingEvent.nameBn}
            </span>
          )}
        </div>

        {/* RIGHT: CURRENT WAQT + NEXT COUNTDOWN + EXPAND TOGGLE */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {/* CITY SELECTOR IN RIBBON */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6E7571] dark:text-[#A8B2AE]">
            <MapPin className="w-3 h-3 text-[#B85D19]" />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="bg-transparent font-bold text-[#141615] dark:text-[#FAF8F5] border-b border-[#DCD7CD] focus:outline-none cursor-pointer py-0.5"
            >
              {groupedCities.map(([divName, cities]) => (
                <optgroup key={divName} label={`${divName} বিভাগ`}>
                  {cities.map(([k, c]) => (
                    <option key={k} value={k} className="dark:bg-[#141615] text-[#141615] dark:text-[#FAF8F5]">
                      {c.nameBn}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* ACTIVE & NEXT WAQT */}
          {prayerSchedule.currentWaqt && (
            <div className="flex items-center gap-1.5 font-bold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-[#0B4F3B] animate-pulse" />
              <span className="text-[#0B4F3B] dark:text-[#4CC39A]">
                ওয়াক্ত: {prayerSchedule.currentWaqt.name}
              </span>
              <span className="text-[#6E7571] dark:text-[#A8B2AE] font-normal">
                ({prayerSchedule.currentWaqt.timeBn})
              </span>
            </div>
          )}

          {prayerSchedule.nextWaqt && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#B85D19] bg-[#FAF8F5] dark:bg-[#1A2320] px-2 py-0.5 border border-[#DCD7CD] dark:border-[#26332F]">
              <Clock className="w-3 h-3" />
              <span>পরবর্তী: {prayerSchedule.nextWaqt.name}</span>
              <span className="font-bold">({prayerSchedule.remainingTime} বাকি)</span>
            </div>
          )}

          {/* EXPAND BUTTON */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF8F5] dark:bg-[#1E2E28] hover:bg-[#F2EFE9] text-[#141615] dark:text-[#FAF8F5] text-xs font-bold border border-[#141615] dark:border-[#26332F] transition-colors"
          >
            <span>{isExpanded ? 'সংক্ষিপ্ত করুন' : 'পূর্ণাঙ্গ সময়সূচি'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. EXPANDED FULL SCHEDULE & HIJRI DASHBOARD */}
      {isExpanded && (
        <div className="bg-[#FAF8F5] dark:bg-[#111615] border-t-2 border-[#141615] p-4 sm:p-6 lg:p-7 space-y-6 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1440px] mx-auto space-y-6">
            {/* EXPANDED HEADER & CALIBRATION */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#DCD7CD] dark:border-[#26332F]">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
                  <span>ইসলামিক ফাউন্ডেশন বাংলাদেশ পদ্ধতি</span>
                  <span>•</span>
                  <span>{prayerSchedule.city.nameBn} জেলা {prayerSchedule.city.divisionBn ? `(${prayerSchedule.city.divisionBn} বিভাগ)` : ''}</span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-extrabold text-[#0B4F3B] dark:text-[#4CC39A] mt-0.5">
                  আজকের পাঁচ ওয়াক্ত সালাত, সাহরী ও ইফতারের সময়সূচি
                </h3>
                <p className="text-xs text-[#6E7571] dark:text-[#A8B2AE]">
                  তারিখ: {prayerSchedule.dateStr} • হিজরি: {hijriDate.fullDateBn}
                </p>
              </div>

              {/* CONTROLS: MADHAB & MOON SIGHTING */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Asr Madhab Toggle */}
                <div className="flex items-center border border-[#141615] bg-[#FFFFFF] dark:bg-[#1A2320] text-xs font-bold p-0.5">
                  <button
                    type="button"
                    onClick={() => setAsrMadhab('hanafi')}
                    className={`px-2 py-1 transition-colors ${
                      asrMadhab === 'hanafi'
                        ? 'bg-[#0B4F3B] text-white'
                        : 'text-[#141615] dark:text-[#FAF8F5]'
                    }`}
                  >
                    আসর (হানাফী)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAsrMadhab('shafii')}
                    className={`px-2 py-1 transition-colors ${
                      asrMadhab === 'shafii'
                        ? 'bg-[#0B4F3B] text-white'
                        : 'text-[#141615] dark:text-[#FAF8F5]'
                    }`}
                  >
                    আসর (শাফেয়ী)
                  </button>
                </div>

                {/* Moon Sighting Adjustment */}
                <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-[#1A2320] border border-[#141615] px-2 py-1 text-xs">
                  <span className="text-[#6E7571] dark:text-[#A8B2AE] text-[11px] font-semibold">
                    চাঁদ দেখা:
                  </span>
                  <button
                    type="button"
                    onClick={() => setMoonAdjustment(prev => prev - 1)}
                    className="px-1.5 py-0.5 bg-[#F2EFE9] dark:bg-[#26332F] font-bold text-xs hover:bg-[#E8A86B]"
                    title="১ দিন কমান"
                  >
                    -১
                  </button>
                  <span className="font-mono font-bold px-1 text-[11px]">
                    {moonAdjustment > 0 ? `+${moonAdjustment}` : moonAdjustment}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMoonAdjustment(prev => prev + 1)}
                    className="px-1.5 py-0.5 bg-[#F2EFE9] dark:bg-[#26332F] font-bold text-xs hover:bg-[#E8A86B]"
                    title="১ দিন বাড়ান"
                  >
                    +১
                  </button>
                </div>
              </div>
            </div>

            {/* 6 MAIN TIME CARDS (FAJR, SUNRISE, DHUHR, ASR, MAGHRIB, ISHA) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {prayerSchedule.timesList.map(item => {
                const isCurrent = item.isCurrent;
                const isNext = item.isNext;

                return (
                  <div
                    key={item.id}
                    className={`p-4 border-2 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-[#0B4F3B] text-white border-[#141615] shadow-md scale-102'
                        : isNext
                        ? 'bg-[#FFFFFF] dark:bg-[#171F1D] border-[#B85D19] shadow-sm'
                        : 'bg-[#FFFFFF] dark:bg-[#171F1D] border-[#141615] dark:border-[#26332F]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span
                          className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isCurrent
                              ? 'text-[#E8A86B]'
                              : isNext
                              ? 'text-[#B85D19]'
                              : 'text-[#6E7571] dark:text-[#A8B2AE]'
                          }`}
                        >
                          {isCurrent ? '● বর্তমান ওয়াক্ত' : isNext ? 'পরবর্তী ওয়াক্ত' : 'ওয়াক্ত'}
                        </span>
                        <span
                          dir="rtl"
                          className={`font-serif text-sm ${
                            isCurrent ? 'text-[#D5E6DF]' : 'text-[#6E7571] dark:text-[#A8B2AE]'
                          }`}
                        >
                          {item.nameArabic}
                        </span>
                      </div>

                      <h4
                        className={`font-editorial text-lg sm:text-xl font-bold ${
                          isCurrent ? 'text-white' : 'text-[#141615] dark:text-[#FAF8F5]'
                        }`}
                      >
                        {item.name}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10">
                      <div
                        className={`font-bold text-base sm:text-lg tracking-tight ${
                          isCurrent ? 'text-[#E8A86B]' : 'text-[#0B4F3B] dark:text-[#4CC39A]'
                        }`}
                      >
                        {item.timeBn}
                      </div>
                      <div
                        className={`text-[10px] font-mono mt-0.5 ${
                          isCurrent ? 'text-white/80' : 'text-[#6E7571] dark:text-[#A8B2AE]'
                        }`}
                      >
                        {item.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUPPLEMENTARY TIMINGS BAR (SAHRI, ISHRAQ, IFTAR, TAHAJJUD) */}
            <div className="bg-[#FFFFFF] dark:bg-[#171F1D] border-2 border-[#141615] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-2 bg-[#FAF8F5] dark:bg-[#111615] border border-[#DCD7CD] dark:border-[#26332F]">
                <div className="text-[11px] text-[#6E7571] dark:text-[#A8B2AE] font-semibold">
                  সাহরী শেষ
                </div>
                <div className="text-sm sm:text-base font-bold text-[#B85D19] mt-0.5">
                  {prayerSchedule.sahriEnds}
                </div>
                <div className="text-[10px] text-[#6E7571]">ফজরের ৫ মিনিট পূর্বে</div>
              </div>

              <div className="p-2 bg-[#FAF8F5] dark:bg-[#111615] border border-[#DCD7CD] dark:border-[#26332F]">
                <div className="text-[11px] text-[#6E7571] dark:text-[#A8B2AE] font-semibold">
                  ইশরাক ও চাশত
                </div>
                <div className="text-sm sm:text-base font-bold text-[#0B4F3B] dark:text-[#4CC39A] mt-0.5">
                  {prayerSchedule.ishraq}
                </div>
                <div className="text-[10px] text-[#6E7571]">সূর্যোদয়ের ১৮ মিনিট পর</div>
              </div>

              <div className="p-2 bg-[#FAF8F5] dark:bg-[#111615] border border-[#DCD7CD] dark:border-[#26332F]">
                <div className="text-[11px] text-[#6E7571] dark:text-[#A8B2AE] font-semibold">
                  ইফতারের সময়
                </div>
                <div className="text-sm sm:text-base font-bold text-[#B85D19] mt-0.5">
                  {prayerSchedule.iftar}
                </div>
                <div className="text-[10px] text-[#6E7571]">মাগরিবের সূচনাকাল</div>
              </div>

              <div className="p-2 bg-[#FAF8F5] dark:bg-[#111615] border border-[#DCD7CD] dark:border-[#26332F]">
                <div className="text-[11px] text-[#6E7571] dark:text-[#A8B2AE] font-semibold">
                  তাহাজ্জুদের শেষ সময়
                </div>
                <div className="text-sm sm:text-base font-bold text-[#0B4F3B] dark:text-[#4CC39A] mt-0.5">
                  {prayerSchedule.tahajjudEnd}
                </div>
                <div className="text-[10px] text-[#6E7571]">সুবহে সাদিকের প্রাক্কালে</div>
              </div>
            </div>

            {/* UPCOMING ISLAMIC EVENTS & OBSERVANCES */}
            <div className="bg-[#FFFFFF] dark:bg-[#171F1D] border-2 border-[#141615] p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-2.5 border-b border-[#DCD7CD] dark:border-[#26332F]">
                <Sparkles className="w-4 h-4 text-[#B85D19]" />
                <h4 className="font-editorial text-base font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                  ইসলামিক বর্ষপঞ্জিকা ও মহিমান্বিত দিবসসমূহ (Major Islamic Observances)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                {MAJOR_ISLAMIC_EVENTS.slice(0, 4).map((evt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#FAF8F5] dark:bg-[#111615] border border-[#DCD7CD] dark:border-[#26332F] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                        {evt.nameBn}
                      </span>
                      <span className="text-[10px] font-mono text-[#B85D19]">
                        {toBengaliDigits(evt.day)} তারিখ
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6E7571] dark:text-[#A8B2AE] leading-snug">
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
