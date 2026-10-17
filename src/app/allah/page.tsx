import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'আল্লাহ (الله جل جلاله) — তাওহীদ, আসমাউল হুসনা ও সিফাত বিশ্বকোষ',
  description:
    'মহান রাব্বুল আলামীনের পরিচয়, তাঁর একত্ববাদ (তাওহীদ), আসমাউল হুসনা (৯৯টি গুণবাচক নাম), সিফাত ও বিশুদ্ধ আকীদার প্রামাণ্য বিশ্বকোষ।',
  alternates: {
    canonical: `${SITE_URL}/allah/`,
  },
  openGraph: {
    title: 'আল্লাহ (الله جل جلاله) — তাওহীদ ও আসমাউল হুসনা | ইসলাম',
    description:
      'তাওহীদ, আসমাউল হুসনা (৯৯টি গুণবাচক নাম), সিফাত ও বিশুদ্ধ আকীদার প্রামাণ্য বিশ্বকোষ।',
    url: `${SITE_URL}/allah/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
    images: [
      {
        url: `${SITE_URL}/og/allah.png`,
        width: 1200,
        height: 630,
        alt: 'আল্লাহ (الله جل جلاله) — তাওহীদ ও আসমাউল হুসনা | ইসলাম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'আল্লাহ (الله جل جلاله) — তাওহীদ ও আসমাউল হুসনা | ইসলাম',
    description: 'তাওহীদ, আসমাউল হুসনা (৯৯টি গুণবাচক নাম), সিফাত ও বিশুদ্ধ আকীদার প্রামাণ্য বিশ্বকোষ।',
    images: [`${SITE_URL}/og/allah.png`],
  },
  keywords: [
    'আল্লাহ',
    'তাওহীদ',
    'আসমাউল হুসনা',
    '৯৯ নাম',
    'আর-রাহমান',
    'সিফাত',
    'আকীদা',
    'আল্লাহর পরিচয়',
  ],
};

export default function DedicatedAllahPage() {
  const section = getSectionById('allah')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'আল্লাহ', url: `${SITE_URL}/allah/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'আল্লাহ — তাওহীদ ও আসমাউল হুসনা বিশ্বকোষ',
    description: section.description,
    url: `${SITE_URL}/allah/`,
    image: `${SITE_URL}/og/allah.png`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/allah/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="allah" />
    </>
  );
}
