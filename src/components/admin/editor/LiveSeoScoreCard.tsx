'use client';

import React, { useState, useMemo } from 'react';
import {
  Globe,
  Share2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Smartphone,
  Monitor,
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import { SITE_URL } from '@/lib/seo';
import { toBengaliDigits } from '@/lib/prayer-times';
import { ArticleFeaturedImage } from '@/types';

interface LiveSeoScoreCardProps {
  title: string;
  subtitle: string;
  summary: string;
  sectionSlug: string;
  categorySlug: string;
  articleSlug: string;
  categoryName: string;
  citationArabic: string;
  citationBengali: string;
  keyTakeaways: string[];
  contentSections: { heading: string; body: string }[];
  references: string[];
  tags: string[];
  wordCount: number;
  featuredImage?: ArticleFeaturedImage;
  faqs?: { question: string; answer: string }[];
}

export default function LiveSeoScoreCard({
  title,
  subtitle,
  summary,
  sectionSlug,
  categorySlug,
  articleSlug,
  categoryName,
  citationArabic,
  citationBengali,
  keyTakeaways,
  contentSections,
  references,
  tags,
  wordCount,
  featuredImage,
  faqs
}: LiveSeoScoreCardProps) {
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  // Calculate detailed SEO & Discover Score
  const audit = useMemo(() => {
    let score = 0;
    const items: { label: string; passed: boolean; score: number; maxScore: number; tip: string }[] = [];

    // 1. Title Length (30-75 chars) - 10 pts
    const titleLen = title.trim().length;
    const titlePassed = titleLen >= 30 && titleLen <= 75;
    const titleScore = titlePassed ? 10 : titleLen > 10 ? 5 : 0;
    score += titleScore;
    items.push({
      label: 'শিরোনামের উপযুক্ত দৈর্ঘ্য (৩০-৭৫ অক্ষর)',
      passed: titlePassed,
      score: titleScore,
      maxScore: 10,
      tip: `বর্তমান দৈর্ঘ্য: ${titleLen} অক্ষর। আদর্শ হলো ৪০-৬৫ অক্ষর।`
    });

    // 2. Subtitle & Summary Length (90-220 chars) - 10 pts
    const summaryLen = (summary || subtitle).trim().length;
    const summaryPassed = summaryLen >= 90 && summaryLen <= 220;
    const summaryScore = summaryPassed ? 10 : summaryLen > 30 ? 5 : 0;
    score += summaryScore;
    items.push({
      label: 'সারসংক্ষেপ ও মেটা বিবরণ (১০০-২০০ অক্ষর)',
      passed: summaryPassed,
      score: summaryScore,
      maxScore: 10,
      tip: `বর্তমান দৈর্ঘ্য: ${summaryLen} অক্ষর। গুগল অনুসন্ধানে ১২০-১৬০ অক্ষর সবচেয়ে কার্যকরী।`
    });

    // 3. Hero Citation (Arabic + Bengali) - 15 pts
    const citationPassed = Boolean(citationArabic.trim().length > 10 && citationBengali.trim().length > 10);
    const citationScore = citationPassed ? 15 : citationBengali.trim().length > 5 ? 7 : 0;
    score += citationScore;
    items.push({
      label: 'প্রচ্ছদ উদ্ধৃতি (আরবী আয়াত/হাদিস ও বঙ্গানুবাদ)',
      passed: citationPassed,
      score: citationScore,
      maxScore: 15,
      tip: 'প্রচ্ছদে বিশুদ্ধ আরবী ও স্পষ্ট অনুবাদ থাকলে গুগল স্কলার ও ডিসকভারে অগ্রাধিকার পায়।'
    });

    // 4. Key Takeaways (>= 3 items) - 10 pts
    const validTakeaways = keyTakeaways.filter((t) => t.trim().length > 5);
    const takeawaysPassed = validTakeaways.length >= 3;
    const takeawaysScore = takeawaysPassed ? 10 : validTakeaways.length * 3;
    score += takeawaysScore;
    items.push({
      label: 'মূল শিক্ষা ও সারসংক্ষেপ পয়েন্ট (কমপক্ষে ৩টি)',
      passed: takeawaysPassed,
      score: takeawaysScore,
      maxScore: 10,
      tip: `বর্তমান পয়েন্ট: ${validTakeaways.length}টি। পাঠকের দ্রুত অনুধাবনের জন্য ৩-৫টি পয়েন্ট আদর্শ।`
    });

    // 5. Content Volume & Sections (>= 3 sections, >= 450 words) - 15 pts
    const validSections = contentSections.filter((s) => s.heading.trim().length > 0 || s.body.trim().length > 30);
    const volumePassed = validSections.length >= 3 && wordCount >= 450;
    const volumeScore = volumePassed
      ? 15
      : (validSections.length >= 2 ? 6 : 3) + (wordCount >= 300 ? 5 : wordCount >= 150 ? 3 : 0);
    score += volumeScore;
    items.push({
      label: 'গবেষণার গভীরতা ও অনুচ্ছেদ বিন্যাস (৩+ সেকশন, ৫০০+ শব্দ)',
      passed: volumePassed,
      score: volumeScore,
      maxScore: 15,
      tip: `বর্তমান: ${validSections.length}টি অনুচ্ছেদ ও ${wordCount} শব্দ। গভীর গবেষণায় ৮০০-১২০০ শব্দ সর্বোত্তম।`
    });

    // 6. Islamic Blocks Presence - 10 pts
    const allBodies = contentSections.map((s) => s.body).join(' ');
    const hasIslamicBlock =
      allBodies.includes('[কুরআন:') ||
      allBodies.includes('[হাদিস:') ||
      allBodies.includes('[মাসআলা:') ||
      allBodies.includes('[উক্তি:');
    const blockScore = hasIslamicBlock ? 10 : 0;
    score += blockScore;
    items.push({
      label: 'প্রামাণ্য ইসলামিক ব্লক (কুরআন/হাদিস/ফিকহ/উক্তি)',
      passed: hasIslamicBlock,
      score: blockScore,
      maxScore: 10,
      tip: 'বডি সেকশনে ফরম্যাটেড কুরআন বা সহীহ হাদিস ব্লক পাঠকদের বিশ্বাসযোগ্যতা বৃদ্ধি করে।'
    });

    // 7. Verified References (>= 2 sources) - 10 pts
    const validRefs = references.filter((r) => r.trim().length > 4);
    const refsPassed = validRefs.length >= 2;
    const refsScore = refsPassed ? 10 : validRefs.length * 5;
    score += refsScore;
    items.push({
      label: 'প্রামাণ্য গ্রন্থপঞ্জি ও রেফারেন্স (কমপক্ষে ২টি)',
      passed: refsPassed,
      score: refsScore,
      maxScore: 10,
      tip: `বর্তমান তথ্যসূত্র: ${validRefs.length}টি। এটি গুগলের E-E-A-T অথরিটি প্রতিষ্ঠা করে।`
    });

    // 8. Featured Hero Image & Alt Text - 10 pts
    const hasImage = Boolean(featuredImage?.url && featuredImage.url.trim().length > 5);
    const hasAlt = Boolean(featuredImage?.alt && featuredImage.alt.trim().length > 3);
    const imgPassed = hasImage && hasAlt;
    const imgScore = imgPassed ? 10 : hasImage ? 6 : 0;
    score += imgScore;
    items.push({
      label: 'প্রচ্ছদ ফিচার্ড ছবি ও বর্ণনামূলক অল্ট টেক্সট (Featured Image & Alt)',
      passed: imgPassed,
      score: imgScore,
      maxScore: 10,
      tip: hasImage
        ? hasAlt
          ? 'ছবি ও অল্ট টেক্সট যথাযথভাবে সংযুক্ত রয়েছে। গুগল ডিসকভারে প্রদর্শন নিশ্চিত।'
          : 'ছবি সংযুক্ত রয়েছে তবে অল্ট টেক্সট দেওয়া হয়নি। এসইও এর জন্য অল্ট টেক্সট লিখুন।'
        : 'ফিচার্ড ছবি যোগ করলে গুগল ডিসকভার ও সোশ্যাল মিডিয়ায় ট্রাফিক ৩ গুণ বৃদ্ধি পায়।'
    });

    // 9. Tags (>= 3 tags) - 10 pts
    const validTags = tags.filter((t) => t.trim().length > 0);
    const tagsPassed = validTags.length >= 3;
    const tagsScore = tagsPassed ? 10 : validTags.length * 3;
    score += tagsScore;
    items.push({
      label: 'ট্যাগ ও বিষয়ভিত্তিক কিওয়ার্ড (৩-৮টি)',
      passed: tagsPassed,
      score: tagsScore,
      maxScore: 10,
      tip: `বর্তমান ট্যাগ: ${validTags.length}টি।`
    });

    // 10. FAQ Rich Snippets (At least 1-2 FAQs) - 5 pts
    const validFaqs = (faqs || []).filter((f) => f.question.trim().length > 0 && f.answer.trim().length > 0);
    const faqPassed = validFaqs.length >= 2;
    const faqScore = faqPassed ? 5 : validFaqs.length >= 1 ? 3 : 0;
    score += faqScore;
    items.push({
      label: 'গুগল রিচ স্নিপেটস এফএকিউ (FAQ) উপস্থিতি',
      passed: faqPassed,
      score: faqScore,
      maxScore: 5,
      tip: faqPassed
        ? `উত্তম! ${toBengaliDigits(validFaqs.length)}টি প্রশ্ন-উত্তর গুগল FAQPage স্কিমার জন্য প্রস্তুত।`
        : 'অন্তত ২টি প্রশ্ন ও উত্তর লিখলে গুগল সার্চে ড্রপডাউন রিচ স্নিপেট পাওয়া যাবে।'
    });

    return {
      totalScore: Math.min(100, Math.round(score)),
      items
    };
  }, [
    title,
    subtitle,
    summary,
    citationArabic,
    citationBengali,
    keyTakeaways,
    contentSections,
    references,
    featuredImage,
    tags,
    wordCount,
    faqs
  ]);

  const targetUrl = `${SITE_URL}/${sectionSlug || 'section'}/${categorySlug || 'category'}/${
    articleSlug || 'article-slug'
  }/`;

  const ogImageUrl = `${SITE_URL}/og/${sectionSlug || 'default'}.png`;

  return (
    <div className="space-y-6">
      {/* 1. TOP SCORE METER BANNER */}
      <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#B85D19]" />
            <h3 className="font-editorial text-lg font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
              লাইভ এসইও ও গুগল ডিসকভার কোয়ালিটি স্কোর
            </h3>
          </div>
          <p className="text-xs text-[#6E7571] dark:text-[#9BA39F]">
            গুগল র‍্যাঙ্কিং অ্যালগরিদম ও নির্ভরযোগ্য দ্বীনি গবেষণার মানদণ্ডে রিয়েল-টাইম মূল্যায়ন।
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                audit.totalScore >= 85
                  ? 'text-[#0B4F3B] dark:text-[#4CC39A]'
                  : audit.totalScore >= 65
                  ? 'text-[#B85D19]'
                  : 'text-[#DC2626]'
              }`}
            >
              {toBengaliDigits(audit.totalScore)} / ১০০
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6E7571]">
              {audit.totalScore >= 85
                ? '✓ গুগল ডিসকভার রেডি (Excellent)'
                : audit.totalScore >= 65
                ? '• ভালো মান (Good Progress)'
                : '⚠ আরও উন্নতি প্রয়োজন (Needs Work)'}
            </span>
          </div>

          <div className="w-16 h-16 rounded-full border-4 border-[#141615] flex items-center justify-center p-1 bg-[#FAF8F5] dark:bg-[#232F2B]">
            <span className="text-sm font-bold font-mono text-[#0B4F3B] dark:text-[#4CC39A]">
              {audit.totalScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. GOOGLE SERP SNIPPET SIMULATOR */}
      <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] space-y-3">
        <div className="flex items-center justify-between border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
          <span className="text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#B85D19]" />
            <span>গুগল সার্চ রেজাল্ট স্নিপেট প্রিভিউ (Google Search Simulation)</span>
          </span>
          <div className="flex items-center gap-1 bg-[#FAF8F5] dark:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] p-0.5">
            <button
              type="button"
              onClick={() => setDevicePreview('desktop')}
              className={`p-1 text-xs ${
                devicePreview === 'desktop' ? 'bg-[#0B4F3B] text-white' : 'text-[#6E7571]'
              }`}
              title="ডেস্কটপ ভিউ"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevicePreview('mobile')}
              className={`p-1 text-xs ${
                devicePreview === 'mobile' ? 'bg-[#0B4F3B] text-white' : 'text-[#6E7571]'
              }`}
              title="মোবাইল ভিউ"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* GOOGLE RESULT CARD */}
        <div
          className={`p-4 bg-[#FFFFFF] border border-[#DCD7CD] rounded-md font-sans text-left space-y-1.5 ${
            devicePreview === 'mobile' ? 'max-w-sm mx-auto' : ''
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <div className="w-5 h-5 rounded-full bg-[#0B4F3B] text-white flex items-center justify-center font-bold text-[10px]">
              ই
            </div>
            <div className="truncate">
              <span className="text-xs text-[#202124] font-medium block leading-none">
                ইসলাম — islam.org.bd
              </span>
              <span className="text-[11px] text-[#4d5156] truncate block leading-none mt-0.5">
                {targetUrl}
              </span>
            </div>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <h4 className="text-[#1a0dab] hover:underline text-base sm:text-lg font-medium leading-snug cursor-pointer line-clamp-2">
                {title || 'প্রবন্ধের পূর্ণাঙ্গ শিরোনাম এখানে প্রদর্শিত হবে'}
              </h4>
              <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                {summary ||
                  subtitle ||
                  'প্রবন্ধের ভূমিকা ও মূল সারসংক্ষেপ এখানে পাঠকদের উদ্দেশ্যে প্রদর্শিত হবে, যা ক্লিকে আকৃষ্ট করবে...'}
              </p>
            </div>
            {featuredImage?.url && (
              <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden border border-[#DCD7CD] mt-0.5">
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || 'সার্চ ফলাফল প্রিভিউ'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. SOCIAL MEDIA 1200x630 OPEN GRAPH CARD PREVIEW */}
      <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] space-y-3">
        <div className="flex items-center justify-between border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
          <span className="text-xs font-bold text-[#B85D19] flex items-center gap-1.5">
            <Share2 className="w-4 h-4" />
            <span>ফেসবুক ও সোশ্যাল মিডিয়া প্রিভিউ (১২০০×৬৩০ কার্ড)</span>
          </span>
          <span className="text-[11px] text-[#6E7571]">OpenGraph Protocol</span>
        </div>

        <div className="max-w-md mx-auto border border-[#DCD7CD] dark:border-[#3B4D47] overflow-hidden bg-[#FAF8F5] dark:bg-[#232F2B] shadow-sm">
          {/* Visual banner representation */}
          <div className="aspect-[1200/630] bg-[#0B4F3B] p-5 flex flex-col justify-between text-white relative overflow-hidden">
            {featuredImage?.url && (
              <>
                <img
                  src={featuredImage.url}
                  alt={featuredImage.alt || title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
              </>
            )}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#B85D19]">
                {categoryName || 'ইসলামিক জ্ঞানকোষ'}
              </span>
              <span className="text-xs font-serif font-bold text-[#E8A86B]">اسلام</span>
            </div>
            <div className="relative z-10">
              <h5 className="font-editorial text-base sm:text-lg font-bold line-clamp-2 leading-tight drop-shadow-md">
                {title || 'প্রবন্ধের আকর্ষণীয় শিরোনাম'}
              </h5>
              <p className="text-[11px] text-[#D5E6DF] line-clamp-1 mt-1 font-medium drop-shadow-xs">
                {subtitle || 'প্রামাণ্য ও গবেষণাধর্মী ইসলামিক প্রবন্ধ'}
              </p>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#1F2926] border-t border-[#DCD7CD] dark:border-[#3B4D47] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6E7571] font-mono block">
              ISLAM.ORG.BD
            </span>
            <span className="text-xs font-bold text-[#141615] dark:text-[#E8E6E1] line-clamp-1 block">
              {title || 'শিরোনাম'}
            </span>
            <p className="text-[11px] text-[#6E7571] dark:text-[#9BA39F] line-clamp-1">
              {summary || subtitle || 'সারসংক্ষেপ'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. DETAILED AUDIT CHECKLIST */}
      <div className="p-5 bg-white dark:bg-[#1A2421] border-2 border-[#141615] space-y-3">
        <span className="text-xs font-bold text-[#141615] dark:text-[#E8E6E1] block border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
          এসইও কোয়ালিটি চেকলিস্ট ও উন্নতির পরামর্শ:
        </span>
        <div className="space-y-2.5">
          {audit.items.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 border text-xs flex items-start gap-3 transition-colors ${
                item.passed
                  ? 'bg-[#E6F0EC] dark:bg-[#15332A] border-[#0B4F3B]/30'
                  : 'bg-[#FFF6E5] dark:bg-[#2B2118] border-[#B85D19]/30'
              }`}
            >
              {item.passed ? (
                <CheckCircle className="w-4 h-4 text-[#0B4F3B] dark:text-[#4CC39A] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#B85D19] shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#141615] dark:text-[#E8E6E1]">{item.label}</span>
                  <span className="font-mono text-[11px] font-bold">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E7571] dark:text-[#C2C8C5]">{item.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
