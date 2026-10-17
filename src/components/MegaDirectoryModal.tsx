'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Search,
  BookOpen,
  FolderTree,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Sparkles,
  Clock
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { CategoryItem, SectionPage } from '@/types';

interface MegaDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (section: SectionPage, category: CategoryItem) => void;
}

export default function MegaDirectoryModal({
  isOpen,
  onClose,
  onSelectCategory,
}: MegaDirectoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Flatten all 242 categories for instant search
  const allCategories = useMemo(() => {
    const list: { section: SectionPage; category: CategoryItem }[] = [];
    SECTIONS_DATA.forEach(section => {
      section.categories.forEach(category => {
        list.push({ section, category });
      });
    });
    return list;
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allCategories.filter(
      item =>
        item.category.name.toLowerCase().includes(q) ||
        (item.category.arabicName && item.category.arabicName.includes(q)) ||
        item.category.badge.toLowerCase().includes(q) ||
        item.category.shortDesc.toLowerCase().includes(q) ||
        item.section.name.toLowerCase().includes(q)
    );
  }, [allCategories, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] dark:bg-[#111615] border-4 border-[#141615] w-full max-w-6xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="bg-[#141615] text-[#FAF8F5] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-[#B85D19] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#B85D19]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E8A86B]">
                ইসলামিক জ্ঞানকোষ ও মেগা ডিরেক্টরি
              </span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] mt-1">
              সকল বিভাগ ও বিষয়ভিত্তিক সূচিপত্র (Directory)
            </h2>
            <p className="text-xs text-[#C2C8C5] mt-0.5">
              ৯টি প্রধান শাস্ত্রীয় বিভাগ এবং ২৪২টি প্রামাণ্য ক্যাটেগরির কেন্দ্রীয় সূচি।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/prayer-times/"
              onClick={onClose}
              className="px-3.5 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold border border-[#176B52] transition-colors inline-flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>সালাতের সময়সূচি</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="p-2 bg-[#FAF8F5] text-[#141615] hover:bg-[#B85D19] hover:text-white transition-colors border border-[#141615]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR IN MODAL */}
        <div className="p-4 sm:p-5 bg-[#FFFFFF] dark:bg-[#171F1D] border-b-2 border-[#141615] shrink-0">
          <div className="relative max-w-3xl mx-auto">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E7571]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="যেকোনো সূরা, হাদিস গ্রন্থ, নবী, সাহাবী বা ফিকহি বিষয় লিখুন (যেমন: বাক্বারাহ, বুখারী, মূসা, ওমর, জান্নাত)..."
              autoFocus
              className="w-full pl-11 pr-10 py-3 bg-[#FAF8F5] dark:bg-[#111615] text-[#141615] dark:text-[#FAF8F5] text-sm sm:text-base border-2 border-[#141615] focus:outline-none focus:ring-2 focus:ring-[#0B4F3B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold bg-[#B85D19] text-white px-2 py-0.5"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* SEARCH RESULTS VIEW (IF TYPING) */}
          {searchQuery.trim() ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#6E7571]">
                <span>অনুসন্ধানের ফলাফল ({searchResults.length}টি পাওয়া গেছে)</span>
                <span>ক্লিক করে সরাসরি অধ্যায়ে যান</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-12 text-center bg-[#FFFFFF] dark:bg-[#171F1D] border-2 border-[#141615]">
                  <p className="font-editorial text-lg text-[#141615] dark:text-[#FAF8F5]">
                    "{searchQuery}" নামে কোনো ক্যাটেগরি খুঁজে পাওয়া যায়নি।
                  </p>
                  <p className="text-xs text-[#6E7571] mt-1">
                    অনুগ্রহ করে বানান যাচাই করুন অথবা নিচের ৯টি বিভাগ থেকে ব্রাউজ করুন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {searchResults.map(({ section, category }) => (
                    <div
                      key={`${section.id}-${category.id}`}
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(section, category);
                        }
                        onClose();
                      }}
                      className="bg-[#FFFFFF] dark:bg-[#171F1D] border-2 border-[#141615] p-3.5 hover:border-[#0B4F3B] hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-[#B85D19] bg-[#F6ECE3] dark:bg-[#2C241E] px-2 py-0.5">
                          {section.name}
                        </span>
                        <span className="text-[#0B4F3B] dark:text-[#4CC39A] font-semibold">
                          {category.badge}
                        </span>
                      </div>
                      <div className="font-editorial text-base font-bold text-[#141615] dark:text-[#FAF8F5] group-hover:text-[#0B4F3B]">
                        {category.name}
                      </div>
                      {category.arabicName && (
                        <div
                          dir="rtl"
                          className="font-serif text-sm text-[#0B4F3B] dark:text-[#4CC39A] mt-0.5"
                        >
                          {category.arabicName}
                        </div>
                      )}
                      <p className="text-xs text-[#6E7571] mt-1 line-clamp-1">
                        {category.shortDesc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* 9-SECTION GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {SECTIONS_DATA.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="bg-[#FFFFFF] dark:bg-[#171F1D] border-2 border-[#141615] p-4 sm:p-5 flex flex-col justify-between hover:border-[#0B4F3B] transition-colors group"
                >
                  <div>
                    {/* TOP BADGES */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9] dark:border-[#26332F]">
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-[#111615] border border-[#DCD7CD] dark:border-[#26332F] text-[#4A4F4C] dark:text-[#C2C8C5]">
                        ০{idx + 1}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#0B4F3B] dark:text-[#4CC39A] bg-[#E6F0EC] dark:bg-[#1E2E28] px-2 py-0.5 border border-[#176B52]">
                        {sec.categories.length}টি ক্যাটেগরি
                      </span>
                    </div>

                    {/* SECTION TITLE & ARABIC */}
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-editorial text-xl font-bold text-[#0B4F3B] dark:text-[#4CC39A] group-hover:underline">
                          {sec.name}
                        </h3>
                        <span
                          dir="rtl"
                          className="font-serif text-base text-[#B85D19] font-semibold"
                        >
                          {sec.arabicTitle}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A4F4C] dark:text-[#C2C8C5] mt-1 line-clamp-2 leading-relaxed">
                        {sec.tagline}
                      </p>
                    </div>

                    {/* TOP CATEGORIES CHIPS PREVIEW */}
                    <div className="mt-3.5 pt-3 border-t border-[#F2EFE9] dark:border-[#26332F]">
                      <div className="text-[11px] font-bold text-[#6E7571] uppercase tracking-wider mb-1.5">
                        উল্লেখযোগ্য বিষয়সমূহ:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sec.categories.slice(0, 4).map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              if (onSelectCategory) {
                                onSelectCategory(sec, cat);
                              }
                              onClose();
                            }}
                            className="text-[11px] px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#111615] hover:bg-[#0B4F3B] hover:text-white dark:hover:bg-[#0B4F3B] border border-[#DCD7CD] dark:border-[#26332F] transition-colors"
                          >
                            {cat.name}
                          </button>
                        ))}
                        {sec.categories.length > 4 && (
                          <span className="text-[10px] text-[#B85D19] font-mono font-bold self-center">
                            +{sec.categories.length - 4} আরও
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTIONS */}
                  <div className="mt-4 pt-3 border-t border-[#141615] flex items-center justify-between text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectCategory) {
                          onSelectCategory(sec, sec.categories[0]);
                        }
                        onClose();
                      }}
                      className="text-[#0B4F3B] dark:text-[#4CC39A] hover:underline inline-flex items-center gap-1"
                    >
                      <span>পোর্টাল ভিউতে পড়ুন</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <Link
                      href={`/${sec.slug}/`}
                      onClick={onClose}
                      className="text-[#B85D19] hover:underline inline-flex items-center gap-1"
                    >
                      <span>নিবেদিত পেজ</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#FAF8F5] dark:bg-[#141615] border-t-2 border-[#141615] p-3.5 px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#6E7571] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0B4F3B]" />
            <span>সকল কন্টেন্ট কুরআন, সহীহ সুন্নাহ ও নির্ভরযোগ্য চার মাযহাবের তাহকীকভিত্তিক।</span>
          </div>
          <div className="font-mono text-[11px] text-[#B85D19]">
            ESC চেপে বা বাইরে ক্লিক করে বন্ধ করুন
          </div>
        </div>
      </div>
    </div>
  );
}
