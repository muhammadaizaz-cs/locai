import React from 'react';
import { getAdminAIUsage, getAdminSystemSettings } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { AdminCard, AdminBadge } from '@/components/admin/AdminUI';
import { Sparkles, Cpu, Zap, Building2, BarChart2, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'AI Usage & Token Metrics | LocAI Admin',
  description: 'AI model generation metrics, provider utilization, and quotas.',
};

export default async function AdminAIUsagePage() {
  await requireAdmin();

  const [usage, settings] = await Promise.all([
    getAdminAIUsage(),
    Promise.resolve(getAdminSystemSettings()),
  ]);

  const totalRuns = usage.totalGenerations;
  const successRuns = usage.successfulGenerations;
  const failedRuns = usage.failedGenerations;
  const successRate = totalRuns > 0 ? Math.round((successRuns / totalRuns) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            AI Engine & Usage Monitoring
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Token telemetry, model execution analytics, and multi-tenant quota enforcement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-300">
            {successRate}% Success Rate
          </span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Invocations</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalRuns}</p>
          <span className="text-[11px] text-slate-500">Platform-wide generations</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Successful Runs</span>
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{successRuns}</p>
          <span className="text-[11px] text-slate-500">Completed content drafts</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Failed Executions</span>
            <ShieldAlert className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">{failedRuns}</p>
          <span className="text-[11px] text-slate-500">Errors & rate limits</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Quota Validation</span>
            <Cpu className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2">Active</p>
          <span className="text-[11px] text-slate-500">Server-side strict limits</span>
        </div>
      </div>

      {/* Grid: Provider breakdown & Top Organization Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Providers */}
        <AdminCard title="Usage by AI Provider">
          <div className="space-y-4">
            {[
              {
                id: 'openai',
                name: 'OpenAI (GPT-4o, GPT-4o-mini)',
                count: usage.byProvider['openai'] || 0,
                configured: settings.openAIConfigured,
                badgeColor: 'purple' as const,
              },
              {
                id: 'deepseek',
                name: 'DeepSeek (Chat & Reasoner)',
                count: usage.byProvider['deepseek'] || 0,
                configured: settings.deepseekConfigured,
                badgeColor: 'info' as const,
              },
              {
                id: 'grok',
                name: 'Grok (xAI Grok-2)',
                count: usage.byProvider['grok'] || 0,
                configured: settings.grokConfigured,
                badgeColor: 'amber' as const,
              },
            ].map((p) => {
              const pct = totalRuns > 0 ? Math.round((p.count / totalRuns) * 100) : 0;
              return (
                <div key={p.id} className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      <AdminBadge variant={p.badgeColor}>
                        {p.configured ? 'API Connected' : 'Not Configured'}
                      </AdminBadge>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {p.count} runs ({pct}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>

        {/* Top Organizations */}
        <AdminCard title="Usage by Organization (Top Consumers)">
          {usage.byOrg.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No organization generation activity recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {usage.byOrg.map((org, index) => {
                const pct = totalRuns > 0 ? Math.round((org.count / totalRuns) * 100) : 0;
                return (
                  <div key={org.orgId} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[11px] font-bold text-slate-500 w-4">{index + 1}.</span>
                      <Building2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {org.orgName}
                      </span>
                    </div>
                    <div className="text-right shrink-0 pl-3">
                      <span className="text-xs font-mono font-bold text-white">{org.count} runs</span>
                      <span className="block text-[10px] text-slate-500">{pct}% share</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Server-side Quota Policy Notice */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">Server-Side Quota Enforcement Rule:</p>
        <p className="mt-1">
          Usage counters and limits are verified and incremented atomically on the backend in PostgreSQL before calling AI providers.
          Browser requests cannot bypass organization generation limits. Rate limits, token thresholds, and provider model locks are enforced at API boundaries.
        </p>
      </div>
    </div>
  );
}
