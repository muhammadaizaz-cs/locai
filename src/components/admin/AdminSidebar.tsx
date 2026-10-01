'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Receipt,
  Sparkles,
  Globe,
  FileText,
  Activity,
  AlertTriangle,
  HeadphonesIcon,
  Settings,
  Shield,
  LogOut,
  ChevronLeft,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminRole } from '@/lib/admin/auth';

interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  superAdminOnly?: boolean;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Organizations', href: '/admin/organizations', icon: Building2 },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Payments', href: '/admin/payments', icon: Receipt },
  { label: 'AI Usage', href: '/admin/ai-usage', icon: Sparkles },
  { label: 'WordPress Sites', href: '/admin/wordpress-sites', icon: Globe },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
  { label: 'System Alerts', href: '/admin/system-alerts', icon: AlertTriangle },
  { label: 'Support', href: '/admin/support', icon: HeadphonesIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings, superAdminOnly: true },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  userRole: AdminRole;
  userEmail: string;
  userName: string | null;
}

export function AdminSidebar({
  mobileOpen,
  onClose,
  userRole,
  userEmail,
  userName,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : userEmail.slice(0, 2).toUpperCase();

  const roleBadgeColor =
    userRole === 'super_admin'
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      : 'bg-purple-500/20 text-purple-400 border-purple-500/30';

  const roleLabel = userRole === 'super_admin' ? 'Super Admin' : 'Admin';

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
          'fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/80 bg-[#0a0e1a] transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Admin Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-md shadow-purple-500/25 flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">
                  Loc<span className="text-purple-400">AI</span>
                </span>
                <span className="rounded-md bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-purple-400 border border-purple-500/30 uppercase">
                  Admin
                </span>
              </div>
              <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase truncate">
                Control Panel
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/60 border border-slate-800 p-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/15 text-purple-400 text-xs font-bold shrink-0">
              <BarChart3 className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-300 truncate">Admin Panel</p>
              <p className="text-[10px] text-slate-500">System Overview</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            if (item.superAdminOnly && userRole !== 'super_admin') return null;

            const Icon = item.icon;
            const isActive =
              item.href === '/admin/dashboard'
                ? pathname === '/admin/dashboard' || pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/25'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                    {item.badge}
                  </span>
                )}
                {item.superAdminOnly && (
                  <Shield className="h-3 w-3 text-amber-500/60" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Admin Profile & Logout */}
        <div className="border-t border-slate-800/80 p-3 space-y-2">
          {/* Profile */}
          <div className="flex items-center gap-3 rounded-lg bg-slate-900/60 border border-slate-800 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {userName || 'Admin User'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>

          {/* Role badge */}
          <div className="flex items-center justify-between px-1">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                roleBadgeColor
              )}
            >
              <Shield className="h-2.5 w-2.5" />
              {roleLabel}
            </span>
            <Link
              href="/dashboard"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              Customer View →
            </Link>
          </div>

          {/* Logout */}
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
