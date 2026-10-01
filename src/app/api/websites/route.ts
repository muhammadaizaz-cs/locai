import { NextResponse } from 'next/server';
import { WebsiteService } from '@/services/websiteService';
import { getMockDb } from '@/lib/store/mockDb';

export async function GET() {
  try {
    const db = getMockDb();
    const websites = await WebsiteService.list(db.currentOrgId);
    return NextResponse.json({ success: true, websites });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve websites';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
