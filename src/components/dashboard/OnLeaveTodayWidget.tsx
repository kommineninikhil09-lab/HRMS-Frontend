'use client';

import { DashboardCard } from './DashboardCard';

const onLeave = [
  { name: 'Anita Desai', type: 'Annual Leave', initials: 'AD', color: 'from-purple-600 to-indigo-600' },
  { name: 'Rohit Verma', type: 'Sick Leave', initials: 'RV', color: 'from-slate-700 to-slate-900' },
];

export function OnLeaveTodayWidget() {
  return (
    <DashboardCard
      title={`On Leave Today (${onLeave.length})`}
      actionLabel="View all"
      actionHref="/team"
    >
      <div className="space-y-3">
        {onLeave.map((person) => (
          <div key={person.name} className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
            >
              {person.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{person.name}</p>
              <p className="text-xs text-slate-500 truncate">{person.type}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
