'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import type { AdminRole } from '@/lib/admin/auth';

interface AdminShellProps {
  children: React.ReactNode;
  pageTitle: string;
  userRole: AdminRole;
  userEmail: string;
  userName: string | null;
  criticalAlerts?: number;
}

export function AdminShell({
  children,
  pageTitle,
  userRole,
  userEmail,
  userName,
  criticalAlerts = 0,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080c17] text-slate-100 flex flex-col">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        userRole={userRole}
        userEmail={userEmail}
        userName={userName}
      />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          pageTitle={pageTitle}
          criticalAlerts={criticalAlerts}
        />
        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
