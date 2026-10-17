import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'জাহান্নাম (جهنم وعذابها) — কঠিন শাস্তির আবাস ও আত্মশুদ্ধির বিশ্বকোষ',
  description:
    'পবিত্র কুরআন ও সহীহ হাদিসের প্রামাণ্য বর্ণনায় জাহান্নামের ৭টি স্তর, লেলিহান আগুন, যাক্কুম বৃক্ষ, ফুটন্ত পানি এবং জাহান্নাম থেকে মুক্তিলাভের প্রামাণ্য নবুওয়াতী আমল ও দোয়া।',
  alternates: {
    canonical: `${SITE_URL}/jahannam/`,
  },
  openGraph: {
    title: 'জাহান্নাম (جهنم وعذابها) — কঠিন শাস্তির সতর্কবার্তা | ইসলাম',
    description:
      'জাহান্নামের স্তর ও নাম, লাযা, হুতামাহ, সাক্বার, হাবিয়া এবং আগুন থেকে রক্ষার দোয়া।',
    url: `${SITE_URL}/jahannam/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
    images: [
      {
        url: `${SITE_URL}/og/jahannam.png`,
        width: 1200,
        height: 630,
        alt: 'জাহান্নাম (جهنم وعذابها) — কঠিন শাস্তির সতর্কবার্তা | ইসলাম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'জাহান্নাম (جهنم وعذابها) — কঠিন শাস্তির সতর্কবার্তা | ইসলাম',
    description: 'জাহান্নামের স্তর ও নাম, লাযা, হুতামাহ, সাক্বার, হাবিয়া এবং আগুন থেকে রক্ষার দোয়া।',
    images: [`${SITE_URL}/og/jahannam.png`],
  },
  keywords: [
    'জাহান্নাম',
    'জাহান্নামের আযাব',
    'লাযা',
    'হুতামাহ',
    'সাক্বার',
    'হাবিয়া',
    'যাক্কুম বৃক্ষ',
    'জাবানিয়াহ',
    'আল্লাহুম্মা আজিরনা মিনান নার',
    'Jahannam in Islam',
    'Hellfire in Islam',
  ],
};

export default function DedicatedJahannamPage() {
  const section = getSectionById('jahannam')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'জাহান্নাম', url: `${SITE_URL}/jahannam/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'জাহান্নাম — কঠিন শাস্তির সতর্কবার্তা ও আত্মশুদ্ধির বিশ্বকোষ',
    description: section.description,
    url: `${SITE_URL}/jahannam/`,
    image: `${SITE_URL}/og/jahannam.png`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/jahannam/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="jahannam" />
    </>
  );
}
