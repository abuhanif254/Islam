'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Edit2,
  Trash2,
  Reply,
  CheckCircle,
  AlertCircle,
  CornerDownRight,
  ShieldCheck,
  User,
  Clock,
  Lock,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { UserProfile } from '@/lib/supabase-auth';
import {
  CommentItem,
  getArticleComments,
  postArticleComment,
  editArticleComment,
  deleteArticleComment
} from '@/lib/supabase-interactions';
import { toBengaliDigits } from '@/lib/prayer-times';

interface ArticleCommentsSectionProps {
  articleId: string;
  articleTitle: string;
  currentUser: UserProfile | null;
  onRequestAuth: () => void;
  onCommentsLoaded?: (count: number) => void;
}

export default function ArticleCommentsSection({
  articleId,
  articleTitle,
  currentUser,
  onRequestAuth,
  onCommentsLoaded
}: ArticleCommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot trap

  // Inline editing state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editingLoading, setEditingLoading] = useState(false);

  // Replying state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // Status feedback
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadComments = async () => {
    try {
      const data = await getArticleComments(articleId);
      setComments(data);
      if (onCommentsLoaded) {
        // Count total including replies
        let total = data.length;
        data.forEach((c) => {
          if (c.replies) total += c.replies.length;
        });
        onCommentsLoaded(total);
      }
    } catch (e) {
      console.warn('Failed to load comments', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [articleId]);

  // Submit top-level comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // Anti-bot check
    if (honeypot) return;

    if (!currentUser) {
      onRequestAuth();
      return;
    }

    if (newCommentText.trim().length < 2) {
      setStatusMsg({ type: 'error', text: 'মন্তব্য কমপক্ষে ২ অক্ষরের হতে হবে।' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await postArticleComment(articleId, currentUser, newCommentText);
      if (res.success) {
        setNewCommentText('');
        setStatusMsg({ type: 'success', text: 'আপনার মন্তব্য সফলভাবে প্রকাশিত হয়েছে!' });
        await loadComments();
        setTimeout(() => setStatusMsg(null), 3000);
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'মন্তব্য জমা দেওয়া যায়নি।' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'অনাকাঙ্ক্ষিত ত্রুটি' });
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reply
  const handleReplySubmit = async (parentId: string) => {
    if (!currentUser) {
      onRequestAuth();
      return;
    }
    if (replyText.trim().length < 2) return;

    setReplyLoading(true);
    try {
      const res = await postArticleComment(articleId, currentUser, replyText, parentId);
      if (res.success) {
        setReplyText('');
        setReplyingToId(null);
        await loadComments();
      }
    } catch (e) {
      console.warn('Reply error', e);
    } finally {
      setReplyLoading(false);
    }
  };

  // Submit edit
  const handleEditSubmit = async (commentId: string) => {
    if (!currentUser) return;
    if (editText.trim().length < 2) return;

    setEditingLoading(true);
    try {
      const res = await editArticleComment(commentId, currentUser.id, editText);
      if (res.success) {
        setEditingCommentId(null);
        setEditText('');
        await loadComments();
      }
    } catch (e) {
      console.warn('Edit error', e);
    } finally {
      setEditingLoading(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    if (!currentUser) return;
    if (!confirm('আপনি কি নিশ্চিতভাবে এই মন্তব্যটি মুছে ফেলতে চান?')) return;

    try {
      const res = await deleteArticleComment(commentId, currentUser.id);
      if (res.success) {
        await loadComments();
      }
    } catch (e) {
      console.warn('Delete error', e);
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diff < 60) return 'এইমাত্র';
      if (diff < 3600) return `${toBengaliDigits(Math.floor(diff / 60))} মিনিট আগে`;
      if (diff < 86400) return `${toBengaliDigits(Math.floor(diff / 3600))} ঘণ্টা আগে`;
      return `${toBengaliDigits(Math.floor(diff / 86400))} দিন আগে`;
    } catch {
      return 'সম্প্রতি';
    }
  };

  return (
    <section
      id="comments-section"
      aria-label="পাঠকদের মন্তব্য ও আলোচনা"
      className="p-5 sm:p-7 bg-[#FAF8F5] dark:bg-[#1A2421] border-2 border-[#141615] dark:border-[#3B4D47] space-y-6 scroll-mt-20"
    >
      {/* SECTION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#DCD7CD] dark:border-[#26332F] pb-3">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-[#0B4F3B] dark:text-[#4CC39A]" />
          <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#141615] dark:text-[#FAF8F5]">
            প্রামাণ্য আলোচনা ও পাঠকদের মন্তব্য
          </h3>
          <span className="px-2 py-0.5 bg-[#0B4F3B] text-white text-xs font-mono font-bold">
            {toBengaliDigits(comments.length)}
          </span>
        </div>
        <span className="text-xs text-[#6E7571] dark:text-[#9BA39F]">
          শালীন ও প্রামাণ্য ভাষায় মতামত লিখুন
        </span>
      </div>

      {/* FEEDBACK STATUS */}
      {statusMsg && (
        <div
          className={`p-3 text-xs font-bold border flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950 border-[#0B4F3B] text-[#0B4F3B] dark:text-emerald-300'
              : 'bg-[#FBEAE8] border-[#DC2626] text-[#DC2626]'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* NEW COMMENT BOX */}
      <div className="bg-white dark:bg-[#141615] border border-[#DCD7CD] dark:border-[#3B4D47] p-4 space-y-3">
        {currentUser ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-[#DCD7CD] dark:border-[#26332F]">
              <div className="flex items-center gap-2 font-bold text-[#0B4F3B] dark:text-[#4CC39A]">
                <span className="w-6 h-6 rounded-full bg-[#0B4F3B] text-white flex items-center justify-center text-xs">
                  {currentUser.fullName.charAt(0)}
                </span>
                <span>{currentUser.fullName} হিসেবে মন্তব্য করছেন</span>
              </div>
              <span className="text-[11px] font-mono text-[#6E7571]">
                {toBengaliDigits(newCommentText.length)}/২০০০ অক্ষর
              </span>
            </div>

            {/* Hidden honeypot field for bot protection */}
            <input
              type="text"
              name="honeypot_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <textarea
              rows={3}
              required
              maxLength={2000}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="এই প্রবন্ধ সম্পর্কে আপনার সুচিন্তিত মতামত, প্রশ্ন বা অতিরিক্ত প্রামাণ্য তথ্য যোগ করুন..."
              className="w-full p-3 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47] focus:outline-none focus:border-[#0B4F3B] leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6E7571]">
                অনুপযুক্ত ও অপ্রাসঙ্গিক মন্তব্য স্বয়ংক্রিয়ভাবে মডারেশন ফিল্টারে যাবে।
              </span>
              <button
                type="submit"
                disabled={submitting || newCommentText.trim().length < 2}
                className="px-4 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] disabled:opacity-50 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>প্রকাশ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>মন্তব্য প্রকাশ করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-5 px-3 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#0B4F3B] dark:text-emerald-300 mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-editorial text-sm sm:text-base font-bold">
                মন্তব্য করতে বা প্রশ্ন জিজ্ঞাসা করতে লগইন করুন
              </h4>
              <p className="text-xs text-[#6E7571] max-w-md mx-auto">
                যেকোনো পাঠক অবাধে সমস্ত প্রবন্ধ পড়তে পারেন। কিন্তু গঠনমূলক আলোচনা ও স্প্যামমুক্ত রাখতে মন্তব্য করার জন্য ১-ক্লিকে লগইন বাধ্যতামূলক।
              </p>
            </div>
            <button
              type="button"
              onClick={onRequestAuth}
              className="px-5 py-2 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>লগইন বা একাউন্ট তৈরি করুন</span>
              <Sparkles className="w-3.5 h-3.5 text-[#E8A86B]" />
            </button>
          </div>
        )}
      </div>

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-[#6E7571] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#0B4F3B]" />
            <span>মন্তব্য লোড হচ্ছে...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-6 text-center bg-white dark:bg-[#141615] border border-[#DCD7CD] dark:border-[#26332F] text-xs text-[#6E7571]">
            এখনো কোনো মন্তব্য করা হয়নি। এই প্রবন্ধে আপনার প্রথম প্রামাণ্য মতামত দিন!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-[#141615] border border-[#DCD7CD] dark:border-[#26332F] p-4 sm:p-5 space-y-3"
            >
              {/* COMMENT HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  {comment.user.avatarUrl ? (
                    <img
                      src={comment.user.avatarUrl}
                      alt={comment.user.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-[#DCD7CD]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#0B4F3B] text-white flex items-center justify-center text-xs font-bold">
                      {comment.user.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-[#141615] dark:text-[#FAF8F5]">
                      <span>{comment.user.fullName}</span>
                      {comment.user.role === 'admin' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-[#B85D19] text-white font-bold">
                          অ্যাডমিন
                        </span>
                      )}
                      {comment.user.role === 'moderator' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-[#0B4F3B] text-white font-bold">
                          তাহকীক পরিষদ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6E7571]">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(comment.createdAt)}</span>
                      {comment.isEdited && (
                        <span className="text-[#B85D19] font-medium">(সম্পাদিত)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* OWNER ACTIONS (EDIT / DELETE) */}
                {currentUser && currentUser.id === comment.userId && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditText(comment.content);
                      }}
                      className="p-1 text-[#6E7571] hover:text-[#0B4F3B] inline-flex items-center gap-1"
                      title="মন্তব্য সম্পাদনা করুন"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span className="text-[11px]">সম্পাদনা</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-[#6E7571] hover:text-[#DC2626] inline-flex items-center gap-1"
                      title="মন্তব্য মুছে ফেলুন"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="text-[11px]">মুছুন</span>
                    </button>
                  </div>
                )}
              </div>

              {/* COMMENT CONTENT OR INLINE EDIT */}
              {editingCommentId === comment.id ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#0B4F3B] focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditingCommentId(null)}
                      className="px-3 py-1 border border-[#DCD7CD] text-[#6E7571]"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      disabled={editingLoading || editText.trim().length < 2}
                      onClick={() => handleEditSubmit(comment.id)}
                      className="px-3 py-1 bg-[#0B4F3B] text-white font-bold"
                    >
                      {editingLoading ? 'আপডেট হচ্ছে...' : 'সংরক্ষণ করুন'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm leading-relaxed text-[#141615] dark:text-[#E8E6E1] whitespace-pre-line pl-9">
                  {comment.content}
                </p>
              )}

              {/* REPLY TRIGGER */}
              <div className="pl-9 pt-1 flex items-center gap-3 text-xs text-[#6E7571]">
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      onRequestAuth();
                      return;
                    }
                    setReplyingToId(replyingToId === comment.id ? null : comment.id);
                    setReplyText('');
                  }}
                  className="inline-flex items-center gap-1 hover:text-[#0B4F3B] font-bold"
                >
                  <Reply className="w-3 h-3" />
                  <span>উত্তর দিন</span>
                </button>
              </div>

              {/* INLINE REPLY FORM */}
              {replyingToId === comment.id && (
                <div className="ml-9 p-3 bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#3B4D47] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B4F3B]">
                    <span>{comment.user.fullName}-এর মন্তব্যের উত্তর লিখুন:</span>
                    <button
                      type="button"
                      onClick={() => setReplyingToId(null)}
                      className="text-[#6E7571]"
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="আপনার উত্তর লিখুন..."
                    className="w-full p-2 text-xs bg-white dark:bg-[#141615] border border-[#DCD7CD] focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={replyLoading || replyText.trim().length < 2}
                      onClick={() => handleReplySubmit(comment.id)}
                      className="px-3 py-1 bg-[#0B4F3B] text-white text-xs font-bold"
                    >
                      {replyLoading ? 'পাঠানো হচ্ছে...' : 'উত্তর পাঠান'}
                    </button>
                  </div>
                </div>
              )}

              {/* THREADED REPLIES */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 sm:ml-9 pl-3 sm:pl-4 border-l-2 border-[#0B4F3B]/30 space-y-3 pt-2">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 bg-[#FAF8F5] dark:bg-[#1F2926] border border-[#DCD7CD] dark:border-[#26332F] space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="w-3 h-3 text-[#0B4F3B]" />
                          <span className="font-bold text-[#141615] dark:text-[#FAF8F5]">
                            {reply.user.fullName}
                          </span>
                          {reply.user.role === 'admin' && (
                            <span className="px-1 py-0.2 bg-[#B85D19] text-white font-bold text-[9px]">
                              অ্যাডমিন
                            </span>
                          )}
                          <span className="text-[#6E7571]">
                            {formatRelativeTime(reply.createdAt)}
                          </span>
                        </div>

                        {currentUser && currentUser.id === reply.userId && (
                          <button
                            type="button"
                            onClick={() => handleDelete(reply.id)}
                            className="text-[#6E7571] hover:text-[#DC2626]"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[#141615] dark:text-[#E8E6E1] whitespace-pre-line pl-5">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
