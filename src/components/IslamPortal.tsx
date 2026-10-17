'use client';

import React, { useState, useMemo } from 'react';
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
  Code2,
  PlusCircle,
  ArrowLeft,
  ArrowUpRight,
  Menu,
  ListFilter,
  Globe,
  ShieldCheck,
  Award,
  Calendar,
  UserCheck,
  BookMarked,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { ThemeMode, ViewMode, Article, CategoryItem, SectionPage, CitationBox } from '@/types';
import { SECTIONS_DATA } from '@/data/sections';
import { INITIAL_ARTICLES } from '@/data/articles';
import { IslamicGeometricEmblem } from './IslamicGeometricEmblem';
import SectionHeroBanner from './SectionHeroBanner';
import MegaDirectoryModal from './MegaDirectoryModal';
import PrayerTimesAndHijriWidget from './PrayerTimesAndHijriWidget';

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

  // Reading Preferences (Solid Color Themes + Font Scale)
  const [themeMode, setThemeMode] = useState<ThemeMode>('paper');
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Article Draft Form State
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftSubtitle, setDraftSubtitle] = useState<string>('');
  const [draftArabic, setDraftArabic] = useState<string>('');
  const [draftCitationBn, setDraftCitationBn] = useState<string>('');
  const [draftRef, setDraftRef] = useState<string>('');
  const [draftBody, setDraftBody] = useState<string>('');

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

  const handlePublishDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftBody.trim()) {
      triggerToast('অনুগ্রহ করে প্রবন্ধের শিরোনাম ও মূল বক্তব্য লিখুন');
      return;
    }
    const newId = `custom-${Date.now()}`;
    const newArt: Article = {
      id: newId,
      slug: `${activeCategory.slug}-article-${articles.length + 1}`,
      title: draftTitle.trim(),
      subtitle:
        draftSubtitle.trim() ||
        `${activeSection.name} বিভাগের ${activeCategory.name} ক্যাটেগরির অধীনে প্রকাশিত প্রবন্ধ।`,
      sectionId: activeSection.id,
      categoryId: activeCategory.id,
      author: 'সম্পাদকীয় ডেস্ক (ইসলাম)',
      reviewer: 'শরীয়াহ সম্পাদনা পরিষদ',
      publishedAt: '১৭ অক্টোবর ২০২৬ (সদ্য প্রকাশিত)',
      readTime: '৫ মিনিট পাঠ',
      isLead: false,
      tags: [activeSection.name, activeCategory.name, 'নতুন সংযোজন'],
      citation: {
        arabic: draftArabic.trim() || activeCategory.arabicName || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        bengali:
          draftCitationBn.trim() ||
          'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি।',
        reference: draftRef.trim() || `${activeCategory.name} • প্রামাণ্য উদ্ধৃতি`
      },
      summary: draftBody.trim().slice(0, 180),
      keyTakeaways: [
        `${activeCategory.name} ক্যাটেগরির অধীনে সংযোজিত নতুন গবেষণাধর্মী নিবন্ধ।`,
        'কুরআন ও সুন্নাহর দলিলভিত্তিক উপস্থাপনা।'
      ],
      contentSections: [
        {
          heading: '১. মূল আলোচনা ও বিশ্লেষণ',
          body: draftBody.trim()
        }
      ],
      references: [draftRef.trim() || 'আল-কুরআনুল কারীম ও সিহাহ সিত্তাহ']
    };

    setArticles((prev) => [newArt, ...prev]);
    setSelectedArticleId(newId);
    setDraftTitle('');
    setDraftSubtitle('');
    setDraftArabic('');
    setDraftCitationBn('');
    setDraftRef('');
    setDraftBody('');
    setViewMode('reader');
    triggerToast(`"${activeCategory.name}" ক্যাটেগরিতে আপনার নতুন আর্টিকেল প্রকাশিত হয়েছে!`);
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Serif+Bengali:wght@500;600;700;800&display=swap');
        .font-editorial {
          font-family: 'Noto Serif Bengali', 'Hind Siliguri', Georgia, serif;
        }
        .font-sans {
          font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-arabic {
          font-family: 'Amiri', 'Traditional Arabic', serif;
        }
      `}</style>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#0B4F3B] text-[#FFFFFF] px-4 py-3 border-2 border-[#141615] shadow-lg">
          <Check className="w-4 h-4 text-[#F5EBE1] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
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

            <button
              type="button"
              onClick={() =>
                setViewMode(viewMode === 'nextjs_code' ? 'magazine' : 'nextjs_code')
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border transition-colors ${
                viewMode === 'nextjs_code'
                  ? 'bg-[#B85D19] text-white border-[#F5EBE1]'
                  : 'bg-[#FAF8F5] text-[#0B4F3B] border-[#FAF8F5] hover:bg-[#E6F0EC]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Next.js + SEO কোড</span>
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
                  className={`w-full pl-10 pr-8 py-2.5 text-sm ${themeClasses.bgMuted} ${themeClasses.textPrimary} border ${themeClasses.borderStrong} focus:outline-none focus:border-[#0B4F3B]`}
                />
                {globalSearchQuery && (
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
                href="/admin/"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold bg-[#FAF8F5] dark:bg-[#111615] hover:bg-[#F2EFE9] text-[#0B4F3B] dark:text-[#4CC39A] border-2 border-[#141615] transition-colors shrink-0"
                title="সেন্ট্রাল অ্যাডমিন কন্ট্রোল প্যানেল"
              >
                <Database className="w-3.5 h-3.5 text-[#B85D19]" />
                <span className="hidden xl:inline">অ্যাডমিন</span>
              </Link>

              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'writer' ? 'magazine' : 'writer')}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold border-2 transition-colors shrink-0 ${
                  viewMode === 'writer'
                    ? 'bg-[#B85D19] text-white border-[#141615]'
                    : 'bg-[#0B4F3B] text-white border-[#141615] hover:bg-[#083B2C]'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন আর্টিকেল লিখুন</span>
              </button>
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
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleSelectSection(sec)}
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
                  </button>
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
            <span className="px-2 py-0.5 bg-[#B85D19] text-white text-xs font-bold">
              URL: /{activeSection.slug}/{activeCategory.slug}
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
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-3 relative ${
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
                    </button>
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
                  <button
                    type="button"
                    onClick={() => setViewMode('writer')}
                    className={`px-3 py-1 text-xs font-bold border-l ${themeClasses.borderStrong} ${
                      viewMode === 'writer'
                        ? 'bg-[#B85D19] text-white'
                        : `${themeClasses.bgSurface} ${themeClasses.textPrimary}`
                    }`}
                  >
                    লিখুন
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
                      <button
                        type="button"
                        onClick={() => handleOpenArticle(leadArticle)}
                        className="text-left hover:text-[#0B4F3B] dark:hover:text-[#4CC39A] transition-colors"
                      >
                        {leadArticle.title}
                      </button>
                    </h3>

                    <p className={`text-base mt-2.5 font-medium ${themeClasses.textSecondary}`}>
                      {leadArticle.subtitle}
                    </p>

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

                        <button
                          type="button"
                          onClick={() => handleOpenArticle(leadArticle)}
                          className="px-4 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border border-[#141615] inline-flex items-center gap-1.5"
                        >
                          <span>সম্পূর্ণ প্রবন্ধ পড়ুন</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
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
                            <button
                              type="button"
                              onClick={() => handleOpenArticle(art)}
                              className="text-left hover:text-[#0B4F3B] dark:hover:text-[#4CC39A]"
                            >
                              {art.title}
                            </button>
                          </h4>
                          <p className={`text-sm ${themeClasses.textSecondary} line-clamp-2`}>
                            {art.subtitle}
                          </p>
                          <div className={`text-xs ${themeClasses.textMuted}`}>
                            লেখক: <span className="font-semibold">{art.author}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenArticle(art)}
                            className="px-3.5 py-1.5 bg-[#0B4F3B] text-white text-xs font-bold hover:bg-[#083B2C]"
                          >
                            পাঠ করুন →
                          </button>
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

                  <div className="flex items-center gap-2">
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

                <div className={`space-y-6 ${bodyFontSizeClass}`}>
                  {currentArticle.contentSections.map((sec, idx) => (
                    <div key={idx} className="space-y-2.5">
                      <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#0B4F3B] dark:text-[#4CC39A] border-b pb-1.5 border-[#DCD7CD] dark:border-[#26332F]">
                        {sec.heading}
                      </h2>
                      <p className={`${themeClasses.textPrimary} leading-relaxed`}>
                        {sec.body}
                      </p>
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
              </article>
            )}

            {viewMode === 'writer' && (
              <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} p-5 sm:p-7 space-y-5`}>
                <div className="border-b-2 border-[#141615] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-editorial text-xl sm:text-2xl font-extrabold text-[#0B4F3B]">
                      ক্যাটেগরি অনুযায়ী নতুন আর্টিকেল লিখুন (CMS এডিটর)
                    </h3>
                    <p className={`text-xs sm:text-sm mt-0.5 ${themeClasses.textSecondary}`}>
                      নির্বাচিত পেইজ: <strong>{activeSection.name}</strong> → ক্যাটেগরি:{' '}
                      <strong>{activeCategory.name}</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#B85D19] text-white text-xs font-bold">
                    লাইভ পাবলিশ প্রিভিউ
                  </span>
                </div>

                <form onSubmit={handlePublishDraft} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">
                      প্রবন্ধের শিরোনাম (SEO Title / H1) *
                    </label>
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      placeholder={`যেমন: ${activeCategory.name}-এর তাৎপর্য ও জীবনঘনিষ্ঠ শিক্ষা`}
                      className={`w-full px-3.5 py-2.5 text-sm ${themeClasses.bgMuted} border ${themeClasses.borderStrong} focus:outline-none focus:border-[#0B4F3B]`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">
                      উপ-শিরোনাম / সারসংক্ষেপ (Meta Description)
                    </label>
                    <input
                      type="text"
                      value={draftSubtitle}
                      onChange={(e) => setDraftSubtitle(e.target.value)}
                      placeholder="সার্চ ইঞ্জিন (SEO) ও ম্যাগাজিন কার্ডের জন্য ২ লাইনের সারসংক্ষেপ"
                      className={`w-full px-3.5 py-2 text-sm ${themeClasses.bgMuted} border ${themeClasses.borderSubtle} focus:outline-none focus:border-[#0B4F3B]`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">
                        আরবি আয়াত বা হাদিসের অংশ (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={draftArabic}
                        onChange={(e) => setDraftArabic(e.target.value)}
                        placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                        className={`w-full px-3.5 py-2 text-base font-arabic ${themeClasses.bgMuted} border ${themeClasses.borderSubtle}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">
                        সূরা বা হাদিসের রেফারেন্স নম্বর
                      </label>
                      <input
                        type="text"
                        value={draftRef}
                        onChange={(e) => setDraftRef(e.target.value)}
                        placeholder="যেমন: সহীহ বুখারী, হাদিস নং ১"
                        className={`w-full px-3.5 py-2 text-sm ${themeClasses.bgMuted} border ${themeClasses.borderSubtle}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">
                      উদ্ধৃতির বাংলা অনুবাদ
                    </label>
                    <input
                      type="text"
                      value={draftCitationBn}
                      onChange={(e) => setDraftCitationBn(e.target.value)}
                      placeholder="আয়াত বা হাদিসের সরল বাংলা অনুবাদ"
                      className={`w-full px-3.5 py-2 text-sm ${themeClasses.bgMuted} border ${themeClasses.borderSubtle}`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">
                      মূল প্রবন্ধের বিস্তারিত বক্তব্য *
                    </label>
                    <textarea
                      rows={6}
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      placeholder={`${activeCategory.name} ক্যাটেগরির অধীনে আপনার গবেষণাধর্মী আর্টিকেল এখানে লিখুন`}
                      className={`w-full p-3.5 text-sm ${themeClasses.bgMuted} border ${themeClasses.borderStrong} focus:outline-none focus:border-[#0B4F3B]`}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('magazine')}
                      className={`px-4 py-2 text-xs font-bold border ${themeClasses.borderStrong}`}
                    >
                      বাতিল করুন
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border border-[#141615]"
                    >
                      এই ক্যাটেগরিতে আর্টিকেল প্রকাশ করুন
                    </button>
                  </div>
                </form>
              </div>
            )}

            {viewMode === 'nextjs_code' && (
              <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} p-5 sm:p-7 space-y-5`}>
                <div className="border-b-2 border-[#141615] pb-3 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-[#0B4F3B] text-white text-xs font-bold">
                      DEVELOPER ARCHITECTURE
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl font-extrabold mt-1">
                      Next.js 15 (App Router) + TypeScript + Cloudflare Pages SEO স্ট্রাকচার
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode('magazine')}
                    className="px-3 py-1 bg-[#141615] text-white text-xs font-bold"
                  >
                    ম্যাগাজিনে ফিরুন
                  </button>
                </div>

                <p className={`text-sm ${themeClasses.textSecondary}`}>
                  আপনার <strong>“ইসলাম”</strong> ওয়েবসাইটটি গুগল সার্চে সর্বোচ্চ র‍্যাংক (SEO) পেতে এবং Cloudflare Pages-এ আল্ট্রা-ফাস্ট এজ (Edge/SSG) রেন্ডারিংয়ের জন্য নিচের ফোল্ডার আর্কিটেকচার ও TypeScript কোড ব্যবহার করবেন:
                </p>

                <div className="bg-[#141615] text-[#FAF8F5] p-4 font-mono text-xs overflow-x-auto border-l-4 border-[#B85D19]">
                  <pre>{`// ১. প্রজেক্ট ফোল্ডার স্ট্রাকচার (Next.js 15 App Router)
islam-portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx                      // গ্লোবাল হেডার + বাম থেকে ডানে পেইজ নেভবার
│   │   ├── page.tsx                        // ম্যাগাজিন হোমপেইজ
│   │   ├── sitemap.ts                      // ডাইনামিক XML Sitemap (SEO-এর জন্য অপরিহার্য)
│   │   ├── robots.ts                       // সার্চ ইঞ্জিন ক্রলার রুলস
│   │   └── [section]/                      // যেমন: /allah, /angels, /quran, /hadith, /prophets, /sahabi
│   │       ├── layout.tsx                  // বাম পাশের লম্বা ক্যাটেগরি সাইডবার (Left Sidebar)
│   │       ├── page.tsx                    // সেকশন ওভারভিউ পেইজ
│   │       └── [category]/                 // যেমন: /quran/surah-fatiha, /sahabi/abu-bakr-ra
│   │           ├── page.tsx                // ক্যাটেগরি অনুযায়ী আর্টিকেলের ম্যাগাজিন গ্রিড
│   │           └── [slug]/
│   │               └── page.tsx            // পূর্ণাঙ্গ আর্টিকেল রিডার + JSON-LD Article Schema
│   ├── components/
│   │   ├── HeaderMasthead.tsx
│   │   ├── HorizontalSectionNav.tsx
│   │   └── CategoryLeftSidebar.tsx
│   └── data/
│       └── sections.ts`}</pre>
                </div>

                <div className="bg-[#141615] text-[#FAF8F5] p-4 font-mono text-xs overflow-x-auto border-l-4 border-[#0B4F3B]">
                  <pre>{`// ২. SEO Metadata ও JSON-LD Schema (src/app/[section]/[category]/[slug]/page.tsx)
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { section, category, slug } = await params;
  const article = await getArticleBySlug(section, category, slug);

  return {
    title: \`\${article.title} | ইসলাম — \${article.categoryName}\`,
    description: article.subtitle,
    alternates: {
      canonical: \`https://islam.org.bd/\${section}/\${category}/\${slug}\`,
    },
    openGraph: {
      title: article.title,
      description: article.subtitle,
      type: 'article',
      locale: 'bn_BD',
      siteName: 'ইসলাম',
    },
  };
}`}</pre>
                </div>
              </div>
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
                {articles.slice(0, 5).map((art, i) => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      setActiveSectionId(art.sectionId);
                      setActiveCategoryId(art.categoryId);
                      setSelectedArticleId(art.id);
                      setViewMode('reader');
                    }}
                    className={`w-full text-left p-3.5 hover:${themeClasses.bgMuted} transition-colors flex items-start gap-3`}
                  >
                    <span className="font-editorial text-2xl font-extrabold text-[#B85D19] leading-none mt-0.5">
                      ০{i + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                        {SECTIONS_DATA.find((s) => s.id === art.sectionId)?.name} •{' '}
                        {art.readTime}
                      </div>
                      <h4 className="font-editorial text-sm font-bold leading-snug mt-0.5">
                        {art.title}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={`${themeClasses.bgSurface} border-2 ${themeClasses.borderStrong} p-4 space-y-3`}>
              <h3 className="font-editorial text-base font-extrabold border-b pb-2 border-[#DCD7CD] dark:border-[#26332F]">
                পোর্টাল বিভাগ ও ক্যাটেগরি চিত্র
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SECTIONS_DATA.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleSelectSection(sec)}
                    className={`p-2.5 text-left border transition-colors ${
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
                  </button>
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
      <footer className="bg-[#141615] text-[#FAF8F5] border-t-4 border-[#0B4F3B] mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#2D3330]">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <IslamicGeometricEmblem
                  size={40}
                  primaryColor="#0B4F3B"
                  accentColor="#B85D19"
                  surfaceColor="#FAF8F5"
                />
                <div>
                  <span className="font-editorial text-3xl font-extrabold text-white">
                    ইসলাম
                  </span>
                  <span className="ml-2 font-arabic text-xl text-[#E8A86B]">
                    الإسلام
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#C2C8C5] max-w-md leading-relaxed">
                পবিত্র কুরআন, সহীহ সুন্নাহ এবং সালাফে সালেহীনের মানহাজ অনুসারে পরিচালিত একটি প্রামাণ্য, দলিলভিত্তিক ও আন্তর্জাতিক মানের বাংলা ইসলামী ওয়েব পোর্টাল।
              </p>
            </div>

            <div className="md:col-span-4 space-y-2">
              <h4 className="font-editorial text-sm font-bold uppercase tracking-wider text-[#E8A86B]">
                প্রধান বিভাগসমূহ (এক লাইনের পেইজ সূচি)
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-sm">
                {SECTIONS_DATA.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleSelectSection(sec)}
                    className="text-left text-[#C2C8C5] hover:text-white py-0.5"
                  >
                    → {sec.name} ({sec.categories.length})
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <h4 className="font-editorial text-sm font-bold uppercase tracking-wider text-[#E8A86B]">
                টেকনোলজি ও ডেপ্লয়মেন্ট
              </h4>
              <p className="text-xs text-[#C2C8C5] leading-relaxed">
                Next.js (App Router) + TypeScript ও Tailwind CSS দিয়ে নির্মিত এবং Cloudflare Pages Edge Network-এর জন্য পূর্ণাঙ্গ SEO অপ্টিমাইজড।
              </p>
              <button
                type="button"
                onClick={() => setViewMode('nextjs_code')}
                className="mt-2 px-3.5 py-2 bg-[#0B4F3B] text-white text-xs font-bold border border-[#B85D19] inline-flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Next.js SEO কোড দেখুন</span>
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8A9490]">
            <span>© ২০২৬ ইসলাম (Islam Portal) • সর্বস্বত্ব সংরক্ষিত।</span>
            <span>সলিড এডিটোরিয়াল কালার সিস্টেম • জিরো গ্রেডিয়েন্ট • আন্তর্জাতিক ম্যাগাজিন লেআউট</span>
          </div>
        </div>
      </footer>

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
    </div>
  );
}
