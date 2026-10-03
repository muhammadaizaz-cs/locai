import React from 'react';
import { getAdminWordPressSites } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { WordPressSitesTableClient } from '@/components/admin/WordPressSitesTableClient';
import { AdminPagination } from '@/components/admin/AdminUI';
import { Globe, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'WordPress Sites | LocAI Admin',
  description: 'Manage connected WordPress sites and REST publishing endpoints.',
};

export default async function AdminWordPressSitesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const status = params.status || 'all';

  const { sites, total } = await getAdminWordPressSites({
    page,
    pageSize: 20,
    status: status !== 'all' ? status : undefined,
  });

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            WordPress Sites
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Connected customer WordPress instances, REST API publishing channels, and status checks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
            AES-256-GCM Guard Active
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="flex items-center gap-2.5">
        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="connected">Connected</option>
          <option value="disconnected">Disconnected</option>
          <option value="error">Error</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <WordPressSitesTableClient sites={sites} />

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/wordpress-sites"
        searchParams={{ status }}
      />
    </div>
  );
}
