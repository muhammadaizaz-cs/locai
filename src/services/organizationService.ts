import { Organization, Profile } from '@/types';
import { getMockDb } from '@/lib/store/mockDb';

export class OrganizationService {
  public static async getCurrentOrg(): Promise<Organization> {
    const db = getMockDb();
    return {
      id: db.currentOrgId,
      name: 'LocAI Growth Agency',
      slug: 'locai-growth-agency',
      created_by: db.currentUserId,
      created_at: new Date().toISOString(),
    };
  }

  public static async verifyOrgOwnership(orgId: string, userId: string): Promise<boolean> {
    const db = getMockDb();
    return orgId === db.currentOrgId;
  }
}

export class AuthService {
  public static async getCurrentUser(): Promise<Profile> {
    const db = getMockDb();
    return {
      id: db.currentUserId,
      email: 'alex.director@locai-agency.com',
      full_name: 'Alex Vance',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      created_at: new Date().toISOString(),
    };
  }
}
