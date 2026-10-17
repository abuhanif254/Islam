import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IslamPortal from '@/components/IslamPortal';
import { getAllArticlesForSitemap, getArticleBySlug } from '@/data/articles';
import { SITE_URL, getBreadcrumbJsonLd, getArticleJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  const allArticles = getAllArticlesForSitemap();
  return allArticles.map(({ article, section, category }) => ({
    section: section.slug,
    category: category.slug,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug, category: categorySlug, slug } = await params;
  const match = getArticleBySlug(sectionSlug, categorySlug, slug);

  if (!match) {
    return {
      title: 'প্রবন্ধ পাওয়া যায়নি | ইসলাম',
    };
  }

  const { article, section, category } = match;

  return {
    title: `${article.title} | ${category.name}`,
    description: article.subtitle,
    alternates: {
      canonical: `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/`,
    },
    openGraph: {
      title: article.title,
      description: article.subtitle,
      url: `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/`,
      type: 'article',
      locale: 'bn_BD',
      siteName: 'ইসলাম',
      publishedTime: '2026-10-17T00:00:00+06:00',
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle,
    },
  };
}

export default async function ArticleRoutePage({
  params,
}: {
  params: Promise<{ section: string; category: string; slug: string }>;
}) {
  const { section: sectionSlug, category: categorySlug, slug } = await params;
  const match = getArticleBySlug(sectionSlug, categorySlug, slug);

  if (!match) {
    notFound();
  }

  const { article, section, category } = match;

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'হোম', url: `${SITE_URL}/` },
    { name: section.name, url: `${SITE_URL}/${section.slug}/` },
    { name: category.name, url: `${SITE_URL}/${section.slug}/${category.slug}/` },
    { name: article.title, url: `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/` },
  ]);

  const articleJsonLd = getArticleJsonLd(article, section, category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <IslamPortal
        initialSectionSlug={section.slug}
        initialCategorySlug={category.slug}
        initialArticleSlug={article.slug}
        initialViewMode="reader"
      />
    </>
  );
}
