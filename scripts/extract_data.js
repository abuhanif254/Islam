const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'islam_portal.tsx'), 'utf8');

// 1. Extract SECTIONS_DATA
const secStart = content.indexOf('const SECTIONS_DATA: SectionPage[] = [');
const secEnd = content.indexOf('const INITIAL_ARTICLES: Article[] = [');

if (secStart === -1 || secEnd === -1) {
  console.error('Could not find section markers');
  process.exit(1);
}

const sectionsSnippet = content.substring(secStart, secEnd).trim();

const sectionsFileContent = `import { SectionPage, CategoryItem } from '@/types';

export ${sectionsSnippet}

export function getAllSections(): SectionPage[] {
  return SECTIONS_DATA;
}

export function getSectionById(id: string): SectionPage | undefined {
  return SECTIONS_DATA.find((sec) => sec.id === id);
}

export function getSectionBySlug(slug: string): SectionPage | undefined {
  return SECTIONS_DATA.find((sec) => sec.slug === slug);
}

export function getCategoryBySlug(
  sectionSlug: string,
  categorySlug: string
): { section: SectionPage; category: CategoryItem } | undefined {
  const section = getSectionBySlug(sectionSlug);
  if (!section) return undefined;
  const category = section.categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );
  if (!category) return undefined;
  return { section, category };
}

export function getAllCategories(): { section: SectionPage; category: CategoryItem }[] {
  const result: { section: SectionPage; category: CategoryItem }[] = [];
  SECTIONS_DATA.forEach((section) => {
    section.categories.forEach((category) => {
      result.push({ section, category });
    });
  });
  return result;
}
`;

fs.mkdirSync(path.join(__dirname, '..', 'src', 'data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'sections.ts'), sectionsFileContent, 'utf8');
console.log('src/data/sections.ts written successfully!');

// 2. Extract INITIAL_ARTICLES
const artStart = content.indexOf('const INITIAL_ARTICLES: Article[] = [');
const artEnd = content.indexOf('function IslamicGeometricEmblem(');

if (artStart === -1 || artEnd === -1) {
  console.error('Could not find article markers');
  process.exit(1);
}

const articlesSnippet = content.substring(artStart, artEnd).trim();

const articlesFileContent = `import { Article, SectionPage, CategoryItem } from '@/types';
import { SECTIONS_DATA, getSectionById } from './sections';

export ${articlesSnippet}

/**
 * Synthesizes two authentic articles for categories without pre-written articles,
 * exactly matching the design logic in islam_portal.tsx.
 */
export function synthesizeArticlesForCategory(
  section: SectionPage,
  category: CategoryItem
): Article[] {
  const synthesizedLead: Article = {
    id: \`synth-\${category.id}-1\`,
    slug: \`\${category.slug}-introductory-thesis\`,
    title: \`\${category.name}: তাৎপর্য, পরিচয় ও তাত্ত্বিক রূপরেখা\`,
    subtitle: \`\${category.shortDesc} কুরআন, সুন্নাহ ও নির্ভরযোগ্য তাফসীরগ্রন্থসমূহের সার্বিক পর্যালোচনা।\`,
    sectionId: section.id,
    categoryId: category.id,
    author: 'ড. আব্দুল্লাহ আল-মামুন',
    reviewer: 'শাইখ মুহাম্মাদ সাইফুল্লাহ',
    publishedAt: '১৭ অক্টোবর ২০২৬',
    readTime: '৯ মিনিট পাঠ',
    isLead: true,
    tags: [section.name, category.name, category.group, 'মৌলিক গবেষণা'],
    citation: {
      arabic: category.arabicName || section.arabicTitle,
      bengali: \`\${category.name} অধ্যায়ের প্রতিটি শিক্ষা মুমিনের আকীদা, আমল ও আখলাক গঠনে অপরিহার্য ভূমিকা পালন করে।\`,
      reference: \`\${section.name} বিশ্বকোষ • \${category.badge}\`
    },
    summary: \`\${category.shortDesc} এই বিশেষ প্রবন্ধে \${category.name}-এর ঐতিহাসিক পটভূমি, মৌলিক শিক্ষাসমূহ এবং সমসাময়িক জীবনে এর বাস্তব প্রয়োগ নিয়ে বিস্তারিত আলোচনা করা হয়েছে।\`,
    keyTakeaways: [
      \`\${category.name} বিষয়ে কুরআন ও সুন্নাহর মূল দলিলসমূহের ধারাবাহিক সংকলন।\`,
      'সালাফে সালেহীন ও মুহাক্কিক আলেমগণের ব্যাখ্যার সারসংক্ষেপ।',
      'দৈনন্দিন জীবনে আমল ও আত্মশুদ্ধির সুনির্দিষ্ট দিকনির্দেশনা।'
    ],
    contentSections: [
      {
        heading: \`১. \${category.name}: প্রেক্ষাপট ও মৌলিক পরিচয়\`,
        body: \`\${category.shortDesc} ইসলামী জ্ঞানতত্ত্বে "\${section.name}" বিভাগের অন্তর্গত এই অধ্যায়টি অত্যন্ত তাৎপর্যপূর্ণ। প্রাথমিক যুগ থেকেই মুফাসসির, মুহাদ্দিস ও ইতিহাসবিদগণ এ বিষয়ে স্বতন্ত্র গ্রন্থ ও অধ্যায় রচনা করেছেন।\`
      },
      {
        heading: '২. প্রামাণ্য দলিল ও তাৎপর্য বিশ্লেষণ',
        body: 'ইসলামের প্রতিটি শিক্ষা প্রামাণ্য সনদ ও বিশুদ্ধ ওহীর ওপর প্রতিষ্ঠিত। কোনো ব্যক্তিগত অনুমান নয়, বরং কুরআনের সুস্পষ্ট আয়াত এবং রাসূলুল্লাহ (সা.)-এর সহীহ হাদিসের সমন্বয়েই এই অধ্যায়ের মূলনীতিসমূহ নির্ধারিত হয়েছে।'
      },
      {
        heading: '৩. আমাদের সমসাময়িক জীবনে শিক্ষা ও করণীয়',
        body: 'আধুনিক যুগের নানা সংশয় ও নৈতিক সংকটের মোকাবিলায় এই মৌলিক শিক্ষাগুলো আমাদের চিন্তা ও কর্মে ভারসাম্য ফিরিয়ে আনে। নিয়মিত অধ্যয়ন ও আমলের মাধ্যমে ব্যক্তি, পরিবার ও সমাজ আলোকিত হয়।'
      }
    ],
    references: [
      \`তাফসীর ইবনে কাসীর ও ফাতহুল বারী — \${section.name} অধ্যায়\`,
      'আল-বিদায়া ওয়ান নিহায়া — হাফেজ ইবনে কাসীর (রহ.)'
    ]
  };

  const synthesizedSecond: Article = {
    id: \`synth-\${category.id}-2\`,
    slug: \`\${category.slug}-scholarly-lessons\`,
    title: \`\${category.name} থেকে মুমিনের দৈনন্দিন জীবনের ১০টি শিক্ষা ও আমল\`,
    subtitle: 'ক্লাসিক্যাল আলেমদের ব্যাখ্যা এবং আত্মগঠনে এর প্রত্যক্ষ প্রভাব।',
    sectionId: section.id,
    categoryId: category.id,
    author: 'মাওলানা তানভীর আহমদ',
    reviewer: 'মুফতি যায়েদ বিন হারিস',
    publishedAt: '১২ অক্টোবর ২০২৬',
    readTime: '৬ মিনিট পাঠ',
    isLead: false,
    tags: [category.name, 'শিক্ষা ও আমল', category.group],
    citation: {
      arabic: 'وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ',
      bengali: 'আর আপনি উপদেশ দিতে থাকুন; কারণ উপদেশ মুমিনদের উপকারে আসে।',
      reference: 'সূরা আয-যারিয়াত, আয়াত: ৫৫'
    },
    summary: \`\${category.name} কেবল তাত্ত্বিক পাঠের বিষয় নয়; বরং একজন মুমিনের চরিত্র, ইবাদত ও চিন্তাজগৎ পরিশুদ্ধ করার এক কার্যকর পাথেয়।\`,
    keyTakeaways: [
      'বিশুদ্ধ আকীদা ও আমলের সমন্বয় সাধন।',
      'পরিবার ও সমাজে কুরআন-সুন্নাহর আদর্শ ছড়িয়ে দেওয়ার কৌশল।'
    ],
    contentSections: [
      {
        heading: '১. তাত্ত্বিক জ্ঞান থেকে ব্যবহারিক জীবনে উত্তরণ',
        body: \`সাহাবায়ে কিরাম ও সালাফে সালেহীন যেকোনো দ্বীনি বিষয় জানার সাথে সাথে তা নিজেদের জীবনে বাস্তবায়ন করতেন। \${category.name}-এর পাঠ আমাদের সেই কর্মমুখী ঈমানের দিকেই আহ্বান জানায়।\`
      }
    ],
    references: ['রিয়াদুস সালেহীন — ইমাম নববী (রহ.)']
  };

  return [synthesizedLead, synthesizedSecond];
}

/**
 * Returns articles for a specific category.
 * If specific articles exist in INITIAL_ARTICLES, returns them.
 * Otherwise returns synthesized articles.
 */
export function getArticlesForCategory(sectionId: string, categoryId: string): Article[] {
  const directMatches = INITIAL_ARTICLES.filter(
    (a) => a.sectionId === sectionId && a.categoryId === categoryId
  );
  if (directMatches.length > 0) {
    return directMatches;
  }
  const section = getSectionById(sectionId);
  if (!section) return [];
  const category = section.categories.find((c) => c.id === categoryId);
  if (!category) return [];
  return synthesizeArticlesForCategory(section, category);
}

/**
 * Find an article by slug or ID across all sections and categories.
 */
export function getArticleBySlug(
  sectionSlug: string,
  categorySlug: string,
  slug: string
): { article: Article; section: SectionPage; category: CategoryItem } | undefined {
  const section = SECTIONS_DATA.find((s) => s.slug === sectionSlug || s.id === sectionSlug);
  if (!section) return undefined;
  const category = section.categories.find((c) => c.slug === categorySlug || c.id === categorySlug);
  if (!category) return undefined;

  const categoryArticles = getArticlesForCategory(section.id, category.id);
  const article = categoryArticles.find((a) => a.slug === slug || a.id === slug);
  if (article) {
    return { article, section, category };
  }
  return undefined;
}

/**
 * Returns all articles (including synthesized articles for all categories) for static export and SEO sitemap.
 */
export function getAllArticlesForSitemap(): {
  article: Article;
  section: SectionPage;
  category: CategoryItem;
}[] {
  const results: { article: Article; section: SectionPage; category: CategoryItem }[] = [];

  SECTIONS_DATA.forEach((section) => {
    section.categories.forEach((category) => {
      const articles = getArticlesForCategory(section.id, category.id);
      articles.forEach((article) => {
        results.push({ article, section, category });
      });
    });
  });

  return results;
}
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'articles.ts'), articlesFileContent, 'utf8');
console.log('src/data/articles.ts written successfully!');
