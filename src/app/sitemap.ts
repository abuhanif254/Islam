import type { MetadataRoute } from 'next';
import { SECTIONS_DATA } from '@/data/sections';
import { getAllArticlesForSitemap } from '@/data/articles';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-10-17T00:00:00.000Z');

  // 1. Home page
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  // 2. All 7 Section pages + Dedicated Aliases (feresta, nabi)
  const sectionEntries: MetadataRoute.Sitemap = [
    ...SECTIONS_DATA.map((section) => ({
      url: `${SITE_URL}/${section.slug}/`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
    {
      url: `${SITE_URL}/feresta/`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/nabi/`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 3. All 42 Category pages
  const categoryEntries: MetadataRoute.Sitemap = [];
  SECTIONS_DATA.forEach((section) => {
    section.categories.forEach((category) => {
      categoryEntries.push({
        url: `${SITE_URL}/${section.slug}/${category.slug}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // 4. All Articles
  const allArticles = getAllArticlesForSitemap();
  const articleEntries: MetadataRoute.Sitemap = allArticles.map(
    ({ article, section, category }) => ({
      url: `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  );

  return [homeEntry, ...sectionEntries, ...categoryEntries, ...articleEntries];
}
