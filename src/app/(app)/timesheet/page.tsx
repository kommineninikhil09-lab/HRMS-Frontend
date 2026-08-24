'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const week = [
  { day: 'Mon', date: 'Aug 18', general: 4.5, project: 2.25, meetings: 1, training: 0 },
  { day: 'Tue', date: 'Aug 19', general: 5, project: 2, meetings: 1.5, training: 0 },
  { day: 'Wed', date: 'Aug 20', general: 4, project: 3, meetings: 1, training: 0.5 },
  { day: 'Thu', date: 'Aug 21', general: 5, project: 2.5, meetings: 0.5, training: 0 },
  { day: 'Fri', date: 'Aug 22', general: 4.5, project: 2.75, meetings: 1, training: 0 },
  { day: 'Sat', date: 'Aug 23', general: 0, project: 0, meetings: 0, training: 0 },
  { day: 'Sun', date: 'Aug 24', general: 4.5, project: 2.25, meetings: 1, training: 0 },
];

const categories = [
  { key: 'general', label: 'General Work', dot: 'bg-green-500' },
  { key: 'project', label: 'Project Phoenix', dot: 'bg-violet-500' },
  { key: 'meetings', label: 'Meetings', dot: 'bg-amber-500' },
  { key: 'training', label: 'Training', dot: 'bg-blue-500' },
] as const;

function fmt(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

export default function TimesheetPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<'This Week' | 'Last Week' | 'This Month'>('This Week');

  const totals = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.key] = week.reduce((sum, d) => sum + d[c.key], 0);
    return acc;
  }, {});
  const weekTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const target = 40;

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go back"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Timesheet</h1>
            <p className="text-base text-gray-600">Track logged hours across projects and categories</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['This Week', 'Last Week', 'This Month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  period === p
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">Aug 18 – Aug 24, 2026</span>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">{fmt(weekTotal)}</span>
            <span className="text-sm text-gray-500">of {target}h target</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden mb-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
              style={{ width: `${Math.min(100, (weekTotal / target) * 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.key} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <div>
                  <p className="text-xs text-gray-500">{c.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{fmt(totals[c.key])}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Day</th>
                  {categories.map((c) => (
                    <th key={c.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {week.map((d) => {
                  const total = d.general + d.project + d.meetings + d.training;
                  return (
                    <tr key={d.day} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {d.day} <span className="text-gray-400 font-normal">{d.date}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fmt(d.general)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fmt(d.project)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fmt(d.meetings)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{fmt(d.training)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{fmt(total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
