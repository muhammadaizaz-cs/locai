/**
 * Admin Authorization Utilities
 *
 * Server-side only. Never import this in client components.
 * These functions verify admin role from the authenticated session
 * using the Supabase service role client.
 */

import { supabaseAdmin, isServerSupabaseConfigured } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type AdminRole = 'user' | 'admin' | 'super_admin';

export interface AdminSession {
  userId: string;
  email: string;
  role: AdminRole;
  fullName: string | null;
}

/**
 * Get the current user's role from the Supabase profiles table.
 * Uses the service role client to bypass RLS and ensure accurate reads.
 *
 * Returns null if not authenticated or Supabase is not configured.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isServerSupabaseConfigured()) {
    // Supabase not configured — no admin access possible
    return null;
  }

  try {
    // Verify the authenticated user from the JWT in cookies
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Fetch their profile including role using service role (bypasses RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, role, status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Suspended/banned users cannot access admin
    if (profile.status && profile.status !== 'active') {
      return null;
    }

    return {
      userId: profile.id,
      email: profile.email,
      role: (profile.role || 'user') as AdminRole,
      fullName: profile.full_name || null,
    };
  } catch {
    return null;
  }
}

/**
 * Require an authenticated admin session.
 * If the user is not authenticated or not an admin, redirect to /dashboard.
 *
 * Use this in every admin Server Component and Route Handler.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login?reason=unauthenticated');
  }

  if (session.role !== 'admin' && session.role !== 'super_admin') {
    redirect('/dashboard?error=unauthorized');
  }

  return session;
}

/**
 * Require a super_admin session.
 * Use this for sensitive system operations.
 */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login?reason=unauthenticated');
  }

  if (session.role !== 'super_admin') {
    redirect('/admin/dashboard?error=insufficient_permissions');
  }

  return session;
}

/**
 * Check if a session has admin privileges without redirecting.
 * Useful for conditional rendering in layouts.
 */
export function isAdminRole(role: AdminRole): boolean {
  return role === 'admin' || role === 'super_admin';
}

/**
 * Check if a session has super_admin privileges without redirecting.
 */
export function isSuperAdminRole(role: AdminRole): boolean {
  return role === 'super_admin';
}
