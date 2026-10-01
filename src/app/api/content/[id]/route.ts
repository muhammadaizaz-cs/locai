import { NextResponse } from 'next/server';
import { ContentService } from '@/services/contentService';
import { getMockDb } from '@/lib/store/mockDb';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getMockDb();
    const project = await ContentService.getById(db.currentOrgId, id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error retrieving project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getMockDb();

    // If updating status
    if (body.status) {
      const updated = await ContentService.updateStatus(db.currentOrgId, id, body.status);
      return NextResponse.json({ success: true, project: updated });
    }

    // If saving a new edited version
    if (body.title && body.content_html) {
      const version = await ContentService.saveVersion(db.currentOrgId, id, {
        title: body.title,
        content_html: body.content_html,
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        slug: body.slug,
        excerpt: body.excerpt,
        change_summary: body.change_summary,
      });

      const updatedProject = await ContentService.getById(db.currentOrgId, id);
      return NextResponse.json({ success: true, version, project: updatedProject });
    }

    return NextResponse.json({ error: 'No valid update parameters provided' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating project';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
