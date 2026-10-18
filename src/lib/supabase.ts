import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DbSection {
  id: string;
  slug: string;
  name: string;
  arabic_title: string;
  tagline: string;
  description: string;
  filter_groups: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DbCategory {
  id: string;
  slug: string;
  section_id: string;
  name: string;
  arabic_name?: string;
  badge: string;
  group: string;
  article_count: number;
  short_desc: string;
  meta_info: string;
  created_at?: string;
  updated_at?: string;
}

export interface DbArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  section_id: string;
  category_id: string;
  author: string;
  reviewer: string;
  published_at: string;
  read_time: string;
  is_lead: boolean;
  status: 'published' | 'draft' | 'review';
  tags: string[];
  citation: {
    arabic: string;
    transliteration?: string;
    bengali: string;
    reference: string;
  };
  summary: string;
  key_takeaways: string[];
  content_sections: {
    heading: string;
    body: string;
  }[];
  references: string[];
  views_count?: number;
  featured_image?: {
    url: string;
    alt: string;
    caption?: string;
    source_title?: string;
    source_url?: string;
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
  created_at?: string;
  updated_at?: string;
}
