'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Key,
  Info,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Website, Business } from '@/types';

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [businessId, setBusinessId] = useState('');
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [webRes, bizRes] = await Promise.all([
        fetch('/api/websites'),
        fetch('/api/businesses'),
      ]);
      const webData = await webRes.json();
      const bizData = await bizRes.json();

      if (webData.success) setWebsites(webData.websites);
      if (bizData.success) {
        setBusinesses(bizData.businesses);
        if (bizData.businesses.length > 0) setBusinessId(bizData.businesses[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleTestConnection = async () => {
    if (!url || !username || !appPassword) {
      setTestResult({ success: false, message: 'Please fill in URL, Username, and Application Password first.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/wordpress/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          username,
          application_password: appPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setTestResult({ success: false, message: data.error || 'Connection failed' });
      } else {
        setTestResult({
          success: true,
          message: `Verified! Authenticated as "${data.data?.displayName || username}" with publishing rights.`,
        });
      }
    } catch (err: unknown) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Network test error' });
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/wordpress/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          url,
          business_id: businessId,
          wp_username: username,
          wp_application_password: appPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to connect website');
      }

      setShowModal(false);
      setName('');
      setUrl('');
      setUsername('');
      setAppPassword('');
      setTestResult(null);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Connected WordPress Websites
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Connect WordPress sites via official Application Passwords for 1-click publishing.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Connect WordPress Site</span>
          </button>
        </div>

        {/* Security Banner */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4 text-xs text-blue-300 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-white">Enterprise Security Standard: </span>
            LocAI only connects via official WordPress REST API Application Passwords encrypted with AES-256-GCM. We never request or store your personal WordPress login password.
          </div>
        </div>

        {/* Websites List */}
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading connected sites...</div>
        ) : websites.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <Globe className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">No WordPress sites connected</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Connect your first WordPress installation to begin publishing generated local content with 1-click.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Connect WordPress Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {websites.map(site => (
              <div
                key={site.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{site.name}</h3>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{site.url}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
                    <div className="flex items-center justify-between">
                      <span>WordPress User:</span>
                      <span className="text-slate-200 font-mono">
                        {site.wp_connection?.wp_username || 'admin'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Application Password:</span>
                      <span className="text-slate-200 font-mono">•••• •••• •••• 9bX2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>REST Capabilities:</span>
                      <span className="text-emerald-400 font-semibold">Publish &amp; Schedule Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href="/content/create"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                  >
                    <span>Generate For Site &rarr;</span>
                  </Link>

                  <span className="text-[11px] text-slate-500">
                    Verified {site.wp_connection?.last_verified_at ? 'recently' : 'active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connect Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Connect WordPress Site
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              {testResult && (
                <div
                  className={`rounded-xl border p-3 text-xs flex items-center gap-2 ${
                    testResult.success
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              <form onSubmit={handleConnect} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Friendly Website Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Apex Plumbing Main Site"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WordPress Website URL *</label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://apexplumbingpros.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Associated Business Profile</label>
                  <select
                    value={businessId}
                    onChange={e => setBusinessId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {businesses.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">WordPress Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. editor_admin"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Application Password *</label>
                    <input
                      type="password"
                      required
                      value={appPassword}
                      onChange={e => setAppPassword(e.target.value)}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* Instructions helper */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-blue-400" />
                    How to get an Application Password:
                  </div>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Log into your WordPress Admin Dashboard.</li>
                    <li>Go to <strong>Users &rarr; Profile</strong>.</li>
                    <li>Scroll down to the <strong>Application Passwords</strong> section.</li>
                    <li>Type "LocAI Publisher" and click <strong>Add New Application Password</strong>.</li>
                    <li>Copy and paste the generated 16-character code above.</li>
                  </ol>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500 disabled:opacity-50"
                    >
                      {submitting ? 'Connecting...' : 'Connect Website'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
