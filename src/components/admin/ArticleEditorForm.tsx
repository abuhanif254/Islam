'use client';

import React, { useState, useMemo } from 'react';
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
  UserCheck
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { DbArticle } from '@/lib/supabase';
import { saveAdminArticle, deleteAdminArticle } from '@/lib/supabase-service';

interface ArticleEditorFormProps {
  initialArticle?: DbArticle | null;
  isEdit?: boolean;
}

export default function ArticleEditorForm({ initialArticle, isEdit = false }: ArticleEditorFormProps) {
  const router = useRouter();

  // Form State
  const [id, setId] = useState(initialArticle?.id || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [sectionId, setSectionId] = useState(initialArticle?.section_id || 'allah');
  const [categoryId, setCategoryId] = useState(initialArticle?.category_id || 'allah-rububiyyah');
  const [author, setAuthor] = useState(initialArticle?.author || 'মাওলানা আব্দুল হক');
  const [reviewer, setReviewer] = useState(initialArticle?.reviewer || 'মুফতী মাহমুদ হাসান (তাহকীক ও সম্পাদনা)');
  const [publishedAt, setPublishedAt] = useState(initialArticle?.published_at || '১৭ অক্টোবর ২০২৬');
  const [readTime, setReadTime] = useState(initialArticle?.read_time || '৮ মিনিট পাঠ');
  const [isLead, setIsLead] = useState(Boolean(initialArticle?.is_lead));
  const [status, setStatus] = useState<'published' | 'draft' | 'review'>(initialArticle?.status || 'published');
  
  // Citation box
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

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Categories filtered by chosen section
  const availableCategories = useMemo(() => {
    const sec = SECTIONS_DATA.find(s => s.id === sectionId);
    return sec ? sec.categories : [];
  }, [sectionId]);

  // Handle section change and reset category to first item
  const handleSectionChange = (newSecId: string) => {
    setSectionId(newSecId);
    const sec = SECTIONS_DATA.find(s => s.id === newSecId);
    if (sec && sec.categories.length > 0) {
      setCategoryId(sec.categories[0].id);
    }
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

  // Content sections helpers
  const handleSectionChangeContent = (index: number, field: 'heading' | 'body', val: string) => {
    const updated = [...contentSections];
    updated[index] = { ...updated[index], [field]: val };
    setContentSections(updated);
  };
  const addContentSection = () => setContentSections([...contentSections, { heading: '', body: '' }]);
  const removeContentSection = (index: number) => {
    if (contentSections.length <= 1) return;
    setContentSections(contentSections.filter((_, i) => i !== index));
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

  // Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setErrorMsg('প্রবন্ধের শিরোনাম প্রদান করা আবশ্যক।');
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
      views_count: initialArticle?.views_count || 108
    };

    setSaving(true);
    try {
      const result = await saveAdminArticle(articleData);
      if (result.success) {
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

  // Find section & category objects for live link
  const currentSection = SECTIONS_DATA.find(s => s.id === sectionId);
  const currentCategory = currentSection?.categories.find(c => c.id === categoryId);
  const liveUrl = currentSection && currentCategory && (slug || initialArticle?.slug)
    ? `/${currentSection.slug}/${currentCategory.slug}/${slug || initialArticle?.slug}/`
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* TOP ACTION BAR */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 bg-[#FAF8F5] border border-[#DCD7CD] text-[#141615] hover:bg-[#F2EFE9] transition-colors"
            title="তালিকায় ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-[11px] font-mono font-bold text-[#B85D19] uppercase tracking-wider">
              {isEdit ? 'প্রবন্ধ সম্পাদনা' : 'নতুন প্রবন্ধ রচনা'}
            </div>
            <h1 className="font-editorial text-xl sm:text-2xl font-bold text-[#0B4F3B]">
              {title || (isEdit ? 'সম্পাদনা মোড' : 'শিরোনামহীন প্রবন্ধ')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {liveUrl && (
            <Link
              href={liveUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#0B4F3B] text-xs font-bold border border-[#141615] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লাইভ দেখুন</span>
            </Link>
          )}

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FBEAE8] hover:bg-[#F7D4CF] text-[#D9381E] text-xs font-bold border border-[#D9381E] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">মুছুন</span>
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border-2 border-[#141615] shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : isEdit ? 'আপডেট সংরক্ষণ' : 'প্রবন্ধ প্রকাশ করুন'}</span>
          </button>
        </div>
      </div>

      {/* DUAL COLUMN CMS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN COLUMN (LEFT 8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
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
                  প্রামাণ্য আরবী আয়াত বা হাদীসের উদ্ধৃতি (Citation Box)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-[#B85D19] bg-[#F6ECE3] px-2 py-0.5 border border-[#B85D19]">
                দলিল ও সনদ
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
                বাংলা অর্থ ও প্রাসঙ্গিক ব্যাখ্যা
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

          {/* 4. KEY TAKEAWAYS */}
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
                  {keyTakeaways.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTakeaway(idx)}
                      className="p-2 text-[#D9381E] hover:bg-[#FBEAE8] border border-transparent hover:border-[#D9381E] transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. CONTENT SECTIONS */}
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
                  className="bg-[#FAF8F5] border border-[#141615] p-4 sm:p-5 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#B85D19]">
                      পরিচ্ছেদ #{idx + 1}
                    </span>
                    {contentSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentSection(idx)}
                        className="text-xs text-[#D9381E] hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    )}
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

                  <div>
                    <label className="block text-xs font-bold text-[#141615] mb-1">
                      বিশদ বিবরণ ও শরীয়াহ বিশ্লেষণ
                    </label>
                    <textarea
                      rows={6}
                      value={sec.body}
                      onChange={e => handleSectionChangeContent(idx, 'body', e.target.value)}
                      placeholder="বিস্তারিত প্রবন্ধের অংশ লিখুন..."
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
                      className="p-2 text-[#D9381E] hover:bg-[#FBEAE8] border border-transparent hover:border-[#D9381E] transition-colors"
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

        {/* SIDEBAR METADATA COLUMN (RIGHT 4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
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

          {/* 2. SECTION & CATEGORY ASSIGNMENT */}
          <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#0B4F3B] pb-2 border-b border-[#F2EFE9]">
              বিভাগ ও ক্যাটেগরি নির্বাচন
            </h3>

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
                {availableCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.badge})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#6E7571] mt-1">
                এই বিভাগে মোট {availableCategories.length}টি ক্যাটেগরি রয়েছে।
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
    </form>
  );
}
