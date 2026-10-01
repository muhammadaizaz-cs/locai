import { SEOChecklist, SEOCheckItem } from '@/types';

export interface SEOAnalysisInput {
  title: string;
  contentHtml: string;
  primaryKeyword: string;
  targetLocation: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  faqCount?: number;
}

export class SEOService {
  public static analyze(input: SEOAnalysisInput): SEOChecklist {
    const checks: SEOCheckItem[] = [];
    const recommendations: string[] = [];

    const normKw = (input.primaryKeyword || '').toLowerCase().trim();
    const normLoc = (input.targetLocation || '').toLowerCase().trim();
    const cleanText = (input.contentHtml || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    // 1. Primary Keyword specified
    const hasKeyword = normKw.length > 2;
    checks.push({
      id: 'kw-exists',
      label: 'Primary Keyword Defined',
      passed: hasKeyword,
      description: hasKeyword ? `Target focus keyword: "${input.primaryKeyword}"` : 'No primary keyword provided',
      impact: 'high',
    });
    if (!hasKeyword) recommendations.push('Define a clear primary local search query (e.g., "Emergency Plumber in Mardan").');

    // 2. Keyword in Title
    const titleLower = (input.title || '').toLowerCase();
    const kwInTitle = hasKeyword && titleLower.includes(normKw);
    checks.push({
      id: 'kw-title',
      label: 'Keyword in Page Title',
      passed: kwInTitle,
      description: kwInTitle
        ? 'Page title contains the primary target keyword'
        : 'Primary keyword is missing from the title tag',
      impact: 'high',
    });
    if (!kwInTitle && hasKeyword) recommendations.push(`Include "${input.primaryKeyword}" near the beginning of your page title.`);

    // 3. Keyword in First 100 Words (Introduction)
    const introText = words.slice(0, 100).join(' ').toLowerCase();
    const kwInIntro = hasKeyword && introText.includes(normKw);
    checks.push({
      id: 'kw-intro',
      label: 'Keyword in Introduction',
      passed: kwInIntro,
      description: kwInIntro
        ? 'Primary keyword is introduced in the first 100 words'
        : 'Primary keyword should appear early in the introductory paragraph',
      impact: 'medium',
    });
    if (!kwInIntro && hasKeyword) recommendations.push('Mention your primary keyword within the first 1-2 sentences of the opening paragraph.');

    // 4. Keyword in Headings (H2 / H3)
    const headingsMatch = (input.contentHtml || '').match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi) || [];
    const headingsText = headingsMatch.map(h => h.replace(/<[^>]*>?/gm, '').toLowerCase());
    const kwInHeadings = hasKeyword && headingsText.some(h => h.includes(normKw));
    checks.push({
      id: 'kw-headings',
      label: 'Keyword in Subheadings (H2/H3)',
      passed: kwInHeadings,
      description: kwInHeadings
        ? 'Primary keyword appears in at least one subheading'
        : 'At least one H2 or H3 heading should contain the primary keyword',
      impact: 'medium',
    });
    if (!kwInHeadings && hasKeyword) recommendations.push('Add your primary keyword to at least one H2 section heading.');

    // 5. Target Location Presence (Local Signal)
    const textLower = cleanText.toLowerCase();
    const locInContent = normLoc.length > 1 && textLower.includes(normLoc);
    checks.push({
      id: 'local-relevance',
      label: 'Local Relevance & Geo-Signals',
      passed: locInContent,
      description: locInContent
        ? `Target city "${input.targetLocation}" is prominently featured in content`
        : `Target location "${input.targetLocation}" should be mentioned throughout content for local pack ranking`,
      impact: 'high',
    });
    if (!locInContent && normLoc.length > 1) recommendations.push(`Reinforce local signals by mentioning landmarks, neighborhoods, and the city "${input.targetLocation}".`);

    // 6. Meta Title Check
    const metaTitle = input.metaTitle || '';
    const metaTitlePassed = metaTitle.length >= 35 && metaTitle.length <= 65;
    checks.push({
      id: 'meta-title',
      label: 'Meta Title Length (35-65 chars)',
      passed: metaTitlePassed,
      description: metaTitle
        ? `Current meta title is ${metaTitle.length} characters long`
        : 'Meta title is missing',
      impact: 'medium',
    });
    if (!metaTitlePassed) recommendations.push('Optimize meta title to be between 35 and 65 characters to prevent Google SERP clipping.');

    // 7. Meta Description Check
    const metaDesc = input.metaDescription || '';
    const metaDescPassed = metaDesc.length >= 110 && metaDesc.length <= 165;
    checks.push({
      id: 'meta-desc',
      label: 'Meta Description Length (110-165 chars)',
      passed: metaDescPassed,
      description: metaDesc
        ? `Current meta description is ${metaDesc.length} characters long`
        : 'Meta description is missing',
      impact: 'medium',
    });
    if (!metaDescPassed) recommendations.push('Craft a compelling meta description between 110 and 165 characters with a direct call-to-action.');

    // 8. URL Slug Check
    const slug = (input.slug || '').toLowerCase();
    const slugPassed = slug.length > 3 && (!hasKeyword || slug.includes(normKw.split(' ')[0]));
    checks.push({
      id: 'url-slug',
      label: 'Search-Friendly URL Slug',
      passed: slugPassed,
      description: slug ? `Slug: /${slug}` : 'No slug configured',
      impact: 'low',
    });
    if (!slugPassed) recommendations.push('Provide a short, hyphen-separated slug containing the primary topic.');

    // 9. Content Length
    const lengthPassed = wordCount >= 350;
    checks.push({
      id: 'content-length',
      label: 'Comprehensive Content Length (350+ words)',
      passed: lengthPassed,
      description: `Current word count: ${wordCount} words (recommended: 450 - 900 for local service pages)`,
      impact: 'high',
    });
    if (!lengthPassed) recommendations.push(`Expand content depth. Current word count is ${wordCount} words; aim for at least 450 words.`);

    // 10. Keyword Density (Avoid Stifling or Underuse)
    let keywordCount = 0;
    if (hasKeyword && wordCount > 0) {
      const escaped = normKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = textLower.match(new RegExp(escaped, 'gi'));
      keywordCount = matches ? matches.length : 0;
    }
    const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
    const densityPassed = density >= 0.8 && density <= 3.5;
    checks.push({
      id: 'kw-density',
      label: 'Keyword Density (0.8% - 3.5%)',
      passed: densityPassed,
      description: `Keyword appears ${keywordCount} times (~${density.toFixed(1)}% density)`,
      impact: 'medium',
    });
    if (density > 3.5) recommendations.push('Keyword density is slightly high. Replace some exact matches with natural synonyms or local terms to prevent keyword stuffing.');
    else if (density < 0.8 && hasKeyword) recommendations.push(`Naturalize your target keyword "${input.primaryKeyword}" 1-2 more times in body paragraphs.`);

    // 11. FAQ & Schema readiness
    const hasFaq = (input.faqCount && input.faqCount >= 2) || (input.contentHtml || '').toLowerCase().includes('faq');
    checks.push({
      id: 'faq-schema',
      label: 'Local FAQ Section',
      passed: Boolean(hasFaq),
      description: hasFaq
        ? 'FAQ section included for voice search and rich snippet capture'
        : 'Add 2-3 local FAQs to qualify for Google rich snippet accordion displays',
      impact: 'low',
    });
    if (!hasFaq) recommendations.push('Include a 2-4 item FAQ block addressing common local client questions.');

    // Calculate score
    const weightMap: Record<'high' | 'medium' | 'low', number> = {
      high: 15,
      medium: 10,
      low: 5,
    };
    let earned = 0;
    let totalPossible = 0;

    for (const chk of checks) {
      const weight = weightMap[chk.impact];
      totalPossible += weight;
      if (chk.passed) earned += weight;
    }

    const calculatedScore = Math.min(100, Math.round((earned / totalPossible) * 100));

    return {
      score: calculatedScore,
      checks,
      recommendations,
    };
  }
}
