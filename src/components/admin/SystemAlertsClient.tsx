'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Check, Loader2 } from 'lucide-react';
import { SystemAlert } from '@/lib/admin/data';
import { AdminBadge, severityToBadge } from './AdminUI';
import { formatDate } from '@/lib/utils';

interface SystemAlertsClientProps {
  alerts: SystemAlert[];
}

export function SystemAlertsClient({ alerts }: SystemAlertsClientProps) {
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const handleResolve = async (alertId: string) => {
    setResolvingId(alertId);
    try {
      const res = await fetch(`/api/admin/system-alerts/${alertId}/resolve`, {
        method: 'POST',
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to resolve alert');
      }
    } finally {
      setResolvingId(null);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 text-xs">
        <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
        <p className="text-sm font-semibold text-slate-300">All Systems Clear</p>
        <p className="text-xs text-slate-500 mt-1">No active system alerts or unresolved error conditions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
            alert.resolved
              ? 'border-slate-800/60 bg-slate-950/30 opacity-75'
              : alert.severity === 'CRITICAL'
                ? 'border-red-500/30 bg-red-500/5'
                : 'border-slate-800 bg-slate-900/60'
          }`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 mt-0.5 ${
                alert.severity === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400'
                  : alert.severity === 'ERROR'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                <AdminBadge variant={severityToBadge(alert.severity)}>
                  {alert.severity}
                </AdminBadge>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  [{alert.category}]
                </span>
                {alert.resolved && (
                  <AdminBadge variant="success">Resolved</AdminBadge>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">{alert.message}</p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {formatDate(alert.created_at)}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 sm:self-center">
            {!alert.resolved && (
              <button
                disabled={resolvingId === alert.id}
                onClick={() => handleResolve(alert.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {resolvingId === alert.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                )}
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
