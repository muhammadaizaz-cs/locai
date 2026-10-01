import { NextResponse } from 'next/server';
import { ContentService } from '@/services/contentService';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const versions = await ContentService.getVersions(id);
    return NextResponse.json({ success: true, versions });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error retrieving versions';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
