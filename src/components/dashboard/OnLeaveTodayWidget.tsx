'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { leaveApi, type LeaveRequest } from '@/lib/api/leave';

const COLORS = [
  'from-purple-600 to-indigo-600',
  'from-rose-600 to-pink-600',
  'from-emerald-600 to-teal-600',
  'from-sky-600 to-blue-600',
  'from-amber-600 to-orange-600',
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function OnLeaveTodayWidget() {
  const [rows, setRows] = useState<LeaveRequest[] | null>(null);

  useEffect(() => {
    let active = true;
    const today = new Date().toISOString().slice(0, 10);
    leaveApi
      .getCalendar(today, today)
      .then((data) => {
        if (!active) return;
        const seen = new Set<string>();
        setRows(
          data.filter((r) => {
            if (seen.has(r.employee_id)) return false;
            seen.add(r.employee_id);
            return true;
          }),
        );
      })
      .catch(() => {
        if (active) setRows([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const list = rows ?? [];

  return (
    <DashboardCard title={`On Leave Today (${list.length})`} actionLabel="View all" actionHref="/team">
      {rows === null ? (
        <p className="text-xs text-slate-400">Loading…</p>
      ) : list.length === 0 ? (
        <p className="text-xs text-slate-400">Nobody is on leave today.</p>
      ) : (
        <div className="space-y-3">
          {list.map((r, i) => {
            const name = r.employee_name || 'Employee';
            return (
              <div key={r.id} className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                >
                  {initials(name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                  <p className="text-xs text-slate-500 truncate">{r.leave_type_name || 'Leave'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardCard>
  );
}
