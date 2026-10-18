'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  X,
  ExternalLink,
  Trash2,
  Sparkles,
  Eye,
  AlertCircle,
  FileImage,
  RefreshCw,
  Search
} from 'lucide-react';
import { ArticleFeaturedImage } from '@/types';
import { ISLAMIC_IMAGE_PRESETS, IslamicImagePreset } from '@/data/islamic-presets';

interface ImageUploadManagerProps {
  value?: ArticleFeaturedImage;
  onChange: (image: ArticleFeaturedImage | undefined) => void;
  titleSuggestion?: string;
  label?: string;
  helperText?: string;
}

export default function ImageUploadManager({
  value,
  onChange,
  titleSuggestion = '',
  label = 'ফিচার্ড প্রচ্ছদ চিত্র (Featured Hero Image)',
  helperText = 'প্রবন্ধের শীর্ষে ও সোশ্যাল মিডিয়ায় প্রদর্শিত হবে (প্রস্তাবিত অনুপাত ১৬:৯ বা ১২০০×৬৩০)'
}: ImageUploadManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'link' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(value?.url || '');
  const [altInput, setAltInput] = useState(value?.alt || '');
  const [captionInput, setCaptionInput] = useState(value?.caption || '');
  const [sourceTitleInput, setSourceTitleInput] = useState(value?.sourceTitle || '');
  const [sourceUrlInput, setSourceUrlInput] = useState(value?.sourceUrl || '');

  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [presetSearch, setPresetSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal fields when value changes
  const currentImage = value?.url ? value : null;

  // Direct File Upload with Client-Side Canvas Compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('অনুগ্রহ করে একটি বৈধ ইমেজ ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Compress and resize to max 1600px width with 0.85 quality
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

            const newImg: ArticleFeaturedImage = {
              url: compressedDataUrl,
              alt: altInput || titleSuggestion || 'প্রবন্ধের প্রচ্ছদ চিত্র',
              caption: captionInput,
              sourceTitle: sourceTitleInput || 'লোকাল আপলোড',
              sourceUrl: sourceUrlInput
            };

            setUrlInput(compressedDataUrl);
            if (!altInput) setAltInput(newImg.alt);
            onChange(newImg);
          }
        } catch (err: any) {
          setUploadError('ইমেজ প্রসেসিং ব্যর্থ হয়েছে: ' + err.message);
        } finally {
          setIsCompressing(false);
        }
      };
      img.onerror = () => {
        setUploadError('ইমেজ লোড করতে সমস্যা হয়েছে।');
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('ফাইল পড়তে সমস্যা হয়েছে।');
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  // Apply Direct Link
  const handleApplyLink = () => {
    setUploadError(null);
    if (!urlInput.trim()) {
      setUploadError('অনুগ্রহ করে একটি বৈধ ইমেজ লিংক প্রদান করুন।');
      return;
    }

    const newImg: ArticleFeaturedImage = {
      url: urlInput.trim(),
      alt: altInput.trim() || titleSuggestion || 'প্রবন্ধের প্রচ্ছদ চিত্র',
      caption: captionInput.trim(),
      sourceTitle: sourceTitleInput.trim() || 'অনলাইন সংগ্রহ',
      sourceUrl: sourceUrlInput.trim()
    };

    onChange(newImg);
  };

  // Apply Preset
  const handleSelectPreset = (preset: IslamicImagePreset) => {
    setUrlInput(preset.url);
    setAltInput(preset.alt);
    setCaptionInput(preset.caption);
    setSourceTitleInput(preset.sourceTitle);
    setSourceUrlInput(preset.sourceUrl);

    onChange({
      url: preset.url,
      alt: preset.alt,
      caption: preset.caption,
      sourceTitle: preset.sourceTitle,
      sourceUrl: preset.sourceUrl
    });
  };

  // Update existing image metadata
  const handleMetadataChange = (
    field: keyof ArticleFeaturedImage,
    val: string
  ) => {
    if (!currentImage) return;
    const updated = { ...currentImage, [field]: val };
    onChange(updated);
  };

  // Remove image
  const handleRemoveImage = () => {
    setUrlInput('');
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter presets
  const filteredPresets = ISLAMIC_IMAGE_PRESETS.filter((p) => {
    if (!presetSearch.trim()) return true;
    const q = presetSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.alt.toLowerCase().includes(q) ||
      p.caption.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#1A2421] border-2 border-[#141615] p-4 sm:p-5 space-y-4 shadow-xs">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCD7CD] dark:border-[#2A3834] pb-2">
        <div>
          <span className="font-editorial text-sm font-bold text-[#0B4F3B] dark:text-[#4CC39A] flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#B85D19]" />
            <span>{label}</span>
          </span>
          <p className="text-[11px] text-[#6E7571]">{helperText}</p>
        </div>
        {currentImage && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-2.5 py-1 text-xs font-bold text-[#DC2626] hover:bg-[#FBEAE8] border border-[#DC2626]/40 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>ছবি অপসারণ</span>
          </button>
        )}
      </div>

      {uploadError && (
        <div className="p-3 bg-[#FBEAE8] border border-[#DC2626] text-xs text-[#DC2626] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* IF IMAGE IS SET: SHOW ACTIVE PREVIEW & METADATA CONTROLS */}
      {currentImage ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* IMAGE PREVIEW FRAME */}
          <div className="md:col-span-5 space-y-2">
            <div className="aspect-[16/9] w-full bg-[#141615] relative overflow-hidden border-2 border-[#141615] group">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-[#0B4F3B] text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                ফিচার্ড ইমেজ
              </div>
            </div>
            {currentImage.caption && (
              <p className="text-xs italic text-[#4A4F4C] dark:text-[#C2C8C5]">
                {currentImage.caption}
              </p>
            )}
            {currentImage.sourceTitle && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#6E7571]">
                <span>উৎস: {currentImage.sourceTitle}</span>
                {currentImage.sourceUrl && (
                  <a
                    href={currentImage.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B4F3B] hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <span>[মূল লিংক]</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* METADATA EDITORS (Alt text, Caption, Source Link) */}
          <div className="md:col-span-7 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#141615] dark:text-[#E8E6E1]">
                  বিকল্প বিবরণ (Alt Text) — এসইও ও অ্যাক্সেসিবিলিটি *
                </label>
                {titleSuggestion && (
                  <button
                    type="button"
                    onClick={() => {
                      setAltInput(titleSuggestion);
                      handleMetadataChange('alt', titleSuggestion);
                    }}
                    className="text-[10px] text-[#0B4F3B] hover:underline font-bold"
                  >
                    শিরোনাম থেকে বসান
                  </button>
                )}
              </div>
              <input
                type="text"
                value={altInput}
                onChange={(e) => {
                  setAltInput(e.target.value);
                  handleMetadataChange('alt', e.target.value);
                }}
                placeholder="যেমন: পবিত্র মসজিদুল হারামের দৃশ্য"
                className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                ছবির ক্যাপশন (Caption)
              </label>
              <input
                type="text"
                value={captionInput}
                onChange={(e) => {
                  setCaptionInput(e.target.value);
                  handleMetadataChange('caption', e.target.value);
                }}
                placeholder="যেমন: পবিত্র কাবা শরীফ ও তাওয়াফরত মুমিনগণ"
                className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  উৎস বা ক্রেডিট শিরোনাম
                </label>
                <input
                  type="text"
                  value={sourceTitleInput}
                  onChange={(e) => {
                    setSourceTitleInput(e.target.value);
                    handleMetadataChange('sourceTitle', e.target.value);
                  }}
                  placeholder="যেমন: উইকিমিডিয়া কমন্স / নিজস্ব সংগ্রহ"
                  className="w-full p-2 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  মূল সোর্স লিংক (Source URL)
                </label>
                <input
                  type="url"
                  value={sourceUrlInput}
                  onChange={(e) => {
                    setSourceUrlInput(e.target.value);
                    handleMetadataChange('sourceUrl', e.target.value);
                  }}
                  placeholder="https://commons.wikimedia.org/..."
                  className="w-full p-2 text-xs font-mono bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* IF NO IMAGE: SHOW 3-METHOD SELECTOR */
        <div className="space-y-4">
          {/* METHOD TABS */}
          <div className="flex border-b border-[#DCD7CD] dark:border-[#2A3834] text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-3 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'border-[#0B4F3B] text-[#0B4F3B] dark:text-[#4CC39A]'
                  : 'border-transparent text-[#6E7571] hover:text-[#141615]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>১. সরাসরি ফাইল আপলোড</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`py-2 px-3 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'link'
                  ? 'border-[#0B4F3B] text-[#0B4F3B] dark:text-[#4CC39A]'
                  : 'border-transparent text-[#6E7571] hover:text-[#141615]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>২. সরাসরি ইমেজ লিংক</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 px-3 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'border-[#B85D19] text-[#B85D19]'
                  : 'border-transparent text-[#6E7571] hover:text-[#141615]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>৩. ইসলামিক প্রিসেট গ্যালারি</span>
            </button>
          </div>

          {/* TAB 1: DIRECT UPLOAD */}
          {activeTab === 'upload' && (
            <div className="p-6 border-2 border-dashed border-[#DCD7CD] dark:border-[#3B4D47] text-center bg-white dark:bg-[#1F2926] space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="article-featured-file"
              />
              <label
                htmlFor="article-featured-file"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold cursor-pointer shadow-sm transition-colors"
              >
                {isCompressing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ইমেজ অপ্টিমাইজ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                  </>
                )}
              </label>
              <p className="text-[11px] text-[#6E7571]">
                JPG, PNG বা WEBP ফাইল ড্রপ করুন। ব্রাউজারে স্বয়ংক্রিয়ভাবে কম্প্রেস ও অপ্টিমাইজ হয়ে যাবে।
              </p>
            </div>
          )}

          {/* TAB 2: DIRECT LINK */}
          {activeTab === 'link' && (
            <div className="p-4 bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47] space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#141615] dark:text-[#E8E6E1] mb-1">
                  সরাসরি ইমেজ ইউআরএল (Direct Image URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 p-2 text-xs font-mono bg-[#FAF8F5] dark:bg-[#171F1D] border border-[#DCD7CD] dark:border-[#3B4D47]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyLink}
                    className="px-4 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold shrink-0"
                  >
                    ছবিটি যুক্ত করুন
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-[#6E7571]">
                Unsplash, Wikimedia Commons, Pexels বা আপনার নিজস্ব হোস্টিংয়ের সরাসরি ইমেজ লিংক পেস্ট করুন।
              </p>
            </div>
          )}

          {/* TAB 3: CURATED PRESET GALLERY */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#6E7571]" />
                <input
                  type="text"
                  placeholder="কাবা, মসজিদ, কুরআন বা ক্যালিগ্রাফি লিখে প্রিসেট খুঁজুন..."
                  value={presetSearch}
                  onChange={(e) => setPresetSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                {filteredPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="group border border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#B85D19] bg-white dark:bg-[#1F2926] overflow-hidden text-left transition-all shadow-2xs hover:shadow-sm"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden bg-[#141615]">
                      <img
                        src={preset.url}
                        alt={preset.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2 space-y-0.5">
                      <span className="text-[11px] font-bold text-[#141615] dark:text-[#E8E6E1] line-clamp-1 block">
                        {preset.title}
                      </span>
                      <span className="text-[10px] text-[#6E7571] line-clamp-1 block">
                        {preset.sourceTitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
