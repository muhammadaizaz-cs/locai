import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/admin/auth';
import {
  getAdminUserById,
  updateUserStatus,
  updateUserRole,
  logAdminAction,
} from '@/lib/admin/data';

const UpdateUserSchema = z.object({
  status: z.enum(['active', 'suspended', 'banned']).optional(),
  role: z.enum(['user', 'admin', 'super_admin']).optional(),
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

    const { id: targetUserId } = await props.params;
    const body = await request.json();
    const parsed = UpdateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, role } = parsed.data;

    // Check target user
    const targetUser = await getAdminUserById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Role elevation checks
    if (role) {
      if (session.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Only Super Admins can modify administrative roles' },
          { status: 403 }
        );
      }
      const roleResult = await updateUserRole(targetUserId, role);
      if (!roleResult.success) {
        return NextResponse.json({ error: roleResult.error }, { status: 500 });
      }

      await logAdminAction({
        actorId: session.userId,
        actorRole: session.role,
        action: `Changed user role to ${role}`,
        resourceType: 'user',
        resourceId: targetUserId,
        metadata: { previousRole: targetUser.role, newRole: role },
      });
    }

    // Status change checks
    if (status) {
      // Normal admin cannot suspend a super_admin
      if (targetUser.role === 'super_admin' && session.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Cannot modify status of a Super Admin' },
          { status: 403 }
        );
      }

      const statusResult = await updateUserStatus(targetUserId, status);
      if (!statusResult.success) {
        return NextResponse.json({ error: statusResult.error }, { status: 500 });
      }

      await logAdminAction({
        actorId: session.userId,
        actorRole: session.role,
        action: `Changed user status to ${status}`,
        resourceType: 'user',
        resourceId: targetUserId,
        metadata: { previousStatus: targetUser.status, newStatus: status },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
