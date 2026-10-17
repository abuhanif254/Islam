const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'islam_portal.tsx'), 'utf8');

// Find the App function
const appStartMarker = 'export default function App() {';
const appStart = content.indexOf(appStartMarker);

if (appStart === -1) {
  console.error('App start not found!');
  process.exit(1);
}

// Slice from App onwards
let appBody = content.substring(appStart + appStartMarker.length);

// Replace default state initializers to respect props
const oldInit = `  // Default to Quran or Allah — user mentioned Allah, Feresta, Quran, Hadith, Nabi, Sahabi
  const [activeSectionId, setActiveSectionId] = useState<string>('quran');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('surah-fatiha');
  const [activeGroupFilter, setActiveGroupFilter] = useState<string>('সব সূরা');
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Reader, Writer & Developer Blueprint State
  const [viewMode, setViewMode] = useState<ViewMode>('magazine');
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('art-fatiha-1');`;

const newInit = `  // Resolve initial section from props if provided
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
      return \`synth-\${resolvedInitialCategory.id}-1\`;
    }
    return 'art-fatiha-1';
  }, [initialArticleSlug, resolvedInitialCategory]);

  const [selectedArticleId, setSelectedArticleId] = useState<string>(resolvedInitialArticleId);`;

if (!appBody.includes(oldInit)) {
  console.error('Could not find oldInit in appBody!');
  process.exit(1);
}

appBody = appBody.replace(oldInit, newInit);

const fullComponent = `'use client';

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
  BookMarked
} from 'lucide-react';
import { ThemeMode, ViewMode, Article, CategoryItem, SectionPage, CitationBox } from '@/types';
import { SECTIONS_DATA } from '@/data/sections';
import { INITIAL_ARTICLES } from '@/data/articles';
import { IslamicGeometricEmblem } from './IslamicGeometricEmblem';

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
${appBody}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'components', 'IslamPortal.tsx'), fullComponent, 'utf8');
console.log('src/components/IslamPortal.tsx generated successfully!');
