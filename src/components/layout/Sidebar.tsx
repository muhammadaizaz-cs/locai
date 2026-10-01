'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Building2,
  Globe,
  Calendar,
  Search,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Content Hub', href: '/content', icon: FileText },
  { label: 'AI Studio', href: '/content/create', icon: Sparkles, badge: 'New' },
  { label: 'Local Businesses', href: '/businesses', icon: Building2 },
  { label: 'WordPress Sites', href: '/websites', icon: Globe },
  { label: 'Content Calendar', href: '/calendar', icon: Calendar },
  { label: 'SEO Audit', href: '/seo', icon: Search },
  { label: 'Usage & Quotas', href: '/usage', icon: BarChart3 },
  { label: 'Billing & Plans', href: '/billing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help & Docs', href: '/help', icon: HelpCircle },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Loc<span className="text-blue-500">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                Local SEO &amp; WP SaaS
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Organization Switcher */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between rounded-lg bg-slate-900/90 border border-slate-800 p-2.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold">
                LA
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">LocAI Growth Agency</p>
                <p className="text-[11px] text-blue-400 font-medium">Pro Plan Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Action / WordPress Status Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-3.5 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Monthly AI Quota</span>
              <span className="text-xs font-semibold text-slate-200">127 / 500</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${(127 / 500) * 100}%` }}
              />
            </div>
            <Link
              href="/billing"
              className="mt-3 block text-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Upgrade Plan &rarr;
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
