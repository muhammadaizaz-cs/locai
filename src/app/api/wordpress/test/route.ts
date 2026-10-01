import { NextResponse } from 'next/server';
import { WordPressService } from '@/services/wordpressService';

export async function POST(req: Request) {
  try {
    const { url, username, application_password } = await req.json();

    if (!url || !username || !application_password) {
      return NextResponse.json(
        { error: 'Website URL, Username, and Application Password are required.' },
        { status: 400 }
      );
    }

    const result = await WordPressService.verifyConnection({
      siteUrl: url,
      username,
      applicationPassword: application_password,
    });

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.errorMessage || 'Authentication failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: result.userId,
        displayName: result.displayName,
        canPublish: result.canPublish,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'WordPress test connection failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
