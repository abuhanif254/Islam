import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'কোরআন (القرآن الكريم) — অবতীর্ণ গ্রন্থ ও পূর্ণাঙ্গ তাফসীর',
  description:
    'পবিত্র কুরআনের ১১৪টি সূরার প্রামাণ্য তাফসীর, শানে নুযূল, ব্যাকরণ, ঐতিহাসিক প্রেক্ষাপট ও সমকালীন প্রাসঙ্গিকতা। তাফসীরে ইবনে কাসীর, তাবারী ও কুরতুবীর নির্যাস।',
  alternates: {
    canonical: `${SITE_URL}/quran/`,
  },
  openGraph: {
    title: 'কোরআন (القرآن الكريم) — অবতীর্ণ গ্রন্থ ও পূর্ণাঙ্গ তাফসীর | ইসলাম',
    description:
      'সূরা আল-ফাতিহা থেকে শুরু করে নির্বাচিত ও ফযীলতপূর্ণ সূরাসমূহের ধারাবাহিক তাফসীর ও জীবনমুখী শিক্ষা।',
    url: `${SITE_URL}/quran/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
    images: [
      {
        url: `${SITE_URL}/og/quran.png`,
        width: 1200,
        height: 630,
        alt: 'কোরআন (القرآن الكريم) — অবতীর্ণ গ্রন্থ ও পূর্ণাঙ্গ তাফসীর | ইসলাম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'কোরআন (القرآن الكريم) — অবতীর্ণ গ্রন্থ ও পূর্ণাঙ্গ তাফসীর | ইসলাম',
    description: 'সূরা আল-ফাতিহা থেকে শুরু করে নির্বাচিত ও ফযীলতপূর্ণ সূরাসমূহের ধারাবাহিক তাফসীর ও জীবনমুখী শিক্ষা।',
    images: [`${SITE_URL}/og/quran.png`],
  },
  keywords: [
    'কোরআন',
    'কুরআন',
    'তাফসীর',
    'সূরা ফাতিহা',
    'সূরা বাকারাহ',
    'আয়াতুল কুরসী',
    'তাফসীর ইবনে কাসীর',
    'Quran Bangla',
  ],
};

export default function DedicatedQuranPage() {
  const section = getSectionById('quran')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'কোরআন', url: `${SITE_URL}/quran/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'কোরআন — প্রামাণ্য তাফসীর ও সূরা সংকলন',
    description: section.description,
    url: `${SITE_URL}/quran/`,
    image: `${SITE_URL}/og/quran.png`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/quran/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="quran" />
    </>
  );
}
