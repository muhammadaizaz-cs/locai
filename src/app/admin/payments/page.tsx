import React from 'react';
import { getAdminPayments, getAdminSystemSettings } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { AdminBadge, AdminPagination, statusToBadge } from '@/components/admin/AdminUI';
import { formatDate } from '@/lib/utils';
import { Receipt, AlertCircle, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Payments | LocAI Admin',
  description: 'Processed transactions, settlement logs, and billing gateway records.',
};

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const status = params.status || 'all';
  const provider = params.provider || 'all';

  const [{ payments, total }, settings] = await Promise.all([
    getAdminPayments({
      page,
      pageSize: 20,
      status: status !== 'all' ? status : undefined,
      provider: provider !== 'all' ? provider : undefined,
    }),
    Promise.resolve(getAdminSystemSettings()),
  ]);

  const hasConfiguredGateway =
    settings.stripeConfigured || settings.paddleConfigured || settings.lemonsqueezyConfigured;

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Payments & Transactions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Payment transactions, webhook settlement records, and gateway logs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!hasConfiguredGateway ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400">
              <AlertCircle className="h-3.5 w-3.5" />
              Integration Pending
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              Gateway Active
            </span>
          )}
        </div>
      </div>

      {/* Integration Notice if pending */}
      {!hasConfiguredGateway && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <span className="font-semibold text-amber-200">Integration Pending: </span>
            No payment provider secret keys (Stripe, Paddle, or Lemon Squeezy) are currently configured in environment variables.
            The transaction schema and webhook ingestion pipelines are database-ready. Once credentials are provided, live transactions will populate automatically.
          </div>
        </div>
      )}

      {/* Filters */}
      <form method="GET" className="flex flex-wrap items-center gap-2.5">
        <select
          name="provider"
          defaultValue={provider}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Providers</option>
          <option value="stripe">Stripe</option>
          <option value="paddle">Paddle</option>
          <option value="lemonsqueezy">Lemon Squeezy</option>
        </select>

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      {payments.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <Receipt className="mx-auto h-8 w-8 text-slate-500 mb-2" />
          <p className="text-sm font-semibold text-slate-300">No payment records found</p>
          <p className="text-xs text-slate-500 mt-1">
            {!hasConfiguredGateway
              ? 'Integration Pending — Connect Stripe, Paddle, or Lemon Squeezy to record customer billing events.'
              : 'No payment events logged yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Payment ID
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Provider
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-slate-300">
                    {p.external_payment_id || p.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-white">
                    {p.organizationName || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-400 font-mono">
                    ${(p.amount / 100).toFixed(2)} {p.currency}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 capitalize">
                    {p.provider}
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge variant={statusToBadge(p.status)}>{p.status}</AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(p.created_at)}
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
        baseUrl="/admin/payments"
        searchParams={{ status, provider }}
      />
    </div>
  );
}
