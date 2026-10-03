'use client';

import React, { useState } from 'react';
import { HeadphonesIcon, Eye, X, Loader2, CheckCircle2 } from 'lucide-react';
import { SupportTicket } from '@/lib/admin/data';
import { AdminBadge, statusToBadge, priorityToBadge } from './AdminUI';
import { formatDate } from '@/lib/utils';

interface SupportTicketsClientProps {
  tickets: SupportTicket[];
}

export function SupportTicketsClient({ tickets }: SupportTicketsClientProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setUpdatingId(ticketId);
    try {
      const res = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update ticket');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 text-xs">
        <HeadphonesIcon className="mx-auto h-8 w-8 text-slate-500 mb-2" />
        <p className="text-sm font-semibold text-slate-300">No Support Tickets</p>
        <p className="text-xs text-slate-500 mt-1">There are currently no customer support requests recorded in the queue.</p>
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
                Ticket #
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Customer / Org
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Priority
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
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-4 py-3 text-xs font-mono font-bold text-purple-400">
                  {t.ticket_number}
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-white max-w-xs truncate">
                  {t.subject}
                </td>
                <td className="px-4 py-3 text-xs text-slate-300">
                  <div>{t.userName || t.userEmail || 'Customer'}</div>
                  <div className="text-[11px] text-slate-500">{t.organizationName || 'Global'}</div>
                </td>
                <td className="px-4 py-3">
                  <AdminBadge variant={statusToBadge(t.status)}>{t.status}</AdminBadge>
                </td>
                <td className="px-4 py-3">
                  <AdminBadge variant={priorityToBadge(t.priority)}>{t.priority}</AdminBadge>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {formatDate(t.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                      title="Inspect Ticket"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {t.status !== 'RESOLVED' && t.status !== 'CLOSED' && (
                      <button
                        disabled={updatingId === t.id}
                        onClick={() => handleStatusChange(t.id, 'RESOLVED')}
                        className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Mark Resolved"
                      >
                        {updatingId === t.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-400">
                  {selectedTicket.ticket_number}
                </span>
                <span className="text-slate-600">•</span>
                <h3 className="text-sm font-bold text-white truncate max-w-xs">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex gap-4">
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="mt-1">
                    <AdminBadge variant={statusToBadge(selectedTicket.status)}>
                      {selectedTicket.status}
                    </AdminBadge>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Priority:</span>
                  <div className="mt-1">
                    <AdminBadge variant={priorityToBadge(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </AdminBadge>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Created:</span>
                  <p className="mt-1 text-slate-300">{formatDate(selectedTicket.created_at)}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500">Requester:</span>
                <p className="text-slate-200">
                  {selectedTicket.userName || 'Unknown'} ({selectedTicket.userEmail || 'No email'})
                </p>
              </div>

              <div>
                <span className="text-slate-500">Organization:</span>
                <p className="text-slate-200">{selectedTicket.organizationName || 'N/A'}</p>
              </div>

              <div>
                <span className="text-slate-500">Description:</span>
                <div className="mt-1 max-h-48 overflow-y-auto rounded-lg bg-slate-900/80 p-3 text-slate-300 whitespace-pre-wrap border border-slate-800">
                  {selectedTicket.description}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-2">
                {selectedTicket.status !== 'RESOLVED' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedTicket.id, 'RESOLVED');
                      setSelectedTicket(null);
                    }}
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Resolve Ticket
                  </button>
                )}
                {selectedTicket.status !== 'CLOSED' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedTicket.id, 'CLOSED');
                      setSelectedTicket(null);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Close
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
