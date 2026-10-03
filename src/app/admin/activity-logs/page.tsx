import React from 'react';
import { getAdminActivityLogs } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { AdminPagination, AdminBadge } from '@/components/admin/AdminUI';
import { formatDate } from '@/lib/utils';
import { Activity, Clock, Shield, Search } from 'lucide-react';

export const metadata = {
  title: 'Activity Logs | LocAI Admin',
  description: 'Structured audit events, access logs, and security telemetry.',
};

export default async function AdminActivityLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const orgId = params.organizationId || undefined;

  const { logs, total } = await getAdminActivityLogs({
    page,
    pageSize: 30,
    organizationId: orgId,
  });

  const totalPages = Math.ceil(total / 30) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Activity & Audit Logs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Structured timeline of operational events, tenant actions, and administrative activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
            {total} Log Entries
          </span>
        </div>
      </div>

      {/* Logs Table */}
      {logs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 text-xs">
          No platform activity events recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Actor
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Resource
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-200">
                    {log.userName || (log.user_id ? log.user_id.slice(0, 8) : 'System')}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    {log.organizationName || 'Global'}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-white max-w-md truncate">
                    {log.action}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                      {log.entity_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/activity-logs"
      />
    </div>
  );
}
