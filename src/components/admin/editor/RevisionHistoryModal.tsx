'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Download,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Clock,
  FileCode
} from 'lucide-react';
import { toBengaliDigits } from '@/lib/prayer-times';

export interface ArticleSnapshot {
  id: string;
  savedAt: string;
  timestamp: number;
  title: string;
  wordCount: number;
  data: any;
}

interface RevisionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  currentArticleData: any;
  onRestoreSnapshot: (data: any) => void;
}

export default function RevisionHistoryModal({
  isOpen,
  onClose,
  articleId,
  currentArticleData,
  onRestoreSnapshot
}: RevisionHistoryModalProps) {
  const [snapshots, setSnapshots] = useState<ArticleSnapshot[]>([]);
  const [copiedMd, setCopiedMd] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const storageKey = `islam_revisions_${articleId || 'draft'}`;

  // Load snapshots from localStorage
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSnapshots(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load revisions', e);
    }
  }, [isOpen, storageKey]);

  if (!isOpen) return null;

  // Save current state as manual snapshot
  const handleCreateSnapshot = () => {
    const newSnapshot: ArticleSnapshot = {
      id: 'snap-' + Date.now(),
      savedAt: new Date().toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      timestamp: Date.now(),
      title: currentArticleData.title || 'শিরোনামহীন স্ন্যাপশট',
      wordCount: currentArticleData.bodyLength || 0,
      data: currentArticleData
    };

    const updated = [newSnapshot, ...snapshots.slice(0, 9)];
    setSnapshots(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  // Restore snapshot
  const handleRestore = (snap: ArticleSnapshot) => {
    if (confirm(`আপনি কি "${snap.savedAt}" এর সংস্করণে ফিরে যেতে চান? বর্তমান অসংরক্ষিত তথ্য প্রতিস্থাপিত হবে।`)) {
      onRestoreSnapshot(snap.data);
      onClose();
    }
  };

  // Download Article JSON
  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentArticleData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `islam-article-${currentArticleData.slug || 'draft'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Upload Article JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (parsed.title || parsed.contentSections || parsed.content_sections)) {
          onRestoreSnapshot(parsed);
          onClose();
        } else {
          setImportError('ফাইলের ফরম্যাট সঠিক নয়। অনুগ্রহ করে একটি বৈধ আর্টিকেল JSON ফাইল আপলোড করুন।');
        }
      } catch (err: any) {
        setImportError('JSON ফাইল পার্স করতে সমস্যা হয়েছে: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Copy Full Markdown
  const handleCopyMarkdown = () => {
    let md = `# ${currentArticleData.title || 'শিরোনামহীন'}\n\n`;
    if (currentArticleData.subtitle) {
      md += `*${currentArticleData.subtitle}*\n\n`;
    }
    if (currentArticleData.citation?.arabic) {
      md += `> **${currentArticleData.citation.arabic}**\n>\n`;
      md += `> *উচ্চারণ:* ${currentArticleData.citation.transliteration || ''}\n>\n`;
      md += `> *অনুবাদ:* "${currentArticleData.citation.bengali || ''}"\n>\n`;
      md += `> — ${currentArticleData.citation.reference || ''}\n\n`;
    }
    if (currentArticleData.summary) {
      md += `### সারসংক্ষেপ\n${currentArticleData.summary}\n\n`;
    }
    if (currentArticleData.keyTakeaways?.length) {
      md += `### মূল শিক্ষা ও সারসংক্ষেপ\n`;
      currentArticleData.keyTakeaways.forEach((t: string) => {
        md += `- ${t}\n`;
      });
      md += `\n`;
    }
    if (currentArticleData.contentSections?.length) {
      currentArticleData.contentSections.forEach((sec: any) => {
        md += `## ${sec.heading}\n\n${sec.body}\n\n`;
      });
    }
    if (currentArticleData.references?.length) {
      md += `### তথ্যসূত্র\n`;
      currentArticleData.references.forEach((r: string, idx: number) => {
        md += `${idx + 1}. ${r}\n`;
      });
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(md).then(() => {
        setCopiedMd(true);
        setTimeout(() => setCopiedMd(false), 2000);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#141615]/75 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] dark:bg-[#171F1D] border-2 border-[#141615] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#0B4F3B] text-white p-4 flex items-center justify-between border-b-2 border-[#141615]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#E8A86B]" />
            <h3 className="font-editorial text-lg font-bold">
              রিভিশন হিস্ট্রি ও ডাটা পোর্টাবিলিটি (Version & Export Studio)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-[#083B2C] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* EXPORT & IMPORT ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleDownloadJson}
              className="p-3 bg-white dark:bg-[#1F2926] border border-[#141615] hover:border-[#0B4F3B] hover:bg-[#E6F0EC] dark:hover:bg-[#15332A] flex items-center justify-center gap-2 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4 text-[#0B4F3B]" />
              <span>JSON ডাউনলোড</span>
            </button>

            <label className="p-3 bg-white dark:bg-[#1F2926] border border-[#141615] hover:border-[#B85D19] hover:bg-[#FFF6E5] dark:hover:bg-[#2B2118] flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer text-center">
              <Upload className="w-4 h-4 text-[#B85D19]" />
              <span>JSON আপলোড / রিস্টোর</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="p-3 bg-white dark:bg-[#1F2926] border border-[#141615] hover:border-[#0B4F3B] hover:bg-[#E6F0EC] dark:hover:bg-[#15332A] flex items-center justify-center gap-2 text-xs font-bold transition-colors"
            >
              {copiedMd ? (
                <>
                  <Check className="w-4 h-4 text-[#0B4F3B]" />
                  <span>ক্লিপবোর্ডে কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#0B4F3B]" />
                  <span>মার্কডাউন কপি করুন</span>
                </>
              )}
            </button>
          </div>

          {importError && (
            <div className="p-3 bg-[#FBEAE8] border border-[#DC2626] text-xs text-[#DC2626] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* MANUAL SNAPSHOT BUTTON */}
          <div className="flex items-center justify-between border-t border-[#DCD7CD] dark:border-[#2A3834] pt-4">
            <span className="text-xs font-bold text-[#141615] dark:text-[#E8E6E1]">
              পূর্ববর্তী সংরক্ষিত সংস্করণসমূহ (সর্বোচ্চ ১০টি)
            </span>
            <button
              type="button"
              onClick={handleCreateSnapshot}
              className="px-3 py-1.5 bg-[#0B4F3B] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>নতুন স্ন্যাপশট নিন</span>
            </button>
          </div>

          {/* SNAPSHOT TIMELINE LIST */}
          <div className="space-y-2">
            {snapshots.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6E7571] border border-dashed border-[#DCD7CD] dark:border-[#2A3834]">
                এখনো কোনো ঐতিহাসিক স্ন্যাপশট সংরক্ষিত নেই। উপরের "নতুন স্ন্যাপশট নিন" বোতামে ক্লিক করে সংস্করণ সেভ করতে পারেন।
              </div>
            ) : (
              snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3 bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#2A3834] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                        {snap.savedAt}
                      </span>
                      <span className="text-[10px] bg-[#FAF8F5] dark:bg-[#232F2B] px-1.5 py-0.5 border border-[#DCD7CD] dark:border-[#3B4D47] font-mono">
                        {toBengaliDigits(snap.wordCount)} অক্ষর
                      </span>
                    </div>
                    <span className="text-[#6E7571] dark:text-[#9BA39F] line-clamp-1">
                      {snap.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestore(snap)}
                    className="px-3 py-1 bg-[#FAF8F5] dark:bg-[#232F2B] hover:bg-[#E6F0EC] dark:hover:bg-[#15332A] border border-[#141615] text-[#0B4F3B] dark:text-[#4CC39A] font-bold flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>রোলব্যাক</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#FFFFFF] dark:bg-[#1A2421] border-t border-[#DCD7CD] dark:border-[#2A3834] p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-[#141615] text-white"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
