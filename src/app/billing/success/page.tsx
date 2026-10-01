'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

function BillingSuccessContent() {
  const searchParams = useSearchParams();
  const tier = searchParams?.get('tier') || 'PRO';

  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-extrabold text-white">
        Subscription Upgraded Successfully!
      </h1>

      <p className="text-xs text-slate-300 leading-relaxed">
        Your organization is now upgraded to the <strong>{tier}</strong> tier. Your AI generation quotas and WordPress publishing limits have been refreshed immediately.
      </p>

      <div className="pt-4 flex flex-col gap-3">
        <Link
          href="/content/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate Local Content Now</span>
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<div className="text-center py-16 text-xs text-slate-400">Loading confirmation...</div>}>
        <BillingSuccessContent />
      </Suspense>
    </DashboardShell>
  );
}
