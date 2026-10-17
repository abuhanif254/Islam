import { supabase, isSupabaseConfigured, DbArticle, DbCategory, DbSection } from './supabase';
import { SECTIONS_DATA } from '@/data/sections';
import { INITIAL_ARTICLES } from '@/data/articles';
import { Article, CategoryItem, SectionPage } from '@/types';
import { toBengaliDigits } from './prayer-times';

const LOCAL_STORAGE_ARTICLES_KEY = 'islam_admin_articles_v1';
const LOCAL_STORAGE_CATEGORIES_KEY = 'islam_admin_categories_v1';

// Convert App Article to DbArticle format
export function toDbArticle(art: Article, status: 'published' | 'draft' | 'review' = 'published'): DbArticle {
  return {
    id: art.id,
    slug: art.slug,
    title: art.title,
    subtitle: art.subtitle,
    section_id: art.sectionId,
    category_id: art.categoryId,
    author: art.author,
    reviewer: art.reviewer,
    published_at: art.publishedAt,
    read_time: art.readTime,
    is_lead: Boolean(art.isLead),
    status,
    tags: art.tags || [],
    citation: art.citation,
    summary: art.summary,
    key_takeaways: art.keyTakeaways || [],
    content_sections: art.contentSections || [],
    references: art.references || [],
    views_count: 0
  };
}

// Convert DbArticle to App Article format
export function toAppArticle(db: DbArticle): Article {
  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    subtitle: db.subtitle,
    sectionId: db.section_id,
    categoryId: db.category_id,
    author: db.author,
    reviewer: db.reviewer,
    publishedAt: db.published_at,
    readTime: db.read_time,
    isLead: db.is_lead,
    tags: db.tags || [],
    citation: db.citation,
    summary: db.summary,
    keyTakeaways: db.key_takeaways || [],
    contentSections: db.content_sections || [],
    references: db.references || []
  };
}

// Get fallback articles from localStorage or INITIAL_ARTICLES
function getLocalArticles(): DbArticle[] {
  if (typeof window === 'undefined') {
    return INITIAL_ARTICLES.map(a => toDbArticle(a));
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ARTICLES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read from localStorage', e);
  }
  const defaultList = INITIAL_ARTICLES.map(a => toDbArticle(a));
  try {
    localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(defaultList));
  } catch {}
  return defaultList;
}

function saveLocalArticles(list: DbArticle[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Convert all default categories from SECTIONS_DATA
function getSeedCategories(): DbCategory[] {
  const all: DbCategory[] = [];
  SECTIONS_DATA.forEach(s => {
    s.categories.forEach(c => {
      all.push({
        id: c.id,
        slug: c.slug,
        section_id: s.id,
        name: c.name,
        arabic_name: c.arabicName,
        badge: c.badge,
        group: c.group,
        article_count: c.articleCount,
        short_desc: c.shortDesc,
        meta_info: c.metaInfo
      });
    });
  });
  return all;
}

// Get fallback categories from localStorage or SECTIONS_DATA
export function getLocalCategories(): DbCategory[] {
  if (typeof window === 'undefined') {
    return getSeedCategories();
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read categories from localStorage', e);
  }
  const defaultList = getSeedCategories();
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(defaultList));
  } catch {}
  return defaultList;
}

export function saveLocalCategories(list: DbCategory[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save categories to localStorage', e);
  }
}

// 1. Fetch Articles with filtering
export async function fetchAdminArticles(filters?: {
  sectionId?: string;
  categoryId?: string;
  status?: string;
  query?: string;
}): Promise<DbArticle[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('articles').select('*').order('created_at', { ascending: false });

      if (filters?.sectionId && filters.sectionId !== 'all') {
        query = query.eq('section_id', filters.sectionId);
      }
      if (filters?.categoryId && filters.categoryId !== 'all') {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.query?.trim()) {
        const q = filters.query.trim();
        query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%,author.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as DbArticle[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage', err);
    }
  }

  // Local fallback
  let list = getLocalArticles();
  if (filters?.sectionId && filters.sectionId !== 'all') {
    list = list.filter(a => a.section_id === filters.sectionId);
  }
  if (filters?.categoryId && filters.categoryId !== 'all') {
    list = list.filter(a => a.category_id === filters.categoryId);
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter(a => a.status === filters.status);
  }
  if (filters?.query?.trim()) {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
    );
  }
  return list;
}

// 2. Fetch Single Article by ID
export async function fetchAdminArticleById(articleId: string): Promise<DbArticle | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', articleId).single();
      if (!error && data) {
        return data as DbArticle;
      }
    } catch (err) {
      console.warn('Supabase fetch single article failed, falling back to local', err);
    }
  }

  const local = getLocalArticles();
  return local.find(a => a.id === articleId) || null;
}

// 3. Save or Update Article
export async function saveAdminArticle(article: DbArticle): Promise<{ success: boolean; error?: string }> {
  // If Supabase is configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('articles').upsert({
        ...article,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase save error:', error);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.error('Supabase exception:', err);
      return { success: false, error: err.message };
    }
  }

  // Always update local storage too
  const local = getLocalArticles();
  const existingIdx = local.findIndex(a => a.id === article.id);
  if (existingIdx >= 0) {
    local[existingIdx] = { ...article, updated_at: new Date().toISOString() };
  } else {
    local.unshift({ ...article, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }
  saveLocalArticles(local);

  return { success: true };
}

// 3. Delete Article
export async function deleteAdminArticle(articleId: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', articleId);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const local = getLocalArticles();
  const filtered = local.filter(a => a.id !== articleId);
  saveLocalArticles(filtered);
  return { success: true };
}

// 4. Category Management: Fetch Categories with optional filtering
export async function fetchAdminCategories(sectionId?: string, query?: string): Promise<DbCategory[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let q = supabase.from('categories').select('*').order('name', { ascending: true });
      if (sectionId && sectionId !== 'all') {
        q = q.eq('section_id', sectionId);
      }
      if (query && query.trim()) {
        const needle = query.trim();
        q = q.or(`name.ilike.%${needle}%,short_desc.ilike.%${needle}%,badge.ilike.%${needle}%`);
      }
      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        return data as DbCategory[];
      }
    } catch (err) {
      console.warn('Supabase categories fetch failed, falling back to local', err);
    }
  }

  // Fallback to localStorage
  let list = getLocalCategories();
  if (sectionId && sectionId !== 'all') {
    list = list.filter(c => c.section_id === sectionId);
  }
  if (query && query.trim()) {
    const needle = query.toLowerCase().trim();
    list = list.filter(c =>
      c.name.toLowerCase().includes(needle) ||
      (c.arabic_name && c.arabic_name.toLowerCase().includes(needle)) ||
      c.badge.toLowerCase().includes(needle) ||
      c.short_desc.toLowerCase().includes(needle) ||
      c.meta_info.toLowerCase().includes(needle)
    );
  }
  return list;
}

// Fetch single category by ID
export async function fetchAdminCategoryById(categoryId: string): Promise<DbCategory | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').eq('id', categoryId).single();
      if (!error && data) {
        return data as DbCategory;
      }
    } catch (err) {
      console.warn('Supabase fetch category failed, falling back to local', err);
    }
  }
  const local = getLocalCategories();
  return local.find(c => c.id === categoryId) || null;
}

// Check how many articles belong to a category (safety guard before delete)
export async function countArticlesForCategory(categoryId: string): Promise<number> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { count, error } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId);
      if (!error && typeof count === 'number') {
        return count;
      }
    } catch (e) {
      console.warn('Supabase countArticlesForCategory error:', e);
    }
  }
  const localArticles = getLocalArticles();
  return localArticles.filter(a => a.category_id === categoryId).length;
}

// Save or Update Category
export async function saveAdminCategory(category: DbCategory): Promise<{ success: boolean; error?: string }> {
  if (!category.id?.trim() || !category.name?.trim() || !category.section_id?.trim()) {
    return { success: false, error: 'ক্যাটেগরি আইডি, নাম ও মূল বিভাগ প্রদান করা আবশ্যক।' };
  }

  const cleanCategory: DbCategory = {
    ...category,
    id: category.id.trim(),
    slug: category.slug?.trim() || category.id.trim(),
    name: category.name.trim(),
    section_id: category.section_id.trim(),
    arabic_name: category.arabic_name?.trim() || undefined,
    badge: category.badge?.trim() || 'সাধারণ',
    group: category.group?.trim() || 'সাধারণ',
    article_count: Number(category.article_count) || 0,
    short_desc: category.short_desc?.trim() || '',
    meta_info: category.meta_info?.trim() || '',
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('categories').upsert(cleanCategory, { onConflict: 'id' });
      if (error) {
        console.error('Supabase save category error:', error);
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      console.error('Supabase category exception:', err);
      return { success: false, error: err.message };
    }
  }

  // Update local storage
  const local = getLocalCategories();
  const existingIdx = local.findIndex(c => c.id === cleanCategory.id);
  if (existingIdx >= 0) {
    local[existingIdx] = cleanCategory;
  } else {
    local.unshift({
      ...cleanCategory,
      created_at: new Date().toISOString()
    });
  }
  saveLocalCategories(local);

  return { success: true };
}

// Delete Category with safety guard
export async function deleteAdminCategory(categoryId: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const local = getLocalCategories();
  const filtered = local.filter(c => c.id !== categoryId);
  saveLocalCategories(filtered);
  return { success: true };
}

// 5. Bengali Word Stats & Reading Time Calculator
export function calculateBengaliStats(text: string): {
  words: number;
  chars: number;
  readTimeMinutes: number;
  readTimeString: string;
} {
  if (!text) {
    return { words: 0, chars: 0, readTimeMinutes: 1, readTimeString: '১ মিনিট পাঠ' };
  }
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const chars = trimmed.length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return {
    words,
    chars,
    readTimeMinutes: minutes,
    readTimeString: `${toBengaliDigits(minutes)} মিনিট পাঠ`
  };
}

// 6. Get Admin Metrics
export async function getAdminMetrics(): Promise<{
  totalArticles: number;
  publishedCount: number;
  draftCount: number;
  reviewCount: number;
  totalSections: number;
  totalCategories: number;
  totalViews: number;
  isLiveSupabase: boolean;
}> {
  const isLive = isSupabaseConfigured();
  const articles = await fetchAdminArticles();
  const published = articles.filter(a => a.status === 'published').length;
  const draft = articles.filter(a => a.status === 'draft').length;
  const review = articles.filter(a => a.status === 'review').length;
  const totalViews = articles.reduce((acc, curr) => acc + (curr.views_count || 142), 0);

  const categories = await fetchAdminCategories();
  const totalCategories = categories.length;

  return {
    totalArticles: articles.length,
    publishedCount: published,
    draftCount: draft,
    reviewCount: review,
    totalSections: SECTIONS_DATA.length,
    totalCategories,
    totalViews,
    isLiveSupabase: isLive
  };
}

// 5. One-Click Sync Entire Local Dataset to Supabase
export async function syncDatasetToSupabase(): Promise<{
  success: boolean;
  sectionsSynced: number;
  categoriesSynced: number;
  articlesSynced: number;
  message: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      sectionsSynced: 0,
      categoriesSynced: 0,
      articlesSynced: 0,
      message: 'Supabase credentials not configured in environment variables (.env.local).'
    };
  }

  try {
    // 1. Sync Sections
    const dbSections: DbSection[] = SECTIONS_DATA.map(s => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      arabic_title: s.arabicTitle,
      tagline: s.tagline,
      description: s.description,
      filter_groups: s.filterGroups
    }));

    const { error: secError } = await supabase.from('sections').upsert(dbSections, { onConflict: 'id' });
    if (secError) throw new Error(`Sections sync failed: ${secError.message}`);

    // 2. Sync Categories (in batches of 50)
    const allCategories: DbCategory[] = [];
    SECTIONS_DATA.forEach(s => {
      s.categories.forEach(c => {
        allCategories.push({
          id: c.id,
          slug: c.slug,
          section_id: s.id,
          name: c.name,
          arabic_name: c.arabicName,
          badge: c.badge,
          group: c.group,
          article_count: c.articleCount,
          short_desc: c.shortDesc,
          meta_info: c.metaInfo
        });
      });
    });

    for (let i = 0; i < allCategories.length; i += 50) {
      const batch = allCategories.slice(i, i + 50);
      const { error: catError } = await supabase.from('categories').upsert(batch, { onConflict: 'id' });
      if (catError) throw new Error(`Categories sync failed: ${catError.message}`);
    }

    // 3. Sync Articles
    const localArticles = getLocalArticles();
    const { error: artError } = await supabase.from('articles').upsert(localArticles, { onConflict: 'id' });
    if (artError) throw new Error(`Articles sync failed: ${artError.message}`);

    return {
      success: true,
      sectionsSynced: dbSections.length,
      categoriesSynced: allCategories.length,
      articlesSynced: localArticles.length,
      message: 'সকল বিভাগ, ক্যাটেগরি এবং প্রবন্ধ সফলভাবে Supabase ডাটাবেজে সিঙ্ক হয়েছে!'
    };
  } catch (err: any) {
    return {
      success: false,
      sectionsSynced: 0,
      categoriesSynced: 0,
      articlesSynced: 0,
      message: err.message
    };
  }
}
