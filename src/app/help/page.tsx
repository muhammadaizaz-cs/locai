'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Key,
  Globe,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function HelpDocsPage() {
  return (
    <DashboardShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            LocAI Help &amp; Documentation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete guides on connecting WordPress, mastering Local SEO prompt engineering, and publishing workflows.
          </p>
        </div>

        {/* WordPress Connection Guide */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                How to Connect WordPress with Application Passwords
              </h2>
              <p className="text-xs text-slate-400">Step-by-step setup in under 60 seconds.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
            <p>
              WordPress 5.6+ includes native support for <strong>Application Passwords</strong>. This allows external SaaS applications like LocAI to create and publish posts securely over the WordPress REST API without exposing your personal login password.
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-300">
              <li>Log into your WordPress Administrator dashboard.</li>
              <li>Navigate to <strong>Users &rarr; Profile</strong> (or <em>Users &rarr; All Users &rarr; Edit</em>).</li>
              <li>Scroll down to the <strong>Application Passwords</strong> section.</li>
              <li>In the &quot;New Application Password Name&quot; field, type <code>LocAI Publisher</code>.</li>
              <li>Click <strong>Add New Application Password</strong>.</li>
              <li>WordPress will generate a 16-character code (formatted like <code>xxxx xxxx xxxx xxxx</code>).</li>
              <li>Copy that code and paste it into the LocAI &quot;Connect WordPress Site&quot; dialog.</li>
            </ol>
          </div>
        </div>

        {/* Local SEO Strategy Playbook */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Local SEO Content Strategy Playbook
              </h2>
              <p className="text-xs text-slate-400">Best practices for ranking in Google Local 3-Pack and Organic SERPs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="font-bold text-white mb-1">1. Geo-Targeted Headings</h3>
              <p className="text-slate-400 text-[11px]">
                Always include the target city and service in the H1 title and primary H2 heading. This establishes immediate semantic relevance for local crawlers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="font-bold text-white mb-1">2. Localized Problem Statements</h3>
              <p className="text-slate-400 text-[11px]">
                Mention specific local weather patterns, neighborhoods, and common local homeowner pain points rather than generic global descriptions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="font-bold text-white mb-1">3. Schema-Ready FAQs</h3>
              <p className="text-slate-400 text-[11px]">
                Answer 3 to 4 specific questions with localized answers. This qualifies your WordPress page for Google rich snippet accordion expansions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="font-bold text-white mb-1">4. Direct Phone Call to Action</h3>
              <p className="text-slate-400 text-[11px]">
                Ensure your primary phone number and emergency response times are placed prominently above the fold and in concluding sections.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Common WordPress REST API Troubleshooting
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-white block mb-1">401 Unauthorized Response?</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Ensure you copied the entire Application Password without extra spaces. Also check if a security plugin (like Wordfence or iThemes) has disabled REST API Basic Authentication headers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="font-bold text-white block mb-1">SSL / HTTPS Requirement</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                WordPress requires an active SSL certificate (HTTPS) for Application Passwords to function properly in production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
