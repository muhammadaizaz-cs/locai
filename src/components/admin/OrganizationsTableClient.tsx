'use client';

import React, { useState } from 'react';
import { Eye, Ban, CheckCircle, X, Building2, Globe, Users, FileText, Loader2, AlertCircle } from 'lucide-react';
import { AdminOrganization } from '@/lib/admin/data';
import { AdminBadge } from './AdminUI';
import { formatDate } from '@/lib/utils';

interface OrganizationsTableClientProps {
  organizations: AdminOrganization[];
}

export function OrganizationsTableClient({ organizations }: OrganizationsTableClientProps) {
  const [selectedOrg, setSelectedOrg] = useState<AdminOrganization | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggleStatus = async (org: AdminOrganization) => {
    setActionLoading(org.id);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/organizations/${org.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }
      window.location.reload();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating organization');
    } finally {
      setActionLoading(null);
    }
  };

  if (organizations.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 text-xs">
        No organizations found in the database.
      </div>
    );
  }

  return (
    <>
      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="min-w-full divide-y divide-slate-800/80">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Organization
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Plan
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Members
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Websites
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Content
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
            {organizations.map((org) => {
              const tier = org.subscription?.tier || 'FREE';
              return (
                <tr key={org.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{org.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">/{org.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge
                      variant={
                        tier === 'AGENCY'
                          ? 'amber'
                          : tier === 'PRO'
                            ? 'purple'
                            : tier === 'STARTER'
                              ? 'info'
                              : 'default'
                      }
                    >
                      {tier}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300 font-mono">
                    {org.memberCount}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300 font-mono">
                    {org.websiteCount}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300 font-mono">
                    {org.contentCount}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(org.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrg(org)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        title="Inspect organization"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        disabled={actionLoading === org.id}
                        onClick={() => handleToggleStatus(org)}
                        className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/10 transition-colors"
                        title="Suspend / Reactivate"
                      >
                        {actionLoading === org.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Ban className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Inspect Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">{selectedOrg.name}</h3>
              </div>
              <button
                onClick={() => setSelectedOrg(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800/80">
                <span className="text-slate-500 text-[11px]">Organization ID</span>
                <p className="mt-1 font-mono text-slate-300 select-all truncate">
                  {selectedOrg.id}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800/80">
                <span className="text-slate-500 text-[11px]">Slug / Namespace</span>
                <p className="mt-1 font-mono text-slate-300">/{selectedOrg.slug}</p>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800/80">
                <span className="text-slate-500 text-[11px]">Subscription Plan</span>
                <div className="mt-1">
                  <AdminBadge variant="purple">{selectedOrg.subscription?.tier || 'FREE'}</AdminBadge>
                </div>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-3 border border-slate-800/80">
                <span className="text-slate-500 text-[11px]">Created Date</span>
                <p className="mt-1 text-slate-300">{formatDate(selectedOrg.created_at)}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-slate-900/40 border border-slate-800/80 p-4">
              <span className="text-xs font-semibold text-slate-300">Tenant Resources</span>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-950/60 p-2.5">
                  <span className="text-[10px] text-slate-500">Members</span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {selectedOrg.memberCount}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950/60 p-2.5">
                  <span className="text-[10px] text-slate-500">Connected Sites</span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {selectedOrg.websiteCount}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950/60 p-2.5">
                  <span className="text-[10px] text-slate-500">Content Pieces</span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {selectedOrg.contentCount}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-500">
              * Note: Private credentials, encryption keys, and customer database secrets are isolated by RLS and not displayed.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedOrg(null)}
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
