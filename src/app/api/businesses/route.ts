import { NextResponse } from 'next/server';
import { BusinessService } from '@/services/businessService';
import { getMockDb } from '@/lib/store/mockDb';

export async function GET() {
  try {
    const db = getMockDb();
    const businesses = await BusinessService.list(db.currentOrgId);
    return NextResponse.json({ success: true, businesses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve businesses';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getMockDb();

    if (!body.name || !body.category || !body.city) {
      return NextResponse.json(
        { error: 'Business name, category, and city are required.' },
        { status: 400 }
      );
    }

    const business = await BusinessService.create(db.currentOrgId, {
      name: body.name,
      category: body.category,
      description: body.description || '',
      phone: body.phone || '',
      email: body.email || '',
      website: body.website || '',
      address: body.address || '',
      city: body.city,
      state_province: body.state_province || '',
      country: body.country || 'United States',
      postal_code: body.postal_code || '',
      services: body.services || [],
      target_audience: body.target_audience || '',
      business_hours: body.business_hours || '',
      unique_selling_points: body.unique_selling_points || [],
      brand_tone: body.brand_tone || 'Professional, Authoritative, and Friendly',
      organization_id: db.currentOrgId,
    });

    return NextResponse.json({ success: true, business });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create business';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
