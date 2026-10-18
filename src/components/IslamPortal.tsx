'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Bookmark,
  Share2,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  Compass,
  ArrowLeft,
  ArrowUpRight,
  Menu,
  ListFilter,
  List,
  Globe,
  ShieldCheck,
  Award,
  Calendar,
  UserCheck,
  BookMarked,
  Database,
  Hash,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { ThemeMode, ViewMode, Article, CategoryItem, SectionPage, CitationBox } from '@/types';
import { SECTIONS_DATA } from '@/data/sections';
import { INITIAL_ARTICLES } from '@/data/articles';
import { toBengaliDigits } from '@/lib/prayer-times';
import { IslamicGeometricEmblem } from './IslamicGeometricEmblem';
import SectionHeroBanner from './SectionHeroBanner';
import MegaDirectoryModal from './MegaDirectoryModal';
import PrayerTimesAndHijriWidget from './PrayerTimesAndHijriWidget';
import SiteFooter from './SiteFooter';
import SocialCardModal from './SocialCardModal';
import CommandPaletteSearchModal from './CommandPaletteSearchModal';

export interface IslamPortalProps {
  initialSectionSlug?: string;
  initialCategorySlug?: string;
  initialArticleSlug?: string;
  initialViewMode?: ViewMode;
}

export default function IslamPortal({
  initialSectionSlug,
  initialCategorySlug,
  initialArticleSlug,
  initialViewMode,
}: IslamPortalProps = {}) {

  // Resolve initial section from props if provided
  const resolvedInitialSection = useMemo(() => {
    if (initialSectionSlug) {
      const match = SECTIONS_DATA.find(
        (s) => s.slug === initialSectionSlug || s.id === initialSectionSlug
      );
      if (match) return match;
    }
    return SECTIONS_DATA.find((s) => s.id === 'quran') || SECTIONS_DATA[0];
  }, [initialSectionSlug]);

  // Resolve initial category from props if provided
  const resolvedInitialCategory = useMemo(() => {
    if (initialCategorySlug) {
      const match = resolvedInitialSection.categories.find(
        (c) => c.slug === initialCategorySlug || c.id === initialCategorySlug
      );
      if (match) return match;
    }
    return (
      resolvedInitialSection.categories.find((c) => c.id === 'surah-fatiha') ||
      resolvedInitialSection.categories[0]
    );
  }, [resolvedInitialSection, initialCategorySlug]);

  const [activeSectionId, setActiveSectionId] = useState<string>(resolvedInitialSection.id);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(resolvedInitialCategory.id);
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>(resolvedInitialSection.filterGroups[0] || 'সব সূরা');
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Reader, Writer & Developer Blueprint State
  const [viewMode, setViewMode] = useState<ViewMode>(
    initialViewMode || (initialArticleSlug ? 'reader' : 'magazine')
  );
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);

  // Resolve initial article ID
  const resolvedInitialArticleId = useMemo(() => {
    if (initialArticleSlug) {
      const direct = INITIAL_ARTICLES.find(
        (a) => a.slug === initialArticleSlug || a.id === initialArticleSlug
      );
      if (direct) return direct.id;
      return `synth-${resolvedInitialCategory.id}-1`;
    }
    return 'art-fatiha-1';
  }, [initialArticleSlug, resolvedInitialCategory]);

  const [selectedArticleId, setSelectedArticleId] = useState<string>(resolvedInitialArticleId);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['art-fatiha-1', 'art-baqarah-1']);
  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [directoryModalOpen, setDirectoryModalOpen] = useState<boolean>(false);
  const [socialCardModalOpen, setSocialCardModalOpen] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Global Spotlight Keyboard Listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reading Progress percentage in Reader Mode
  const [readingProgress, setReadingProgress] = useState<number>(0);

  useEffect(() => {
    if (viewMode !== 'reader') {
      setReadingProgress(0);
      return;
    }
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setReadingProgress(pct);
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [viewMode, selectedArticleId]);

  // Reading Preferences (Solid Color Themes + Font Scale)
  const [themeMode, setThemeMode] = useState<ThemeMode>('paper');
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const activeSection = useMemo(() => {
    return SECTIONS_DATA.find((s) => s.id === activeSectionId) || SECTIONS_DATA[0];
  }, [activeSectionId]);

  const filteredCategories = useMemo(() => {
    return activeSection.categories.filter((cat) => {
      const matchesGroup =
        activeGroupFilter.startsWith('সব') || cat.group === activeGroupFilter;
      const matchesSearch =
        !categorySearchQuery.trim() ||
        cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
        (cat.arabicName && cat.arabicName.includes(categorySearchQuery)) ||
        cat.shortDesc.toLowerCase().includes(categorySearchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [activeSection, activeGroupFilter, categorySearchQuery]);

  const activeCategory = useMemo(() => {
    return (
      activeSection.categories.find((c) => c.id === activeCategoryId) ||
      activeSection.categories[0]
    );
  }, [activeSection, activeCategoryId]);

  const categoryArticles = useMemo(() => {
    const matching = articles.filter(
      (a) => a.sectionId === activeSection.id && a.categoryId === activeCategory.id
    );

    if (matching.length > 0) {
      if (!globalSearchQuery.trim()) return matching;
      const q = globalSearchQuery.toLowerCase();
      return matching.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const synthesizedLead: Article = {
      id: `synth-${activeCategory.id}-1`,
      slug: `${activeCategory.slug}-overview-and-analysis`,
      title: `${activeCategory.name}: কুরআন ও সহীহ সুন্নাহর আলোকে পূর্ণাঙ্গ তাত্ত্বিক ও জীবনঘনিষ্ঠ বিশ্লেষণ`,
      subtitle: `${activeCategory.shortDesc} — প্রামাণ্য তাফসীর, সীরাত ও ফিকহ গ্রন্থের দলিলভিত্তিক পর্যালোচনা।`,
      sectionId: activeSection.id,
      categoryId: activeCategory.id,
      author: 'ড. আব্দুল্লাহ আল-মামুন',
      reviewer: 'শাইখ মুহাম্মাদ সাইফুল্লাহ',
      publishedAt: '১৭ অক্টোবর ২০২৬',
      readTime: '৯ মিনিট পাঠ',
      isLead: true,
      tags: [activeSection.name, activeCategory.name, activeCategory.group, 'মৌলিক গবেষণা'],
      citation: {
        arabic: activeCategory.arabicName || activeSection.arabicTitle,
        bengali: `${activeCategory.name} অধ্যায়ের প্রতিটি শিক্ষা মুমিনের আকীদা, আমল ও আখলাক গঠনে অপরিহার্য ভূমিকা পালন করে।`,
        reference: `${activeSection.name} বিশ্বকোষ • ${activeCategory.badge}`
      },
      summary: `${activeCategory.shortDesc} এই বিশেষ প্রবন্ধে ${activeCategory.name}-এর ঐতিহাসিক পটভূমি, মৌলিক শিক্ষাসমূহ এবং সমসাময়িক জীবনে এর বাস্তব প্রয়োগ নিয়ে বিস্তারিত আলোচনা করা হয়েছে।`,
      keyTakeaways: [
        `${activeCategory.name} বিষয়ে কুরআন ও সুন্নাহর মূল দলিলসমূহের ধারাবাহিক সংকলন।`,
        'সালাফে সালেহীন ও মুহাক্কিক আলেমগণের ব্যাখ্যার সারসংক্ষেপ।',
        'দৈনন্দিন জীবনে আমল ও আত্মশুদ্ধির সুনির্দিষ্ট দিকনির্দেশনা।'
      ],
      contentSections: [
        {
          heading: `১. ${activeCategory.name}: প্রেক্ষাপট ও মৌলিক পরিচয়`,
          body: `${activeCategory.shortDesc} ইসলামী জ্ঞানতত্ত্বে "${activeSection.name}" বিভাগের অন্তর্গত এই অধ্যায়টি অত্যন্ত তাৎপর্যপূর্ণ। প্রাথমিক যুগ থেকেই মুফাসসির, মুহাদ্দিস ও ইতিহাসবিদগণ এ বিষয়ে স্বতন্ত্র গ্রন্থ ও অধ্যায় রচনা করেছেন।`
        },
        {
          heading: '২. প্রামাণ্য দলিল ও তাৎপর্য বিশ্লেষণ',
          body: 'ইসলামের প্রতিটি শিক্ষা প্রামাণ্য সনদ ও বিশুদ্ধ ওহীর ওপর প্রতিষ্ঠিত। কোনো ব্যক্তিগত অনুমান নয়, বরং কুরআনের সুস্পষ্ট আয়াত এবং রাসূলুল্লাহ (সা.)-এর সহীহ হাদিসের সমন্বয়েই এই অধ্যায়ের মূলনীতিসমূহ নির্ধারিত হয়েছে।'
        },
        {
          heading: '৩. আমাদের সমসাময়িক জীবনে শিক্ষা ও করণীয়',
          body: 'আধুনিক যুগের নানা সংশয় ও নৈতিক সংকটের মোকাবিলায় এই মৌলিক শিক্ষাগুলো আমাদের চিন্তা ও কর্মে ভারসাম্য ফিরিয়ে আনে। নিয়মিত অধ্যয়ন ও আমলের মাধ্যমে ব্যক্তি, পরিবার ও সমাজ আলোকিত হয়।'
        }
      ],
      references: [
        `তাফসীর ইবনে কাসীর ও ফাতহুল বারী — ${activeSection.name} অধ্যায়`,
        'আল-বিদায়া ওয়ান নিহায়া — হাফেজ ইবনে কাসীর (রহ.)'
      ]
    };

    const synthesizedSecond: Article = {
      id: `synth-${activeCategory.id}-2`,
      slug: `${activeCategory.slug}-scholarly-lessons`,
      title: `${activeCategory.name} থেকে মুমিনের দৈনন্দিন জীবনের ১০টি শিক্ষা ও আমল`,
      subtitle: 'ক্লাসিক্যাল আলেমদের ব্যাখ্যা এবং আত্মগঠনে এর প্রত্যক্ষ প্রভাব।',
      sectionId: activeSection.id,
      categoryId: activeCategory.id,
      author: 'মাওলানা তানভীর আহমদ',
      reviewer: 'মুফতি যায়েদ বিন হারিস',
      publishedAt: '১২ অক্টোবর ২০২৬',
      readTime: '৬ মিনিট পাঠ',
      isLead: false,
      tags: [activeCategory.name, 'শিক্ষা ও আমল', activeCategory.group],
      citation: {
        arabic: 'وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ',
        bengali: 'আর আপনি উপদেশ দিতে থাকুন; কারণ উপদেশ মুমিনদের উপকারে আসে।',
        reference: 'সূরা আয-যারিয়াত, আয়াত: ৫৫'
      },
      summary: `${activeCategory.name} কেবল তাত্ত্বিক পাঠের বিষয় নয়; বরং একজন মুমিনের চরিত্র, ইবাদত ও চিন্তাজগৎ পরিশুদ্ধ করার এক কার্যকর পাথেয়।`,
      keyTakeaways: [
        'বিশুদ্ধ আকীদা ও আমলের সমন্বয় সাধন।',
        'পরিবার ও সমাজে কুরআন-সুন্নাহর আদর্শ ছড়িয়ে দেওয়ার কৌশল।'
      ],
      contentSections: [
        {
          heading: '১. তাত্ত্বিক জ্ঞান থেকে ব্যবহারিক জীবনে উত্তরণ',
          body: `সাহাবায়ে কিরাম ও সালাফে সালেহীন যেকোনো দ্বীনি বিষয় জানার সাথে সাথে তা নিজেদের জীবনে বাস্তবায়ন করতেন। ${activeCategory.name}-এর পাঠ আমাদের সেই কর্মমুখী ঈমানের দিকেই আহ্বান জানায়।`
        }
      ],
      references: ['রিয়াদুস সালেহীন — ইমাম নববী (রহ.)']
    };

    return [synthesizedLead, synthesizedSecond];
  }, [articles, activeSection, activeCategory, globalSearchQuery]);

  const globalSearchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (!q) return [];
    const matchedCats: { section: SectionPage; category: CategoryItem }[] = [];
    SECTIONS_DATA.forEach((sec) => {
      sec.categories.forEach((cat) => {
        if (
          cat.name.toLowerCase().includes(q) ||
          cat.shortDesc.toLowerCase().includes(q) ||
          (cat.arabicName && cat.arabicName.includes(q))
        ) {
          matchedCats.push({ section: sec, category: cat });
        }
      });
    });
    return matchedCats.slice(0, 6);
  }, [globalSearchQuery]);

  const currentArticle = useMemo(() => {
    const found =
      articles.find((a) => a.id === selectedArticleId) ||
      categoryArticles.find((a) => a.id === selectedArticleId);
    return found || categoryArticles[0];
  }, [articles, categoryArticles, selectedArticleId]);

  const relatedArticles = useMemo(() => {
    if (!currentArticle) return [];
    const list: Article[] = [];
    for (const art of categoryArticles) {
      if (art && art.id !== currentArticle.id && !list.some((x) => x.id === art.id)) {
        list.push(art);
      }
    }
    if (list.length < 3) {
      for (const art of articles) {
        if (art && art.sectionId === activeSection.id && art.id !== currentArticle.id && !list.some((x) => x.id === art.id)) {
          list.push(art);
          if (list.length >= 3) break;
        }
      }
    }
    return list.slice(0, 3);
  }, [categoryArticles, articles, currentArticle, activeSection.id]);

  const articleFaqs = useMemo(() => {
    if (!currentArticle) return [];
    if (currentArticle.faqs && currentArticle.faqs.length > 0) {
      return currentArticle.faqs;
    }
    if (currentArticle.keyTakeaways && currentArticle.keyTakeaways.length > 0) {
      return currentArticle.keyTakeaways.map((takeaway, idx) => ({
        question:
          idx === 0
            ? `${currentArticle.title}-এর মূল শিক্ষা ও তাৎপর্য কী?`
            : idx === 1
            ? `${activeCategory.name} বিষয়ে কুরআন ও সুন্নাহর মৌলিক বিধান কী?`
            : `${currentArticle.title} থেকে মুমিনের জীবনে কী আমল ও শিক্ষা গ্রহণ করা উচিত?`,
        answer: takeaway
      }));
    }
    return [];
  }, [currentArticle, activeCategory.name]);

  const handleSelectSection = (sec: SectionPage) => {
    setActiveSectionId(sec.id);
    setActiveGroupFilter(sec.filterGroups[0]);
    setCategorySearchQuery('');
    const firstCat = sec.categories[0];
    if (firstCat) {
      setActiveCategoryId(firstCat.id);
      const firstArt = articles.find(
        (a) => a.sectionId === sec.id && a.categoryId === firstCat.id
      );
      if (firstArt) {
        setSelectedArticleId(firstArt.id);
      } else {
        setSelectedArticleId(`synth-${firstCat.id}-1`);
      }
    }
    if (viewMode === 'reader') {
      setViewMode('magazine');
    }
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/${sec.slug}/`);
    }
  };

  const handleSelectCategory = (cat: CategoryItem) => {
    setActiveCategoryId(cat.id);
    setMobileSidebarOpen(false);
    const firstArt = articles.find(
      (a) => a.sectionId === activeSection.id && a.categoryId === cat.id
    );
    if (firstArt) {
      setSelectedArticleId(firstArt.id);
    } else {
      setSelectedArticleId(`synth-${cat.id}-1`);
    }
    if (viewMode === 'nextjs_code') {
      setViewMode('magazine');
    }
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/${activeSection.slug}/${cat.slug}/`);
    }
  };

  const handleOpenArticle = (art: Article) => {
    setSelectedArticleId(art.id);
    setViewMode('reader');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/${activeSection.slug}/${activeCategory.slug}/${art.slug}/`);
    }
  };

  const toggleBookmark = (artId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(artId);
      const next = exists ? prev.filter((id) => id !== artId) : [...prev, artId];
      triggerToast(
        exists
          ? 'সংরক্ষিত তালিকা থেকে সরানো হয়েছে'
          : 'প্রবন্ধটি আপনার পাঠ-তালিকায় সংরক্ষিত হয়েছে'
      );
      return next;
    });
  };

  const handleShareUrl = (slug: string) => {
    const url = `https://islam.org.bd/${activeSection.slug}/${activeCategory.slug}/${slug}`;
    try {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      // fallback ignored
    }
    setCopiedSlug(slug);
    triggerToast(`SEO লিংক কপি হয়েছে: ${url}`);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const themeClasses = {
    paper: {
      bgMain: 'bg-[#FAF8F5]',
      bgSurface: 'bg-[#FFFFFF]',
      bgMuted: 'bg-[#F2EFE9]',
      bgAccentTint: 'bg-[#E6F0EC]',
      bgWarmTint: 'bg-[#F6ECE3]',
      textPrimary: 'text-[#141615]',
      textSecondary: 'text-[#4A4F4C]',
      textMuted: 'text-[#6E7571]',
      borderStrong: 'border-[#141615]',
      borderSubtle: 'border-[#DCD7CD]',
      emeraldSolid: 'bg-[#0B4F3B] text-[#FFFFFF]',
      emeraldText: 'text-[#0B4F3B]',
      ochreSolid: 'bg-[#B85D19] text-[#FFFFFF]',
      ochreText: 'text-[#B85D19]'
    },
    sepia: {
      bgMain: 'bg-[#F3EAD8]',
      bgSurface: 'bg-[#FAF3E6]',
      bgMuted: 'bg-[#E8DEC8]',
      bgAccentTint: 'bg-[#DCE8DF]',
      bgWarmTint: 'bg-[#EFE0CC]',
      textPrimary: 'text-[#1E1912]',
      textSecondary: 'text-[#4F4437]',
      textMuted: 'text-[#736553]',
      borderStrong: 'border-[#2A2319]',
      borderSubtle: 'border-[#D4C6AE]',
      emeraldSolid: 'bg-[#0B4F3B] text-[#FFFFFF]',
      emeraldText: 'text-[#0B4F3B]',
      ochreSolid: 'bg-[#9E4B10] text-[#FFFFFF]',
      ochreText: 'text-[#9E4B10]'
    },
    dark: {
      bgMain: 'bg-[#101514]',
      bgSurface: 'bg-[#171F1D]',
      bgMuted: 'bg-[#1F2926]',
      bgAccentTint: 'bg-[#15332A]',
      bgWarmTint: 'bg-[#2B2118]',
      textPrimary: 'text-[#F2F0EA]',
      textSecondary: 'text-[#C2C8C5]',
      textMuted: 'text-[#8A9490]',
      borderStrong: 'border-[#3B4A45]',
      borderSubtle: 'border-[#26332F]',
      emeraldSolid: 'bg-[#146B50] text-[#FFFFFF]',
      emeraldText: 'text-[#4CC39A]',
      ochreSolid: 'bg-[#C86B24] text-[#FFFFFF]',
      ochreText: 'text-[#F09A56]'
    }
  }[themeMode];

  const bodyFontSizeClass =
    fontScale === 'large'
      ? 'text-lg leading-relaxed'
      : fontScale === 'xlarge'
      ? 'text-xl leading-loose'
      : 'text-base leading-relaxed';

  const leadArticle = categoryArticles[0];

  return (
    <div
      className={`min-h-screen ${themeClasses.bgMain} ${themeClasses.textPrimary} transition-colors duration-150 font-sans`}
    >

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#0B4F3B] text-[#FFFFFF] px-4 py-3 border-2 border-[#141615] shadow-lg">
          <Check className="w-4 h-4 text-[#F5EBE1] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 0. READING PROGRESS BAR IN READER MODE */}
      {viewMode === 'reader' && (
        <div
          role="progressbar"
          aria-valuenow={Math.round(readingProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="আর্টিকেল পাঠের অগ্রগতি"
          className="fixed top-0 left-0 right-0 h-1 z-50 bg-[#0B4F3B]/10 dark:bg-emerald-950/40 pointer-events-none"
        >
          <div
            className="h-full bg-gradient-to-r from-[#0B4F3B] via-[#B85D19] to-[#0B4F3B] transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* 1. TOP INTERNATIONAL MAGAZINE UTILITY BAR (SOLID DEEP EMERALD) */}
      <div className="bg-[#0B4F3B] text-[#FAF8F5] border-b border-[#083B2C]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-[#083B2C] text-[#F5EBE1] px-2.5 py-0.5 font-medium border border-[#176B52]">
              <Calendar className="w-3.5 h-3.5 text-[#E8A86B]" />
              <span>শনিবার, ১৭ অক্টোবর ২০২৬ • ৫ জমাদিউল আউয়াল ১৪৪৮ হিজরি</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[#D5E6DF]">
              <Globe className="w-3.5 h-3.5" />
              <span>আন্তর্জাতিক সংস্করণ • প্রামাণ্য ইসলামী জ্ঞানকোষ ও ম্যাগাজিন পোর্টাল</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <div
              className="flex items-center bg-[#083B2C] border border-[#176B52] p-0.5"
              role="group"
              aria-label="পাঠের থিম পরিবর্তন"
            >
              <button
                type="button"
                onClick={() => setThemeMode('paper')}
                className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                  themeMode === 'paper'
                    ? 'bg-[#FAF8F5] text-[#0B4F3B] font-semibold'
                    : 'text-[#D5E6DF] hover:text-white'
                }`}
              >
                পেপার
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('sepia')}
                className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                  themeMode === 'sepia'
                    ? 'bg-[#F3EAD8] text-[#1E1912] font-semibold'
                    : 'text-[#D5E6DF] hover:text-white'
                }`}
              >
                সেপিয়া
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-[#141615] text-[#F2F0EA] font-semibold'
                    : 'text-[#D5E6DF] hover:text-white'
                }`}
              >
                ডার্ক
              </button>
            </div>

            <div className="hidden sm:flex items-center bg-[#083B2C] border border-[#176B52] p-0.5">
              <button
                type="button"
                onClick={() => setFontScale('normal')}
                className={`px-2 py-0.5 text-xs ${
                  fontScale === 'normal'
                    ? 'bg-[#B85D19] text-white font-semibold'
                    : 'text-[#D5E6DF]'
                }`}
                title="স্বাভাবিক ফন্ট"
              >
                অ
              </button>
              <button
                type="button"
                onClick={() => setFontScale('large')}
                className={`px-2 py-0.5 text-xs ${
                  fontScale === 'large'
                    ? 'bg-[#B85D19] text-white font-semibold'
                    : 'text-[#D5E6DF]'
                }`}
                title="বড় ফন্ট"
              >
                অ+
              </button>
              <button
                type="button"
                onClick={() => setFontScale('xlarge')}
                className={`px-2 py-0.5 text-xs ${
                  fontScale === 'xlarge'
                    ? 'bg-[#B85D19] text-white font-semibold'
                    : 'text-[#D5E6DF]'
                }`}
                title="অতি বড় ফন্ট"
              >
                অ++
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowBookmarksDrawer(!showBookmarksDrawer)}
              className="inline-flex items-center gap-1.5 bg-[#083B2C] hover:bg-[#125E46] text-[#FAF8F5] px-2.5 py-1 border border-[#176B52] text-xs font-medium"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#E8A86B]" />
              <span>সংরক্ষিত ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRAYER TIMES & HIJRI CALENDAR WIDGET */}
      <PrayerTimesAndHijriWidget themeMode={themeMode} />

      {/* 2. EDITORIAL MASTHEAD HEADER WITH "ইসলাম" & GEOMETRIC VISUALIZATION */}
      <header className={`${themeClasses.bgSurface} border-b-2 ${themeClasses.borderStrong}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-5 sm:py-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex items-center gap-4 border-l-4 border-[#0B4F3B] pl-4">
              <IslamicGeometricEmblem
                size={52}
                primaryColor="#0B4F3B"
                accentColor="#B85D19"
                surfaceColor={themeMode === 'dark' ? '#171F1D' : '#FAF8F5'}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 bg-[#0B4F3B] text-white">
                    আল-হিকমাহ ও আল-ইলম
                  </span>
                  <span className={`text-xs font-medium ${themeClasses.ochreText}`}>
                    • সনদভিত্তিক প্রকাশনা
                  </span>
                </div>
                <p className={`text-xs sm:text-sm mt-1.5 font-medium ${themeClasses.textSecondary}`}>
                  কুরআন, সহীহ হাদিস, আকীদা, নবী ও সাহাবীদের জীবনীর আন্তর্জাতিক মানের গবেষণাধর্মী ডিজিটাল ম্যাগাজিন।
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 text-center flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-3 mb-1">
                <span className="h-[2px] w-8 bg-[#B85D19] inline-block" />
                <span className="font-arabic text-lg sm:text-xl text-[#B85D19] font-bold tracking-wide">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                <span className="h-[2px] w-8 bg-[#B85D19] inline-block" />
              </div>

              <button
                type="button"
                onClick={() => setViewMode('magazine')}
                className="group focus:outline-none"
              >
                <div className="flex items-center justify-center gap-3">
                  <h1 className="font-editorial text-5xl sm:text-6xl font-extrabold tracking-tight text-[#0B4F3B] dark:text-[#4CC39A] group-hover:opacity-90">
                    ইসলাম
                  </h1>
                  <span className="bg-[#141615] text-[#FAF8F5] font-arabic text-xl sm:text-2xl px-3 py-1 border-2 border-[#B85D19]">
                    الإسلام
                  </span>
                </div>
              </button>

              <p className={`text-xs mt-1.5 tracking-wide ${themeClasses.textMuted}`}>
                সত্য, প্রজ্ঞা ও শাশ্বত জীবনাদর্শের প্রামাণ্য ওয়েব পোর্টাল • ISLAM EDITORIAL PORTAL
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <div className="relative flex-1 max-w-md">
                <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${themeClasses.textMuted}`} />
                <input
                  type="text"
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  placeholder="সূরা, হাদিস, নবী, সাহাবী বা প্রবন্ধ খুঁজুন"
                  aria-label="পোর্টাল অনুসন্ধান"
                  className={`w-full pl-10 pr-16 py-2.5 text-sm ${themeClasses.bgMuted} ${themeClasses.textPrimary} border ${themeClasses.borderStrong} focus:outline-none focus:border-[#0B4F3B]`}
                />
                {!globalSearchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchModalOpen(true)}
                    title="স্পটলাইট ও কিবোর্ড সার্চ খুলুন (Ctrl+K)"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-[#0B4F3B] dark:text-emerald-300 border border-emerald-700/30 rounded hover:bg-emerald-200 transition-colors"
                  >
                    <span>⌘K</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setGlobalSearchQuery('')}
                    aria-label="অনুসন্ধান মুছুন"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 bg-[#B85D19] text-white"
                  >
                    ✕
                  </button>
                )}

                {globalSearchResults.length > 0 && (
                  <div
                    className={`absolute left-0 right-0 top-full mt-1 z-40 ${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} shadow-xl`}
                  >
                    <div className="px-3 py-1.5 bg-[#0B4F3B] text-white text-xs font-semibold flex justify-between">
                      <span>দ্রুত ক্যাটেগরি ফলাফল ({globalSearchResults.length})</span>
                      <span>ক্লিক করে যান</span>
                    </div>
                    {globalSearchResults.map(({ section, category }) => (
                      <button
                        key={`${section.id}-${category.id}`}
                        type="button"
                        onClick={() => {
                          setActiveSectionId(section.id);
                          setActiveGroupFilter(section.filterGroups[0]);
                          setActiveCategoryId(category.id);
                          setGlobalSearchQuery('');
                          setViewMode('magazine');
                        }}
                        className={`w-full text-left px-3.5 py-2.5 border-b ${themeClasses.borderSubtle} hover:${themeClasses.bgAccentTint} flex items-center justify-between gap-2`}
                      >
                        <div>
                          <div className="text-sm font-bold">{category.name}</div>
                          <div className={`text-xs ${themeClasses.textMuted}`}>
                            পেইজ: {section.name} • {category.badge}
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#0B4F3B] shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/prayer-times/"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-bold bg-[#FAF8F5] dark:bg-[#111615] hover:bg-[#F2EFE9] text-[#0B4F3B] dark:text-[#4CC39A] border-2 border-[#141615] transition-colors shrink-0 shadow-[2px_2px_0px_#141615]"
                title="বাংলাদেশের ৬৪ জেলার সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার"
              >
                <Calendar className="w-4 h-4 text-[#B85D19]" />
                <span className="hidden sm:inline">সালাতের সময়সূচি</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. HORIZONTAL SINGLE-LINE PAGE NAVIGATION BAR (LEFT TO RIGHT) */}
        <nav
          aria-label="প্রধান পেইজ নেভিগেশন"
          className={`${themeClasses.bgMuted} border-t-2 ${themeClasses.borderStrong}`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden inline-flex items-center gap-2 py-3 pr-4 font-bold text-sm text-[#0B4F3B] border-r border-[#DCD7CD] shrink-0"
            >
              <Menu className="w-4 h-4" />
              <span>ক্যাটেগরি তালিকা</span>
            </button>

            <div className="flex items-center overflow-x-auto no-scrollbar divide-x divide-[#DCD7CD] dark:divide-[#26332F] w-full">
              {/* MEGA DIRECTORY BUTTON */}
              <button
                type="button"
                onClick={() => setDirectoryModalOpen(true)}
                className="px-4 sm:px-5 py-3.5 bg-[#B85D19] hover:bg-[#9B4E15] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 border-r-2 border-[#141615] transition-colors shadow-inner"
                title="সকল ৯টি বিভাগ ও ২৪২টি ক্যাটেগরির ডিরেক্টরি সূচি"
              >
                <Layers className="w-4 h-4 text-[#F5EBE1]" />
                <span className="hidden sm:inline">সকল বিভাগ ও ডিরেক্টরি</span>
                <span className="sm:hidden">ডিরেক্টরি</span>
              </button>

              {SECTIONS_DATA.map((sec, idx) => {
                const isActive = sec.id === activeSection.id;
                return (
                  <Link
                    key={sec.id}
                    href={`/${sec.slug}/`}
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        handleSelectSection(sec);
                      }
                    }}
                    className={`group relative px-5 sm:px-6 py-3.5 flex items-center gap-2.5 text-left transition-colors shrink-0 ${
                      isActive
                        ? 'bg-[#0B4F3B] text-[#FFFFFF] font-bold'
                        : `hover:${themeClasses.bgSurface} ${themeClasses.textPrimary} font-semibold`
                    }`}
                  >
                    <span
                      className={`text-xs font-mono px-1.5 py-0.5 border ${
                        isActive
                          ? 'bg-[#083B2C] text-[#F5EBE1] border-[#176B52]'
                          : 'bg-[#FAF8F5] text-[#4A4F4C] border-[#DCD7CD] dark:bg-[#171F1D] dark:text-[#C2C8C5]'
                      }`}
                    >
                      ০{idx + 1}
                    </span>
                    <div>
                      <div className="text-base sm:text-[17px] leading-tight tracking-tight flex items-center gap-2">
                        <span>{sec.name}</span>
                        <span
                          className={`font-arabic text-sm font-normal ${
                            isActive ? 'text-[#E8A86B]' : themeClasses.textMuted
                          }`}
                        >
                          {sec.arabicTitle}
                        </span>
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          isActive ? 'text-[#D5E6DF]' : themeClasses.textMuted
                        }`}
                      >
                        {sec.categories.length}টি ক্যাটেগরি
                      </div>
                    </div>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#B85D19]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* ACTIVE PAGE SUB-BANNER */}
      <div className={`${themeClasses.bgWarmTint} border-b ${themeClasses.borderSubtle}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
              সক্রিয় পেইজ: {activeSection.name}
            </span>
            <ChevronRight className="w-4 h-4 text-[#B85D19]" />
            <span className="font-semibold">{activeCategory.name}</span>
            <span className={`hidden md:inline ${themeClasses.textSecondary}`}>
              — {activeSection.tagline}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#0B4F3B] text-white text-xs font-bold border border-[#083B2C]">
              {activeCategory.articleCount}টি প্রামাণ্য প্রবন্ধ
            </span>
          </div>
        </div>
      </div>

      {/* 4. MAIN 12-COLUMN MAGAZINE PORTAL LAYOUT */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* SECTION HERO BANNER WITH AUTHENTIC QURANIC CITATION & KEY STATS */}
        <SectionHeroBanner
          section={activeSection}
          themeMode={themeMode}
          onOpenDirectory={() => setDirectoryModalOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT VERTICAL CATEGORY SIDEBAR */}
          <aside
            aria-label="পেইজ ভিত্তিক ক্যাটেগরি তালিকা"
            className={`lg:col-span-3 ${
              mobileSidebarOpen ? 'block' : 'hidden lg:block'
            } ${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} sticky top-4`}
          >
            <div className="bg-[#141615] text-[#FAF8F5] p-4 border-b-2 border-[#B85D19]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#E8A86B]" />
                  <h2 className="font-editorial text-lg font-bold tracking-tight">
                    {activeSection.name} — ক্যাটেগরি সূচি
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="lg:hidden text-xs px-2 py-1 bg-[#B85D19] text-white"
                >
                  বন্ধ করুন
                </button>
              </div>
              <p className="text-xs text-[#C2C8C5] mt-1">
                বাম পাশের যেকোনো ক্যাটেগরিতে ক্লিক করে প্রবন্ধ পড়ুন ও লিখুন
              </p>
            </div>

            <div className={`p-3.5 border-b ${themeClasses.borderSubtle} ${themeClasses.bgMuted}`}>
              <div className="relative">
                <ListFilter className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${themeClasses.textMuted}`} />
                <input
                  type="text"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  placeholder={`${activeSection.name}-এর ক্যাটেগরি ফিল্টার করুন`}
                  className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm ${themeClasses.bgSurface} ${themeClasses.textPrimary} border ${themeClasses.borderSubtle} focus:outline-none focus:border-[#0B4F3B]`}
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {activeSection.filterGroups.map((grp) => {
                  const active = activeGroupFilter === grp;
                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setActiveGroupFilter(grp)}
                      className={`px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                        active
                          ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                          : `${themeClasses.bgSurface} ${themeClasses.textSecondary} ${themeClasses.borderSubtle} hover:border-[#0B4F3B]`
                      }`}
                    >
                      {grp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="divide-y divide-[#DCD7CD] dark:divide-[#26332F] max-h-[680px] overflow-y-auto">
              {filteredCategories.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#6E7571]">
                  এই নামে কোনো ক্যাটেগরি পাওয়া যায়নি।
                </div>
              ) : (
                filteredCategories.map((cat, idx) => {
                  const isSelected = cat.id === activeCategory.id;
                  return (
                    <Link
                      key={cat.id}
                      href={`/${activeSection.slug}/${cat.slug}/`}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          handleSelectCategory(cat);
                        }
                      }}
                      className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-3 relative block ${
                        isSelected
                          ? `${themeClasses.bgAccentTint} font-bold`
                          : `hover:${themeClasses.bgMuted}`
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0B4F3B]" />
                      )}

                      <div className="pl-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#B85D19]">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <span className="text-sm sm:text-[15px] font-bold leading-snug">
                            {cat.name}
                          </span>
                        </div>
                        {cat.arabicName && (
                          <div className="font-arabic text-sm text-[#0B4F3B] dark:text-[#4CC39A] mt-0.5 pl-6">
                            {cat.arabicName}
                          </div>
                        )}
                        <p className={`text-xs ${themeClasses.textMuted} mt-1 pl-6 line-clamp-2`}>
                          {cat.shortDesc}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span
                          className={`text-[11px] px-2 py-0.5 font-semibold border ${
                            isSelected
                              ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                              : `${themeClasses.bgMuted} ${themeClasses.textSecondary} ${themeClasses.borderSubtle}`
                          }`}
                        >
                          {cat.articleCount} প্রবন্ধ
                        </span>
                        <span className={`text-[10px] mt-1 ${themeClasses.textMuted}`}>
                          {cat.badge}
                        </span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <div className={`p-3.5 border-t-2 ${themeClasses.borderStrong} ${themeClasses.bgMuted} text-xs flex items-center justify-between`}>
              <span className="font-semibold">মোট ক্যাটেগরি: {activeSection.categories.length}টি</span>
              <button
                type="button"
                onClick={() => setViewMode('writer')}
                className="font-bold text-[#0B4F3B] dark:text-[#4CC39A] underline"
              >
                + আর্টিকেল যুক্ত করুন
              </button>
            </div>
          </aside>

          {/* CENTER 6 COLUMNS: EDITORIAL MAGAZINE / ARTICLE READER / WRITER */}
          <section className="lg:col-span-6 space-y-6">
            <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} p-5 sm:p-6`}>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#DCD7CD] dark:border-[#26332F]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#0B4F3B] text-white text-xs font-bold uppercase">
                    {activeSection.name}
                  </span>
                  <span className="px-2.5 py-1 bg-[#B85D19] text-white text-xs font-bold">
                    {activeCategory.badge}
                  </span>
                  <span className={`text-xs font-medium ${themeClasses.textMuted}`}>
                    {activeCategory.metaInfo}
                  </span>
                </div>

                <div className={`flex items-center border ${themeClasses.borderStrong}`}>
                  <button
                    type="button"
                    onClick={() => setViewMode('magazine')}
                    className={`px-3 py-1 text-xs font-bold ${
                      viewMode === 'magazine'
                        ? 'bg-[#141615] text-white'
                        : `${themeClasses.bgSurface} ${themeClasses.textPrimary}`
                    }`}
                  >
                    ম্যাগাজিন ভিউ
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('reader')}
                    className={`px-3 py-1 text-xs font-bold border-l ${themeClasses.borderStrong} ${
                      viewMode === 'reader'
                        ? 'bg-[#141615] text-white'
                        : `${themeClasses.bgSurface} ${themeClasses.textPrimary}`
                    }`}
                  >
                    আর্টিকেল রিডার
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {activeCategory.name}
                  </h2>
                  <p className={`text-sm mt-1.5 ${themeClasses.textSecondary}`}>
                    {activeCategory.shortDesc}
                  </p>
                </div>
                {activeCategory.arabicName && (
                  <div className="px-4 py-2.5 bg-[#F2EFE9] dark:bg-[#1F2926] border-l-4 border-[#0B4F3B] shrink-0 text-right">
                    <span className="font-arabic text-2xl sm:text-3xl font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                      {activeCategory.arabicName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {viewMode === 'magazine' && leadArticle && (
              <div className="space-y-6">
                <article
                  className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} overflow-hidden`}
                >
                  <div className="bg-[#0B4F3B] text-white px-5 py-2 flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#E8A86B]" />
                      <span>প্রধান প্রচ্ছদ প্রবন্ধ • LEAD EDITORIAL FEATURE</span>
                    </span>
                    <span>{leadArticle.readTime}</span>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {leadArticle.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs font-bold px-2.5 py-0.5 ${themeClasses.bgWarmTint} ${themeClasses.ochreText} border border-[#B85D19]`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold leading-snug">
                      <Link
                        href={`/${activeSection.slug}/${activeCategory.slug}/${leadArticle.slug}/`}
                        onClick={(e) => {
                          if (!e.metaKey && !e.ctrlKey) {
                            e.preventDefault();
                            handleOpenArticle(leadArticle);
                          }
                        }}
                        className="text-left hover:text-[#0B4F3B] dark:hover:text-[#4CC39A] transition-colors block"
                      >
                        {leadArticle.title}
                      </Link>
                    </h3>

                    <p className={`text-base mt-2.5 font-medium ${themeClasses.textSecondary}`}>
                      {leadArticle.subtitle}
                    </p>

                    {leadArticle.featuredImage?.url && (
                      <figure className="my-5 border-2 border-[#141615] overflow-hidden bg-[#FAF8F5] dark:bg-[#1A2421]">
                        <img
                          src={leadArticle.featuredImage.url}
                          alt={leadArticle.featuredImage.alt || leadArticle.title}
                          className="w-full h-auto object-cover max-h-[380px]"
                        />
                        {(leadArticle.featuredImage.caption || leadArticle.featuredImage.sourceTitle) && (
                          <figcaption className="text-xs p-2.5 text-[#6E7571] dark:text-[#9BA39F] flex flex-wrap items-center justify-between gap-2 border-t border-[#DCD7CD] dark:border-[#2A3834]">
                            {leadArticle.featuredImage.caption && (
                              <span className="font-medium italic">{leadArticle.featuredImage.caption}</span>
                            )}
                            {leadArticle.featuredImage.sourceTitle && (
                              <span className="flex items-center gap-1 ml-auto">
                                <span>উৎস:</span>
                                {leadArticle.featuredImage.sourceUrl ? (
                                  <a
                                    href={leadArticle.featuredImage.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0B4F3B] dark:text-[#4CC39A] underline hover:text-[#B85D19]"
                                  >
                                    {leadArticle.featuredImage.sourceTitle}
                                  </a>
                                ) : (
                                  <span className="font-semibold">{leadArticle.featuredImage.sourceTitle}</span>
                                )}
                              </span>
                            )}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    <div
                      className={`my-5 p-5 ${themeClasses.bgMuted} border-l-4 border-[#0B4F3B] space-y-2`}
                    >
                      <p
                        dir="rtl"
                        className="font-arabic text-2xl sm:text-[26px] leading-loose text-[#0B4F3B] dark:text-[#4CC39A] font-bold"
                      >
                        {leadArticle.citation.arabic}
                      </p>
                      <p className={`text-sm sm:text-base font-semibold ${themeClasses.textPrimary}`}>
                        “{leadArticle.citation.bengali}”
                      </p>
                      <div className={`text-xs font-bold ${themeClasses.ochreText}`}>
                        — {leadArticle.citation.reference}
                      </div>
                    </div>

                    <p className={`${bodyFontSizeClass} ${themeClasses.textSecondary}`}>
                      {leadArticle.summary}
                    </p>

                    <div
                      className={`mt-6 pt-4 border-t ${themeClasses.borderSubtle} flex flex-wrap items-center justify-between gap-4`}
                    >
                      <div className="text-xs">
                        <div className="font-bold">লেখক: {leadArticle.author}</div>
                        <div className={themeClasses.textMuted}>
                          নিরীক্ষণ: {leadArticle.reviewer} • {leadArticle.publishedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(leadArticle.id)}
                          className={`px-3 py-2 text-xs font-bold border ${themeClasses.borderStrong} flex items-center gap-1.5 ${
                            bookmarkedIds.includes(leadArticle.id)
                              ? 'bg-[#B85D19] text-white'
                              : `${themeClasses.bgSurface}`
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>
                            {bookmarkedIds.includes(leadArticle.id) ? 'সংরক্ষিত' : 'সংরক্ষণ'}
                          </span>
                        </button>

                        <Link
                          href={`/${activeSection.slug}/${activeCategory.slug}/${leadArticle.slug}/`}
                          onClick={(e) => {
                            if (!e.metaKey && !e.ctrlKey) {
                              e.preventDefault();
                              handleOpenArticle(leadArticle);
                            }
                          }}
                          className="px-4 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border border-[#141615] inline-flex items-center gap-1.5"
                        >
                          <span>সম্পূর্ণ প্রবন্ধ পড়ুন</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>

                <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} p-5 sm:p-6`}>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#141615]">
                    <h3 className="font-editorial text-lg font-extrabold flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#0B4F3B]" />
                      <span>{activeCategory.name} — ধারাবাহিক প্রবন্ধ ও তাফসীর তালিকা</span>
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 bg-[#F2EFE9] dark:bg-[#1F2926] text-[#B85D19]">
                      মোট {categoryArticles.length}টি প্রবন্ধ প্রদর্শিত
                    </span>
                  </div>

                  <div className="divide-y divide-[#DCD7CD] dark:divide-[#26332F]">
                    {categoryArticles.map((art, index) => (
                      <div
                        key={art.id}
                        className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-[#141615] text-white font-mono font-bold">
                              প্রবন্ধ ০{index + 1}
                            </span>
                            <span className={`font-bold ${themeClasses.ochreText}`}>
                              {art.publishedAt}
                            </span>
                            <span className={themeClasses.textMuted}>• {art.readTime}</span>
                          </div>
                          <h4 className="font-editorial text-lg sm:text-xl font-bold leading-snug">
                            <Link
                              href={`/${activeSection.slug}/${activeCategory.slug}/${art.slug}/`}
                              onClick={(e) => {
                                if (!e.metaKey && !e.ctrlKey) {
                                  e.preventDefault();
                                  handleOpenArticle(art);
                                }
                              }}
                              className="text-left hover:text-[#0B4F3B] dark:hover:text-[#4CC39A] block"
                            >
                              {art.title}
                            </Link>
                          </h4>
                          <p className={`text-sm ${themeClasses.textSecondary} line-clamp-2`}>
                            {art.subtitle}
                          </p>
                          <div className={`text-xs ${themeClasses.textMuted}`}>
                            লেখক: <span className="font-semibold">{art.author}</span>
                          </div>
                        </div>

                        {art.featuredImage?.url && (
                          <div className="w-20 h-20 sm:w-24 sm:h-20 shrink-0 border border-[#141615] overflow-hidden bg-[#FAF8F5] dark:bg-[#1F2926] hidden sm:block self-center">
                            <img
                              src={art.featuredImage.url}
                              alt={art.featuredImage.alt || art.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                          <Link
                            href={`/${activeSection.slug}/${activeCategory.slug}/${art.slug}/`}
                            onClick={(e) => {
                              if (!e.metaKey && !e.ctrlKey) {
                                e.preventDefault();
                                handleOpenArticle(art);
                              }
                            }}
                            className="px-3.5 py-1.5 bg-[#0B4F3B] text-white text-xs font-bold hover:bg-[#083B2C] inline-block"
                          >
                            পাঠ করুন →
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleShareUrl(art.slug)}
                            className={`px-2.5 py-1 text-[11px] border ${themeClasses.borderSubtle} flex items-center gap-1`}
                          >
                            <Share2 className="w-3 h-3" />
                            <span>{copiedSlug === art.slug ? 'কপি হয়েছে' : 'SEO লিংক'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'reader' && currentArticle && (
              <article
                className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} p-5 sm:p-8 space-y-6`}
              >
                {/* Semantic Breadcrumbs for Navigation & Google Structured Snippet Context */}
                <nav aria-label="ব্রেডক্রাম্ব" className="w-full text-xs flex flex-wrap items-center gap-1.5 pb-3 border-b border-[#DCD7CD] dark:border-[#26332F] text-[#6E7571] dark:text-[#9BA39F]">
                  <Link href="/" className="hover:underline text-[#0B4F3B] dark:text-[#4CC39A] font-medium">হোম</Link>
                  <span>/</span>
                  <Link href={`/${activeSection.slug}/`} className="hover:underline text-[#0B4F3B] dark:text-[#4CC39A] font-medium">{activeSection.name}</Link>
                  <span>/</span>
                  <Link href={`/${activeSection.slug}/${activeCategory.slug}/`} className="hover:underline text-[#0B4F3B] dark:text-[#4CC39A] font-medium">{activeCategory.name}</Link>
                  <span>/</span>
                  <span className="font-semibold text-[#141615] dark:text-[#FAF8F5] truncate max-w-[280px] sm:max-w-md">{currentArticle.title}</span>
                </nav>

                <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 ${themeClasses.borderStrong}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('magazine');
                      if (typeof window !== 'undefined') {
                        window.history.pushState(null, '', `/${activeSection.slug}/${activeCategory.slug}/`);
                      }
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B4F3B] dark:text-[#4CC39A]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>ম্যাগাজিন গ্রিডে ফিরে যান</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSocialCardModalOpen(true)}
                      title="সোশ্যাল মিডিয়া ও দাওয়াহ পোস্টের জন্য সুন্দর উদ্ধৃতি কার্ড তৈরি করুন"
                      className="px-3 py-1.5 text-xs font-bold border border-[#0B4F3B] bg-emerald-50 dark:bg-emerald-950/50 text-[#0B4F3B] dark:text-emerald-300 inline-flex items-center gap-1.5 hover:bg-[#0B4F3B] hover:text-white transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B85D19]" />
                      <span>সোশ্যাল কার্ড</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(currentArticle.id)}
                      className={`px-3 py-1.5 text-xs font-bold border ${themeClasses.borderStrong} inline-flex items-center gap-1.5 ${
                        bookmarkedIds.includes(currentArticle.id)
                          ? 'bg-[#B85D19] text-white'
                          : ''
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>
                        {bookmarkedIds.includes(currentArticle.id) ? 'সংরক্ষিত' : 'বুকমার্ক'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShareUrl(currentArticle.slug)}
                      className={`px-3 py-1.5 text-xs font-bold border ${themeClasses.borderStrong} inline-flex items-center gap-1.5`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>শেয়ার লিংক</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="px-2.5 py-0.5 bg-[#0B4F3B] text-white">
                      {activeSection.name}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#B85D19] text-white">
                      {activeCategory.name}
                    </span>
                    <span className={themeClasses.textMuted}>
                      • প্রকাশকাল: {currentArticle.publishedAt} • {currentArticle.readTime}
                    </span>
                  </div>

                  <h1 className="font-editorial text-2xl sm:text-4xl font-extrabold leading-tight">
                    {currentArticle.title}
                  </h1>

                  <p className={`text-base sm:text-lg font-medium ${themeClasses.textSecondary}`}>
                    {currentArticle.subtitle}
                  </p>

                  <div
                    className={`p-3.5 ${themeClasses.bgMuted} border ${themeClasses.borderSubtle} flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#0B4F3B]" />
                      <span>
                        <strong>গবেষণা ও রচনা:</strong> {currentArticle.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#B85D19]" />
                      <span>
                        <strong>তাহকীক ও সম্পাদনা:</strong> {currentArticle.reviewer}
                      </span>
                    </div>
                  </div>
                </div>

                {currentArticle.featuredImage?.url && (
                  <figure className="space-y-2 border-2 border-[#141615] bg-[#FAF8F5] dark:bg-[#1A2421] p-2 shadow-sm">
                    <img
                      src={currentArticle.featuredImage.url}
                      alt={currentArticle.featuredImage.alt || currentArticle.title}
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                    {(currentArticle.featuredImage.caption || currentArticle.featuredImage.sourceTitle) && (
                      <figcaption className="text-xs text-[#6E7571] dark:text-[#9BA39F] flex flex-wrap items-center justify-between gap-2 px-1">
                        {currentArticle.featuredImage.caption && (
                          <span className="font-medium italic">{currentArticle.featuredImage.caption}</span>
                        )}
                        {currentArticle.featuredImage.sourceTitle && (
                          <span className="flex items-center gap-1 ml-auto">
                            <span>উৎস:</span>
                            {currentArticle.featuredImage.sourceUrl ? (
                              <a
                                href={currentArticle.featuredImage.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0B4F3B] dark:text-[#4CC39A] underline hover:text-[#B85D19]"
                              >
                                {currentArticle.featuredImage.sourceTitle}
                              </a>
                            ) : (
                              <span className="font-semibold">{currentArticle.featuredImage.sourceTitle}</span>
                            )}
                          </span>
                        )}
                      </figcaption>
                    )}
                  </figure>
                )}

                <div className={`p-6 ${themeClasses.bgAccentTint} border-2 border-[#0B4F3B] space-y-3`}>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                    <span>মূল দলিল ও উদ্ধৃতি</span>
                    <span>{currentArticle.citation.reference}</span>
                  </div>
                  <p
                    dir="rtl"
                    className="font-arabic text-2xl sm:text-3xl leading-loose font-bold text-[#0B4F3B] dark:text-[#4CC39A]"
                  >
                    {currentArticle.citation.arabic}
                  </p>
                  {currentArticle.citation.transliteration && (
                    <p className={`text-xs sm:text-sm italic ${themeClasses.textSecondary}`}>
                      উচ্চারণ: {currentArticle.citation.transliteration}
                    </p>
                  )}
                  <p className="text-base sm:text-lg font-bold">
                    অনুবাদ: “{currentArticle.citation.bengali}”
                  </p>
                </div>

                <div className={`p-5 ${themeClasses.bgWarmTint} border-l-4 border-[#B85D19] space-y-2`}>
                  <h3 className="font-editorial text-base font-extrabold text-[#B85D19] flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>প্রবন্ধের মূল শিক্ষা ও সারসংক্ষেপ</span>
                  </h3>
                  <ul className="space-y-1.5 text-sm list-disc pl-5">
                    {currentArticle.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="font-medium">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sitelink-Enabled Table of Contents (TOC) for Search Snippets & Reader Navigation */}
                {currentArticle.contentSections && currentArticle.contentSections.length > 1 && (
                  <nav aria-label="সূচিপত্র" className={`p-4 sm:p-5 ${themeClasses.bgMuted} border-2 border-emerald-800/20 dark:border-emerald-500/20 space-y-3`}>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] uppercase tracking-wider">
                      <List className="w-4 h-4" />
                      <span>প্রবন্ধের সূচিপত্র ও বিষয়বস্তু (Table of Contents)</span>
                    </div>
                    <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium">
                      {currentArticle.contentSections.map((sec, sIdx) => (
                        <li key={sIdx}>
                          <a
                            href={`#anushched-${sIdx + 1}`}
                            className="inline-flex items-center gap-2 hover:text-[#0B4F3B] dark:hover:text-[#4CC39A] hover:underline"
                          >
                            <span className="w-5 h-5 flex items-center justify-center bg-[#0B4F3B] text-white text-[11px] font-mono font-bold shrink-0">
                              {sIdx + 1}
                            </span>
                            <span className="truncate">{sec.heading}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                <div className={`space-y-6 ${bodyFontSizeClass}`}>
                  {currentArticle.contentSections.map((sec, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2
                        id={`anushched-${idx + 1}`}
                        className="group font-editorial text-xl sm:text-2xl font-bold text-[#0B4F3B] dark:text-[#4CC39A] border-b pb-1.5 border-[#DCD7CD] dark:border-[#26332F] flex items-center justify-between scroll-mt-24"
                      >
                        <span>{sec.heading}</span>
                        <a
                          href={`#anushched-${idx + 1}`}
                          title={`অণুচ্ছেদ ${idx + 1} সরাসরি লিংক কপি করুন`}
                          aria-label={`অণুচ্ছেদ ${idx + 1} সরাসরি লিংক`}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs px-2 py-0.5 border border-[#0B4F3B]/30 text-[#0B4F3B] dark:text-[#4CC39A] hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-opacity flex items-center gap-1"
                        >
                          <Hash className="w-3 h-3" />
                          <span>লিংক</span>
                        </a>
                      </h2>
                      <div className={`${themeClasses.textPrimary} leading-relaxed space-y-3`}>
                        {sec.body.split(/(\[(?:কুরআন|হাদিস|মাসআলা|উক্তি|সতর্কতা):[\s\S]*?\[\/(?:কুরআন|হাদিস|মাসআলা|উক্তি|সতর্কতা)\]|\[ছবি:[\s\S]*?\])/g).map((part, pIdx) => {
                          const quranMatch = part.match(/\[কুরআন:\s*([^\]]*)\]([\s\S]*?)\[\/কুরআন\]/);
                          if (quranMatch) {
                            const ref = quranMatch[1];
                            const content = quranMatch[2];
                            const arabicMatch = content.match(/আরবী:\s*(.*)/);
                            const translitMatch = content.match(/উচ্চারণ:\s*(.*)/);
                            const bengaliMatch = content.match(/অনুবাদ:\s*(.*)/);

                            return (
                              <div key={pIdx} className={`my-4 p-5 ${themeClasses.bgAccentTint} border-2 border-[#0B4F3B] space-y-2.5`}>
                                <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] pb-1 border-b border-[#0B4F3B]/20">
                                  <span>পবিত্র কুরআন থেকে উদ্ধৃতি</span>
                                  <span className="font-mono">{ref}</span>
                                </div>
                                {arabicMatch && (
                                  <p dir="rtl" className="font-arabic text-2xl leading-loose font-bold text-[#0B4F3B] dark:text-[#4CC39A] text-right">
                                    {arabicMatch[1]}
                                  </p>
                                )}
                                {translitMatch && (
                                  <p className={`text-xs italic ${themeClasses.textSecondary}`}>
                                    উচ্চারণ: {translitMatch[1]}
                                  </p>
                                )}
                                {bengaliMatch && (
                                  <p className="text-sm sm:text-base font-semibold leading-relaxed">
                                    {bengaliMatch[1]}
                                  </p>
                                )}
                              </div>
                            );
                          }

                          const hadithMatch = part.match(/\[হাদিস:\s*([^\]]*)\]([\s\S]*?)\[\/হাদিস\]/);
                          if (hadithMatch) {
                            const header = hadithMatch[1];
                            const content = hadithMatch[2];
                            const arabicMatch = content.match(/মতন:\s*(.*)/);
                            const narratorMatch = content.match(/রাবী:\s*(.*)/);
                            const bengaliMatch = content.match(/অনুবাদ:\s*(.*)/);

                            return (
                              <div key={pIdx} className={`my-4 p-5 ${themeClasses.bgWarmTint} border-l-4 border-[#B85D19] space-y-2.5`}>
                                <div className="flex items-center justify-between text-xs font-bold text-[#B85D19] pb-1 border-b border-[#B85D19]/20">
                                  <span>হাদিস শরীফ রেফারেন্স</span>
                                  <span className="font-mono">{header}</span>
                                </div>
                                {arabicMatch && (
                                  <p dir="rtl" className="font-arabic text-xl leading-loose font-bold text-right">
                                    {arabicMatch[1]}
                                  </p>
                                )}
                                {narratorMatch && (
                                  <p className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                                    {narratorMatch[1]}
                                  </p>
                                )}
                                {bengaliMatch && (
                                  <p className="text-sm sm:text-base font-medium leading-relaxed">
                                    {bengaliMatch[1]}
                                  </p>
                                )}
                              </div>
                            );
                          }

                          const fiqhMatch = part.match(/\[মাসআলা:\s*([^\]]*)\]([\s\S]*?)\[\/মাসআলা\]/);
                          if (fiqhMatch) {
                            const header = fiqhMatch[1];
                            const content = fiqhMatch[2];

                            return (
                              <div key={pIdx} className={`my-4 p-4 ${themeClasses.bgMuted} border border-[#B85D19] space-y-1.5`}>
                                <div className="flex items-center justify-between text-xs font-bold text-[#B85D19]">
                                  <span>ফিকহী হুকুম ও মাসআলা</span>
                                  <span className="font-mono bg-[#B85D19] text-white px-2 py-0.5">{header}</span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line">
                                  {content.trim()}
                                </p>
                              </div>
                            );
                          }

                          const quoteMatch = part.match(/\[উক্তি:\s*([^\]]*)\]([\s\S]*?)\[\/উক্তি\]/);
                          if (quoteMatch) {
                            const header = quoteMatch[1];
                            const content = quoteMatch[2];

                            return (
                              <div key={pIdx} className={`my-4 p-4 ${themeClasses.bgAccentTint} border-l-4 border-[#0B4F3B] space-y-1.5`}>
                                <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                                  <span>সালাফে সালেহীনের প্রজ্ঞাময় উক্তি</span>
                                  <span className="font-mono">{header}</span>
                                </div>
                                <p className="text-sm font-serif italic leading-relaxed whitespace-pre-line">
                                  “{content.trim()}”
                                </p>
                              </div>
                            );
                          }

                          const warningMatch = part.match(/\[সতর্কতা:\s*([^\]]*)\]([\s\S]*?)\[\/সতর্কতা\]/);
                          if (warningMatch) {
                            const header = warningMatch[1];
                            const content = warningMatch[2];

                            return (
                              <div key={pIdx} className="my-4 p-4 bg-[#FBEAE8] dark:bg-[#331D1A] border-l-4 border-[#DC2626] space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-bold text-[#DC2626]">
                                  <span>সতর্কতামূলক বিশ্লেষণ ও তাহকীক</span>
                                  <span className="font-mono">{header}</span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line text-[#141615] dark:text-[#E8E6E1]">
                                  {content.trim()}
                                </p>
                              </div>
                            );
                          }

                          const imgMatch = part.match(/\[ছবি:\s*([\s\S]*?)\]/);
                          if (imgMatch) {
                            const content = imgMatch[1].trim();
                            const segments = content.split(/\s*\|\s*/);
                            const url = segments[0] || '';
                            let alt = '';
                            let caption = '';
                            let sourceTitle = '';
                            let sourceUrl = '';
                            let layout = 'full';

                            segments.slice(1).forEach((seg) => {
                              if (seg.startsWith('অল্ট:')) alt = seg.replace(/^অল্ট:\s*/, '').trim();
                              else if (seg.startsWith('ক্যাপশন:')) caption = seg.replace(/^ক্যাপশন:\s*/, '').trim();
                              else if (seg.startsWith('উৎস:')) sourceTitle = seg.replace(/^উৎস:\s*/, '').trim();
                              else if (seg.startsWith('লিংক:')) sourceUrl = seg.replace(/^লিংক:\s*/, '').trim();
                              else if (seg.startsWith('বিন্যাস:')) {
                                const l = seg.replace(/^বিন্যাস:\s*/, '').trim();
                                if (l.includes('কেন্দ্রিক')) layout = 'center';
                              }
                            });

                            return (
                              <figure
                                key={pIdx}
                                className={`my-6 space-y-2 ${
                                  layout === 'center' ? 'max-w-xl mx-auto' : 'w-full'
                                }`}
                              >
                                <div className="border-2 border-[#141615] bg-[#FAF8F5] dark:bg-[#1A2421] p-1.5 shadow-sm">
                                  <img
                                    src={url}
                                    alt={alt || caption || 'প্রবন্ধের চিত্র'}
                                    className="w-full h-auto object-cover max-h-[480px]"
                                    loading="lazy"
                                  />
                                </div>
                                {(caption || sourceTitle) && (
                                  <figcaption className="text-xs text-[#6E7571] dark:text-[#9BA39F] flex flex-wrap items-center justify-between gap-2 px-1">
                                    {caption && <span className="font-medium italic">{caption}</span>}
                                    {sourceTitle && (
                                      <span className="flex items-center gap-1 ml-auto">
                                        <span>উৎস:</span>
                                        {sourceUrl ? (
                                          <a
                                            href={sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#0B4F3B] dark:text-[#4CC39A] underline hover:text-[#B85D19]"
                                          >
                                            {sourceTitle}
                                          </a>
                                        ) : (
                                          <span className="font-semibold">{sourceTitle}</span>
                                        )}
                                      </span>
                                    )}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          }

                          if (!part.trim()) return null;
                          return (
                            <div key={pIdx} className="space-y-3">
                              {part
                                .split('\n\n')
                                .filter(Boolean)
                                .map((para, paraIdx) => (
                                  <p key={paraIdx} className="leading-relaxed whitespace-pre-line">
                                    {para}
                                  </p>
                                ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-5 ${themeClasses.bgMuted} border ${themeClasses.borderStrong} space-y-2`}>
                  <h4 className="font-editorial text-sm font-bold uppercase tracking-wider text-[#0B4F3B] dark:text-[#4CC39A]">
                    তথ্যসূত্র ও প্রামাণ্য গ্রন্থপঞ্জি (References)
                  </h4>
                  <ol className="list-decimal pl-5 text-xs sm:text-sm space-y-1">
                    {currentArticle.references.map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ol>
                </div>

                {/* PROVEN FAQ SECTION FOR GOOGLE EXPANDABLE RICH SNIPPETS & READER TRUST */}
                {articleFaqs.length > 0 && (
                  <section aria-label="সাধারণ জিজ্ঞাসা ও প্রামাণ্য উত্তর" className={`p-5 sm:p-6 ${themeClasses.bgSurface} border-2 border-emerald-900/30 dark:border-emerald-500/30 space-y-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-[#DCD7CD] dark:border-[#26332F]">
                      <h3 className="font-editorial text-lg sm:text-xl font-bold flex items-center gap-2 text-[#0B4F3B] dark:text-[#4CC39A]">
                        <HelpCircle className="w-5 h-5 text-[#B85D19]" />
                        <span>প্রামাণ্য প্রশ্নোত্তর ও সাধারণ জিজ্ঞাসা (FAQ)</span>
                      </h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-[#0B4F3B] dark:text-emerald-300 border border-emerald-600/30">
                        তাহকীক ও প্রামাণ্য উত্তর
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {articleFaqs.map((faq, fIdx) => (
                        <details
                          key={fIdx}
                          className="group border border-[#DCD7CD] dark:border-[#26332F] bg-[#FAF8F5] dark:bg-[#1A2421] p-3.5 sm:p-4 transition-all duration-150"
                        >
                          <summary className="font-editorial text-sm sm:text-base font-bold cursor-pointer list-none flex items-center justify-between gap-3 text-[#141615] dark:text-[#FAF8F5] group-hover:text-[#0B4F3B] dark:group-hover:text-[#4CC39A]">
                            <span className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-[#0B4F3B] text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                {fIdx + 1}
                              </span>
                              <span>{faq.question}</span>
                            </span>
                            <span className="text-[#B85D19] group-open:rotate-180 transition-transform duration-200 text-xs shrink-0">
                              ▼
                            </span>
                          </summary>
                          <div className="mt-3 pt-3 border-t border-[#DCD7CD]/60 dark:border-[#26332F]/60 text-xs sm:text-sm text-[#4A4E4B] dark:text-[#C5CCC8] leading-relaxed pl-7">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {/* RELATED ARTICLES MESH (Googlebot Crawlability & Reader Engagement) */}
                {relatedArticles.length > 0 && (
                  <div className={`p-5 ${themeClasses.bgSurface} border ${themeClasses.borderStrong} space-y-4`}>
                    <div className="flex items-center justify-between border-b pb-3 border-[#DCD7CD] dark:border-[#26332F]">
                      <h4 className="font-editorial text-base sm:text-lg font-bold flex items-center gap-2 text-[#0B4F3B] dark:text-[#4CC39A]">
                        <BookOpen className="w-5 h-5 text-[#B85D19]" />
                        <span>সম্পর্কিত অন্যান্য প্রামাণ্য প্রবন্ধ ও পরবর্তী পাঠ</span>
                      </h4>
                      <span className="text-xs font-bold text-[#B85D19] uppercase tracking-wider">
                        পরবর্তী অধ্যয়ন
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedArticles.map((relArt) => {
                        const targetSec = SECTIONS_DATA.find((s) => s.id === relArt.sectionId) || activeSection;
                        const targetCat = targetSec.categories.find((c) => c.id === relArt.categoryId) || activeCategory;
                        const targetHref = `/${targetSec.slug}/${targetCat.slug}/${relArt.slug}/`;

                        return (
                          <Link
                            key={relArt.id}
                            href={targetHref}
                            onClick={(e) => {
                              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                                e.preventDefault();
                                if (targetSec.id !== activeSection.id) {
                                  setActiveSectionId(targetSec.id);
                                }
                                if (targetCat.id !== activeCategory.id) {
                                  setActiveCategoryId(targetCat.id);
                                }
                                handleOpenArticle(relArt);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className={`group flex flex-col justify-between p-4 ${themeClasses.bgMuted} border ${themeClasses.borderSubtle} hover:border-[#0B4F3B] transition-all duration-150 shadow-sm hover:shadow-md`}
                          >
                            <div className="space-y-2.5">
                              {relArt.featuredImage?.url && (
                                <div className="w-full h-32 overflow-hidden border border-[#DCD7CD] dark:border-[#26332F] bg-black/5">
                                  <img
                                    src={relArt.featuredImage.url}
                                    alt={relArt.featuredImage.alt || relArt.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span className="px-2 py-0.5 bg-[#0B4F3B] text-white">
                                  {targetCat.name}
                                </span>
                                <span className={themeClasses.textMuted}>
                                  {relArt.readTime}
                                </span>
                              </div>
                              <h5 className="font-editorial text-sm sm:text-base font-bold group-hover:text-[#0B4F3B] dark:group-hover:text-[#4CC39A] transition-colors line-clamp-2">
                                {relArt.title}
                              </h5>
                              <p className={`text-xs ${themeClasses.textSecondary} line-clamp-2`}>
                                {relArt.subtitle}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-dashed border-[#DCD7CD] dark:border-[#26332F] flex items-center justify-between text-xs font-bold text-[#B85D19]">
                              <span>সম্পূর্ণ প্রবন্ধ পড়ুন</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            )}
          </section>

          {/* RIGHT 3 COLUMNS: MAGAZINE PORTAL DIGEST, DAILY VERSE & TRENDING */}
          <aside className="lg:col-span-3 space-y-6">
            <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong}`}>
              <div className="bg-[#0B4F3B] text-white px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#E8A86B]" />
                  <span>আজকের নির্বাচিত আয়াত</span>
                </span>
                <span className="text-[11px] bg-[#083B2C] px-2 py-0.5 border border-[#176B52]">
                  তিলাওয়াত ও চিন্তা
                </span>
              </div>
              <div className="p-4 space-y-3">
                <p
                  dir="rtl"
                  className="font-arabic text-xl leading-loose text-right text-[#0B4F3B] dark:text-[#4CC39A] font-bold"
                >
                  أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
                </p>
                <p className="text-sm font-bold">
                  “জেনে রেখো, কেবল আল্লাহর যিকিরেই (স্মরণে) হৃদয়সমূহ প্রশান্তি লাভ করে।”
                </p>
                <div className={`text-xs font-semibold ${themeClasses.ochreText}`}>
                  — সূরা আর-রাদ, আয়াত: ২৮
                </div>
              </div>
            </div>

            <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong}`}>
              <div className="bg-[#141615] text-white px-4 py-3 border-b-2 border-[#B85D19] flex items-center justify-between">
                <h3 className="font-editorial text-base font-bold">
                  সর্বাধিক পঠিত প্রবন্ধসমূহ
                </h3>
                <span className="text-[11px] text-[#E8A86B] font-bold">TOP READ</span>
              </div>

              <div className="divide-y divide-[#DCD7CD] dark:divide-[#26332F]">
                {articles.slice(0, 5).map((art, i) => {
                  const sec = SECTIONS_DATA.find((s) => s.id === art.sectionId);
                  const cat = sec?.categories.find((c) => c.id === art.categoryId) || sec?.categories[0];
                  const href = sec && cat ? `/${sec.slug}/${cat.slug}/${art.slug}/` : '/';
                  return (
                    <Link
                      key={art.id}
                      href={href}
                      onClick={(e) => {
                        if (!e.metaKey && !e.ctrlKey) {
                          e.preventDefault();
                          setActiveSectionId(art.sectionId);
                          setActiveCategoryId(art.categoryId);
                          setSelectedArticleId(art.id);
                          setViewMode('reader');
                        }
                      }}
                      className={`w-full text-left p-3.5 hover:${themeClasses.bgMuted} transition-colors flex items-start gap-3 block`}
                    >
                      <span className="font-editorial text-2xl font-extrabold text-[#B85D19] leading-none mt-0.5">
                        ০{i + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                          {sec?.name} • {art.readTime}
                        </div>
                        <h4 className="font-editorial text-sm font-bold leading-snug mt-0.5">
                          {art.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} p-4 space-y-3`}>
              <h3 className="font-editorial text-base font-extrabold border-b pb-2 border-[#DCD7CD] dark:border-[#26332F]">
                পোর্টাল বিভাগ ও ক্যাটেগরি চিত্র
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SECTIONS_DATA.map((sec) => (
                  <Link
                    key={sec.id}
                    href={`/${sec.slug}/`}
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey) {
                        e.preventDefault();
                        handleSelectSection(sec);
                      }
                    }}
                    className={`p-2.5 text-left border transition-colors block ${
                      sec.id === activeSection.id
                        ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                        : `${themeClasses.bgMuted} ${themeClasses.borderSubtle} hover:border-[#0B4F3B]`
                    }`}
                  >
                    <div className="text-xs font-bold">{sec.name}</div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        sec.id === activeSection.id ? 'text-[#E8A86B]' : themeClasses.textMuted
                      }`}
                    >
                      {sec.categories.length}টি ক্যাটেগরি
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className={`p-4 ${themeClasses.bgAccentTint} border-2 border-[#0B4F3B] space-y-2`}>
              <div className="text-xs font-bold uppercase text-[#0B4F3B] dark:text-[#4CC39A]">
                ডিজাইন ও টেকনিক্যাল মানদণ্ড
              </div>
              <p className="text-xs leading-relaxed">
                • <strong>সলিড কালার প্যালেট:</strong> কোনো কৃত্রিম গ্রেডিয়েন্ট ছাড়াই ক্লাসিক পেপার (`#FAF8F5`), ডিপ মাসজিদ এমারেল্ড (`#0B4F3B`) এবং ওকার গোল্ড (`#B85D19`) ব্যবহারে সর্বোচ্চ কন্ট্রাস্ট।
              </p>
              <p className="text-xs leading-relaxed">
                • <strong>SEO রেডি URL:</strong> প্রতিটি পেইজ ও ক্যাটেগরি ক্লিন স্ল্যাগ (`/[section]/[category]/[slug]`) অনুসরণ করে।
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* SAVED BOOKMARKS DRAWER */}
      {showBookmarksDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div
            className={`w-full max-w-md h-full ${themeClasses.bgSurface} border-l-2 ${themeClasses.borderStrong} p-5 flex flex-col justify-between overflow-y-auto`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#141615]">
                <h3 className="font-editorial text-lg font-extrabold flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-[#0B4F3B]" />
                  <span>আপনার সংরক্ষিত প্রবন্ধ ({bookmarkedIds.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowBookmarksDrawer(false)}
                  className="px-2.5 py-1 bg-[#141615] text-white text-xs font-bold"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>

              {bookmarkedIds.length === 0 ? (
                <p className={`text-sm ${themeClasses.textMuted} py-8 text-center`}>
                  এখনো কোনো প্রবন্ধ বুকমার্ক করা হয়নি।
                </p>
              ) : (
                <div className="space-y-3">
                  {articles
                    .filter((a) => bookmarkedIds.includes(a.id))
                    .map((art) => (
                      <div
                        key={art.id}
                        className={`p-3.5 ${themeClasses.bgMuted} border ${themeClasses.borderSubtle} space-y-2`}
                      >
                        <div className="text-xs font-bold text-[#B85D19]">
                          {art.publishedAt} • {art.readTime}
                        </div>
                        <h4 className="font-editorial text-sm font-bold">{art.title}</h4>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSectionId(art.sectionId);
                              setActiveCategoryId(art.categoryId);
                              setSelectedArticleId(art.id);
                              setViewMode('reader');
                              setShowBookmarksDrawer(false);
                            }}
                            className="px-3 py-1 bg-[#0B4F3B] text-white text-xs font-bold"
                          >
                            পড়ুন
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleBookmark(art.id)}
                            className="px-2.5 py-1 text-xs border border-[#141615]"
                          >
                            মুছে ফেলুন
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#DCD7CD] text-xs text-center">
              ইসলাম • ডিজিটাল ম্যাগাজিন ও জ্ঞানকোষ
            </div>
          </div>
        </div>
      )}

      {/* 5. EDITORIAL FOOTER */}
      <SiteFooter
        onSelectSection={handleSelectSection}
        onOpenDirectory={() => setDirectoryModalOpen(true)}
      />

      {/* 8. INTERACTIVE MEGA DIRECTORY MODAL */}
      <MegaDirectoryModal
        isOpen={directoryModalOpen}
        onClose={() => setDirectoryModalOpen(false)}
        onSelectCategory={(sec, cat) => {
          setActiveSectionId(sec.id);
          setActiveGroupFilter(sec.filterGroups[0]);
          setActiveCategoryId(cat.id);
          setViewMode('magazine');
        }}
      />

      {/* 9. VIRAL SOCIAL QUOTE & DAWAH CARD GENERATOR MODAL */}
      {currentArticle && (
        <SocialCardModal
          isOpen={socialCardModalOpen}
          onClose={() => setSocialCardModalOpen(false)}
          article={currentArticle}
          sectionName={activeSection.name}
          categoryName={activeCategory.name}
        />
      )}

      {/* 10. UNIVERSAL COMMAND PALETTE & SPOTLIGHT SEARCH MODAL */}
      <CommandPaletteSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}
