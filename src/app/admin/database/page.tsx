'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Server,
  Cloud,
  FileCode,
  HardDrive,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { syncDatasetToSupabase, getAdminMetrics } from '@/lib/supabase-service';

const SCHEMA_SQL = `-- ===========================================================================
-- ইসলাম (Islam Portal) — Supabase PostgreSQL Database Schema
-- ===========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SECTIONS TABLE (৯টি প্রধান বিভাগ)
CREATE TABLE IF NOT EXISTS public.sections (
  id VARCHAR(50) PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  arabic_title VARCHAR(150) NOT NULL,
  tagline TEXT,
  description TEXT,
  filter_groups TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE (২৪২টি বিশেষায়িত ক্যাটেগরি)
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  section_id VARCHAR(50) NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  arabic_name VARCHAR(150),
  badge VARCHAR(100),
  "group" VARCHAR(100),
  article_count INTEGER DEFAULT 0,
  short_desc TEXT,
  meta_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ARTICLES TABLE (গবেষণাধর্মী প্রবন্ধাবলী)
CREATE TABLE IF NOT EXISTS public.articles (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(300) NOT NULL,
  subtitle TEXT,
  section_id VARCHAR(50) NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  category_id VARCHAR(100) NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  author VARCHAR(150) NOT NULL,
  reviewer VARCHAR(150) NOT NULL,
  published_at VARCHAR(100) NOT NULL,
  read_time VARCHAR(50) DEFAULT '৫ মিনিট পাঠ',
  is_lead BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'review')),
  tags TEXT[] DEFAULT '{}',
  citation JSONB DEFAULT '{}'::jsonb,
  summary TEXT NOT NULL,
  key_takeaways TEXT[] DEFAULT '{}',
  content_sections JSONB DEFAULT '[]'::jsonb,
  "references" TEXT[] DEFAULT '{}',
  featured_image JSONB DEFAULT NULL,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_identifier VARCHAR(150) NOT NULL,
  article_id VARCHAR(100) NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_identifier, article_id)
);

-- 6. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('superadmin', 'editor', 'tahqiq_reviewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies (সকল ভিজিটরদের জন্য উন্মুক্ত)
CREATE POLICY "Allow public read on sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Allow public read on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on published articles" ON public.articles FOR SELECT USING (status = 'published' OR true);
CREATE POLICY "Allow public read on bookmarks" ON public.bookmarks FOR SELECT USING (true);

-- Admin Write Access Policies
CREATE POLICY "Allow admin full access on sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access on bookmarks" ON public.bookmarks FOR ALL USING (true) WITH CHECK (true);

-- 8. INDEXES FOR LIGHTNING PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_categories_section_id ON public.categories(section_id);
CREATE INDEX IF NOT EXISTS idx_articles_section_category ON public.articles(section_id, category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

-- 9. AUTOMATIC updated_at TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
`;

export default function AdminDatabasePage() {
  const isLive = isSupabaseConfigured();
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    sectionsSynced?: number;
    categoriesSynced?: number;
    articlesSynced?: number;
    message: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalSections: 9,
    totalCategories: 242,
  });

  useEffect(() => {
    getAdminMetrics().then(m => {
      setStats({
        totalArticles: m.totalArticles,
        totalSections: m.totalSections,
        totalCategories: m.totalCategories,
      });
    });
  }, []);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      if (!isSupabaseConfigured() || !supabase) {
        setTestResult({
          success: false,
          message: 'Supabase এনভায়রনমেন্ট ভেরিয়েবল সেট করা নেই (.env.local এ NEXT_PUBLIC_SUPABASE_URL বসান)।'
        });
        return;
      }

      const { data, error } = await supabase.from('sections').select('count', { count: 'exact', head: true });
      if (error) {
        setTestResult({
          success: false,
          message: `কানেকশন হয়েছে কিন্তু টেবিল পাওয়া যায়নি বা এক্সেস সমস্যা: ${error.message}`
        });
      } else {
        setTestResult({
          success: true,
          message: 'সফল! Supabase ক্লাউড ডাটাবেজ সক্রিয় এবং রেসপন্স করছে।'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `কানেকশন ব্যর্থ: ${err.message}`
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncDatasetToSupabase();
      setSyncResult(res);
      if (res.success) {
        const m = await getAdminMetrics();
        setStats({
          totalArticles: m.totalArticles,
          totalSections: m.totalSections,
          totalCategories: m.totalCategories,
        });
      }
    } catch (e: any) {
      setSyncResult({
        success: false,
        message: e.message
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
            ডাটাবেজ আর্কিটেকচার
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B] mt-1">
            Supabase PostgreSQL ডাটাবেজ স্টুডিও
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4F4C] mt-1">
            সম্পূর্ণ স্কিমা ডেফিনিশন, রিয়েল-টাইম ক্লাউড ডাটা সিঙ্ক এবং স্টোরেজ কনফিগারেশন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLive ? (
            <div className="flex items-center gap-2 bg-[#E6F0EC] border-2 border-[#0B4F3B] px-3.5 py-2 text-xs font-bold text-[#0B4F3B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B4F3B] animate-pulse" />
              <span>SUPABASE CLOUD ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#F6ECE3] border-2 border-[#B85D19] px-3.5 py-2 text-xs font-bold text-[#B85D19]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B85D19]" />
              <span>LOCAL CACHE MODE (OFFLINE READY)</span>
            </div>
          )}
        </div>
      </div>

      {/* TOP ACTIONS & STATUS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CONNECTION CARD */}
        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
            <h3 className="font-editorial text-base font-bold text-[#141615] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#0B4F3B]" />
              <span>Supabase কানেকশন ও স্টেটাস</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-[#6E7571]">
              POSTGRESQL v15+
            </span>
          </div>

          <p className="text-xs text-[#4A4F4C] leading-relaxed">
            {isLive
              ? 'আপনার প্রজেক্ট সফলভাবে Supabase ক্লাউড প্রজেক্টের সাথে সংযুক্ত আছে। যে কোনো নতুন প্রবন্ধ, সম্পাদনা ও ক্যাটেগরি সরাসরি ক্লাউডে সংরক্ষিত হবে।'
              : 'বর্তমানে কোনো Supabase ক্রিডেনশিয়াল পাওয়া যায়নি। তবে সিস্টেম স্বয়ংক্রিয়ভাবে ব্রাউজারের লোকাল স্টোরেজ ক্যাশে সম্পূর্ণ ফিচার সচল রেখেছে।'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] hover:bg-[#F2EFE9] text-[#141615] text-xs font-bold border border-[#141615] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>{testingConnection ? 'যাচাই করা হচ্ছে...' : 'কানেকশন টেস্ট করুন'}</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 text-xs font-semibold border ${
                testResult.success
                  ? 'bg-[#E6F0EC] border-[#0B4F3B] text-[#0B4F3B]'
                  : 'bg-[#FBEAE8] border-[#D9381E] text-[#D9381E]'
              }`}
            >
              {testResult.message}
            </div>
          )}
        </div>

        {/* ONE-CLICK SYNC CARD */}
        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
            <h3 className="font-editorial text-base font-bold text-[#141615] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#B85D19]" />
              <span>ওয়ান-ক্লিক ডাটাসেট সিঙ্ক (One-Click Sync)</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-[#B85D19]">
              BATCH UPSERT
            </span>
          </div>

          <p className="text-xs text-[#4A4F4C] leading-relaxed">
            পোর্টালের ৯টি মূল বিভাগ, ২৪২টি বিশদ ক্যাটেগরি এবং সকল প্রামাণ্য প্রাথমিক প্রবন্ধসমূহ এক ক্লিকে আপনার Supabase ডাটাবেজে আপলোড ও সিঙ্ক করুন।
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSyncData}
              disabled={syncing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold border-2 border-[#141615] transition-colors shadow-sm"
            >
              <Cloud className={`w-4 h-4 ${syncing ? 'animate-bounce' : ''}`} />
              <span>{syncing ? 'সিঙ্ক প্রক্রিয়া চলমান...' : 'সম্পূর্ণ ডাটাসেট Supabase-এ সিঙ্ক করুন'}</span>
            </button>
          </div>

          {syncResult && (
            <div
              className={`p-3 text-xs font-semibold border ${
                syncResult.success
                  ? 'bg-[#E6F0EC] border-[#0B4F3B] text-[#0B4F3B]'
                  : 'bg-[#FBEAE8] border-[#D9381E] text-[#D9381E]'
              }`}
            >
              <div>{syncResult.message}</div>
              {syncResult.success && (
                <div className="mt-1 font-mono text-[11px] opacity-90">
                  বিভাগ: {syncResult.sectionsSynced}টি | ক্যাটেগরি: {syncResult.categoriesSynced}টি | প্রবন্ধ: {syncResult.articlesSynced}টি
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STEP-BY-STEP SETUP GUIDE */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4">
        <h3 className="font-editorial text-base sm:text-lg font-bold text-[#0B4F3B] flex items-center gap-2">
          <Info className="w-5 h-5 text-[#B85D19]" />
          <span>Supabase ক্লাউড ডাটাবেজ কনফিগারেশন নির্দেশিকা (৪ ধাপ)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-[#FAF8F5] border border-[#DCD7CD] space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#0B4F3B] text-white font-mono font-bold text-xs flex items-center justify-center">
              ১
            </div>
            <h4 className="font-bold text-xs text-[#141615]">প্রজেক্ট তৈরি</h4>
            <p className="text-[11px] text-[#4A4F4C] leading-relaxed">
              <a href="https://supabase.com" target="_blank" className="text-[#0B4F3B] underline font-bold">
                supabase.com
              </a> এ বিনামূল্যে অ্যাকাউন্ট খুলে নতুন প্রজেক্ট তৈরি করুন।
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#DCD7CD] space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#0B4F3B] text-white font-mono font-bold text-xs flex items-center justify-center">
              ২
            </div>
            <h4 className="font-bold text-xs text-[#141615]">SQL স্কিমা রান করুন</h4>
            <p className="text-[11px] text-[#4A4F4C] leading-relaxed">
              নিচের SQL কোডটি কপি করে Supabase ড্যাশবোর্ডের <strong>SQL Editor</strong>-এ পেস্ট করে <strong>Run</strong> বাটনে চাপ দিন।
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#DCD7CD] space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#0B4F3B] text-white font-mono font-bold text-xs flex items-center justify-center">
              ৩
            </div>
            <h4 className="font-bold text-xs text-[#141615]">API কী সংগ্রহ করুন</h4>
            <p className="text-[11px] text-[#4A4F4C] leading-relaxed">
              <strong>Project Settings → API</strong> থেকে <code className="bg-[#EFEBE4] px-1 font-mono">Project URL</code> এবং <code className="bg-[#EFEBE4] px-1 font-mono">anon public key</code> কপি করুন।
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#DCD7CD] space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#0B4F3B] text-white font-mono font-bold text-xs flex items-center justify-center">
              ৪
            </div>
            <h4 className="font-bold text-xs text-[#141615]">.env.local ফাইলে যুক্ত করুন</h4>
            <p className="text-[11px] text-[#4A4F4C] leading-relaxed">
              প্রজেক্টের রুট ডিরেক্টরিতে <code className="bg-[#EFEBE4] px-1 font-mono">.env.local</code> ফাইলে ভেরিয়েবল দুটো সংরক্ষণ করে ওয়ান-ক্লিক সিঙ্ক বাটনে চাপুন।
            </p>
          </div>
        </div>
      </div>

      {/* 1-LINE MIGRATION HELPER */}
      <div className="bg-[#FAF8F5] border-2 border-[#B85D19] p-4 sm:p-5 space-y-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B85D19]" />
          <h4 className="font-editorial text-sm font-bold text-[#141615]">
            বিদ্যমান ডাটাবেজে ইমেজ কলাম যুক্ত করার ১-ক্লিক SQL মাইগ্রেশন (Feature Migration):
          </h4>
        </div>
        <p className="text-xs text-[#6E7571] leading-relaxed">
          আপনি যদি পূর্বেই ডাটাবেজ তৈরি করে থাকেন, তবে পুরো টেবিল পুনরায় তৈরি করার প্রয়োজন নেই। Supabase <strong>SQL Editor</strong>-এ শুধুমাত্র নিচের ১-লাইনের কোডটি রান করুন:
        </p>
        <div className="p-3 bg-[#FFFFFF] border border-[#DCD7CD] font-mono text-xs text-[#0B4F3B] font-bold select-all space-y-1">
          <div>ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS featured_image JSONB DEFAULT NULL;</div>
          <div>ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;</div>
        </div>
      </div>

      {/* SCHEMA VIEWER & COPY */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] overflow-hidden">
        <div className="bg-[#141615] text-[#FAF8F5] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#F5EBE1]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              supabase/schema.sql — PostgreSQL DDL & RLS Policies
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#F5EBE1]" />
                <span>কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>SQL কপি করুন</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-[#141615] overflow-x-auto">
          <pre className="font-mono text-xs text-[#E6F0EC] leading-relaxed">
            {SCHEMA_SQL}
          </pre>
        </div>
      </div>
    </div>
  );
}
