# LocAI — AI-Powered Local Business Content & WordPress Publishing SaaS

> **Tagline:** Create Local SEO Content. Publish Directly to WordPress.

LocAI is a production-ready, multi-tenant AI SaaS platform engineered for local businesses, freelancers, and SEO agencies to generate high-ranking, human-sounding local content and publish it directly to WordPress in one click.

---

## 🚀 Key Highlights & Capabilities

* **Multi-Tenant Architecture:** Secure multi-tenant organization boundaries with PostgreSQL Row-Level Security (RLS). Users can only access resources belonging to their organization.
* **AI Provider Abstraction Layer:** Enterprise provider pattern supporting **OpenAI (GPT-4o)**, **DeepSeek (V3/Reasoner)**, and **Grok (xAI)** with structured JSON parsing, automated repair, and local fallback generation.
* **Native WordPress REST API Integration:** Zero-plugin direct integration using official **Application Passwords** encrypted server-side with **AES-256-GCM**.
* **1-Click WordPress Publishing & Scheduling:** Save drafts, publish live immediately, or schedule future posts directly into WordPress core with synchronized live permalinks and post IDs.
* **Real-time Local SEO Scoring Engine:** Visual SEO score gauge (0–100) and actionable checklist analyzing keyword prominence in H1, intro, subheadings, meta title, meta description, URL slug, length, density, and schema-ready FAQs.
* **Rich Content Editor & Version Control:** Visual WYSIWYG and HTML source modes with complete version history, change tracking, and one-click restoration.
* **Content Calendar:** Visual monthly calendar to view and manage scheduled and published WordPress articles.
* **Multi-Provider Billing & Subscriptions:** Tiered plans (Free, Starter, Pro, Agency) with support for Stripe, Paddle, and Lemon Squeezy checkout and verified webhook handling.
* **Full Local Business Profiles:** 16-field local profiles capturing services, target locations, unique selling propositions (USPs), business hours, phone, and brand tone.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, Server Actions, Route Handlers)
* **Language:** TypeScript 5
* **Styling:** Vanilla Tailwind CSS + Glassmorphism & Custom SaaS Design System
* **Icons:** Lucide Icons
* **Database & Auth:** Supabase / PostgreSQL with Row-Level Security (RLS) policies
* **Security:** AES-256-GCM encryption for WordPress credentials via Node `crypto`
* **Validation:** Zod schemas

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                     # High-converting SaaS landing page
│   ├── (auth)/
│   │   ├── login/page.tsx               # Sign in
│   │   ├── signup/page.tsx              # Sign up with tenant setup
│   │   └── forgot-password/page.tsx     # Password recovery
│   ├── dashboard/page.tsx               # Analytics, KPIs, onboarding checklist
│   ├── content/
│   │   ├── page.tsx                     # Content Hub with status filters
│   │   ├── create/page.tsx              # AI Studio generation workflow
│   │   └── [id]/page.tsx                # Content Editor, SEO audit & WP publisher
│   ├── businesses/
│   │   ├── page.tsx                     # Local business profiles
│   │   └── new/page.tsx                 # 16-field local business creator
│   ├── websites/page.tsx                # WordPress connection manager & REST test
│   ├── calendar/page.tsx                # Interactive Content Calendar
│   ├── seo/page.tsx                     # Local SEO Audit Studio
│   ├── billing/
│   │   ├── page.tsx                     # 4-tier plans & provider selector
│   │   └── success/page.tsx             # Checkout confirmation
│   ├── usage/page.tsx                   # Usage quotas & format breakdown
│   ├── settings/page.tsx                # Profile, Org, BYOK AI keys, Security
│   ├── help/page.tsx                    # WordPress connection & SEO playbooks
│   └── api/
│       ├── ai/generate/route.ts         # Multi-provider AI generation
│       ├── wordpress/
│       │   ├── test/route.ts            # WP REST API credentials verification
│       │   ├── connect/route.ts         # Encrypted WP site connection
│       │   └── publish/route.ts         # 1-click Draft, Publish, Schedule
│       ├── content/
│       │   ├── route.ts                 # List content projects
│       │   └── [id]/
│       │       ├── route.ts             # Retrieve & update project / version
│       │       └── versions/route.ts    # Revision history
│       ├── businesses/route.ts          # Business profiles CRUD
│       ├── websites/route.ts            # Connected sites CRUD
│       └── billing/
│           ├── checkout/route.ts        # Stripe / Paddle / Lemon Squeezy checkout
│           └── webhook/route.ts         # Verified webhook handler
│
├── components/
│   └── layout/
│       ├── DashboardShell.tsx           # Responsive layout container
│       ├── Sidebar.tsx                  # Org switcher & navigation
│       └── Header.tsx                   # Notifications & quick action bar
│
├── lib/
│   ├── constants.ts                     # Plans, features, content type schemas
│   ├── utils.ts                         # Tailwind merge, date and slug formatters
│   ├── security/
│   │   └── crypto.ts                    # AES-256-GCM encryption/decryption
│   ├── store/
│   │   └── mockDb.ts                    # In-memory tenant persistence & seeds
│   └── supabase/
│       ├── client.ts                    # Browser Supabase client
│       └── server.ts                    # Admin server Supabase client
│
├── services/
│   ├── aiService.ts                     # OpenAI, DeepSeek, Grok abstraction
│   ├── wordpressService.ts              # WP REST API client & auth
│   ├── contentService.ts                # Content lifecycle & version control
│   ├── seoService.ts                    # Real-time local SEO audit engine
│   ├── businessService.ts               # Local business profile manager
│   ├── websiteService.ts                # WordPress site connections
│   ├── usageService.ts                  # Server-side quota enforcement
│   ├── billingService.ts                # Payment provider abstraction
│   ├── activityService.ts               # Audit logging
│   ├── notificationService.ts           # In-app notifications
│   └── organizationService.ts           # Multi-tenant tenant verification
│
├── types/index.ts                       # Complete TypeScript contracts
└── supabase/
    └── schema.sql                       # PostgreSQL schema, RLS & triggers
```

---

## ⚡ Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and set your credentials:
```bash
cp .env.example .env.local
```

Key environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Providers
OPENAI_API_KEY=your-openai-key
DEEPSEEK_API_KEY=your-deepseek-key
GROK_API_KEY=your-grok-key
ACTIVE_AI_PROVIDER=openai

# WordPress Encryption
WORDPRESS_ENCRYPTION_KEY=32-character-random-secret-key-here

# Billing
STRIPE_SECRET_KEY=your-stripe-secret
ACTIVE_BILLING_PROVIDER=stripe
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🛡️ Security Architecture

1. **WordPress Credentials:** Application Passwords are encrypted server-side with AES-256-GCM. Client browsers only see masked strings (`•••• 9bX2`).
2. **Row-Level Security:** PostgreSQL RLS strictly enforces that tenant organizations can only query and mutate their own business profiles, content, and websites.
3. **No Leaked Secrets:** AI API keys and billing secrets are confined to server-side Route Handlers and services.

---

## 📄 License
MIT License. Built for production SaaS deployments.
