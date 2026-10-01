import {
  AIProviderType,
  Business,
  GenerateContentInput,
  GeneratedContentPayload,
  FAQItem,
} from '@/types';
import { slugify } from '@/lib/utils';

export interface AIProvider {
  name: AIProviderType;
  generate(prompt: string, systemPrompt: string): Promise<string>;
}

export class OpenAIProvider implements AIProvider {
  name: AIProviderType = 'openai';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generate(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '{}';
  }
}

export class DeepSeekProvider implements AIProvider {
  name: AIProviderType = 'deepseek';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
  }

  async generate(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '{}';
  }
}

export class GrokProvider implements AIProvider {
  name: AIProviderType = 'grok';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GROK_API_KEY || '';
  }

  async generate(prompt: string, systemPrompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GROK_API_KEY is not configured');
    }

    const res = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Grok API error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '{}';
  }
}

export class AIService {
  private static providers: Record<AIProviderType, AIProvider> = {
    openai: new OpenAIProvider(),
    deepseek: new DeepSeekProvider(),
    grok: new GrokProvider(),
  };

  public static getActiveProvider(override?: AIProviderType): AIProvider {
    const chosen = override || (process.env.ACTIVE_AI_PROVIDER as AIProviderType) || 'openai';
    return this.providers[chosen] || this.providers.openai;
  }

  /**
   * Main generation pipeline with verification, validation & safe fallback
   */
  public static async generateContent(
    input: GenerateContentInput,
    business?: Business
  ): Promise<GeneratedContentPayload> {
    const provider = this.getActiveProvider(input.provider);

    const systemPrompt = `You are LocAI, an elite local SEO content strategist and copywriting director for local businesses and SEO agencies.
Your objective is to produce high-ranking, human-sounding, helpful, and localized content that ranks in Google's Local 3-Pack and Organic SERPs.
CRITICAL RULES:
1. Never keyword stuff. Content must read naturally, authoritatively, and persuasively.
2. Embed the target location and nearby reference points smoothly.
3. Include clear headings (H2, H3), bulleted lists, and a rich FAQ section.
4. Output MUST be valid JSON adhering strictly to the requested schema.`;

    const userPrompt = `Generate a ${input.content_type} with the following local parameters:

Business Name: ${business?.name || 'Local Service Pro'}
Category: ${business?.category || 'Home Services'}
Target City/Area: ${input.target_location}
State/Province: ${business?.state_province || ''}
Country: ${business?.country || 'Local Area'}
Address: ${business?.address || ''}
Phone: ${business?.phone || '(555) 000-0000'}
Services Offered: ${(business?.services || []).join(', ')}
Target Audience: ${business?.target_audience || 'Local residents and property owners'}
Unique Selling Points: ${(business?.unique_selling_points || []).join('; ')}
Tone of Voice: ${input.tone || business?.brand_tone || 'Authoritative, Friendly, Reassuring'}

Content Details:
- Content Type: ${input.content_type}
- Core Topic: ${input.topic}
- Primary Keyword: ${input.primary_keyword}
- Secondary Keywords: ${(input.secondary_keywords || []).join(', ')}
- Additional Instructions: ${input.additional_instructions || 'Focus on immediate local solutions, emergency preparedness, and verified trust factors.'}

OUTPUT SCHEMA:
Return ONLY a JSON object with:
{
  "title": "Compelling Title containing primary keyword and location",
  "meta_title": "SEO Meta Title (45-60 chars) with brand and location",
  "meta_description": "Engaging Meta Description (120-155 chars) with CTA and phone",
  "slug": "url-friendly-slug-with-location",
  "excerpt": "Short 2-3 sentence overview snippet",
  "content_html": "Full structured HTML with <h2>, <h3>, <p>, <ul>, <li> tags, and strong calls-to-action",
  "faq_items": [
    {"question": "Local relevant question 1?", "answer": "Clear helpful answer 1"},
    {"question": "Local relevant question 2?", "answer": "Clear helpful answer 2"}
  ],
  "local_signals": ["city name", "neighborhoods", "landmarks"],
  "focus_keyword": "${input.primary_keyword}"
}`;

    try {
      // Attempt generation via configured provider if API key exists
      const rawResponse = await provider.generate(userPrompt, systemPrompt);
      const parsed = this.parseAndValidateResponse(rawResponse, input, business);
      return parsed;
    } catch (err: unknown) {
      console.warn('AI Provider live call fallback triggered:', err instanceof Error ? err.message : err);
      // Safe high-quality local generation fallback engine
      return this.generateEngineFallback(input, business);
    }
  }

  /**
   * Safe parsing with automated repair of JSON anomalies
   */
  private static parseAndValidateResponse(
    raw: string,
    input: GenerateContentInput,
    business?: Business
  ): GeneratedContentPayload {
    let clean = raw.trim();
    // Strip markdown code fences if model enclosed JSON in ```json ... ```
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsed = JSON.parse(clean);

      // Validate and sanitize required fields
      const title = parsed.title || `${input.primary_keyword} in ${input.target_location}`;
      const meta_title = parsed.meta_title || `${title.slice(0, 50)} | ${business?.name || 'LocAI'}`;
      const meta_description =
        parsed.meta_description ||
        `Need certified ${input.primary_keyword.toLowerCase()} in ${input.target_location}? Contact ${business?.name || 'our experts'} today for prompt service.`;
      const slug = parsed.slug ? slugify(parsed.slug) : slugify(`${input.primary_keyword}-${input.target_location}`);
      const content_html = parsed.content_html || `<p>${input.topic}</p>`;
      const faq_items: FAQItem[] = Array.isArray(parsed.faq_items) ? parsed.faq_items : [];

      const wordCount = content_html.replace(/<[^>]*>?/gm, ' ').split(/\s+/).filter(Boolean).length;

      return {
        title,
        meta_title,
        meta_description,
        slug,
        excerpt: parsed.excerpt || meta_description,
        content_html,
        content_markdown: parsed.content_markdown || content_html,
        faq_items,
        focus_keyword: input.primary_keyword,
        secondary_keywords: input.secondary_keywords || [],
        local_signals: parsed.local_signals || [input.target_location],
        estimated_word_count: wordCount,
      };
    } catch {
      // If parsing fails, fall back safely to generation engine
      return this.generateEngineFallback(input, business);
    }
  }

  /**
   * Deterministic, high-yield local SEO generation engine when external keys are unavailable
   */
  private static generateEngineFallback(
    input: GenerateContentInput,
    business?: Business
  ): GeneratedContentPayload {
    const bizName = business?.name || 'Premier Local Specialists';
    const city = input.target_location || 'your area';
    const phone = business?.phone || '(555) 789-0123';
    const primaryKw = input.primary_keyword;
    const tone = input.tone || 'Professional';

    const title = `${primaryKw}: Trusted Local Experts in ${city}`;
    const slug = slugify(`${primaryKw} in ${city}`);
    const meta_title = `${primaryKw} in ${city} | ${bizName}`;
    const meta_description = `Looking for trusted ${primaryKw.toLowerCase()} in ${city}? ${bizName} offers prompt, certified solutions. Call ${phone} today!`;

    const uspsHtml = (business?.unique_selling_points || [
      `Prompt, verified response throughout ${city}`,
      'Transparent upfront pricing with zero hidden fees',
      'Licensed, bonded, and seasoned industry technicians',
      '100% satisfaction guarantee on all completed work',
    ])
      .map(usp => `<li><strong>${usp}</strong></li>`)
      .join('\n  ');

    const servicesHtml = (business?.services || [
      'Comprehensive on-site inspection and assessment',
      'Preventive diagnostics and preventative maintenance',
      'Emergency 24/7 callouts and urgent repair',
      'Durable installations backed by manufacturer warranties',
    ])
      .map(svc => `<li>${svc}</li>`)
      .join('\n  ');

    const content_html = `<h2>Reliable &amp; Certified ${primaryKw} in ${city}</h2>
<p>When you require dependable <strong>${primaryKw.toLowerCase()}</strong> in <strong>${city}</strong>, choosing a qualified local contractor makes all the difference. At <strong>${bizName}</strong>, we combine deep local expertise with modern industry standards to deliver lasting peace of mind.</p>

<p>Whether dealing with urgent issues or planning long-term upgrades, our team is equipped to handle projects of all sizes across ${city} and neighboring communities with promptness, respect for your property, and meticulous craftsmanship.</p>

<h3>Why ${city} Residents &amp; Businesses Choose ${bizName}</h3>
<ul>
  ${uspsHtml}
</ul>

<h3>Our Full Range of Local Services in ${city}</h3>
<p>We tailor our service delivery to the specific infrastructure and architectural requirements of properties in ${city}. Our specialized capabilities include:</p>
<ul>
  ${servicesHtml}
</ul>

<h3>How Our Proven Process Works</h3>
<ol>
  <li><strong>Initial Consultation &amp; Dispatch:</strong> Reach out by calling <strong>${phone}</strong> or booking online. Our dispatch team quickly assesses your needs.</li>
  <li><strong>Comprehensive Assessment:</strong> We arrive promptly on-site, inspect the issue thoroughly, and provide a clear, flat-rate quote.</li>
  <li><strong>Expert Execution:</strong> Our certified technicians complete the job using premium-grade materials and verified industry protocols.</li>
  <li><strong>Final Quality Guarantee:</strong> We walk you through the completed work and leave your premises spotless and functioning flawlessly.</li>
</ol>

<h3>Frequently Asked Questions About ${primaryKw} in ${city}</h3>
<div class="faq-container">
  <h4>How quickly can your team arrive in ${city}?</h4>
  <p>For urgent service calls in ${city}, we strive to arrive within 30 to 60 minutes. Scheduled service appointments are booked at your convenience.</p>

  <h4>Do you provide upfront pricing before starting work?</h4>
  <p>Yes. We believe in total financial transparency. We diagnose the situation and provide a written, firm quote before any work begins—no surprise fees.</p>

  <h4>Are your technicians licensed and insured in ${business?.state_province || city}?</h4>
  <p>Every technician at ${bizName} is fully licensed, insured, and thoroughly background-checked for your safety and peace of mind.</p>
</div>

<h3>Schedule Your ${primaryKw} in ${city} Today</h3>
<p>Don't let small issues turn into costly emergencies. Connect with ${city}'s premier specialists at <strong>${bizName}</strong> today. Call <strong>${phone}</strong> to speak with an on-duty specialist or request an instant free estimate.</p>`;

    const faq_items: FAQItem[] = [
      {
        question: `How quickly can your team arrive in ${city}?`,
        answer: `For urgent service calls in ${city}, our dispatch team strives to arrive within 30 to 60 minutes. Scheduled appointments are booked at your preferred time.`,
      },
      {
        question: `Do you provide upfront pricing before starting work?`,
        answer: `Yes. We provide clear, itemized flat-rate quotes after physical inspection before any work begins, ensuring zero hidden costs.`,
      },
      {
        question: `Are your technicians licensed and insured in ${business?.state_province || city}?`,
        answer: `Every team member at ${bizName} is fully certified, insured, and adheres to strict safety protocols.`,
      },
    ];

    const wordCount = content_html.replace(/<[^>]*>?/gm, ' ').split(/\s+/).filter(Boolean).length;

    return {
      title,
      meta_title,
      meta_description,
      slug,
      excerpt: meta_description,
      content_html,
      content_markdown: content_html,
      faq_items,
      focus_keyword: primaryKw,
      secondary_keywords: input.secondary_keywords || [],
      local_signals: [city, business?.state_province || '', business?.category || ''].filter(Boolean),
      estimated_word_count: wordCount,
    };
  }
}
