import React from 'react';
import { getAdminContent } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { ContentTableClient } from '@/components/admin/ContentTableClient';
import { AdminPagination } from '@/components/admin/AdminUI';
import { Search, FileText } from 'lucide-react';

export const metadata = {
  title: 'Content Management | LocAI Admin',
  description: 'Tenant content generation oversight, publication statuses, and SEO quality audit.',
};

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const status = params.status || 'all';
  const contentType = params.contentType || 'all';

  const { content, total } = await getAdminContent({
    page,
    pageSize: 20,
    status: status !== 'all' ? status : undefined,
    contentType: contentType !== 'all' ? contentType : undefined,
  });

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Content Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Tenant content generation audit, draft inspections, and WordPress publication statuses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
            Total Content: {total}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="flex flex-wrap items-center gap-2.5">
        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="REVIEW">Review</option>
          <option value="APPROVED">Approved</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PUBLISHED">Published</option>
          <option value="FAILED">Failed</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select
          name="contentType"
          defaultValue={contentType}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Content Types</option>
          <option value="LOCAL_SERVICE_PAGE">Local Service Page</option>
          <option value="LOCATION_PAGE">Location Page</option>
          <option value="BLOG_ARTICLE">Blog Article</option>
          <option value="FAQ">FAQ</option>
          <option value="BUSINESS_DESCRIPTION">Business Description</option>
          <option value="GBP_POST">GBP Post</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <ContentTableClient content={content} />

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/content"
        searchParams={{ status, contentType }}
      />
    </div>
  );
}
