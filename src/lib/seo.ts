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

// ============================================================================
// 1. WIKIDATA & LINKED OPEN DATA ENTITIES (Next-Level Knowledge Graph Mapping)
// ============================================================================
export interface WikidataEntity {
  name: string;
  arabicName: string;
  qid: string;
  url: string;
  description: string;
}

export const WIKIDATA_ENTITIES: Record<string, WikidataEntity> = {
  // 9 Core Sections
  allah: {
    name: 'God in Islam',
    arabicName: 'الله جل جلاله',
    qid: 'Q23434',
    url: 'https://www.wikidata.org/wiki/Q23434',
    description: 'The unique, indivisible and absolute creator and sustainer of the universe in Islamic theology.',
  },
  angels: {
    name: 'Angels in Islam',
    arabicName: 'الملائكة في الإسلام',
    qid: 'Q188942',
    url: 'https://www.wikidata.org/wiki/Q188942',
    description: 'Celestial beings created from light who worship Allah and carry out His commands.',
  },
  quran: {
    name: 'Quran',
    arabicName: 'القرآن الكريم',
    qid: 'Q428',
    url: 'https://www.wikidata.org/wiki/Q428',
    description: 'The central religious text of Islam, believed by Muslims to be a revelation from God.',
  },
  hadith: {
    name: 'Hadith',
    arabicName: 'الحديث النبوي',
    qid: 'Q234764',
    url: 'https://www.wikidata.org/wiki/Q234764',
    description: 'Recorded traditions, sayings, and actions of the Islamic Prophet Muhammad and his companions.',
  },
  prophets: {
    name: 'Prophets and messengers in Islam',
    arabicName: 'الأنبياء والرسل في الإسلام',
    qid: 'Q1462058',
    url: 'https://www.wikidata.org/wiki/Q1462058',
    description: 'Humans chosen by God to guide their respective communities and humanity toward divine truth.',
  },
  sahabi: {
    name: 'Companions of the Prophet',
    arabicName: 'صحابة رسول الله',
    qid: 'Q188711',
    url: 'https://www.wikidata.org/wiki/Q188711',
    description: 'The disciples and contemporaries of the Islamic Prophet Muhammad who saw or met him during his lifetime.',
  },
  fiqh: {
    name: 'Fiqh',
    arabicName: 'الفقه الإسلامي',
    qid: 'Q484144',
    url: 'https://www.wikidata.org/wiki/Q484144',
    description: 'Islamic jurisprudence and the human understanding of divine Islamic law (Sharia).',
  },
  jannat: {
    name: 'Jannah',
    arabicName: 'الجنة في الإسلام',
    qid: 'Q215886',
    url: 'https://www.wikidata.org/wiki/Q215886',
    description: 'The ultimate abode of the righteous and the believers in the Islamic afterlife.',
  },
  jahannam: {
    name: 'Jahannam',
    arabicName: 'جهنم',
    qid: 'Q1144415',
    url: 'https://www.wikidata.org/wiki/Q1144415',
    description: 'The Islamic concept of hellfire, an abode of punishment for the wicked and disbelievers.',
  },

  // Key Categories & Theological Concepts
  'tawheed-fundamentals': {
    name: 'Tawhid',
    arabicName: 'توحيد',
    qid: 'Q175806',
    url: 'https://www.wikidata.org/wiki/Q175806',
    description: 'The indivisible oneness concept of monotheism in Islam.',
  },
  'asmaul-husna': {
    name: 'Names of God in Islam',
    arabicName: 'أسماء الله الحسنى',
    qid: 'Q256391',
    url: 'https://www.wikidata.org/wiki/Q256391',
    description: 'The ninety-nine beautiful and sublime names attributed to Allah in the Quran and Sunnah.',
  },
  'jibrail-as': {
    name: 'Gabriel',
    arabicName: 'جبريل عليه السلام',
    qid: 'Q17887',
    url: 'https://www.wikidata.org/wiki/Q17887',
    description: 'The archangel who revealed God’s words to the Islamic prophets.',
  },
  'mikail-as': {
    name: 'Michael in Islam',
    arabicName: 'ميكائيل عليه السلام',
    qid: 'Q186418',
    url: 'https://www.wikidata.org/wiki/Q186418',
    description: 'The archangel of mercy assigned by Allah to provide nourishment, rain, and sustaining provisions.',
  },
  'israfil-as': {
    name: 'Israfil',
    arabicName: 'إسرافيل عليه السلام',
    qid: 'Q854378',
    url: 'https://www.wikidata.org/wiki/Q854378',
    description: 'The archangel who will blow the trumpet to signal the Day of Judgment (Yawm al-Qiyamah).',
  },
  'malakul-mawt': {
    name: 'Azrael',
    arabicName: 'ملك الموت',
    qid: 'Q193631',
    url: 'https://www.wikidata.org/wiki/Q193631',
    description: 'The angel of death responsible for taking the souls of the deceased.',
  },
  'surah-al-fatiha': {
    name: 'Al-Fatiha',
    arabicName: 'سورة الفاتحة',
    qid: 'Q219666',
    url: 'https://www.wikidata.org/wiki/Q219666',
    description: 'The first chapter of the Quran, consisting of seven verses.',
  },
  'ayatul-kursi': {
    name: 'Throne Verse',
    arabicName: 'آية الكرسي',
    qid: 'Q793081',
    url: 'https://www.wikidata.org/wiki/Q793081',
    description: 'The 255th verse of Surah Al-Baqarah, describing Allah’s absolute power and sovereignty over the heavens and earth.',
  },
  'sahih-bukhari': {
    name: 'Sahih al-Bukhari',
    arabicName: 'صحيح البخاري',
    qid: 'Q377406',
    url: 'https://www.wikidata.org/wiki/Q377406',
    description: 'One of the Kutub al-Sittah of Sunni Islam, compiled by Imam Muhammad al-Bukhari.',
  },
  'sahih-muslim': {
    name: 'Sahih Muslim',
    arabicName: 'صحيح مسلم',
    qid: 'Q140112',
    url: 'https://www.wikidata.org/wiki/Q140112',
    description: 'One of the six major hadith collections, compiled by Imam Muslim ibn al-Hajjaj.',
  },
  'prophet-muhammad': {
    name: 'Muhammad',
    arabicName: 'محمد صلى الله عليه وسلم',
    qid: 'Q9458',
    url: 'https://www.wikidata.org/wiki/Q9458',
    description: 'The seal of the prophets and the final messenger of God sent to all humanity.',
  },
  'abu-bakr-siddiq': {
    name: 'Abu Bakr',
    arabicName: 'أبو بكر الصديق',
    qid: 'Q34627',
    url: 'https://www.wikidata.org/wiki/Q34627',
    description: 'Senior companion and father-in-law of Prophet Muhammad, first Rashidun Caliph.',
  },
  'umar-ibn-khattab': {
    name: 'Umar ibn al-Khattab',
    arabicName: 'عمر بن الخطاب',
    qid: 'Q8467',
    url: 'https://www.wikidata.org/wiki/Q8467',
    description: 'Second Rashidun Caliph, renowned for his justice and administrative expansion.',
  },
  'uthman-ibn-affan': {
    name: 'Uthman ibn Affan',
    arabicName: 'عثمان بن عفان',
    qid: 'Q44234',
    url: 'https://www.wikidata.org/wiki/Q44234',
    description: 'Third Rashidun Caliph, under whose reign the standard codex of the Quran was compiled.',
  },
  'ali-ibn-abi-talib': {
    name: 'Ali ibn Abi Talib',
    arabicName: 'علي بن أبي طالب',
    qid: 'Q39619',
    url: 'https://www.wikidata.org/wiki/Q39619',
    description: 'Fourth Rashidun Caliph, cousin and son-in-law of Prophet Muhammad.',
  },
  salah: {
    name: 'Salah',
    arabicName: 'الصلاة في الإسلام',
    qid: 'Q234821',
    url: 'https://www.wikidata.org/wiki/Q234821',
    description: 'The second pillar of Islam, five obligatory daily prayers facing the Kaaba in Mecca.',
  },
  zakat: {
    name: 'Zakat',
    arabicName: 'الزكاة في الإسلام',
    qid: 'Q124016',
    url: 'https://www.wikidata.org/wiki/Q124016',
    description: 'The third pillar of Islam, mandatory charitable contribution on wealth.',
  },
  sawm: {
    name: 'Sawm',
    arabicName: 'الصوم في الإسلام',
    qid: 'Q178994',
    url: 'https://www.wikidata.org/wiki/Q178994',
    description: 'Fasting from dawn until dusk during the month of Ramadan, the fourth pillar of Islam.',
  },
  hajj: {
    name: 'Hajj',
    arabicName: 'الحج في الإسلام',
    qid: 'Q234915',
    url: 'https://www.wikidata.org/wiki/Q234915',
    description: 'The annual Islamic pilgrimage to Mecca, Saudi Arabia, the fifth pillar of Islam.',
  },
};

/**
 * Resolves a Wikidata entity object for a given slug
 */
export function getWikidataEntity(slug: string, fallbackSlug?: string): WikidataEntity | null {
  if (WIKIDATA_ENTITIES[slug]) {
    return WIKIDATA_ENTITIES[slug];
  }
  if (fallbackSlug && WIKIDATA_ENTITIES[fallbackSlug]) {
    return WIKIDATA_ENTITIES[fallbackSlug];
  }
  return null;
}

// ============================================================================
// 2. SCHEMA GENERATORS (E-E-A-T, Speakable, ClaimReview & Linked Open Data)
// ============================================================================

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

// 2. Organization Schema with Enhanced Wikidata Entity Authority
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ইসলাম পোর্টাল বাংলাদেশ',
    alternateName: 'Islam Editorial Portal Bangladesh',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/og/home.png`,
    sameAs: [
      'https://facebook.com/islam.org.bd',
      'https://twitter.com/islam_org_bd',
      'https://youtube.com/@islam_org_bd'
    ],
    knowsAbout: [
      {
        '@type': 'Thing',
        name: 'আল-কুরআনুল কারীম',
        alternateName: 'The Holy Quran',
        sameAs: 'https://www.wikidata.org/wiki/Q428'
      },
      {
        '@type': 'Thing',
        name: 'সহীহ হাদিস শাস্ত্র',
        alternateName: 'Hadith Studies',
        sameAs: 'https://www.wikidata.org/wiki/Q234764'
      },
      {
        '@type': 'Thing',
        name: 'ইসলামী আকীদা ও তাওহীদ',
        alternateName: 'Islamic Creed & Monotheism',
        sameAs: 'https://www.wikidata.org/wiki/Q175806'
      },
      {
        '@type': 'Thing',
        name: 'ইসলামী ফিকহ ও শরীয়াহ',
        alternateName: 'Islamic Jurisprudence & Sharia',
        sameAs: 'https://www.wikidata.org/wiki/Q484144'
      },
      {
        '@type': 'Thing',
        name: 'নবী ও রাসূলগণের সীরাত',
        alternateName: 'Prophetic Biography',
        sameAs: 'https://www.wikidata.org/wiki/Q9458'
      },
      {
        '@type': 'Thing',
        name: 'সালাতের সময়সূচি ও হিজরি ক্যালেন্ডার',
        alternateName: 'Salah & Islamic Calendar',
        sameAs: 'https://www.wikidata.org/wiki/Q234821'
      }
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

// 4. ScholarlyArticle / Article Schema with Speakable, Citations & Wikidata Entity
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

  const entity = getWikidataEntity(category.slug, section.slug);

  const schema: Record<string, any> = {
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
    image: [
      `${SITE_URL}/og/${section.slug}.png`
    ],
    wordCount: article.contentSections.reduce((acc, s) => acc + s.body.length, 0),
    // Speakable Specification for Smart Assistants & Voice Search
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        '.speakable-summary',
        '.speakable-ayah',
        '.speakable-takeaway',
        '.speakable-verdict',
        'h1',
        'article p:first-of-type'
      ]
    },
    citation: citations
  };

  // Attach Linked Open Data Entity if recognized
  if (entity) {
    schema.about = {
      '@type': 'Thing',
      name: entity.name,
      alternateName: entity.arabicName,
      sameAs: entity.url,
      description: entity.description
    };
  }

  return schema;
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

// 6. CollectionPage Schema for Sections and Categories with Wikidata Linking
export function getCollectionPageJsonLd(
  title: string,
  description: string,
  url: string,
  itemCount: number,
  slugKey?: string
) {
  const entity = slugKey ? getWikidataEntity(slugKey) : null;

  const schema: Record<string, any> = {
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
      description,
      ...(entity ? { sameAs: entity.url, alternateName: entity.arabicName } : {})
    },
    image: slugKey && WIKIDATA_ENTITIES[slugKey] ? `${SITE_URL}/og/${slugKey}.png` : `${SITE_URL}/og/home.png`,
    numberOfItems: itemCount
  };

  return schema;
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

// 8. ClaimReview Schema (Anti-Misinformation & Tahqiq Verification)
export interface ClaimReviewParams {
  claimReviewed: string;
  ratingValue: number | string;
  ratingExplanation: string;
  reviewUrl: string;
  appearanceUrl?: string;
  authorName?: string;
}

export function getClaimReviewJsonLd(params: ClaimReviewParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    url: params.reviewUrl,
    claimReviewed: params.claimReviewed,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: params.ratingValue,
      bestRating: '5',
      worstRating: '1',
      alternateName: params.ratingExplanation
    },
    author: {
      '@type': 'Organization',
      name: params.authorName || 'ইসলাম পোর্টাল তাহকীক পর্ষদ',
      url: SITE_URL
    },
    itemReviewed: {
      '@type': 'CreativeWork',
      name: params.claimReviewed,
      ...(params.appearanceUrl ? { url: params.appearanceUrl } : {})
    }
  };
}

// ============================================================================
// 3. PROGRAMMATIC LOCAL SEO: 64 DISTRICTS OF BANGLADESH & DIASPORA HUBS
// ============================================================================
export interface DistrictGeoData {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  divisionBangla: string;
  divisionEnglish: string;
  lat: number;
  lng: number;
  prayerOffsetMinutes: number; // Offset relative to Dhaka
}

export const BANGLADESH_DISTRICTS: DistrictGeoData[] = [
  // Dhaka Division
  { id: 'dhaka', nameBangla: 'ঢাকা', nameEnglish: 'Dhaka', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.8103, lng: 90.4125, prayerOffsetMinutes: 0 },
  { id: 'gazipur', nameBangla: 'গাজীপুর', nameEnglish: 'Gazipur', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.9999, lng: 90.4203, prayerOffsetMinutes: 0 },
  { id: 'narayanganj', nameBangla: 'নারায়ণগঞ্জ', nameEnglish: 'Narayanganj', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.6238, lng: 90.5000, prayerOffsetMinutes: -1 },
  { id: 'tangail', nameBangla: 'টাঙ্গাইল', nameEnglish: 'Tangail', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 24.2513, lng: 89.9167, prayerOffsetMinutes: 2 },
  { id: 'faridpur', nameBangla: 'ফরিদপুর', nameEnglish: 'Faridpur', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.6071, lng: 89.8429, prayerOffsetMinutes: 2 },
  { id: 'gopalganj', nameBangla: 'গোপালগঞ্জ', nameEnglish: 'Gopalganj', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.0051, lng: 89.8266, prayerOffsetMinutes: 3 },
  { id: 'kishoreganj', nameBangla: 'কিশোরগঞ্জ', nameEnglish: 'Kishoreganj', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 24.4449, lng: 90.7766, prayerOffsetMinutes: -2 },
  { id: 'madaripur', nameBangla: 'মাদারীপুর', nameEnglish: 'Madaripur', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.1641, lng: 90.1897, prayerOffsetMinutes: 1 },
  { id: 'manikganj', nameBangla: 'মানিকগঞ্জ', nameEnglish: 'Manikganj', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.8617, lng: 90.0003, prayerOffsetMinutes: 1 },
  { id: 'munshiganj', nameBangla: 'মুন্সীগঞ্জ', nameEnglish: 'Munshiganj', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.5422, lng: 90.5305, prayerOffsetMinutes: -1 },
  { id: 'narsingdi', nameBangla: 'নরসিংদী', nameEnglish: 'Narsingdi', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.9193, lng: 90.7176, prayerOffsetMinutes: -1 },
  { id: 'rajbari', nameBangla: 'রাজবাড়ী', nameEnglish: 'Rajbari', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.7574, lng: 89.6445, prayerOffsetMinutes: 3 },
  { id: 'shariatpur', nameBangla: 'শরীয়তপুর', nameEnglish: 'Shariatpur', divisionBangla: 'ঢাকা', divisionEnglish: 'Dhaka', lat: 23.2423, lng: 90.4348, prayerOffsetMinutes: 0 },

  // Chattogram Division
  { id: 'chattogram', nameBangla: 'চট্টগ্রাম', nameEnglish: 'Chattogram', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 22.3569, lng: 91.7832, prayerOffsetMinutes: -5 },
  { id: 'coxs-bazar', nameBangla: 'কক্সবাজার', nameEnglish: "Cox's Bazar", divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 21.4272, lng: 92.0058, prayerOffsetMinutes: -6 },
  { id: 'cumilla', nameBangla: 'কুমিল্লা', nameEnglish: 'Cumilla', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 23.4682, lng: 91.1788, prayerOffsetMinutes: -3 },
  { id: 'feni', nameBangla: 'ফেনী', nameEnglish: 'Feni', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 23.0159, lng: 91.3976, prayerOffsetMinutes: -4 },
  { id: 'brahmanbaria', nameBangla: 'ব্রাহ্মণবাড়িয়া', nameEnglish: 'Brahmanbaria', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 23.9571, lng: 91.1119, prayerOffsetMinutes: -3 },
  { id: 'chandpur', nameBangla: 'চাঁদপুর', nameEnglish: 'Chandpur', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 23.2333, lng: 90.6667, prayerOffsetMinutes: -1 },
  { id: 'lakshmipur', nameBangla: 'লক্ষ্মীপুর', nameEnglish: 'Lakshmipur', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 22.9425, lng: 90.8412, prayerOffsetMinutes: -2 },
  { id: 'noakhali', nameBangla: 'নোয়াখালী', nameEnglish: 'Noakhali', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 22.8696, lng: 91.0998, prayerOffsetMinutes: -3 },
  { id: 'bandarban', nameBangla: 'বান্দরবান', nameEnglish: 'Bandarban', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 22.1953, lng: 92.2184, prayerOffsetMinutes: -7 },
  { id: 'khagrachhari', nameBangla: 'খাগড়াছড়ি', nameEnglish: 'Khagrachhari', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 23.1193, lng: 91.9847, prayerOffsetMinutes: -6 },
  { id: 'rangamati', nameBangla: 'রাঙ্গামাটি', nameEnglish: 'Rangamati', divisionBangla: 'চট্টগ্রাম', divisionEnglish: 'Chattogram', lat: 22.7324, lng: 92.2985, prayerOffsetMinutes: -7 },

  // Sylhet Division
  { id: 'sylhet', nameBangla: 'সিলেট', nameEnglish: 'Sylhet', divisionBangla: 'সিলেট', divisionEnglish: 'Sylhet', lat: 24.8949, lng: 91.8687, prayerOffsetMinutes: -6 },
  { id: 'moulvibazar', nameBangla: 'মৌলভীবাজার', nameEnglish: 'Moulvibazar', divisionBangla: 'সিলেট', divisionEnglish: 'Sylhet', lat: 24.4829, lng: 91.7774, prayerOffsetMinutes: -5 },
  { id: 'habiganj', nameBangla: 'হবিগঞ্জ', nameEnglish: 'Habiganj', divisionBangla: 'সিলেট', divisionEnglish: 'Sylhet', lat: 24.3750, lng: 91.4167, prayerOffsetMinutes: -4 },
  { id: 'sunamganj', nameBangla: 'সুনামগঞ্জ', nameEnglish: 'Sunamganj', divisionBangla: 'সিলেট', divisionEnglish: 'Sylhet', lat: 25.0658, lng: 91.3950, prayerOffsetMinutes: -4 },

  // Rajshahi Division
  { id: 'rajshahi', nameBangla: 'রাজশাহী', nameEnglish: 'Rajshahi', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 24.3636, lng: 88.6241, prayerOffsetMinutes: 7 },
  { id: 'bogura', nameBangla: 'বগুড়া', nameEnglish: 'Bogura', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 24.8465, lng: 89.3777, prayerOffsetMinutes: 4 },
  { id: 'pabna', nameBangla: 'পাবনা', nameEnglish: 'Pabna', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 24.0044, lng: 89.2500, prayerOffsetMinutes: 4 },
  { id: 'sirajganj', nameBangla: 'সিরাজগঞ্জ', nameEnglish: 'Sirajganj', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 24.4534, lng: 89.7008, prayerOffsetMinutes: 3 },
  { id: 'naogaon', nameBangla: 'নওগাঁ', nameEnglish: 'Naogaon', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 24.7936, lng: 88.9318, prayerOffsetMinutes: 6 },
  { id: 'natore', nameBangla: 'নাটোর', nameEnglish: 'Natore', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 24.4206, lng: 89.0003, prayerOffsetMinutes: 5 },
  { id: 'chapai-nawabganj', nameBangla: 'চাঁপাইনবাবগঞ্জ', nameEnglish: 'Chapai Nawabganj', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 24.5965, lng: 88.2775, prayerOffsetMinutes: 8 },
  { id: 'joypurhat', nameBangla: 'জয়পুরহাট', nameEnglish: 'Joypurhat', divisionBangla: 'রাজশাহী', divisionEnglish: 'Rajshahi', lat: 25.0968, lng: 89.0227, prayerOffsetMinutes: 5 },

  // Khulna Division
  { id: 'khulna', nameBangla: 'খুলনা', nameEnglish: 'Khulna', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 22.8456, lng: 89.5403, prayerOffsetMinutes: 4 },
  { id: 'jashore', nameBangla: 'যশোর', nameEnglish: 'Jashore', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 23.1664, lng: 89.2081, prayerOffsetMinutes: 5 },
  { id: 'kushtia', nameBangla: 'কুষ্টিয়া', nameEnglish: 'Kushtia', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 23.9013, lng: 89.1204, prayerOffsetMinutes: 5 },
  { id: 'satkhira', nameBangla: 'সাতক্ষীরা', nameEnglish: 'Satkhira', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 22.7185, lng: 89.0705, prayerOffsetMinutes: 5 },
  { id: 'bagerhat', nameBangla: 'বাগেরহাট', nameEnglish: 'Bagerhat', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 22.6516, lng: 89.7859, prayerOffsetMinutes: 3 },
  { id: 'chuadanga', nameBangla: 'চুয়াডাঙ্গা', nameEnglish: 'Chuadanga', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 23.6402, lng: 88.8418, prayerOffsetMinutes: 6 },
  { id: 'jhenaidah', nameBangla: 'ঝিনাইদহ', nameEnglish: 'Jhenaidah', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 23.5448, lng: 89.1539, prayerOffsetMinutes: 5 },
  { id: 'magura', nameBangla: 'মাগুরা', nameEnglish: 'Magura', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 23.4873, lng: 89.4199, prayerOffsetMinutes: 4 },
  { id: 'meherpur', nameBangla: 'মেহেরপুর', nameEnglish: 'Meherpur', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 23.7622, lng: 88.6318, prayerOffsetMinutes: 7 },
  { id: 'narail', nameBangla: 'নড়াইল', nameEnglish: 'Narail', divisionBangla: 'খুলনা', divisionEnglish: 'Khulna', lat: 23.1725, lng: 89.5127, prayerOffsetMinutes: 4 },

  // Barishal Division
  { id: 'barishal', nameBangla: 'বরিশাল', nameEnglish: 'Barishal', divisionBangla: 'বরিশাল', divisionEnglish: 'Barishal', lat: 22.7010, lng: 90.3535, prayerOffsetMinutes: 1 },
  { id: 'bhola', nameBangla: 'ভোলা', nameEnglish: 'Bhola', divisionBangla: 'বরিশাল', divisionEnglish: 'Barishal', lat: 22.6859, lng: 90.6481, prayerOffsetMinutes: -1 },
  { id: 'patuakhali', nameBangla: 'পটুয়াখালী', nameEnglish: 'Patuakhali', divisionBangla: 'বরিশাল', divisionEnglish: 'Barishal', lat: 22.3596, lng: 90.3299, prayerOffsetMinutes: 1 },
  { id: 'pirojpur', nameBangla: 'পিরোজপুর', nameEnglish: 'Pirojpur', divisionBangla: 'বরিশাল', divisionEnglish: 'Barishal', lat: 22.5841, lng: 89.9720, prayerOffsetMinutes: 2 },
  { id: 'barguna', nameBangla: 'বরগুনা', nameEnglish: 'Barguna', divisionBangla: 'বরিশাল', divisionEnglish: 'Barishal', lat: 22.0953, lng: 90.1121, prayerOffsetMinutes: 2 },
  { id: 'jhalokati', nameBangla: 'ঝালকাঠি', nameEnglish: 'Jhalokati', divisionBangla: 'বরিশাল', divisionEnglish: 'Barishal', lat: 22.6406, lng: 90.1987, prayerOffsetMinutes: 1 },

  // Rangpur Division
  { id: 'rangpur', nameBangla: 'রংপুর', nameEnglish: 'Rangpur', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 25.7439, lng: 89.2752, prayerOffsetMinutes: 5 },
  { id: 'dinajpur', nameBangla: 'দিনাজপুর', nameEnglish: 'Dinajpur', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 25.6217, lng: 88.6355, prayerOffsetMinutes: 7 },
  { id: 'gaibandha', nameBangla: 'গাইবান্ধা', nameEnglish: 'Gaibandha', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 25.3288, lng: 89.5403, prayerOffsetMinutes: 4 },
  { id: 'kurigram', nameBangla: 'কুড়িগ্রাম', nameEnglish: 'Kurigram', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 25.8054, lng: 89.6362, prayerOffsetMinutes: 3 },
  { id: 'lalmonirhat', nameBangla: 'লালমনিরহাট', nameEnglish: 'Lalmonirhat', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 25.9923, lng: 89.2847, prayerOffsetMinutes: 4 },
  { id: 'nilphamari', nameBangla: 'নীলফামারী', nameEnglish: 'Nilphamari', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 25.9318, lng: 88.8560, prayerOffsetMinutes: 6 },
  { id: 'panchagarh', nameBangla: 'পঞ্চগড়', nameEnglish: 'Panchagarh', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 26.3411, lng: 88.5542, prayerOffsetMinutes: 8 },
  { id: 'thakurgaon', nameBangla: 'ঠাকুরগাঁও', nameEnglish: 'Thakurgaon', divisionBangla: 'রংপুর', divisionEnglish: 'Rangpur', lat: 26.0337, lng: 88.4617, prayerOffsetMinutes: 8 },

  // Mymensingh Division
  { id: 'mymensingh', nameBangla: 'ময়মনসিংহ', nameEnglish: 'Mymensingh', divisionBangla: 'ময়মনসিংহ', divisionEnglish: 'Mymensingh', lat: 24.7471, lng: 90.4203, prayerOffsetMinutes: 0 },
  { id: 'jamalpur', nameBangla: 'জামালপুর', nameEnglish: 'Jamalpur', divisionBangla: 'ময়মনসিংহ', divisionEnglish: 'Mymensingh', lat: 24.9375, lng: 89.9378, prayerOffsetMinutes: 2 },
  { id: 'netrokona', nameBangla: 'নেত্রকোণা', nameEnglish: 'Netrokona', divisionBangla: 'ময়মনসিংহ', divisionEnglish: 'Mymensingh', lat: 24.8709, lng: 90.7279, prayerOffsetMinutes: -1 },
  { id: 'sherpur', nameBangla: 'শেরপুর', nameEnglish: 'Sherpur', divisionBangla: 'ময়মনসিংহ', divisionEnglish: 'Mymensingh', lat: 25.0205, lng: 90.0153, prayerOffsetMinutes: 2 },
];

/**
 * Generates Place and Schedule Schema for any District
 */
export function getDistrictPrayerTimesJsonLd(district: DistrictGeoData, dateStr: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${district.nameBangla} জেলা (${district.nameEnglish} District)`,
    alternateName: `${district.nameEnglish}, Bangladesh`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: district.nameEnglish,
      addressRegion: district.divisionEnglish,
      addressCountry: 'BD'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: district.lat,
      longitude: district.lng
    },
    event: {
      '@type': 'Event',
      name: `দৈনিক সালাতের ওয়াক্ত ও হিজরি সময়সূচি — ${district.nameBangla}`,
      startDate: `${dateStr}T04:30:00+06:00`,
      endDate: `${dateStr}T20:00:00+06:00`,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: `${district.nameBangla}, ${district.divisionBangla} বিভাগ`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: district.nameEnglish,
          addressCountry: 'BD'
        }
      },
      organizer: {
        '@type': 'Organization',
        name: 'ইসলাম পোর্টাল বাংলাদেশ',
        url: SITE_URL
      }
    }
  };
}
