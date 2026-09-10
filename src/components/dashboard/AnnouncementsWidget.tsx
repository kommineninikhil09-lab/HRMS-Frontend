'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';

interface Announcement {
  id: string;
  title: string;
  priority: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

const dotForPriority: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-amber-500',
  normal: 'bg-blue-500',
  low: 'bg-slate-400',
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function AnnouncementsWidget() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/community/announcements/active?limit=5', { credentials: 'include' });
        const body = await res.json();
        if (!cancelled && res.ok && body?.success) setAnnouncements(body.data);
      } catch {
        // Leave the widget empty on failure - dashboard tiles shouldn't crash the page.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardCard title="Announcements" actionLabel="View all" actionHref="/engage" className="xl:h-full">
      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : announcements.length === 0 ? (
        <p className="text-sm text-slate-400">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((item, idx) => (
            <div key={item.id} className={idx > 0 ? 'pt-4 border-t border-slate-100' : ''}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${dotForPriority[item.priority] ?? 'bg-blue-500'}`} />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {item.priority}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</p>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {relativeTime(item.published_at ?? item.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
