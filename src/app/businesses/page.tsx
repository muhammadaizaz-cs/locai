'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
  Tag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Business } from '@/types';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const res = await fetch('/api/businesses');
        const data = await res.json();
        if (data.success) {
          setBusinesses(data.businesses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBusinesses();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Local Businesses
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your local business entities, target service areas, and brand voice guidelines.
            </p>
          </div>

          <Link
            href="/businesses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Local Business</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading business profiles...</div>
        ) : businesses.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <Building2 className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No businesses registered</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Create your first local business profile so the AI content engine can generate accurate localized copy.
            </p>
            <Link
              href="/businesses/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Create Business</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businesses.map(b => (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="rounded-md bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                        {b.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1.5">{b.name}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                    {b.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span>
                        {b.city}, {b.state_province} &bull; {b.country}
                      </span>
                    </div>
                    {b.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        <span>{b.phone}</span>
                      </div>
                    )}
                    {b.brand_tone && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                        <span className="text-slate-300 truncate">Tone: {b.brand_tone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 mb-2">Primary Services:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {b.services.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/content/create`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Content</span>
                  </Link>

                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready for AI
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
