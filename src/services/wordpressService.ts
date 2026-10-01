import { sanitizeApplicationPassword } from '@/lib/security/crypto';

export interface WordPressCredentials {
  siteUrl: string;
  username: string;
  applicationPassword: string;
}

export interface WordPressUserCheckResult {
  valid: boolean;
  userId?: number;
  displayName?: string;
  roles?: string[];
  canPublish: boolean;
  errorMessage?: string;
}

export interface WordPressPostInput {
  title: string;
  contentHtml: string;
  excerpt?: string;
  slug?: string;
  status: 'draft' | 'publish' | 'future';
  scheduledDate?: string; // ISO 8601 string
  postId?: number; // if updating existing post
}

export interface WordPressPostResult {
  success: boolean;
  postId?: number;
  postUrl?: string;
  editUrl?: string;
  status?: string;
  errorMessage?: string;
}

export class WordPressService {
  /**
   * Helper to normalize WordPress site URL removing trailing slashes
   */
  public static normalizeUrl(url: string): string {
    let clean = url.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    return clean.replace(/\/+$/, '');
  }

  /**
   * Builds the Basic Authorization header from username and application password
   */
  private static getAuthHeader(username: string, appPassword: string): string {
    const sanitizedPass = sanitizeApplicationPassword(appPassword);
    const token = Buffer.from(`${username.trim()}:${sanitizedPass}`).toString('base64');
    return `Basic ${token}`;
  }

  /**
   * Verify WordPress REST API availability and user capabilities
   */
  public static async verifyConnection(creds: WordPressCredentials): Promise<WordPressUserCheckResult> {
    const baseUrl = this.normalizeUrl(creds.siteUrl);

    // If running in development/demo testing mode on dummy domains, simulate connection test
    if (baseUrl.includes('apexplumbingpros.com') || baseUrl.includes('valleyhorizonhvac.com') || baseUrl.includes('example.com') || creds.applicationPassword.startsWith('mock-')) {
      return {
        valid: true,
        userId: 101,
        displayName: `${creds.username} (Verified WP Admin)`,
        roles: ['administrator'],
        canPublish: true,
      };
    }

    try {
      const endpoint = `${baseUrl}/wp-json/wp/v2/users/me?context=edit`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Authorization: this.getAuthHeader(creds.username, creds.applicationPassword),
          'Content-Type': 'application/json',
          'User-Agent': 'LocAI-SaaS-Publisher/1.0',
        },
      });

      if (response.status === 401 || response.status === 403) {
        return {
          valid: false,
          canPublish: false,
          errorMessage: 'Authentication failed. Please verify your WordPress Username and Application Password.',
        };
      }

      if (!response.ok) {
        return {
          valid: false,
          canPublish: false,
          errorMessage: `WordPress REST API responded with status ${response.status}. Ensure WordPress REST API is not blocked by a security plugin.`,
        };
      }

      const userData = await response.json();
      const roles: string[] = userData.roles || [];
      const canPublish = roles.includes('administrator') || roles.includes('editor') || roles.includes('author');

      return {
        valid: true,
        userId: userData.id,
        displayName: userData.name || creds.username,
        roles,
        canPublish,
      };
    } catch (err: unknown) {
      return {
        valid: false,
        canPublish: false,
        errorMessage: err instanceof Error ? `Connection error: ${err.message}` : 'Failed to connect to WordPress website.',
      };
    }
  }

  /**
   * Create, publish, schedule, or update a WordPress Post
   */
  public static async publishPost(
    creds: WordPressCredentials,
    postInput: WordPressPostInput
  ): Promise<WordPressPostResult> {
    const baseUrl = this.normalizeUrl(creds.siteUrl);

    // Mock/Demo handler for sample sites or mock keys
    if (baseUrl.includes('apexplumbingpros.com') || baseUrl.includes('valleyhorizonhvac.com') || baseUrl.includes('example.com') || creds.applicationPassword.startsWith('mock-')) {
      const simulatedId = postInput.postId || Math.floor(1000 + Math.random() * 9000);
      const postSlug = postInput.slug || 'local-seo-post';
      return {
        success: true,
        postId: simulatedId,
        postUrl: `${baseUrl}/${postSlug}/`,
        editUrl: `${baseUrl}/wp-admin/post.php?post=${simulatedId}&action=edit`,
        status: postInput.status,
      };
    }

    try {
      const isUpdate = Boolean(postInput.postId);
      const endpoint = isUpdate
        ? `${baseUrl}/wp-json/wp/v2/posts/${postInput.postId}`
        : `${baseUrl}/wp-json/wp/v2/posts`;

      const payload: Record<string, unknown> = {
        title: postInput.title,
        content: postInput.contentHtml,
        excerpt: postInput.excerpt,
        status: postInput.status,
      };

      if (postInput.slug) {
        payload.slug = postInput.slug;
      }

      if (postInput.status === 'future' && postInput.scheduledDate) {
        payload.date = new Date(postInput.scheduledDate).toISOString();
      }

      const response = await fetch(endpoint, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          Authorization: this.getAuthHeader(creds.username, creds.applicationPassword),
          'Content-Type': 'application/json',
          'User-Agent': 'LocAI-SaaS-Publisher/1.0',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          errorMessage: `WordPress publication failed (${response.status}): ${errorText.slice(0, 200)}`,
        };
      }

      const resultData = await response.json();

      return {
        success: true,
        postId: resultData.id,
        postUrl: resultData.link,
        editUrl: `${baseUrl}/wp-admin/post.php?post=${resultData.id}&action=edit`,
        status: resultData.status,
      };
    } catch (err: unknown) {
      return {
        success: false,
        errorMessage: err instanceof Error ? err.message : 'Unknown WordPress network error',
      };
    }
  }
}
