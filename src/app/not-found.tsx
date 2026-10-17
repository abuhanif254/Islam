import Link from 'next/link';
import { IslamicGeometricEmblem } from '@/components/IslamicGeometricEmblem';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141615] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="p-8 bg-[#FFFFFF] border-2 border-[#141615] max-w-lg shadow-xl space-y-5">
        <div className="flex justify-center">
          <IslamicGeometricEmblem size={56} />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-[#B85D19]">
            ত্রুটি ৪০৪ • পৃষ্ঠাটি পাওয়া যায়নি
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B]">
            পৃষ্ঠাটি বিদ্যমান নেই
          </h1>
        </div>
        <p className="text-sm text-[#4A4F4C] leading-relaxed">
          আপনি যে প্রবন্ধ বা বিভাগটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি পরিবর্তিত হয়েছে।
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-sm font-bold border border-[#141615] transition-colors"
          >
            ← মূল পোর্টাল ও ম্যাগাজিনে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}
