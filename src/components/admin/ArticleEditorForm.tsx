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
  Loader2
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

interface ArticleEditorFormProps {
  initialArticle?: DbArticle | null;
  isEdit?: boolean;
}

export default function ArticleEditorForm({ initialArticle, isEdit = false }: ArticleEditorFormProps) {
  const router = useRouter();

  // Mode: 'editor' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [previewTheme, setPreviewTheme] = useState<'paper' | 'sepia' | 'dark'>('paper');

  // Form State
  const [id, setId] = useState(initialArticle?.id || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [sectionId, setSectionId] = useState(initialArticle?.section_id || 'allah');
  const [categoryId, setCategoryId] = useState(initialArticle?.category_id || 'tawheed-fundamentals');
  const [author, setAuthor] = useState(initialArticle?.author || 'মাওলানা আব্দুল হক');
  const [reviewer, setReviewer] = useState(initialArticle?.reviewer || 'মুফতী মাহমুদ হাসান (তাহকীক ও সম্পাদনা)');
  const [publishedAt, setPublishedAt] = useState(initialArticle?.published_at || '১৭ অক্টোবর ২০২৬');
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

  // Islamic Block Builder Modal State
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockType, setBlockType] = useState<'quran' | 'hadith' | 'fiqh'>('quran');
  const [targetSectionIndex, setTargetSectionIndex] = useState<number>(0);
  const [blockArabic, setBlockArabic] = useState('');
  const [blockTranslit, setBlockTranslit] = useState('');
  const [blockBengali, setBlockBengali] = useState('');
  const [blockRef, setBlockRef] = useState('');
  const [blockNarrator, setBlockNarrator] = useState('');
  const [blockGrade, setBlockGrade] = useState('সহীহ');
  const [blockRuling, setBlockRuling] = useState('ওয়াজিব');

  // Load Categories on mount and when section changes
  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      try {
        const cats = await fetchAdminCategories(sectionId);
        if (mounted) {
          setCategoriesList(cats);
          setLoadingCategories(false);
          // If current categoryId is not in cats, pick the first one
          if (cats.length > 0 && !cats.some(c => c.id === categoryId)) {
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
          // If title differs from initialArticle or has substantial unsaved work
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

  // Auto-save draft every 15s when form state changes
  useEffect(() => {
    if (typeof window === 'undefined' || isDraftRestored) return;
    const timer = setTimeout(() => {
      try {
        const draftData = {
          savedAt: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true }),
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

  // Discard Draft
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      setHasRecoverableDraft(false);
    } catch (e) {}
  };

  // Live Stats (Words, Characters, Calculated Reading Time)
  const fullArticleText = useMemo(() => {
    const sectionsText = contentSections.map(s => `${s.heading} ${s.body}`).join(' ');
    const takeawaysText = keyTakeaways.join(' ');
    return `${title} ${subtitle} ${summary} ${citationArabic} ${citationBengali} ${takeawaysText} ${sectionsText}`;
  }, [title, subtitle, summary, citationArabic, citationBengali, keyTakeaways, contentSections]);

  const stats = useMemo(() => {
    return calculateBengaliStats(fullArticleText);
  }, [fullArticleText]);

  // Handle Section Change
  const handleSectionChange = (newSecId: string) => {
    setSectionId(newSecId);
  };

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
  const openBlockBuilder = (sectionIdx: number, type: 'quran' | 'hadith' | 'fiqh') => {
    setTargetSectionIndex(sectionIdx);
    setBlockType(type);
    setBlockArabic('');
    setBlockTranslit('');
    setBlockBengali('');
    setBlockRef('');
    setBlockNarrator('');
    setBlockGrade('সহীহ');
    setBlockRuling('ওয়াজিব');
    setBlockModalOpen(true);
  };

  // Insert Islamic Block into Section Body
  const handleInsertBlock = () => {
    let blockMarkup = '';

    if (blockType === 'quran') {
      blockMarkup = `\n\n[কুরআন: ${blockRef.trim() || 'পবিত্র কুরআন'}]\n${blockArabic.trim() ? `আরবী: ${blockArabic.trim()}\n` : ''}${blockTranslit.trim() ? `উচ্চারণ: ${blockTranslit.trim()}\n` : ''}অনুবাদ: "${blockBengali.trim()}"\n[/কুরআন]\n\n`;
    } else if (blockType === 'hadith') {
      blockMarkup = `\n\n[হাদিস: ${blockRef.trim() || 'হাদিস শরীফ'} | তাহকীক: ${blockGrade}]\n${blockArabic.trim() ? `মতন: ${blockArabic.trim()}\n` : ''}${blockNarrator.trim() ? `রাবী: ${blockNarrator.trim()}\n` : ''}অনুবাদ: "${blockBengali.trim()}"\n[/হাদিস]\n\n`;
    } else if (blockType === 'fiqh') {
      blockMarkup = `\n\n[মাসআলা: ${blockRef.trim() || 'শরীয়াহ বিধান'} | হুকুম: ${blockRuling}]\n${blockBengali.trim()}\n[/মাসআলা]\n\n`;
    }

    const currentBody = contentSections[targetSectionIndex]?.body || '';
    handleSectionChangeContent(targetSectionIndex, 'body', currentBody + blockMarkup);
    setBlockModalOpen(false);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg('প্রবন্ধের পূর্ণাঙ্গ শিরোনাম প্রদান করা আবশ্যক।');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('মূল সারসংক্ষেপ ও ভূমিকা প্রদান করা আবশ্যক।');
      return;
    }

    const finalId = id.trim() || `${sectionId}-${slug.trim() || Date.now()}`;
    const finalSlug = slug.trim() || finalId;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const cleanTakeaways = keyTakeaways.filter(t => t.trim().length > 0);
    const cleanSections = contentSections.filter(s => s.heading.trim().length > 0 || s.body.trim().length > 0);
    const cleanReferences = references.filter(r => r.trim().length > 0);

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
        // Clear local draft on success
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

  // Delete article
  const handleDelete = async () => {
    if (!initialArticle?.id) return;
    if (!confirm('আপনি কি নিশ্চিত যে এই প্রবন্ধটি স্থায়ীভাবে মুছে ফেলতে চান?')) return;
    setDeleting(true);
    try {
      const res = await deleteAdminArticle(initialArticle.id);
      if (res.success) {
        try {
          localStorage.removeItem(draftKey);
        } catch {}
        router.push('/admin/articles');
      } else {
        setErrorMsg('মুছতে সমস্যা হয়েছে: ' + res.error);
      }
    } catch (err: any) {
      setErrorMsg('ত্রুটি: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Section and Category lookups
  const currentSection = useMemo(() => {
    return SECTIONS_DATA.find(s => s.id === sectionId);
  }, [sectionId]);

  const currentCategory = useMemo(() => {
    return categoriesList.find(c => c.id === categoryId);
  }, [categoriesList, categoryId]);

  const liveUrl = currentSection && currentCategory && (slug || initialArticle?.slug)
    ? `/${currentSection.slug}/${currentCategory.slug}/${slug || initialArticle?.slug}/`
    : null;

  // Render Formatted Islamic Body helper for Preview Mode
  const renderParsedBody = (bodyText: string) => {
    if (!bodyText) return null;

    // Split on blocks: [কুরআন: ...], [হাদিস: ...], [মাসআলা: ...]
    const parts = bodyText.split(/(\[(?:কুরআন|হাদিস|মাসআলা):[\s\S]*?\[\/(?:কুরআন|হাদিস|মাসআলা)\])/g);

    return parts.map((part, pIdx) => {
      // Check for Quran block
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
            className="my-5 p-5 bg-[#FAF8F5] dark:bg-[#1A2421] border-2 border-[#0B4F3B] space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] pb-1 border-b border-[#0B4F3B]/20">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>পবিত্র কুরআন থেকে উদ্ধৃতি</span>
              </span>
              <span className="font-mono">{ref}</span>
            </div>
            {arabicMatch && (
              <p dir="rtl" className="font-serif text-2xl leading-loose font-bold text-[#0B4F3B] dark:text-[#4CC39A] text-right">
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

      // Check for Hadith block
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
            className="my-5 p-5 bg-[#FAF8F5] dark:bg-[#1A2421] border-l-4 border-[#B85D19] space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-bold text-[#B85D19] pb-1 border-b border-[#B85D19]/20">
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>হাদিস শরীফ রেফারেন্স</span>
              </span>
              <span className="font-mono">{header}</span>
            </div>
            {arabicMatch && (
              <p dir="rtl" className="font-serif text-xl leading-loose font-bold text-[#141615] dark:text-[#E8E6E1] text-right">
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

      // Check for Fiqh Mas'ala block
      const fiqhMatch = part.match(/\[মাসআলা:\s*([^\]]*)\]([\s\S]*?)\[\/মাসআলা\]/);
      if (fiqhMatch) {
        const header = fiqhMatch[1];
        const content = fiqhMatch[2];

        return (
          <div
            key={pIdx}
            className="my-5 p-4 bg-[#F6ECE3] dark:bg-[#2A231C] border border-[#B85D19] space-y-2"
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <div className="bg-[#E6F0EC] border-2 border-[#0B4F3B] text-[#0B4F3B] p-4 font-semibold flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#0B4F3B]" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-[#FBEAE8] border-2 border-[#D9381E] text-[#D9381E] p-4 font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#D9381E]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STICKY TOP ACTION BAR */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 bg-[#FAF8F5] border border-[#DCD7CD] text-[#141615] hover:bg-[#F2EFE9] transition-colors"
            title="তালিকায় ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#B85D19] uppercase tracking-wider">
                {isEdit ? 'প্রবন্ধ সম্পাদনা মোড' : 'নতুন প্রবন্ধ রচনা স্টুডিও'}
              </span>
              {draftSavedTime && (
                <span className="text-[10px] text-[#0B4F3B] bg-[#E6F0EC] px-1.5 py-0.5 font-mono">
                  ✓ অটো-সেভ {draftSavedTime}
                </span>
              )}
            </div>
            <h1 className="font-editorial text-lg sm:text-xl font-bold text-[#0B4F3B] truncate max-w-md sm:max-w-xl">
              {title || (isEdit ? 'সম্পাদনা মোড' : 'শিরোনামহীন নতুন প্রবন্ধ')}
            </h1>
          </div>
        </div>

        {/* CONTROLS: STATS + VIEW TOGGLE + SAVE */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* WORD STATS PILL */}
          <div className="hidden xl:flex items-center gap-2 bg-[#FAF8F5] border border-[#141615] px-2.5 py-1 text-xs">
            <span className="font-mono text-[#0B4F3B] font-bold">
              {toBengaliDigits(stats.words)} শব্দ
            </span>
            <span className="text-[#6E7571]">•</span>
            <span className="font-mono text-[#B85D19] font-bold">
              {stats.readTimeString}
            </span>
            <button
              type="button"
              onClick={() => setReadTime(stats.readTimeString)}
              className="text-[10px] text-[#0B4F3B] hover:underline font-bold ml-1 border-l pl-2 border-[#DCD7CD]"
              title="পাঠের সময় ইনপুটে সেট করুন"
            >
              সিঙ্ক
            </button>
          </div>

          {/* VIEW MODE TOGGLE */}
          <div className="flex items-center bg-[#FAF8F5] border border-[#141615] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-2.5 py-1 text-xs font-bold transition-colors ${
                viewMode === 'editor'
                  ? 'bg-[#0B4F3B] text-white'
                  : 'text-[#141615] hover:bg-[#F2EFE9]'
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
                  : 'text-[#141615] hover:bg-[#F2EFE9]'
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
                  : 'text-[#141615] hover:bg-[#F2EFE9]'
              }`}
            >
              প্রিভিউ
            </button>
          </div>

          {liveUrl && (
            <Link
              href={liveUrl}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#0B4F3B] text-xs font-bold border border-[#141615]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>লাইভ</span>
            </Link>
          )}

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 bg-[#FBEAE8] hover:bg-[#F7D4CF] text-[#D9381E] text-xs font-bold border border-[#D9381E]"
              title="মুছুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border-2 border-[#141615] shadow-sm transition-transform active:translate-y-0.5 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? 'আপডেট সংরক্ষণ' : 'প্রবন্ধ প্রকাশ করুন'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* WORKSPACE LAYOUT (EDITOR / SPLIT / PREVIEW) */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* ======================================================== */}
        {/* LEFT COLUMN: THE EDITORIAL FORM                          */}
        {/* ======================================================== */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* PRIMARY ARTICLE FIELDS (8 COLS) */}
              <div className={`${viewMode === 'split' ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6`}>
                {/* 1. TITLE & SUBTITLE */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F2EFE9]">
                    <FileText className="w-4 h-4 text-[#0B4F3B]" />
                    <h2 className="font-editorial text-base font-bold text-[#141615]">
                      মূল শিরোনাম ও উপশিরোনাম
                    </h2>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1.5">
                      প্রবন্ধের পূর্ণাঙ্গ শিরোনাম <span className="text-[#D9381E]">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="যেমন: আল্লাহর রুবুবিয়্যাত: নিখিল জাহানের একমাত্র পালনকর্তা"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141615] text-sm text-[#141615] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4F3B]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1.5">
                      উপশিরোনাম ও সংক্ষিপ্ত বার্তা
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={e => setSubtitle(e.target.value)}
                      placeholder="যেমন: সৃষ্টি, পরিচালনা ও কর্তৃত্বের একক অধিপতিত্বের প্রামাণ্য শাস্ত্রীয় পর্যালোচনা"
                      className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#DCD7CD] text-xs sm:text-sm text-[#141615] focus:outline-none focus:border-[#141615]"
                    />
                  </div>
                </div>

                {/* 2. SUMMARY (EXECUTIVE OVERVIEW) */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F2EFE9]">
                    <BookOpen className="w-4 h-4 text-[#0B4F3B]" />
                    <h2 className="font-editorial text-base font-bold text-[#141615]">
                      মূল সারসংক্ষেপ ও ভূমিকা (Executive Summary) <span className="text-[#D9381E]">*</span>
                    </h2>
                  </div>
                  <p className="text-xs text-[#6E7571]">
                    পাঠক প্রবন্ধের শুরুতে এই ভূমিকাটি পড়বেন। কুরআন ও সুন্নাহর আলোকে প্রবন্ধের নির্যাস তুলে ধরুন।
                  </p>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    placeholder="কুরআনের দৃষ্টিতে আল্লাহর রুবুবিয়্যাত হলো এই নিখিল বিশ্বের একক সৃষ্টি, লালন-পালন ও সার্বভৌম পরিচালনা..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141615] text-sm text-[#141615] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0B4F3B]"
                    required
                  />
                </div>

                {/* 3. ARABIC CITATION BOX */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#B85D19]" />
                      <h2 className="font-editorial text-base font-bold text-[#141615]">
                        শীর্ষ প্রামাণ্য আরবী দলিল ও সনদ (Citation Box)
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-[#B85D19] bg-[#F6ECE3] px-2 py-0.5 border border-[#B85D19]">
                      প্রধান আয়াত / হাদিস
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1.5">
                      মূল আরবী পাঠ (Arabic Text)
                    </label>
                    <textarea
                      dir="rtl"
                      rows={3}
                      value={citationArabic}
                      onChange={e => setCitationArabic(e.target.value)}
                      placeholder="الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#141615] text-lg sm:text-xl font-serif text-[#0B4F3B] leading-loose text-right focus:outline-none focus:ring-2 focus:ring-[#0B4F3B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#141615] mb-1.5">
                        উচ্চারণ / লিপ্যন্তর (Transliteration)
                      </label>
                      <input
                        type="text"
                        value={citationTranslit}
                        onChange={e => setCitationTranslit(e.target.value)}
                        placeholder="আলহামদু লিল্লাহি রাব্বিল আলামীন"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615] focus:outline-none focus:border-[#141615]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#141615] mb-1.5">
                        রেফারেন্স / সূত্র (যেমন: সূরা ফাতিহা ১:২)
                      </label>
                      <input
                        type="text"
                        value={citationRef}
                        onChange={e => setCitationRef(e.target.value)}
                        placeholder="সূরা আল-ফাতিহা ১:২"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615] focus:outline-none focus:border-[#141615]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1.5">
                      বাংলা অর্থ ও অনুবাদ
                    </label>
                    <textarea
                      rows={2}
                      value={citationBengali}
                      onChange={e => setCitationBengali(e.target.value)}
                      placeholder="যাবতীয় প্রশংসা আল্লাহ তা'আলার জন্য, যিনি সকল সৃষ্টির একমাত্র পালনকর্তা।"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CD] text-xs sm:text-sm text-[#141615] focus:outline-none focus:border-[#141615]"
                    />
                  </div>
                </div>

                {/* 4. KEY TAKEAWAYS WITH REORDERING */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#0B4F3B]" />
                      <h2 className="font-editorial text-base font-bold text-[#141615]">
                        গুরুত্বপূর্ণ শাস্ত্রীয় পয়েন্ট (Key Takeaways)
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={addTakeaway}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F3B] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>পয়েন্ট যোগ করুন</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {keyTakeaways.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E6F0EC] text-[#0B4F3B] text-xs font-bold flex items-center justify-center shrink-0 border border-[#176B52]">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={point}
                          onChange={e => handleTakeawayChange(idx, e.target.value)}
                          placeholder="পয়েন্ট লিখুন (যেমন: রুবুবিয়্যাত হলো সকল সৃষ্টির পালনকর্তৃত্বের সাক্ষ্য...)"
                          className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CD] text-xs sm:text-sm text-[#141615] focus:outline-none focus:border-[#141615]"
                        />

                        {/* REORDER BUTTONS */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveTakeaway(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 text-[#6E7571] hover:text-[#141615] disabled:opacity-30"
                            title="উপরে নিন"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveTakeaway(idx, 'down')}
                            disabled={idx === keyTakeaways.length - 1}
                            className="p-1.5 text-[#6E7571] hover:text-[#141615] disabled:opacity-30"
                            title="নিচে নিন"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {keyTakeaways.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTakeaway(idx)}
                              className="p-1.5 text-[#D9381E] hover:bg-[#FBEAE8]"
                              title="মুছুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. CONTENT SECTIONS WITH ISLAMIC BLOCK INSERTER & REORDER */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0B4F3B]" />
                      <h2 className="font-editorial text-base font-bold text-[#141615]">
                        বিস্তারিত বিষয়ভিত্তিক পরিচ্ছেদ (Content Sections)
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={addContentSection}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4F3B] text-white text-xs font-bold hover:bg-[#083B2C] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন পরিচ্ছেদ</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {contentSections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAF8F5] border-2 border-[#141615] p-4 sm:p-5 space-y-3 relative group shadow-sm"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[#DCD7CD]">
                          <span className="text-xs font-mono font-bold text-[#B85D19]">
                            পরিচ্ছেদ #{toBengaliDigits(idx + 1)}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* REORDER BUTTONS */}
                            <button
                              type="button"
                              onClick={() => moveContentSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-[#6E7571] hover:text-[#141615] disabled:opacity-30"
                              title="উপরে নিন"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveContentSection(idx, 'down')}
                              disabled={idx === contentSections.length - 1}
                              className="p-1 text-[#6E7571] hover:text-[#141615] disabled:opacity-30"
                              title="নিচে নিন"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateContentSection(idx)}
                              className="p-1 text-[#0B4F3B] hover:text-[#083B2C]"
                              title="ডুপ্লিকেট করুন"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {contentSections.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeContentSection(idx)}
                                className="p-1 text-[#D9381E] hover:bg-[#FBEAE8]"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#141615] mb-1">
                            পরিচ্ছেদের শিরোনাম
                          </label>
                          <input
                            type="text"
                            value={sec.heading}
                            onChange={e => handleSectionChangeContent(idx, 'heading', e.target.value)}
                            placeholder="যেমন: ১. রুবুবিয়্যাতের পারিভাষিক সংজ্ঞা ও তাৎপর্য"
                            className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#DCD7CD] text-xs sm:text-sm font-semibold text-[#141615] focus:outline-none focus:border-[#141615]"
                          />
                        </div>

                        {/* ISLAMIC BLOCK INSERTER TOOLBAR */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                          <span className="text-[11px] font-bold text-[#6E7571]">
                            ইসলামিক ব্লক ইনসার্টার:
                          </span>
                          <button
                            type="button"
                            onClick={() => openBlockBuilder(idx, 'quran')}
                            className="px-2 py-1 bg-[#E6F0EC] hover:bg-[#D5E6DF] text-[#0B4F3B] text-[11px] font-bold border border-[#0B4F3B] inline-flex items-center gap-1"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>+ কুরআন আয়াত</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openBlockBuilder(idx, 'hadith')}
                            className="px-2 py-1 bg-[#F6ECE3] hover:bg-[#EEDBCB] text-[#B85D19] text-[11px] font-bold border border-[#B85D19] inline-flex items-center gap-1"
                          >
                            <Bookmark className="w-3 h-3" />
                            <span>+ হাদিস উদ্ধৃতি</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openBlockBuilder(idx, 'fiqh')}
                            className="px-2 py-1 bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#141615] text-[11px] font-bold border border-[#141615] inline-flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>+ ফিকহী মাসআলা</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#141615] mb-1">
                            বিশদ বিবরণ ও শরীয়াহ বিশ্লেষণ
                          </label>
                          <textarea
                            rows={7}
                            value={sec.body}
                            onChange={e => handleSectionChangeContent(idx, 'body', e.target.value)}
                            placeholder="বিস্তারিত প্রবন্ধের অংশ লিখুন (প্যারাগ্রাফ ও ইসলামিক ব্লক স্বয়ংক্রিয়ভাবে রেন্ডার হবে)..."
                            className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#DCD7CD] text-xs sm:text-sm text-[#141615] leading-relaxed focus:outline-none focus:border-[#141615]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. REFERENCES */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#0B4F3B]" />
                      <h2 className="font-editorial text-base font-bold text-[#141615]">
                        প্রামাণ্য গ্রন্থপঞ্জি ও তথ্যসূত্র (References)
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={addReference}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0B4F3B] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>রেফারেন্স যোগ করুন</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {references.map((ref, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#F2EFE9] text-[#6E7571] text-xs font-mono font-bold flex items-center justify-center shrink-0 border border-[#DCD7CD]">
                          [{idx + 1}]
                        </span>
                        <input
                          type="text"
                          value={ref}
                          onChange={e => handleRefChange(idx, e.target.value)}
                          placeholder="যেমন: তাফসীরে ইবনে কাসীর, ১ম খণ্ড, পৃষ্ঠা ২৪-২৮"
                          className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615] focus:outline-none focus:border-[#141615]"
                        />
                        {references.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReference(idx)}
                            className="p-2 text-[#D9381E] hover:bg-[#FBEAE8]"
                            title="মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SIDEBAR METADATA COLUMN (4 COLS OR BOTTOM IN SPLIT) */}
              <div className={`${viewMode === 'split' ? 'lg:col-span-12' : 'lg:col-span-4'} space-y-6`}>
                {/* 1. PUBLISH STATUS & LEAD TOGGLE */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
                  <h3 className="font-editorial text-base font-bold text-[#0B4F3B] pb-2 border-b border-[#F2EFE9]">
                    প্রকাশনা নিয়ন্ত্রণ
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1.5">
                      প্রকাশনা স্ট্যাটাস
                    </label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#141615] text-xs font-bold text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                    >
                      <option value="published">● লাইভ প্রকাশিত (Published)</option>
                      <option value="draft">○ খসড়া সংরক্ষিত (Draft)</option>
                      <option value="review">◐ সম্পাদনা পর্যালোচনায় (Review)</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 bg-[#FAF8F5] border border-[#DCD7CD] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLead}
                      onChange={e => setIsLead(e.target.checked)}
                      className="w-4 h-4 text-[#0B4F3B] rounded border-[#141615] focus:ring-[#0B4F3B]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-[#141615] block">প্রধান প্রবন্ধ হিসেবে ফিচার করুন</span>
                      <span className="text-[#6E7571] text-[11px]">পোর্টালের হোম ও বিভাগের শীর্ষে প্রদর্শিত হবে</span>
                    </div>
                  </label>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-[#141615] mb-1">
                        তারিখ
                      </label>
                      <input
                        type="text"
                        value={publishedAt}
                        onChange={e => setPublishedAt(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#141615] mb-1">
                        পাঠের সময়
                      </label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={e => setReadTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SECTION & DYNAMIC CATEGORY ASSIGNMENT */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                    <h3 className="font-editorial text-base font-bold text-[#0B4F3B]">
                      বিভাগ ও ক্যাটেগরি নির্বাচন
                    </h3>
                    <Link
                      href="/admin/categories"
                      target="_blank"
                      className="text-[11px] font-bold text-[#B85D19] hover:underline"
                    >
                      + নতুন ক্যাটেগরি
                    </Link>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1.5">
                      প্রধান বিভাগ (Section) <span className="text-[#D9381E]">*</span>
                    </label>
                    <select
                      value={sectionId}
                      onChange={e => handleSectionChange(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#141615] text-xs font-bold text-[#141615] focus:outline-none"
                    >
                      {SECTIONS_DATA.map(sec => (
                        <option key={sec.id} value={sec.id}>
                          {sec.name} ({sec.arabicTitle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1.5">
                      নির্দিষ্ট ক্যাটেগরি (Category) <span className="text-[#D9381E]">*</span>
                    </label>
                    <select
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#141615] text-xs font-semibold text-[#141615] focus:outline-none"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.badge})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-[#6E7571] mt-1">
                      {loadingCategories
                        ? 'ক্যাটেগরি লোড হচ্ছে...'
                        : `এই বিভাগে মোট ${categoriesList.length}টি ক্যাটেগরি রয়েছে।`}
                    </p>
                  </div>
                </div>

                {/* 3. IDENTIFIERS & SLUG */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                    <h3 className="font-editorial text-base font-bold text-[#0B4F3B]">
                      ইউআরএল ও পরিচিতি (Slug)
                    </h3>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="text-[11px] font-bold text-[#B85D19] hover:underline"
                    >
                      অটো জেনারেট
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      আর্টিকেল আইডি (ID)
                    </label>
                    <input
                      type="text"
                      value={id}
                      onChange={e => setId(e.target.value)}
                      placeholder="যেমন: allah-rububiyyah"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DCD7CD] text-xs font-mono text-[#141615]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      ইউআরএল স্লাগ (URL Slug)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                      placeholder="যেমন: rububiyyah-sovereignty"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DCD7CD] text-xs font-mono text-[#141615]"
                    />
                  </div>
                </div>

                {/* 4. AUTHORSHIP & TAHQIQ */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
                  <h3 className="font-editorial text-base font-bold text-[#0B4F3B] pb-2 border-b border-[#F2EFE9]">
                    লেখক ও তাহকীক পরিষদ
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      গবেষক ও লেখক
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={e => setAuthor(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      তাহকীক ও সম্পাদনা পরিষদ
                    </label>
                    <input
                      type="text"
                      value={reviewer}
                      onChange={e => setReviewer(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615]"
                    />
                  </div>
                </div>

                {/* 5. TAGS */}
                <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-3">
                  <h3 className="font-editorial text-base font-bold text-[#0B4F3B] pb-2 border-b border-[#F2EFE9]">
                    বিষয়ভিত্তিক ট্যাগসমূহ
                  </h3>
                  <p className="text-[11px] text-[#6E7571]">
                    কমা ( , ) দিয়ে আলাদা করে ট্যাগ লিখুন
                  </p>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="তাওহীদ, রুবুবিয়্যাত, আকীদা, সৃষ্টিতত্ত্ব"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD7CD] text-xs text-[#141615]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* RIGHT COLUMN: LIVE EDITORIAL PREVIEW & SEO SIMULATOR    */}
        {/* ======================================================== */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="space-y-6">
            {/* PREVIEW CONTROLS */}
            <div className="bg-[#FFFFFF] border-2 border-[#141615] p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0B4F3B]" />
                <span className="font-editorial text-sm font-bold text-[#141615]">
                  লাইভ প্রিভিউ (ম্যাগাজিন ও রিডার ভিউ)
                </span>
              </div>

              {/* THEME SWITCHER */}
              <div className="flex items-center bg-[#FAF8F5] border border-[#141615] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('paper')}
                  className={`px-2 py-0.5 font-bold ${
                    previewTheme === 'paper' ? 'bg-[#0B4F3B] text-white' : 'text-[#141615]'
                  }`}
                >
                  পেপার
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('sepia')}
                  className={`px-2 py-0.5 font-bold ${
                    previewTheme === 'sepia' ? 'bg-[#B85D19] text-white' : 'text-[#141615]'
                  }`}
                >
                  সেপিয়া
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`px-2 py-0.5 font-bold ${
                    previewTheme === 'dark' ? 'bg-[#141615] text-white' : 'text-[#141615]'
                  }`}
                >
                  ডার্ক
                </button>
              </div>
            </div>

            {/* SIMULATED READER CARD */}
            <div
              className={`border-2 border-[#141615] p-6 sm:p-8 space-y-6 transition-colors ${
                previewTheme === 'paper'
                  ? 'bg-[#FAF8F5] text-[#141615]'
                  : previewTheme === 'sepia'
                  ? 'bg-[#F4ECD8] text-[#2C2416]'
                  : 'bg-[#141615] text-[#FAF8F5]'
              }`}
            >
              {/* HEADER PILLS */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-0.5 bg-[#0B4F3B] text-white">
                    {currentSection?.name || 'বিভাগ'}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#B85D19] text-white">
                    {currentCategory?.name || 'ক্যাটেগরি'}
                  </span>
                  <span className="opacity-70 text-[11px]">
                    • প্রকাশকাল: {publishedAt} • {readTime}
                  </span>
                </div>

                <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold leading-tight">
                  {title || 'প্রবন্ধের শিরোনাম এখানে প্রদর্শিত হবে'}
                </h1>

                {subtitle && (
                  <p className="text-base sm:text-lg font-medium opacity-85">
                    {subtitle}
                  </p>
                )}

                {/* BYLINE */}
                <div className="p-3 bg-black/5 dark:bg-white/5 border border-current/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#0B4F3B] dark:text-[#4CC39A]" />
                    <span><strong>গবেষণা ও রচনা:</strong> {author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B85D19]" />
                    <span><strong>তাহকীক ও সম্পাদনা:</strong> {reviewer}</span>
                  </div>
                </div>
              </div>

              {/* PRIMARY CITATION BOX */}
              {citationArabic && (
                <div className="p-6 bg-[#0B4F3B]/10 border-2 border-[#0B4F3B] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                    <span>মূল দলিল ও উদ্ধৃতি</span>
                    <span className="font-mono">{citationRef}</span>
                  </div>
                  <p dir="rtl" className="font-serif text-2xl sm:text-3xl leading-loose font-bold text-[#0B4F3B] dark:text-[#4CC39A] text-right">
                    {citationArabic}
                  </p>
                  {citationTranslit && (
                    <p className="text-xs sm:text-sm italic opacity-75">
                      উচ্চারণ: {citationTranslit}
                    </p>
                  )}
                  {citationBengali && (
                    <p className="text-base font-bold">
                      অনুবাদ: &ldquo;{citationBengali}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* KEY TAKEAWAYS */}
              {keyTakeaways.filter(Boolean).length > 0 && (
                <div className="p-5 bg-[#B85D19]/10 border-l-4 border-[#B85D19] space-y-2">
                  <h3 className="font-editorial text-base font-extrabold text-[#B85D19] flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>প্রবন্ধের মূল শিক্ষা ও সারসংক্ষেপ</span>
                  </h3>
                  <ul className="space-y-1.5 text-sm list-disc pl-5">
                    {keyTakeaways.filter(Boolean).map((item, idx) => (
                      <li key={idx} className="font-medium">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CONTENT SECTIONS WITH PARSED BLOCKS */}
              <div className="space-y-8 pt-2">
                {contentSections
                  .filter(s => s.heading.trim() || s.body.trim())
                  .map((sec, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#0B4F3B] dark:text-[#4CC39A] border-b pb-1.5 border-current/15">
                        {sec.heading}
                      </h2>
                      <div className="text-sm sm:text-base">
                        {renderParsedBody(sec.body)}
                      </div>
                    </div>
                  ))}
              </div>

              {/* REFERENCES */}
              {references.filter(Boolean).length > 0 && (
                <div className="p-4 bg-black/5 dark:bg-white/5 border border-current/20 space-y-2">
                  <h4 className="font-editorial text-xs font-bold uppercase tracking-wider text-[#0B4F3B] dark:text-[#4CC39A]">
                    তথ্যসূত্র ও প্রামাণ্য গ্রন্থপঞ্জি (References)
                  </h4>
                  <ol className="list-decimal pl-5 text-xs space-y-1">
                    {references.filter(Boolean).map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* SEO & SOCIAL SHARE SIMULATOR */}
            <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F2EFE9]">
                <Globe className="w-4 h-4 text-[#0B4F3B]" />
                <h3 className="font-editorial text-base font-bold text-[#141615]">
                  গুগল সার্চ ও সোশ্যাল মিডিয়া শেয়ার সিমুলেটর (SEO Simulator)
                </h3>
              </div>

              {/* GOOGLE SEARCH SNIPPET */}
              <div className="p-4 bg-[#FAF8F5] border border-[#DCD7CD] space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#6E7571] tracking-wider block">
                  Google Search Snippet Preview
                </span>
                <div className="text-xs font-mono text-[#006621] truncate">
                  https://islam.org/{currentSection?.slug || 'section'}/{currentCategory?.slug || 'category'}/{slug || 'article-slug'}
                </div>
                <div className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer truncate">
                  {title || 'প্রবন্ধের শিরোনাম'} | {currentCategory?.name || 'ক্যাটেগরি'} - ইসলাম
                </div>
                <p className="text-xs text-[#545454] line-clamp-2 leading-relaxed">
                  {subtitle || summary || 'প্রবন্ধের সংক্ষিপ্ত বিবরণ গুগল অনুসন্ধানে এখানে প্রদর্শিত হবে...'}
                </p>
              </div>

              {/* SOCIAL SHARE CARD */}
              <div className="p-4 bg-[#FAF8F5] border border-[#DCD7CD] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#6E7571] tracking-wider block">
                  Facebook & WhatsApp OpenGraph Card Preview
                </span>
                <div className="border border-[#141615] bg-[#FFFFFF] overflow-hidden">
                  <div className="h-28 bg-[#0B4F3B] flex items-center justify-center p-4 text-center">
                    <div>
                      <span className="text-[10px] font-mono text-[#E8A86B] uppercase tracking-wider font-bold">
                        ইসলামিক শাস্ত্রীয় গবেষণা পোর্টাল
                      </span>
                      <h4 className="font-editorial text-white text-base font-bold line-clamp-2 mt-1">
                        {title || 'প্রবন্ধের শিরোনাম'}
                      </h4>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[#6E7571]">
                      ISLAM.ORG • {currentCategory?.name}
                    </span>
                    <h5 className="font-bold text-xs text-[#141615] line-clamp-1">
                      {title}
                    </h5>
                    <p className="text-[11px] text-[#4A4F4C] line-clamp-2">
                      {subtitle || summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ISLAMIC BLOCK BUILDER MODAL                              */}
      {/* ======================================================== */}
      {blockModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141615]/75 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#141615] w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#141615]">
              <div className="flex items-center gap-2">
                {blockType === 'quran' && <BookOpen className="w-5 h-5 text-[#0B4F3B]" />}
                {blockType === 'hadith' && <Bookmark className="w-5 h-5 text-[#B85D19]" />}
                {blockType === 'fiqh' && <ShieldCheck className="w-5 h-5 text-[#141615]" />}
                <h3 className="font-editorial text-lg font-extrabold text-[#141615]">
                  {blockType === 'quran'
                    ? 'কুরআন আয়াত ব্লক ইনসার্টার'
                    : blockType === 'hadith'
                    ? 'হাদিস উদ্ধৃতি ব্লক ইনসার্টার'
                    : 'ফিকহী মাসআলা কলআউট'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBlockModalOpen(false)}
                className="p-1 hover:bg-[#FAF8F5] text-[#6E7571] hover:text-[#141615]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {blockType === 'quran' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      আরবী আয়াত পাঠ
                    </label>
                    <textarea
                      dir="rtl"
                      rows={2}
                      value={blockArabic}
                      onChange={e => setBlockArabic(e.target.value)}
                      placeholder="اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ..."
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] font-serif text-lg text-[#0B4F3B] text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      উচ্চারণ / লিপ্যন্তর (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={blockTranslit}
                      onChange={e => setBlockTranslit(e.target.value)}
                      placeholder="আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল কাইয়্যূম..."
                      className="w-full p-2 bg-[#FAF8F5] border border-[#DCD7CD]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      বাংলা অনুবাদ ও তাৎপর্য *
                    </label>
                    <textarea
                      rows={2}
                      value={blockBengali}
                      onChange={e => setBlockBengali(e.target.value)}
                      placeholder="আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই..."
                      className="w-full p-2 bg-[#FAF8F5] border border-[#141615]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      সূরা ও আয়াত রেফারেন্স *
                    </label>
                    <input
                      type="text"
                      value={blockRef}
                      onChange={e => setBlockRef(e.target.value)}
                      placeholder="যেমন: সূরা আল-বাক্বারাহ: ২৫৫"
                      className="w-full p-2 bg-[#FAF8F5] border border-[#141615]"
                      required
                    />
                  </div>
                </>
              )}

              {blockType === 'hadith' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      আরবী মতন পাঠ
                    </label>
                    <textarea
                      dir="rtl"
                      rows={2}
                      value={blockArabic}
                      onChange={e => setBlockArabic(e.target.value)}
                      placeholder="إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ..."
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] font-serif text-lg text-right"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#141615] mb-1">
                        বর্ণনাকারী সাহাবী (রাবী)
                      </label>
                      <input
                        type="text"
                        value={blockNarrator}
                        onChange={e => setBlockNarrator(e.target.value)}
                        placeholder="হযরত উমর ইবনুল খাত্তাব (রা.)"
                        className="w-full p-2 bg-[#FAF8F5] border border-[#DCD7CD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#141615] mb-1">
                        তাহকীক ও মান
                      </label>
                      <select
                        value={blockGrade}
                        onChange={e => setBlockGrade(e.target.value)}
                        className="w-full p-2 bg-[#FAF8F5] border border-[#141615] font-bold"
                      >
                        <option value="মুত্তাফাকুন আলাইহ">মুত্তাফাকুন আলাইহ</option>
                        <option value="সহীহ">সহীহ</option>
                        <option value="হাসান">হাসান</option>
                        <option value="মুতাওয়াতির">মুতাওয়াতির</option>
                        <option value="সহীহ লি গাইরিহী">সহীহ লি গাইরিহী</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      বাংলা অনুবাদ *
                    </label>
                    <textarea
                      rows={2}
                      value={blockBengali}
                      onChange={e => setBlockBengali(e.target.value)}
                      placeholder="নিশ্চয়ই সমস্ত আমল নিয়তের উপর নির্ভরশীল..."
                      className="w-full p-2 bg-[#FAF8F5] border border-[#141615]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      হাদিস গ্রন্থ ও নম্বর *
                    </label>
                    <input
                      type="text"
                      value={blockRef}
                      onChange={e => setBlockRef(e.target.value)}
                      placeholder="যেমন: সহীহুল বুখারী, হাদিস নং ১"
                      className="w-full p-2 bg-[#FAF8F5] border border-[#141615]"
                      required
                    />
                  </div>
                </>
              )}

              {blockType === 'fiqh' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-[#141615] mb-1">
                        মাসআলার শিরোনাম
                      </label>
                      <input
                        type="text"
                        value={blockRef}
                        onChange={e => setBlockRef(e.target.value)}
                        placeholder="যেমন: সালাতের রুকনসমূহ"
                        className="w-full p-2 bg-[#FAF8F5] border border-[#141615]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#141615] mb-1">
                        শরীয়তের হুকুম / বিধান
                      </label>
                      <select
                        value={blockRuling}
                        onChange={e => setBlockRuling(e.target.value)}
                        className="w-full p-2 bg-[#FAF8F5] border border-[#141615] font-bold"
                      >
                        <option value="ফরজ">ফরজ</option>
                        <option value="ওয়াজিব">ওয়াজিব</option>
                        <option value="সুন্নাতে মুয়াক্কাদাহ">সুন্নাতে মুয়াক্কাদাহ</option>
                        <option value="মুস্তাহাব">মুস্তাহাব</option>
                        <option value="মাকরূহে তানযীহী">মাকরূহে তানযীহী</option>
                        <option value="মাকরূহে তাহরীমী">মাকরূহে তাহরীমী</option>
                        <option value="হারাম">হারাম</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      মাসআলার বিশ্লেষণ ও দলীল *
                    </label>
                    <textarea
                      rows={3}
                      value={blockBengali}
                      onChange={e => setBlockBengali(e.target.value)}
                      placeholder="তাকবীরে তাহরীমা, কিয়াম, কিরাত, রুকূ ও সিজদা সালাতের মূল রুকন..."
                      className="w-full p-2 bg-[#FAF8F5] border border-[#141615]"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t-2 border-[#141615] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setBlockModalOpen(false)}
                className="px-4 py-2 border border-[#141615] text-xs font-bold hover:bg-[#FAF8F5]"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleInsertBlock}
                className="px-4 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold border border-[#141615]"
              >
                পরিচ্ছেদে ইনসার্ট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
