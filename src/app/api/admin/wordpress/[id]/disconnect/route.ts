import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { supabaseAdmin, isServerSupabaseConfigured } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin/data';

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
      return NextResponse.json({ success: true });
    }

    // Delete connection and update status
    await supabaseAdmin
      .from('wordpress_connections')
      .delete()
      .eq('website_id', websiteId);

    await supabaseAdmin
      .from('websites')
      .update({ status: 'disconnected', updated_at: new Date().toISOString() })
      .eq('id', websiteId);

    await logAdminAction({
      actorId: session.userId,
      actorRole: session.role,
      action: 'Admin disconnected WordPress site',
      resourceType: 'website',
      resourceId: websiteId,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
