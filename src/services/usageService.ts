import { getMockDb, updateMockDb } from '@/lib/store/mockDb';
import { PLANS } from '@/lib/constants';
import { SubscriptionTier, UsageData } from '@/types';

export class UsageService {
  /**
   * Get usage for current organization
   */
  public static async getUsage(orgId: string): Promise<UsageData> {
    const db = getMockDb();
    return db.usage;
  }

  /**
   * Check if organization has quota remaining for an action
   */
  public static async canPerformAction(
    orgId: string,
    action: 'generate_content' | 'publish_wordpress' | 'add_website'
  ): Promise<{ allowed: boolean; reason?: string }> {
    const db = getMockDb();
    const tier = db.subscriptionTier || 'FREE';
    const plan = PLANS[tier] || PLANS.FREE;
    const usage = db.usage;

    if (action === 'generate_content') {
      if (usage.generations_count >= usage.generations_limit) {
        return {
          allowed: false,
          reason: `You have reached your monthly AI generation limit of ${usage.generations_limit}. Please upgrade your plan to continue generating content.`,
        };
      }
    } else if (action === 'publish_wordpress') {
      if (usage.wordpress_publishes_count >= usage.wordpress_publishes_limit) {
        return {
          allowed: false,
          reason: `You have reached your monthly WordPress publishing limit of ${usage.wordpress_publishes_limit}. Please upgrade your plan for higher limits.`,
        };
      }
    } else if (action === 'add_website') {
      if (usage.websites_count >= usage.websites_limit) {
        return {
          allowed: false,
          reason: `Your current plan allows up to ${usage.websites_limit} connected WordPress website(s). Upgrade to add more websites.`,
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Record and increment an action in usage ledger
   */
  public static async recordUsage(
    orgId: string,
    action: 'generation' | 'publish' | 'website_add' | 'website_remove'
  ): Promise<UsageData> {
    const db = updateMockDb(state => {
      if (action === 'generation') {
        state.usage.generations_count += 1;
      } else if (action === 'publish') {
        state.usage.wordpress_publishes_count += 1;
      } else if (action === 'website_add') {
        state.usage.websites_count += 1;
      } else if (action === 'website_remove') {
        state.usage.websites_count = Math.max(0, state.usage.websites_count - 1);
      }
    });

    return db.usage;
  }

  /**
   * Synchronize usage limits when subscription plan changes
   */
  public static async syncPlanLimits(orgId: string, newTier: SubscriptionTier): Promise<void> {
    const plan = PLANS[newTier] || PLANS.FREE;
    updateMockDb(state => {
      state.subscriptionTier = newTier;
      state.usage.generations_limit = plan.generationsLimit;
      state.usage.wordpress_publishes_limit = plan.publishingLimit;
      state.usage.websites_limit = plan.websitesLimit;
    });
  }
}
