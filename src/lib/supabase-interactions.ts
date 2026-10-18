import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile } from './supabase-auth';

export interface CommentItem {
  id: string;
  articleId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  isEdited: boolean;
  likeCount: number;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl?: string;
    role: 'user' | 'moderator' | 'admin';
    isVerified?: boolean;
  };
  replies?: CommentItem[];
}

export interface ArticleReactionsSummary {
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
}

const LOCAL_STORAGE_REACTIONS_KEY = 'islam_portal_reactions_v1';
const LOCAL_STORAGE_COMMENTS_KEY = 'islam_portal_comments_v1';

// Sanitize comment text against XSS & script injection
export function sanitizeCommentInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

// ==========================================
// 1. ARTICLE REACTIONS (LIKE & DISLIKE)
// ==========================================

export async function getArticleReactions(
  articleId: string,
  userId?: string
): Promise<ArticleReactionsSummary> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('article_reactions')
        .select('reaction_type, user_id')
        .eq('article_id', articleId);

      if (!error && data) {
        let likes = 0;
        let dislikes = 0;
        let userReaction: 'like' | 'dislike' | null = null;

        data.forEach((r: any) => {
          if (r.reaction_type === 'like') likes++;
          if (r.reaction_type === 'dislike') dislikes++;
          if (userId && r.user_id === userId) {
            userReaction = r.reaction_type;
          }
        });

        return { likes, dislikes, userReaction };
      }
    } catch (e) {
      console.warn('Fetch reactions failed', e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_REACTIONS_KEY);
      const allReactions: Record<string, { likes: number; dislikes: number; users: Record<string, 'like' | 'dislike'> }> = raw
        ? JSON.parse(raw)
        : {};

      const current = allReactions[articleId] || { likes: 12, dislikes: 0, users: {} };
      const userReaction = userId ? current.users[userId] || null : null;
      return {
        likes: current.likes,
        dislikes: current.dislikes,
        userReaction
      };
    } catch {}
  }

  return { likes: 14, dislikes: 0, userReaction: null };
}

export async function toggleArticleReaction(
  articleId: string,
  userId: string,
  type: 'like' | 'dislike'
): Promise<ArticleReactionsSummary> {
  if (isSupabaseConfigured() && supabase) {
    try {
      // Check existing reaction
      const { data: existing } = await supabase
        .from('article_reactions')
        .select('id, reaction_type')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        if (existing.reaction_type === type) {
          // Remove reaction
          await supabase.from('article_reactions').delete().eq('id', existing.id);
        } else {
          // Update reaction
          await supabase
            .from('article_reactions')
            .update({ reaction_type: type, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        }
      } else {
        // Insert new reaction
        await supabase.from('article_reactions').insert({
          article_id: articleId,
          user_id: userId,
          reaction_type: type
        });
      }

      return await getArticleReactions(articleId, userId);
    } catch (e) {
      console.warn('Toggle reaction failed', e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_REACTIONS_KEY);
      const allReactions: Record<string, { likes: number; dislikes: number; users: Record<string, 'like' | 'dislike'> }> = raw
        ? JSON.parse(raw)
        : {};

      if (!allReactions[articleId]) {
        allReactions[articleId] = { likes: 12, dislikes: 0, users: {} };
      }
      const item = allReactions[articleId];
      const prev = item.users[userId];

      if (prev === type) {
        delete item.users[userId];
        if (type === 'like') item.likes = Math.max(0, item.likes - 1);
        if (type === 'dislike') item.dislikes = Math.max(0, item.dislikes - 1);
      } else {
        if (prev === 'like') item.likes = Math.max(0, item.likes - 1);
        if (prev === 'dislike') item.dislikes = Math.max(0, item.dislikes - 1);
        item.users[userId] = type;
        if (type === 'like') item.likes++;
        if (type === 'dislike') item.dislikes++;
      }

      localStorage.setItem(LOCAL_STORAGE_REACTIONS_KEY, JSON.stringify(allReactions));
      return {
        likes: item.likes,
        dislikes: item.dislikes,
        userReaction: item.users[userId] || null
      };
    } catch {}
  }

  return { likes: 14, dislikes: 0, userReaction: type };
}

// ==========================================
// 2. ARTICLE COMMENTS (THREADED & EDITABLE)
// ==========================================

export async function getArticleComments(articleId: string): Promise<CommentItem[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .select(`
          id,
          article_id,
          user_id,
          parent_id,
          content,
          is_edited,
          like_count,
          created_at,
          profiles:user_id (
            full_name,
            avatar_url,
            role,
            is_verified
          )
        `)
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const rawComments: CommentItem[] = data.map((c: any) => ({
          id: c.id,
          articleId: c.article_id,
          userId: c.user_id,
          parentId: c.parent_id,
          content: c.content,
          isEdited: Boolean(c.is_edited),
          likeCount: c.like_count || 0,
          createdAt: c.created_at,
          user: {
            fullName: c.profiles?.full_name || 'মুমিন পাঠক',
            avatarUrl: c.profiles?.avatar_url,
            role: c.profiles?.role || 'user',
            isVerified: c.profiles?.is_verified
          }
        }));

        // Thread into parent-child tree
        return buildCommentTree(rawComments);
      }
    } catch (e) {
      console.warn('Fetch comments failed', e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      const allComments: CommentItem[] = raw ? JSON.parse(raw) : getSeedComments(articleId);
      const articleComments = allComments.filter((c) => c.articleId === articleId);
      return buildCommentTree(articleComments);
    } catch {}
  }

  return getSeedComments(articleId);
}

// Post a new comment
export async function postArticleComment(
  articleId: string,
  user: UserProfile,
  rawContent: string,
  parentId?: string
): Promise<{ success: boolean; comment?: CommentItem; error?: string }> {
  const content = sanitizeCommentInput(rawContent);
  if (content.length < 2) {
    return { success: false, error: 'মন্তব্য কমপক্ষে ২ অক্ষরের হতে হবে।' };
  }
  if (content.length > 2000) {
    return { success: false, error: 'মন্তব্য সর্বোচ্চ ২,০০০ অক্ষরের মধ্যে সীমাবদ্ধ রাখুন।' };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          parent_id: parentId || null,
          content,
          status: 'approved'
        })
        .select()
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'মন্তব্য জমা দেওয়া সম্ভব হয়নি।' };
      }

      const newComment: CommentItem = {
        id: data.id,
        articleId,
        userId: user.id,
        parentId: data.parent_id,
        content: data.content,
        isEdited: false,
        likeCount: 0,
        createdAt: data.created_at,
        user: {
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isVerified: user.isVerified
        }
      };
      return { success: true, comment: newComment };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      const allComments: CommentItem[] = raw ? JSON.parse(raw) : getSeedComments(articleId);

      const newComment: CommentItem = {
        id: `local-cmt-${Date.now()}`,
        articleId,
        userId: user.id,
        parentId: parentId || null,
        content,
        isEdited: false,
        likeCount: 0,
        createdAt: new Date().toISOString(),
        user: {
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isVerified: user.isVerified
        }
      };

      allComments.push(newComment);
      localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(allComments));
      return { success: true, comment: newComment };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  return { success: false, error: 'মন্তব্য সংরক্ষণ ব্যর্থ হয়েছে।' };
}

// Edit existing comment
export async function editArticleComment(
  commentId: string,
  userId: string,
  rawContent: string
): Promise<{ success: boolean; error?: string }> {
  const content = sanitizeCommentInput(rawContent);
  if (content.length < 2) {
    return { success: false, error: 'মন্তব্য কমপক্ষে ২ অক্ষরের হতে হবে।' };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('article_comments')
        .update({
          content,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      if (!raw) return { success: false, error: 'মন্তব্য খুঁজে পাওয়া যায়নি।' };
      const allComments: CommentItem[] = JSON.parse(raw);
      const target = allComments.find((c) => c.id === commentId && c.userId === userId);
      if (target) {
        target.content = content;
        target.isEdited = true;
        localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(allComments));
        return { success: true };
      }
      return { success: false, error: 'সম্পাদনার অনুমতি নেই।' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  return { success: false, error: 'সম্পাদনা ব্যর্থ হয়েছে।' };
}

// Delete existing comment
export async function deleteArticleComment(
  commentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('article_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
      if (raw) {
        let allComments: CommentItem[] = JSON.parse(raw);
        allComments = allComments.filter((c) => !(c.id === commentId && c.userId === userId));
        localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(allComments));
        return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  return { success: true };
}

// Helper: Nest comments into parent-child tree
function buildCommentTree(flatComments: CommentItem[]): CommentItem[] {
  const map = new Map<string, CommentItem>();
  const roots: CommentItem[] = [];

  flatComments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  flatComments.forEach((c) => {
    const item = map.get(c.id);
    if (!item) return;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)?.replies?.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots.reverse(); // newest first
}

// Seed comments for rich display when fresh
function getSeedComments(articleId: string): CommentItem[] {
  return [
    {
      id: `seed-1-${articleId}`,
      articleId,
      userId: 'scholar-1',
      content: 'মাশাআল্লাহ, অত্যন্ত চমৎকার ও প্রামাণ্য বিশ্লেষণ। বিশেষ করে সালাফে সালেহীনদের উদ্ধৃতিগুলো প্রতিটি মুসলিমের চিন্তাজগৎকে সমৃদ্ধ করবে। আল্লাহ আপনাদের এই খেদমত কবুল করুন।',
      isEdited: false,
      likeCount: 9,
      createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
      user: {
        fullName: 'হাফেজ মাওলানা ওবায়দুল্লাহ',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'moderator',
        isVerified: true
      },
      replies: [
        {
          id: `seed-1-rep-1-${articleId}`,
          articleId,
          userId: 'author-1',
          parentId: `seed-1-${articleId}`,
          content: 'জাযাকাল্লাহু খাইরান সম্মানিত শাইখ। আপনাদের দোয়া ও পরামর্শই আমাদের এই কাজের প্রেরণা।',
          isEdited: false,
          likeCount: 4,
          createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
          user: {
            fullName: 'তাহকীক বিভাগ (ইসলাম পোর্টাল)',
            role: 'admin',
            isVerified: true
          }
        }
      ]
    },
    {
      id: `seed-2-${articleId}`,
      articleId,
      userId: 'reader-102',
      content: 'আমার একটি প্রশ্ন ছিল: এই আমলটি কি দৈনন্দিন সালাতের পাশাপাশি নফল ইবাদতের ক্ষেত্রেও একইভাবে প্রযোজ্য হবে?',
      isEdited: false,
      likeCount: 3,
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      user: {
        fullName: 'সাইফুল ইসলাম',
        role: 'user',
        isVerified: false
      }
    }
  ];
}
