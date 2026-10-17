import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IslamPortal from '@/components/IslamPortal';
import { SECTIONS_DATA, getSectionBySlug, getSectionById } from '@/data/sections';
import { SITE_URL, GEO_CONSTANTS, getBreadcrumbJsonLd, getCollectionPageJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return SECTIONS_DATA.map((sec) => ({
    section: sec.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug } = await params;
  const section = getSectionBySlug(sectionSlug) || getSectionById(sectionSlug);

  if (!section) {
    return {
      title: 'বিভাগ পাওয়া যায়নি | ইসলাম',
    };
  }

  const canonicalUrl = `${SITE_URL}/${section.slug}/`;

  return {
    title: `${section.name} (${section.arabicTitle})`,
    description: `${section.tagline}. ${section.description}`,
    keywords: [
      section.name,
      section.arabicTitle,
      'ইসলামিক বিভাগ',
      'বাংলা বিশ্বকোষ',
      'কুরআন ও সুন্নাহ',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${section.name} (${section.arabicTitle}) | ইসলাম`,
      description: section.tagline,
      url: canonicalUrl,
      type: 'website',
      locale: 'bn_BD',
      alternateLocale: ['bn_IN', 'ar', 'en_US'],
      siteName: 'ইসলাম',
    },
    other: {
      'geo.region': GEO_CONSTANTS.region,
      'geo.placename': GEO_CONSTANTS.placename,
      'geo.position': GEO_CONSTANTS.position,
      'ICBM': GEO_CONSTANTS.icbm,
    },
  };
}

export default async function SectionRoutePage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionSlug } = await params;
  const section = getSectionBySlug(sectionSlug) || getSectionById(sectionSlug);

  if (!section) {
    notFound();
  }

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: section.name, url: `${SITE_URL}/${section.slug}/` },
  ]);

  const collectionJsonLd = getCollectionPageJsonLd(
    `${section.name} (${section.arabicTitle})`,
    section.description,
    `${SITE_URL}/${section.slug}/`,
    section.categories.length
  );

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
      <IslamPortal initialSectionSlug={section.slug} />
    </>
  );
}
