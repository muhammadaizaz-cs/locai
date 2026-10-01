'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Globe,
  FileText,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Building2,
  Check,
  Zap,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ContentProject, UsageData, ActivityLog } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [contentRes, wpRes] = await Promise.all([
          fetch('/api/content'),
          fetch('/api/websites'),
        ]);

        const contentData = await contentRes.json();
        if (contentData.success) {
          setProjects(contentData.projects);
        }

        // Mock usage defaults for dashboard
        setUsage({
          organization_id: 'org_locai_demo_default',
          period_start: new Date().toISOString(),
          period_end: new Date().toISOString(),
          generations_count: 127,
          generations_limit: 500,
          wordpress_publishes_count: 84,
          wordpress_publishes_limit: 300,
          websites_count: 3,
          websites_limit: 5,
        });

        setActivities([
          {
            id: 'act-1',
            organization_id: 'org',
            action: 'Published "Emergency Plumbing Services in Mardan" to WordPress',
            entity_type: 'content_project',
            created_at: '2 hours ago',
          },
          {
            id: 'act-2',
            organization_id: 'org',
            action: 'Generated 620-word Local Service Page for Apex Plumbing',
            entity_type: 'content_project',
            created_at: '4 hours ago',
          },
          {
            id: 'act-3',
            organization_id: 'org',
            action: 'Connected WordPress REST API for apexplumbingpros.com',
            entity_type: 'website',
            created_at: '1 day ago',
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalPublished = projects.filter(p => p.status === 'PUBLISHED').length || 84;
  const totalScheduled = projects.filter(p => p.status === 'SCHEDULED').length || 12;
  const remainingGenerations = usage ? usage.generations_limit - usage.generations_count : 373;

  return (
    <DashboardShell>
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, Alex
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
              Agency Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Here is your local SEO publishing overview and current performance metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/content/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Quick Generate</span>
          </Link>

          <Link
            href="/websites"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>Connect WordPress</span>
          </Link>

          <Link
            href="/billing"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Upgrade</span>
          </Link>
        </div>
      </div>

      {/* Onboarding Progress Guide */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-slate-900 p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Onboarding Checklist: Launch Your Local Content Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              3 of 4 setup milestones completed. Publish your first article to finish setup!
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            75% Complete
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-3 w-3" />
            </div>
            <span>1. Create Business</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-3 w-3" />
            </div>
            <span>2. Connect WordPress</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Check className="h-3 w-3" />
            </div>
            <span>3. Generate Article</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-medium">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-[10px]">
              4
            </div>
            <span>4. Review &amp; Publish</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">AI Generations</span>
            <Sparkles className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">127 / 500</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(127 / 500) * 100}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Remaining Credits</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mb-1">{remainingGenerations}</div>
          <span className="text-[11px] text-slate-400">Resets in 18 days</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Connected Websites</span>
            <Globe className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">3 / 5</div>
          <span className="text-[11px] text-slate-400">2 slots available</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Published Content</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalPublished}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Live on WordPress</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Scheduled Posts</span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mb-1">{totalScheduled}</div>
          <span className="text-[11px] text-slate-400">Queued in calendar</span>
        </div>
      </div>

      {/* Main Content & Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Content Table (Left 2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Recent Content Projects</h2>
              <p className="text-xs text-slate-400">
                Manage, edit, and sync your generated articles with WordPress.
              </p>
            </div>
            <Link
              href="/content"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Title &amp; Target</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">SEO Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.slice(0, 5).map(p => (
                  <tr key={p.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pr-3">
                      <Link
                        href={`/content/${p.id}`}
                        className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {p.target_location} &bull; {p.primary_keyword}
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400 whitespace-nowrap">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                        {p.content_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          p.seo_score >= 90
                            ? 'text-emerald-400'
                            : p.seo_score >= 80
                            ? 'text-blue-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {p.seo_score}/100
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : p.status === 'SCHEDULED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : p.status === 'APPROVED'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <Link
                        href={`/content/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Open Editor
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Activity Stream & Quick Launch */}
        <div className="space-y-6">
          {/* Quick Generate Card */}
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-md">
            <h3 className="text-sm font-bold text-white mb-1">Create Local Service Page</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Target a new city or suburb with high-intent keywords in seconds.
            </p>
            <Link
              href="/content/create"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch AI Studio</span>
            </Link>
          </div>

          {/* Activity Logs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Audit &amp; Activity Log</h3>
            <div className="space-y-4">
              {activities.map(act => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium leading-relaxed">{act.action}</p>
                    <span className="text-[10px] text-slate-500">{act.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
