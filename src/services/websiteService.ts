import { getMockDb, updateMockDb } from '@/lib/store/mockDb';
import { Website } from '@/types';
import { WordPressService } from './wordpressService';
import { ActivityService } from './activityService';
import { UsageService } from './usageService';

export interface ConnectWebsiteInput {
  name: string;
  url: string;
  business_id?: string;
  wp_username: string;
  wp_application_password: string;
}

export class WebsiteService {
  public static async list(orgId: string): Promise<Website[]> {
    const db = getMockDb();
    return db.websites.filter(w => w.organization_id === orgId);
  }

  public static async getById(orgId: string, id: string): Promise<Website | null> {
    const db = getMockDb();
    const found = db.websites.find(w => w.id === id && w.organization_id === orgId);
    return found || null;
  }

  public static async connect(orgId: string, input: ConnectWebsiteInput): Promise<Website> {
    // 1. Quota check
    const quota = await UsageService.canPerformAction(orgId, 'add_website');
    if (!quota.allowed) {
      throw new Error(quota.reason);
    }

    // 2. Test WordPress connection
    const check = await WordPressService.verifyConnection({
      siteUrl: input.url,
      username: input.wp_username,
      applicationPassword: input.wp_application_password,
    });

    if (!check.valid) {
      throw new Error(check.errorMessage || 'Failed to authenticate with WordPress site.');
    }

    const websiteId = `site_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const connId = `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const newWebsite: Website = {
      id: websiteId,
      organization_id: orgId,
      business_id: input.business_id || null,
      name: input.name,
      url: WordPressService.normalizeUrl(input.url),
      status: 'connected',
      created_at: new Date().toISOString(),
      wp_connection: {
        id: connId,
        website_id: websiteId,
        wp_username: input.wp_username,
        wp_user_display_name: check.displayName,
        can_publish: check.canPublish,
        status: 'active',
        last_verified_at: new Date().toISOString(),
      },
    };

    updateMockDb(state => {
      state.websites.unshift(newWebsite);
      state.wpConnections[websiteId] = {
        wp_username: input.wp_username,
        app_password_masked: '•••• •••• •••• ' + input.wp_application_password.slice(-4),
      };
    });

    await UsageService.recordUsage(orgId, 'website_add');

    await ActivityService.log({
      organization_id: orgId,
      action: `Connected WordPress website: ${newWebsite.name}`,
      entity_type: 'website',
      entity_id: newWebsite.id,
      metadata: { url: newWebsite.url, wp_user: input.wp_username },
    });

    return newWebsite;
  }

  public static async disconnect(orgId: string, id: string): Promise<void> {
    const db = getMockDb();
    const existing = db.websites.find(w => w.id === id && w.organization_id === orgId);
    if (!existing) {
      throw new Error('Website not found');
    }

    updateMockDb(state => {
      state.websites = state.websites.filter(w => w.id !== id);
      delete state.wpConnections[id];
    });

    await UsageService.recordUsage(orgId, 'website_remove');

    await ActivityService.log({
      organization_id: orgId,
      action: `Disconnected WordPress site: ${existing.name}`,
      entity_type: 'website',
      entity_id: id,
    });
  }
}
