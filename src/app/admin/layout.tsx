'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Database,
  ExternalLink,
  Menu,
  X,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { IslamicGeometricEmblem } from '@/components/IslamicGeometricEmblem';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(false);

  useEffect(() => {
    setIsLiveDb(isSupabaseConfigured());
  }, []);

  const navItems = [
    {
      name: 'ড্যাশবোর্ড',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      name: 'সকল প্রবন্ধ',
      href: '/admin/articles',
      icon: FileText,
      active: pathname === '/admin/articles',
    },
    {
      name: 'নতুন প্রবন্ধ লিখুন',
      href: '/admin/articles/new',
      icon: PlusCircle,
      active: pathname === '/admin/articles/new',
    },
    {
      name: 'ক্যাটেগরি ও বিভাগ',
      href: '/admin/categories',
      icon: FolderTree,
      active: pathname === '/admin/categories',
    },
    {
      name: 'Supabase ডাটাবেজ',
      href: '/admin/database',
      icon: Database,
      active: pathname === '/admin/database',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141615] flex flex-col font-sans">
      {/* 1. TOP UTILITY BAR FOR ADMIN */}
      <header className="bg-[#141615] text-[#FAF8F5] border-b-2 border-[#0B4F3B] sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-white hover:bg-[#26332F] rounded"
              aria-label="মেনু খুলুন"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/admin" className="flex items-center gap-3">
              <IslamicGeometricEmblem
                size={34}
                primaryColor="#0B4F3B"
                accentColor="#B85D19"
                surfaceColor="#FAF8F5"
              />
              <div>
                <div className="font-editorial text-lg font-extrabold leading-none tracking-tight flex items-center gap-2">
                  <span>ইসলাম পোর্টাল</span>
                  <span className="text-[10px] bg-[#0B4F3B] text-[#E8A86B] px-1.5 py-0.5 font-mono uppercase font-bold border border-[#176B52]">
                    ADMIN
                  </span>
                </div>
                <div className="text-[11px] text-[#A8B2AE] mt-0.5">
                  সেন্ট্রাল এডিটোরিয়াল ও ডাটাবেজ ড্যাশবোর্ড
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Status Pill */}
            <Link
              href="/admin/database"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border ${
                isLiveDb
                  ? 'bg-[#083B2C] text-[#4CC39A] border-[#176B52]'
                  : 'bg-[#2B2118] text-[#E8A86B] border-[#733F17]'
              }`}
              title={isLiveDb ? 'Supabase সংযুক্ত রয়েছে' : 'লোকাল মেমোরি / অফলাইন মোড'}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveDb ? 'bg-[#4CC39A] animate-pulse' : 'bg-[#E8A86B]'
                }`}
              />
              <span>{isLiveDb ? 'Supabase লাইভ' : 'লোকাল ডেভ মোড'}</span>
            </Link>

            <Link
              href="/admin/articles/new"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold border border-[#176B52] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নতুন আর্টিকেল</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#26332F] hover:bg-[#34443F] text-xs font-semibold text-white border border-[#3B4A45] transition-colors"
            >
              <span>লাইভ ওয়েবসাইট</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-[#2D3330]">
              <div className="w-8 h-8 rounded-full bg-[#0B4F3B] text-white flex items-center justify-center font-bold text-xs border border-[#B85D19]">
                মু
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`fixed lg:sticky top-16 z-30 w-64 h-[calc(100vh-4rem)] bg-[#FFFFFF] border-r-2 border-[#141615] flex flex-col justify-between p-4 transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E7571] mb-2 px-3">
                প্রধান মেনু
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors border ${
                        item.active
                          ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                          : 'text-[#141615] hover:bg-[#F2EFE9] border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E7571] mb-2 px-3">
                ডাটাবেজ ও ক্লাউড
              </div>
              <div className="p-3 bg-[#F2EFE9] border border-[#DCD7CD] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#0B4F3B]" />
                    <span>Supabase DB</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 border ${
                      isLiveDb
                        ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                        : 'bg-[#B85D19] text-white border-[#B85D19]'
                    }`}
                  >
                    {isLiveDb ? 'ACTIVE' : 'LOCAL'}
                  </span>
                </div>
                <p className="text-[11px] text-[#4A4F4C] leading-snug">
                  {isLiveDb
                    ? 'পোস্টগ্রেস এসকিউএল ডাটাবেজে লাইভ কানেকশন সক্রিয়।'
                    : '.env.local এ Supabase কী দিয়ে লাইভ ডাটাবেজ যুক্ত করুন।'}
                </p>
                <Link
                  href="/admin/database"
                  className="block text-center text-xs font-bold text-[#0B4F3B] hover:underline pt-1"
                >
                  ডাটাবেজ স্টুডিও খুলুন →
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DCD7CD] space-y-2">
            <div className="flex items-center gap-2 px-2 text-xs text-[#6E7571]">
              <ShieldCheck className="w-4 h-4 text-[#0B4F3B]" />
              <span>শরীয়াহ তাহকীক ও সম্পাদনা প্যানেল</span>
            </div>
            <div className="text-[11px] text-[#8A9490] px-2">
              সংস্করণ ২.৪ • ২০২৬
            </div>
          </div>
        </aside>

        {/* OVERLAY FOR MOBILE SIDEBAR */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}

        {/* MAIN ADMIN WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
