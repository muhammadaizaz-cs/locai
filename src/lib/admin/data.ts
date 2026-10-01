/**
 * Admin Data Service
 *
 * Server-side only. All queries use the service role client
 * to read across all organizations. Authorization must be
 * checked BEFORE calling these functions.
 */

import { supabaseAdmin, isServerSupabaseConfigured } from '@/lib/supabase/server';

// ================================================================
// TYPES
// ================================================================

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalOrganizations: number;
  totalAIGenerations: number;
  successfulAIGenerations: number;
  failedAIGenerations: number;
  totalWordPressSites: number;
  connectedWordPressSites: number;
  totalContent: number;
  publishedContent: number;
  scheduledContent: number;
  failedContent: number;
  openSupportTickets: number;
  unresolvedAlerts: number;
  criticalAlerts: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  created_by: string | null;
  memberCount: number;
  websiteCount: number;
  contentCount: number;
  subscription?: {
    tier: string;
    status: string;
  };
}

export interface AdminSubscription {
  id: string;
  organization_id: string;
  organizationName: string;
  tier: string;
  status: string;
  provider: string;
  customer_id: string | null;
  subscription_id: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

export interface AdminAIUsage {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  byProvider: Record<string, number>;
  byOrg: Array<{ orgId: string; orgName: string; count: number }>;
  dailyUsage: Array<{ date: string; count: number }>;
}

export interface AdminWordPressSite {
  id: string;
  name: string;
  url: string;
  status: string;
  organization_id: string;
  organizationName: string;
  created_at: string;
  updated_at: string;
  wp_status: string | null;
  last_verified_at: string | null;
}

export interface AdminContentItem {
  id: string;
  title: string;
  content_type: string;
  status: string;
  seo_score: number;
  organization_id: string;
  organizationName: string;
  created_by: string | null;
  authorName: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminActivityLog {
  id: string;
  organization_id: string;
  organizationName: string | null;
  user_id: string | null;
  userName: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  category: string;
  resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  organization_id: string | null;
  organizationName: string | null;
  user_id: string | null;
  userName: string | null;
  userEmail: string | null;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface AdminPayment {
  id: string;
  organization_id: string | null;
  organizationName: string | null;
  provider: string;
  external_payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
}

// ================================================================
// HELPERS
// ================================================================

function notConfigured() {
  return !isServerSupabaseConfigured();
}

// ================================================================
// STATS
// ================================================================

export async function getAdminStats(): Promise<AdminStats> {
  if (notConfigured()) {
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      totalOrganizations: 0,
      totalAIGenerations: 0,
      successfulAIGenerations: 0,
      failedAIGenerations: 0,
      totalWordPressSites: 0,
      connectedWordPressSites: 0,
      totalContent: 0,
      publishedContent: 0,
      scheduledContent: 0,
      failedContent: 0,
      openSupportTickets: 0,
      unresolvedAlerts: 0,
      criticalAlerts: 0,
    };
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    usersRes,
    activeUsersRes,
    newUsersRes,
    orgsRes,
    aiRes,
    aiSuccessRes,
    aiFailRes,
    websitesRes,
    connectedWpRes,
    contentRes,
    publishedRes,
    scheduledRes,
    failedRes,
    ticketsRes,
    alertsRes,
    criticalRes,
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString()),
    supabaseAdmin.from('organizations').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('ai_generations').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'success'),
    supabaseAdmin
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'failed'),
    supabaseAdmin.from('websites').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('wordpress_connections')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabaseAdmin.from('content_projects').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('content_projects')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'PUBLISHED'),
    supabaseAdmin
      .from('content_projects')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'SCHEDULED'),
    supabaseAdmin
      .from('content_projects')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'FAILED'),
    supabaseAdmin
      .from('support_tickets')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'OPEN'),
    supabaseAdmin
      .from('system_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('resolved', false),
    supabaseAdmin
      .from('system_alerts')
      .select('id', { count: 'exact', head: true })
      .eq('severity', 'CRITICAL')
      .eq('resolved', false),
  ]);

  return {
    totalUsers: usersRes.count ?? 0,
    activeUsers: activeUsersRes.count ?? 0,
    newUsersThisMonth: newUsersRes.count ?? 0,
    totalOrganizations: orgsRes.count ?? 0,
    totalAIGenerations: aiRes.count ?? 0,
    successfulAIGenerations: aiSuccessRes.count ?? 0,
    failedAIGenerations: aiFailRes.count ?? 0,
    totalWordPressSites: websitesRes.count ?? 0,
    connectedWordPressSites: connectedWpRes.count ?? 0,
    totalContent: contentRes.count ?? 0,
    publishedContent: publishedRes.count ?? 0,
    scheduledContent: scheduledRes.count ?? 0,
    failedContent: failedRes.count ?? 0,
    openSupportTickets: ticketsRes.count ?? 0,
    unresolvedAlerts: alertsRes.count ?? 0,
    criticalAlerts: criticalRes.count ?? 0,
  };
}

// ================================================================
// USERS
// ================================================================

export interface UsersQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}

export async function getAdminUsers(
  options: UsersQueryOptions = {}
): Promise<{ users: AdminUser[]; total: number }> {
  if (notConfigured()) return { users: [], total: 0 };

  const { page = 1, pageSize = 20, search, role, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }
  if (role && role !== 'all') {
    query = query.eq('role', role);
  }
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Admin getAdminUsers error:', error.message);
    return { users: [], total: 0 };
  }

  return { users: (data as AdminUser[]) ?? [], total: count ?? 0 };
}

export async function getAdminUserById(userId: string): Promise<AdminUser | null> {
  if (notConfigured()) return null;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data as AdminUser;
}

export async function updateUserStatus(
  userId: string,
  status: 'active' | 'suspended' | 'banned'
): Promise<{ success: boolean; error?: string }> {
  if (notConfigured()) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateUserRole(
  userId: string,
  role: 'user' | 'admin' | 'super_admin'
): Promise<{ success: boolean; error?: string }> {
  if (notConfigured()) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ================================================================
// ORGANIZATIONS
// ================================================================

export interface OrgsQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getAdminOrganizations(
  options: OrgsQueryOptions = {}
): Promise<{ orgs: AdminOrganization[]; total: number }> {
  if (notConfigured()) return { orgs: [], total: 0 };

  const { page = 1, pageSize = 20, search } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin.from('organizations').select('*', { count: 'exact' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data: orgs, count, error } = await query;

  if (error || !orgs) return { orgs: [], total: 0 };

  // Enrich with counts
  const enriched = await Promise.all(
    orgs.map(async (org) => {
      const [membersRes, websitesRes, contentRes, subRes] = await Promise.all([
        supabaseAdmin
          .from('organization_members')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', org.id),
        supabaseAdmin
          .from('websites')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', org.id),
        supabaseAdmin
          .from('content_projects')
          .select('id', { count: 'exact', head: true })
          .eq('organization_id', org.id),
        supabaseAdmin
          .from('subscriptions')
          .select('tier, status')
          .eq('organization_id', org.id)
          .maybeSingle(),
      ]);

      return {
        ...org,
        memberCount: membersRes.count ?? 0,
        websiteCount: websitesRes.count ?? 0,
        contentCount: contentRes.count ?? 0,
        subscription: subRes.data
          ? { tier: subRes.data.tier, status: subRes.data.status }
          : { tier: 'FREE', status: 'ACTIVE' },
      } as AdminOrganization;
    })
  );

  return { orgs: enriched, total: count ?? 0 };
}

// ================================================================
// SUBSCRIPTIONS
// ================================================================

export interface SubsQueryOptions {
  page?: number;
  pageSize?: number;
  tier?: string;
  status?: string;
}

export async function getAdminSubscriptions(
  options: SubsQueryOptions = {}
): Promise<{ subscriptions: AdminSubscription[]; total: number }> {
  if (notConfigured()) return { subscriptions: [], total: 0 };

  const { page = 1, pageSize = 20, tier, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('subscriptions')
    .select('*, organizations(name)', { count: 'exact' });

  if (tier && tier !== 'all') query = query.eq('tier', tier);
  if (status && status !== 'all') query = query.eq('status', status);

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error || !data) return { subscriptions: [], total: 0 };

  const subscriptions = data.map((s) => ({
    ...s,
    organizationName: (s.organizations as { name: string } | null)?.name ?? 'Unknown',
  })) as AdminSubscription[];

  return { subscriptions, total: count ?? 0 };
}

// ================================================================
// PAYMENTS
// ================================================================

export interface PaymentsQueryOptions {
  page?: number;
  pageSize?: number;
  status?: string;
  provider?: string;
}

export async function getAdminPayments(
  options: PaymentsQueryOptions = {}
): Promise<{ payments: AdminPayment[]; total: number }> {
  if (notConfigured()) return { payments: [], total: 0 };

  const { page = 1, pageSize = 20, status, provider } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('payments')
    .select('*, organizations(name)', { count: 'exact' });

  if (status && status !== 'all') query = query.eq('status', status);
  if (provider && provider !== 'all') query = query.eq('provider', provider);

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error || !data) return { payments: [], total: 0 };

  const payments = data.map((p) => ({
    ...p,
    organizationName: (p.organizations as { name: string } | null)?.name ?? 'Unknown',
  })) as AdminPayment[];

  return { payments, total: count ?? 0 };
}

// ================================================================
// AI USAGE
// ================================================================

export async function getAdminAIUsage(): Promise<AdminAIUsage> {
  if (notConfigured()) {
    return {
      totalGenerations: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      byProvider: {},
      byOrg: [],
      dailyUsage: [],
    };
  }

  const [totalRes, successRes, failedRes, providerRes] = await Promise.all([
    supabaseAdmin.from('ai_generations').select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'success'),
    supabaseAdmin
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'failed'),
    supabaseAdmin.from('ai_generations').select('provider'),
  ]);

  // Count by provider
  const byProvider: Record<string, number> = {};
  if (providerRes.data) {
    for (const row of providerRes.data) {
      byProvider[row.provider] = (byProvider[row.provider] ?? 0) + 1;
    }
  }

  // Org usage - top 10
  const { data: orgUsageData } = await supabaseAdmin
    .from('ai_generations')
    .select('organization_id')
    .limit(500);

  const orgCounts: Record<string, number> = {};
  if (orgUsageData) {
    for (const row of orgUsageData) {
      if (row.organization_id) {
        orgCounts[row.organization_id] = (orgCounts[row.organization_id] ?? 0) + 1;
      }
    }
  }

  const topOrgIds = Object.entries(orgCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => id);

  let byOrg: Array<{ orgId: string; orgName: string; count: number }> = [];
  if (topOrgIds.length > 0) {
    const { data: orgsData } = await supabaseAdmin
      .from('organizations')
      .select('id, name')
      .in('id', topOrgIds);

    byOrg = topOrgIds.map((id) => ({
      orgId: id,
      orgName: orgsData?.find((o) => o.id === id)?.name ?? 'Unknown',
      count: orgCounts[id] ?? 0,
    }));
  }

  return {
    totalGenerations: totalRes.count ?? 0,
    successfulGenerations: successRes.count ?? 0,
    failedGenerations: failedRes.count ?? 0,
    byProvider,
    byOrg,
    dailyUsage: [],
  };
}

// ================================================================
// WORDPRESS SITES
// ================================================================

export async function getAdminWordPressSites(
  options: { page?: number; pageSize?: number; status?: string } = {}
): Promise<{ sites: AdminWordPressSite[]; total: number }> {
  if (notConfigured()) return { sites: [], total: 0 };

  const { page = 1, pageSize = 20, status } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('websites')
    .select('*, organizations(name)', { count: 'exact' });

  if (status && status !== 'all') query = query.eq('status', status);

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error || !data) return { sites: [], total: 0 };

  // Get WordPress connection status
  const siteIds = data.map((s) => s.id);
  let wpMap: Record<string, { status: string; last_verified_at: string | null }> = {};

  if (siteIds.length > 0) {
    const { data: wpData } = await supabaseAdmin
      .from('wordpress_connections')
      .select('website_id, status, last_verified_at')
      .in('website_id', siteIds);

    if (wpData) {
      for (const wp of wpData) {
        wpMap[wp.website_id] = {
          status: wp.status,
          last_verified_at: wp.last_verified_at,
        };
      }
    }
  }

  const sites = data.map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    status: s.status,
    organization_id: s.organization_id,
    organizationName: (s.organizations as { name: string } | null)?.name ?? 'Unknown',
    created_at: s.created_at,
    updated_at: s.updated_at,
    wp_status: wpMap[s.id]?.status ?? null,
    last_verified_at: wpMap[s.id]?.last_verified_at ?? null,
  })) as AdminWordPressSite[];

  return { sites, total: count ?? 0 };
}

// ================================================================
// CONTENT
// ================================================================

export async function getAdminContent(
  options: {
    page?: number;
    pageSize?: number;
    status?: string;
    organizationId?: string;
    contentType?: string;
  } = {}
): Promise<{ content: AdminContentItem[]; total: number }> {
  if (notConfigured()) return { content: [], total: 0 };

  const { page = 1, pageSize = 20, status, organizationId, contentType } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('content_projects')
    .select('*, organizations(name), profiles(full_name)', { count: 'exact' });

  if (status && status !== 'all') query = query.eq('status', status);
  if (organizationId) query = query.eq('organization_id', organizationId);
  if (contentType && contentType !== 'all') query = query.eq('content_type', contentType);

  query = query.order('updated_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error || !data) return { content: [], total: 0 };

  const content = data.map((c) => ({
    id: c.id,
    title: c.title,
    content_type: c.content_type,
    status: c.status,
    seo_score: c.seo_score ?? 0,
    organization_id: c.organization_id,
    organizationName: (c.organizations as { name: string } | null)?.name ?? 'Unknown',
    created_by: c.created_by,
    authorName: (c.profiles as { full_name: string | null } | null)?.full_name ?? null,
    created_at: c.created_at,
    updated_at: c.updated_at,
  })) as AdminContentItem[];

  return { content, total: count ?? 0 };
}

// ================================================================
// ACTIVITY LOGS
// ================================================================

export async function getAdminActivityLogs(
  options: { page?: number; pageSize?: number; organizationId?: string } = {}
): Promise<{ logs: AdminActivityLog[]; total: number }> {
  if (notConfigured()) return { logs: [], total: 0 };

  const { page = 1, pageSize = 30, organizationId } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('activity_logs')
    .select('*, organizations(name), profiles(full_name)', { count: 'exact' });

  if (organizationId) query = query.eq('organization_id', organizationId);

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error || !data) return { logs: [], total: 0 };

  const logs = data.map((l) => ({
    id: l.id,
    organization_id: l.organization_id,
    organizationName: (l.organizations as { name: string } | null)?.name ?? null,
    user_id: l.user_id,
    userName: (l.profiles as { full_name: string | null } | null)?.full_name ?? null,
    action: l.action,
    entity_type: l.entity_type,
    entity_id: l.entity_id ?? null,
    metadata: l.metadata ?? {},
    created_at: l.created_at,
  })) as AdminActivityLog[];

  return { logs, total: count ?? 0 };
}

// ================================================================
// SYSTEM ALERTS
// ================================================================

export async function getSystemAlerts(
  options: {
    page?: number;
    pageSize?: number;
    severity?: string;
    resolved?: boolean;
  } = {}
): Promise<{ alerts: SystemAlert[]; total: number }> {
  if (notConfigured()) return { alerts: [], total: 0 };

  const { page = 1, pageSize = 20, severity, resolved } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('system_alerts')
    .select('*', { count: 'exact' });

  if (severity && severity !== 'all') query = query.eq('severity', severity);
  if (resolved !== undefined) query = query.eq('resolved', resolved);

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error || !data) return { alerts: [], total: 0 };

  return { alerts: data as SystemAlert[], total: count ?? 0 };
}

export async function resolveSystemAlert(
  alertId: string,
  resolvedBy: string
): Promise<{ success: boolean; error?: string }> {
  if (notConfigured()) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin
    .from('system_alerts')
    .update({
      resolved: true,
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', alertId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ================================================================
// SUPPORT TICKETS
// ================================================================

export async function getAdminSupportTickets(
  options: {
    page?: number;
    pageSize?: number;
    status?: string;
    priority?: string;
  } = {}
): Promise<{ tickets: SupportTicket[]; total: number }> {
  if (notConfigured()) return { tickets: [], total: 0 };

  const { page = 1, pageSize = 20, status, priority } = options;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from('support_tickets')
    .select('*, organizations(name), profiles!support_tickets_user_id_fkey(full_name, email)', {
      count: 'exact',
    });

  if (status && status !== 'all') query = query.eq('status', status);
  if (priority && priority !== 'all') query = query.eq('priority', priority);

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error || !data) return { tickets: [], total: 0 };

  const tickets = data.map((t) => {
    const profileData = t.profiles as { full_name: string | null; email: string } | null;
    return {
      id: t.id,
      ticket_number: t.ticket_number,
      organization_id: t.organization_id ?? null,
      organizationName: (t.organizations as { name: string } | null)?.name ?? null,
      user_id: t.user_id ?? null,
      userName: profileData?.full_name ?? null,
      userEmail: profileData?.email ?? null,
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      created_at: t.created_at,
      updated_at: t.updated_at,
    };
  }) as SupportTicket[];

  return { tickets, total: count ?? 0 };
}

export async function updateSupportTicket(
  ticketId: string,
  updates: { status?: string; priority?: string; assigned_to?: string }
): Promise<{ success: boolean; error?: string }> {
  if (notConfigured()) return { success: false, error: 'Supabase not configured' };

  const { error } = await supabaseAdmin
    .from('support_tickets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', ticketId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ================================================================
// ADMIN AUDIT LOG
// ================================================================

export async function logAdminAction(params: {
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  organizationId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (notConfigured()) return;

  await supabaseAdmin.from('admin_audit_logs').insert({
    actor_id: params.actorId,
    actor_role: params.actorRole,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId ?? null,
    organization_id: params.organizationId ?? null,
    metadata: params.metadata ?? {},
    created_at: new Date().toISOString(),
  });
}

// ================================================================
// SETTINGS (read env config safely)
// ================================================================

export interface AdminSystemSettings {
  supabaseConfigured: boolean;
  stripeConfigured: boolean;
  paddleConfigured: boolean;
  lemonsqueezyConfigured: boolean;
  openAIConfigured: boolean;
  deepseekConfigured: boolean;
  grokConfigured: boolean;
  wordpressEncryptionConfigured: boolean;
  activeBillingProvider: string;
  maintenanceMode: boolean;
}

export function getAdminSystemSettings(): AdminSystemSettings {
  return {
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    paddleConfigured: Boolean(process.env.PADDLE_API_KEY),
    lemonsqueezyConfigured: Boolean(process.env.LEMONSQUEEZY_API_KEY),
    openAIConfigured: Boolean(process.env.OPENAI_API_KEY),
    deepseekConfigured: Boolean(process.env.DEEPSEEK_API_KEY),
    grokConfigured: Boolean(process.env.GROK_API_KEY),
    wordpressEncryptionConfigured: Boolean(process.env.WORDPRESS_ENCRYPTION_KEY),
    activeBillingProvider: process.env.ACTIVE_BILLING_PROVIDER || 'stripe',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  };
}
