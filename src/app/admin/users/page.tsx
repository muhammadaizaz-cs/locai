import React from 'react';
import { getAdminUsers } from '@/lib/admin/data';
import { requireAdmin } from '@/lib/admin/auth';
import { UsersTableClient } from '@/components/admin/UsersTableClient';
import { AdminPagination } from '@/components/admin/AdminUI';
import { Search, Filter, ShieldCheck, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'User Management | LocAI Admin',
  description: 'Manage users, access roles, and account statuses.',
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const role = params.role || 'all';
  const status = params.status || 'all';

  const { users, total } = await getAdminUsers({
    page,
    pageSize: 20,
    search: search || undefined,
    role: role !== 'all' ? role : undefined,
    status: status !== 'all' ? status : undefined,
  });

  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            User Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Review user identities, control role authorization, and manage platform access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300">
            Total: {total} {total === 1 ? 'user' : 'users'}
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <form method="GET" className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search users by name or email..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </form>

        <form method="GET" className="flex items-center gap-2">
          {search && <input type="hidden" name="search" value={search} />}
          <select
            name="role"
            defaultValue={role}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <UsersTableClient users={users} currentUserRole={session.role} />

      {/* Pagination */}
      <AdminPagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/users"
        searchParams={{ search, role, status }}
      />
    </div>
  );
}
