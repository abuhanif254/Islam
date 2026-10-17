import { Article, CategoryItem, SectionPage } from '@/types';

export const SITE_URL = 'https://islam.org.bd';
export const SITE_NAME = 'ইসলাম — প্রামাণ্য ডিজিটাল ম্যাগাজিন ও বিশ্বকোষ';
export const DEFAULT_DESCRIPTION =
  'পবিত্র কুরআন, সহীহ সুন্নাহ এবং সালাফে সালেহীনের মানহাজ অনুসারে পরিচালিত একটি প্রামাণ্য, দলিলভিত্তিক ও আন্তর্জাতিক মানের বাংলা ইসলামী ওয়েব পোর্টাল।';

// Geographic & Localization Constants
export const GEO_CONSTANTS = {
  region: 'BD',
  placename: 'Dhaka, Bangladesh',
  position: '23.8103;90.4125',
  icbm: '23.8103, 90.4125',
};

// Common Phonetic / Banglish Keywords for Diaspora & Mobile Searchers
export const PHONETIC_SEARCH_KEYWORDS = [
  'Ayatul Kursi bangla',
  'Surah Fatiha tafsir bangla',
  'Namajer somoy suchi dhaka',
  'Bukhari sharif bangla',
  'Namazer somoy',
  'Tahajjud namaz time bangla',
  'Sahri iftar time bangladesh',
  'Bangla Islamic Portal',
  'Islamic Foundation prayer times',
];

// 1. WebSite Schema with SearchAction
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

// 2. Organization Schema (E-E-A-T Authority)
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ইসলাম পোর্টাল বাংলাদেশ',
    alternateName: 'Islam Editorial Portal Bangladesh',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [
      'https://facebook.com/islam.org.bd',
      'https://twitter.com/islam_org_bd',
      'https://youtube.com/@islam_org_bd'
    ],
    knowsAbout: [
      'আল-কুরআনুল কারীম',
      'সহীহ হাদিস শাস্ত্র',
      'ইসলামী আকীদা ও তাওহীদ',
      'ইসলামী ফিকহ ও শরীয়াহ',
      'নবী ও রাসূলগণের সীরাত',
      'সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@islam.org.bd',
      contactType: 'Editorial & Tahqiq Desk',
      availableLanguage: ['Bengali', 'Arabic', 'English']
    }
  };
}

// 3. BreadcrumbList Schema
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

// 4. ScholarlyArticle / Article Schema with Citation & Tahqiq Reviewer
export function getArticleJsonLd(
  article: Article,
  section: SectionPage,
  category: CategoryItem
) {
  const citations = [];
  if (article.citation) {
    citations.push({
      '@type': 'CreativeWork',
      name: article.citation.reference,
      text: article.citation.arabic,
      translation: article.citation.bengali
    });
  }
  if (article.references && article.references.length > 0) {
    article.references.forEach((ref) => {
      citations.push({
        '@type': 'CreativeWork',
        name: ref
      });
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/${section.slug}/${category.slug}/${article.slug}/`
    },
    headline: article.title,
    alternativeHeadline: article.subtitle,
    description: article.subtitle || article.summary,
    inLanguage: 'bn-BD',
    isAccessibleForFree: true,
    articleSection: section.name,
    keywords: [
      ...article.tags,
      category.name,
      section.name,
      'ইসলামিক গবেষণা',
      'তাহকীক'
    ].join(', '),
    datePublished: '2026-10-17T00:00:00+06:00',
    dateModified: '2026-10-18T00:00:00+06:00',
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: 'ইসলামিক গবেষক ও লেখক',
      worksFor: {
        '@type': 'Organization',
        name: 'ইসলাম পোর্টাল সম্পাদকীয় পরিষদ'
      }
    },
    editor: {
      '@type': 'Person',
      name: article.reviewer,
      jobTitle: 'তাহকীক ও সম্পাদনা পর্ষদ'
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
    isPartOf: {
      '@type': 'CollectionPage',
      name: `${category.name} — ${section.name}`,
      url: `${SITE_URL}/${section.slug}/${category.slug}/`
    },
    citation: citations
  };
}

// 5. FAQPage Schema (For Google Rich FAQs & AI Snippets)
export function getFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

// 6. CollectionPage Schema for Sections and Categories
export function getCollectionPageJsonLd(
  title: string,
  description: string,
  url: string,
  itemCount: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url,
    inLanguage: 'bn-BD',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL
    },
    about: {
      '@type': 'Thing',
      name: title,
      description
    },
    numberOfItems: itemCount
  };
}

// 7. DefinedTermSet Schema for Islamic Taxonomies (e.g. Asmaul Husna, Angels, Prophets)
export function getDefinedTermSetJsonLd(
  setName: string,
  setDescription: string,
  terms: { name: string; termCode?: string; description: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: setName,
    description: setDescription,
    inLanguage: 'bn-BD',
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.name,
      termCode: t.termCode || t.name,
      description: t.description
    }))
  };
}
