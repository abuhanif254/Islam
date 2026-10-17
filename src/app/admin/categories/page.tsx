'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { SECTIONS_DATA } from '@/data/sections';
import { CategoryItem, SectionPage } from '@/types';

export default function AdminCategoriesPage() {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Flatten all 242 categories with section information
  const allCategories = useMemo(() => {
    const list: (CategoryItem & { sectionName: string; sectionSlug: string; sectionId: string })[] = [];
    SECTIONS_DATA.forEach(sec => {
      sec.categories.forEach(cat => {
        list.push({
          ...cat,
          sectionName: sec.name,
          sectionSlug: sec.slug,
          sectionId: sec.id
        });
      });
    });
    return list;
  }, []);

  // Collect available filter groups
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    if (selectedSection === 'all') {
      allCategories.forEach(c => {
        if (c.group) groups.add(c.group);
      });
    } else {
      const sec = SECTIONS_DATA.find(s => s.id === selectedSection);
      if (sec) {
        sec.categories.forEach(c => {
          if (c.group) groups.add(c.group);
        });
      }
    }
    return Array.from(groups);
  }, [selectedSection, allCategories]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return allCategories.filter(cat => {
      const matchSection = selectedSection === 'all' || cat.sectionId === selectedSection;
      const matchGroup = selectedGroup === 'all' || cat.group === selectedGroup;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        cat.name.toLowerCase().includes(q) ||
        (cat.arabicName && cat.arabicName.toLowerCase().includes(q)) ||
        cat.badge.toLowerCase().includes(q) ||
        cat.shortDesc.toLowerCase().includes(q) ||
        cat.metaInfo.toLowerCase().includes(q) ||
        cat.sectionName.toLowerCase().includes(q);

      return matchSection && matchGroup && matchQuery;
    });
  }, [allCategories, selectedSection, selectedGroup, searchQuery]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
            ট্যাক্সোনোমি ও শ্রেণিবিভাগ
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B] mt-1">
            ইসলামিক শাস্ত্রীয় বিভাগ ও ক্যাটেগরি ম্যানেজমেন্ট
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4F4C] mt-1">
            ৯টি প্রধান বিভাগ, ২৪২টি সুনির্দিষ্ট ক্যাটেগরি এবং শাস্ত্রীয় শ্রেণিবিভাগ।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#FAF8F5] border border-[#141615] p-2.5 text-center px-4">
            <span className="block text-xl font-bold font-mono text-[#0B4F3B]">
              {allCategories.length}
            </span>
            <span className="text-[10px] text-[#6E7571] uppercase tracking-wider font-semibold">
              মোট ক্যাটেগরি
            </span>
          </div>
          <div className="bg-[#FAF8F5] border border-[#141615] p-2.5 text-center px-4">
            <span className="block text-xl font-bold font-mono text-[#B85D19]">
              {SECTIONS_DATA.length}
            </span>
            <span className="text-[10px] text-[#6E7571] uppercase tracking-wider font-semibold">
              মূল বিভাগ
            </span>
          </div>
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
            সকল বিভাগ ({allCategories.length})
          </button>
          {SECTIONS_DATA.map(sec => (
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
                ({sec.categories.length})
              </span>
            </button>
          ))}
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
            {filteredCategories.length}টি ক্যাটেগরি পাওয়া গেছে
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredCategories.map(cat => {
            const publicUrl = `/${cat.sectionSlug}/${cat.slug}/`;
            return (
              <div
                key={cat.id}
                className="bg-[#FFFFFF] border-2 border-[#141615] p-4 flex flex-col justify-between hover:border-[#0B4F3B] transition-colors group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B85D19] bg-[#F6ECE3] px-2 py-0.5 border border-[#B85D19]">
                      {cat.sectionName}
                    </span>
                    <span className="text-[10px] font-mono text-[#0B4F3B] bg-[#E6F0EC] px-2 py-0.5 border border-[#176B52]">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-editorial text-base font-bold text-[#141615] group-hover:text-[#0B4F3B] transition-colors leading-snug">
                    {cat.name}
                  </h3>

                  {cat.arabicName && (
                    <div
                      dir="rtl"
                      className="text-base font-serif text-[#0B4F3B] mt-0.5 text-right font-medium"
                    >
                      {cat.arabicName}
                    </div>
                  )}

                  <p className="text-xs text-[#4A4F4C] line-clamp-2 mt-2 leading-relaxed">
                    {cat.shortDesc}
                  </p>

                  {cat.metaInfo && (
                    <div className="text-[11px] font-mono text-[#6E7571] mt-2 pt-2 border-t border-[#F2EFE9]">
                      {cat.metaInfo}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#141615] flex items-center justify-between text-xs">
                  <Link
                    href={`/admin/articles?section=${cat.sectionId}&category=${cat.id}`}
                    className="font-bold text-[#0B4F3B] hover:underline inline-flex items-center gap-1"
                  >
                    <span>প্রবন্ধ দেখুন</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>

                  <Link
                    href={publicUrl}
                    target="_blank"
                    className="p-1 text-[#6E7571] hover:text-[#0B4F3B] hover:bg-[#FAF8F5]"
                    title="পাবলিক পেজ দেখুন"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
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
    </div>
  );
}
