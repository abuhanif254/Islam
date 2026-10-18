'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Download,
  Share2,
  Sparkles,
  Check,
  Image as ImageIcon,
  Palette,
  Maximize2
} from 'lucide-react';
import { Article, CitationBox } from '@/types';
import { SITE_URL } from '@/lib/seo';

interface SocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  sectionName: string;
  categoryName: string;
}

export type CardRatio = 'square' | 'landscape';
export type CardTheme = 'emerald' | 'dark' | 'paper';

export default function SocialCardModal({
  isOpen,
  onClose,
  article,
  sectionName,
  categoryName
}: SocialCardModalProps) {
  const [ratio, setRatio] = useState<CardRatio>('square');
  const [theme, setTheme] = useState<CardTheme>('emerald');
  const [contentChoice, setContentChoice] = useState<'citation' | 'summary' | 'custom'>('citation');
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Redraw Canvas whenever parameters change
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = ratio === 'square' ? 1080 : 1200;
    const height = ratio === 'square' ? 1080 : 630;
    canvas.width = width;
    canvas.height = height;

    // Theme Colors
    let bgColor = '#0B4F3B';
    let borderColor = '#E8A86B';
    let textPrimary = '#FFFFFF';
    let textSecondary = '#D5E6DF';
    let accentColor = '#E8A86B';
    let badgeBg = '#B85D19';

    if (theme === 'dark') {
      bgColor = '#141615';
      borderColor = '#0B4F3B';
      textPrimary = '#FFFFFF';
      textSecondary = '#C2C8C5';
      accentColor = '#E8A86B';
      badgeBg = '#0B4F3B';
    } else if (theme === 'paper') {
      bgColor = '#FAF8F5';
      borderColor = '#0B4F3B';
      textPrimary = '#141615';
      textSecondary = '#4A4F4C';
      accentColor = '#B85D19';
      badgeBg = '#0B4F3B';
    }

    // 1. Background Fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Double Border
    const padding = 36;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

    ctx.lineWidth = 1.5;
    ctx.strokeRect(padding + 8, padding + 8, width - (padding + 8) * 2, height - (padding + 8) * 2);

    // 3. Top Header: Category & Portal Name
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = textSecondary;
    ctx.textAlign = 'left';
    ctx.fillText(`${sectionName} • ${categoryName}`, padding + 28, padding + 48);

    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 24px "Amiri", "Traditional Arabic", serif';
    ctx.fillText('ইসলাম — പ്രামাণ্য ডিজিটাল বিশ্বকোষ', width - padding - 28, padding + 48);

    // Divider Line
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding + 24, padding + 68);
    ctx.lineTo(width - padding - 24, padding + 68);
    ctx.stroke();

    // 4. Center Main Content
    let textToDraw = '';
    let arabicText = '';
    let refText = '';

    if (contentChoice === 'citation' && article.citation) {
      arabicText = article.citation.arabic || '';
      textToDraw = `“${article.citation.bengali || ''}”`;
      refText = `— ${article.citation.reference || article.title}`;
    } else if (contentChoice === 'summary') {
      textToDraw = article.summary || article.subtitle || '';
      refText = `— ${article.title}`;
    } else {
      textToDraw = customText || article.title;
      refText = `— ${article.title}`;
    }

    // Draw Arabic if available
    let currentY = padding + 130;
    if (arabicText && ratio === 'square') {
      ctx.textAlign = 'center';
      ctx.fillStyle = accentColor;
      ctx.font = 'bold 36px "Amiri", "Traditional Arabic", "Scheherazade New", serif';
      ctx.fillText(arabicText, width / 2, currentY);
      currentY += 60;
    }

    // Helper: Wrap and render Bengali Text
    const maxTextWidth = width - (padding + 50) * 2;
    const fontSize = ratio === 'square' ? 32 : 28;
    const lineHeight = fontSize * 1.55;
    ctx.font = `600 ${fontSize}px "SolaimanLipi", "Kalpurush", system-ui, sans-serif`;
    ctx.fillStyle = textPrimary;
    ctx.textAlign = 'center';

    const words = textToDraw.split(' ');
    let currentLine = '';
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && i > 0) {
        lines.push(currentLine.trim());
        currentLine = words[i] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    // Center vertical alignment calculation
    const totalBlockHeight = lines.length * lineHeight;
    const targetMiddle = (height - currentY - 140) / 2 + currentY;
    let startY = Math.max(currentY + 20, targetMiddle - totalBlockHeight / 2);

    for (const line of lines) {
      ctx.fillText(line, width / 2, startY);
      startY += lineHeight;
    }

    // Draw Reference Attribution
    if (refText) {
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillStyle = accentColor;
      ctx.textAlign = 'center';
      ctx.fillText(refText, width / 2, startY + 36);
    }

    // 5. Bottom Footer Branding
    const footerY = height - padding - 36;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding + 24, footerY - 24);
    ctx.lineTo(width - padding - 24, footerY - 24);
    ctx.stroke();

    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = textSecondary;
    ctx.textAlign = 'left';
    ctx.fillText('ISLAM.ORG.BD', padding + 28, footerY + 8);

    ctx.font = 'normal 17px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = accentColor;
    ctx.fillText('প্রামাণ্য দ্বীনি দাওয়াহ ও তাহকীক বিশ্বকোষ', width - padding - 28, footerY + 8);
  }, [isOpen, ratio, theme, contentChoice, customText, article, sectionName, categoryName]);

  if (!isOpen) return null;

  // Download Handler
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `islam-quote-${article.slug || 'dawah'}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Web Share or Copy Link Handler
  const handleShare = async () => {
    const canonical = `${SITE_URL}/${article.slug || ''}`;
    const canvas = canvasRef.current;

    if (canvas && navigator.share && navigator.canShare) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          const file = new File([blob], `islam-dawah-${article.slug}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: article.title,
              text: `${article.title}\n${canonical}`,
              files: [file]
            });
            return;
          }
        } catch (e) {
          // fallback to native link share
        }
      });
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(
        `${article.title}\n\n${article.citation?.bengali || article.summary}\n\nসম্পূর্ণ পড়ুন: ${canonical}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141615]/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] dark:bg-[#171F1D] border-2 border-[#141615] w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="bg-[#0B4F3B] text-white p-4 flex items-center justify-between border-b-2 border-[#141615]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E8A86B]" />
            <div>
              <h3 className="font-editorial text-base sm:text-lg font-bold leading-tight">
                সোশ্যাল কোট ও দাওয়াহ কার্ড মেকার (Social Share Card Generator)
              </h3>
              <p className="text-[11px] text-[#D5E6DF]">
                আয়াত, হাদিস বা মূল উদ্ধৃতি দিয়ে ১-ক্লিকে ইনস্টাগ্রাম/ফেসবুক রেডি কার্ড তৈরি করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#083B2C] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY: 2 COLUMNS (CONTROLS & PREVIEW) */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          {/* LEFT: CONTROLS (5 COLS) */}
          <div className="md:col-span-5 space-y-4 text-xs font-bold text-[#141615] dark:text-[#E8E6E1]">
            {/* 1. Content Choice */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                ১. কার্ডের বিষয়বস্তু নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setContentChoice('citation')}
                  className={`p-2 border text-center transition-colors ${
                    contentChoice === 'citation'
                      ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                      : 'bg-white dark:bg-[#232F2B] text-[#141615] dark:text-[#E8E6E1] border-[#DCD7CD]'
                  }`}
                >
                  মূল উদ্ধৃতি / আয়াত
                </button>
                <button
                  type="button"
                  onClick={() => setContentChoice('summary')}
                  className={`p-2 border text-center transition-colors ${
                    contentChoice === 'summary'
                      ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                      : 'bg-white dark:bg-[#232F2B] text-[#141615] dark:text-[#E8E6E1] border-[#DCD7CD]'
                  }`}
                >
                  সারসংক্ষেপ ও শিক্ষা
                </button>
              </div>
            </div>

            {/* 2. Ratio Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                ২. ছবির অনুপাত (Aspect Ratio):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRatio('square')}
                  className={`p-2 border text-center transition-colors ${
                    ratio === 'square'
                      ? 'bg-[#B85D19] text-white border-[#B85D19]'
                      : 'bg-white dark:bg-[#232F2B] text-[#141615] dark:text-[#E8E6E1] border-[#DCD7CD]'
                  }`}
                >
                  ১:১ স্কয়ার (Instagram/WhatsApp)
                </button>
                <button
                  type="button"
                  onClick={() => setRatio('landscape')}
                  className={`p-2 border text-center transition-colors ${
                    ratio === 'landscape'
                      ? 'bg-[#B85D19] text-white border-[#B85D19]'
                      : 'bg-white dark:bg-[#232F2B] text-[#141615] dark:text-[#E8E6E1] border-[#DCD7CD]'
                  }`}
                >
                  ১৬:৯ ল্যান্ডস্কেপ (FB/Twitter)
                </button>
              </div>
            </div>

            {/* 3. Theme Palette */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                ৩. ইসলামিক কালার থিম (Color Theme):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('emerald')}
                  className={`p-2 border text-center transition-colors ${
                    theme === 'emerald'
                      ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
                      : 'bg-white dark:bg-[#232F2B] text-[#0B4F3B] border-[#DCD7CD]'
                  }`}
                >
                  সবুজ-সোনালী
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-2 border text-center transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#141615] text-white border-[#141615]'
                      : 'bg-white dark:bg-[#232F2B] text-[#141615] border-[#DCD7CD]'
                  }`}
                >
                  রয়্যাল ডার্ক
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('paper')}
                  className={`p-2 border text-center transition-colors ${
                    theme === 'paper'
                      ? 'bg-[#FAF8F5] text-[#0B4F3B] border-[#0B4F3B]'
                      : 'bg-white dark:bg-[#232F2B] text-[#6E7571] border-[#DCD7CD]'
                  }`}
                >
                  ক্লাসিক পেপার
                </button>
              </div>
            </div>

            {/* Watermark & Source Notice */}
            <div className="p-3 bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47] space-y-1 text-[11px] text-[#6E7571]">
              <span className="font-bold text-[#0B4F3B] dark:text-[#4CC39A] block">
                ✓ দ্বীনি দাওয়াহ নিশ্চয়তা
              </span>
              <p>
                প্রতিটি কার্ডে স্বয়ংক্রিয়ভাবে পবিত্র কুরআনের রেফারেন্স ও <code>islam.org.bd</code>-এর অফিশিয়াল ডিজিটাল সাইটেশন যুক্ত থাকবে।
              </p>
            </div>
          </div>

          {/* RIGHT: LIVE CANVAS PREVIEW (7 COLS) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center space-y-3">
            <div className="w-full flex items-center justify-center p-3 bg-black/10 dark:bg-black/30 border-2 border-dashed border-[#141615] rounded-xs overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto max-h-[380px] object-contain shadow-lg border border-black/20"
              />
            </div>
            <span className="text-[11px] text-[#6E7571] font-mono">
              রেজুলেশন: {ratio === 'square' ? '1080 × 1080 px (Ultra HD)' : '1200 × 630 px (HD)'}
            </span>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#FFFFFF] dark:bg-[#1A2421] border-t border-[#DCD7CD] dark:border-[#2A3834] p-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold border border-[#DCD7CD] dark:border-[#3B4D47] text-[#6E7571] hover:text-[#141615]"
          >
            বন্ধ করুন
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-4 py-2 bg-[#FAF8F5] dark:bg-[#232F2B] hover:bg-[#F2EFE9] border border-[#141615] text-[#141615] dark:text-[#E8E6E1] text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#0B4F3B]" />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#B85D19]" />
                  <span>শেয়ার করুন</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold border border-[#141615] flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>ছবি ডাউনলোড করুন (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
