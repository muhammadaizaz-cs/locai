import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
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
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            },
          },
        }
      );

      await supabase.auth.signOut();
    }

    // Clear all Supabase related cookies
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (
        c.name.startsWith('sb-') ||
        c.name.includes('auth-token') ||
        c.name.includes('access-token') ||
        c.name.includes('admin')
      ) {
        cookieStore.delete(c.name);
      }
    }

    // Check if form submit (redirect) or fetch (json)
    const isFormSubmit = request.headers.get('content-type')?.includes('application/x-www-form-urlencoded') ||
                         request.headers.get('accept')?.includes('text/html');

    if (isFormSubmit) {
      return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sign out';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
