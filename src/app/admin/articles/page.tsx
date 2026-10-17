'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  FolderTree,
  Eye,
  RefreshCw
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { fetchAdminArticles, deleteAdminArticle, saveAdminArticle } from '@/lib/supabase-service';
import { DbArticle } from '@/lib/supabase';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminArticles({
        sectionId: selectedSection,
        categoryId: selectedCategory,
        status: selectedStatus,
        query: searchQuery,
      });
      setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [selectedSection, selectedCategory, selectedStatus]);

  // Categories available for the currently selected section
  const currentSectionCategories = useMemo(() => {
    if (selectedSection === 'all') return [];
    const sec = SECTIONS_DATA.find((s) => s.id === selectedSection);
    return sec ? sec.categories : [];
  }, [selectedSection]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadArticles();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteAdminArticle(id);
      if (res.success) {
        showToast('প্রবন্ধটি সফলভাবে মুছে ফেলা হয়েছে।');
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        showToast('মুছতে সমস্যা হয়েছে: ' + res.error);
      }
    } catch (err: any) {
      showToast('ত্রুটি: ' + err.message);
    } finally {
      setArticleToDelete(null);
    }
  };

  const handleToggleStatus = async (art: DbArticle) => {
    const nextStatus = art.status === 'published' ? 'draft' : 'published';
    try {
      const updated = { ...art, status: nextStatus as 'published' | 'draft' };
      const res = await saveAdminArticle(updated);
      if (res.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === art.id ? updated : a))
        );
        showToast(`স্ট্যাটাস পরিবর্তিত হয়েছে: ${nextStatus === 'published' ? 'প্রকাশিত' : 'খসড়া'}`);
      }
    } catch (err: any) {
      showToast('স্ট্যাটাস পরিবর্তন ব্যর্থ: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOAST ALERT */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0B4F3B] text-white px-4 py-3 border-2 border-[#141615] shadow-lg flex items-center gap-2 text-sm font-semibold">
          <CheckCircle className="w-4 h-4 text-[#F5EBE1]" />
          <span>{toast}</span>
        </div>
      )}

      {/* HEADER & NEW BUTTON */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
            কন্টেন্ট ম্যানেজমেন্ট
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B] mt-1">
            সকল ইসলামিক প্রবন্ধ ও গবেষণাপত্র
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4F4C] mt-1">
            মোট {articles.length}টি প্রবন্ধ প্রদর্শিত হচ্ছে
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border-2 border-[#141615] transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন প্রবন্ধ লিখুন</span>
        </Link>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-4 sm:p-5 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E7571]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিরোনাম, মূল বক্তব্য বা লেখক দিয়ে অনুসন্ধান করুন..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#141615] focus:outline-none focus:border-[#0B4F3B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Section filter */}
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setSelectedCategory('all');
              }}
              className="px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#141615] font-semibold text-[#141615]"
            >
              <option value="all">সকল বিভাগ (৯টি)</option>
              {SECTIONS_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.categories.length})
                </option>
              ))}
            </select>

            {/* Category filter */}
            {currentSectionCategories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#141615] font-semibold text-[#141615]"
              >
                <option value="all">সকল ক্যাটেগরি</option>
                {currentSectionCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#141615] font-semibold text-[#141615]"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="published">প্রকাশিত (Published)</option>
              <option value="draft">খসড়া (Draft)</option>
              <option value="review">পর্যালোচনায় (Review)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-[#141615] text-white text-xs font-bold hover:bg-[#26332F]"
            >
              ফিল্টার প্রয়োগ
            </button>
          </div>
        </form>
      </div>

      {/* ARTICLES TABLE */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-[#6E7571] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#0B4F3B]" />
            <span>প্রবন্ধ তালিকা লোড হচ্ছে...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#6E7571] mx-auto" />
            <h3 className="font-editorial text-lg font-bold">কোনো প্রবন্ধ পাওয়া যায়নি</h3>
            <p className="text-xs text-[#6E7571] max-w-sm mx-auto">
              আপনার ফিল্টার মানদণ্ড অনুযায়ী কোনো ফলাফল মেলেনি অথবা এখনো কোনো আর্টিকেল তৈরি করা হয়নি।
            </p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B4F3B] text-white text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>প্রথম প্রবন্ধ লিখুন</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#141615] text-[#FAF8F5] font-editorial text-xs uppercase">
                <tr>
                  <th className="p-3.5">শিরোনাম ও সারসংক্ষেপ</th>
                  <th className="p-3.5">বিভাগ ও ক্যাটেগরি</th>
                  <th className="p-3.5">লেখক ও তাহকীক</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                  <th className="p-3.5">পড়ার সময়</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD7CD]">
                {articles.map((art) => {
                  const section = SECTIONS_DATA.find((s) => s.id === art.section_id);
                  const category = section?.categories.find((c) => c.id === art.category_id);
                  const liveUrl = `/${section?.slug || art.section_id}/${category?.slug || art.category_id}/${art.slug}/`;

                  return (
                    <tr key={art.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3.5 max-w-sm">
                        <div className="font-bold text-[#141615] line-clamp-1 text-sm sm:text-base">
                          {art.title}
                        </div>
                        <div className="text-xs text-[#6E7571] line-clamp-2 mt-0.5">
                          {art.subtitle}
                        </div>
                        {art.is_lead && (
                          <span className="inline-block mt-1 text-[10px] font-bold bg-[#B85D19] text-white px-1.5 py-0.2">
                            LEAD ARTICLE
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#0B4F3B] block">
                          {section?.name || art.section_id}
                        </span>
                        <span className="text-xs text-[#B85D19]">
                          {category?.name || art.category_id}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs">
                        <div className="font-semibold text-[#141615]">{art.author}</div>
                        <div className="text-[11px] text-[#6E7571]">{art.reviewer}</div>
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(art)}
                          title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                          className={`inline-block px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                            art.status === 'published'
                              ? 'bg-[#E6F0EC] text-[#0B4F3B] border-[#176B52] hover:bg-[#D5E6DF]'
                              : art.status === 'draft'
                              ? 'bg-[#F2EFE9] text-[#6E7571] border-[#DCD7CD] hover:bg-[#E8DEC8]'
                              : 'bg-[#F6ECE3] text-[#B85D19] border-[#B85D19] hover:bg-[#EFE0CC]'
                          }`}
                        >
                          {art.status === 'published' ? '● প্রকাশিত' : art.status === 'draft' ? '○ খসড়া' : '◐ রিভিউতে'}
                        </button>
                      </td>
                      <td className="p-3.5 text-xs text-[#6E7571]">
                        <div>{art.read_time}</div>
                        <div className="text-[10px] mt-0.5">{art.published_at}</div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={liveUrl}
                            target="_blank"
                            title="লাইভ সাইটে দেখুন"
                            className="p-1.5 bg-[#FAF8F5] hover:bg-[#E6F0EC] text-[#0B4F3B] border border-[#DCD7CD]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/articles/edit?id=${art.id}`}
                            className="px-2.5 py-1 bg-[#0B4F3B] text-white text-xs font-bold hover:bg-[#083B2C]"
                          >
                            এডিট
                          </Link>
                          <button
                            type="button"
                            onClick={() => setArticleToDelete(art.id)}
                            className="p-1.5 text-[#B85D19] hover:bg-[#F6ECE3] border border-[#DCD7CD]"
                            title="মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#141615] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-[#B85D19]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-editorial text-lg font-bold">প্রবন্ধটি মুছে ফেলতে চান?</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#4A4F4C] leading-relaxed">
              এই প্রবন্ধটি মুছে ফেললে ডাটাবেজ ও ওয়েবসাইট থেকে তা স্থায়ীভাবে অপসারিত হবে। আপনি কি নিশ্চিত?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 text-xs font-bold border border-[#141615] hover:bg-[#FAF8F5]"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={() => handleDelete(articleToDelete)}
                className="px-4 py-2 bg-[#B85D19] hover:bg-[#9E4B10] text-white text-xs font-bold"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
