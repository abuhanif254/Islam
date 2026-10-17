import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'সাহাবী (الصحابة الكرام رضي الله عنهم) — সত্যের মাপকাঠি ও সোনালী প্রজন্ম',
  description:
    'খুলাফায়ে রাশেদীন, আশারায়ে মুবাশশারাহ এবং মুহাজির ও আনসার সাহাবায়ে কেরামের ঈমানদীপ্ত আত্মত্যাগ, বিচারব্যবস্থা, রাষ্ট্র পরিচালনা ও ইসলামের বিজয়গাথা।',
  alternates: {
    canonical: `${SITE_URL}/sahabi/`,
  },
  openGraph: {
    title: 'সাহাবী (الصحابة الكرام رضي الله عنهم) — সোনালী প্রজন্ম | ইসলাম',
    description:
      'হযরত আবু বকর, ওমর, উসমান, আলী (রা.)-সহ মহান সাহাবায়ে কিরামের প্রামাণ্য ইতিহাস।',
    url: `${SITE_URL}/sahabi/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
  },
  keywords: [
    'সাহাবী',
    'সাহাবা',
    'আবু বকর',
    'ওমর ফারুক',
    'উসমান',
    'আলী',
    'বেলাল',
    'খালেদ বিন ওয়ালীদ',
    'উম্মাহাতুল মুমিনীন',
    'খুলাফায়ে রাশেদীন',
    'Companions of Prophet',
  ],
};

export default function DedicatedSahabiPage() {
  const section = getSectionById('sahabi')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'সাহাবী', url: `${SITE_URL}/sahabi/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'সাহাবী — সোনালী প্রজন্ম ও সাহাবায়ে কেরামের ইতিহাস',
    description: section.description,
    url: `${SITE_URL}/sahabi/`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/sahabi/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="sahabi" />
    </>
  );
}
