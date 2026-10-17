import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'ফেরেস্তা (الملائكة الكرام) — নূরানী সৃষ্টি ও দায়িত্বের বিবরণ',
  description:
    'মহান আল্লাহর নূরানী সৃষ্টি ফেরেশতাগণের অস্তিত্ব, চার প্রধান ফেরেশতা ও তাদের দায়িত্ব, কিরামান কাতিবীন এবং মানুষের জীবনে তাদের প্রভাব বিষয়ক প্রামাণ্য বিশ্লেষণ।',
  alternates: {
    canonical: `${SITE_URL}/angels/`,
  },
  openGraph: {
    title: 'ফেরেস্তা (الملائكة الكرام) — নূরানী সৃষ্টি ও দায়িত্ব | ইসলাম',
    description:
      'ফেরেশতাগণের পরিচয়, মর্যাদা ও ওহী পৌঁছানোর দায়িত্বসহ সার্বিক আলোচনা।',
    url: `${SITE_URL}/angels/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
    images: [
      {
        url: `${SITE_URL}/og/angels.png`,
        width: 1200,
        height: 630,
        alt: 'ফেরেস্তা (الملائكة الكرام) — নূরানী সৃষ্টি ও দায়িত্ব | ইসলাম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ফেরেস্তা (الملائكة الكرام) — নূরানী সৃষ্টি ও দায়িত্ব | ইসলাম',
    description: 'ফেরেশতাগণের পরিচয়, মর্যাদা ও ওহী পৌঁছানোর দায়িত্বসহ সার্বিক আলোচনা।',
    images: [`${SITE_URL}/og/angels.png`],
  },
  keywords: [
    'ফেরেস্তা',
    'ফেরেশতা',
    'জিবরাঈল',
    'মীকাঈল',
    'ইসরাফীল',
    'মালাকুল মাউত',
    'কিরামান কাতিবীন',
    'Angels in Islam',
  ],
};

export default function DedicatedAngelsPage() {
  const section = getSectionById('angels')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'ফেরেস্তা', url: `${SITE_URL}/angels/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ফেরেস্তা — নূরানী সৃষ্টি ও দায়িত্বের বিশ্বকোষ',
    description: section.description,
    url: `${SITE_URL}/angels/`,
    image: `${SITE_URL}/og/angels.png`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/angels/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="angels" />
    </>
  );
}
