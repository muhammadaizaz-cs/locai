'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PLANS } from '@/lib/constants';
import { BillingProviderType, SubscriptionTier } from '@/types';

export default function BillingPage() {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('PRO');
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<BillingProviderType>('stripe');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleCheckout = async (tier: SubscriptionTier) => {
    if (tier === currentTier) return;
    setProcessing(tier);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          interval,
          provider: selectedProvider,
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error(err);
      setProcessing(null);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Subscription &amp; Billing
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your plan tier, generation quotas, and multi-provider payment settings.
            </p>
          </div>

          {/* Active Plan Badge */}
          <div className="flex items-center gap-2 rounded-xl bg-blue-500/10 border border-blue-500/30 px-4 py-2 self-start sm:self-auto">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Current Plan: {PLANS[currentTier]?.name}</span>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Tier
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {PLANS[currentTier]?.name} Plan ($29/mo)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Next automatic renewal on October 27, 2026.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly AI Generations:</span>
                <span className="font-bold text-white">127 / 500 used</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(127 / 500) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>373 remaining this cycle</span>
                <span>Reset in 18 days</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Connected Websites:</span>
                <span className="font-bold text-white">3 / 5 sites</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '60%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>2 website slots open</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Provider & Interval Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          {/* Provider selector */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-semibold">Billing Gateway:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
              {(['stripe', 'paddle', 'lemonsqueezy'] as BillingProviderType[]).map(prov => (
                <button
                  key={prov}
                  onClick={() => setSelectedProvider(prov)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                    selectedProvider === prov
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {prov === 'lemonsqueezy' ? 'Lemon Squeezy' : prov}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly / Annual toggle */}
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setInterval('monthly')}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                interval === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval('annual')}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                interval === 'annual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual (20% Off)
            </button>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(PLANS).map(plan => {
            const price = interval === 'monthly' ? plan.priceMonthly : Math.round(plan.priceAnnual / 12);
            const isCurrent = plan.id === currentTier;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-950/20 shadow-md ring-1 ring-blue-500'
                    : isPopular
                    ? 'border-slate-700 bg-slate-900/80'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                {isPopular && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase shadow-md">
                    Recommended
                  </span>
                )}

                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase shadow-md">
                    Current Plan
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 h-8">{plan.description}</p>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${price}</span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>

                  <div className="space-y-2.5 border-t border-slate-800 pt-5 text-xs text-slate-300">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCheckout(plan.id as SubscriptionTier)}
                  disabled={isCurrent || processing === plan.id}
                  className={`mt-8 w-full rounded-xl py-2.5 text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-500'
                  }`}
                >
                  {isCurrent
                    ? 'Active Plan'
                    : processing === plan.id
                    ? 'Processing...'
                    : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
