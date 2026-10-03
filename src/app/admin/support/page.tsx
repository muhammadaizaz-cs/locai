import React from 'react';
import { getAdminSupportTickets } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { SupportTicketsClient } from '@/components/admin/SupportTicketsClient';
import { AdminPagination } from '@/components/admin/AdminUI';
import { HeadphonesIcon } from 'lucide-react';

export const metadata = {
  title: 'Customer Support | LocAI Admin',
  description: 'Manage customer support requests, service tickets, and resolution SLAs.',
};

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const status = params.status || 'all';
  const priority = params.priority || 'all';

  const { tickets, total } = await getAdminSupportTickets({
    page,
    pageSize: 20,
    status: status !== 'all' ? status : undefined,
    priority: priority !== 'all' ? priority : undefined,
  });

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Customer Support Queue
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Tenant tickets, resolution progress, and customer communication channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
            {total} Total Tickets
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
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="WAITING">Waiting</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          name="priority"
          defaultValue={priority}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Priorities</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <SupportTicketsClient tickets={tickets} />

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/support"
        searchParams={{ status, priority }}
      />
    </div>
  );
}
