'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ContentProject } from '@/types';

export default function SEOAuditPage() {
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const avgScore =
    projects.length > 0
      ? Math.round(projects.reduce((acc, p) => acc + (p.seo_score || 0), 0) / projects.length)
      : 92;

  const topPerforming = projects.filter(p => (p.seo_score || 0) >= 90);
  const needsAttention = projects.filter(p => (p.seo_score || 0) < 85);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Local SEO Audit &amp; Optimization Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated checklist analysis of local ranking signals across your content inventory.
          </p>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Average Local SEO Score</span>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white mb-2">{avgScore} / 100</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${avgScore}%` }} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">High Authority (90+ Score)</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 mb-1">
              {topPerforming.length} Articles
            </div>
            <span className="text-[11px] text-slate-400">Prime for Google 3-Pack</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Optimization Opportunities</span>
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 mb-1">
              {needsAttention.length} Articles
            </div>
            <span className="text-[11px] text-slate-400">Headings or metadata need tuning</span>
          </div>
        </div>

        {/* Local Signals Audit Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Standard Local SEO Checklist Applied
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" /> Primary Geo-Keyword
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Appears in the H1 title, opening paragraph, and at least one H2 subheading.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" /> Geo-Relevance &amp; Landmark Signals
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                City name and neighborhood identifiers naturally woven throughout the body copy.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" /> Schema-Ready FAQs
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Frequently asked local questions formatted for Google Rich Snippets capture.
              </p>
            </div>
          </div>
        </div>

        {/* Project Audit Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 bg-slate-950/40">
            <h3 className="text-sm font-bold text-white">Content Audit Roster</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Article &amp; Location</th>
                  <th className="py-3 px-4 font-semibold">Focus Keyword</th>
                  <th className="py-3 px-4 font-semibold">SEO Score</th>
                  <th className="py-3 px-4 font-semibold">Audit Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-200 truncate">{p.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{p.target_location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {p.primary_keyword}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-black text-sm ${
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
                    <td className="py-3.5 px-4">
                      {p.seo_score >= 90 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Fully Optimized
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                          <AlertCircle className="h-3 w-3" /> Can Improve
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/content/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <span>Audit in Editor &rarr;</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
