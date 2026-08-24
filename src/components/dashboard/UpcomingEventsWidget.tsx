'use client';

import { DashboardCard } from './DashboardCard';

const events = [
  { day: '28', month: 'AUG', title: 'Team Offsite', time: '9:00 AM – 6:00 PM', location: 'Office Campus' },
  { day: '01', month: 'DEC', title: 'Q3 Review Starts', time: 'All Day' },
  { day: '05', month: 'SEP', title: 'Annual Townhall', time: '3:00 PM – 5:00 PM', location: 'Main Cafeteria / Zoom' },
];

export function UpcomingEventsWidget() {
  return (
    <DashboardCard title="Upcoming Events" actionLabel="View calendar" actionHref="/calendar">
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.title} className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex flex-col items-center justify-center shrink-0 leading-none">
              <span className="text-[9px] font-semibold text-blue-600">{event.month}</span>
              <span className="text-sm font-bold text-blue-700">{event.day}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{event.title}</p>
              <p className="text-xs text-slate-500 truncate">{event.time}</p>
              {event.location ? <p className="text-xs text-slate-400 truncate">{event.location}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
