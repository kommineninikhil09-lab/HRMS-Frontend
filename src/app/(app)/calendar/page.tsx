'use client';

import { useEffect, useState } from 'react';
import {
  leaveApi,
  formatDateRange,
  type Holiday,
  type LeaveRequest,
} from '@/lib/api/leave';

// Company events don't have a backend API yet (F12); kept as sample data.
const events = [
  { day: '28', month: 'AUG', title: 'Team Offsite', time: '9:00 AM – 6:00 PM', location: 'Office Campus' },
  { day: '05', month: 'SEP', title: 'Annual Townhall', time: '3:00 PM – 5:00 PM', location: 'Main Cafeteria / Zoom' },
  { day: '01', month: 'DEC', title: 'Q3 Review Starts', time: 'All Day', location: '' },
];

function dateParts(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
  };
}

export default function CalendarPage() {
  const [holidays, setHolidays] = useState<Holiday[] | null>(null);
  const [onLeave, setOnLeave] = useState<LeaveRequest[] | null>(null);

  useEffect(() => {
    let active = true;
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const year = now.getFullYear();
    const from = new Date(year, now.getMonth(), 1).toISOString().slice(0, 10);
    const to = new Date(year, now.getMonth() + 2, 0).toISOString().slice(0, 10);

    Promise.all([leaveApi.getHolidays(year), leaveApi.getHolidays(year + 1)])
      .then(([a, b]) => {
        if (!active) return;
        setHolidays(
          [...a, ...b]
            .filter((h) => h.holiday_date >= today)
            .sort((x, y) => x.holiday_date.localeCompare(y.holiday_date)),
        );
      })
      .catch(() => active && setHolidays([]));

    leaveApi
      .getCalendar(from, to)
      .then((data) => active && setOnLeave(data))
      .catch(() => active && setOnLeave([]));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex flex-col items-center justify-center shrink-0 leading-none">
                  <span className="text-[10px] font-semibold text-blue-600">{event.month}</span>
                  <span className="text-base font-bold text-blue-700">{event.day}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                  {event.location ? <p className="text-xs text-gray-400">{event.location}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Upcoming Holidays</h2>
          {holidays === null ? (
            <p className="text-xs text-gray-400">Loading…</p>
          ) : holidays.length === 0 ? (
            <p className="text-xs text-gray-400">No upcoming holidays.</p>
          ) : (
            <div className="space-y-4">
              {holidays.map((holiday) => {
                const p = dateParts(holiday.holiday_date);
                return (
                  <div key={holiday.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex flex-col items-center justify-center shrink-0 leading-none">
                      <span className="text-[10px] font-semibold text-orange-600">{p.month}</span>
                      <span className="text-base font-bold text-orange-700">{p.day}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {holiday.name}
                        {holiday.is_optional ? (
                          <span className="text-[10px] text-gray-400"> (optional)</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-gray-500">{p.weekday}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">On Leave (this &amp; next month)</h2>
          {onLeave === null ? (
            <p className="text-xs text-gray-400">Loading…</p>
          ) : onLeave.length === 0 ? (
            <p className="text-xs text-gray-400">No approved leave in this window.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {onLeave.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">{r.employee_name || 'Employee'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDateRange(r.start_date, r.end_date, r.half_day_option)}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{r.leave_type_name || 'Leave'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
