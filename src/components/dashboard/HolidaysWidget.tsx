'use client';

import { DashboardCard } from './DashboardCard';

const holidays = [
  { day: '25', month: 'DEC', weekday: 'Monday', name: 'Christmas Day' },
  { day: '01', month: 'JAN', weekday: 'Friday', name: "New Year's Day" },
];

export function HolidaysWidget() {
  return (
    <DashboardCard title="Upcoming Holidays" actionLabel="View all" actionHref="/calendar">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        {holidays.map((holiday) => (
          <div key={holiday.name} className="flex items-center gap-3">
            <div className="text-center leading-none shrink-0">
              <div className="text-xl font-bold text-orange-600">{holiday.day}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {holiday.month} &middot; {holiday.weekday}
              </div>
            </div>
            <div className="text-sm font-medium text-slate-700">{holiday.name}</div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
