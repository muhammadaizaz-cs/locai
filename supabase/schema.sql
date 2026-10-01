-- LocAI Database Schema
-- Multi-tenant architecture with PostgreSQL and Supabase Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE post_status AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'ARCHIVED');
CREATE TYPE subscription_tier AS ENUM ('FREE', 'STARTER', 'PRO', 'AGENCY');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'INCOMPLETE');
CREATE TYPE ai_provider_type AS ENUM ('openai', 'deepseek', 'grok');
CREATE TYPE billing_provider_type AS ENUM ('stripe', 'paddle', 'lemonsqueezy');

-- 3. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORGANIZATION MEMBERS (Multi-tenant access control)
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- 6. BUSINESSES TABLE (Local Business Profiles)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    city TEXT NOT NULL,
    state_province TEXT,
    country TEXT NOT NULL DEFAULT 'United States',
    postal_code TEXT,
    services TEXT[] DEFAULT '{}',
    target_audience TEXT,
    business_hours TEXT,
    unique_selling_points TEXT[] DEFAULT '{}',
    brand_tone TEXT DEFAULT 'Professional, Authoritative, and Friendly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WEBSITES TABLE
CREATE TABLE IF NOT EXISTS websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. WORDPRESS CONNECTIONS TABLE (Encrypted credentials)
CREATE TABLE IF NOT EXISTS wordpress_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID UNIQUE NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    wp_username TEXT NOT NULL,
    encrypted_application_password TEXT NOT NULL,
    encryption_iv TEXT NOT NULL,
    encryption_tag TEXT NOT NULL,
    wp_user_id BIGINT,
    wp_user_display_name TEXT,
    can_publish BOOLEAN DEFAULT TRUE,
    api_endpoint TEXT NOT NULL,
    last_verified_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'invalid_credentials', 'unreachable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CONTENT PROJECTS TABLE
CREATE TABLE IF NOT EXISTS content_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN (
        'LOCAL_SERVICE_PAGE',
        'LOCATION_PAGE',
        'SERVICE_LOCATION_PAGE',
        'BLOG_ARTICLE',
        'FAQ',
        'BUSINESS_DESCRIPTION',
        'GBP_POST',
        'SEO_METADATA'
    )),
    topic TEXT NOT NULL,
    target_location TEXT NOT NULL,
    primary_keyword TEXT NOT NULL,
    secondary_keywords TEXT[] DEFAULT '{}',
    tone TEXT DEFAULT 'Professional',
    status post_status DEFAULT 'DRAFT',
    seo_score INTEGER DEFAULT 0,
    current_version_number INTEGER DEFAULT 1,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. CONTENT VERSIONS TABLE (Full version history and audit)
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content_html TEXT NOT NULL,
    content_markdown TEXT,
    excerpt TEXT,
    meta_title TEXT,
    meta_description TEXT,
    slug TEXT,
    focus_keyword TEXT,
    faq_items JSONB DEFAULT '[]'::jsonb,
    seo_score INTEGER DEFAULT 0,
    seo_checklist JSONB DEFAULT '{}'::jsonb,
    word_count INTEGER DEFAULT 0,
    change_summary TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (project_id, version_number)
);

-- 11. WORDPRESS POSTS TABLE (Synchronized state)
CREATE TABLE IF NOT EXISTS wordpress_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    wp_post_id BIGINT NOT NULL,
    wp_post_type TEXT DEFAULT 'post',
    wp_url TEXT,
    wp_edit_url TEXT,
    status TEXT NOT NULL, -- draft, publish, future, pending
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. AI GENERATIONS TABLE (Tracking AI logs and audit)
CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES content_projects(id) ON DELETE SET NULL,
    provider ai_provider_type NOT NULL DEFAULT 'openai',
    model TEXT NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    parameters JSONB DEFAULT '{}'::jsonb,
    response_payload JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. USAGE TABLE (Monthly usage counters)
CREATE TABLE IF NOT EXISTS usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    generations_count INTEGER DEFAULT 0,
    generations_limit INTEGER NOT NULL DEFAULT 10,
    wordpress_publishes_count INTEGER DEFAULT 0,
    wordpress_publishes_limit INTEGER NOT NULL DEFAULT 5,
    websites_count INTEGER DEFAULT 0,
    websites_limit INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (organization_id, period_start)
);

-- 14. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID UNIQUE NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tier subscription_tier DEFAULT 'FREE',
    status subscription_status DEFAULT 'ACTIVE',
    provider billing_provider_type DEFAULT 'stripe',
    customer_id TEXT,
    subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. SUBSCRIPTION EVENTS (Webhooks audit log)
CREATE TABLE IF NOT EXISTS subscription_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider billing_provider_type NOT NULL,
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT TRUE,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. SCHEDULED POSTS TABLE
CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES content_projects(id) ON DELETE CASCADE,
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    attempt_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_org ON businesses(organization_id);
CREATE INDEX IF NOT EXISTS idx_websites_org ON websites(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON content_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON content_projects(status);
CREATE INDEX IF NOT EXISTS idx_versions_project ON content_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_wp_posts_project ON wordpress_posts(project_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_time ON scheduled_posts(scheduled_time, status);
CREATE INDEX IF NOT EXISTS idx_activity_org ON activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);

-- 20. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE wordpress_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wordpress_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user belongs to organization
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read & update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Organizations: users can view orgs they belong to
CREATE POLICY "Org members can view organization" ON organizations
    FOR SELECT USING (is_org_member(id));

-- Businesses
CREATE POLICY "Org members can view businesses" ON businesses
    FOR SELECT USING (is_org_member(organization_id));

CREATE POLICY "Org members can manage businesses" ON businesses
    FOR ALL USING (is_org_member(organization_id));

-- Websites
CREATE POLICY "Org members can view websites" ON websites
    FOR SELECT USING (is_org_member(organization_id));

CREATE POLICY "Org members can manage websites" ON websites
    FOR ALL USING (is_org_member(organization_id));

-- WordPress Connections: Never expose passwords directly
CREATE POLICY "Org members can manage wp connections" ON wordpress_connections
    FOR ALL USING (is_org_member(organization_id));

-- Content Projects & Versions
CREATE POLICY "Org members can view content projects" ON content_projects
    FOR SELECT USING (is_org_member(organization_id));

CREATE POLICY "Org members can manage content projects" ON content_projects
    FOR ALL USING (is_org_member(organization_id));

CREATE POLICY "Org members can view versions" ON content_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM content_projects
            WHERE content_projects.id = content_versions.project_id
            AND is_org_member(content_projects.organization_id)
        )
    );

CREATE POLICY "Org members can insert versions" ON content_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM content_projects
            WHERE content_projects.id = content_versions.project_id
            AND is_org_member(content_projects.organization_id)
        )
    );

-- Subscriptions & Usage
CREATE POLICY "Org members can view subscriptions" ON subscriptions
    FOR SELECT USING (is_org_member(organization_id));

CREATE POLICY "Org members can view usage" ON usage
    FOR SELECT USING (is_org_member(organization_id));

-- Notifications
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());
