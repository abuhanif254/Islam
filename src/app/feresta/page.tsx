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
  },
};

export default function DedicatedFerestaPage() {
  const section = getSectionById('angels')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'ফেরেস্তা', url: `${SITE_URL}/angels/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IslamPortal initialSectionSlug="angels" />
    </>
  );
}
