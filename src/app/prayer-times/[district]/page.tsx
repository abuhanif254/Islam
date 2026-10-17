import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  SITE_URL,
  getBreadcrumbJsonLd,
  getFaqJsonLd,
  getDistrictPrayerTimesJsonLd,
  BANGLADESH_DISTRICTS,
  DistrictGeoData,
} from '@/lib/seo';
import { calculatePrayerTimes, toBengaliDigits, DayPrayerSchedule } from '@/lib/prayer-times';
import { getHijriDate } from '@/lib/hijri-calendar';
import PrayerTimesAndHijriWidget from '@/components/PrayerTimesAndHijriWidget';
import IslamicGeometricEmblem from '@/components/IslamicGeometricEmblem';
import {
  MapPin,
  Clock,
  Calendar,
  Compass,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ArrowLeft,
} from 'lucide-react';

export function generateStaticParams() {
  return BANGLADESH_DISTRICTS.map((d) => ({
    district: d.id,
  }));
}

function getDistrictData(id: string): DistrictGeoData | undefined {
  return BANGLADESH_DISTRICTS.find(
    (d) => d.id === id || d.id === id.toLowerCase()
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>;
}): Promise<Metadata> {
  const { district: districtId } = await params;
  const district = getDistrictData(districtId);

  if (!district) {
    return {
      title: 'জেলা পাওয়া যায়নি | ইসলাম',
    };
  }

  const canonicalUrl = `${SITE_URL}/prayer-times/${district.id}/`;
  const title = `আজকের নামাজের সময়সূচি — ${district.nameBangla} (${district.nameEnglish}) ২০২৬ | ইসলাম`;
  const description = `${district.nameBangla} জেলার আজকের ৫ ওয়াক্ত সালাত (ফজর, যোহর, আসর, মাগরিব, ইশা), সাহরী, ইফতার ও তাহাজ্জুদের সঠিক সময়সূচি। ইসলামিক ফাউন্ডেশন বাংলাদেশ ভিত্তিক নির্ভুল হিসাব।`;

  return {
    title,
    description,
    keywords: [
      `আজকের নামাজের সময় ${district.nameBangla}`,
      `নামাজের সময়সূচি ${district.nameBangla}`,
      `ইফতার ও সেহরির সময় ${district.nameBangla} ২০২৬`,
      `ফজরের শেষ সময় ${district.nameBangla}`,
      `Prayer times in ${district.nameEnglish}`,
      `${district.nameBangla} জেলা সালাত`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: 'bn_BD',
      siteName: 'ইসলাম',
    },
    other: {
      'geo.region': 'BD',
      'geo.placename': `${district.nameEnglish}, Bangladesh`,
      'geo.position': `${district.lat};${district.lng}`,
      'ICBM': `${district.lat}, ${district.lng}`,
    },
  };
}

export default async function DistrictPrayerTimesPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
  const { district: districtId } = await params;
  const district = getDistrictData(districtId);

  if (!district) {
    notFound();
  }

  const today = new Date();
  const schedule: DayPrayerSchedule = calculatePrayerTimes(today, district.id, 'hanafi');
  const hijri = getHijriDate(today, 0);

  const dateStr = today.toISOString().split('T')[0];
  const districtJsonLd = getDistrictPrayerTimesJsonLd(district, dateStr);

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'সালাতের সময়সূচি', url: `${SITE_URL}/prayer-times/` },
    { name: `${district.nameBangla} জেলা`, url: `${SITE_URL}/prayer-times/${district.id}/` },
  ]);

  // District-specific FAQ for Google Rich Snippets
  const faqItems = [
    {
      question: `${district.nameBangla} জেলায় আজকের ফজরের শেষ সময় ও সূর্যোদয় কখন?`,
      answer: `${district.nameBangla} জেলায় আজ সাহরীর সতর্কতামূলক শেষ সময় ভোর ${schedule.sahriEnds} এবং সূর্যোদয় সকাল ${schedule.sunrise}।`,
    },
    {
      question: `${district.nameBangla} জেলায় আজকের ইফতার ও মাগরিবের ওয়াক্ত কখন শুরু হবে?`,
      answer: `${district.nameBangla} জেলায় আজ সূর্যাস্তের সাথে সাথে সন্ধ্যা ${schedule.iftar}-এ ইফতার ও মাগরিবের সালাতের ওয়াক্ত শুরু হবে।`,
    },
    {
      question: `${district.nameBangla} জেলায় আসরের হানাফী ও শাফেয়ী ওয়াক্তের সময় কত?`,
      answer: `${district.nameBangla} জেলায় আজ আসরের শাফেয়ী/জমহুর ওয়াক্ত বিকেল ${schedule.asrShafii} এবং হানাফী ওয়াক্ত বিকেল ${schedule.asrHanafi}-এ শুরু হবে।`,
    },
    {
      question: `${district.nameBangla} জেলার সাথে রাজধানী ঢাকার সালাতের সময়ের ব্যবধান কত?`,
      answer:
        district.prayerOffsetMinutes === 0
          ? `${district.nameBangla} জেলার সালাতের সময় এবং ঢাকার মূল সময় সম্পূর্ণ অভিন্ন।`
          : district.prayerOffsetMinutes > 0
          ? `${district.nameBangla} জেলার অবস্থান ঢাকার পশ্চিমে হওয়ায় এখানে ঢাকার মূল সময়ের সাথে +${toBengaliDigits(district.prayerOffsetMinutes)} মিনিট যোগ করতে হয়।`
          : `${district.nameBangla} জেলার অবস্থান ঢাকার পূর্বে হওয়ায় এখানে ঢাকার মূল সময় থেকে ${toBengaliDigits(Math.abs(district.prayerOffsetMinutes))} মিনিট আগে ওয়াক্ত শুরু হয়।`,
    },
  ];

  const faqJsonLd = getFaqJsonLd(faqItems);

  // Other districts in the same division
  const siblingDistricts = BANGLADESH_DISTRICTS.filter(
    (d) => d.divisionBangla === district.divisionBangla && d.id !== district.id
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141615]">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(districtJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* TOP PRAYER TIME BAR */}
      <PrayerTimesAndHijriWidget />

      {/* MAIN CONTAINER */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
        {/* BREADCRUMB & BACK NAVIGATION */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <nav className="flex items-center gap-1.5 text-[#6E7571]">
            <Link href="/" className="hover:text-[#0B4F3B] underline underline-offset-4">
              হোম
            </Link>
            <span>/</span>
            <Link href="/prayer-times/" className="hover:text-[#0B4F3B] underline underline-offset-4">
              সালাতের সময়সূচি
            </Link>
            <span>/</span>
            <span className="text-[#0B4F3B] font-bold">{district.nameBangla} জেলা</span>
          </nav>

          <Link
            href="/prayer-times/"
            className="inline-flex items-center gap-1 text-[#B85D19] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>সকল জেলা দেখুন</span>
          </Link>
        </div>

        {/* DISTRICT HERO BANNER */}
        <section className="bg-[#0B4F3B] text-[#FAF8F5] p-6 sm:p-10 border-2 border-[#141615] relative overflow-hidden shadow-[4px_4px_0px_#141615]">
          <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
            <IslamicGeometricEmblem size={220} primaryColor="#FAF8F5" accentColor="#FAF8F5" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E8A86B] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#E8A86B]" />
              <span>{district.divisionBangla} বিভাগ</span>
              <span>•</span>
              <span>
                {district.prayerOffsetMinutes === 0
                  ? 'ঢাকার মূল সময়'
                  : district.prayerOffsetMinutes > 0
                  ? `ঢাকা +${toBengaliDigits(district.prayerOffsetMinutes)} মিনিট`
                  : `ঢাকা -${toBengaliDigits(Math.abs(district.prayerOffsetMinutes))} মিনিট`}
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              আজকের সালাতের সময়সূচি — {district.nameBangla} জেলা
            </h1>

            <p className="text-xs sm:text-sm text-[#FAF8F5]/85">
              তারিখ: <span className="font-bold">{schedule.dateStr}</span> • হিজরি:{' '}
              <span className="font-bold">{hijri.fullDateBn}</span> ({hijri.fullDateAr})
            </p>
          </div>
        </section>

        {/* 5 WAQTS MAIN CARDS GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#141615] pb-2">
            <h2 className="font-editorial text-2xl font-bold text-[#0B4F3B]">
              পাঁচ ওয়াক্ত সালাতের সময়সূচি
            </h2>
            <span className="text-xs font-mono text-[#6E7571]">
              ইসলামিক ফাউন্ডেশন মানদণ্ড
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* FAJR */}
            <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-2 shadow-[3px_3px_0px_#141615]">
              <div className="flex items-center justify-between">
                <Sunrise className="w-5 h-5 text-[#B85D19]" />
                <span className="font-arabic text-sm text-[#6E7571]">الفجر</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#0B4F3B]">ফজর</h3>
              <div className="text-2xl font-black text-[#141615] font-mono tracking-tight">
                {schedule.fajr}
              </div>
              <p className="text-[11px] text-[#6E7571] pt-1 border-t border-[#DCD7CD]">
                সাহরী শেষ: <span className="font-bold text-[#B85D19]">{schedule.sahriEnds}</span>
              </p>
            </div>

            {/* DHUHR */}
            <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-2 shadow-[3px_3px_0px_#141615]">
              <div className="flex items-center justify-between">
                <Sun className="w-5 h-5 text-[#B85D19]" />
                <span className="font-arabic text-sm text-[#6E7571]">الظهر</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#0B4F3B]">যোহর</h3>
              <div className="text-2xl font-black text-[#141615] font-mono tracking-tight">
                {schedule.dhuhr}
              </div>
              <p className="text-[11px] text-[#6E7571] pt-1 border-t border-[#DCD7CD]">
                দ্বিপ্রহরের সূর্য ঢলে পড়ার পর
              </p>
            </div>

            {/* ASR */}
            <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-2 shadow-[3px_3px_0px_#141615]">
              <div className="flex items-center justify-between">
                <Sun className="w-5 h-5 text-[#B85D19]" />
                <span className="font-arabic text-sm text-[#6E7571]">العصر</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#0B4F3B]">আসর</h3>
              <div className="text-2xl font-black text-[#141615] font-mono tracking-tight">
                {schedule.asrHanafi}
              </div>
              <p className="text-[11px] text-[#6E7571] pt-1 border-t border-[#DCD7CD]">
                শাফেয়ী: <span className="font-bold">{schedule.asrShafii}</span>
              </p>
            </div>

            {/* MAGHRIB */}
            <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-2 shadow-[3px_3px_0px_#141615]">
              <div className="flex items-center justify-between">
                <Sunset className="w-5 h-5 text-[#B85D19]" />
                <span className="font-arabic text-sm text-[#6E7571]">المغرب</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#0B4F3B]">মাগরিব (ইফতার)</h3>
              <div className="text-2xl font-black text-[#B85D19] font-mono tracking-tight">
                {schedule.maghrib}
              </div>
              <p className="text-[11px] text-[#6E7571] pt-1 border-t border-[#DCD7CD]">
                সূর্যাস্তের তাৎক্ষণিক পর
              </p>
            </div>

            {/* ISHA */}
            <div className="bg-[#FFFFFF] border-2 border-[#141615] p-5 space-y-2 shadow-[3px_3px_0px_#141615]">
              <div className="flex items-center justify-between">
                <Moon className="w-5 h-5 text-[#B85D19]" />
                <span className="font-arabic text-sm text-[#6E7571]">العشاء</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#0B4F3B]">ইশা</h3>
              <div className="text-2xl font-black text-[#141615] font-mono tracking-tight">
                {schedule.isha}
              </div>
              <p className="text-[11px] text-[#6E7571] pt-1 border-t border-[#DCD7CD]">
                পশ্চিমাকাশে রক্তিম আভা মিলানোর পর
              </p>
            </div>
          </div>
        </section>

        {/* SUPPLEMENTARY TIMES BAR */}
        <section className="bg-[#FFFFFF] border-2 border-[#141615] p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center shadow-[3px_3px_0px_#141615]">
          <div className="p-3 bg-[#FAF8F5] border border-[#DCD7CD]">
            <div className="text-xs text-[#6E7571] font-semibold">সাহরীর সতর্কতামূলক শেষ</div>
            <div className="text-lg font-bold text-[#B85D19] mt-0.5">{schedule.sahriEnds}</div>
            <div className="text-[10px] text-[#6E7571]">ফজরের ৫ মিনিট পূর্বে</div>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#DCD7CD]">
            <div className="text-xs text-[#6E7571] font-semibold">সূর্যোদয় (ফজরের সমাপ্তি)</div>
            <div className="text-lg font-bold text-[#0B4F3B] mt-0.5">{schedule.sunrise}</div>
            <div className="text-[10px] text-[#6E7571]">সালাত নিষিদ্ধ সময়</div>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#DCD7CD]">
            <div className="text-xs text-[#6E7571] font-semibold">ইশরাক ও চাশত শুরু</div>
            <div className="text-lg font-bold text-[#0B4F3B] mt-0.5">{schedule.ishraq}</div>
            <div className="text-[10px] text-[#6E7571]">সূর্যোদয়ের ১৮ মিনিট পর</div>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#DCD7CD]">
            <div className="text-xs text-[#6E7571] font-semibold">তাহাজ্জুদের উত্তম সময়</div>
            <div className="text-lg font-bold text-[#B85D19] mt-0.5">রাত ১২:৩০ - {schedule.sahriEnds}</div>
            <div className="text-[10px] text-[#6E7571]">রাতের শেষ তৃতীয়াংশ</div>
          </div>
        </section>

        {/* SIBLING DISTRICTS LINKS MESH */}
        {siblingDistricts.length > 0 && (
          <section className="bg-[#FFFFFF] border-2 border-[#141615] p-6 space-y-4 shadow-[3px_3px_0px_#141615]">
            <h3 className="font-editorial text-lg font-bold text-[#0B4F3B] border-b border-[#DCD7CD] pb-2">
              {district.divisionBangla} বিভাগের অন্যান্য জেলার নামাজের সময়সূচি
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {siblingDistricts.map((s) => (
                <Link
                  key={s.id}
                  href={`/prayer-times/${s.id}/`}
                  className="p-2.5 bg-[#FAF8F5] hover:bg-[#0B4F3B] hover:text-white border border-[#DCD7CD] transition-colors text-xs font-bold flex items-center justify-between group"
                >
                  <span>{s.nameBangla}</span>
                  <ChevronRight className="w-3 h-3 text-[#B85D19] group-hover:text-[#E8A86B]" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* DISTRICT FAQ SECTION */}
        <section className="bg-[#FFFFFF] border-2 border-[#141615] p-6 sm:p-8 space-y-6 shadow-[3px_3px_0px_#141615]">
          <div className="border-b border-[#DCD7CD] pb-2">
            <span className="text-xs font-mono font-bold text-[#B85D19] uppercase tracking-wider">
              সচরাচর জিজ্ঞাসিত প্রশ্ন
            </span>
            <h3 className="font-editorial text-xl font-bold text-[#0B4F3B] mt-0.5">
              {district.nameBangla} জেলার সালাত সংক্রান্ত প্রশ্নোত্তর
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="bg-[#FAF8F5] p-4 border border-[#DCD7CD] space-y-1.5 text-xs">
                <h4 className="font-editorial text-sm font-bold text-[#0B4F3B]">
                  {idx + 1}. {faq.question}
                </h4>
                <p className="text-[#4A504D] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
