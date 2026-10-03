'use client';

import React, { useState } from 'react';
import {
  MoreVertical,
  Shield,
  Ban,
  CheckCircle,
  Eye,
  UserCheck,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { AdminUser } from '@/lib/admin/data';
import { AdminBadge, statusToBadge } from './AdminUI';
import { formatDate } from '@/lib/utils';
import type { AdminRole } from '@/lib/admin/auth';

interface UsersTableClientProps {
  users: AdminUser[];
  currentUserRole: AdminRole;
}

export function UsersTableClient({ users, currentUserRole }: UsersTableClientProps) {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [roleModalUser, setRoleModalUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin' | 'super_admin'>('user');

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    setActionLoading(userId);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }
      window.location.reload();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Error updating status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async () => {
    if (!roleModalUser) return;
    setActionLoading(roleModalUser.id);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/users/${roleModalUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to change role');
      }
      setRoleModalUser(null);
      window.location.reload();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Error changing role');
    } finally {
      setActionLoading(null);
    }
  };

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-500 text-xs">
        No users found matching the query.
      </div>
    );
  }

  return (
    <>
      {actionError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="min-w-full divide-y divide-slate-800/80">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                User
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Role
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Created
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
            {users.map((u) => {
              const isSuperAdmin = u.role === 'super_admin';
              const canEditRole = currentUserRole === 'super_admin';
              const canModifyStatus =
                currentUserRole === 'super_admin' || (!isSuperAdmin && currentUserRole === 'admin');

              return (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 uppercase">
                        {(u.full_name || u.email || 'U').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {u.full_name || 'Unnamed User'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge
                      variant={
                        u.role === 'super_admin'
                          ? 'amber'
                          : u.role === 'admin'
                            ? 'purple'
                            : 'default'
                      }
                    >
                      {u.role}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3">
                    <AdminBadge variant={statusToBadge(u.status)}>{u.status}</AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Details */}
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Suspend / Reactivate */}
                      {canModifyStatus && (
                        <button
                          disabled={actionLoading === u.id}
                          onClick={() =>
                            handleStatusChange(
                              u.id,
                              u.status === 'suspended' ? 'active' : 'suspended'
                            )
                          }
                          className={`rounded-lg p-1.5 transition-colors ${
                            u.status === 'suspended'
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-amber-400 hover:bg-amber-500/10'
                          }`}
                          title={u.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
                        >
                          {actionLoading === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : u.status === 'suspended' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Ban className="h-4 w-4" />
                          )}
                        </button>
                      )}

                      {/* Change Role (Super Admin only) */}
                      {canEditRole && (
                        <button
                          onClick={() => {
                            setRoleModalUser(u);
                            setNewRole(
                              u.role === 'super_admin'
                                ? 'super_admin'
                                : u.role === 'admin'
                                  ? 'admin'
                                  : 'user'
                            );
                          }}
                          className="rounded-lg p-1.5 text-purple-400 hover:bg-purple-500/10 transition-colors"
                          title="Change Role"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-500">ID:</span>
                <p className="font-mono text-slate-300 select-all">{selectedUser.id}</p>
              </div>
              <div>
                <span className="text-slate-500">Full Name:</span>
                <p className="text-slate-200">{selectedUser.full_name || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>
                <p className="text-slate-200">{selectedUser.email}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-slate-500">Role:</span>
                  <div className="mt-1">
                    <AdminBadge variant="purple">{selectedUser.role}</AdminBadge>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="mt-1">
                    <AdminBadge variant={statusToBadge(selectedUser.status)}>
                      {selectedUser.status}
                    </AdminBadge>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-slate-500">Created At:</span>
                <p className="text-slate-300">{formatDate(selectedUser.created_at)}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0d1322] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Modify User Role</h3>
              <button
                onClick={() => setRoleModalUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Select new role for <span className="text-white font-medium">{roleModalUser.email}</span>
            </p>
            <div className="mt-4 space-y-2">
              {(['user', 'admin', 'super_admin'] as const).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-colors ${
                    newRole === r
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-semibold capitalize">
                    <span>{r.replace('_', ' ')}</span>
                  </div>
                  <input
                    type="radio"
                    name="admin-role"
                    value={r}
                    checked={newRole === r}
                    onChange={() => setNewRole(r)}
                    className="accent-purple-500"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setRoleModalUser(null)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading === roleModalUser.id}
                onClick={handleRoleChange}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
              >
                {actionLoading === roleModalUser.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  'Confirm Role'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
