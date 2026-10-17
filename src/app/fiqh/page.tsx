import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'ফিকহ ও জীবন (الفقه والحياة) — প্রামাণ্য বিধান ও সমকালীন সমাধান',
  description:
    'দৈনন্দিন জীবনের ইবাদত (তাহরাত, সালাত, সাওম, যাকাত), অর্থনৈতিক মুয়ামালাত (হালাল বাণিজ্য, ইসলামিক ব্যাংকিং) এবং পারিবারিক ও সামাজিক জীবনের প্রামাণ্য ইসলামী বিধান।',
  alternates: {
    canonical: `${SITE_URL}/fiqh/`,
  },
  openGraph: {
    title: 'ফিকহ ও জীবন (الفقه والحياة) — প্রামাণ্য বিধান | ইসলাম',
    description:
      'সালাত, তাহরাত, হালাল অর্থনীতি ও পারিবারিক জীবনের শরীয়াহ নির্দেশিকা।',
    url: `${SITE_URL}/fiqh/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
  },
  keywords: [
    'ফিকহ',
    'সালাত',
    'তাহরাত',
    'খুশু',
    'ইসলামিক অর্থনীতি',
    'হালাল বাণিজ্য',
    'পারিবারিক বিধান',
    'Fiqh in Islam',
  ],
};

export default function DedicatedFiqhPage() {
  const section = getSectionById('fiqh')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'ফিকহ ও জীবন', url: `${SITE_URL}/fiqh/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ফিকহ ও জীবন — প্রামাণ্য বিধান ও সমকালীন সমাধান বিশ্বকোষ',
    description: section.description,
    url: `${SITE_URL}/fiqh/`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/fiqh/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="fiqh" />
    </>
  );
}
