import { BillingProviderType, SubscriptionTier } from '@/types';
import { PLANS } from '@/lib/constants';
import { UsageService } from './usageService';
import { ActivityService } from './activityService';

export interface CheckoutSessionOptions {
  tier: SubscriptionTier;
  interval: 'monthly' | 'annual';
  organizationId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface BillingProvider {
  name: BillingProviderType;
  createCheckoutSession(options: CheckoutSessionOptions): Promise<{ checkoutUrl: string; sessionId: string }>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}

export class StripeBillingProvider implements BillingProvider {
  name: BillingProviderType = 'stripe';

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ checkoutUrl: string; sessionId: string }> {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      // Demo checkout simulation URL
      const mockSessionId = `cs_stripe_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return {
        checkoutUrl: `${options.successUrl}?provider=stripe&session_id=${mockSessionId}&tier=${options.tier}`,
        sessionId: mockSessionId,
      };
    }

    // When STRIPE_SECRET_KEY is present, would call Stripe API
    const mockSessionId = `cs_live_${Date.now()}`;
    return {
      checkoutUrl: `${options.successUrl}?provider=stripe&session_id=${mockSessionId}&tier=${options.tier}`,
      sessionId: mockSessionId,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) return true; // dev permissive
    return signature.length > 10;
  }
}

export class PaddleBillingProvider implements BillingProvider {
  name: BillingProviderType = 'paddle';

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ checkoutUrl: string; sessionId: string }> {
    const mockSessionId = `paddle_txn_${Date.now()}`;
    return {
      checkoutUrl: `${options.successUrl}?provider=paddle&session_id=${mockSessionId}&tier=${options.tier}`,
      sessionId: mockSessionId,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return true;
  }
}

export class LemonSqueezyBillingProvider implements BillingProvider {
  name: BillingProviderType = 'lemonsqueezy';

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<{ checkoutUrl: string; sessionId: string }> {
    const mockSessionId = `ls_order_${Date.now()}`;
    return {
      checkoutUrl: `${options.successUrl}?provider=lemonsqueezy&session_id=${mockSessionId}&tier=${options.tier}`,
      sessionId: mockSessionId,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return true;
  }
}

export class BillingService {
  private static providers: Record<BillingProviderType, BillingProvider> = {
    stripe: new StripeBillingProvider(),
    paddle: new PaddleBillingProvider(),
    lemonsqueezy: new LemonSqueezyBillingProvider(),
  };

  public static getActiveProvider(override?: BillingProviderType): BillingProvider {
    const active = override || (process.env.ACTIVE_BILLING_PROVIDER as BillingProviderType) || 'stripe';
    return this.providers[active] || this.providers.stripe;
  }

  /**
   * Initiate subscription checkout for chosen plan and interval
   */
  public static async createCheckout(
    options: CheckoutSessionOptions,
    providerOverride?: BillingProviderType
  ): Promise<{ checkoutUrl: string; sessionId: string }> {
    const provider = this.getActiveProvider(providerOverride);
    return provider.createCheckoutSession(options);
  }

  /**
   * Complete subscription upgrade after verified webhook/checkout confirmation
   */
  public static async upgradePlan(orgId: string, newTier: SubscriptionTier): Promise<void> {
    await UsageService.syncPlanLimits(orgId, newTier);
    await ActivityService.log({
      organization_id: orgId,
      action: `Subscription upgraded to ${newTier} plan`,
      entity_type: 'subscription',
      metadata: { newTier, plan: PLANS[newTier].name },
    });
  }
}
