'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Sparkles } from 'lucide-react';
import { UserProfile } from '@/lib/supabase-auth';
import {
  getArticleReactions,
  toggleArticleReaction,
  ArticleReactionsSummary
} from '@/lib/supabase-interactions';
import { toBengaliDigits } from '@/lib/prayer-times';

interface ArticleReactionBarProps {
  articleId: string;
  articleTitle: string;
  currentUser: UserProfile | null;
  onRequestAuth: () => void;
  commentCount?: number;
  onScrollToComments?: () => void;
}

export default function ArticleReactionBar({
  articleId,
  articleTitle,
  currentUser,
  onRequestAuth,
  commentCount = 0,
  onScrollToComments
}: ArticleReactionBarProps) {
  const [reactions, setReactions] = useState<ArticleReactionsSummary>({
    likes: 12,
    dislikes: 0,
    userReaction: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    getArticleReactions(articleId, currentUser?.id).then((res) => {
      if (mounted) setReactions(res);
    });
    return () => {
      mounted = false;
    };
  }, [articleId, currentUser?.id]);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (!currentUser) {
      onRequestAuth();
      return;
    }

    if (loading) return;

    // Optimistic Update
    const prev = reactions.userReaction;
    let newLikes = reactions.likes;
    let newDislikes = reactions.dislikes;
    let newReaction: 'like' | 'dislike' | null = type;

    if (prev === type) {
      newReaction = null;
      if (type === 'like') newLikes = Math.max(0, newLikes - 1);
      if (type === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
    } else {
      if (prev === 'like') newLikes = Math.max(0, newLikes - 1);
      if (prev === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
      if (type === 'like') newLikes++;
      if (type === 'dislike') newDislikes++;
    }

    setReactions({
      likes: newLikes,
      dislikes: newDislikes,
      userReaction: newReaction
    });

    setLoading(true);
    try {
      const updated = await toggleArticleReaction(articleId, currentUser.id, type);
      setReactions(updated);
    } catch (e) {
      console.warn('Vote failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-3 px-4 bg-[#FAF8F5] dark:bg-[#1A2421] border-y border-[#DCD7CD] dark:border-[#26332F] flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#6E7571] dark:text-[#9BA39F] hidden sm:inline">
          এই গবেষণাটি কি আপনার জন্য উপকারী ছিল?
        </span>

        {/* LIKE BUTTON */}
        <button
          type="button"
          onClick={() => handleVote('like')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-bold border transition-colors ${
            reactions.userReaction === 'like'
              ? 'bg-[#0B4F3B] text-white border-[#0B4F3B]'
              : 'bg-white dark:bg-[#232F2B] text-[#141615] dark:text-[#FAF8F5] border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#0B4F3B]'
          }`}
          title={currentUser ? 'উপকারী ও পছন্দের প্রবন্ধ' : 'লাইক দিতে লগইন করুন'}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${reactions.userReaction === 'like' ? 'fill-current' : ''}`} />
          <span>উপকারী ({toBengaliDigits(reactions.likes)})</span>
        </button>

        {/* DISLIKE BUTTON */}
        <button
          type="button"
          onClick={() => handleVote('dislike')}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 font-bold border transition-colors ${
            reactions.userReaction === 'dislike'
              ? 'bg-[#B85D19] text-white border-[#B85D19]'
              : 'bg-white dark:bg-[#232F2B] text-[#6E7571] dark:text-[#9BA39F] border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#B85D19]'
          }`}
          title={currentUser ? 'পুনর্বিবেচনা প্রয়োজন' : 'ডিসলাইক দিতে লগইন করুন'}
        >
          <ThumbsDown className={`w-3.5 h-3.5 ${reactions.userReaction === 'dislike' ? 'fill-current' : ''}`} />
          <span>{toBengaliDigits(reactions.dislikes)}</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {onScrollToComments && (
          <button
            type="button"
            onClick={onScrollToComments}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#232F2B] border border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#0B4F3B] font-bold text-[#141615] dark:text-[#FAF8F5] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#0B4F3B] dark:text-[#4CC39A]" />
            <span>মন্তব্য ({toBengaliDigits(commentCount)})</span>
          </button>
        )}
      </div>
    </div>
  );
}
