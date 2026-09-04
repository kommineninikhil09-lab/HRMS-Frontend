'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { leaveApi, type Holiday } from '@/lib/api/leave';

function parts(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
  };
}

export function HolidaysWidget() {
  const [holidays, setHolidays] = useState<Holiday[] | null>(null);

  useEffect(() => {
    let active = true;
    const today = new Date().toISOString().slice(0, 10);
    const year = new Date().getFullYear();
    Promise.all([leaveApi.getHolidays(year), leaveApi.getHolidays(year + 1)])
      .then(([a, b]) => {
        if (!active) return;
        setHolidays(
          [...a, ...b]
            .filter((h) => h.holiday_date >= today)
            .sort((x, y) => x.holiday_date.localeCompare(y.holiday_date))
            .slice(0, 3),
        );
      })
      .catch(() => {
        if (active) setHolidays([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardCard title="Upcoming Holidays" actionLabel="View all" actionHref="/calendar">
      {holidays === null ? (
        <p className="text-xs text-slate-400">Loading…</p>
      ) : holidays.length === 0 ? (
        <p className="text-xs text-slate-400">No upcoming holidays.</p>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {holidays.map((h) => {
            const p = parts(h.holiday_date);
            return (
              <div key={h.id} className="flex items-center gap-3">
                <div className="text-center leading-none shrink-0">
                  <div className="text-xl font-bold text-orange-600">{p.day}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {p.month} &middot; {p.weekday}
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {h.name}
                  {h.is_optional ? <span className="text-[10px] text-slate-400"> (optional)</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
