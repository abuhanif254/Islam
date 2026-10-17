import { Article, CategoryItem, SectionPage } from '@/types';

export const SITE_URL = 'https://islam.org.bd';
export const SITE_NAME = 'ইসলাম — প্রামাণ্য ডিজিটাল ম্যাগাজিন ও বিশ্বকোষ';
export const DEFAULT_DESCRIPTION =
  'পবিত্র কুরআন, সহীহ সুন্নাহ এবং সালাফে সালেহীনের মানহাজ অনুসারে পরিচালিত একটি প্রামাণ্য, দলিলভিত্তিক ও আন্তর্জাতিক মানের বাংলা ইসলামী ওয়েব পোর্টাল।';

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'bn-BD',
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ইসলাম পোর্টাল বাংলাদেশ',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [
      'https://facebook.com/islam.org.bd',
      'https://twitter.com/islam_org_bd'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@islam.org.bd',
      contactType: 'Editorial Inquiries',
      availableLanguage: ['Bengali', 'Arabic', 'English']
    }
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function getArticleJsonLd(
  article: Article,
  section: SectionPage,
  category: CategoryItem
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}`
    },
    headline: article.title,
    description: article.subtitle,
    inLanguage: 'bn-BD',
    articleSection: section.name,
    keywords: article.tags.join(', '),
    datePublished: '2026-10-17T00:00:00+06:00',
    dateModified: '2026-10-17T00:00:00+06:00',
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'ইসলাম পোর্টাল বাংলাদেশ',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`
      }
    },
    citation: [
      {
        '@type': 'CreativeWork',
        name: article.citation.reference,
        text: article.citation.arabic
      }
    ]
  };
}
