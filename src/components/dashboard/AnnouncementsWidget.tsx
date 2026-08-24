'use client';

import { DashboardCard } from './DashboardCard';

const announcements = [
  {
    category: 'Policy',
    title: 'Updated Work From Home Guidelines',
    description: 'Effective starting next month. Please review the updated handbook.',
    timestamp: '2 hours ago',
    dot: 'bg-blue-500',
  },
  {
    category: 'Event',
    title: 'Annual Townhall',
    description: 'Join us on Friday at 3 PM in the main cafeteria or via Zoom.',
    timestamp: '5 hours ago',
    dot: 'bg-green-500',
  },
  {
    category: 'Performance',
    title: 'Performance Review Cycle',
    description: 'Q3 performance reviews will start from Dec 1st.',
    timestamp: '1 day ago',
    dot: 'bg-violet-500',
  },
];

export function AnnouncementsWidget() {
  return (
    <DashboardCard title="Announcements" actionLabel="View all" actionHref="/engage" className="xl:h-full">
      <div className="space-y-4">
        {announcements.map((item, idx) => (
          <div key={item.title} className={idx > 0 ? 'pt-4 border-t border-slate-100' : ''}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {item.category}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
            <p className="text-[11px] text-slate-400 mt-1.5">{item.timestamp}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
