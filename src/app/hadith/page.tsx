import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'হাদিস (الحديث النبوي الشريف) — সিহাহ সিত্তাহ ও উসূলুল হাদিস',
  description:
    'রাসূলুল্লাহ (সা.)-এর পবিত্র বাণী, কর্ম ও সম্মতি। সহীহ বুখারী, সহীহ মুসলিমসহ সিহাহ সিত্তার নির্বাচিত হাদিস, বিশদ তাহকীক, ফিকহী ব্যাখ্যা ও আধুনিক জীবনের পথনির্দেশ।',
  alternates: {
    canonical: `${SITE_URL}/hadith/`,
  },
  openGraph: {
    title: 'হাদিস (الحديث النبوي الشريف) — বিশুদ্ধ হাদিস সংকলন | ইসলাম',
    description:
      'সিহাহ সিত্তাহ ও বিশুদ্ধ হাদিস সংকলনের আলোকে নবীজির সুন্নাহর প্রামাণ্য পর্যালোচনা।',
    url: `${SITE_URL}/hadith/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
    images: [
      {
        url: `${SITE_URL}/og/hadith.png`,
        width: 1200,
        height: 630,
        alt: 'হাদিস (الحديث النبوي الشريف) — বিশুদ্ধ হাদিস সংকলন | ইসলাম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'হাদিস (الحديث النبوي الشريف) — বিশুদ্ধ হাদিস সংকলন | ইসলাম',
    description: 'সিহাহ সিত্তাহ ও বিশুদ্ধ হাদিস সংকলনের আলোকে নবীজির সুন্নাহর প্রামাণ্য পর্যালোচনা।',
    images: [`${SITE_URL}/og/hadith.png`],
  },
  keywords: [
    'হাদিস',
    'হাদীস',
    'সহীহ বুখারী',
    'সহীহ মুসলিম',
    'আবু দাউদ',
    'তিরমিযী',
    'রিয়াদুস সালেহীন',
    'ইন্নামাল আমালু বিন-নিয়্যাত',
    'Hadith Bangla',
  ],
};

export default function DedicatedHadithPage() {
  const section = getSectionById('hadith')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'হাদিস', url: `${SITE_URL}/hadith/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'হাদিস — সিহাহ সিত্তাহ ও উসূলুল হাদিস বিশ্বকোষ',
    description: section.description,
    url: `${SITE_URL}/hadith/`,
    image: `${SITE_URL}/og/hadith.png`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/hadith/${cat.slug}/`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <IslamPortal initialSectionSlug="hadith" />
    </>
  );
}
