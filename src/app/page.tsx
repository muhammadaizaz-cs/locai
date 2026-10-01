'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Zap,
  ShieldCheck,
  FileCheck,
  BarChart,
  Calendar,
  Layers,
  ChevronDown,
  Building,
  Check,
} from 'lucide-react';
import { PLANS, CONTENT_TYPE_LABELS } from '@/lib/constants';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: 'How does LocAI connect to my WordPress site without my normal password?',
      a: 'LocAI uses official WordPress Application Passwords via the native WordPress REST API. You never give us your personal login password. Application passwords are encrypted server-side using AES-256-GCM and can be revoked from your WordPress admin with a single click at any time.',
    },
    {
      q: 'Will the AI generate repetitive or keyword-stuffed articles?',
      a: 'Never. LocAI is specifically trained and engineered for local relevance. Our dynamic prompt architecture infuses your actual business unique selling points, local landmarks, service areas, and natural customer pain points, strictly penalizing keyword stuffing.',
    },
    {
      q: 'Can I review and edit the content before it goes live on WordPress?',
      a: 'Yes, absolutely! Every generated piece goes into the LocAI Rich Content Editor. You can edit text, refine headings, preview SEO scores, create a WordPress Draft first, or schedule it to publish automatically later.',
    },
    {
      q: 'Can I manage multiple local businesses and clients?',
      a: 'Yes. LocAI is built with native multi-tenant architecture. Our Pro and Agency plans allow you to connect multiple businesses and websites, making it the perfect tool for local SEO freelancers and digital agencies.',
    },
    {
      q: 'Which AI providers are supported?',
      a: 'LocAI includes an enterprise provider abstraction supporting OpenAI (GPT-4o), DeepSeek, and Grok. You can use our managed AI engine or bring your own API keys in Settings.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white">
                Loc<span className="text-blue-500">AI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Local SEO &bull; WordPress SaaS
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#content-types" className="hover:text-blue-400 transition-colors">Content Types</a>
            <a href="#wordpress" className="hover:text-blue-400 transition-colors">WordPress Sync</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all hover:scale-[1.02]"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 mb-8 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Multi-Tenant AI Engine &bull; Native WordPress REST API</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Create Local SEO Content.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Publish Directly to WordPress.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            LocAI helps local businesses, freelancers, and SEO agencies generate high-ranking, human-sounding service pages, location hubs, and blog articles—and publishes them directly to WordPress in one click.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all hover:scale-105"
            >
              <span>Start Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              View Pricing
            </a>
          </div>

          {/* Interactive UI Mockup Hero Visual */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-6 shadow-2xl shadow-blue-950/50 backdrop-blur-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-medium text-slate-400">
                  LocAI Studio &bull; Apex Plumbing &bull; Mardan City
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  SEO Score: 96/100
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1 text-xs font-semibold text-white">
                  <Globe className="h-3.5 w-3.5" />
                  Connected to WP
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Business & SEO context */}
              <div className="space-y-4 rounded-xl bg-slate-900/60 p-4 border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Target Parameters
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Content Type:</span>
                    <span className="font-semibold text-blue-400">Local Service Page</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">City / Target:</span>
                    <span className="font-medium text-slate-200">Mardan, KP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Primary Keyword:</span>
                    <span className="font-medium text-emerald-400">Emergency Plumbing Services</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Brand Tone:</span>
                    <span className="text-slate-300">Authoritative &amp; Reassuring</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-2">SEO Signals Verified</div>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Check className="h-3 w-3" /> Keyword in H1 Title &amp; H2 Headings
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Check className="h-3 w-3" /> Target Geo Location in First 100 Words
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Check className="h-3 w-3" /> Schema-ready FAQ Section Included
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle & Right: Generated Content Preview */}
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-xl bg-slate-900/80 p-5 border border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Emergency Plumbing Services in Mardan: 24/7 Rapid Response
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    When a pipe bursts at 2 AM or sewage backs up into your bathroom, you cannot afford to wait until morning. Apex Plumbing &amp; Rooter Pros provides certified, rapid-arrival emergency plumbing services in Mardan...
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                      Word Count: 620 words
                    </span>
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                      Slug: /emergency-plumbing-services-mardan
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      Density: 1.4% (Optimal)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-400">
                    Destination: <span className="text-slate-200 font-mono">apexplumbingpros.com/wp-json</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-300 px-3 py-1.5 rounded-lg bg-slate-800">
                      Save Draft
                    </span>
                    <span className="text-xs font-semibold text-white px-4 py-1.5 rounded-lg bg-emerald-600 shadow-md shadow-emerald-600/30">
                      Published Live &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How LocAI Works */}
      <section id="how-it-works" className="py-24 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Step-by-Step Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              From Local Business Profile to Live WordPress Article in Minutes
            </h2>
            <p className="text-slate-400 mt-3 text-base">
              No more copying and pasting between chatbots and your CMS. LocAI connects the entire journey seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 relative">
              <div className="text-4xl font-black text-blue-500/20 mb-4">01</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Business Profile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add business details, phone, target towns, core services, and unique value propositions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 relative">
              <div className="text-4xl font-black text-blue-500/20 mb-4">02</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect WordPress</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your site URL and Application Password. Verified over secure REST API with AES-256 encryption.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 relative">
              <div className="text-4xl font-black text-blue-500/20 mb-4">03</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Generate &amp; Optimize</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI crafts localized articles with neighborhood landmarks, FAQs, and instant real-time SEO scoring.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 relative">
              <div className="text-4xl font-black text-blue-500/20 mb-4">04</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Publish or Schedule</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1-click instant publication, draft creation, or hands-free calendar scheduling directly into your CMS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Content Types */}
      <section id="content-types" className="py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Engineered For Local SEO Dominance
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Every Local Content Format You Need to Rank
            </h2>
            <p className="text-slate-400 mt-3 text-base">
              Built specifically to target high-intent local search queries that drive actual phone calls and leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(CONTENT_TYPE_LABELS).map(([key, item]) => (
              <div
                key={key}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-400">
                    {item.badge}
                  </span>
                  <FileCheck className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WordPress Direct Publishing Showcase */}
      <section id="wordpress" className="py-24 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Native CMS Integration
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6">
                Direct WordPress REST API Connection.{' '}
                <span className="text-slate-400">Zero plugins required.</span>
              </h2>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  Forget clunky third-party plugins that bloat your site. LocAI communicates directly with your WordPress core using official Application Passwords.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>1-Click Draft &amp; Publish:</strong> Send completed HTML directly to your posts or pages.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Autonomous Post Scheduling:</strong> Queue articles weeks in advance using WordPress native future status.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>AES-256 Encryption:</strong> Your Application Passwords are encrypted server-side and never exposed to the client.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Fail-Safe Persistence:</strong> If WordPress is temporarily unreachable, your content is never lost.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/websites"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all"
                >
                  <span>Connect WordPress Website</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
              <div className="text-xs font-semibold text-slate-400 uppercase mb-4 tracking-wider">
                WordPress REST API Payload Architecture
              </div>
              <pre className="rounded-xl bg-slate-950 p-4 text-xs font-mono text-blue-300 overflow-x-auto border border-slate-800/80">
{`POST /wp-json/wp/v2/posts
Authorization: Basic bG9jYWlfcHVibGlzaGVy...
Content-Type: application/json

{
  "title": "Emergency Plumbing in Mardan: 24/7 Response",
  "status": "publish",
  "slug": "emergency-plumbing-services-mardan",
  "excerpt": "Rapid 35-minute arrival in Mardan area...",
  "content": "<h2>24/7 Rapid Response</h2>...",
  "meta": {
    "_locai_project_id": "proj_1042",
    "_locai_seo_score": 96
  }
}`}
              </pre>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> 200 OK &bull; Post ID #1042 Created
                </span>
                <span className="text-slate-500">Latency: 184ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Transparent SaaS Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Flexible Plans Built for Growth
            </h2>
            <p className="text-slate-400 mt-3 text-base">
              Scale from a single local business to managing dozens of agency client websites.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-8 inline-flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                  billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                  billingCycle === 'annual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Billing <span className="ml-1 text-emerald-400 font-bold">(Save 20%)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(PLANS).map(plan => {
              const price = billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceAnnual / 12);
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'border-blue-500 bg-gradient-to-b from-blue-950/40 to-slate-900 shadow-xl shadow-blue-500/10 scale-[1.02]'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-md">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mb-6 h-8">{plan.description}</p>

                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">${price}</span>
                      <span className="text-xs text-slate-400 font-medium">/ month</span>
                    </div>

                    <div className="space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-300">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/billing?plan=${plan.id}`}
                    className={`mt-8 block w-full rounded-xl py-2.5 text-center text-xs font-semibold transition-all ${
                      isPopular
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-500'
                        : 'border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {plan.id === 'FREE' ? 'Get Started' : `Upgrade to ${plan.name}`}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Questions &amp; Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-blue-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 border-t border-slate-800/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-slate-950 to-indigo-900/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to Dominate Local Search and Automate Your WordPress Publishing?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Join local businesses and SEO agencies generating high-ranking local content in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">LocAI</span>
            <span className="text-xs text-slate-500 ml-2">
              &copy; {new Date().getFullYear()} LocAI SaaS Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/help" className="hover:text-white">Documentation</Link>
            <Link href="/billing" className="hover:text-white">Pricing</Link>
            <a href="#faq" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
