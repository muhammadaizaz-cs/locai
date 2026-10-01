import {
  Business,
  Website,
  ContentProject,
  ContentVersion,
  WordPressPost,
  UsageData,
  ActivityLog,
  NotificationItem,
  SubscriptionTier,
} from '@/types';

export interface MockDatabaseState {
  currentOrgId: string;
  currentUserId: string;
  subscriptionTier: SubscriptionTier;
  businesses: Business[];
  websites: Website[];
  wpConnections: Record<string, { wp_username: string; app_password_masked: string }>;
  projects: ContentProject[];
  versions: ContentVersion[];
  wordpressPosts: WordPressPost[];
  usage: UsageData;
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
}

export const INITIAL_MOCK_DATA: MockDatabaseState = {
  currentOrgId: 'org_locai_demo_default',
  currentUserId: 'user_locai_demo_admin',
  subscriptionTier: 'PRO',
  businesses: [
    {
      id: 'biz-1',
      organization_id: 'org_locai_demo_default',
      name: 'Apex Plumbing & Rooter Pros',
      category: 'Plumbing Contractor & Emergency Services',
      description: 'Premier licensed plumbing contractors specializing in rapid 24/7 emergency pipe repair, sewer line clearing, water heater installation, and commercial maintenance.',
      phone: '(555) 234-8901',
      email: 'service@apexplumbingpros.com',
      website: 'https://apexplumbingpros.com',
      address: '1428 Industrial Blvd, Suite 4B',
      city: 'Mardan',
      state_province: 'Khyber Pakhtunkhwa',
      country: 'Pakistan',
      postal_code: '23200',
      services: [
        '24/7 Emergency Plumbing Repair',
        'Drain Snaking & Hydro Jetting',
        'Tankless Water Heater Installation',
        'Slab Leak Detection',
        'Commercial Backflow Testing',
      ],
      target_audience: 'Local homeowners, property managers, and commercial business owners needing prompt, verified plumbing fixes.',
      business_hours: 'Monday - Sunday: 24 Hours Open',
      unique_selling_points: [
        'Average 35-minute rapid arrival in Mardan area',
        'Upfront transparent flat-rate pricing — no hidden travel fees',
        'Fully licensed, bonded, and certified master technicians',
        '100% satisfaction guarantee on all sewer & pipe work',
      ],
      brand_tone: 'Authoritative, Friendly, Reassuring, and Highly Professional',
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'biz-2',
      organization_id: 'org_locai_demo_default',
      name: 'Valley Horizon HVAC & Cooling',
      category: 'Heating & Air Conditioning Service',
      description: 'Certified residential HVAC tune-ups, AC repairs, heat pump installations, and commercial ventilation specialists.',
      phone: '(555) 456-7890',
      email: 'contact@valleyhorizonhvac.com',
      website: 'https://valleyhorizonhvac.com',
      address: '88 Commerce Way',
      city: 'Peshawar',
      state_province: 'Khyber Pakhtunkhwa',
      country: 'Pakistan',
      postal_code: '25000',
      services: ['Central AC Repair', 'Ductless Mini-Split Installation', 'Furnace Maintenance'],
      target_audience: 'Homeowners and retail shops seeking energy efficiency.',
      business_hours: 'Mon-Sat: 8:00 AM - 8:00 PM',
      unique_selling_points: ['Same-day service guarantee', 'Carrier & Trane certified installers'],
      brand_tone: 'Trustworthy, Efficient, and Friendly',
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ],
  websites: [
    {
      id: 'site-1',
      organization_id: 'org_locai_demo_default',
      business_id: 'biz-1',
      name: 'Apex Plumbing Official WP',
      url: 'https://apexplumbingpros.com',
      status: 'connected',
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      wp_connection: {
        id: 'conn-1',
        website_id: 'site-1',
        wp_username: 'locai_publisher_admin',
        wp_user_display_name: 'LocAI Content Bot',
        can_publish: true,
        status: 'active',
        last_verified_at: new Date(Date.now() - 3600000).toISOString(),
      },
    },
    {
      id: 'site-2',
      organization_id: 'org_locai_demo_default',
      business_id: 'biz-2',
      name: 'Valley HVAC WordPress Portal',
      url: 'https://valleyhorizonhvac.com',
      status: 'connected',
      created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
      wp_connection: {
        id: 'conn-2',
        website_id: 'site-2',
        wp_username: 'wp_editor_valley',
        wp_user_display_name: 'Editor Valley',
        can_publish: true,
        status: 'active',
        last_verified_at: new Date(Date.now() - 7200000).toISOString(),
      },
    },
  ],
  wpConnections: {
    'site-1': { wp_username: 'locai_publisher_admin', app_password_masked: '•••• •••• •••• 9bX2' },
    'site-2': { wp_username: 'wp_editor_valley', app_password_masked: '•••• •••• •••• 4KaQ' },
  },
  projects: [
    {
      id: 'proj-1',
      organization_id: 'org_locai_demo_default',
      business_id: 'biz-1',
      website_id: 'site-1',
      title: 'Emergency Plumbing Services in Mardan: 24/7 Rapid Response',
      content_type: 'LOCAL_SERVICE_PAGE',
      topic: 'Emergency plumbing repairs, burst pipe handling, and rapid callout technicians',
      target_location: 'Mardan',
      primary_keyword: 'Emergency Plumbing Services in Mardan',
      secondary_keywords: ['24/7 plumber Mardan', 'burst pipe repair Mardan', 'local plumber near me'],
      tone: 'Professional, Authoritative, Reassuring',
      status: 'PUBLISHED',
      seo_score: 96,
      current_version_number: 2,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'proj-2',
      organization_id: 'org_locai_demo_default',
      business_id: 'biz-1',
      website_id: 'site-1',
      title: 'Best Plumbing Services in Mardan for Residential & Commercial',
      content_type: 'LOCATION_PAGE',
      topic: 'Comprehensive city-wide local plumbing services and maintenance plans',
      target_location: 'Mardan',
      primary_keyword: 'Best Plumbing Services in Mardan',
      secondary_keywords: ['reliable plumbers Mardan', 'residential plumbing Mardan', 'licensed plumber'],
      tone: 'Authoritative, Friendly',
      status: 'APPROVED',
      seo_score: 92,
      current_version_number: 1,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
    {
      id: 'proj-3',
      organization_id: 'org_locai_demo_default',
      business_id: 'biz-1',
      website_id: 'site-1',
      title: 'How to Choose a Reliable Plumber in Peshawar & Surrounding Areas',
      content_type: 'BLOG_ARTICLE',
      topic: 'Educational consumer checklist for vetting licensed local plumbing technicians',
      target_location: 'Peshawar',
      primary_keyword: 'How to Choose a Reliable Plumber in Peshawar',
      secondary_keywords: ['hire plumber Peshawar', 'plumber vetting guide', 'licensed plumbers KP'],
      tone: 'Educational, Helpful',
      status: 'SCHEDULED',
      seo_score: 88,
      current_version_number: 1,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    },
    {
      id: 'proj-4',
      organization_id: 'org_locai_demo_default',
      business_id: 'biz-2',
      website_id: 'site-2',
      title: 'Commercial Air Conditioning Repair in Peshawar City',
      content_type: 'SERVICE_LOCATION_PAGE',
      topic: 'Commercial HVAC cooling maintenance, rooftop unit repairs, and energy efficiency',
      target_location: 'Peshawar',
      primary_keyword: 'Commercial Air Conditioning Repair in Peshawar',
      secondary_keywords: ['HVAC repair Peshawar', 'office AC service Peshawar'],
      tone: 'Professional, Technical',
      status: 'REVIEW',
      seo_score: 85,
      current_version_number: 1,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'proj-5',
      organization_id: 'org_locai_demo_default',
      business_id: 'biz-1',
      website_id: 'site-1',
      title: 'Frequently Asked Questions: Drain Snaking & Sewer Line Safety',
      content_type: 'FAQ',
      topic: 'Common questions on main sewer line cleaning, costs, and prevention tips',
      target_location: 'Mardan',
      primary_keyword: 'Sewer Line Cleaning FAQs Mardan',
      secondary_keywords: ['drain clearing FAQ', 'hydro jetting questions'],
      tone: 'Helpful, Informative',
      status: 'DRAFT',
      seo_score: 78,
      current_version_number: 1,
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
  ],
  versions: [
    {
      id: 'ver-1',
      project_id: 'proj-1',
      version_number: 2,
      title: 'Emergency Plumbing Services in Mardan: 24/7 Rapid Response',
      content_html: `<h2>Rapid 24/7 Emergency Plumbing Services in Mardan</h2>
<p>When a pipe bursts at 2 AM or sewage backs up into your bathroom, you cannot afford to wait until morning. <strong>Apex Plumbing &amp; Rooter Pros</strong> provides certified, rapid-arrival <strong>emergency plumbing services in Mardan</strong>, reaching your doorstep within an average of 35 minutes.</p>

<h3>Common Plumbing Emergencies We Solve Immediately in Mardan</h3>
<ul>
  <li><strong>Severe Burst Pipes &amp; Flooding:</strong> Instant shut-off assistance and durable copper or PEX line replacements.</li>
  <li><strong>Raw Sewage Backups:</strong> Heavy-duty snaking and sanitation to eliminate biohazard backups.</li>
  <li><strong>Failing Water Heaters:</strong> Sudden loss of hot water or leaking hot water tanks repaired promptly.</li>
  <li><strong>Gas Line Leaks:</strong> Safe detection and certified shut-down protocol to keep your family protected.</li>
</ul>

<h3>Why Local Homeowners Trust Apex Plumbing in Mardan</h3>
<p>Our team of licensed technicians carries high-grade diagnostic equipment on every vehicle. We offer <em>upfront flat-rate pricing</em> before touching a single pipe—no surprise emergency travel fees.</p>

<h3>Frequently Asked Questions</h3>
<div class="faq-section">
  <h4>How fast can an emergency plumber arrive in Mardan?</h4>
  <p>Our dispatch team maintains dedicated mobile units throughout Mardan, resulting in typical response times between 30 and 45 minutes.</p>
  <h4>Are emergency plumbing rates charged by the hour?</h4>
  <p>No. We provide clear, transparent flat quotes after physical inspection, ensuring total cost transparency before work begins.</p>
</div>`,
      content_markdown: `## Rapid 24/7 Emergency Plumbing Services in Mardan...`,
      excerpt: 'Experiencing a burst pipe or sewage emergency in Mardan? Apex Plumbing delivers guaranteed 35-minute rapid arrival 24/7 with zero hidden travel fees.',
      meta_title: 'Emergency Plumbing Services in Mardan | 24/7 Rapid Response',
      meta_description: 'Fast, certified emergency plumbing services in Mardan. Available 24 hours a day, 7 days a week. Call (555) 234-8901 for 35-minute arrival.',
      slug: 'emergency-plumbing-services-mardan',
      focus_keyword: 'Emergency Plumbing Services in Mardan',
      faq_items: [
        {
          question: 'How fast can an emergency plumber arrive in Mardan?',
          answer: 'Our dispatch team maintains dedicated mobile units throughout Mardan, resulting in typical response times between 30 and 45 minutes.',
        },
        {
          question: 'Are emergency plumbing rates charged by the hour?',
          answer: 'No. We provide clear, transparent flat quotes after physical inspection, ensuring total cost transparency before work begins.',
        },
      ],
      seo_score: 96,
      word_count: 580,
      change_summary: 'Enhanced local city headings, added schema-ready FAQs, and verified keyword density.',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  wordpressPosts: [
    {
      id: 'wp-post-1',
      project_id: 'proj-1',
      website_id: 'site-1',
      wp_post_id: 1042,
      wp_post_type: 'post',
      wp_url: 'https://apexplumbingpros.com/emergency-plumbing-services-mardan/',
      wp_edit_url: 'https://apexplumbingpros.com/wp-admin/post.php?post=1042&action=edit',
      status: 'publish',
      last_synced_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      published_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ],
  usage: {
    organization_id: 'org_locai_demo_default',
    period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    period_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    generations_count: 127,
    generations_limit: 500,
    wordpress_publishes_count: 84,
    wordpress_publishes_limit: 300,
    websites_count: 2,
    websites_limit: 5,
  },
  activityLogs: [
    {
      id: 'act-1',
      organization_id: 'org_locai_demo_default',
      action: 'Content published directly to WordPress',
      entity_type: 'content_project',
      entity_id: 'proj-1',
      metadata: { wp_post_id: 1042, title: 'Emergency Plumbing Services in Mardan' },
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'act-2',
      organization_id: 'org_locai_demo_default',
      action: 'Content approved by editor',
      entity_type: 'content_project',
      entity_id: 'proj-2',
      metadata: { title: 'Best Plumbing Services in Mardan for Residential' },
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'act-3',
      organization_id: 'org_locai_demo_default',
      action: 'WordPress website connected & credentials verified',
      entity_type: 'website',
      entity_id: 'site-1',
      metadata: { url: 'https://apexplumbingpros.com' },
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: 'act-4',
      organization_id: 'org_locai_demo_default',
      action: 'Business profile created',
      entity_type: 'business',
      entity_id: 'biz-1',
      metadata: { name: 'Apex Plumbing & Rooter Pros' },
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      organization_id: 'org_locai_demo_default',
      user_id: 'user_locai_demo_admin',
      title: 'Article Published to WordPress',
      message: 'Your article "Emergency Plumbing Services in Mardan" is now live on apexplumbingpros.com.',
      type: 'success',
      read: false,
      action_url: '/content/proj-1',
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'notif-2',
      organization_id: 'org_locai_demo_default',
      user_id: 'user_locai_demo_admin',
      title: 'Scheduled Post Queued',
      message: '"How to Choose a Reliable Plumber in Peshawar" is scheduled for publication.',
      type: 'info',
      read: true,
      action_url: '/content/proj-3',
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  ],
};

// In-memory persistent state (shared within node runtime session)
let globalState: MockDatabaseState = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));

export function getMockDb(): MockDatabaseState {
  return globalState;
}

export function updateMockDb(updater: (state: MockDatabaseState) => void): MockDatabaseState {
  updater(globalState);
  return globalState;
}

export function resetMockDb(): void {
  globalState = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
}
