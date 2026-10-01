import React from 'react';
import { cn } from '@/lib/utils';

// ================================================================
// STAT CARD
// ================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  trend?: { value: number; label: string; positive?: boolean };
  className?: string;
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-purple-400',
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm',
        className
      )}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-800/20 to-transparent" />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white tabular-nums">
            {value === 0 ? '0' : value.toLocaleString?.() ?? value}
          </p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-semibold',
                  trend.positive ? 'text-emerald-400' : 'text-red-400'
                )}
              >
                {trend.positive ? '+' : ''}{trend.value}
              </span>
              <span className="text-xs text-slate-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/50',
          )}
        >
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
      </div>
    </div>
  );
}

// ================================================================
// STATUS BADGE
// ================================================================

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'default'
  | 'amber';

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  danger: 'bg-red-500/15 text-red-400 border-red-500/25',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  default: 'bg-slate-700/50 text-slate-400 border-slate-700',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function AdminBadge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        BADGE_VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Map common statuses to badge variants
export function statusToBadge(status: string): BadgeVariant {
  const s = status.toUpperCase();
  if (['ACTIVE', 'PUBLISHED', 'CONNECTED', 'PAID', 'OPEN', 'SUCCESS'].includes(s)) return 'success';
  if (['PENDING', 'REVIEW', 'SCHEDULED', 'IN_PROGRESS', 'TRIALING'].includes(s)) return 'info';
  if (['WARNING', 'PAST_DUE', 'WAITING', 'DISCONNECTED'].includes(s)) return 'warning';
  if (['FAILED', 'ERROR', 'CRITICAL', 'BANNED', 'REFUNDED', 'CANCELED', 'INCOMPLETE'].includes(s)) return 'danger';
  if (['ADMIN', 'SUPER_ADMIN'].includes(s)) return 'purple';
  if (['DRAFT', 'ARCHIVED', 'CLOSED', 'RESOLVED'].includes(s)) return 'default';
  return 'default';
}

export function severityToBadge(severity: string): BadgeVariant {
  switch (severity.toUpperCase()) {
    case 'CRITICAL': return 'danger';
    case 'ERROR': return 'danger';
    case 'WARNING': return 'warning';
    case 'INFO': return 'info';
    default: return 'default';
  }
}

export function priorityToBadge(priority: string): BadgeVariant {
  switch (priority.toUpperCase()) {
    case 'URGENT': return 'danger';
    case 'HIGH': return 'warning';
    case 'MEDIUM': return 'info';
    case 'LOW': return 'default';
    default: return 'default';
  }
}

// ================================================================
// SECTION HEADER
// ================================================================

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminSectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ================================================================
// TABLE
// ================================================================

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function AdminTable({ headers, children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-slate-800/80', className)}>
      <table className="min-w-full divide-y divide-slate-800/80">
        <thead className="bg-slate-900/80">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">{children}</tbody>
      </table>
    </div>
  );
}

// ================================================================
// EMPTY STATE
// ================================================================

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}

export function AdminEmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/30 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700/50 mb-4">
        <Icon className="h-7 w-7 text-slate-500" />
      </div>
      <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      {description && <p className="mt-1 text-xs text-slate-500 max-w-xs">{description}</p>}
    </div>
  );
}

// ================================================================
// CARD
// ================================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export function AdminCard({ children, className, title, action }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3.5">
          {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// ================================================================
// LOADING SKELETON
// ================================================================

export function AdminSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-slate-800/60', className)} />
  );
}

export function AdminTableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/80">
      <table className="min-w-full divide-y divide-slate-800/80">
        <thead className="bg-slate-900/80">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <AdminSkeleton className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <AdminSkeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ================================================================
// PAGINATION
// ================================================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function AdminPagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams({ ...searchParams, page: page.toString() });
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (i === 0) return 1;
    if (i === 6) return totalPages;
    return currentPage - 2 + i;
  }).filter((p) => p >= 1 && p <= totalPages);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs text-slate-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <a
            href={buildUrl(currentPage - 1)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-colors"
          >
            ← Prev
          </a>
        )}
        {pages.map((page) => (
          <a
            key={page}
            href={buildUrl(page)}
            className={cn(
              'rounded-md border px-2.5 py-1.5 text-xs transition-colors',
              page === currentPage
                ? 'border-purple-500/50 bg-purple-500/15 text-purple-300'
                : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            )}
          >
            {page}
          </a>
        ))}
        {currentPage < totalPages && (
          <a
            href={buildUrl(currentPage + 1)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-600 hover:text-slate-200 transition-colors"
          >
            Next →
          </a>
        )}
      </div>
    </div>
  );
}

// ================================================================
// CONFIG STATUS INDICATOR
// ================================================================

interface ConfigStatusProps {
  label: string;
  configured: boolean;
}

export function ConfigStatus({ label, configured }: ConfigStatusProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-800/60 last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
          configured
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
            : 'bg-slate-700/50 text-slate-500 border-slate-700'
        )}
      >
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            configured ? 'bg-emerald-400' : 'bg-slate-600'
          )}
        />
        {configured ? 'Configured' : 'Not Configured'}
      </span>
    </div>
  );
}
