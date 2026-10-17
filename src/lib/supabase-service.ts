import { supabase, isSupabaseConfigured, DbArticle, DbCategory, DbSection } from './supabase';
import { SECTIONS_DATA } from '@/data/sections';
import { INITIAL_ARTICLES } from '@/data/articles';
import { Article, CategoryItem, SectionPage } from '@/types';

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

// 4. Get Admin Metrics
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

  let totalCategories = 0;
  SECTIONS_DATA.forEach(s => {
    totalCategories += s.categories.length;
  });

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
