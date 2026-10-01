'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Building2,
  Globe,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Business, Website, ContentType, AIProviderType } from '@/types';
import { CONTENT_TYPE_LABELS } from '@/lib/constants';

export default function CreateContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);

  // Form State
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [selectedWebsiteId, setSelectedWebsiteId] = useState('');
  const [contentType, setContentType] = useState<ContentType>('LOCAL_SERVICE_PAGE');
  const [topic, setTopic] = useState('Emergency plumbing repairs, frozen and burst pipes, and 24/7 fast dispatch');
  const [targetLocation, setTargetLocation] = useState('Mardan');
  const [primaryKeyword, setPrimaryKeyword] = useState('Emergency Plumbing Services in Mardan');
  const [secondaryKeywords, setSecondaryKeywords] = useState('24/7 plumber Mardan, burst pipe repair, local licensed plumber');
  const [tone, setTone] = useState('Authoritative, Reassuring, and Highly Professional');
  const [provider, setProvider] = useState<AIProviderType>('openai');
  const [additionalInstructions, setAdditionalInstructions] = useState('Emphasize rapid 35-minute average arrival time, upfront pricing, and zero travel fees.');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [bizRes, webRes] = await Promise.all([
          fetch('/api/businesses'),
          fetch('/api/websites'),
        ]);

        const bizData = await bizRes.json();
        const webData = await webRes.json();

        if (bizData.businesses?.length > 0) {
          setBusinesses(bizData.businesses);
          setSelectedBusinessId(bizData.businesses[0].id);
          setTargetLocation(bizData.businesses[0].city);
        }

        if (webData.websites?.length > 0) {
          setWebsites(webData.websites);
          setSelectedWebsiteId(webData.websites[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  // Update target city if business selection changes
  const handleBusinessChange = (bizId: string) => {
    setSelectedBusinessId(bizId);
    const found = businesses.find(b => b.id === bizId);
    if (found) {
      setTargetLocation(found.city);
      setPrimaryKeyword(`${found.services[0] || 'Services'} in ${found.city}`);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_id: selectedBusinessId,
          website_id: selectedWebsiteId,
          content_type: contentType,
          topic,
          target_location: targetLocation,
          primary_keyword: primaryKeyword,
          secondary_keywords: secondaryKeywords.split(',').map(s => s.trim()).filter(Boolean),
          tone,
          additional_instructions: additionalInstructions,
          provider,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate content');
      }

      // Navigate straight to the new project editor
      router.push(`/content/${data.project.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Content generation failed');
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>AI Local Content Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Generate Local SEO Content
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Craft localized, high-ranking pages with automated geo-signals, structured FAQs, and 1-click WordPress sync.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-8">
          {/* Step 1: Business and Target Website */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                1
              </span>
              Target Business &amp; WordPress Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Local Business Profile
                </label>
                <select
                  value={selectedBusinessId}
                  onChange={e => handleBusinessChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city}, {b.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target WordPress Website
                </label>
                <select
                  value={selectedWebsiteId}
                  onChange={e => setSelectedWebsiteId(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {websites.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.url})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Content Type Selection */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                2
              </span>
              Select Content Format
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(CONTENT_TYPE_LABELS).map(([key, item]) => {
                const isSelected = contentType === key;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setContentType(key as ContentType)}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-1">{item.label}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: SEO Parameters & Local Targeting */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                3
              </span>
              Local Keyword &amp; Geo-Targeting
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Keyword (Target Query) *
                </label>
                <input
                  type="text"
                  required
                  value={primaryKeyword}
                  onChange={e => setPrimaryKeyword(e.target.value)}
                  placeholder="e.g. Emergency Plumbing Services in Mardan"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target City or Neighborhood *
                </label>
                <input
                  type="text"
                  required
                  value={targetLocation}
                  onChange={e => setTargetLocation(e.target.value)}
                  placeholder="e.g. Mardan, Peshawar, Swat"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Secondary Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={secondaryKeywords}
                  onChange={e => setSecondaryKeywords(e.target.value)}
                  placeholder="e.g. 24/7 plumber Mardan, burst pipe repair, water heater replacement"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Topic &amp; Specific Customer Problem
                </label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="What specific problem is the local customer facing?"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 4: AI Engine & Tone */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                4
              </span>
              Voice &amp; AI Provider Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  AI Model Engine
                </label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value as AIProviderType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="openai">OpenAI (GPT-4o Mini / Turbo)</option>
                  <option value="deepseek">DeepSeek (V3 / Reasoner)</option>
                  <option value="grok">Grok (xAI Grok Beta)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Brand Tone of Voice
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  placeholder="e.g. Authoritative, Friendly, Reassuring"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Local Highlights &amp; Trust Factors
                </label>
                <input
                  type="text"
                  value={additionalInstructions}
                  onChange={e => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. Mention 35-min response time, free estimates, certified master plumbers"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-500 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Generating Local SEO Content...' : 'Generate Content & Open Editor'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
