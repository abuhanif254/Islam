export type ThemeMode = 'paper' | 'sepia' | 'dark';
export type ViewMode = 'magazine' | 'reader' | 'writer' | 'nextjs_code';
export type FontScale = 'normal' | 'large' | 'xlarge';

export interface CitationBox {
  arabic: string;
  transliteration?: string;
  bengali: string;
  reference: string;
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface ArticleFeaturedImage {
  url: string;
  alt: string;
  caption?: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface ArticleFAQ {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  sectionId: string;
  categoryId: string;
  author: string;
  reviewer: string;
  publishedAt: string;
  readTime: string;
  isLead?: boolean;
  tags: string[];
  citation: CitationBox;
  summary: string;
  keyTakeaways: string[];
  contentSections: ArticleSection[];
  references: string[];
  featuredImage?: ArticleFeaturedImage;
  faqs?: ArticleFAQ[];
  relatedArticleSlugs?: string[];
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  arabicName?: string;
  badge: string;
  group: string;
  articleCount: number;
  shortDesc: string;
  metaInfo: string;
}

export interface SectionPage {
  id: string;
  slug: string;
  name: string;
  arabicTitle: string;
  tagline: string;
  description: string;
  filterGroups: string[];
  categories: CategoryItem[];
}
