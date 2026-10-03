import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  CreditCard,
  Sparkles,
  Globe,
  FileText,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  ShieldCheck,
  Server,
} from 'lucide-react';
import {
  getAdminStats,
  getAdminActivityLogs,
  getAdminSubscriptions,
  getAdminPayments,
  getAdminAIUsage,
  getAdminSystemSettings,
} from '@/lib/admin/data';
import { AdminStatCard, AdminBadge, AdminCard, statusToBadge } from '@/components/admin/AdminUI';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Admin Dashboard | LocAI Control Center',
  description: 'System overview, KPIs, and operational health for LocAI SaaS platform.',
};

export default async function AdminDashboardPage() {
  const [stats, logsData, subsData, paymentsData, aiUsage, settings] = await Promise.all([
    getAdminStats().catch(() => ({
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      totalOrganizations: 0,
      totalAIGenerations: 0,
      successfulAIGenerations: 0,
      failedAIGenerations: 0,
      totalWordPressSites: 0,
      connectedWordPressSites: 0,
      totalContent: 0,
      publishedContent: 0,
      scheduledContent: 0,
      failedContent: 0,
      openSupportTickets: 0,
      unresolvedAlerts: 0,
      criticalAlerts: 0,
    })),
    getAdminActivityLogs({ pageSize: 6 }).catch(() => ({ logs: [], total: 0 })),
    getAdminSubscriptions({ pageSize: 100 }).catch(() => ({ subscriptions: [], total: 0 })),
    getAdminPayments({ pageSize: 100 }).catch(() => ({ payments: [], total: 0 })),
    getAdminAIUsage().catch(() => ({
      totalGenerations: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      byProvider: {},
      byOrg: [],
      dailyUsage: [],
    })),
    Promise.resolve(getAdminSystemSettings()),
  ]);

  // Subscription Distribution counts
  const subTiers = {
    FREE: 0,
    STARTER: 0,
    PRO: 0,
    AGENCY: 0,
  };
  subsData.subscriptions.forEach((sub) => {
    const tier = (sub.tier || 'FREE').toUpperCase() as keyof typeof subTiers;
    if (subTiers[tier] !== undefined) {
      subTiers[tier]++;
    }
  });
  const totalTierSubs = subsData.subscriptions.length || 1;

  // Revenue calculation from real payments
  const paidPayments = paymentsData.payments.filter((p) => p.status === 'paid');
  const totalRevenueCents = paidPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const revenueDisplay =
    settings.stripeConfigured || settings.paddleConfigured || settings.lemonsqueezyConfigured
      ? paidPayments.length > 0
        ? `$${(totalRevenueCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : '$0.00'
      : 'Integration Pending';

  // Total failed jobs / errors
  const totalErrors = stats.failedAIGenerations + stats.failedContent + stats.unresolvedAlerts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            System overview and platform activity across all customer tenants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/system-alerts"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Alerts ({stats.unresolvedAlerts})</span>
          </Link>
          <Link
            href="/admin/activity-logs"
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <Activity className="h-3.5 w-3.5 text-purple-400" />
            <span>Audit Stream</span>
          </Link>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Users */}
        <AdminStatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active accounts`}
          icon={Users}
          iconColor="text-blue-400"
          trend={{
            value: stats.newUsersThisMonth,
            label: 'new this month',
            positive: stats.newUsersThisMonth > 0,
          }}
        />

        {/* 2. Total Organizations */}
        <AdminStatCard
          title="Total Organizations"
          value={stats.totalOrganizations}
          subtitle="Multi-tenant organizations"
          icon={Building2}
          iconColor="text-indigo-400"
        />

        {/* 3. Active Subscriptions */}
        <AdminStatCard
          title="Active Subscriptions"
          value={subsData.subscriptions.filter((s) => s.status === 'ACTIVE').length}
          subtitle={`${subsData.total} registered plans`}
          icon={CreditCard}
          iconColor="text-emerald-400"
        />

        {/* 4. Monthly AI Generations */}
        <AdminStatCard
          title="Monthly AI Generations"
          value={stats.totalAIGenerations}
          subtitle={`${stats.successfulAIGenerations} completed`}
          icon={Sparkles}
          iconColor="text-purple-400"
        />

        {/* 5. Connected WordPress Sites */}
        <AdminStatCard
          title="Connected WP Sites"
          value={stats.connectedWordPressSites}
          subtitle={`${stats.totalWordPressSites} total registered`}
          icon={Globe}
          iconColor="text-cyan-400"
        />

        {/* 6. Published Content */}
        <AdminStatCard
          title="Published Content"
          value={stats.publishedContent}
          subtitle={`${stats.totalContent} articles & landing pages`}
          icon={FileText}
          iconColor="text-violet-400"
        />

        {/* 7. Revenue */}
        <AdminStatCard
          title="Total Revenue"
          value={revenueDisplay}
          subtitle={
            settings.stripeConfigured || settings.paddleConfigured
              ? 'Processed volume'
              : 'Billing integration pending'
          }
          icon={DollarSign}
          iconColor="text-emerald-400"
        />

        {/* 8. Failed Jobs / Errors */}
        <AdminStatCard
          title="Failed Jobs / Errors"
          value={totalErrors}
          subtitle={`${stats.criticalAlerts} critical system alerts`}
          icon={AlertTriangle}
          iconColor={totalErrors > 0 ? 'text-red-400' : 'text-slate-400'}
        />
      </div>

      {/* Grid: Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A. User Growth & Activity */}
        <AdminCard
          title="User Growth & Platform Scale"
          action={
            <Link
              href="/admin/users"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
            >
              View Users <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                <span className="text-[11px] font-medium text-slate-400">Total Registered</span>
                <p className="text-xl font-bold text-white mt-1">{stats.totalUsers}</p>
              </div>
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                <span className="text-[11px] font-medium text-slate-400">Active Accounts</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">{stats.activeUsers}</p>
              </div>
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                <span className="text-[11px] font-medium text-slate-400">Joined This Month</span>
                <p className="text-xl font-bold text-blue-400 mt-1">{stats.newUsersThisMonth}</p>
              </div>
            </div>

            {/* Visual Growth Trend Representation */}
            <div className="mt-4 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Account Status Distribution</span>
                <span>
                  {stats.totalUsers > 0
                    ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active`
                    : 'No users yet'}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{
                    width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%`,
                  }}
                  title={`Active: ${stats.activeUsers}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{
                    width: `${stats.totalUsers > 0 ? ((stats.totalUsers - stats.activeUsers) / stats.totalUsers) * 100 : 0}%`,
                  }}
                  title={`Pending / Inactive: ${stats.totalUsers - stats.activeUsers}`}
                />
              </div>
              <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Active Users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Inactive / Suspended</span>
                </div>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* C. Subscription Distribution */}
        <AdminCard
          title="Subscription Distribution"
          action={
            <Link
              href="/admin/subscriptions"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
            >
              Plans <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-3.5">
            {[
              {
                tier: 'Free',
                count: subTiers.FREE,
                color: 'bg-slate-400',
                text: 'text-slate-300',
              },
              {
                tier: 'Starter',
                count: subTiers.STARTER,
                color: 'bg-blue-500',
                text: 'text-blue-400',
              },
              {
                tier: 'Pro',
                count: subTiers.PRO,
                color: 'bg-purple-500',
                text: 'text-purple-400',
              },
              {
                tier: 'Agency',
                count: subTiers.AGENCY,
                color: 'bg-amber-500',
                text: 'text-amber-400',
              },
            ].map((plan) => {
              const pct = Math.round((plan.count / totalTierSubs) * 100);
              return (
                <div key={plan.tier} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">{plan.tier}</span>
                    <span className="text-slate-400">
                      {plan.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${plan.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
              <span>Total Tracked Plans</span>
              <span className="font-semibold text-slate-300">{subsData.total}</span>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Grid: AI Usage & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* B. AI Usage by Provider */}
        <AdminCard
          title="AI Generation Engine Status"
          action={
            <Link
              href="/admin/ai-usage"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
            >
              Usage Reports <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                <span className="text-[11px] font-medium text-slate-400">Total Runs</span>
                <p className="text-lg font-bold text-white mt-1">{stats.totalAIGenerations}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">
                  {stats.successfulAIGenerations} success
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                <span className="text-[11px] font-medium text-slate-400">Failed Executions</span>
                <p
                  className={`text-lg font-bold mt-1 ${
                    stats.failedAIGenerations > 0 ? 'text-red-400' : 'text-slate-400'
                  }`}
                >
                  {stats.failedAIGenerations}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Rate limits / errors</p>
              </div>
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                <span className="text-[11px] font-medium text-slate-400">Active Providers</span>
                <p className="text-lg font-bold text-purple-400 mt-1">
                  {
                    [settings.openAIConfigured, settings.deepseekConfigured, settings.grokConfigured]
                      .filter(Boolean).length
                  }{' '}
                  / 3
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">OpenAI, DeepSeek, Grok</p>
              </div>
            </div>

            {/* Provider Breakdown */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-300">Generations by Provider</span>
              <div className="grid grid-cols-3 gap-3">
                {['openai', 'deepseek', 'grok'].map((p) => {
                  const count = (aiUsage.byProvider as Record<string, number>)?.[p] || 0;
                  const isConfigured =
                    p === 'openai'
                      ? settings.openAIConfigured
                      : p === 'deepseek'
                        ? settings.deepseekConfigured
                        : settings.grokConfigured;
                  return (
                    <div
                      key={p}
                      className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-slate-300">{p}</span>
                        <span
                          className={`h-2 w-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-slate-600'}`}
                        />
                      </div>
                      <p className="text-lg font-bold text-white mt-1.5">{count}</p>
                      <span className="text-[10px] text-slate-500">
                        {isConfigured ? 'API Connected' : 'Not configured'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AdminCard>

        {/* E. System Health Indicators */}
        <AdminCard
          title="System Health & Infrastructure"
          action={
            <Link
              href="/admin/settings"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
            >
              Config <ArrowUpRight className="h-3 w-3" />
            </Link>
          }
        >
          <div className="space-y-3">
            {[
              {
                name: 'Database (Supabase PostgreSQL)',
                status: settings.supabaseConfigured ? 'HEALTHY' : 'PENDING_CONFIG',
                detail: settings.supabaseConfigured ? 'Connected & RLS active' : 'Credentials pending',
              },
              {
                name: 'Authentication (Supabase Auth)',
                status: settings.supabaseConfigured ? 'HEALTHY' : 'PENDING_CONFIG',
                detail: 'Session tokens & role verification',
              },
              {
                name: 'AI Services (OpenAI / DeepSeek / Grok)',
                status:
                  settings.openAIConfigured || settings.deepseekConfigured || settings.grokConfigured
                    ? 'HEALTHY'
                    : 'INCOMPLETE',
                detail: `${
                  [settings.openAIConfigured, settings.deepseekConfigured, settings.grokConfigured]
                    .filter(Boolean).length
                } of 3 APIs active`,
              },
              {
                name: 'WordPress Integration (REST API)',
                status: settings.wordpressEncryptionConfigured ? 'HEALTHY' : 'ATTENTION',
                detail: settings.wordpressEncryptionConfigured
                  ? 'AES-256-GCM encrypted'
                  : 'Encryption key pending',
              },
              {
                name: 'Billing (Stripe / Paddle / Lemon)',
                status:
                  settings.stripeConfigured || settings.paddleConfigured || settings.lemonsqueezyConfigured
                    ? 'HEALTHY'
                    : 'PENDING_INTEGRATION',
                detail: settings.stripeConfigured
                  ? 'Stripe webhook active'
                  : 'Gateway credentials pending',
              },
            ].map((srv) => (
              <div
                key={srv.name}
                className="flex items-center justify-between border-b border-slate-800/60 pb-2.5 last:border-0"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-slate-200 truncate">{srv.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{srv.detail}</p>
                </div>
                <AdminBadge
                  variant={
                    srv.status === 'HEALTHY'
                      ? 'success'
                      : srv.status === 'ATTENTION'
                        ? 'warning'
                        : 'default'
                  }
                >
                  {srv.status === 'HEALTHY'
                    ? 'Online'
                    : srv.status === 'ATTENTION'
                      ? 'Attention'
                      : 'Pending'}
                </AdminBadge>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* D. Recent Platform Activity */}
      <AdminCard
        title="Recent Platform Activity"
        action={
          <Link
            href="/admin/activity-logs"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
          >
            Full Audit Logs <ArrowUpRight className="h-3 w-3" />
          </Link>
        }
      >
        {logsData.logs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No activity logs recorded yet in the database.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {logsData.logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 shrink-0">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{log.action}</p>
                    <p className="text-[11px] text-slate-500">
                      {log.organizationName || 'System'} • {log.userName || 'Anonymous'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 shrink-0 pl-3">
                  {formatDate(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
