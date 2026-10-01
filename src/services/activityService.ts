import { getMockDb, updateMockDb } from '@/lib/store/mockDb';
import { ActivityLog } from '@/types';

export class ActivityService {
  public static async list(orgId: string, limit: number = 20): Promise<ActivityLog[]> {
    const db = getMockDb();
    return db.activityLogs
      .filter(log => log.organization_id === orgId)
      .slice(0, limit);
  }

  public static async log(entry: {
    organization_id: string;
    user_id?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ActivityLog> {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      organization_id: entry.organization_id,
      user_id: entry.user_id,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      metadata: entry.metadata,
      created_at: new Date().toISOString(),
    };

    updateMockDb(state => {
      state.activityLogs.unshift(newLog);
    });

    return newLog;
  }
}
