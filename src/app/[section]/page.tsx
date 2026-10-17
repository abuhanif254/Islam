import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IslamPortal from '@/components/IslamPortal';
import { SECTIONS_DATA, getSectionBySlug, getSectionById } from '@/data/sections';
import { SITE_URL, getBreadcrumbJsonLd } from '@/lib/seo';

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

  return {
    title: `${section.name} (${section.arabicTitle})`,
    description: `${section.tagline}. ${section.description}`,
    alternates: {
      canonical: `${SITE_URL}/${section.slug}/`,
    },
    openGraph: {
      title: `${section.name} (${section.arabicTitle}) | ইসলাম`,
      description: section.tagline,
      url: `${SITE_URL}/${section.slug}/`,
      type: 'website',
      locale: 'bn_BD',
      siteName: 'ইসলাম',
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IslamPortal initialSectionSlug={section.slug} />
    </>
  );
}
