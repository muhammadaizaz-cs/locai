'use client';

import React, { useState } from 'react';
import { Menu, Bell, Shield, Search, AlertTriangle } from 'lucide-react';

import { usePathname } from 'next/navigation';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  pageTitle?: string;
  criticalAlerts?: number;
}

const ROUTE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/organizations': 'Organizations',
  '/admin/subscriptions': 'Subscriptions',
  '/admin/payments': 'Payments',
  '/admin/ai-usage': 'AI Usage',
  '/admin/wordpress-sites': 'WordPress Sites',
  '/admin/content': 'Content',
  '/admin/activity-logs': 'Activity Logs',
  '/admin/system-alerts': 'System Alerts',
  '/admin/support': 'Support',
  '/admin/settings': 'Settings',
};

export function AdminHeader({ onToggleSidebar, pageTitle, criticalAlerts = 0 }: AdminHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();

  const title = pageTitle || ROUTE_TITLES[pathname] || 'Control Center';

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800/80 bg-[#0a0e1a]/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          id="admin-sidebar-toggle"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden transition-colors"
          aria-label="Toggle admin navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Admin badge */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-1">
            <Shield className="h-3 w-3 text-purple-400" />
            <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">Admin</span>
          </div>
          <span className="text-slate-600">/</span>
          <span className="text-sm font-medium text-slate-300">{title}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search toggle */}
        {showSearch ? (
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500" />
            <input
              autoFocus
              type="text"
              placeholder="Search admin..."
              onBlur={() => setShowSearch(false)}
              className="w-48 rounded-lg border border-slate-700 bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        ) : (
          <button
            id="admin-search-toggle"
            onClick={() => setShowSearch(true)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        )}

        {/* Critical alerts indicator */}
        {criticalAlerts > 0 && (
          <a
            href="/admin/system-alerts"
            className="relative flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{criticalAlerts} Critical</span>
          </a>
        )}

        {/* Notifications */}
        <button
          id="admin-notifications"
          className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Admin notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Back to customer dashboard */}
        <a
          href="/dashboard"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-colors"
        >
          Customer View
        </a>
      </div>
    </header>
  );
}
