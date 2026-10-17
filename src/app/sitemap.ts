import type { MetadataRoute } from 'next';
import { SECTIONS_DATA } from '@/data/sections';
import { getAllArticlesForSitemap } from '@/data/articles';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModDate = new Date('2026-10-18T00:00:00.000Z');

  // 1. Home page (Highest Priority)
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/`,
    lastModified: lastModDate,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  // 2. All 9 Primary Section pages + Dedicated Aliases (feresta, nabi)
  const sectionEntries: MetadataRoute.Sitemap = [
    ...SECTIONS_DATA.map((section) => ({
      url: `${SITE_URL}/${section.slug}/`,
      lastModified: lastModDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
    {
      url: `${SITE_URL}/feresta/`,
      lastModified: lastModDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/nabi/`,
      lastModified: lastModDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 3. All 242 Specialized Category pages
  const categoryEntries: MetadataRoute.Sitemap = [];
  SECTIONS_DATA.forEach((section) => {
    section.categories.forEach((category) => {
      categoryEntries.push({
        url: `${SITE_URL}/${section.slug}/${category.slug}/`,
        lastModified: lastModDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // 4. All Scholarly & Thematic Articles
  const allArticles = getAllArticlesForSitemap();
  const articleEntries: MetadataRoute.Sitemap = allArticles.map(
    ({ article, section, category }) => ({
      url: `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/`,
      lastModified: lastModDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    })
  );

  return [homeEntry, ...sectionEntries, ...categoryEntries, ...articleEntries];
}
