import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'নবী (قصص الأنبياء والمرسلين) — আম্বিয়ায়ে কেরামের প্রামাণ্য জীবনগাথা',
  description:
    'হযরত আদম (আ.) থেকে সর্বশ্রেষ্ঠ ও সর্বশেষ নবী মুহাম্মদ (সা.) পর্যন্ত আম্বিয়ায়ে কিরামের দাওয়াত, ত্যাগের ইতিহাস, অলৌকিক মুজিযা ও মানবজাতির জন্য চিরন্তন পথনির্দেশ।',
  alternates: {
    canonical: `${SITE_URL}/prophets/`,
  },
  openGraph: {
    title: 'নবী (قصص الأنبياء والمرسلين) — নবী ও রাসূলগণের সিরাত | ইসলাম',
    description:
      'রাসূলুল্লাহ (সা.)-এর সিরাত ও শ্রেষ্ঠ ৫ উলুল আযম রাসূলের প্রামাণ্য ইতিহাস।',
    url: `${SITE_URL}/prophets/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
  },
};

export default function DedicatedNabiPage() {
  const section = getSectionById('prophets')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'নবী', url: `${SITE_URL}/prophets/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IslamPortal initialSectionSlug="prophets" />
    </>
  );
}
