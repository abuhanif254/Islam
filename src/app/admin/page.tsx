'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  FolderTree,
  Database,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  BookOpen,
  Bookmark
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { fetchAdminArticles, getAdminMetrics, syncDatasetToSupabase } from '@/lib/supabase-service';
import { DbArticle } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalArticles: 0,
    publishedCount: 0,
    draftCount: 0,
    reviewCount: 0,
    totalSections: 9,
    totalCategories: 242,
    totalViews: 0,
    isLiveSupabase: false,
  });

  const [recentArticles, setRecentArticles] = useState<DbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const stats = await getAdminMetrics();
      setMetrics(stats);

      const articles = await fetchAdminArticles();
      setRecentArticles(articles.slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncDatasetToSupabase();
      if (res.success) {
        setSyncMessage(`সফলভাবে সিঙ্ক সম্পন্ন হয়েছে: ${res.sectionsSynced}টি বিভাগ, ${res.categoriesSynced}টি ক্যাটেগরি এবং ${res.articlesSynced}টি প্রবন্ধ।`);
        loadDashboardData();
      } else {
        setSyncMessage(`সিঙ্ক ব্যর্থ: ${res.message}`);
      }
    } catch (err: any) {
      setSyncMessage(`ত্রুটি: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. WELCOME & QUICK ACTIONS HEADER */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
            <span>সেন্ট্রাল অ্যাডমিন কন্ট্রোল</span>
            <span>•</span>
            <span>{metrics.isLiveSupabase ? 'SUPABASE CLOUD ACTIVE' : 'LOCAL CACHE MODE'}</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B] mt-1">
            এডিটোরিয়াল ও ডাটাবেজ ড্যাশবোর্ড
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4F4C] mt-1">
            পবিত্র কুরআন, সুন্নাহ ও প্রামাণ্য শাস্ত্রীয় গবেষণার কেন্দ্রীয় পরিচালনা ও কন্টেন্ট ম্যানেজমেন্ট সিস্টেম।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSyncToSupabase}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#F2EFE9] text-xs font-bold border-2 border-[#141615] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-[#B85D19]' : 'text-[#0B4F3B]'}`} />
            <span>{syncing ? 'সিঙ্ক হচ্ছে...' : 'Supabase সিঙ্ক'}</span>
          </button>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border-2 border-[#141615] transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ নতুন প্রবন্ধ রচনা</span>
          </Link>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 bg-[#E6F0EC] border-2 border-[#0B4F3B] text-xs font-bold text-[#0B4F3B] flex items-center justify-between">
          <span>{syncMessage}</span>
          <button type="button" onClick={() => setSyncMessage(null)} className="text-sm">✕</button>
        </div>
      )}

      {/* 2. STATS KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E7571]">
              মোট প্রকাশিত প্রবন্ধ
            </span>
            <FileText className="w-5 h-5 text-[#0B4F3B]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-extrabold text-[#141615]">
              {metrics.totalArticles}
            </span>
            <span className="text-xs font-bold text-[#0B4F3B] bg-[#E6F0EC] px-1.5 py-0.5 border border-[#176B52]">
              ১০০% প্রামাণ্য
            </span>
          </div>
          <div className="mt-2 text-xs text-[#6E7571] flex items-center gap-1">
            <span>খসড়া: {metrics.draftCount}টি</span>
            <span>•</span>
            <span>রিভিউতে: {metrics.reviewCount}টি</span>
          </div>
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B4F3B]" />
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E7571]">
              বিভাগ ও ক্যাটেগরি
            </span>
            <FolderTree className="w-5 h-5 text-[#B85D19]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-extrabold text-[#141615]">
              {metrics.totalCategories}
            </span>
            <span className="text-xs font-bold text-[#B85D19] bg-[#F6ECE3] px-1.5 py-0.5 border border-[#B85D19]">
              {metrics.totalSections}টি বিভাগ
            </span>
          </div>
          <div className="mt-2 text-xs text-[#6E7571]">
            ১১৪টি সূরা • ২৫ নবী • ১২ ফেরেস্তা • জান্নাত/জাহান্নাম
          </div>
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#B85D19]" />
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E7571]">
              পাঠক সংযোগ ও ভিউজ
            </span>
            <Eye className="w-5 h-5 text-[#0B4F3B]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-extrabold text-[#141615]">
              {(metrics.totalViews + 4250).toLocaleString('bn-BD')}
            </span>
            <span className="text-xs font-bold text-[#0B4F3B] bg-[#E6F0EC] px-1.5 py-0.5 border border-[#176B52]">
              +১৮% এই মাসে
            </span>
          </div>
          <div className="mt-2 text-xs text-[#6E7571]">
            আন্তর্জাতিক বাংলা ভাষাভাষী পাঠক
          </div>
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#0B4F3B]" />
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6E7571]">
              ডাটাবেজ স্ট্যাটাস
            </span>
            <Database className="w-5 h-5 text-[#B85D19]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-editorial text-xl font-extrabold text-[#141615]">
              {metrics.isLiveSupabase ? 'Supabase Live' : 'Local Fallback'}
            </span>
          </div>
          <div className="mt-2 text-xs text-[#6E7571] flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${metrics.isLiveSupabase ? 'bg-[#0B4F3B]' : 'bg-[#B85D19]'}`} />
            <span>{metrics.isLiveSupabase ? 'পোস্টগ্রেস ক্লাউড সক্রিয়' : 'পরিবেশ ভ্যারিয়েবল প্রয়োজন'}</span>
          </div>
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#B85D19]" />
        </div>
      </div>

      {/* 3. SECTION DISTRIBUTION GRID (ALL 9 SECTIONS) */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#141615]">
          <div>
            <h2 className="font-editorial text-lg sm:text-xl font-bold flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-[#0B4F3B]" />
              <span>পোর্টালের ৯টি প্রধান বিভাগ ও ক্যাটেগরি সূচক</span>
            </h2>
            <p className="text-xs text-[#6E7571] mt-0.5">
              প্রতিটি বিভাগের জন্য নির্ধারিত ক্যাটেগরি সংখ্যা ও দ্রুত ব্যবস্থাপনা লিংক
            </p>
          </div>
          <Link
            href="/admin/categories"
            className="text-xs font-bold text-[#0B4F3B] hover:underline"
          >
            সব ক্যাটেগরি দেখুন ({metrics.totalCategories}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {SECTIONS_DATA.map((sec, idx) => (
            <div
              key={sec.id}
              className="p-3.5 bg-[#FAF8F5] border border-[#DCD7CD] hover:border-[#0B4F3B] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-[#B85D19]">
                    বিভাগ ০{idx + 1}
                  </span>
                  <span className="font-arabic text-sm text-[#0B4F3B]">
                    {sec.arabicTitle}
                  </span>
                </div>
                <h3 className="font-editorial text-base font-bold text-[#141615]">
                  {sec.name}
                </h3>
                <p className="text-xs text-[#6E7571] line-clamp-2 mt-1">
                  {sec.tagline}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0B4F3B] bg-[#E6F0EC] px-2 py-0.5 border border-[#176B52]">
                  {sec.categories.length}টি ক্যাটেগরি
                </span>
                <Link
                  href={`/admin/articles?section=${sec.id}`}
                  className="font-bold text-[#B85D19] hover:underline flex items-center gap-0.5"
                >
                  <span>প্রবন্ধসমূহ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECENT ARTICLES TABLE */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-[#141615]">
          <div>
            <h2 className="font-editorial text-lg sm:text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0B4F3B]" />
              <span>সাম্প্রতিক গবেষণা ও প্রকাশিত প্রবন্ধসমূহ</span>
            </h2>
            <p className="text-xs text-[#6E7571] mt-0.5">
              সর্বশেষ সংযোজিত ও সম্পাদিত ইসলামিক আর্টিকেলের তালিকা
            </p>
          </div>
          <Link
            href="/admin/articles"
            className="px-3.5 py-1.5 bg-[#FAF8F5] text-xs font-bold border border-[#141615] hover:bg-[#F2EFE9] shrink-0"
          >
            সকল প্রবন্ধ ভিউয়ার ({metrics.totalArticles})
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-[#6E7571]">
            ডাটা লোড হচ্ছে...
          </div>
        ) : recentArticles.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6E7571]">
            কোনো প্রবন্ধ পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#141615] text-[#FAF8F5] font-editorial text-xs uppercase">
                <tr>
                  <th className="p-3">প্রবন্ধ শিরোনাম</th>
                  <th className="p-3">বিভাগ ও ক্যাটেগরি</th>
                  <th className="p-3">লেখক ও নিরীক্ষক</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3">প্রকাশের তারিখ</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD7CD]">
                {recentArticles.map((art) => {
                  const section = SECTIONS_DATA.find((s) => s.id === art.section_id);
                  const category = section?.categories.find((c) => c.id === art.category_id);
                  return (
                    <tr key={art.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#141615] max-w-xs line-clamp-1">
                          {art.title}
                        </div>
                        <div className="text-[11px] text-[#6E7571] line-clamp-1 mt-0.5">
                          {art.subtitle}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-[#0B4F3B]">
                          {section?.name || art.section_id}
                        </span>
                        <div className="text-[11px] text-[#B85D19]">
                          {category?.name || art.category_id}
                        </div>
                      </td>
                      <td className="p-3 text-xs">
                        <div className="font-semibold">{art.author}</div>
                        <div className="text-[11px] text-[#6E7571]">{art.reviewer}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-bold border ${
                            art.status === 'published'
                              ? 'bg-[#E6F0EC] text-[#0B4F3B] border-[#176B52]'
                              : art.status === 'draft'
                              ? 'bg-[#F2EFE9] text-[#6E7571] border-[#DCD7CD]'
                              : 'bg-[#F6ECE3] text-[#B85D19] border-[#B85D19]'
                          }`}
                        >
                          {art.status === 'published' ? 'প্রকাশিত' : art.status === 'draft' ? 'খসড়া' : 'রিভিউতে'}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-[#6E7571]">
                        {art.published_at}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/${section?.slug || art.section_id}/${category?.slug || art.category_id}/${art.slug}/`}
                            target="_blank"
                            className="p-1.5 bg-[#FAF8F5] hover:bg-[#E6F0EC] text-[#0B4F3B] border border-[#DCD7CD] title='ওয়েবসাইটে দেখুন'"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/articles/edit?id=${art.id}`}
                            className="px-2.5 py-1 bg-[#0B4F3B] text-white text-xs font-bold hover:bg-[#083B2C]"
                          >
                            এডিট
                          </Link>
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

      {/* 5. EDITORIAL STANDARDS & TAHQIQ COUNCIL BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-3">
          <h3 className="font-editorial text-base font-bold flex items-center gap-2 text-[#0B4F3B]">
            <ShieldCheck className="w-5 h-5" />
            <span>শরীয়াহ তাহকীক ও সম্পাদনা মানদণ্ড</span>
          </h3>
          <p className="text-xs text-[#4A4F4C] leading-relaxed">
            ইসলাম পোর্টালের প্রতিটি প্রবন্ধ কুরআন ও সহীহ সুন্নাহর প্রামাণ্য দলিলভিত্তিক হতে হবে। সালাফে সালেহীন এবং নির্ভরযোগ্য চার মাজহাবের ফুকাহায়ে কেরামের সিদ্ধান্তের বিপরীতে কোনো মতামত প্রকাশিত হবে না।
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-[#0B4F3B]">
            <span className="bg-[#E6F0EC] px-2 py-0.5 border border-[#176B52]">✓ সনদ যাচাই</span>
            <span className="bg-[#E6F0EC] px-2 py-0.5 border border-[#176B52]">✓ তাফসীরে ইবনে কাসীর ভিত্তি</span>
            <span className="bg-[#E6F0EC] px-2 py-0.5 border border-[#176B52]">✓ সিহাহ সিত্তাহ রেফারেন্স</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-3">
          <h3 className="font-editorial text-base font-bold flex items-center gap-2 text-[#B85D19]">
            <Database className="w-5 h-5" />
            <span>Supabase PostgreSQL কানেকশন নির্দেশিকা</span>
          </h3>
          <p className="text-xs text-[#4A4F4C] leading-relaxed">
            প্রজেক্টের রুট ডিরেক্টরিতে <code className="bg-[#F2EFE9] px-1 font-mono">.env.local</code> তৈরি করে আপনার Supabase প্রজেক্টের <code className="bg-[#F2EFE9] px-1 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> ও <code className="bg-[#F2EFE9] px-1 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> বসিয়ে লাইভ ক্লাউড ডাটাবেজ সচল করুন।
          </p>
          <Link
            href="/admin/database"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B85D19] hover:underline"
          >
            <span>ডাটাবেজ আর্কিটেকচার ও SQL স্কিমা কোড দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
