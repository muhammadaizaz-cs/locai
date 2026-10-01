import { NextResponse } from 'next/server';
import { ContentService } from '@/services/contentService';
import { getMockDb } from '@/lib/store/mockDb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'ALL';
    const search = searchParams.get('search') || undefined;
    const businessId = searchParams.get('business_id') || undefined;
    const websiteId = searchParams.get('website_id') || undefined;

    const db = getMockDb();
    const projects = await ContentService.list(db.currentOrgId, {
      status: status as any,
      search,
      businessId,
      websiteId,
    });

    return NextResponse.json({ success: true, projects });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
