'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  Layers,
  FileText,
  Tag,
  CheckCircle,
  Hash,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  PenTool,
  Save,
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { DbCategory } from '@/lib/supabase';
import {
  fetchAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
  countArticlesForCategory
} from '@/lib/supabase-service';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);

  // Form Fields
  const [formSectionId, setFormSectionId] = useState('allah');
  const [formName, setFormName] = useState('');
  const [formArabicName, setFormArabicName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formId, setFormId] = useState('');
  const [formBadge, setFormBadge] = useState('সাধারণ');
  const [formGroup, setFormGroup] = useState('');
  const [formArticleCount, setFormArticleCount] = useState<number>(0);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formMetaInfo, setFormMetaInfo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Dialog State
  const [deletingCategory, setDeletingCategory] = useState<DbCategory | null>(null);
  const [articleCountWarning, setArticleCountWarning] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteChecking, setDeleteChecking] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load categories on mount
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
      showToast('ক্যাটেগরি লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Section lookup dictionary
  const sectionsMap = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; filterGroups: string[] }>();
    SECTIONS_DATA.forEach(s => {
      map.set(s.id, { name: s.name, slug: s.slug, filterGroups: s.filterGroups });
    });
    return map;
  }, []);

  // Collect available filter groups for the current section selection
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    categories.forEach(c => {
      if (selectedSection === 'all' || c.section_id === selectedSection) {
        if (c.group && c.group.trim()) {
          groups.add(c.group.trim());
        }
      }
    });
    return Array.from(groups);
  }, [selectedSection, categories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchSection = selectedSection === 'all' || cat.section_id === selectedSection;
      const matchGroup = selectedGroup === 'all' || cat.group === selectedGroup;
      const q = searchQuery.toLowerCase().trim();
      const secInfo = sectionsMap.get(cat.section_id);
      const secName = secInfo?.name || '';
      const matchQuery =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        (cat.arabic_name && cat.arabic_name.toLowerCase().includes(q)) ||
        cat.badge.toLowerCase().includes(q) ||
        cat.short_desc.toLowerCase().includes(q) ||
        cat.meta_info.toLowerCase().includes(q) ||
        secName.toLowerCase().includes(q);

      return matchSection && matchGroup && matchQuery;
    });
  }, [categories, selectedSection, selectedGroup, searchQuery, sectionsMap]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    const defaultSecId = selectedSection !== 'all' ? selectedSection : 'allah';
    const secInfo = sectionsMap.get(defaultSecId);
    const defaultGroup = secInfo?.filterGroups?.[1] || 'সাধারণ';

    setModalMode('create');
    setEditingCategory(null);
    setFormSectionId(defaultSecId);
    setFormName('');
    setFormArabicName('');
    setFormSlug('');
    setFormId('');
    setFormBadge('মৌলিক');
    setFormGroup(defaultGroup);
    setFormArticleCount(0);
    setFormShortDesc('');
    setFormMetaInfo('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat: DbCategory) => {
    setModalMode('edit');
    setEditingCategory(cat);
    setFormSectionId(cat.section_id);
    setFormName(cat.name);
    setFormArabicName(cat.arabic_name || '');
    setFormSlug(cat.slug);
    setFormId(cat.id);
    setFormBadge(cat.badge);
    setFormGroup(cat.group);
    setFormArticleCount(cat.article_count);
    setFormShortDesc(cat.short_desc);
    setFormMetaInfo(cat.meta_info);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Auto generate slug & ID when name changes (in create mode)
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (modalMode === 'create') {
      const clean = val
        .toLowerCase()
        .replace(/[^\w\s\u0980-\u09FF-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 45);
      const generatedSlug = clean || 'cat-' + Date.now();
      setFormSlug(generatedSlug);
      setFormId(`${formSectionId}-${generatedSlug}`);
    }
  };

  // Handle Section Change in Modal
  const handleModalSectionChange = (newSecId: string) => {
    setFormSectionId(newSecId);
    const secInfo = sectionsMap.get(newSecId);
    if (secInfo && secInfo.filterGroups && secInfo.filterGroups.length > 1) {
      setFormGroup(secInfo.filterGroups[1]);
    }
    if (modalMode === 'create' && formSlug) {
      setFormId(`${newSecId}-${formSlug}`);
    }
  };

  // Submit Category Form (Create or Edit)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('ক্যাটেগরির বাংলা নাম প্রদান করা আবশ্যক।');
      return;
    }

    const finalSlug = formSlug.trim() || 'cat-' + Date.now();
    const finalId = modalMode === 'edit' && editingCategory?.id ? editingCategory.id : (formId.trim() || `${formSectionId}-${finalSlug}`);

    const newCategory: DbCategory = {
      id: finalId,
      slug: finalSlug,
      section_id: formSectionId,
      name: formName.trim(),
      arabic_name: formArabicName.trim() || undefined,
      badge: formBadge.trim() || 'সাধারণ',
      group: formGroup.trim() || 'সাধারণ',
      article_count: Number(formArticleCount) || 0,
      short_desc: formShortDesc.trim(),
      meta_info: formMetaInfo.trim()
    };

    setIsSaving(true);
    try {
      const res = await saveAdminCategory(newCategory);
      if (res.success) {
        showToast(
          modalMode === 'create'
            ? 'নতুন ক্যাটেগরি সফলভাবে তৈরি হয়েছে!'
            : 'ক্যাটেগরি সফলভাবে আপডেট করা হয়েছে!'
        );
        setIsModalOpen(false);
        // Refresh local categories
        await loadCategories();
      } else {
        setFormError(res.error || 'সংরক্ষণে ত্রুটি হয়েছে।');
      }
    } catch (err: any) {
      setFormError(err.message || 'অপ্রত্যাশিত ত্রুটি ঘটেছে।');
    } finally {
      setIsSaving(false);
    }
  };

  // Initiate Delete Check
  const handleRequestDelete = async (cat: DbCategory) => {
    setDeletingCategory(cat);
    setDeleteChecking(true);
    setArticleCountWarning(null);
    try {
      const count = await countArticlesForCategory(cat.id);
      setArticleCountWarning(count);
    } catch {
      setArticleCountWarning(0);
    } finally {
      setDeleteChecking(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      const res = await deleteAdminCategory(deletingCategory.id);
      if (res.success) {
        showToast(`'${deletingCategory.name}' ক্যাটেগরিটি সফলভাবে মুছে ফেলা হয়েছে!`);
        setDeletingCategory(null);
        await loadCategories();
      } else {
        showToast('মুছতে ত্রুটি: ' + res.error, 'error');
      }
    } catch (err: any) {
      showToast('ত্রুটি: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 border-2 shadow-lg flex items-center gap-3 transition-all ${
            toast.type === 'success'
              ? 'bg-[#E6F0EC] border-[#0B4F3B] text-[#0B4F3B]'
              : 'bg-[#FBEBEB] border-[#C23B22] text-[#C23B22]'
          }`}
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* HEADER WITH ACTION BUTTON */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
            ট্যাক্সোনোমি ও শ্রেণিবিভাগ কন্ট্রোল
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B] mt-1">
            ইসলামিক শাস্ত্রীয় বিভাগ ও ক্যাটেগরি ম্যানেজমেন্ট
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4F4C] mt-1">
            যে কোনো বিভাগে নতুন ক্যাটেগরি যুক্ত করুন, সম্পাদন বা পরিমার্জন করুন এবং সুবিন্যস্ত রাখুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#FAF8F5] border border-[#141615] p-2 text-center px-3.5">
            <span className="block text-lg font-bold font-mono text-[#0B4F3B]">
              {categories.length}
            </span>
            <span className="text-[10px] text-[#6E7571] uppercase tracking-wider font-semibold">
              মোট ক্যাটেগরি
            </span>
          </div>
          <div className="bg-[#FAF8F5] border border-[#141615] p-2 text-center px-3.5">
            <span className="block text-lg font-bold font-mono text-[#B85D19]">
              {SECTIONS_DATA.length}
            </span>
            <span className="text-[10px] text-[#6E7571] uppercase tracking-wider font-semibold">
              মূল বিভাগ
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white font-bold text-xs sm:text-sm border-2 border-[#141615] shadow-sm flex items-center gap-2 transition-transform active:translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন ক্যাটেগরি যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* SECTION PILL SELECTOR */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            type="button"
            onClick={() => {
              setSelectedSection('all');
              setSelectedGroup('all');
            }}
            className={`px-3 py-1.5 text-xs font-bold transition-colors ${
              selectedSection === 'all'
                ? 'bg-[#0B4F3B] text-white'
                : 'bg-[#FAF8F5] text-[#141615] hover:bg-[#F2EFE9] border border-[#DCD7CD]'
            }`}
          >
            সকল বিভাগ ({categories.length})
          </button>
          {SECTIONS_DATA.map(sec => {
            const count = categories.filter(c => c.section_id === sec.id).length;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setSelectedSection(sec.id);
                  setSelectedGroup('all');
                }}
                className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                  selectedSection === sec.id
                    ? 'bg-[#0B4F3B] text-white'
                    : 'bg-[#FAF8F5] text-[#141615] hover:bg-[#F2EFE9] border border-[#DCD7CD]'
                }`}
              >
                <span>{sec.name}</span>
                <span className="ml-1.5 font-mono text-[11px] opacity-80">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH & GROUP FILTER */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6E7571] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ক্যাটেগরি নাম, আরবী, বিবরণ বা ব্যাজ দিয়ে খুঁজুন (যেমন: বাক্বারাহ, মাদানী, জিবরীল, তাওহীদ)..."
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#141615] text-xs sm:text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
          />
        </div>

        {availableGroups.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#6E7571]" />
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              className="px-3 py-2 bg-[#FAF8F5] border border-[#141615] text-xs font-semibold text-[#141615] focus:outline-none"
            >
              <option value="all">সকল গ্রুপ / ধরণ</option>
              {availableGroups.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* CATEGORIES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#6E7571]">
          <span>
            {loading ? 'ক্যাটেগরি লোড হচ্ছে...' : `${filteredCategories.length}টি ক্যাটেগরি পাওয়া গেছে`}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#0B4F3B] hover:underline font-bold"
            >
              সার্চ ফিল্টার রিসেট
            </button>
          )}
        </div>

        {loading ? (
          <div className="bg-[#FFFFFF] border-2 border-[#141615] p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#0B4F3B] animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#141615]">ডাটাবেজ থেকে ক্যাটেগরি তথ্য আনা হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredCategories.map(cat => {
              const secInfo = sectionsMap.get(cat.section_id);
              const sectionSlug = secInfo?.slug || cat.section_id;
              const sectionName = secInfo?.name || cat.section_id;
              const publicUrl = `/${sectionSlug}/${cat.slug}/`;

              return (
                <div
                  key={cat.id}
                  className="bg-[#FFFFFF] border-2 border-[#141615] p-4 flex flex-col justify-between hover:border-[#0B4F3B] transition-colors group relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B85D19] bg-[#F6ECE3] px-2 py-0.5 border border-[#B85D19]">
                        {sectionName}
                      </span>
                      <span className="text-[10px] font-mono text-[#0B4F3B] bg-[#E6F0EC] px-2 py-0.5 border border-[#176B52]">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="font-editorial text-base font-bold text-[#141615] group-hover:text-[#0B4F3B] transition-colors leading-snug">
                      {cat.name}
                    </h3>

                    {cat.arabic_name && (
                      <div
                        dir="rtl"
                        className="text-base font-serif text-[#0B4F3B] mt-0.5 text-right font-medium"
                      >
                        {cat.arabic_name}
                      </div>
                    )}

                    <p className="text-xs text-[#4A4F4C] line-clamp-2 mt-2 leading-relaxed">
                      {cat.short_desc || 'কোনো বিবরণ লিপিবদ্ধ নেই।'}
                    </p>

                    {cat.meta_info && (
                      <div className="text-[11px] font-mono text-[#6E7571] mt-2 pt-2 border-t border-[#F2EFE9]">
                        {cat.meta_info}
                      </div>
                    )}
                  </div>

                  {/* ACTION BAR */}
                  <div className="mt-4 pt-3 border-t border-[#141615] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <Link
                        href={`/admin/articles?section=${cat.section_id}&category=${cat.id}`}
                        className="font-bold text-[#0B4F3B] hover:underline inline-flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>প্রবন্ধ দেখুন</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/articles/new?section=${cat.section_id}&category=${cat.id}`}
                          className="p-1.5 text-[#0B4F3B] hover:bg-[#FAF8F5] border border-transparent hover:border-[#DCD7CD]"
                          title="এই ক্যাটেগরিতে নতুন আর্টিকেল লিখুন"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={publicUrl}
                          target="_blank"
                          className="p-1.5 text-[#6E7571] hover:text-[#0B4F3B] hover:bg-[#FAF8F5] border border-transparent hover:border-[#DCD7CD]"
                          title="পাবলিক পেজ দেখুন"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#F2EFE9]">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(cat)}
                        className="flex-1 py-1 px-2 text-[11px] font-bold text-[#141615] bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#141615] inline-flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3 h-3 text-[#B85D19]" />
                        <span>এডিট</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRequestDelete(cat)}
                        className="py-1 px-2.5 text-[11px] font-bold text-[#C23B22] bg-[#FAF8F5] hover:bg-[#FBEBEB] border border-[#C23B22] inline-flex items-center justify-center"
                        title="ক্যাটেগরি মুছে ফেলুন"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredCategories.length === 0 && (
          <div className="bg-[#FFFFFF] border-2 border-[#141615] p-12 text-center space-y-3">
            <FolderTree className="w-10 h-10 text-[#6E7571] mx-auto opacity-50" />
            <h3 className="font-editorial text-xl font-bold text-[#141615]">
              কোনো ক্যাটেগরি পাওয়া যায়নি
            </h3>
            <p className="text-xs text-[#6E7571]">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ক্যাটেগরি পাওয়া যায়নি। অনুগ্রহ করে বানান পরীক্ষা করুন অথবা ফিল্টার রিসেট করুন।
            </p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141615]/75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border-2 border-[#141615] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#141615]">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#0B4F3B]" />
                <h2 className="font-editorial text-xl font-extrabold text-[#0B4F3B]">
                  {modalMode === 'create' ? 'নতুন ক্যাটেগরি যুক্ত করুন' : 'ক্যাটেগরি সম্পাদনা করুন'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-[#FAF8F5] text-[#6E7571] hover:text-[#141615]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-[#FBEBEB] border-2 border-[#C23B22] text-[#C23B22] text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SECTION SELECTOR */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                    মূল বিভাগ *
                  </label>
                  <select
                    value={formSectionId}
                    onChange={e => handleModalSectionChange(e.target.value)}
                    disabled={modalMode === 'edit'}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] font-semibold text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                  >
                    {SECTIONS_DATA.map(sec => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.arabicTitle})
                      </option>
                    ))}
                  </select>
                </div>

                {/* GROUP SELECT / INPUT */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                    গ্রুপ / শ্রেণিবিভাগ
                  </label>
                  <input
                    type="text"
                    value={formGroup}
                    onChange={e => setFormGroup(e.target.value)}
                    placeholder="যেমন: তাওহীদ ও আকীদা, মাক্কী সূরা..."
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CATEGORY NAME (BENGALI) */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                    ক্যাটেগরির বাংলা নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="যেমন: তাওহীদের মূলনীতি, সূরা আল-বাক্বারাহ..."
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] text-[#141615] font-semibold focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                  />
                </div>

                {/* ARABIC NAME */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                    আরবী শিরোনাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formArabicName}
                    onChange={e => setFormArabicName(e.target.value)}
                    placeholder="যেমন: أصول التوحيد"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] text-[#0B4F3B] font-serif text-base focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* SLUG */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                    স্লাগ (URL Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={e => setFormSlug(e.target.value)}
                    placeholder="tawheed-fundamentals"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] font-mono text-xs text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                  />
                </div>

                {/* BADGE */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                    ব্যাজ / লেবেল
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value)}
                    placeholder="যেমন: আকীদা দর্শন, মাক্কী সূরা"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] text-xs text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                  />
                </div>

                {/* ARTICLE COUNT */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                    প্রবন্ধ সংখ্যা মান
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formArticleCount}
                    onChange={e => setFormArticleCount(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] font-mono text-xs text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                  />
                </div>
              </div>

              {/* SHORT DESC */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                  সংক্ষিপ্ত পরিচিতি ও তাৎপর্য
                </label>
                <textarea
                  rows={2}
                  value={formShortDesc}
                  onChange={e => setFormShortDesc(e.target.value)}
                  placeholder="এই ক্যাটেগরির মৌলিক উদ্দেশ্য ও বিষয়বস্তুর সংক্ষিপ্ত রূপরেখা..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] text-xs text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                />
              </div>

              {/* META INFO */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-[#141615]">
                  মেটা কিওয়ার্ডস / টপিকস
                </label>
                <input
                  type="text"
                  value={formMetaInfo}
                  onChange={e => setFormMetaInfo(e.target.value)}
                  placeholder="যেমন: তাওহীদ • ঈমান • আকীদা"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#141615] text-xs text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                />
              </div>

              {/* BUTTONS */}
              <div className="pt-3 border-t-2 border-[#141615] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#141615] text-xs font-bold hover:bg-[#FAF8F5]"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border border-[#141615] inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{modalMode === 'create' ? 'ক্যাটেগরি তৈরি করুন' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-[#141615]/75 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#C23B22] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#C23B22]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-editorial text-lg font-bold">
                ক্যাটেগরি মুছে ফেলার সতর্কতা
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#141615] leading-relaxed">
              আপনি কি নিশ্চিত যে <strong>&ldquo;{deletingCategory.name}&rdquo;</strong> ক্যাটেগরিটি ডাটাবেজ থেকে মুছে ফেলতে চান?
            </p>

            {deleteChecking ? (
              <div className="text-xs text-[#6E7571] flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>সংশ্লিষ্ট প্রবন্ধের সংখ্যা যাচাই করা হচ্ছে...</span>
              </div>
            ) : articleCountWarning !== null && articleCountWarning > 0 ? (
              <div className="p-3 bg-[#FBEBEB] border border-[#C23B22] text-[#C23B22] text-xs font-semibold">
                সতর্কতা: এই ক্যাটেগরির অধীনে <strong>{articleCountWarning}টি প্রবন্ধ</strong> রয়েছে! ক্যাটেগরি মুছে ফেললে ডাটাবেজের অনুষঙ্গ মুছে যেতে পারে।
              </div>
            ) : (
              <div className="text-xs text-[#6E7571]">
                এই ক্যাটেগরির অধীনে কোনো প্রবন্ধ নিবন্ধিত নেই। নিরাপদভাবে মুছে ফেলা যাবে।
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 border border-[#141615] text-xs font-bold hover:bg-[#FAF8F5]"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-[#C23B22] hover:bg-[#A32F1A] text-white text-xs font-bold border border-[#141615] inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>স্থায়ীভাবে মুছুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
