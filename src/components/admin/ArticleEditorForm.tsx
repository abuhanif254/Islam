'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileText,
  Bookmark,
  ShieldCheck,
  Tag,
  Hash,
  Clock,
  UserCheck,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  Columns,
  RefreshCw,
  Globe,
  Share2,
  AlertTriangle,
  X,
  Award,
  ChevronRight,
  Loader2,
  Layers,
  History,
  Maximize2,
  Minimize2,
  Quote,
  Bold,
  Italic,
  List,
  ListOrdered,
  Minus,
  HelpCircle,
  Check
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { DbArticle, DbCategory } from '@/lib/supabase';
import {
  saveAdminArticle,
  deleteAdminArticle,
  fetchAdminCategories,
  calculateBengaliStats
} from '@/lib/supabase-service';
import { toBengaliDigits } from '@/lib/prayer-times';

import ArabicPalette from './editor/ArabicPalette';
import IslamicBlockModal, { IslamicBlockType } from './editor/IslamicBlockModal';
import FrameworkGeneratorModal, { ArticleFramework } from './editor/FrameworkGeneratorModal';
import LiveSeoScoreCard from './editor/LiveSeoScoreCard';
import RevisionHistoryModal from './editor/RevisionHistoryModal';

interface ArticleEditorFormProps {
  initialArticle?: DbArticle | null;
  isEdit?: boolean;
}

export type EditorTab = 'basic' | 'hero' | 'body' | 'refs' | 'seo';

export default function ArticleEditorForm({ initialArticle, isEdit = false }: ArticleEditorFormProps) {
  const router = useRouter();

  // Active Tab: 'basic' | 'hero' | 'body' | 'refs' | 'seo'
  const [activeTab, setActiveTab] = useState<EditorTab>('basic');

  // Mode: 'editor' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [previewTheme, setPreviewTheme] = useState<'paper' | 'sepia' | 'dark'>('paper');
  const [isZenMode, setIsZenMode] = useState(false);

  // Modals state
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [targetSectionIndex, setTargetSectionIndex] = useState<number>(0);
  const [frameworkModalOpen, setFrameworkModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);

  // Form State
  const [id, setId] = useState(initialArticle?.id || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [sectionId, setSectionId] = useState(initialArticle?.section_id || 'allah');
  const [categoryId, setCategoryId] = useState(initialArticle?.category_id || 'tawheed-fundamentals');
  const [author, setAuthor] = useState(initialArticle?.author || 'মাওলানা আব্দুল হক');
  const [reviewer, setReviewer] = useState(initialArticle?.reviewer || 'মুফতী মাহমুদ হাসান (তাহকীক ও সম্পাদনা)');
  const [publishedAt, setPublishedAt] = useState(initialArticle?.published_at || '১৮ অক্টোবর ২০২৬');
  const [readTime, setReadTime] = useState(initialArticle?.read_time || '৮ মিনিট পাঠ');
  const [isLead, setIsLead] = useState(Boolean(initialArticle?.is_lead));
  const [status, setStatus] = useState<'published' | 'draft' | 'review'>(initialArticle?.status || 'published');

  // Primary Citation box
  const [citationArabic, setCitationArabic] = useState(initialArticle?.citation?.arabic || '');
  const [citationTranslit, setCitationTranslit] = useState(initialArticle?.citation?.transliteration || '');
  const [citationBengali, setCitationBengali] = useState(initialArticle?.citation?.bengali || '');
  const [citationRef, setCitationRef] = useState(initialArticle?.citation?.reference || '');

  // Summary
  const [summary, setSummary] = useState(initialArticle?.summary || '');

  // Key Takeaways
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(
    initialArticle?.key_takeaways && initialArticle.key_takeaways.length > 0
      ? initialArticle.key_takeaways
      : ['']
  );

  // Content Sections
  const [contentSections, setContentSections] = useState<{ heading: string; body: string }[]>(
    initialArticle?.content_sections && initialArticle.content_sections.length > 0
      ? initialArticle.content_sections
      : [{ heading: '', body: '' }]
  );

  // References
  const [references, setReferences] = useState<string[]>(
    initialArticle?.references && initialArticle.references.length > 0
      ? initialArticle.references
      : ['']
  );

  // Tags as string
  const [tagsInput, setTagsInput] = useState(initialArticle?.tags ? initialArticle.tags.join(', ') : '');

  // Dynamic Categories from Supabase / Local Storage
  const [categoriesList, setCategoriesList] = useState<DbCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Auto-Save Drafts to LocalStorage
  const draftKey = `islam_admin_draft_${isEdit ? (initialArticle?.id || 'edit') : 'new'}`;
  const [hasRecoverableDraft, setHasRecoverableDraft] = useState(false);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load Categories on mount and when section changes
  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      try {
        const cats = await fetchAdminCategories(sectionId);
        if (mounted) {
          setCategoriesList(cats);
          setLoadingCategories(false);
          if (cats.length > 0 && !cats.some((c) => c.id === categoryId)) {
            setCategoryId(cats[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching categories in editor', err);
      }
    }
    loadCats();
    return () => {
      mounted = false;
    };
  }, [sectionId]);

  // Check for saved draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const rawDraft = localStorage.getItem(draftKey);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed && parsed.savedAt && parsed.title) {
          if (!initialArticle || parsed.title !== initialArticle.title || parsed.bodyLength > 100) {
            setHasRecoverableDraft(true);
            setDraftSavedTime(parsed.savedAt);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to inspect draft from localStorage', e);
    }
  }, [draftKey, initialArticle]);

  // Auto-save draft every 1.5s when form state changes
  useEffect(() => {
    if (typeof window === 'undefined' || isDraftRestored) return;
    const timer = setTimeout(() => {
      try {
        const draftData = {
          savedAt: new Date().toLocaleTimeString('bn-BD', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          title,
          subtitle,
          sectionId,
          categoryId,
          author,
          reviewer,
          publishedAt,
          readTime,
          isLead,
          status,
          citationArabic,
          citationTranslit,
          citationBengali,
          citationRef,
          summary,
          keyTakeaways,
          contentSections,
          references,
          tagsInput,
          bodyLength: contentSections.reduce((acc, s) => acc + s.body.length, 0)
        };
        localStorage.setItem(draftKey, JSON.stringify(draftData));
        setDraftSavedTime(draftData.savedAt);
      } catch (e) {
        console.warn('Auto-save failed', e);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    title,
    subtitle,
    sectionId,
    categoryId,
    author,
    reviewer,
    publishedAt,
    readTime,
    isLead,
    status,
    citationArabic,
    citationTranslit,
    citationBengali,
    citationRef,
    summary,
    keyTakeaways,
    contentSections,
    references,
    tagsInput,
    draftKey,
    isDraftRestored
  ]);

  // Recover Draft
  const handleRecoverDraft = () => {
    try {
      const rawDraft = localStorage.getItem(draftKey);
      if (!rawDraft) return;
      const draft = JSON.parse(rawDraft);
      if (draft.title) setTitle(draft.title);
      if (draft.subtitle) setSubtitle(draft.subtitle);
      if (draft.sectionId) setSectionId(draft.sectionId);
      if (draft.categoryId) setCategoryId(draft.categoryId);
      if (draft.author) setAuthor(draft.author);
      if (draft.reviewer) setReviewer(draft.reviewer);
      if (draft.publishedAt) setPublishedAt(draft.publishedAt);
      if (draft.readTime) setReadTime(draft.readTime);
      if (typeof draft.isLead === 'boolean') setIsLead(draft.isLead);
      if (draft.status) setStatus(draft.status);
      if (draft.citationArabic) setCitationArabic(draft.citationArabic);
      if (draft.citationTranslit) setCitationTranslit(draft.citationTranslit);
      if (draft.citationBengali) setCitationBengali(draft.citationBengali);
      if (draft.citationRef) setCitationRef(draft.citationRef);
      if (draft.summary) setSummary(draft.summary);
      if (Array.isArray(draft.keyTakeaways)) setKeyTakeaways(draft.keyTakeaways);
      if (Array.isArray(draft.contentSections)) setContentSections(draft.contentSections);
      if (Array.isArray(draft.references)) setReferences(draft.references);
      if (draft.tagsInput) setTagsInput(draft.tagsInput);

      setHasRecoverableDraft(false);
      setIsDraftRestored(true);
      setSuccessMsg('অসংরক্ষিত ড্রাফট সফলভাবে রিকভার করা হয়েছে!');
    } catch (e) {
      setErrorMsg('ড্রাফট রিকভার করতে ত্রুটি হয়েছে');
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      setHasRecoverableDraft(false);
    } catch (e) {}
  };

  // Live Stats (Words, Characters, Calculated Reading Time)
  const fullArticleText = useMemo(() => {
    const sectionsText = contentSections.map((s) => `${s.heading} ${s.body}`).join(' ');
    const takeawaysText = keyTakeaways.join(' ');
    return `${title} ${subtitle} ${summary} ${citationArabic} ${citationBengali} ${takeawaysText} ${sectionsText}`;
  }, [title, subtitle, summary, citationArabic, citationBengali, keyTakeaways, contentSections]);

  const stats = useMemo(() => {
    return calculateBengaliStats(fullArticleText);
  }, [fullArticleText]);

  // Section and Category lookups
  const currentSection = useMemo(() => {
    return SECTIONS_DATA.find((s) => s.id === sectionId);
  }, [sectionId]);

  const currentCategory = useMemo(() => {
    return categoriesList.find((c) => c.id === categoryId);
  }, [categoriesList, categoryId]);

  const liveUrl =
    currentSection && currentCategory && (slug || initialArticle?.slug)
      ? `/${currentSection.slug}/${currentCategory.slug}/${slug || initialArticle?.slug}/`
      : null;

  // Auto-generate slug and ID helper
  const handleGenerateSlug = () => {
    if (!title) return;
    const clean = title
      .toLowerCase()
      .replace(/[^\w\s\u0980-\u09FF-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 45);
    const generatedSlug = clean || 'article-' + Date.now();
    setSlug(generatedSlug);
    if (!id) {
      setId(`${sectionId}-${generatedSlug}`);
    }
  };

  // Key takeaways helpers
  const handleTakeawayChange = (index: number, val: string) => {
    const updated = [...keyTakeaways];
    updated[index] = val;
    setKeyTakeaways(updated);
  };
  const addTakeaway = () => setKeyTakeaways([...keyTakeaways, '']);
  const removeTakeaway = (index: number) => {
    if (keyTakeaways.length <= 1) return;
    setKeyTakeaways(keyTakeaways.filter((_, i) => i !== index));
  };
  const moveTakeaway = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= keyTakeaways.length) return;
    const updated = [...keyTakeaways];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setKeyTakeaways(updated);
  };

  // Content sections helpers
  const handleSectionChangeContent = (index: number, field: 'heading' | 'body', val: string) => {
    const updated = [...contentSections];
    updated[index] = { ...updated[index], [field]: val };
    setContentSections(updated);
  };
  const addContentSection = () => setContentSections([...contentSections, { heading: '', body: '' }]);
  const duplicateContentSection = (index: number) => {
    const source = contentSections[index];
    const updated = [...contentSections];
    updated.splice(index + 1, 0, { heading: source.heading + ' (অনুলিপি)', body: source.body });
    setContentSections(updated);
  };
  const removeContentSection = (index: number) => {
    if (contentSections.length <= 1) return;
    setContentSections(contentSections.filter((_, i) => i !== index));
  };
  const moveContentSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= contentSections.length) return;
    const updated = [...contentSections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setContentSections(updated);
  };

  // Inline formatting helper for active section body
  const insertFormatting = (index: number, prefix: string, suffix: string = '') => {
    const target = contentSections[index]?.body || '';
    handleSectionChangeContent(index, 'body', target + `${prefix}${suffix}`);
  };

  // References helpers
  const handleRefChange = (index: number, val: string) => {
    const updated = [...references];
    updated[index] = val;
    setReferences(updated);
  };
  const addReference = () => setReferences([...references, '']);
  const removeReference = (index: number) => {
    if (references.length <= 1) return;
    setReferences(references.filter((_, i) => i !== index));
  };

  // Open Block Builder Modal
  const openBlockBuilder = (sectionIdx: number) => {
    setTargetSectionIndex(sectionIdx);
    setBlockModalOpen(true);
  };

  // Apply Framework Outlines
  const handleApplyFramework = (fw: ArticleFramework) => {
    if (confirm('এই ফ্রেমওয়ার্কটি প্রয়োগ করলে বর্তমান শিরোনাম, অনুচ্ছেদ ও সারসংক্ষেপ পরিবর্তিত হবে। আপনি কি নিশ্চিত?')) {
      if (!title.trim() || title === 'শিরোনামহীন নতুন প্রবন্ধ') {
        setTitle(fw.titleSuggestion);
      }
      setSubtitle(fw.subtitleSuggestion);
      setSummary(fw.summarySuggestion);
      setContentSections(fw.contentSections);
      setKeyTakeaways(fw.keyTakeaways);
      setReferences(fw.references);
      handleGenerateSlug();
      setActiveTab('body');
      setSuccessMsg('ফ্রেমওয়ার্ক সফলভাবে ফর্মে প্রয়োগ করা হয়েছে!');
    }
  };

  // Restore snapshot from Revision Modal
  const handleRestoreSnapshot = (data: any) => {
    if (data.title) setTitle(data.title);
    if (data.subtitle) setSubtitle(data.subtitle);
    if (data.section_id || data.sectionId) setSectionId(data.section_id || data.sectionId);
    if (data.category_id || data.categoryId) setCategoryId(data.category_id || data.categoryId);
    if (data.author) setAuthor(data.author);
    if (data.reviewer) setReviewer(data.reviewer);
    if (data.published_at || data.publishedAt) setPublishedAt(data.published_at || data.publishedAt);
    if (data.read_time || data.readTime) setReadTime(data.read_time || data.readTime);
    if (data.status) setStatus(data.status);
    if (data.summary) setSummary(data.summary);
    if (data.citation) {
      setCitationArabic(data.citation.arabic || '');
      setCitationTranslit(data.citation.transliteration || '');
      setCitationBengali(data.citation.bengali || '');
      setCitationRef(data.citation.reference || '');
    }
    if (Array.isArray(data.key_takeaways || data.keyTakeaways)) {
      setKeyTakeaways(data.key_takeaways || data.keyTakeaways);
    }
    if (Array.isArray(data.content_sections || data.contentSections)) {
      setContentSections(data.content_sections || data.contentSections);
    }
    if (Array.isArray(data.references)) {
      setReferences(data.references);
    }
    if (Array.isArray(data.tags)) {
      setTagsInput(data.tags.join(', '));
    } else if (typeof data.tagsInput === 'string') {
      setTagsInput(data.tagsInput);
    }
    setSuccessMsg('নির্বাচিত সংস্করণ সফলভাবে রিস্টোর হয়েছে!');
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg('প্রবন্ধের পূর্ণাঙ্গ শিরোনাম প্রদান করা আবশ্যক।');
      setActiveTab('basic');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('মূল সারসংক্ষেপ ও ভূমিকা প্রদান করা আবশ্যক।');
      setActiveTab('hero');
      return;
    }

    const finalId = id.trim() || `${sectionId}-${slug.trim() || Date.now()}`;
    const finalSlug = slug.trim() || finalId;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const cleanTakeaways = keyTakeaways.filter((t) => t.trim().length > 0);
    const cleanSections = contentSections.filter(
      (s) => s.heading.trim().length > 0 || s.body.trim().length > 0
    );
    const cleanReferences = references.filter((r) => r.trim().length > 0);

    const articleData: DbArticle = {
      id: finalId,
      slug: finalSlug,
      title: title.trim(),
      subtitle: subtitle.trim() || title.trim(),
      section_id: sectionId,
      category_id: categoryId,
      author: author.trim(),
      reviewer: reviewer.trim(),
      published_at: publishedAt.trim(),
      read_time: readTime.trim(),
      is_lead: isLead,
      status,
      tags: parsedTags,
      citation: {
        arabic: citationArabic.trim(),
        transliteration: citationTranslit.trim() || undefined,
        bengali: citationBengali.trim(),
        reference: citationRef.trim()
      },
      summary: summary.trim(),
      key_takeaways: cleanTakeaways,
      content_sections: cleanSections,
      references: cleanReferences,
      views_count: initialArticle?.views_count || 120
    };

    setSaving(true);
    try {
      const result = await saveAdminArticle(articleData);
      if (result.success) {
        try {
          localStorage.removeItem(draftKey);
        } catch {}

        setSuccessMsg('প্রবন্ধটি সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => {
          router.push('/admin/articles');
        }, 1200);
      } else {
        setErrorMsg('সংরক্ষণে সমস্যা হয়েছে: ' + result.error);
      }
    } catch (err: any) {
      setErrorMsg('ত্রুটি: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Render Formatted Islamic Body helper for Preview Mode
  const renderParsedBody = (bodyText: string) => {
    if (!bodyText) return null;

    const parts = bodyText.split(
      /(\[(?:কুরআন|হাদিস|মাসআলা|উক্তি|সতর্কতা):[\s\S]*?\[\/(?:কুরআন|হাদিস|মাসআলা|উক্তি|সতর্কতা)\])/g
    );

    return parts.map((part, pIdx) => {
      // 1. Quran Block
      const quranMatch = part.match(/\[কুরআন:\s*([^\]]*)\]([\s\S]*?)\[\/কুরআন\]/);
      if (quranMatch) {
        const ref = quranMatch[1];
        const content = quranMatch[2];
        const arabicMatch = content.match(/আরবী:\s*(.*)/);
        const translitMatch = content.match(/উচ্চারণ:\s*(.*)/);
        const bengaliMatch = content.match(/অনুবাদ:\s*(.*)/);

        return (
          <div
            key={pIdx}
            className="my-5 p-5 bg-[#FAF8F5] dark:bg-[#1A2421] border-2 border-[#0B4F3B] space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] pb-1 border-b border-[#0B4F3B]/20">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>পবিত্র কুরআন থেকে উদ্ধৃতি</span>
              </span>
              <span className="font-mono">{ref}</span>
            </div>
            {arabicMatch && (
              <p dir="rtl" className="font-arabic text-2xl leading-loose font-bold text-[#0B4F3B] dark:text-[#4CC39A] text-right">
                {arabicMatch[1]}
              </p>
            )}
            {translitMatch && (
              <p className="text-xs italic text-[#6E7571] dark:text-[#9BA39F]">
                উচ্চারণ: {translitMatch[1]}
              </p>
            )}
            {bengaliMatch && (
              <p className="text-sm font-semibold leading-relaxed text-[#141615] dark:text-[#E8E6E1]">
                {bengaliMatch[1]}
              </p>
            )}
          </div>
        );
      }

      // 2. Hadith Block
      const hadithMatch = part.match(/\[হাদিস:\s*([^\]]*)\]([\s\S]*?)\[\/হাদিস\]/);
      if (hadithMatch) {
        const header = hadithMatch[1];
        const content = hadithMatch[2];
        const arabicMatch = content.match(/মতন:\s*(.*)/);
        const narratorMatch = content.match(/রাবী:\s*(.*)/);
        const bengaliMatch = content.match(/অনুবাদ:\s*(.*)/);

        return (
          <div
            key={pIdx}
            className="my-5 p-5 bg-[#FAF8F5] dark:bg-[#1A2421] border-l-4 border-[#B85D19] space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#B85D19] pb-1 border-b border-[#B85D19]/20">
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>হাদিস শরীফ রেফারেন্স</span>
              </span>
              <span className="font-mono">{header}</span>
            </div>
            {arabicMatch && (
              <p dir="rtl" className="font-arabic text-xl leading-loose font-bold text-[#141615] dark:text-[#E8E6E1] text-right">
                {arabicMatch[1]}
              </p>
            )}
            {narratorMatch && (
              <p className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                {narratorMatch[1]}
              </p>
            )}
            {bengaliMatch && (
              <p className="text-sm font-medium leading-relaxed text-[#141615] dark:text-[#E8E6E1]">
                {bengaliMatch[1]}
              </p>
            )}
          </div>
        );
      }

      // 3. Fiqh Block
      const fiqhMatch = part.match(/\[মাসআলা:\s*([^\]]*)\]([\s\S]*?)\[\/মাসআলা\]/);
      if (fiqhMatch) {
        const header = fiqhMatch[1];
        const content = fiqhMatch[2];

        return (
          <div
            key={pIdx}
            className="my-5 p-4 bg-[#F6ECE3] dark:bg-[#2A231C] border border-[#B85D19] space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#B85D19]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>ফিকহী হুকুম ও মাসআলা</span>
              </span>
              <span className="font-mono bg-[#B85D19] text-white px-2 py-0.5">{header}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#141615] dark:text-[#E8E6E1] whitespace-pre-line">
              {content.trim()}
            </p>
          </div>
        );
      }

      // 4. Salaf Quote Block
      const quoteMatch = part.match(/\[উক্তি:\s*([^\]]*)\]([\s\S]*?)\[\/উক্তি\]/);
      if (quoteMatch) {
        const header = quoteMatch[1];
        const content = quoteMatch[2];

        return (
          <div
            key={pIdx}
            className="my-5 p-4 bg-[#E6F0EC] dark:bg-[#15332A] border-l-4 border-[#0B4F3B] space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
              <span className="flex items-center gap-1.5">
                <Quote className="w-4 h-4" />
                <span>সালাফে সালেহীনের প্রজ্ঞাময় উক্তি</span>
              </span>
              <span className="font-mono">{header}</span>
            </div>
            <p className="text-sm font-serif italic leading-relaxed text-[#141615] dark:text-[#E8E6E1] whitespace-pre-line">
              “{content.trim()}”
            </p>
          </div>
        );
      }

      // 5. Warning / Misconception Refutation Block
      const warningMatch = part.match(/\[সতর্কতা:\s*([^\]]*)\]([\s\S]*?)\[\/সতর্কতা\]/);
      if (warningMatch) {
        const header = warningMatch[1];
        const content = warningMatch[2];

        return (
          <div
            key={pIdx}
            className="my-5 p-4 bg-[#FBEAE8] dark:bg-[#331D1A] border-l-4 border-[#DC2626] space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#DC2626]">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>সতর্কতামূলক বিশ্লেষণ ও তাহকীক</span>
              </span>
              <span className="font-mono">{header}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#141615] dark:text-[#E8E6E1] whitespace-pre-line">
              {content.trim()}
            </p>
          </div>
        );
      }

      // Regular paragraph text
      if (!part.trim()) return null;
      return (
        <div key={pIdx} className="space-y-3">
          {part
            .split('\n\n')
            .filter(Boolean)
            .map((para, paraIdx) => (
              <p key={paraIdx} className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {para}
              </p>
            ))}
        </div>
      );
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 transition-all ${isZenMode ? 'fixed inset-0 z-50 bg-[#FAF8F5] dark:bg-[#101514] p-4 sm:p-8 overflow-y-auto' : ''}`}
    >
      {/* RECOVERABLE DRAFT BANNER */}
      {hasRecoverableDraft && (
        <div className="bg-[#FFF6E5] border-2 border-[#B85D19] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B85D19] shrink-0" />
            <div>
              <span className="font-bold text-sm text-[#141615] block">
                একটি অসংরক্ষিত ড্রাফট পাওয়া গেছে!
              </span>
              <span className="text-xs text-[#6E7571]">
                সর্বশেষ সংরক্ষণ: {draftSavedTime || 'পূর্ববর্তী সেশন'} • আপনি কি লেখাটি রিকভার করতে চান?
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRecoverDraft}
              className="px-3.5 py-1.5 bg-[#B85D19] hover:bg-[#9B4E15] text-white text-xs font-bold border border-[#141615]"
            >
              ড্রাফট রিকভার করুন
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 bg-white text-[#6E7571] hover:text-[#141615] text-xs font-semibold border border-[#DCD7CD]"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* TOAST / ALERTS */}
      {successMsg && (
        <div className="bg-[#E6F0EC] border-2 border-[#0B4F3B] text-[#0B4F3B] p-4 font-semibold flex items-center gap-3 shadow-xs">
          <CheckCircle className="w-5 h-5 text-[#0B4F3B]" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-[#FBEAE8] border-2 border-[#D9381E] text-[#D9381E] p-4 font-semibold flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-[#D9381E]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STICKY TOP ACTION BAR */}
      <div className="bg-[#FFFFFF] dark:bg-[#171F1D] border-2 border-[#141615] p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] text-[#141615] dark:text-[#E8E6E1] hover:bg-[#F2EFE9] transition-colors"
            title="তালিকায় ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#B85D19] uppercase tracking-wider">
                {isEdit ? 'প্রবন্ধ সম্পাদনা স্টুডিও ৩.০' : 'নতুন প্রবন্ধ রচনা স্টুডিও ৩.০'}
              </span>
              {draftSavedTime && (
                <span className="text-[10px] text-[#0B4F3B] dark:text-[#4CC39A] bg-[#E6F0EC] dark:bg-[#15332A] px-1.5 py-0.5 font-mono">
                  ✓ অটো-সেভ {draftSavedTime}
                </span>
              )}
            </div>
            <h1 className="font-editorial text-lg sm:text-xl font-bold text-[#0B4F3B] dark:text-[#4CC39A] truncate max-w-xs sm:max-w-md md:max-w-lg">
              {title || (isEdit ? 'সম্পাদনা মোড' : 'শিরোনামহীন নতুন প্রবন্ধ')}
            </h1>
          </div>
        </div>

        {/* CONTROLS: STATS + CO-PILOT ACTIONS + VIEW TOGGLE + SAVE */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* WORD STATS PILL */}
          <div className="hidden lg:flex items-center gap-2 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#141615] px-2.5 py-1 text-xs">
            <span className="font-mono text-[#0B4F3B] dark:text-[#4CC39A] font-bold">
              {toBengaliDigits(stats.words)} শব্দ
            </span>
            <span className="text-[#6E7571]">•</span>
            <span className="font-mono text-[#B85D19] font-bold">
              {stats.readTimeString}
            </span>
            <button
              type="button"
              onClick={() => setReadTime(stats.readTimeString)}
              className="text-[10px] text-[#0B4F3B] dark:text-[#4CC39A] hover:underline font-bold ml-1 border-l pl-2 border-[#DCD7CD] dark:border-[#3B4D47]"
              title="পাঠের সময় ইনপুটে সেট করুন"
            >
              সিঙ্ক
            </button>
          </div>

          {/* OUTLINE CO-PILOT MODAL TRIGGER */}
          <button
            type="button"
            onClick={() => setFrameworkModalOpen(true)}
            className="px-2.5 py-1.5 bg-[#FFF6E5] hover:bg-[#FCE8CC] border border-[#B85D19] text-[#B85D19] text-xs font-bold flex items-center gap-1 shadow-xs"
            title="১-ক্লিক আর্টিকেল আউটলাইন জেনারেটর"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">আউটলাইন সহকারী</span>
          </button>

          {/* REVISIONS & EXPORT MODAL TRIGGER */}
          <button
            type="button"
            onClick={() => setRevisionModalOpen(true)}
            className="px-2.5 py-1.5 bg-[#FAF8F5] dark:bg-[#232F2B] hover:bg-[#E6F0EC] border border-[#141615] text-[#141615] dark:text-[#E8E6E1] text-xs font-bold flex items-center gap-1 shadow-xs"
            title="রিভিশন হিস্ট্রি ও JSON/Markdown এক্সপোর্ট"
          >
            <History className="w-3.5 h-3.5 text-[#0B4F3B] dark:text-[#4CC39A]" />
            <span className="hidden sm:inline">ব্যাকআপ ও ভার্সন</span>
          </button>

          {/* ZEN MODE TOGGLE */}
          <button
            type="button"
            onClick={() => setIsZenMode(!isZenMode)}
            className={`p-1.5 border border-[#141615] text-xs transition-colors ${
              isZenMode ? 'bg-[#0B4F3B] text-white' : 'bg-white dark:bg-[#232F2B] text-[#141615] dark:text-[#E8E6E1]'
            }`}
            title={isZenMode ? 'সাধারণ মোডে ফিরুন' : 'জেন / মনোযোগ মোড'}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* VIEW MODE TOGGLE */}
          <div className="flex items-center bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#141615] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-2.5 py-1 text-xs font-bold transition-colors ${
                viewMode === 'editor'
                  ? 'bg-[#0B4F3B] text-white'
                  : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#F2EFE9]'
              }`}
            >
              এডিটর
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 text-xs font-bold transition-colors ${
                viewMode === 'split'
                  ? 'bg-[#0B4F3B] text-white'
                  : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#F2EFE9]'
              }`}
            >
              স্প্লিট
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 text-xs font-bold transition-colors ${
                viewMode === 'preview'
                  ? 'bg-[#0B4F3B] text-white'
                  : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#F2EFE9]'
              }`}
            >
              প্রিভিউ
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-1.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold border border-[#141615] flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5-MODULAR TAB NAVIGATION BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-2 border-[#141615] bg-[#FFFFFF] dark:bg-[#171F1D] text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`py-3 px-3 flex items-center justify-center gap-2 border-r border-[#DCD7CD] dark:border-[#2A3834] transition-colors ${
            activeTab === 'basic'
              ? 'bg-[#0B4F3B] text-white'
              : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>১. মৌলিক তথ্য ও পরিচয়</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`py-3 px-3 flex items-center justify-center gap-2 border-r border-[#DCD7CD] dark:border-[#2A3834] transition-colors ${
            activeTab === 'hero'
              ? 'bg-[#0B4F3B] text-white'
              : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>২. প্রচ্ছদ উদ্ধৃতি ও সারসংক্ষেপ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('body')}
          className={`py-3 px-3 flex items-center justify-center gap-2 border-r border-[#DCD7CD] dark:border-[#2A3834] transition-colors ${
            activeTab === 'body'
              ? 'bg-[#0B4F3B] text-white'
              : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>৩. অনুচ্ছেদ ও ইসলামিক ব্লকস</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refs')}
          className={`py-3 px-3 flex items-center justify-center gap-2 border-r border-[#DCD7CD] dark:border-[#2A3834] transition-colors ${
            activeTab === 'refs'
              ? 'bg-[#0B4F3B] text-white'
              : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>৪. তথ্যসূত্র ও ট্যাগস</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`py-3 px-3 flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'seo'
              ? 'bg-[#B85D19] text-white'
              : 'text-[#141615] dark:text-[#E8E6E1] hover:bg-[#FAF8F5] dark:hover:bg-[#232F2B]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>৫. এসইও ও প্রিভিউ স্কোর</span>
        </button>
      </div>

      {/* MAIN WORKSPACE: SPLIT GRID OR SINGLE */}
      <div
        className={
          viewMode === 'split'
            ? 'grid grid-cols-1 lg:grid-cols-12 gap-6'
            : viewMode === 'preview'
            ? 'max-w-4xl mx-auto'
            : 'space-y-6'
        }
      >
        {/* LEFT / MAIN COLUMN: FORM TABS (Hidden in full preview mode) */}
        {viewMode !== 'preview' && (
          <div className={viewMode === 'split' ? 'lg:col-span-6 space-y-5' : 'space-y-5'}>
            {/* TAB 1: BASIC INFO & METADATA */}
            {activeTab === 'basic' && (
              <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
                  <h3 className="font-editorial text-base font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#B85D19]" />
                    <span>প্রবন্ধের শিরোনাম, পরিচিতি ও শ্রেণীবিন্যাস</span>
                  </h3>
                  <span className="text-xs text-[#6E7571]">ধাপ ১ / ৫</span>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                    প্রবন্ধের পূর্ণাঙ্গ শিরোনাম (Title) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="যেমন: তাওহীদের অর্থ, তাৎপর্য ও মানব মর্যাদায় এর বৈপ্লবিক প্রভাব"
                    className="w-full p-2.5 text-sm sm:text-base font-bold bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#141615] text-[#0B4F3B] dark:text-[#4CC39A]"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                    উপ-শিরোনাম বা সাবটাইটেল (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="যেমন: কুরআন ও সুন্নাহর আলোকে রুবূবিয়্যাহ ও উলূহিয়্যাহর বিশদ পর্যালোচনা"
                    className="w-full p-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                </div>

                {/* Section & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] mb-1">
                      মূল বিভাগ (Primary Section) *
                    </label>
                    <select
                      value={sectionId}
                      onChange={(e) => setSectionId(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white dark:bg-[#1F2926] border border-[#141615]"
                    >
                      {SECTIONS_DATA.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.arabicTitle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#B85D19] mb-1">
                      ক্যাটেগরি (Category) *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      disabled={loadingCategories}
                      className="w-full p-2.5 text-xs bg-white dark:bg-[#1F2926] border border-[#141615]"
                    >
                      {categoriesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.arabic_name ? `(${c.arabic_name})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Author & Reviewer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      মূল লেখক বা সংকলক
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      তাহকীক ও সম্পাদনা আলেম
                    </label>
                    <input
                      type="text"
                      value={reviewer}
                      onChange={(e) => setReviewer(e.target.value)}
                      className="w-full p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                </div>

                {/* Published Date & Reading Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      প্রকাশকাল
                    </label>
                    <input
                      type="text"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      পাঠের সময়
                    </label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      প্রকাশনা স্ট্যাটাস
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#141615]"
                    >
                      <option value="published">প্রকাশিত (Published)</option>
                      <option value="draft">ড্রাফট (Draft)</option>
                      <option value="review">পর্যালোচনাধীন (In Review)</option>
                    </select>
                  </div>
                </div>

                {/* Slug & Canonical URL Helper */}
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                      ইউআরএল স্লাগ (Canonical Slug)
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] text-[#B85D19] hover:underline font-bold"
                    >
                      শিরোনাম থেকে অটো-জেনারেট
                    </button>
                  </div>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-url-slug"
                    className="w-full p-2 text-xs font-mono bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                  {liveUrl && (
                    <div className="text-[11px] text-[#6E7571] flex items-center gap-1.5 truncate">
                      <Globe className="w-3.5 h-3.5 text-[#0B4F3B]" />
                      <span className="truncate">লাইভ ঠিকানা: {liveUrl}</span>
                    </div>
                  )}
                </div>

                {/* Lead Article Toggle */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#DCD7CD] dark:border-[#2A3834]">
                  <input
                    type="checkbox"
                    id="isLead"
                    checked={isLead}
                    onChange={(e) => setIsLead(e.target.checked)}
                    className="w-4 h-4 text-[#0B4F3B]"
                  />
                  <label htmlFor="isLead" className="text-xs font-bold text-[#141615] dark:text-[#E8E6E1]">
                    ক্যাটেগরির প্রধান লিড প্রবন্ধ হিসেবে প্রদর্শন করুন
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: HERO CITATION & SUMMARY */}
            {activeTab === 'hero' && (
              <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
                  <h3 className="font-editorial text-base font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#B85D19]" />
                    <span>প্রচ্ছদ প্রধান উদ্ধৃতি ও সম্পাদকীয় সারসংক্ষেপ</span>
                  </h3>
                  <span className="text-xs text-[#6E7571]">ধাপ ২ / ৫</span>
                </div>

                {/* Arabic Diacritics Palette for Hero Citation */}
                <ArabicPalette
                  onInsert={(symbol) => setCitationArabic((prev) => prev + symbol)}
                  compact
                />

                {/* Primary Citation Arabic */}
                <div>
                  <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] mb-1">
                    প্রধান আয়াত বা মূল হাদিসের আরবী ইবারত (Hero Citation Arabic)
                  </label>
                  <textarea
                    dir="rtl"
                    rows={2}
                    value={citationArabic}
                    onChange={(e) => setCitationArabic(e.target.value)}
                    placeholder="قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ ۝"
                    className="w-full p-3 font-arabic text-xl leading-loose bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#141615] text-right"
                  />
                </div>

                {/* Transliteration & Reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      আরবী উচ্চারণ (Transliteration)
                    </label>
                    <input
                      type="text"
                      value={citationTranslit}
                      onChange={(e) => setCitationTranslit(e.target.value)}
                      placeholder="যেমন: কুল ইন্না সালাতী ওয়া নুসূকী..."
                      className="w-full p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                      উদ্ধৃতির সুনির্দিষ্ট সূত্র (Reference)
                    </label>
                    <input
                      type="text"
                      value={citationRef}
                      onChange={(e) => setCitationRef(e.target.value)}
                      placeholder="যেমন: সূরা আল-আনআম (৬): ১৬২"
                      className="w-full p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                    />
                  </div>
                </div>

                {/* Bengali Translation */}
                <div>
                  <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                    উদ্ধৃতির বঙ্গানুবাদ (Hero Translation) *
                  </label>
                  <textarea
                    rows={2}
                    value={citationBengali}
                    onChange={(e) => setCitationBengali(e.target.value)}
                    placeholder="বলুন, নিশ্চয়ই আমার সালাত, আমার কোরবানি, আমার জীবন এবং আমার মরণ বিশ্বজগতের প্রতিপালক আল্লাহরই জন্য..."
                    className="w-full p-3 text-sm bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                </div>

                {/* Editorial Summary */}
                <div className="pt-2 border-t border-[#DCD7CD] dark:border-[#2A3834]">
                  <label className="block text-xs font-bold text-[#B85D19] mb-1">
                    সম্পাদকীয় সারসংক্ষেপ ও ভূমিকা (Editorial Summary) *
                  </label>
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="এই প্রবন্ধে তাওহীদের মূল তাৎপর্য, রুবূবিয়্যাহ ও উলূহিয়্যাহর পার্থক্য এবং সমকালীন জীবনে একজন মুমিনের আমল পরিশুদ্ধির প্রামাণ্য দিকনির্দেশনা সংকলিত হয়েছে..."
                    className="w-full p-3 text-sm bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#141615]"
                  />
                </div>

                {/* Key Takeaways Builder */}
                <div className="space-y-3 pt-2 border-t border-[#DCD7CD] dark:border-[#2A3834]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#B85D19]" />
                      <span>প্রবন্ধের মূল শিক্ষা ও সারসংক্ষেপ (Key Takeaways)</span>
                    </label>
                    <button
                      type="button"
                      onClick={addTakeaway}
                      className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন পয়েন্ট যোগ</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {keyTakeaways.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 text-center text-xs font-bold text-[#6E7571]">
                          {toBengaliDigits(idx + 1)}.
                        </span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                          placeholder="যেমন: তাওহীদুল উলূহিয়্যাহ মানবজাতির মুক্তির মূল চাবিকাঠি"
                          className="flex-1 p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                        />
                        <button
                          type="button"
                          onClick={() => moveTakeaway(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 border border-[#DCD7CD] text-[#6E7571] hover:text-[#141615] disabled:opacity-30"
                          title="উপরে নিন"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveTakeaway(idx, 'down')}
                          disabled={idx === keyTakeaways.length - 1}
                          className="p-1.5 border border-[#DCD7CD] text-[#6E7571] hover:text-[#141615] disabled:opacity-30"
                          title="নিচে নিন"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTakeaway(idx)}
                          className="p-1.5 border border-[#DCD7CD] text-[#D9381E] hover:bg-[#FBEAE8]"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTENT SECTIONS & ISLAMIC BLOCKS */}
            {activeTab === 'body' && (
              <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2 gap-2">
                  <div>
                    <h3 className="font-editorial text-base font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#B85D19]" />
                      <span>প্রবন্ধের মূল অনুচ্ছেদ ও ইসলামিক ব্লক বিন্যাস</span>
                    </h3>
                    <p className="text-xs text-[#6E7571]">
                      মোট অনুচ্ছেদ: {contentSections.length}টি • প্রতি অনুচ্ছেদে প্রামাণ্য ইসলামিক ব্লক সংযুক্ত করুন।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addContentSection}
                    className="px-3 py-1.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন অনুচ্ছেদ যোগ</span>
                  </button>
                </div>

                {/* SECTION CARDS */}
                <div className="space-y-4">
                  {contentSections.map((sec, secIdx) => (
                    <div
                      key={secIdx}
                      className="p-4 bg-[#FAF8F5] dark:bg-[#171F1D] border-2 border-[#141615] space-y-3 shadow-xs"
                    >
                      {/* Section Card Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#0B4F3B] text-white text-xs font-bold flex items-center justify-center font-mono">
                            {toBengaliDigits(secIdx + 1)}
                          </span>
                          <span className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                            অনুচ্ছেদ {toBengaliDigits(secIdx + 1)}
                          </span>
                        </div>

                        {/* Section Actions: Block Inserter + Re-order + Duplicate + Delete */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openBlockBuilder(secIdx)}
                            className="px-2.5 py-1 bg-[#FFF6E5] hover:bg-[#FCE8CC] border border-[#B85D19] text-[#B85D19] text-xs font-bold flex items-center gap-1"
                            title="কুরআন, হাদিস বা ফিকহী ব্লক যুক্ত করুন"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>+ ইসলামিক ব্লক</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => duplicateContentSection(secIdx)}
                            className="p-1 border border-[#DCD7CD] dark:border-[#3B4D47] text-[#6E7571] hover:text-[#141615]"
                            title="অনুলিপি তৈরি করুন"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveContentSection(secIdx, 'up')}
                            disabled={secIdx === 0}
                            className="p-1 border border-[#DCD7CD] dark:border-[#3B4D47] text-[#6E7571] disabled:opacity-30"
                            title="উপরে নিন"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveContentSection(secIdx, 'down')}
                            disabled={secIdx === contentSections.length - 1}
                            className="p-1 border border-[#DCD7CD] dark:border-[#3B4D47] text-[#6E7571] disabled:opacity-30"
                            title="নিচে নিন"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeContentSection(secIdx)}
                            className="p-1 border border-[#DCD7CD] text-[#DC2626] hover:bg-[#FBEAE8]"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Section Heading */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                          অনুচ্ছেদের শিরোনাম (Heading 2)
                        </label>
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => handleSectionChangeContent(secIdx, 'heading', e.target.value)}
                          placeholder="যেমন: ১. তাওহীদের পরিচয় ও মৌলিক তাৎপর্য"
                          className="w-full p-2 text-xs sm:text-sm font-bold bg-white dark:bg-[#1F2926] border border-[#141615]"
                        />
                      </div>

                      {/* Formatting Bar */}
                      <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#2A3834] p-1 text-xs">
                        <button
                          type="button"
                          onClick={() => insertFormatting(secIdx, '**', '**')}
                          className="p-1 hover:bg-[#FAF8F5] text-[#141615] dark:text-[#E8E6E1] font-bold"
                          title="বোল্ড টেক্সট"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(secIdx, '*', '*')}
                          className="p-1 hover:bg-[#FAF8F5] text-[#141615] dark:text-[#E8E6E1] italic"
                          title="তির্যক টেক্সট"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(secIdx, '\n- ')}
                          className="p-1 hover:bg-[#FAF8F5] text-[#141615] dark:text-[#E8E6E1]"
                          title="বুলেট পয়েন্ট"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(secIdx, '\n১. ')}
                          className="p-1 hover:bg-[#FAF8F5] text-[#141615] dark:text-[#E8E6E1]"
                          title="ক্রমিক নম্বর"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting(secIdx, '\n> ')}
                          className="p-1 hover:bg-[#FAF8F5] text-[#141615] dark:text-[#E8E6E1]"
                          title="উদ্ধৃতি লাইন"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>

                        <div className="h-4 w-px bg-[#DCD7CD] dark:bg-[#3B4D47] mx-1" />

                        {/* Quick Honorifics */}
                        <span className="text-[10px] text-[#6E7571] mr-1">সম্মানসূচক:</span>
                        {['ﷺ', 'ﷻ', 'ؑ', 'ؓ', 'ؒ'].map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => insertFormatting(secIdx, sym)}
                            className="px-1.5 py-0.5 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#0B4F3B] text-xs font-serif text-[#0B4F3B] dark:text-[#4CC39A]"
                          >
                            {sym}
                          </button>
                        ))}
                      </div>

                      {/* Section Body */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                          অনুচ্ছেদের মূল বক্তব্য ও বিশ্লেষণ (Body Text with Islamic Blocks)
                        </label>
                        <textarea
                          rows={6}
                          value={sec.body}
                          onChange={(e) => handleSectionChangeContent(secIdx, 'body', e.target.value)}
                          placeholder="এই অনুচ্ছেদের বিস্তারিত আলোচনা লিখুন... অথবা উপরের '+ ইসলামিক ব্লক' বোতাম ব্যবহার করে কুরআন ও হাদিস যোগ করুন।"
                          className="w-full p-3 text-xs sm:text-sm leading-relaxed bg-white dark:bg-[#1F2926] border border-[#141615] font-sans"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={addContentSection}
                    className="px-4 py-2 bg-[#FAF8F5] dark:bg-[#232F2B] hover:bg-[#E6F0EC] border-2 border-dashed border-[#0B4F3B] text-[#0B4F3B] dark:text-[#4CC39A] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ আরও একটি নতুন অনুচ্ছেদ যোগ করুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: REFERENCES & TAXONOMY */}
            {activeTab === 'refs' && (
              <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
                  <h3 className="font-editorial text-base font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#B85D19]" />
                    <span>প্রামাণ্য গ্রন্থপঞ্জি ও বিষয়ভিত্তিক ট্যাগস</span>
                  </h3>
                  <span className="text-xs text-[#6E7571]">ধাপ ৪ / ৫</span>
                </div>

                {/* References Builder */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] block">
                      তথ্যসূত্র ও গবেষণা গ্রন্থপঞ্জি (References) *
                    </label>
                    <button
                      type="button"
                      onClick={addReference}
                      className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন সূত্র যোগ</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {references.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 text-center text-xs font-bold text-[#6E7571]">
                          {toBengaliDigits(idx + 1)}.
                        </span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleRefChange(idx, e.target.value)}
                          placeholder="যেমন: সহীহুল বুখারী — কিতাবুত তাওহীদ, হাদিস নং ৭৩৭২"
                          className="flex-1 p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                        />
                        <button
                          type="button"
                          onClick={() => removeReference(idx)}
                          className="p-1.5 border border-[#DCD7CD] text-[#D9381E] hover:bg-[#FBEAE8]"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="pt-3 border-t border-[#DCD7CD] dark:border-[#2A3834] space-y-2">
                  <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1]">
                    বিষয়ভিত্তিক ট্যাগসমূহ (কমা দিয়ে পৃথক করুন)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="তাওহীদ, আকীদা, ঈমান, আসমাউল হুসনা, সালাত"
                    className="w-full p-2 text-xs bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#6E7571]">
                    <span>জনপ্রিয় ট্যাগ সাজেশন:</span>
                    {['তাওহীদ', 'কুরআন তাফসীর', 'সহীহ হাদিস', 'আকীদা', 'সীরাত', 'ফিকহী বিধান', 'সুন্নাহ'].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => {
                          const current = tagsInput ? tagsInput.split(',').map((t) => t.trim()) : [];
                          if (!current.includes(sug)) {
                            setTagsInput([...current, sug].filter(Boolean).join(', '));
                          }
                        }}
                        className="px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] hover:border-[#0B4F3B] hover:text-[#0B4F3B]"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: LIVE SEO & AUDIT SCORE */}
            {activeTab === 'seo' && (
              <LiveSeoScoreCard
                title={title}
                subtitle={subtitle}
                summary={summary}
                sectionSlug={currentSection?.slug || sectionId}
                categorySlug={currentCategory?.slug || categoryId}
                articleSlug={slug}
                categoryName={currentCategory?.name || 'ইসলামিক জ্ঞানকোষ'}
                citationArabic={citationArabic}
                citationBengali={citationBengali}
                keyTakeaways={keyTakeaways}
                contentSections={contentSections}
                references={references}
                tags={tagsInput.split(',').map((t) => t.trim()).filter(Boolean)}
                wordCount={stats.words}
              />
            )}
          </div>
        )}

        {/* RIGHT / PREVIEW COLUMN (Shown in split mode or full preview mode) */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={viewMode === 'split' ? 'lg:col-span-6 space-y-4' : 'space-y-4'}>
            {/* THEME PICKER FOR PREVIEW */}
            <div className="bg-white dark:bg-[#1A2421] border-2 border-[#141615] p-3 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#B85D19]" />
                <span>লাইভ রিডার মোড প্রিভিউ</span>
              </span>
              <div className="flex items-center gap-1">
                {(['paper', 'sepia', 'dark'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewTheme(mode)}
                    className={`px-2.5 py-1 text-xs font-bold transition-colors ${
                      previewTheme === mode
                        ? 'bg-[#0B4F3B] text-white'
                        : 'bg-[#FAF8F5] dark:bg-[#232F2B] text-[#141615] dark:text-[#E8E6E1] border border-[#DCD7CD]'
                    }`}
                  >
                    {mode === 'paper' ? 'পেপার' : mode === 'sepia' ? 'সেপিয়া' : 'ডার্ক'}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div
              className={`p-6 sm:p-8 border-2 border-[#141615] shadow-md transition-colors ${
                previewTheme === 'paper'
                  ? 'bg-[#FAF8F5] text-[#141615]'
                  : previewTheme === 'sepia'
                  ? 'bg-[#F3EAD8] text-[#1E1912]'
                  : 'bg-[#101514] text-[#F2F0EA]'
              }`}
            >
              <article className="space-y-6">
                {/* Meta Header */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="px-2.5 py-0.5 bg-[#0B4F3B] text-white">
                      {currentSection?.name || 'বিভাগ'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#B85D19] text-white">
                      {currentCategory?.name || 'ক্যাটেগরি'}
                    </span>
                    <span className="text-xs text-[#6E7571]">
                      • {publishedAt} • {readTime}
                    </span>
                  </div>

                  <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold leading-tight">
                    {title || 'প্রবন্ধের পূর্ণাঙ্গ শিরোনাম'}
                  </h1>

                  {subtitle && (
                    <p className="text-sm sm:text-base font-medium opacity-80">
                      {subtitle}
                    </p>
                  )}

                  <div className="p-3 bg-black/5 dark:bg-white/5 border border-black/10 flex items-center justify-between text-xs">
                    <span>লেখক: <strong>{author}</strong></span>
                    <span>তাহকীক: <strong>{reviewer}</strong></span>
                  </div>
                </div>

                {/* Hero Citation */}
                {citationBengali && (
                  <div className="p-5 bg-black/5 dark:bg-white/5 border-l-4 border-[#0B4F3B] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B4F3B] block">
                      প্রচ্ছদ প্রধান উদ্ধৃতি ({citationRef || 'রেফারেন্স'})
                    </span>
                    {citationArabic && (
                      <p dir="rtl" className="font-arabic text-2xl leading-loose font-bold text-right text-[#0B4F3B]">
                        {citationArabic}
                      </p>
                    )}
                    {citationTranslit && (
                      <p className="text-xs italic opacity-70">
                        উচ্চারণ: {citationTranslit}
                      </p>
                    )}
                    <p className="text-base font-bold">
                      অনুবাদ: “{citationBengali}”
                    </p>
                  </div>
                )}

                {/* Key Takeaways */}
                {keyTakeaways.some((t) => t.trim().length > 0) && (
                  <div className="p-5 bg-[#B85D19]/10 border-l-4 border-[#B85D19] space-y-2">
                    <h3 className="font-editorial text-sm font-bold text-[#B85D19] flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>প্রবন্ধের মূল শিক্ষা ও সারসংক্ষেপ</span>
                    </h3>
                    <ul className="space-y-1 text-xs sm:text-sm list-disc pl-5">
                      {keyTakeaways.map((item, idx) => (
                        item.trim() ? <li key={idx}>{item}</li> : null
                      ))}
                    </ul>
                  </div>
                )}

                {/* Content Sections */}
                <div className="space-y-6 pt-2">
                  {contentSections.map((sec, idx) => (
                    <div key={idx} className="space-y-3">
                      {sec.heading && (
                        <h2 className="font-editorial text-lg sm:text-xl font-bold border-b pb-2 border-black/10">
                          {sec.heading}
                        </h2>
                      )}
                      <div className="leading-relaxed">
                        {renderParsedBody(sec.body)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* References */}
                {references.some((r) => r.trim().length > 0) && (
                  <div className="p-5 bg-black/5 dark:bg-white/5 border border-black/15 space-y-2">
                    <h4 className="font-editorial text-xs font-bold uppercase tracking-wider text-[#0B4F3B]">
                      তথ্যসূত্র ও প্রামাণ্য গ্রন্থপঞ্জি (References)
                    </h4>
                    <ol className="list-decimal pl-5 text-xs space-y-1">
                      {references.map((ref, idx) => (
                        ref.trim() ? <li key={idx}>{ref}</li> : null
                      ))}
                    </ol>
                  </div>
                )}
              </article>
            </div>
          </div>
        )}
      </div>

      {/* ISLAMIC BLOCK BUILDER MODAL */}
      <IslamicBlockModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onInsertMarkup={(markup) => {
          const currentBody = contentSections[targetSectionIndex]?.body || '';
          handleSectionChangeContent(targetSectionIndex, 'body', currentBody + markup);
        }}
      />

      {/* FRAMEWORK GENERATOR MODAL */}
      <FrameworkGeneratorModal
        isOpen={frameworkModalOpen}
        onClose={() => setFrameworkModalOpen(false)}
        onApplyFramework={handleApplyFramework}
      />

      {/* REVISION HISTORY & EXPORT MODAL */}
      <RevisionHistoryModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        articleId={id || initialArticle?.id || 'new'}
        currentArticleData={{
          id,
          slug,
          title,
          subtitle,
          section_id: sectionId,
          category_id: categoryId,
          author,
          reviewer,
          published_at: publishedAt,
          read_time: readTime,
          is_lead: isLead,
          status,
          summary,
          citation: {
            arabic: citationArabic,
            transliteration: citationTranslit,
            bengali: citationBengali,
            reference: citationRef
          },
          key_takeaways: keyTakeaways,
          content_sections: contentSections,
          references,
          tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
          bodyLength: fullArticleText.length
        }}
        onRestoreSnapshot={handleRestoreSnapshot}
      />
    </form>
  );
}
