import React from 'react';
import { getAdminOrganizations } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { OrganizationsTableClient } from '@/components/admin/OrganizationsTableClient';
import { AdminPagination } from '@/components/admin/AdminUI';
import { Search, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Organization Management | LocAI Admin',
  description: 'Manage tenant organizations, team memberships, and resource quotas.',
};

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';

  const { orgs, total } = await getAdminOrganizations({
    page,
    pageSize: 20,
    search: search || undefined,
  });

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Organization Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Tenant organization oversight, member quotas, and multi-tenant resource allocations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
            Total: {total} {total === 1 ? 'organization' : 'organizations'}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <form method="GET" className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search organizations by name..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
        />
      </form>

      {/* Table */}
      <OrganizationsTableClient organizations={orgs} />

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/organizations"
        searchParams={{ search }}
      />
    </div>
  );
}
