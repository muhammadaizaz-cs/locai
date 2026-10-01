import { NextResponse } from 'next/server';
import { ContentService } from '@/services/contentService';
import { getMockDb } from '@/lib/store/mockDb';

export async function POST(req: Request) {
  try {
    const { project_id, action_type, scheduled_date } = await req.json();

    if (!project_id || !action_type) {
      return NextResponse.json(
        { error: 'project_id and action_type (draft | publish | future) are required.' },
        { status: 400 }
      );
    }

    const db = getMockDb();
    const wpRecord = await ContentService.publishToWordPress(
      db.currentOrgId,
      project_id,
      action_type,
      scheduled_date
    );

    return NextResponse.json({ success: true, post: wpRecord });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'WordPress operation failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
