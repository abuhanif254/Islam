import type { Metadata } from 'next';
import IslamPortal from '@/components/IslamPortal';
import { getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'জান্নাত (الجنة ونعيمها) — মুমিনদের চিরস্থায়ী শান্তির আবাস ও নিয়ামতের বিশ্বকোষ',
  description:
    'পবিত্র কুরআন ও সহীহ হাদিসের আলোকে জান্নাতের আটটি দরজা, জান্নাতুল ফিরদাউস, আদন, নাঈম, কওসার নদী, জান্নাতীদের সুরম্য প্রাসাদ ও মহান আল্লাহর দিদারের প্রামাণ্য বিবরণ।',
  alternates: {
    canonical: `${SITE_URL}/jannat/`,
  },
  openGraph: {
    title: 'জান্নাত (الجنة ونعيمها) — অফুরন্ত নিয়ামতের উদ্যান | ইসলাম',
    description:
      'জান্নাতের স্তরসমূহ, জান্নাতী খাদ্য-পানীয়, হুর-গেলমান ও আল্লাহর দিদারের প্রামাণ্য পর্যালোচনা।',
    url: `${SITE_URL}/jannat/`,
    type: 'website',
    locale: 'bn_BD',
    siteName: 'ইসলাম',
  },
  keywords: [
    'জান্নাত',
    'জান্নাতুল ফিরদাউস',
    'জান্নাতুল আদন',
    'জান্নাতুন নাঈম',
    'কওসার নদী',
    'জান্নাতের আটটি দরজা',
    'বাবুর রাইয়ান',
    'আল্লাহর দিদার',
    'Jannah in Islam',
    'Paradise in Islam',
  ],
};

export default function DedicatedJannatPage() {
  const section = getSectionById('jannat')!;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: 'জান্নাত', url: `${SITE_URL}/jannat/` },
  ]);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'জান্নাত — মুমিনদের চিরস্থায়ী শান্তির আবাস ও নিয়ামতের বিশ্বকোষ',
    description: section.description,
    url: `${SITE_URL}/jannat/`,
    hasPart: section.categories.map((cat) => ({
      '@type': 'WebPage',
      name: cat.name,
      description: cat.shortDesc,
      url: `${SITE_URL}/jannat/${cat.slug}/`,
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
      <IslamPortal initialSectionSlug="jannat" />
    </>
  );
}
