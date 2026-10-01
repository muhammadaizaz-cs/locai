'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Building,
  Key,
  Shield,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function SettingsPage() {
  const [tab, setTab] = useState<'profile' | 'org' | 'ai' | 'security'>('profile');
  const [fullName, setFullName] = useState('Alex Vance');
  const [email, setEmail] = useState('alex.director@locai-agency.com');
  const [orgName, setOrgName] = useState('LocAI Growth Agency');

  // Custom AI API Keys
  const [openaiKey, setOpenaiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [grokKey, setGrokKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your user profile, multi-tenant organization, and external AI provider keys.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
          <button
            onClick={() => setTab('profile')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-colors ${
              tab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setTab('org')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-colors ${
              tab === 'org' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Organization</span>
          </button>

          <button
            onClick={() => setTab('ai')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-colors ${
              tab === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>AI Provider Keys</span>
          </button>

          <button
            onClick={() => setTab('security')}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-colors ${
              tab === 'security' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Security &amp; RLS</span>
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {tab === 'profile' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white">Personal Account Information</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'org' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white">Multi-Tenant Organization</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Agency Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tenant Organization ID</label>
                  <input
                    type="text"
                    disabled
                    value="org_locai_demo_default"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 font-mono text-slate-500 px-3.5 py-2.5 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'ai' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs">
              <div>
                <h2 className="text-sm font-bold text-white">Custom AI Provider Keys (BYOK)</h2>
                <p className="text-slate-400 mt-1">
                  Optionally bring your own API keys. Keys are stored server-side only and never sent to client browsers.
                </p>
              </div>

              <div className="space-y-4 max-w-lg pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">OpenAI API Key</label>
                  <input
                    type="password"
                    value={openaiKey}
                    onChange={e => setOpenaiKey(e.target.value)}
                    placeholder="sk-proj-••••••••••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">DeepSeek API Key</label>
                  <input
                    type="password"
                    value={deepseekKey}
                    onChange={e => setDeepseekKey(e.target.value)}
                    placeholder="sk-••••••••••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">xAI Grok API Key</label>
                  <input
                    type="password"
                    value={grokKey}
                    onChange={e => setGrokKey(e.target.value)}
                    placeholder="xai-••••••••••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 text-xs">
              <h2 className="text-sm font-bold text-white">Security &amp; Data Protection</h2>
              <div className="space-y-3 text-slate-300 max-w-xl leading-relaxed">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">AES-256 Application Password Encryption</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      All WordPress application passwords are encrypted using symmetric AES-256-GCM authenticated encryption before persistence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <Shield className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">PostgreSQL Row-Level Security (RLS)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Supabase Row Level Security strictly partitions content, businesses, and WordPress connections by organization tenant.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
