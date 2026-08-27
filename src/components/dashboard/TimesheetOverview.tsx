'use client';

import { useState } from 'react';
import { DashboardCard } from './DashboardCard';

const periods = ['This Week', 'Last Week', 'This Month'];

const breakdown = [
  { category: 'General Work', duration: '4h 30m', dot: 'bg-green-500' },
  { category: 'Project Phoenix', duration: '2h 15m', dot: 'bg-violet-500' },
  { category: 'Meetings', duration: '1h 00m', dot: 'bg-amber-500' },
  { category: 'Training', duration: '0h 00m', dot: 'bg-blue-500' },
];

export function TimesheetOverview() {
  const [period, setPeriod] = useState(periods[0]);
  const [open, setOpen] = useState(false);

  return (
    <DashboardCard title="Timesheet Overview" actionLabel="View full timesheet" actionHref="/timesheet">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-500">Aug 18 – Aug 24, 2026</span>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50"
          >
            {period}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {open ? (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-md z-10 py-1">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                    p === period ? 'text-blue-600 font-medium' : 'text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-slate-900">36h 45m</span>
        <span className="text-xs text-slate-500">/ 40h</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-5">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600" style={{ width: '92%' }} />
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today</span>
        <span className="text-xs font-semibold text-slate-900">7h 45m</span>
      </div>
      <ul className="space-y-2.5">
        {breakdown.map((row) => (
          <li key={row.category} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <span className={`w-2 h-2 rounded-full ${row.dot}`} />
              {row.category}
            </span>
            <span className="text-slate-900 font-medium">{row.duration}</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
