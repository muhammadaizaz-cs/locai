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
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getAdminSession(): Promise<AdminSession | null> {
  // 1. Try reading the authenticated user using Supabase SSR client
  try {
    const cookieStore = await cookies();

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // Server Components cannot set cookies
              }
            },
          },
        }
      );

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && user) {
        // Query user's verified role and status from profiles table
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('id, email, full_name, role, status')
          .eq('id', user.id)
          .single();

        if (!profileError && profile) {
          if (profile.status && profile.status !== 'active') {
            return null;
          }

          const userRole = (profile.role || 'user') as AdminRole;
          if (userRole === 'admin' || userRole === 'super_admin') {
            return {
              userId: profile.id,
              email: profile.email,
              role: userRole,
              fullName: profile.full_name || null,
            };
          }

          // Authenticated but not an admin role
          return {
            userId: profile.id,
            email: profile.email,
            role: 'user',
            fullName: profile.full_name || null,
          };
        }
      }
    }
  } catch (err) {
    console.error('getAdminSession error checking Supabase:', err);
  }

  // 2. In local development mode, support preview admin session when running locally
  if (process.env.NODE_ENV === 'development') {
    return {
      userId: 'admin_locai_dev',
      email: 'admin@locai.dev',
      role: 'super_admin',
      fullName: 'LocAI Super Admin',
    };
  }

  return null;
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
