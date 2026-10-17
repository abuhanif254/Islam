import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IslamPortal from '@/components/IslamPortal';
import { SECTIONS_DATA, getSectionBySlug, getCategoryBySlug } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

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

  return {
    title: `${category.name} (${category.badge}) | ${section.name}`,
    description: `${category.shortDesc} ${category.metaInfo} — ${section.tagline}`,
    alternates: {
      canonical: `${SITE_URL}/${section.slug}/${category.slug}/`,
    },
    openGraph: {
      title: `${category.name} | ${section.name} — ইসলাম`,
      description: category.shortDesc,
      url: `${SITE_URL}/${section.slug}/${category.slug}/`,
      type: 'website',
      locale: 'bn_BD',
      siteName: 'ইসলাম',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IslamPortal
        initialSectionSlug={section.slug}
        initialCategorySlug={category.slug}
      />
    </>
  );
}
