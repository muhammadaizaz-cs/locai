'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ContentProject } from '@/types';

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate calendar days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];
  // Pad previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      dateStr: '',
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      day: i,
      isCurrentMonth: true,
      dateStr: formatted,
    });
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Content Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Visualize your scheduled articles, publication cadences, and live WordPress updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/content/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Schedule Content</span>
            </Link>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-white">
              {monthNames[month]} {year}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-sm">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950/60 text-center text-xs font-bold text-slate-400 py-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/80">
            {days.map((item, idx) => {
              // Check if any posts fall on this day
              const dayPosts = item.isCurrentMonth
                ? projects.filter(p => {
                    const postDate = p.created_at.slice(0, 10);
                    return postDate === item.dateStr;
                  })
                : [];

              const isToday =
                item.isCurrentMonth &&
                item.day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-2 transition-colors ${
                    !item.isCurrentMonth
                      ? 'bg-slate-950/20 text-slate-600'
                      : isToday
                      ? 'bg-blue-950/20'
                      : 'hover:bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? 'flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white font-bold'
                          : item.isCurrentMonth
                          ? 'text-slate-300'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {dayPosts.map(p => (
                      <Link
                        key={p.id}
                        href={`/content/${p.id}`}
                        className={`block rounded-md p-1.5 text-[10px] font-medium leading-tight truncate transition-colors ${
                          p.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/25'
                            : p.status === 'SCHEDULED'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20 hover:bg-amber-500/25'
                            : 'bg-blue-500/15 text-blue-300 border border-blue-500/20 hover:bg-blue-500/25'
                        }`}
                      >
                        <span className="font-bold mr-1">
                          {p.status === 'PUBLISHED' ? 'WP' : 'SCH'}:
                        </span>
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
