'use client';

import React from 'react';
import Link from 'next/link';
import { SECTIONS_DATA } from '@/data/sections';
import { SectionPage } from '@/types';
import IslamicGeometricEmblem from './IslamicGeometricEmblem';
import { Calendar, Layers, BookOpen, ShieldCheck } from 'lucide-react';

interface SiteFooterProps {
  onSelectSection?: (section: SectionPage) => void;
  onOpenDirectory?: () => void;
}

export default function SiteFooter({
  onSelectSection,
  onOpenDirectory,
}: SiteFooterProps = {}) {
  return (
    <footer className="bg-[#141615] text-[#FAF8F5] border-t-4 border-[#0B4F3B] mt-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#2D3330]">
          {/* COLUMN 1: BRANDING & MANHAJ */}
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

          {/* COLUMN 2: PRIMARY SECTIONS (9 SHASTRIYO SECTIONS) */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-editorial text-sm font-bold uppercase tracking-wider text-[#E8A86B]">
              প্রধান বিভাগসমূহ
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-sm">
              {SECTIONS_DATA.map((sec) => (
                onSelectSection ? (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => onSelectSection(sec)}
                    className="text-left text-[#C2C8C5] hover:text-white py-0.5 transition-colors"
                  >
                    → {sec.name}
                  </button>
                ) : (
                  <Link
                    key={sec.id}
                    href={`/${sec.slug}/`}
                    className="text-left text-[#C2C8C5] hover:text-white py-0.5 transition-colors"
                  >
                    → {sec.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* COLUMN 3: SERVICES & DIRECTORY */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-editorial text-sm font-bold uppercase tracking-wider text-[#E8A86B]">
              প্রয়োজনীয় সেবা ও লিংক
            </h4>
            <ul className="space-y-1.5 text-xs text-[#C2C8C5]">
              <li>
                <Link
                  href="/prayer-times/"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#B85D19]" />
                  <span>সালাতের সময়সূচি (৬৪ জেলা)</span>
                </Link>
              </li>
              <li>
                {onOpenDirectory ? (
                  <button
                    type="button"
                    onClick={onOpenDirectory}
                    className="hover:text-white flex items-center gap-1.5 transition-colors text-left"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#B85D19]" />
                    <span>সকল বিভাগ ও ক্যাটেগরি ডিরেক্টরি</span>
                  </button>
                ) : (
                  <Link
                    href="/#directory"
                    className="hover:text-white flex items-center gap-1.5 transition-colors text-left"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#B85D19]" />
                    <span>সকল বিভাগ ও ক্যাটেগরি ডিরেক্টরি</span>
                  </Link>
                )}
              </li>
              <li>
                <Link
                  href="/quran/"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B85D19]" />
                  <span>পবিত্র কুরআনুল কারীম ও তাফসীর</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/hadith/"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B85D19]" />
                  <span>সহীহ হাদিস শাস্ত্র ও তাহকীক</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8A9490]">
          <span>© ২০২৬ ইসলাম পোর্টাল (islam.org.bd) • সর্বস্বত্ব সংরক্ষিত।</span>
          <div className="flex items-center gap-4">
            <span>পবিত্র কুরআন ও সহীহ সুন্নাহর প্রামাণ্য প্রকাশনা</span>
            <span>•</span>
            <Link
              href="/admin/login/"
              className="hover:text-white transition-colors"
            >
              অ্যাডমিন লগইন
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
