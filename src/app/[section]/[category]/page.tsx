import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IslamPortal from '@/components/IslamPortal';
import { SECTIONS_DATA, getSectionBySlug, getCategoryBySlug } from '@/data/sections';
import { SITE_URL, GEO_CONSTANTS, getBreadcrumbJsonLd, getCollectionPageJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  const params: { section: string; category: string }[] = [];
  SECTIONS_DATA.forEach((sec) => {
    sec.categories.forEach((cat) => {
      params.push({
        section: sec.slug,
        category: cat.slug,
      });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; category: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug, category: categorySlug } = await params;
  const match = getCategoryBySlug(sectionSlug, categorySlug);

  if (!match) {
    return {
      title: 'ক্যাটেগরি পাওয়া যায়নি | ইসলাম',
    };
  }

  const { section, category } = match;
  const canonicalUrl = `${SITE_URL}/${section.slug}/${category.slug}/`;

  return {
    title: `${category.name} (${category.badge}) | ${section.name}`,
    description: `${category.shortDesc} ${category.metaInfo} — ${section.tagline}`,
    keywords: [
      category.name,
      category.badge,
      category.group,
      section.name,
      'ইসলামিক ক্যাটেগরি',
      'বাংলা প্রবন্ধ তালিকা',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} | ${section.name} — ইসলাম`,
      description: category.shortDesc,
      url: canonicalUrl,
      type: 'website',
      locale: 'bn_BD',
      alternateLocale: ['bn_IN', 'ar', 'en_US'],
      siteName: 'ইসলাম',
      images: [
        {
          url: `${SITE_URL}/og/${section.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${category.name} | ${section.name} — ইসলাম`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | ${section.name} — ইসলাম`,
      description: category.shortDesc,
      images: [`${SITE_URL}/og/${section.slug}.png`],
    },
    other: {
      'geo.region': GEO_CONSTANTS.region,
      'geo.placename': GEO_CONSTANTS.placename,
      'geo.position': GEO_CONSTANTS.position,
      'ICBM': GEO_CONSTANTS.icbm,
    },
  };
}

export default async function CategoryRoutePage({
  params,
}: {
  params: Promise<{ section: string; category: string }>;
}) {
  const { section: sectionSlug, category: categorySlug } = await params;
  const match = getCategoryBySlug(sectionSlug, categorySlug);

  if (!match) {
    notFound();
  }

  const { section, category } = match;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: section.name, url: `${SITE_URL}/${section.slug}/` },
    { name: category.name, url: `${SITE_URL}/${section.slug}/${category.slug}/` },
  ]);

  const collectionJsonLd = getCollectionPageJsonLd(
    `${category.name} — ${section.name}`,
    category.shortDesc,
    `${SITE_URL}/${section.slug}/${category.slug}/`,
    category.articleCount,
    category.slug
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
      <IslamPortal
        initialSectionSlug={section.slug}
        initialCategorySlug={category.slug}
      />
    </>
  );
}
