'use client';

import React from 'react';
import ArticleEditorForm from '@/components/admin/ArticleEditorForm';

export default function NewArticleAdminPage() {
  return (
    <div className="space-y-6">
      <ArticleEditorForm isEdit={false} />
    </div>
  );
}
