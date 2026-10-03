import React from 'react';
import { getAdminSystemSettings } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { ConfigStatus, AdminCard, AdminBadge } from '@/components/admin/AdminUI';
import { Settings, Shield, Cpu, CreditCard, Globe, Server, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Admin Settings | LocAI Control Center',
  description: 'System configurations, integration status, and security policies.',
};

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const settings = getAdminSystemSettings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            System Settings & Security
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Platform integration status, environment variables audit, and security baseline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminBadge variant={session.role === 'super_admin' ? 'amber' : 'purple'}>
            {session.role === 'super_admin' ? 'Super Admin Access' : 'Admin View'}
          </AdminBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. General Platform Settings */}
        <AdminCard title="General Platform" action={<Settings className="h-4 w-4 text-purple-400" />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-300">Application Name</span>
              <span className="text-xs font-semibold text-white">LocAI SaaS Engine</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-300">Environment Mode</span>
              <span className="text-xs font-mono font-semibold text-purple-400 uppercase">
                {process.env.NODE_ENV || 'development'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-300">Maintenance Mode</span>
              <span
                className={`text-xs font-semibold ${
                  settings.maintenanceMode ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {settings.maintenanceMode ? 'Active' : 'Disabled (Operational)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-slate-300">Active Tenant Isolation</span>
              <span className="text-xs font-semibold text-emerald-400">Multi-tenant (RLS)</span>
            </div>
          </div>
        </AdminCard>

        {/* 2. AI Providers */}
        <AdminCard title="AI Provider Integrations" action={<Cpu className="h-4 w-4 text-purple-400" />}>
          <div>
            <ConfigStatus label="OpenAI API (GPT-4o, GPT-4o-mini)" configured={settings.openAIConfigured} />
            <ConfigStatus label="DeepSeek API (V3, R1 Reasoner)" configured={settings.deepseekConfigured} />
            <ConfigStatus label="Grok API (xAI Grok-2)" configured={settings.grokConfigured} />
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-slate-300">Default Active Provider</span>
              <span className="text-xs font-mono font-bold text-white uppercase">
                {process.env.ACTIVE_AI_PROVIDER || 'openai'}
              </span>
            </div>
          </div>
        </AdminCard>

        {/* 3. Billing & Payments */}
        <AdminCard title="Payment & Billing Gateways" action={<CreditCard className="h-4 w-4 text-purple-400" />}>
          <div>
            <ConfigStatus label="Stripe Integration" configured={settings.stripeConfigured} />
            <ConfigStatus label="Paddle Integration" configured={settings.paddleConfigured} />
            <ConfigStatus label="Lemon Squeezy Integration" configured={settings.lemonsqueezyConfigured} />
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-slate-300">Active Billing Provider</span>
              <span className="text-xs font-mono font-bold text-white uppercase">
                {settings.activeBillingProvider}
              </span>
            </div>
          </div>
        </AdminCard>

        {/* 4. WordPress Security & REST */}
        <AdminCard title="WordPress Security" action={<Globe className="h-4 w-4 text-purple-400" />}>
          <div className="space-y-3">
            <ConfigStatus
              label="AES-256-GCM Encryption Key"
              configured={settings.wordpressEncryptionConfigured}
            />
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-300">REST API User-Agent</span>
              <span className="text-xs font-mono text-slate-400">LocAI-Sync/1.0</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-slate-300">Credential Storage Model</span>
              <span className="text-xs font-semibold text-emerald-400">Symmetric Encryption</span>
            </div>
          </div>
        </AdminCard>

        {/* 5. Security & RBAC Policies */}
        <AdminCard title="Security & RBAC Policies" action={<Shield className="h-4 w-4 text-purple-400" />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-300">Role-Based Access Control</span>
              <span className="text-xs font-semibold text-emerald-400">Enforced (user, admin, super_admin)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-300">Database Row Level Security</span>
              <span className="text-xs font-semibold text-emerald-400">Active (Multi-tenant)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-slate-300">Sensitive Secret Exposure</span>
              <span className="text-xs font-semibold text-emerald-400">Server-Side Only Protected</span>
            </div>
          </div>
        </AdminCard>

        {/* 6. Database & Core System */}
        <AdminCard title="Infrastructure & Database" action={<Server className="h-4 w-4 text-purple-400" />}>
          <div className="space-y-3">
            <ConfigStatus label="Supabase PostgreSQL" configured={settings.supabaseConfigured} />
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-300">Next.js Framework</span>
              <span className="text-xs font-mono text-slate-300">16.3.6 (App Router + Turbopack)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-slate-300">React Runtime</span>
              <span className="text-xs font-mono text-slate-300">19.2.8</span>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
