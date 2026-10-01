import { NextResponse } from 'next/server';
import { BillingService } from '@/services/billingService';
import { BillingProviderType } from '@/types';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const providerHeader = (req.headers.get('x-billing-provider') || 'stripe') as BillingProviderType;
    const signature =
      req.headers.get('stripe-signature') ||
      req.headers.get('x-paddle-signature') ||
      req.headers.get('x-signature') ||
      '';

    const provider = BillingService.getActiveProvider(providerHeader);
    const isValid = provider.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    // Process event safely
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = {};
    }

    if (data.event === 'subscription_updated' || data.type === 'customer.subscription.updated') {
      const orgId = data.metadata?.organization_id;
      const tier = data.metadata?.tier;
      if (orgId && tier) {
        await BillingService.upgradePlan(orgId, tier);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
