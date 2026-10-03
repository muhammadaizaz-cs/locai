import React from 'react';
import { getSystemAlerts } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { SystemAlertsClient } from '@/components/admin/SystemAlertsClient';
import { AdminPagination } from '@/components/admin/AdminUI';
import { AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'System Alerts | LocAI Admin',
  description: 'Incident response, integration health alerts, and platform error telemetry.',
};

export default async function AdminSystemAlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const severity = params.severity || 'all';
  const status = params.status || 'open';

  const resolved = status === 'all' ? undefined : status === 'resolved';

  const { alerts, total } = await getSystemAlerts({
    page,
    pageSize: 20,
    severity: severity !== 'all' ? severity : undefined,
    resolved,
  });

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            System Alerts & Incidents
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time critical alarms, AI API throttling events, and failed background jobs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
            Total Alerts: {total}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="flex flex-wrap items-center gap-2.5">
        <select
          name="severity"
          defaultValue={severity}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="ERROR">Error</option>
          <option value="WARNING">Warning</option>
          <option value="INFO">Info</option>
        </select>

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="open">Open Alerts Only</option>
          <option value="resolved">Resolved Only</option>
          <option value="all">All Statuses</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Alerts List */}
      <SystemAlertsClient alerts={alerts} />

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/system-alerts"
        searchParams={{ severity, status }}
      />
    </div>
  );
}
