'use client';

import React, { useState } from 'react';
import { FileText, Eye, X, ExternalLink, BarChart3, Building2, User } from 'lucide-react';
import { AdminContentItem } from '@/lib/admin/data';
import { AdminBadge, statusToBadge } from './AdminUI';
import { formatDate } from '@/lib/utils';

interface ContentTableClientProps {
  content: AdminContentItem[];
}

export function ContentTableClient({ content }: ContentTableClientProps) {
  const [selectedItem, setSelectedItem] = useState<AdminContentItem | null>(null);

  if (content.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 text-xs">
        No content items found matching the query.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="min-w-full divide-y divide-slate-800/80">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Title & Topic
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                SEO Score
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Created
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {content.map((c) => (
              <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 max-w-md">
                      <div className="text-xs font-semibold text-white truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Author: {c.authorName || 'AI Engine'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-300">
                  {c.organizationName}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    {c.content_type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminBadge variant={statusToBadge(c.status)}>{c.status}</AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                    <BarChart3 className="h-3 w-3" />
                    <span>{c.seo_score}/100</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {formatDate(c.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setSelectedItem(c)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    title="View Content Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Content Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-sm">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Project ID:</span>
                <p className="font-mono text-slate-300 select-all">{selectedItem.id}</p>
              </div>
              <div>
                <span className="text-slate-500">Organization:</span>
                <p className="text-slate-200">{selectedItem.organizationName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">Content Type:</span>
                  <p className="font-mono text-slate-300">{selectedItem.content_type}</p>
                </div>
                <div>
                  <span className="text-slate-500">Current Status:</span>
                  <div className="mt-1">
                    <AdminBadge variant={statusToBadge(selectedItem.status)}>
                      {selectedItem.status}
                    </AdminBadge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500">SEO Score:</span>
                  <p className="text-emerald-400 font-bold">{selectedItem.seo_score} / 100</p>
                </div>
                <div>
                  <span className="text-slate-500">Created:</span>
                  <p className="text-slate-300">{formatDate(selectedItem.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-slate-900/60 p-3 border border-slate-800/80 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Safety Rule:</span>
              <p className="mt-0.5">
                Admins have read-only inspection access to customer content drafts to protect tenant intellectual property.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
