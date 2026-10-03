import React from 'react';
import { requireAdmin } from '@/lib/admin/auth';
import { getAdminStats } from '@/lib/admin/data';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'LocAI Admin Panel | Control Center',
  description: 'Enterprise administration, monitoring, and operations for LocAI SaaS platform.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const stats = await getAdminStats().catch(() => ({ criticalAlerts: 0 }));

  return (
    <AdminShell
      userRole={session.role}
      userEmail={session.email}
      userName={session.fullName}
      criticalAlerts={stats.criticalAlerts ?? 0}
    >
      {children}
    </AdminShell>
  );
}
