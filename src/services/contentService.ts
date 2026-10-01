import { getMockDb, updateMockDb } from '@/lib/store/mockDb';
import {
  ContentProject,
  ContentVersion,
  GenerateContentInput,
  PostStatus,
  WordPressPost,
} from '@/types';
import { AIService } from './aiService';
import { SEOService } from './seoService';
import { UsageService } from './usageService';
import { WordPressService } from './wordpressService';
import { ActivityService } from './activityService';
import { NotificationService } from './notificationService';
import { BusinessService } from './businessService';

export class ContentService {
  /**
   * List all content projects for an organization with optional filters
   */
  public static async list(
    orgId: string,
    filters?: {
      status?: PostStatus | 'ALL';
      search?: string;
      businessId?: string;
      websiteId?: string;
    }
  ): Promise<ContentProject[]> {
    const db = getMockDb();
    let items = db.projects.filter(p => p.organization_id === orgId);

    if (filters?.status && filters.status !== 'ALL') {
      items = items.filter(p => p.status === filters.status);
    }

    if (filters?.businessId) {
      items = items.filter(p => p.business_id === filters.businessId);
    }

    if (filters?.websiteId) {
      items = items.filter(p => p.website_id === filters.websiteId);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.primary_keyword.toLowerCase().includes(q) ||
          p.target_location.toLowerCase().includes(q) ||
          p.topic.toLowerCase().includes(q)
      );
    }

    // Attach business, website, current version, wp post
    return items.map(p => this.hydrateProject(p));
  }

  /**
   * Retrieve single project by ID
   */
  public static async getById(orgId: string, id: string): Promise<ContentProject | null> {
    const db = getMockDb();
    const project = db.projects.find(p => p.id === id && p.organization_id === orgId);
    if (!project) return null;
    return this.hydrateProject(project);
  }

  /**
   * Helper to hydrate relations
   */
  private static hydrateProject(project: ContentProject): ContentProject {
    const db = getMockDb();
    const business = db.businesses.find(b => b.id === project.business_id);
    const website = db.websites.find(w => w.id === project.website_id);
    const currentVersion = db.versions.find(
      v => v.project_id === project.id && v.version_number === project.current_version_number
    ) || db.versions.find(v => v.project_id === project.id);
    const wordpressPost = db.wordpressPosts.find(wp => wp.project_id === project.id);

    return {
      ...project,
      business,
      website,
      current_version: currentVersion,
      wordpress_post: wordpressPost,
    };
  }

  /**
   * Generate new AI Content Project
   */
  public static async generate(orgId: string, input: GenerateContentInput): Promise<ContentProject> {
    // 1. Quota Check
    const quota = await UsageService.canPerformAction(orgId, 'generate_content');
    if (!quota.allowed) {
      throw new Error(quota.reason);
    }

    // 2. Fetch business if specified
    const business = input.business_id
      ? await BusinessService.getById(orgId, input.business_id)
      : undefined;

    // 3. AI Generation
    const payload = await AIService.generateContent(input, business || undefined);

    // 4. Initial SEO Checklist & Score
    const seoChecklist = SEOService.analyze({
      title: payload.title,
      contentHtml: payload.content_html,
      primaryKeyword: input.primary_keyword,
      targetLocation: input.target_location,
      metaTitle: payload.meta_title,
      metaDescription: payload.meta_description,
      slug: payload.slug,
      faqCount: payload.faq_items.length,
    });

    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const versionId = `ver_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const newProject: ContentProject = {
      id: projectId,
      organization_id: orgId,
      business_id: input.business_id || null,
      website_id: input.website_id || null,
      title: payload.title,
      content_type: input.content_type,
      topic: input.topic,
      target_location: input.target_location,
      primary_keyword: input.primary_keyword,
      secondary_keywords: input.secondary_keywords || [],
      tone: input.tone || 'Professional',
      status: 'DRAFT',
      seo_score: seoChecklist.score,
      current_version_number: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const initialVersion: ContentVersion = {
      id: versionId,
      project_id: projectId,
      version_number: 1,
      title: payload.title,
      content_html: payload.content_html,
      content_markdown: payload.content_markdown,
      excerpt: payload.excerpt,
      meta_title: payload.meta_title,
      meta_description: payload.meta_description,
      slug: payload.slug,
      focus_keyword: payload.focus_keyword,
      faq_items: payload.faq_items,
      seo_score: seoChecklist.score,
      seo_checklist: seoChecklist,
      word_count: payload.estimated_word_count,
      change_summary: 'Initial AI generation with localized signals and SEO parameters',
      created_at: new Date().toISOString(),
    };

    updateMockDb(state => {
      state.projects.unshift(newProject);
      state.versions.unshift(initialVersion);
    });

    await UsageService.recordUsage(orgId, 'generation');

    await ActivityService.log({
      organization_id: orgId,
      action: `Generated AI content: "${newProject.title}"`,
      entity_type: 'content_project',
      entity_id: newProject.id,
      metadata: { type: newProject.content_type, score: seoChecklist.score },
    });

    await NotificationService.create({
      organization_id: orgId,
      user_id: 'user_locai_demo_admin',
      title: 'Content Generated Successfully',
      message: `Your article "${newProject.title}" has been created with an SEO score of ${seoChecklist.score}/100.`,
      type: 'success',
      action_url: `/content/${newProject.id}`,
    });

    return this.hydrateProject(newProject);
  }

  /**
   * Save content edits as a new version or revision
   */
  public static async saveVersion(
    orgId: string,
    projectId: string,
    data: {
      title: string;
      content_html: string;
      meta_title?: string;
      meta_description?: string;
      slug?: string;
      excerpt?: string;
      change_summary?: string;
    }
  ): Promise<ContentVersion> {
    const project = await this.getById(orgId, projectId);
    if (!project) throw new Error('Project not found');

    const nextVerNumber = project.current_version_number + 1;
    const wordCount = data.content_html.replace(/<[^>]*>?/gm, ' ').split(/\s+/).filter(Boolean).length;

    const seoChecklist = SEOService.analyze({
      title: data.title,
      contentHtml: data.content_html,
      primaryKeyword: project.primary_keyword,
      targetLocation: project.target_location,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      slug: data.slug,
    });

    const newVersion: ContentVersion = {
      id: `ver_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      project_id: projectId,
      version_number: nextVerNumber,
      title: data.title,
      content_html: data.content_html,
      excerpt: data.excerpt,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      slug: data.slug,
      focus_keyword: project.primary_keyword,
      seo_score: seoChecklist.score,
      seo_checklist: seoChecklist,
      word_count: wordCount,
      change_summary: data.change_summary || `Version ${nextVerNumber} revision`,
      created_at: new Date().toISOString(),
    };

    updateMockDb(state => {
      state.versions.unshift(newVersion);
      const p = state.projects.find(p => p.id === projectId);
      if (p) {
        p.title = data.title;
        p.seo_score = seoChecklist.score;
        p.current_version_number = nextVerNumber;
        p.updated_at = new Date().toISOString();
      }
    });

    await ActivityService.log({
      organization_id: orgId,
      action: `Saved version ${nextVerNumber} of "${data.title}"`,
      entity_type: 'content_project',
      entity_id: projectId,
    });

    return newVersion;
  }

  /**
   * Update content project workflow status (Draft -> Review -> Approved -> Scheduled -> Published)
   */
  public static async updateStatus(orgId: string, projectId: string, newStatus: PostStatus): Promise<ContentProject> {
    const project = await this.getById(orgId, projectId);
    if (!project) throw new Error('Project not found');

    updateMockDb(state => {
      const p = state.projects.find(p => p.id === projectId);
      if (p) {
        p.status = newStatus;
        p.updated_at = new Date().toISOString();
      }
    });

    await ActivityService.log({
      organization_id: orgId,
      action: `Changed status to ${newStatus} for "${project.title}"`,
      entity_type: 'content_project',
      entity_id: projectId,
    });

    return (await this.getById(orgId, projectId))!;
  }

  /**
   * Publish or create draft on WordPress website
   */
  public static async publishToWordPress(
    orgId: string,
    projectId: string,
    actionType: 'draft' | 'publish' | 'future',
    scheduledDate?: string
  ): Promise<WordPressPost> {
    const project = await this.getById(orgId, projectId);
    if (!project) throw new Error('Project not found');

    if (!project.website_id) {
      throw new Error('Please select a connected WordPress website first.');
    }

    const db = getMockDb();
    const website = db.websites.find(w => w.id === project.website_id);
    if (!website) throw new Error('Connected website not found');

    // Quota check if publishing live
    if (actionType === 'publish') {
      const quota = await UsageService.canPerformAction(orgId, 'publish_wordpress');
      if (!quota.allowed) {
        throw new Error(quota.reason);
      }
    }

    const version = project.current_version;
    if (!version) throw new Error('Content version not found');

    // Publish via WordPressService
    const result = await WordPressService.publishPost(
      {
        siteUrl: website.url,
        username: website.wp_connection?.wp_username || 'admin',
        applicationPassword: 'mock-pass',
      },
      {
        title: version.title,
        contentHtml: version.content_html,
        excerpt: version.excerpt,
        slug: version.slug,
        status: actionType,
        scheduledDate,
      }
    );

    if (!result.success) {
      updateMockDb(state => {
        const p = state.projects.find(p => p.id === projectId);
        if (p) p.status = 'FAILED';
      });

      await ActivityService.log({
        organization_id: orgId,
        action: `WordPress publishing failed: ${result.errorMessage}`,
        entity_type: 'content_project',
        entity_id: projectId,
      });

      throw new Error(result.errorMessage || 'WordPress publishing failed');
    }

    // Success: store or update wordpress_posts
    const wpRecord: WordPressPost = {
      id: `wp_post_${Date.now()}`,
      project_id: projectId,
      website_id: website.id,
      wp_post_id: result.postId!,
      wp_post_type: 'post',
      wp_url: result.postUrl,
      wp_edit_url: result.editUrl,
      status: actionType,
      last_synced_at: new Date().toISOString(),
      published_at: actionType === 'publish' ? new Date().toISOString() : undefined,
    };

    updateMockDb(state => {
      const existingIdx = state.wordpressPosts.findIndex(w => w.project_id === projectId);
      if (existingIdx !== -1) {
        state.wordpressPosts[existingIdx] = wpRecord;
      } else {
        state.wordpressPosts.unshift(wpRecord);
      }

      const p = state.projects.find(p => p.id === projectId);
      if (p) {
        p.status = actionType === 'publish' ? 'PUBLISHED' : actionType === 'future' ? 'SCHEDULED' : 'DRAFT';
        p.updated_at = new Date().toISOString();
      }
    });

    if (actionType === 'publish') {
      await UsageService.recordUsage(orgId, 'publish');
    }

    await ActivityService.log({
      organization_id: orgId,
      action:
        actionType === 'publish'
          ? `Published "${project.title}" to ${website.url}`
          : actionType === 'future'
          ? `Scheduled "${project.title}" on ${website.url}`
          : `Created WordPress draft for "${project.title}"`,
      entity_type: 'content_project',
      entity_id: projectId,
      metadata: { wp_post_id: result.postId, url: result.postUrl },
    });

    await NotificationService.create({
      organization_id: orgId,
      user_id: 'user_locai_demo_admin',
      title:
        actionType === 'publish'
          ? 'WordPress Post Published'
          : actionType === 'future'
          ? 'WordPress Post Scheduled'
          : 'WordPress Draft Created',
      message: `"${project.title}" has been successfully transmitted to ${website.name}.`,
      type: 'success',
      action_url: `/content/${projectId}`,
    });

    return wpRecord;
  }

  /**
   * Get version history for a project
   */
  public static async getVersions(projectId: string): Promise<ContentVersion[]> {
    const db = getMockDb();
    return db.versions
      .filter(v => v.project_id === projectId)
      .sort((a, b) => b.version_number - a.version_number);
  }
}
