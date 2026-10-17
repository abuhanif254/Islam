'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';
import { fetchAdminArticleById } from '@/lib/supabase-service';
import { DbArticle } from '@/lib/supabase';
import { RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function EditArticleInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [article, setArticle] = useState<DbArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error('Failed to fetch article for editing', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-12 text-center shadow-sm">
        <RefreshCw className="w-8 h-8 text-[#0B4F3B] animate-spin mx-auto mb-3" />
        <p className="font-editorial text-lg text-[#141615] font-semibold">
          প্রবন্ধের তথ্য ও পাণ্ডুলিপি লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (!id || !article) {
    return (
      <div className="bg-[#FFFFFF] border-2 border-[#141615] p-12 text-center space-y-4 shadow-sm">
        <AlertCircle className="w-10 h-10 text-[#B85D19] mx-auto" />
        <h2 className="font-editorial text-2xl font-bold text-[#141615]">
          প্রবন্ধটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="text-xs text-[#6E7571] max-w-md mx-auto">
          অনুরোধকৃত প্রবন্ধের আইডিটি ({id || 'অজানা'}) ডাটাবেজে উপস্থিত নেই অথবা মুছে ফেলা হয়েছে।
        </p>
        <div className="pt-2">
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B4F3B] text-white text-xs font-bold hover:bg-[#083B2C] border-2 border-[#141615]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>প্রবন্ধ তালিকায় ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ArticleEditorForm initialArticle={article} isEdit={true} />;
}

export default function EditArticleAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#FFFFFF] border-2 border-[#141615] p-12 text-center">
          <RefreshCw className="w-8 h-8 text-[#0B4F3B] animate-spin mx-auto mb-3" />
          <p className="font-editorial text-lg text-[#141615]">লোড হচ্ছে...</p>
        </div>
      }
    >
      <EditArticleInner />
    </Suspense>
  );
}
