'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Globe,
  Save,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Calendar,
  ExternalLink,
  Code,
  Eye,
  Check,
  RotateCcw,
  Clock,
  Share2,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ContentProject, ContentVersion, PostStatus, SEOChecklist } from '@/types';
import { SEOService } from '@/services/seoService';

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [project, setProject] = useState<ContentProject | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Editor form state
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<PostStatus>('DRAFT');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');

  // WordPress schedule date
  const [scheduledDate, setScheduledDate] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const [projRes, verRes] = await Promise.all([
          fetch(`/api/content/${id}`),
          fetch(`/api/content/${id}/versions`),
        ]);

        const projData = await projRes.json();
        const verData = await verRes.json();

        if (projData.success && projData.project) {
          const p: ContentProject = projData.project;
          setProject(p);
          setTitle(p.title);
          setStatus(p.status);

          const ver = p.current_version;
          if (ver) {
            setContentHtml(ver.content_html);
            setMetaTitle(ver.meta_title || '');
            setMetaDescription(ver.meta_description || '');
            setSlug(ver.slug || '');
            setExcerpt(ver.excerpt || '');
          }
        }

        if (verData.success && verData.versions) {
          setVersions(verData.versions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProject();
  }, [id]);

  // Real-time live SEO calculation
  const seoChecklist: SEOChecklist = SEOService.analyze({
    title,
    contentHtml,
    primaryKeyword: project?.primary_keyword || '',
    targetLocation: project?.target_location || '',
    metaTitle,
    metaDescription,
    slug,
  });

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content_html: contentHtml,
          meta_title: metaTitle,
          meta_description: metaDescription,
          slug,
          excerpt,
          change_summary: 'Manual revision and optimization',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save edits');

      setFeedback({ type: 'success', message: 'Version saved successfully with real-time SEO recalculation.' });

      // Refresh version list
      const verRes = await fetch(`/api/content/${id}/versions`);
      const verData = await verRes.json();
      if (verData.versions) setVersions(verData.versions);
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: PostStatus) => {
    setStatus(newStatus);
    try {
      await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setFeedback({ type: 'success', message: `Status updated to ${newStatus}` });
    } catch (err) {
      console.error(err);
    }
  };

  const handleWordPressAction = async (actionType: 'draft' | 'publish' | 'future') => {
    setPublishing(true);
    setFeedback(null);
    try {
      // First save current content
      await handleSave();

      const res = await fetch('/api/wordpress/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: id,
          action_type: actionType,
          scheduled_date: actionType === 'future' ? scheduledDate : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'WordPress operation failed');

      setShowPublishModal(false);
      setStatus(actionType === 'publish' ? 'PUBLISHED' : actionType === 'future' ? 'SCHEDULED' : 'DRAFT');

      // Refresh project to get updated WordPress post ID and live links
      const refreshed = await fetch(`/api/content/${id}`);
      const refreshedData = await refreshed.json();
      if (refreshedData.project) setProject(refreshedData.project);

      setFeedback({
        type: 'success',
        message:
          actionType === 'publish'
            ? 'Success! Post is now live on WordPress.'
            : actionType === 'future'
            ? 'Success! Post is scheduled in WordPress.'
            : 'Success! Post draft created in WordPress.',
      });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'WordPress publication error' });
    } finally {
      setPublishing(false);
    }
  };

  const restoreVersion = (v: ContentVersion) => {
    setTitle(v.title);
    setContentHtml(v.content_html);
    setMetaTitle(v.meta_title || '');
    setMetaDescription(v.meta_description || '');
    setSlug(v.slug || '');
    setExcerpt(v.excerpt || '');
    setShowVersions(false);
    setFeedback({ type: 'success', message: `Restored Version ${v.version_number} into editor.` });
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex h-96 items-center justify-center">
          <div className="text-slate-400 text-sm">Loading content editor...</div>
        </div>
      </DashboardShell>
    );
  }

  if (!project) {
    return (
      <DashboardShell>
        <div className="text-center py-16">
          <h2 className="text-lg font-bold text-white mb-2">Project not found</h2>
          <Link href="/content" className="text-sm text-blue-400 hover:underline">
            &larr; Return to content library
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/content"
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                  {project.content_type.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-400">&bull; {project.target_location}</span>
                {project.wordpress_post && (
                  <a
                    href={project.wordpress_post.wp_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20"
                  >
                    <span>WP Live Post</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white mt-1 line-clamp-1">{title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Workflow Status Dropdown */}
            <select
              value={status}
              onChange={e => handleStatusChange(e.target.value as PostStatus)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="DRAFT">Status: Draft</option>
              <option value="REVIEW">Status: Review</option>
              <option value="APPROVED">Status: Approved</option>
              <option value="SCHEDULED">Status: Scheduled</option>
              <option value="PUBLISHED">Status: Published</option>
            </select>

            {/* Version History Button */}
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <History className="h-3.5 w-3.5" />
              <span>Versions ({versions.length})</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? 'Saving...' : 'Save Version'}</span>
            </button>

            {/* WordPress Publish Trigger */}
            <button
              onClick={() => setShowPublishModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all hover:scale-[1.02]"
            >
              <Globe className="h-4 w-4" />
              <span>Publish to WordPress</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`flex items-center justify-between rounded-xl p-3.5 text-xs font-medium border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2"
            >
              &times;
            </button>
          </div>
        )}

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Editor & Meta Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Title Input */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                H1 Page Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base font-bold text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Rich Content Editor */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2.5">
                <span className="text-xs font-semibold text-slate-300">Article Body Content</span>
                <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                  <button
                    onClick={() => setViewMode('visual')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      viewMode === 'visual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Visual Preview
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      viewMode === 'code' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    HTML Source
                  </button>
                </div>
              </div>

              {viewMode === 'visual' ? (
                <div className="p-6">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => setContentHtml(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                    className="prose-locai min-h-[420px] focus:outline-none text-slate-200"
                  />
                </div>
              ) : (
                <div className="p-4">
                  <textarea
                    rows={18}
                    value={contentHtml}
                    onChange={e => setContentHtml(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 font-mono text-xs text-blue-200 p-4 focus:border-blue-500 focus:outline-none leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* SEO Metadata Settings Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Google SERP &amp; SEO Metadata</h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Meta Title</span>
                    <span>{metaTitle.length} / 60 chars</span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={e => setMetaTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Meta Description</span>
                    <span>{metaDescription.length} / 160 chars</span>
                  </div>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={e => setMetaDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">URL Slug</label>
                    <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-slate-400">
                      <span>/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        className="w-full bg-transparent pl-1 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Focus Keyword</label>
                    <input
                      type="text"
                      disabled
                      value={project.primary_keyword}
                      className="w-full rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Real-time SEO Checklist & WordPress Sync */}
          <div className="space-y-6">
            {/* Live SEO Score Gauge Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Local SEO Audit Score</h3>
                <span
                  className={`text-2xl font-black ${
                    seoChecklist.score >= 90
                      ? 'text-emerald-400'
                      : seoChecklist.score >= 80
                      ? 'text-blue-400'
                      : 'text-amber-400'
                  }`}
                >
                  {seoChecklist.score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-6">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    seoChecklist.score >= 90
                      ? 'bg-emerald-500'
                      : seoChecklist.score >= 80
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${seoChecklist.score}%` }}
                />
              </div>

              {/* SEO Checklist Items */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Checklist Requirements
                </div>
                {seoChecklist.checks.map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 text-xs">
                    {item.passed ? (
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mt-0.5">
                        <AlertCircle className="h-2.5 w-2.5" />
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${item.passed ? 'text-slate-200' : 'text-slate-400'}`}>
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actionable Recommendations */}
              {seoChecklist.recommendations.length > 0 && (
                <div className="mt-6 border-t border-slate-800 pt-4">
                  <span className="text-xs font-semibold text-amber-400 block mb-2">
                    Actionable Improvements
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc pl-4 leading-relaxed">
                    {seoChecklist.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Target WordPress Site Information */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-sm font-bold text-white mb-3">WordPress Connection</h3>
              {project.website ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Site Name:</span>
                    <span className="font-semibold text-white">{project.website.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Site URL:</span>
                    <span className="text-blue-400 font-mono truncate max-w-[180px]">
                      {project.website.url}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Auth Method:</span>
                    <span className="text-emerald-400 font-medium">Application Password (AES-256)</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No WordPress site assigned. Select a site in the publish dialog.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Version History Modal / Drawer */}
        {showVersions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-400" />
                  Version History
                </h3>
                <button
                  onClick={() => setShowVersions(false)}
                  className="text-slate-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto my-4 text-xs">
                {versions.map(v => (
                  <div key={v.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-200">
                        Version {v.version_number} &bull; {v.word_count} words
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {v.change_summary || 'Manual edit'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        SEO Score: {v.seo_score}/100
                      </div>
                    </div>
                    <button
                      onClick={() => restoreVersion(v)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WordPress Publishing Modal */}
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Publish to WordPress
                </h3>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Choose your publication target for <strong>{project.website?.name || 'WordPress'}</strong>:
              </p>

              <div className="space-y-3">
                {/* 1. Create Draft */}
                <button
                  onClick={() => handleWordPressAction('draft')}
                  disabled={publishing}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 p-4 text-left hover:border-blue-500 hover:bg-slate-800 transition-all"
                >
                  <div className="font-bold text-white text-xs mb-0.5">Create WordPress Draft</div>
                  <div className="text-[11px] text-slate-400">
                    Saves directly to your WP Admin drafts without publishing publicly.
                  </div>
                </button>

                {/* 2. Publish Live */}
                <button
                  onClick={() => handleWordPressAction('publish')}
                  disabled={publishing}
                  className="w-full rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-left hover:border-emerald-500 hover:bg-emerald-950/40 transition-all"
                >
                  <div className="font-bold text-emerald-400 text-xs mb-0.5">Publish Live Immediately</div>
                  <div className="text-[11px] text-slate-300">
                    Transmits directly to your WordPress live site with verified permalinks.
                  </div>
                </button>

                {/* 3. Schedule Post */}
                <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 space-y-3">
                  <div className="font-bold text-white text-xs mb-0.5">Schedule for Later</div>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleWordPressAction('future')}
                    disabled={publishing || !scheduledDate}
                    className="w-full rounded-lg bg-amber-600 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors disabled:opacity-50"
                  >
                    Confirm WordPress Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
