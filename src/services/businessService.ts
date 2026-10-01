import { getMockDb, updateMockDb } from '@/lib/store/mockDb';
import { Business } from '@/types';
import { ActivityService } from './activityService';

export type CreateBusinessInput = Omit<Business, 'id' | 'created_at' | 'updated_at'>;

export class BusinessService {
  public static async list(orgId: string): Promise<Business[]> {
    const db = getMockDb();
    return db.businesses.filter(b => b.organization_id === orgId);
  }

  public static async getById(orgId: string, id: string): Promise<Business | null> {
    const db = getMockDb();
    const found = db.businesses.find(b => b.id === id && b.organization_id === orgId);
    return found || null;
  }

  public static async create(orgId: string, input: CreateBusinessInput): Promise<Business> {
    const newBiz: Business = {
      ...input,
      id: `biz_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      organization_id: orgId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    updateMockDb(state => {
      state.businesses.unshift(newBiz);
    });

    await ActivityService.log({
      organization_id: orgId,
      action: `Created business profile: ${newBiz.name}`,
      entity_type: 'business',
      entity_id: newBiz.id,
      metadata: { name: newBiz.name, city: newBiz.city },
    });

    return newBiz;
  }

  public static async update(orgId: string, id: string, updates: Partial<CreateBusinessInput>): Promise<Business> {
    const db = getMockDb();
    const existing = db.businesses.find(b => b.id === id && b.organization_id === orgId);
    if (!existing) {
      throw new Error('Business not found or access denied');
    }

    const updated: Business = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    updateMockDb(state => {
      const idx = state.businesses.findIndex(b => b.id === id);
      if (idx !== -1) {
        state.businesses[idx] = updated;
      }
    });

    await ActivityService.log({
      organization_id: orgId,
      action: `Updated business profile: ${updated.name}`,
      entity_type: 'business',
      entity_id: updated.id,
      metadata: { name: updated.name },
    });

    return updated;
  }

  public static async delete(orgId: string, id: string): Promise<void> {
    const db = getMockDb();
    const existing = db.businesses.find(b => b.id === id && b.organization_id === orgId);
    if (!existing) {
      throw new Error('Business not found or access denied');
    }

    updateMockDb(state => {
      state.businesses = state.businesses.filter(b => b.id !== id);
    });

    await ActivityService.log({
      organization_id: orgId,
      action: `Deleted business profile: ${existing.name}`,
      entity_type: 'business',
      entity_id: id,
    });
  }
}
