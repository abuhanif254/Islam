import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import IslamPortal from '@/components/IslamPortal';
import { getAllArticlesForSitemap, getArticleBySlug } from '@/data/articles';
import {
  SITE_URL,
  GEO_CONSTANTS,
  getBreadcrumbJsonLd,
  getArticleJsonLd,
  getFaqJsonLd,
  getClaimReviewJsonLd,
} from '@/lib/seo';

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
  const canonicalUrl = `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/`;

  return {
    title: `${article.title} | ${category.name}`,
    description: article.subtitle || article.summary,
    keywords: [
      ...article.tags,
      category.name,
      section.name,
      'ইসলাম',
      'বাংলা তাফসীর',
      'সহীহ হাদিস',
      'তাহকীক',
      `${category.name} প্রবন্ধ`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.subtitle || article.summary,
      url: canonicalUrl,
      type: 'article',
      locale: 'bn_BD',
      alternateLocale: ['bn_IN', 'ar', 'en_US'],
      siteName: 'ইসলাম — প্রামাণ্য ডিজিটাল বিশ্বকোষ',
      publishedTime: '2026-10-17T00:00:00+06:00',
      modifiedTime: '2026-10-18T00:00:00+06:00',
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle || article.summary,
    },
    other: {
      'geo.region': GEO_CONSTANTS.region,
      'geo.placename': GEO_CONSTANTS.placename,
      'geo.position': GEO_CONSTANTS.position,
      'ICBM': GEO_CONSTANTS.icbm,
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

  // Generate FAQPage Schema from Key Takeaways for Google Rich Snippets & AI answers
  const faqItems =
    article.keyTakeaways && article.keyTakeaways.length > 0
      ? article.keyTakeaways.map((takeaway, idx) => ({
          question:
            idx === 0
              ? `${article.title}-এর মূল শিক্ষা ও তাৎপর্য কী?`
              : idx === 1
              ? `${category.name} বিষয়ে কুরআন ও সুন্নাহর মৌলিক দিকনির্দেশনা কী?`
              : `${article.title} থেকে মুমিনের জীবনে কী আমল ও শিক্ষা গ্রহণ করা উচিত?`,
          answer: takeaway,
        }))
      : [];

  const faqJsonLd = faqItems.length > 0 ? getFaqJsonLd(faqItems) : null;

  // Generate ClaimReview Schema if article has tahqiq or verification tags
  const isTahqiqArticle = article.tags && article.tags.some(t => 
    t.includes('তাহকীক') || t.includes('সনদ') || t.includes('জাল') || t.includes('বানোয়াট') || t.includes('সহীহ')
  );

  const claimReviewJsonLd = isTahqiqArticle ? getClaimReviewJsonLd({
    claimReviewed: article.subtitle || article.title,
    ratingValue: '5',
    ratingExplanation: `সহীহ ও প্রামাণ্য সনদ দ্বারা পরীক্ষিত। নিরীক্ষক: ${article.reviewer}`,
    reviewUrl: `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/`,
    authorName: `ইসলাম পোর্টাল তাহকীক পর্ষদ (${article.reviewer})`
  }) : null;

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {claimReviewJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(claimReviewJsonLd) }}
        />
      )}
      <IslamPortal
        initialSectionSlug={section.slug}
        initialCategorySlug={category.slug}
        initialArticleSlug={article.slug}
        initialViewMode="reader"
      />
    </>
  );
}
