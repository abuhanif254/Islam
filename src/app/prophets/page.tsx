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
    title: 'নবী (قصص الأنبياء والمرسلিন) — নবী ও রাসূলগণের সিরাত | ইসলাম',
    description:
      'রাসূলুল্লাহ (সা.)-এর সিরাত ও শ্রেষ্ঠ ৫ উলুল আযম রাসূলের প্রামাণ্য ইতিহাস।',
    url: `${SITE_URL}/prophets/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
    images: [
      {
        url: `${SITE_URL}/og/prophets.png`,
        width: 1200,
        height: 630,
        alt: 'নবী (قصص الأنبياء والمرسلين) — নবী ও রাসূলগণের সিরাত | ইসলাম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'নবী (قصص الأنبياء والمرسلين) — নবী ও রাসূলগণের সিরাত | ইসলাম',
    description: 'রাসূলুল্লাহ (সা.)-এর সিরাত ও শ্রেষ্ঠ ৫ উলুল আযম রাসূলের প্রামাণ্য ইতিহাস।',
    images: [`${SITE_URL}/og/prophets.png`],
  },
  keywords: [
    'নবী',
    'রাসূল',
    'মুহাম্মদ সাঃ',
    'ইবরাহীম আঃ',
    'মূসা আঃ',
    'ঈসা আঃ',
    'নূহ আঃ',
    'মদিনার সনদ',
    'কাসাসুল আম্বিয়া',
    'Prophets in Islam',
  ],
};

export default function DedicatedProphetsPage() {
  const section = getSectionById('prophets')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'নবী', url: `${SITE_URL}/prophets/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'নবী — আম্বিয়ায়ে কেরামের প্রামাণ্য ইতিহাস ও সিরাত',
    description: section.description,
    url: `${SITE_URL}/prophets/`,
    image: `${SITE_URL}/og/prophets.png`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/prophets/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="prophets" />
    </>
  );
}
