import type { Metadata } from 'next';
import Link from 'next/link';
import {
  SITE_URL,
  GEO_CONSTANTS,
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  BANGLADESH_DISTRICTS,
  DistrictGeoData,
} from '@/lib/seo';
import PrayerTimesAndHijriWidget from '@/components/PrayerTimesAndHijriWidget';
import IslamicGeometricEmblem from '@/components/IslamicGeometricEmblem';
import SiteFooter from '@/components/SiteFooter';
import { MapPin, Clock, Calendar, CheckCircle2, ChevronRight, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'আজকের নামাজের সময়সূচি ও হিজরি ক্যালেন্ডার ২০২৬ — ৬৪ জেলা | ইসলাম',
  description:
    'বাংলাদেশের ৬৪টি জেলার আজকের পাঁচ ওয়াক্ত সালাত (ফজর, যোহর, আসর, মাগরিব, ইশা), সাহরী, ইফতার ও তাহাজ্জুদের সঠিক সময়সূচি। ইসলামিক ফাউন্ডেশন বাংলাদেশ ভিত্তিক নির্ভুল হিসাব।',
  keywords: [
    'আজকের নামাজের সময়',
    'নামাজের সময়সূচি ঢাকা',
    'আজকের হিজরি তারিখ',
    'ইফতার ও সেহরির সময় ২০২৬',
    'সালাতের ওয়াক্ত বাংলাদেশ',
    'Prayer times Bangladesh',
    'Islamic Foundation prayer times',
  ],
  alternates: {
    canonical: `${SITE_URL}/prayer-times/`,
  },
  openGraph: {
    title: 'আজকের নামাজের সময়সূচি ও হিজরি ক্যালেন্ডার ২০২৬ — ৬৪ জেলা | ইসলাম',
    description:
      'বাংলাদেশের ৬৪ জেলার আজকের ৫ ওয়াক্ত সালাত, সাহরী ও ইফতারের সঠিক সময়সূচি। ইসলামিক ফাউন্ডেশন বাংলাদেশ ভিত্তিক নির্ভরযোগ্য হিসাব।',
    url: `${SITE_URL}/prayer-times/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
    images: [
      {
        url: `${SITE_URL}/og/prayer-times.png`,
        width: 1200,
        height: 630,
        alt: 'আজকের সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার ২০২৬ — ৬৪ জেলা | ইসলাম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'আজকের নামাজের সময়সূচি ও হিজরি ক্যালেন্ডার ২০২৬ — ৬৪ জেলা | ইসলাম',
    description: 'বাংলাদেশের ৬৪ জেলার আজকের ৫ ওয়াক্ত সালাত, সাহরী ও ইফতারের সঠিক সময়সূচি।',
    images: [`${SITE_URL}/og/prayer-times.png`],
  },
  other: {
    'geo.region': GEO_CONSTANTS.region,
    'geo.placename': GEO_CONSTANTS.placename,
    'geo.position': GEO_CONSTANTS.position,
    'ICBM': GEO_CONSTANTS.icbm,
  },
};

// Group districts by division
function getDistrictsByDivision(): Record<string, DistrictGeoData[]> {
  const grouped: Record<string, DistrictGeoData[]> = {};
  for (const district of BANGLADESH_DISTRICTS) {
    const div = district.divisionBangla;
    if (!grouped[div]) {
      grouped[div] = [];
    }
    grouped[div].push(district);
  }
  return grouped;
}

export default function PrayerTimesHubPage() {
  const groupedDistricts = getDistrictsByDivision();

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার', url: `${SITE_URL}/prayer-times/` },
  ]);

  const faqItems = [
    {
      question: 'বাংলাদেশের সালাতের সময়সূচি কোন পদ্ধতিতে গণনা করা হয়?',
      answer:
        'ইসলাম পোর্টাল বাংলাদেশের ইসলামিক ফাউন্ডেশন কর্তৃক নির্ধারিত মানদণ্ড এবং করাচি ইসলামিক সায়েন্সেস বিশ্ববিদ্যালয়ের ১৮ ডিগ্রি সৌরকোণ গণনাপদ্ধতি অনুসরণ করে। এতে ঢাকার মূল সময়ের সাথে প্রতিটি জেলার ভৌগোলিক দ্রাঘিমাংশভিত্তিক মিনিট সমন্বয় স্বয়ংক্রিয়ভাবে হিসাব করা হয়।',
    },
    {
      question: 'হানাফী ও শাফেয়ী আসরের ওয়াক্তের মধ্যে পার্থক্য কী?',
      answer:
        'জমহুর ওলামা (ইমাম শাফেয়ী, মালেক ও আহমদ)-এর মতে কোনো বস্তুর ছায়া তার মূল ছায়া বাদে একগুণ হলে আসরের ওয়াক্ত শুরু হয় (আসর আওয়াল ওয়াক্ত)। পক্ষান্তরে ইমাম আবূ হানীফা (রহ.)-এর প্রসিদ্ধ বর্ণনা অনুযায়ী ছায়া দ্বিগুণ হলে আসরের ওয়াক্ত শুরু হয়। ইসলাম পোর্টালে উভয় মাযহাব অনুযায়ী সময় দেখার সুবিধা রয়েছে।',
    },
    {
      question: 'সাহরীর শেষ সময় ও ফজরের ওয়াক্তের ব্যবধান কত?',
      answer:
        'সুভহে সাদিক বা ফজরের ওয়াক্ত শুরু হওয়ার সাথে সাথেই সাহরীর সময় শেষ হয়ে যায়। তবে সতর্কতামূলকভাবে সুবহে সাদিকের ৫ মিনিট পূর্বেই পানাহার বন্ধ করা মুস্তাহাব। ইসলাম পোর্টালের সময়সূচিতে সতর্কতামূলক সময় স্পষ্টভাবে উল্লেখ করা হয়েছে।',
    },
    {
      question: 'ইফতারের সঠিক সময় কখন শুরু হয়?',
      answer:
        'সূর্য সম্পূর্ণ অস্তমিত হওয়ার সাথে সাথেই ইফতারের সময় শুরু হয়, যা মাগরিবের ওয়াক্তের প্রারম্ভিক সময়। বিলম্বে ইফতার করা সুন্নাহ পরিপন্থী; সূর্যাস্তের নিশ্চয়তা পাওয়া মাত্রই ইফতার করা মুস্তাহাব।',
    },
  ];

  const faqJsonLd = getFaqJsonLd(faqItems);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141615]">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* TOP PRAYER TIME BAR */}
      <PrayerTimesAndHijriWidget />

      {/* MAIN CONTAINER */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* HERO BANNER */}
        <section className="bg-[#0B4F3B] text-[#FAF8F5] p-6 sm:p-10 border-2 border-[#141615] relative overflow-hidden shadow-[4px_4px_0px_#141615]">
          <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
            <IslamicGeometricEmblem size={240} primaryColor="#FAF8F5" accentColor="#FAF8F5" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 px-3 py-1 text-xs font-mono font-bold tracking-wider uppercase text-[#E8A86B]">
              <Compass className="w-4 h-4 text-[#E8A86B]" />
              <span>ইসলামিক ফাউন্ডেশন বাংলাদেশ মানদণ্ড</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              আজকের সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার ২০২৬
            </h1>

            <p className="text-sm sm:text-base text-[#FAF8F5]/85 leading-relaxed">
              পবিত্র কুরআনের নির্দেশ: <span className="font-editorial italic">"নিশ্চয়ই নির্ধারিত সময়ে সালাত কায়েম করা মুমিনদের ওপর ফরয।"</span> (সূরা আন-নিসা: ১০৩)। বাংলাদেশের ৮টি বিভাগ ও ৬৪টি জেলার প্রতিদিনের সঠিক ৫ ওয়াক্ত সালাত, সাহরী, ইফতার ও তাহাজ্জুদের সময়সূচি নিচে থেকে আপনার জেলা নির্বাচন করে জেনে নিন।
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-[#FAF8F5]/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4CC39A]" />
                ৬৪ জেলার ভৌগোলিক মিনিট সমন্বয়
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4CC39A]" />
                হানাফী ও শাফেয়ী আসরের ওয়াক্ত
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4CC39A]" />
                সরাসরি সূর্যাস্ত ও ইফতার সতর্কতা
              </span>
            </div>
          </div>
        </section>

        {/* 64 DISTRICTS DIRECTORY */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#141615] pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
                ভৌগোলিক ডিরেক্টরি
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B4F3B]">
                বাংলাদেশের ৬৪টি জেলা অনুযায়ী নামাজের সময়সূচি
              </h2>
            </div>
            <Link
              href="/"
              className="text-xs font-bold text-[#0B4F3B] hover:text-[#B85D19] flex items-center gap-1 underline underline-offset-4"
            >
              মূল পাতায় ফিরে যান
            </Link>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedDistricts).map(([division, districts]) => (
              <div
                key={division}
                className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 space-y-4 shadow-[3px_3px_0px_#141615]"
              >
                <div className="flex items-center gap-2 text-[#0B4F3B] border-b border-[#DCD7CD] pb-2">
                  <MapPin className="w-4 h-4 text-[#B85D19]" />
                  <h3 className="font-editorial text-lg sm:text-xl font-bold">
                    {division} বিভাগ ({districts.length}টি জেলা)
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {districts.map((d) => (
                    <Link
                      key={d.id}
                      href={`/prayer-times/${d.id}/`}
                      className="group p-3 bg-[#FAF8F5] hover:bg-[#0B4F3B] border border-[#141615] transition-all text-left flex flex-col justify-between"
                    >
                      <div className="font-editorial text-sm font-bold text-[#141615] group-hover:text-white transition-colors">
                        {d.nameBangla}
                      </div>
                      <div className="text-[11px] text-[#6E7571] group-hover:text-[#E8A86B] font-mono mt-1 flex items-center justify-between">
                        <span>{d.nameEnglish}</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="text-[10px] text-[#B85D19] group-hover:text-white/80 mt-1">
                        {d.prayerOffsetMinutes === 0
                          ? 'ঢাকার মূল সময়'
                          : d.prayerOffsetMinutes > 0
                          ? `ঢাকা +${d.prayerOffsetMinutes} মি.`
                          : `ঢাকা ${d.prayerOffsetMinutes} মি.`}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SCHOLARLY FAQ SECTION */}
        <section className="bg-[#FFFFFF] border-2 border-[#141615] p-6 sm:p-8 space-y-6 shadow-[3px_3px_0px_#141615]">
          <div className="border-b border-[#DCD7CD] pb-3">
            <span className="text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
              তাহকীক ও ফিকহী প্রশ্নোত্তর
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[#0B4F3B] mt-0.5">
              সালাতের ওয়াক্ত সম্পর্কিত জরুরি প্রশ্ন ও সমাধান
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="bg-[#FAF8F5] p-4 border border-[#DCD7CD] space-y-2 text-sm"
              >
                <h4 className="font-editorial text-base font-bold text-[#0B4F3B] flex items-start gap-2">
                  <span className="text-[#B85D19] font-mono font-bold">{index + 1}.</span>
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-[#4A504D] leading-relaxed pl-5">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* EDITORIAL SITE FOOTER */}
      <SiteFooter />
    </div>
  );
}
