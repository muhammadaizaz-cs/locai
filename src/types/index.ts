export type PostStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'FAILED'
  | 'ARCHIVED';

export type ContentType =
  | 'LOCAL_SERVICE_PAGE'
  | 'LOCATION_PAGE'
  | 'SERVICE_LOCATION_PAGE'
  | 'BLOG_ARTICLE'
  | 'FAQ'
  | 'BUSINESS_DESCRIPTION'
  | 'GBP_POST'
  | 'SEO_METADATA';

export type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO' | 'AGENCY';
export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE';
export type AIProviderType = 'openai' | 'deepseek' | 'grok';
export type BillingProviderType = 'stripe' | 'paddle' | 'lemonsqueezy';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_by?: string;
  created_at: string;
}

export interface Business {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state_province: string;
  country: string;
  postal_code: string;
  services: string[];
  target_audience: string;
  business_hours: string;
  unique_selling_points: string[];
  brand_tone: string;
  created_at: string;
  updated_at: string;
}

export interface Website {
  id: string;
  organization_id: string;
  business_id?: string | null;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  created_at: string;
  wp_connection?: WordPressConnectionSummary;
}

export interface WordPressConnectionSummary {
  id: string;
  website_id: string;
  wp_username: string;
  wp_user_display_name?: string;
  can_publish: boolean;
  status: 'active' | 'invalid_credentials' | 'unreachable';
  last_verified_at?: string;
}

export interface ContentProject {
  id: string;
  organization_id: string;
  business_id?: string | null;
  website_id?: string | null;
  title: string;
  content_type: ContentType;
  topic: string;
  target_location: string;
  primary_keyword: string;
  secondary_keywords: string[];
  tone: string;
  status: PostStatus;
  seo_score: number;
  current_version_number: number;
  created_at: string;
  updated_at: string;
  // Joined or calculated fields
  business?: Business;
  website?: Website;
  current_version?: ContentVersion;
  wordpress_post?: WordPressPost;
}

export interface ContentVersion {
  id: string;
  project_id: string;
  version_number: number;
  title: string;
  content_html: string;
  content_markdown?: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  focus_keyword?: string;
  faq_items?: FAQItem[];
  seo_score: number;
  seo_checklist?: SEOChecklist;
  word_count: number;
  change_summary?: string;
  created_at: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOCheckItem {
  id: string;
  label: string;
  passed: boolean;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SEOChecklist {
  score: number;
  checks: SEOCheckItem[];
  recommendations: string[];
}

export interface WordPressPost {
  id: string;
  project_id: string;
  website_id: string;
  wp_post_id: number;
  wp_post_type: string;
  wp_url?: string;
  wp_edit_url?: string;
  status: 'draft' | 'publish' | 'future' | 'pending';
  last_synced_at: string;
  published_at?: string;
  error_message?: string;
}

export interface UsageData {
  organization_id: string;
  period_start: string;
  period_end: string;
  generations_count: number;
  generations_limit: number;
  wordpress_publishes_count: number;
  wordpress_publishes_limit: number;
  websites_count: number;
  websites_limit: number;
}

export interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  generationsLimit: number;
  websitesLimit: number;
  projectsLimit: number | 'Unlimited';
  publishingLimit: number;
  seoLevel: 'Basic' | 'Full' | 'Advanced';
  scheduling: boolean;
  teamMembers: number;
  contentHistoryDays: number;
  bulkGeneration: boolean;
  clientManagement: boolean;
  whiteLabel: boolean;
  features: string[];
  popular?: boolean;
}

export interface ActivityLog {
  id: string;
  organization_id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  organization_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface GenerateContentInput {
  business_id?: string;
  website_id?: string;
  content_type: ContentType;
  topic: string;
  target_location: string;
  primary_keyword: string;
  secondary_keywords?: string[];
  tone?: string;
  additional_instructions?: string;
  target_word_count?: number;
  provider?: AIProviderType;
}

export interface GeneratedContentPayload {
  title: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  excerpt: string;
  content_html: string;
  content_markdown: string;
  faq_items: FAQItem[];
  focus_keyword: string;
  secondary_keywords: string[];
  local_signals: string[];
  estimated_word_count: number;
}
