'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronDownIcon } from '@/components/icons';

const teamMembers = [
  { id: 1, name: 'Anurag Kumar Tiwari', initials: 'AT', role: 'Senior I', location: 'Hyderabad', department: 'Technology', avatarColor: 'from-amber-500 to-orange-600' },
  { id: 2, name: 'Kiran Vasvani', initials: 'KV', role: 'Assistant Manager', location: 'Hyderabad', department: 'Audit & Assurance > InfoSec Audit', avatarColor: 'from-slate-700 to-slate-900' },
  { id: 3, name: 'Nikhil Kommineni', initials: 'NK', role: 'Trainee', location: 'Hyderabad', department: 'Technology', avatarColor: 'from-emerald-500 to-teal-600' },
  { id: 4, name: 'Marcus Kinsley', initials: 'MK', role: 'VP of Engineering', location: 'Hyderabad', department: 'Engineering', avatarColor: 'from-blue-600 to-indigo-600' },
  { id: 5, name: 'Sarah Jenkins', initials: 'SJ', role: 'Senior Product Designer', location: 'Hyderabad', department: 'Design & UX', avatarColor: 'from-rose-600 to-pink-600' },
  { id: 6, name: 'David Chen', initials: 'DC', role: 'Financial Analyst', location: 'Hyderabad', department: 'Finance', avatarColor: 'from-purple-600 to-indigo-600' },
];

const notInYetToday = [{ name: 'Tejas Vora', initials: 'TV', avatarColor: 'from-amber-500 to-orange-600' }];

type DayStatus = 'weekoff' | 'holiday' | 'paid' | 'unpaid' | 'noattendance' | null;

function buildMonthDays(year: number, month: number, specials: Record<number, DayStatus>) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: { day: number; date: Date; status: DayStatus }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    const status: DayStatus = specials[d] ?? (dow === 0 || dow === 6 ? 'weekoff' : null);
    days.push({ day: d, date, status });
  }
  return days;
}

const dayColor: Record<Exclude<DayStatus, null>, string> = {
  weekoff: 'bg-amber-400 text-white',
  holiday: 'bg-emerald-500 text-white',
  paid: 'bg-sky-100 text-sky-700',
  unpaid: 'bg-stone-200 text-stone-600',
  noattendance: 'bg-red-400 text-white',
};

const legend: { label: string; color: string; shape?: 'dot' }[] = [
  { label: 'Work from home', color: 'bg-violet-500', shape: 'dot' },
  { label: 'On duty', color: 'bg-pink-500', shape: 'dot' },
  { label: 'Paid Leave', color: 'bg-sky-400', shape: 'dot' },
  { label: 'Unpaid Leave', color: 'bg-stone-400', shape: 'dot' },
  { label: 'Leave due to No Attendance', color: 'bg-red-400', shape: 'dot' },
  { label: 'Weekly off', color: 'bg-amber-400' },
  { label: 'Holiday', color: 'bg-emerald-500' },
  { label: 'Someone on Leave', color: 'bg-blue-500', shape: 'dot' },
  { label: 'Multiple Leave on a day', color: 'bg-rose-500', shape: 'dot' },
  { label: 'Someone on WFH/OD', color: 'bg-slate-400', shape: 'dot' },
];

export default function TeamPage() {
  const [month, setMonth] = useState(new Date(2026, 7, 1)); // Aug 2026

  const monthDays = buildMonthDays(month.getFullYear(), month.getMonth(), {
    7: 'noattendance',
    8: 'unpaid',
    9: 'unpaid',
    10: 'paid',
    11: 'paid',
    12: 'paid',
    13: 'paid',
    14: 'paid',
    15: 'unpaid',
    28: 'holiday',
  });

  const shiftMonth = (delta: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  const stats = [
    { label: 'Employees On Time today', value: 3, color: 'border-teal-400' },
    { label: 'Late Arrivals today', value: 2, color: 'border-violet-400' },
    { label: 'Work from Home / On Duty today', value: 0, color: 'border-emerald-400' },
    { label: 'Remote Clock-ins today', value: 0, color: 'border-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Sub-nav */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8">
        <div className="flex gap-5">
          <span className="relative py-4 text-xs font-semibold tracking-wide text-blue-600 uppercase">
            Summary
            <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-blue-600" />
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Who is on leave / Not in yet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-3">Who is on leave today</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
              No employee is on leave today.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-3">Not in yet today</h2>
            {notInYetToday.length === 0 ? (
              <p className="text-sm text-gray-500">Everyone has checked in.</p>
            ) : (
              <div className="flex gap-4">
                {notInYetToday.map((p) => (
                  <div key={p.name} className="flex flex-col items-center text-center w-16">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {p.initials}
                    </div>
                    <span className="text-xs text-gray-600 mt-1.5 truncate w-full">{p.name.split(' ')[0]}...</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`bg-white rounded-2xl border border-gray-200 border-l-4 ${s.color} p-4 shadow-sm`}>
              <p className="text-sm text-slate-700 mb-2">{s.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">{s.value}</span>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View Employees</button>
              </div>
            </div>
          ))}
        </div>

        {/* Team calendar */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">Team calendar</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => shiftMonth(-1)}
                className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-slate-900 w-20 text-center">
                {month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => shiftMonth(1)}
                className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
              >
                <ChevronDownIcon className="w-4 h-4 -rotate-90" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white text-left text-xs font-semibold text-gray-500 pr-4 pb-2 w-40">Team member</th>
                    {monthDays.map((d) => (
                      <th key={d.day} className="text-[10px] font-semibold text-gray-400 pb-2 px-1 w-8">
                        {d.date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.slice(0, 3).map((member) => (
                    <tr key={member.id}>
                      <td className="sticky left-0 bg-white pr-4 py-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                          >
                            {member.initials}
                          </div>
                          <span className="text-sm text-slate-700 whitespace-nowrap">{member.name}</span>
                        </div>
                      </td>
                      {monthDays.map((d) => (
                        <td key={d.day} className="px-1 py-1.5 text-center">
                          {d.status ? (
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-semibold ${dayColor[d.status]}`}
                            >
                              {d.day}
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-400">{d.day}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-4 border-t border-gray-100">
              {legend.map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  {l.shape === 'dot' ? (
                    <span className={`w-2 h-2 rounded-full ${l.color}`} />
                  ) : (
                    <span className={`w-3 h-3 rounded ${l.color}`} />
                  )}
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Peers */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">Peers ({teamMembers.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {member.initials}
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded px-1 py-0.5 border border-white">
                      IN
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{member.name}</h3>
                      <button className="text-gray-400 hover:text-gray-600 shrink-0" title="More">
                        &#8942;
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Location: <span className="text-gray-700">{member.location}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Department: <span className="text-gray-700">{member.department}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
