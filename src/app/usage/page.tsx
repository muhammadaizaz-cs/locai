'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, Sparkles, Globe, Calendar, ArrowUpRight, Zap } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function UsagePage() {
  const usageStats = {
    generations_used: 127,
    generations_limit: 500,
    publishes_used: 84,
    publishes_limit: 300,
    websites_used: 3,
    websites_limit: 5,
    reset_days: 18,
  };

  const contentBreakdown = [
    { type: 'Local Service Pages', count: 48, percentage: 38 },
    { type: 'Location / Geo Landing Pages', count: 32, percentage: 25 },
    { type: 'Service + Location Combinations', count: 24, percentage: 19 },
    { type: 'Local Blog Guides & FAQs', count: 23, percentage: 18 },
  ];

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Usage &amp; Quotas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time server-enforced tracking of your AI generation and publishing capacities.
            </p>
          </div>

          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 self-start sm:self-auto"
          >
            <Zap className="h-4 w-4" />
            <span>Increase Limits</span>
          </Link>
        </div>

        {/* 3 Main Meters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">AI Content Generations</span>
              <Sparkles className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {usageStats.generations_used}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {usageStats.generations_limit}</span>
              </div>
              <div className="text-[11px] text-blue-400 font-medium mt-1">
                {usageStats.generations_limit - usageStats.generations_used} credits remaining
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(usageStats.generations_used / usageStats.generations_limit) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">WordPress Publishes</span>
              <Globe className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {usageStats.publishes_used}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {usageStats.publishes_limit}</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">
                {usageStats.publishes_limit - usageStats.publishes_used} publishes remaining
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${(usageStats.publishes_used / usageStats.publishes_limit) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Connected Sites</span>
              <Globe className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {usageStats.websites_used}{' '}
                <span className="text-xs text-slate-400 font-normal">/ {usageStats.websites_limit}</span>
              </div>
              <div className="text-[11px] text-indigo-400 font-medium mt-1">
                2 additional site slots available
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${(usageStats.websites_used / usageStats.websites_limit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Type Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-sm font-bold text-white mb-6">Usage by Local Content Format</h2>
          <div className="space-y-4">
            {contentBreakdown.map((item, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-300">{item.type}</span>
                  <span className="text-slate-400 font-mono">
                    {item.count} articles ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
