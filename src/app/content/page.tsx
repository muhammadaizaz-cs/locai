'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  Search,
  Filter,
  Globe,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpDown,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ContentProject, PostStatus } from '@/types';
import { formatDate } from '@/lib/utils';

const STATUS_FILTERS: { label: string; value: PostStatus | 'ALL' }[] = [
  { label: 'All Content', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'In Review', value: 'REVIEW' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export default function ContentLibraryPage() {
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<PostStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadContent() {
      try {
        const queryParams = new URLSearchParams();
        if (activeStatus !== 'ALL') queryParams.append('status', activeStatus);
        if (searchQuery) queryParams.append('search', searchQuery);

        const res = await fetch(`/api/content?${queryParams.toString()}`);
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

    loadContent();
  }, [activeStatus, searchQuery]);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Content Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse, manage, edit, and publish your AI-generated local SEO content assets.
            </p>
          </div>

          <Link
            href="/content/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all self-start sm:self-auto"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate New Content</span>
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {STATUS_FILTERS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveStatus(tab.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeStatus === tab.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, title, or city..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="text-center text-xs text-slate-400">Loading content projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No content projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6">
              {searchQuery || activeStatus !== 'ALL'
                ? 'Try adjusting your search filters or status selection.'
                : 'Create your first piece of local SEO content and publish directly to WordPress.'}
            </p>
            <Link
              href="/content/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create Content Now</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Title &amp; Target Query</th>
                    <th className="py-3.5 px-4 font-semibold">Format</th>
                    <th className="py-3.5 px-4 font-semibold">Location</th>
                    <th className="py-3.5 px-4 font-semibold">SEO Score</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">WordPress Sync</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {projects.map(p => (
                    <tr key={p.id} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 max-w-xs">
                        <Link
                          href={`/content/${p.id}`}
                          className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1 text-sm"
                        >
                          {p.title}
                        </Link>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          Focus: <span className="text-slate-300 font-medium">{p.primary_keyword}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-semibold">
                          {p.content_type.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-300">
                        {p.target_location}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            p.seo_score >= 90
                              ? 'text-emerald-400'
                              : p.seo_score >= 80
                              ? 'text-blue-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {p.seo_score} / 100
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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

                      <td className="py-4 px-4 whitespace-nowrap">
                        {p.wordpress_post ? (
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                            <a
                              href={p.wordpress_post.wp_url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <span>WP #{p.wordpress_post.wp_post_id}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Not Synced</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/content/${p.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <span>Open Editor</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
