import { NextResponse } from 'next/server';
import { BillingService } from '@/services/billingService';
import { getMockDb } from '@/lib/store/mockDb';

export async function POST(req: Request) {
  try {
    const { tier, interval, provider } = await req.json();

    if (!tier) {
      return NextResponse.json({ error: 'Tier is required.' }, { status: 400 });
    }

    const db = getMockDb();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await BillingService.createCheckout(
      {
        tier,
        interval: interval || 'monthly',
        organizationId: db.currentOrgId,
        successUrl: `${appUrl}/billing/success`,
        cancelUrl: `${appUrl}/billing`,
      },
      provider
    );

    return NextResponse.json({ success: true, checkoutUrl: session.checkoutUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout initiation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
