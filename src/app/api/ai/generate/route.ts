import { NextResponse } from 'next/server';
import { ContentService } from '@/services/contentService';
import { getMockDb } from '@/lib/store/mockDb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getMockDb();
    const orgId = db.currentOrgId;

    if (!body.primary_keyword || !body.target_location || !body.topic || !body.content_type) {
      return NextResponse.json(
        { error: 'Missing required fields: primary_keyword, target_location, topic, and content_type are required.' },
        { status: 400 }
      );
    }

    const project = await ContentService.generate(orgId, {
      business_id: body.business_id,
      website_id: body.website_id,
      content_type: body.content_type,
      topic: body.topic,
      target_location: body.target_location,
      primary_keyword: body.primary_keyword,
      secondary_keywords: body.secondary_keywords,
      tone: body.tone,
      additional_instructions: body.additional_instructions,
      provider: body.provider,
    });

    return NextResponse.json({ success: true, project });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Content generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
