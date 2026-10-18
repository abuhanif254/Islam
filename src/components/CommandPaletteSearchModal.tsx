'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  BookOpen,
  Layers,
  FileText,
  Calendar,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CornerDownLeft
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { INITIAL_ARTICLES } from '@/data/articles';
import { toBengaliDigits } from '@/lib/prayer-times';

interface CommandPaletteSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPaletteSearchModal({
  isOpen,
  onClose
}: CommandPaletteSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Build searchable index of Sections, Categories, and Articles
  const searchResults = useMemo(() => {
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) {
      // Suggest popular starting destinations
      return {
        articles: INITIAL_ARTICLES.slice(0, 3),
        categories: SECTIONS_DATA[0].categories.slice(0, 4).map((c) => ({
          ...c,
          sectionSlug: SECTIONS_DATA[0].slug,
          sectionName: SECTIONS_DATA[0].name
        })),
        sections: SECTIONS_DATA.slice(0, 4),
        totalCount: 11
      };
    }

    // 1. Match Articles
    const matchedArticles = INITIAL_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(cleanQ) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(cleanQ)) ||
        a.summary.toLowerCase().includes(cleanQ) ||
        (a.citation?.bengali && a.citation.bengali.toLowerCase().includes(cleanQ)) ||
        a.tags.some((t) => t.toLowerCase().includes(cleanQ))
    ).slice(0, 6);

    // 2. Match Categories
    const matchedCategories: any[] = [];
    SECTIONS_DATA.forEach((sec) => {
      sec.categories.forEach((cat) => {
        if (
          cat.name.toLowerCase().includes(cleanQ) ||
          (cat.arabicName && cat.arabicName.includes(cleanQ)) ||
          cat.shortDesc.toLowerCase().includes(cleanQ) ||
          cat.badge.toLowerCase().includes(cleanQ)
        ) {
          if (matchedCategories.length < 8) {
            matchedCategories.push({
              ...cat,
              sectionSlug: sec.slug,
              sectionName: sec.name
            });
          }
        }
      });
    });

    // 3. Match Sections
    const matchedSections = SECTIONS_DATA.filter(
      (s) =>
        s.name.toLowerCase().includes(cleanQ) ||
        s.arabicTitle.includes(cleanQ) ||
        s.tagline.toLowerCase().includes(cleanQ) ||
        s.description.toLowerCase().includes(cleanQ)
    );

    return {
      articles: matchedArticles,
      categories: matchedCategories,
      sections: matchedSections,
      totalCount: matchedArticles.length + matchedCategories.length + matchedSections.length
    };
  }, [query]);

  // Collect all items in a flat array for keyboard navigation
  const flatItems = useMemo(() => {
    const items: { type: 'article' | 'category' | 'section'; href: string; title: string }[] = [];

    searchResults.articles.forEach((art) => {
      const sec = SECTIONS_DATA.find((s) => s.id === art.sectionId) || SECTIONS_DATA[0];
      const cat = sec.categories.find((c) => c.id === art.categoryId) || sec.categories[0];
      items.push({
        type: 'article',
        href: `/${sec.slug}/${cat.slug}/${art.slug}/`,
        title: art.title
      });
    });

    searchResults.categories.forEach((cat: any) => {
      items.push({
        type: 'category',
        href: `/${cat.sectionSlug}/${cat.slug}/`,
        title: cat.name
      });
    });

    searchResults.sections.forEach((sec) => {
      items.push({
        type: 'section',
        href: `/${sec.slug}/`,
        title: sec.name
      });
    });

    return items;
  }, [searchResults]);

  // Handle Keyboard Navigation (ArrowUp, ArrowDown, Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, flatItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = flatItems[selectedIndex];
      if (target) {
        onClose();
        router.push(target.href);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#141615]/80 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 p-4">
      <div className="bg-[#FAF8F5] dark:bg-[#171F1D] border-2 border-[#141615] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* SEARCH BAR INPUT */}
        <div className="p-4 bg-white dark:bg-[#1A2421] border-b-2 border-[#141615] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#0B4F3B] dark:text-[#4CC39A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="কুরআন, হাদিস, মাসআলা, তাফসীর বা ক্যাটেগরি খুঁজুন... (যেমন: তাওহীদ, আয়াতুল কুরসী)"
            className="w-full text-sm sm:text-base font-semibold bg-transparent border-none focus:outline-hidden text-[#141615] dark:text-[#E8E6E1]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#6E7571] hover:text-[#141615]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 border border-[#DCD7CD] bg-[#FAF8F5] dark:bg-[#232F2B] text-[#6E7571] rounded-xs shrink-0">
            ESC
          </span>
        </div>

        {/* RESULTS SCROLL CONTAINER */}
        <div className="p-3 overflow-y-auto space-y-4 flex-1 divide-y divide-[#DCD7CD] dark:divide-[#2A3834]">
          {/* Quick Shortcuts: 64 Districts Prayer Times */}
          <div className="pt-1">
            <Link
              href="/prayer-times/"
              onClick={onClose}
              className="p-2.5 bg-[#FAF8F5] dark:bg-[#232F2B] hover:bg-[#E6F0EC] border border-[#0B4F3B]/30 flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B85D19]" />
                <span>বাংলাদেশের ৬৪ জেলার সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 1. ARTICLES MATCHES */}
          {searchResults.articles.length > 0 && (
            <div className="pt-3 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-[#6E7571] uppercase tracking-wider block px-1">
                প্রামাণ্য প্রবন্ধাবলী ({toBengaliDigits(searchResults.articles.length)}টি)
              </span>
              <div className="space-y-1">
                {searchResults.articles.map((art) => {
                  const sec = SECTIONS_DATA.find((s) => s.id === art.sectionId) || SECTIONS_DATA[0];
                  const cat = sec.categories.find((c) => c.id === art.categoryId) || sec.categories[0];
                  const href = `/${sec.slug}/${cat.slug}/${art.slug}/`;

                  return (
                    <Link
                      key={art.id}
                      href={href}
                      onClick={onClose}
                      className="p-2.5 hover:bg-[#E6F0EC] dark:hover:bg-[#15332A] rounded-xs flex items-start justify-between gap-3 block text-left transition-colors border border-transparent hover:border-[#0B4F3B]/20"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="px-1.5 py-0.5 bg-[#0B4F3B] text-white font-bold">
                            {cat.name}
                          </span>
                          <span className="text-[#6E7571]">• {art.readTime}</span>
                        </div>
                        <h4 className="font-editorial text-sm font-bold text-[#141615] dark:text-[#E8E6E1] leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-[#6E7571] dark:text-[#9BA39F] line-clamp-1">
                          {art.subtitle || art.summary}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6E7571] shrink-0 mt-2" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CATEGORIES MATCHES */}
          {searchResults.categories.length > 0 && (
            <div className="pt-3 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-[#6E7571] uppercase tracking-wider block px-1">
                ক্যাটেগরি সূচি ({toBengaliDigits(searchResults.categories.length)}টি)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {searchResults.categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/${cat.sectionSlug}/${cat.slug}/`}
                    onClick={onClose}
                    className="p-2.5 hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#141615] dark:text-[#E8E6E1]">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-[#6E7571]">
                        {cat.sectionName} • {toBengaliDigits(cat.articleCount)}টি প্রবন্ধ
                      </div>
                    </div>
                    {cat.arabicName && (
                      <span className="font-arabic text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                        {cat.arabicName}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. SECTIONS MATCHES */}
          {searchResults.sections.length > 0 && (
            <div className="pt-3 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-[#6E7571] uppercase tracking-wider block px-1">
                প্রধান বিভাগসমূহ ({toBengaliDigits(searchResults.sections.length)}টি)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {searchResults.sections.map((sec) => (
                  <Link
                    key={sec.id}
                    href={`/${sec.slug}/`}
                    onClick={onClose}
                    className="p-2.5 bg-[#FAF8F5] dark:bg-[#1F2926] hover:bg-[#E6F0EC] border border-[#DCD7CD] text-left block transition-colors"
                  >
                    <div className="font-bold text-xs text-[#0B4F3B] dark:text-[#4CC39A]">
                      {sec.name}
                    </div>
                    <div className="font-arabic text-xs text-[#E8A86B]">
                      {sec.arabicTitle}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* NO RESULTS STATE */}
          {searchResults.totalCount === 0 && (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 mx-auto text-[#6E7571]" />
              <h4 className="font-bold text-sm text-[#141615] dark:text-[#E8E6E1]">
                “{query}” দিয়ে কোনো তথ্য পাওয়া যায়নি
              </h4>
              <p className="text-xs text-[#6E7571]">
                বানান সঠিক আছে কিনা দেখুন, অথবা সাধারণ কিওয়ার্ড যেমন: তাওহীদ, সালাত, তাফসীর ইত্যাদি লিখে চেষ্টা করুন।
              </p>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 bg-white dark:bg-[#1A2421] border-t border-[#DCD7CD] dark:border-[#2A3834] flex items-center justify-between text-[11px] text-[#6E7571]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] font-mono text-[10px]">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] font-mono text-[10px]">↓</kbd> নেভিগেট
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] font-mono text-[10px]">Enter</kbd> নির্বাচন
            </span>
          </div>
          <span className="font-mono text-[#0B4F3B] dark:text-[#4CC39A] font-bold">
            ISLAM.ORG.BD SPOTLIGHT
          </span>
        </div>
      </div>
    </div>
  );
}
