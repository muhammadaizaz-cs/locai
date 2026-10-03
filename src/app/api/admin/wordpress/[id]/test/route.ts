import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { supabaseAdmin, isServerSupabaseConfigured } from '@/lib/supabase/server';
import { WordPressService } from '@/services/wordpressService';
import { decryptPassword } from '@/lib/security/crypto';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: websiteId } = await props.params;

    if (!isServerSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        valid: true,
        displayName: 'WordPress Admin (Mock/Demo)',
      });
    }

    // Fetch connection metadata
    const { data: website } = await supabaseAdmin
      .from('websites')
      .select('*, wordpress_connections(*)')
      .eq('id', websiteId)
      .single();

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    const conn = (website.wordpress_connections as any[])?.[0] || website.wordpress_connections;
    if (!conn) {
      return NextResponse.json({ error: 'No WordPress credentials found for site' }, { status: 400 });
    }

    // Decrypt credentials server-side only
    let appPassword = '';
    try {
      appPassword = decryptPassword(
        conn.encrypted_application_password,
        conn.encryption_iv,
        conn.encryption_tag
      );
    } catch {
      return NextResponse.json({ error: 'Failed to decrypt credentials' }, { status: 500 });
    }

    const check = await WordPressService.verifyConnection({
      siteUrl: website.url,
      username: conn.wp_username,
      applicationPassword: appPassword,
    });

    if (check.valid) {
      await supabaseAdmin
        .from('wordpress_connections')
        .update({
          last_verified_at: new Date().toISOString(),
          status: 'active',
        })
        .eq('id', conn.id);
    }

    return NextResponse.json({
      success: check.valid,
      valid: check.valid,
      displayName: check.displayName,
      errorMessage: check.errorMessage,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
