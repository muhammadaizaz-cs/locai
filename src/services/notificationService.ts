import { getMockDb, updateMockDb } from '@/lib/store/mockDb';
import { NotificationItem } from '@/types';

export class NotificationService {
  public static async list(userId: string): Promise<NotificationItem[]> {
    const db = getMockDb();
    return db.notifications;
  }

  public static async markAsRead(notificationId: string): Promise<void> {
    updateMockDb(state => {
      const item = state.notifications.find(n => n.id === notificationId);
      if (item) item.read = true;
    });
  }

  public static async create(entry: {
    organization_id: string;
    user_id: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    action_url?: string;
  }): Promise<NotificationItem> {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      organization_id: entry.organization_id,
      user_id: entry.user_id,
      title: entry.title,
      message: entry.message,
      type: entry.type || 'info',
      read: false,
      action_url: entry.action_url,
      created_at: new Date().toISOString(),
    };

    updateMockDb(state => {
      state.notifications.unshift(notif);
    });

    return notif;
  }
}
