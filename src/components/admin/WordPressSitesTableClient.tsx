'use client';

import React, { useState } from 'react';
import { Globe, RefreshCw, Unlink, Eye, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { AdminWordPressSite } from '@/lib/admin/data';
import { AdminBadge, statusToBadge } from './AdminUI';
import { formatDate } from '@/lib/utils';

interface WordPressSitesTableClientProps {
  sites: AdminWordPressSite[];
}

export function WordPressSitesTableClient({ sites }: WordPressSitesTableClientProps) {
  const [selectedSite, setSelectedSite] = useState<AdminWordPressSite | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ id: string; success: boolean; text: string } | null>(null);

  const handleTestConnection = async (siteId: string) => {
    setTestingId(siteId);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/wordpress/${siteId}/test`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          id: siteId,
          success: true,
          text: `Verified! Authenticated as "${data.displayName || 'Authorized User'}"`,
        });
      } else {
        setActionMessage({
          id: siteId,
          success: false,
          text: data.errorMessage || data.error || 'Connection verification failed',
        });
      }
    } catch {
      setActionMessage({ id: siteId, success: false, text: 'Network error verifying site' });
    } finally {
      setTestingId(null);
    }
  };

  const handleDisconnect = async (siteId: string) => {
    if (!confirm('Are you sure you want to disconnect this WordPress connection?')) return;
    setDisconnectingId(siteId);
    setActionMessage(null);
    try {
      const res = await fetch(`/api/admin/wordpress/${siteId}/disconnect`, { method: 'POST' });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to disconnect');
      }
    } finally {
      setDisconnectingId(null);
    }
  };

  if (sites.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 text-xs">
        No WordPress sites connected yet.
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
                Website
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                REST Connection
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Last Verified
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {sites.map((s) => (
              <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{s.name}</div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline font-mono"
                      >
                        {s.url}
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-300">
                  {s.organizationName}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge variant={statusToBadge(s.status)}>{s.status}</AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <AdminBadge variant={s.wp_status === 'active' ? 'success' : 'warning'}>
                    {s.wp_status || 'Pending'}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {s.last_verified_at ? formatDate(s.last_verified_at) : 'Never'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedSite(s)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                      title="Inspect metadata"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      disabled={testingId === s.id}
                      onClick={() => handleTestConnection(s.id)}
                      className="rounded-lg p-1.5 text-purple-400 hover:bg-purple-500/10 transition-colors"
                      title="Test Connection"
                    >
                      {testingId === s.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      disabled={disconnectingId === s.id}
                      onClick={() => handleDisconnect(s.id)}
                      className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Disconnect Site"
                    >
                      {disconnectingId === s.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Unlink className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action feedback toast */}
      {actionMessage && (
        <div
          className={`mt-4 rounded-lg p-3 text-xs flex items-center gap-2 ${
            actionMessage.success
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {actionMessage.success ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Inspect Safe Metadata Modal */}
      {selectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">{selectedSite.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSite(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Website ID:</span>
                <p className="font-mono text-slate-300 select-all">{selectedSite.id}</p>
              </div>
              <div>
                <span className="text-slate-500">Target URL:</span>
                <p className="font-mono text-cyan-400">{selectedSite.url}</p>
              </div>
              <div>
                <span className="text-slate-500">Organization:</span>
                <p className="text-slate-200">{selectedSite.organizationName}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-slate-500">Connection:</span>
                  <div className="mt-1">
                    <AdminBadge variant={statusToBadge(selectedSite.status)}>
                      {selectedSite.status}
                    </AdminBadge>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">REST Status:</span>
                  <div className="mt-1">
                    <AdminBadge variant="purple">{selectedSite.wp_status || 'Pending'}</AdminBadge>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-slate-500">Connected Date:</span>
                <p className="text-slate-300">{formatDate(selectedSite.created_at)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-slate-900/60 p-3 border border-slate-800/80 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Security Isolation:</span>
              <p className="mt-0.5">
                Passwords and application keys are encrypted at rest with AES-256-GCM and never exposed via API or client UI.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedSite(null)}
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
