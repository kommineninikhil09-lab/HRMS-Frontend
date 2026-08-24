'use client';

import { DashboardCard } from './DashboardCard';

const celebrations = [
  { name: 'Rahul Sharma', type: 'Birthday today!', initials: 'RS', color: 'from-blue-600 to-indigo-600' },
  { name: 'Priya Patel', type: 'Work anniversary (3 yrs)', initials: 'PP', color: 'from-rose-600 to-pink-600' },
  { name: 'Vikram Singh', type: 'Birthday on 27 Aug', initials: 'VS', color: 'from-emerald-600 to-teal-600' },
];

export function CelebrationsWidget() {
  return (
    <DashboardCard title="Celebrations" actionLabel="View all" actionHref="/team">
      <div className="space-y-3">
        {celebrations.map((person) => (
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
