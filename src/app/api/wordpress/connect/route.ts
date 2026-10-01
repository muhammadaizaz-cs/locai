import { NextResponse } from 'next/server';
import { WebsiteService } from '@/services/websiteService';
import { getMockDb } from '@/lib/store/mockDb';

export async function POST(req: Request) {
  try {
    const { name, url, business_id, wp_username, wp_application_password } = await req.json();

    if (!name || !url || !wp_username || !wp_application_password) {
      return NextResponse.json(
        { error: 'All fields (name, url, username, application password) are required.' },
        { status: 400 }
      );
    }

    const db = getMockDb();
    const website = await WebsiteService.connect(db.currentOrgId, {
      name,
      url,
      business_id,
      wp_username,
      wp_application_password,
    });

    return NextResponse.json({ success: true, website });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to connect website';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
