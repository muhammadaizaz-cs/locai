import React from 'react';
import { getAdminSubscriptions, getAdminSystemSettings } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { AdminBadge, AdminPagination, statusToBadge } from '@/components/admin/AdminUI';
import { formatDate } from '@/lib/utils';
import { CreditCard, AlertCircle, Filter } from 'lucide-react';

export const metadata = {
  title: 'Subscriptions | LocAI Admin',
  description: 'Tenant subscriptions, tier distributions, and billing statuses.',
};

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const tier = params.tier || 'all';
  const status = params.status || 'all';

  const [{ subscriptions, total }, settings] = await Promise.all([
    getAdminSubscriptions({
      page,
      pageSize: 20,
      tier: tier !== 'all' ? tier : undefined,
      status: status !== 'all' ? status : undefined,
    }),
    Promise.resolve(getAdminSystemSettings()),
  ]);

  const isBillingConnected =
    settings.stripeConfigured || settings.paddleConfigured || settings.lemonsqueezyConfigured;

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Subscription Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Tenant tier allocations, renewal cycles, and recurring billing plans
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isBillingConnected && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400">
              <AlertCircle className="h-3.5 w-3.5" />
              Billing integration pending
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap items-center gap-2.5">
        <select
          name="tier"
          defaultValue={tier}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Plans</option>
          <option value="FREE">Free</option>
          <option value="STARTER">Starter</option>
          <option value="PRO">Pro</option>
          <option value="AGENCY">Agency</option>
        </select>

        <select
          name="status"
          defaultValue={status}
          className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIALING">Trialing</option>
          <option value="PAST_DUE">Past Due</option>
          <option value="CANCELED">Canceled</option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      {subscriptions.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center">
          <CreditCard className="mx-auto h-8 w-8 text-slate-500 mb-2" />
          <p className="text-sm font-semibold text-slate-300">No subscriptions found</p>
          <p className="text-xs text-slate-500 mt-1">
            {!isBillingConnected
              ? 'Billing integration pending. No active external subscriptions have been synced yet.'
              : 'No matching subscription records in database.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Plan Tier
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Provider
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Renewal Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3 text-xs font-semibold text-white">
                    {s.organizationName}
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge
                      variant={
                        s.tier === 'AGENCY'
                          ? 'amber'
                          : s.tier === 'PRO'
                            ? 'purple'
                            : s.tier === 'STARTER'
                              ? 'info'
                              : 'default'
                      }
                    >
                      {s.tier}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge variant={statusToBadge(s.status)}>{s.status}</AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 capitalize">
                    {s.provider || 'stripe'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(s.current_period_start)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(s.current_period_end)}
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
        baseUrl="/admin/subscriptions"
        searchParams={{ tier, status }}
      />
    </div>
  );
}
