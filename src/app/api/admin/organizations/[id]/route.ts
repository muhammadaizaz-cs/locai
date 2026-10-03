import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin/auth';
import { supabaseAdmin, isServerSupabaseConfigured } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin/data';

const UpdateOrgSchema = z.object({
  status: z.enum(['active', 'suspended']),
});

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id: orgId } = await props.params;
    const body = await request.json();
    const parsed = UpdateOrgSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (!isServerSupabaseConfigured()) {
      return NextResponse.json({ success: true, message: 'Updated (local state)' });
    }

    const { error } = await supabaseAdmin
      .from('organizations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', orgId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
      actorId: session.userId,
      actorRole: session.role,
      action: `Updated organization status to ${parsed.data.status}`,
      resourceType: 'organization',
      resourceId: orgId,
      organizationId: orgId,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
