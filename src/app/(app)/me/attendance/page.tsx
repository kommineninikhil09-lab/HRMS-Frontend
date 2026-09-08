'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClockIcon,
  HomeIcon,
  ChevronDownIcon,
  CoffeeIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  MessageCircleIcon,
} from '@/components/icons';

function AttendanceVisual({
  checkIn,
  checkOut,
  breakMinutes,
}: {
  checkIn?: string;
  checkOut?: string;
  breakMinutes?: number;
}) {
  if (!checkIn) {
    return <div className="h-2 w-full min-w-[140px] bg-slate-100 rounded-full" />;
  }

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const fmtMin = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
  };

  const inProgress = !checkOut;
  const startMin = toMinutes(checkIn);
  const endMin = inProgress ? new Date().getHours() * 60 + new Date().getMinutes() : toMinutes(checkOut!);
  const totalDuration = Math.max(1, endMin - startMin);
  const brk = Math.min(breakMinutes ?? 0, Math.max(0, totalDuration - 20));

  // A single break is placed roughly mid-session, splitting the bar into two
  // "logged in" segments with a gap between them (matching the reference).
  const segments =
    brk > 0
      ? (() => {
          const preBreak = Math.floor((totalDuration - brk) / 2);
          const seg1End = startMin + preBreak;
          const seg2Start = seg1End + brk;
          return [
            { start: startMin, end: seg1End },
            { start: seg2Start, end: endMin },
          ];
        })()
      : [{ start: startMin, end: endMin }];

  const ticks = Array.from({ length: 11 }, (_, i) => ((i + 1) / 12) * 100); // every 2h across 24h

  return (
    <div className="relative w-full min-w-[140px] py-2">
      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        {ticks.map((pct) => (
          <span key={pct} className="absolute top-0 bottom-0 w-px bg-white/80" style={{ left: `${pct}%` }} />
        ))}
      </div>

      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <div
            key={i}
            className="group/seg absolute top-2 h-2"
            title={`Logged In ${fmtMin(seg.start)} - ${inProgress && isLast ? 'now' : fmtMin(seg.end)}`}
            style={{
              left: `${(seg.start / 1440) * 100}%`,
              width: `${Math.max(0.8, ((seg.end - seg.start) / 1440) * 100)}%`,
            }}
          >
            <div
              className={`h-full rounded-full ${
                inProgress && isLast ? 'bg-amber-400 animate-pulse' : 'bg-teal-400'
              }`}
            />
            <div className="hidden group-hover/seg:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20">
              <div className="bg-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                Logged In {fmtMin(seg.start)} - {inProgress && isLast ? 'now' : fmtMin(seg.end)}
              </div>
              <div className="w-2 h-2 bg-slate-700 rotate-45 mx-auto -mt-1" />
            </div>
          </div>
        );
      })}

      {segments.length > 1
        ? (() => {
            const breakStart = segments[0].end;
            const breakEnd = segments[1].start;
            return (
              <div
                className="group/brk absolute top-2 h-2"
                title={`Break ${fmtMin(breakStart)} - ${fmtMin(breakEnd)} (${breakEnd - breakStart}m)`}
                style={{
                  left: `${(breakStart / 1440) * 100}%`,
                  width: `${Math.max(0.8, ((breakEnd - breakStart) / 1440) * 100)}%`,
                }}
              >
                <div className="h-full rounded-full bg-amber-300/0 group-hover/brk:bg-amber-300/80 transition-colors" />
                <div className="hidden group-hover/brk:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20">
                  <div className="bg-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    Break {fmtMin(breakStart)} - {fmtMin(breakEnd)} &middot; {breakEnd - breakStart}m
                  </div>
                  <div className="w-2 h-2 bg-slate-700 rotate-45 mx-auto -mt-1" />
                </div>
              </div>
            );
          })()
        : null}
    </div>
  );
}

/* ============================== mock data & generators ============================== */

type DayStatus = 'present' | 'weekoff' | 'holiday' | 'regularized' | 'inprogress';

interface AttendanceRow {
  date: Date;
  status: DayStatus;
  checkIn?: string;
  checkOut?: string;
  effectiveMinutes?: number;
  breakMinutes?: number;
  grossMinutes?: number;
  arrival?: 'On Time' | 'Late';
}

function fmtHM(minutes?: number) {
  if (minutes == null) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// Local (not UTC) YYYY-MM-DD — Date#toISOString() converts to UTC first, which
// shifts the date by a day for anyone west of UTC. Build the string from the
// local getFullYear/getMonth/getDate instead.
function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fmtClock(time24: string, use24h: boolean) {
  if (use24h) return time24;
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function generateAttendanceRows(start: Date, end: Date): AttendanceRow[] {
  const rows: AttendanceRow[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cursor = new Date(end);
  cursor.setHours(0, 0, 0, 0);
  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);

  while (cursor >= startDay) {
    const date = new Date(cursor);
    const dow = date.getDay();
    const day = date.getDate();
    const isToday = date.getTime() === today.getTime();

    if (dow === 0 || dow === 6) {
      rows.push({ date, status: 'weekoff' });
    } else if (isToday) {
      rows.push({
        date,
        status: 'inprogress',
        checkIn: '14:00',
        effectiveMinutes: 56,
        breakMinutes: 13,
        grossMinutes: 69,
        arrival: 'On Time',
      });
    } else {
      // deterministic pseudo-variation from the day number
      const lateOffset = day % 5 === 0 ? 22 : day % 3 === 0 ? 8 : 0;
      const checkInMin = 9 * 60 + lateOffset;
      const durationMin = 470 + ((day * 7) % 60);
      const breakMin = 40 + ((day * 3) % 30);
      const checkOutMin = checkInMin + durationMin;

      rows.push({
        date,
        status: day % 11 === 0 ? 'regularized' : 'present',
        checkIn: `${String(Math.floor(checkInMin / 60)).padStart(2, '0')}:${String(checkInMin % 60).padStart(2, '0')}`,
        checkOut: `${String(Math.floor(checkOutMin / 60)).padStart(2, '0')}:${String(checkOutMin % 60).padStart(2, '0')}`,
        effectiveMinutes: durationMin - breakMin,
        breakMinutes: breakMin,
        grossMinutes: durationMin,
        arrival: lateOffset > 15 ? 'Late' : 'On Time',
      });
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  return rows;
}

type LogRangeMode = 'week' | 'month' | 'custom';

const logRangeOptions: { id: LogRangeMode; label: string }[] = [
  { id: 'week', label: 'Last 7 Days' },
  { id: 'month', label: 'Last 30 Days' },
  { id: 'custom', label: 'Custom' },
];

/* ============================== page ============================== */

export default function AttendancePage() {
  return (
    // `min-h-full` (not `min-h-screen`): this page already renders inside the
    // app layout's full-height `overflow-y-auto` container. `100vh` here stacks
    // on top of the header + padding and creates a phantom scroll region.
    <div className="min-h-full bg-slate-50 font-['Inter']">
      <div className="p-4 sm:p-8">
        <AttendanceTab />
      </div>
    </div>
  );
}

/* ============================== attendance tab ============================== */

function AttendanceTab() {
  const router = useRouter();
  const [statsPeriod, setStatsPeriod] = useState<'This Week' | 'Last Week' | 'This Month'>('Last Week');
  const [statsMenuOpen, setStatsMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [logSubTab, setLogSubTab] = useState<'log' | 'calendar' | 'requests'>('log');
  const [logRangeMode, setLogRangeMode] = useState<LogRangeMode>('month');
  const [logRangeMenuOpen, setLogRangeMenuOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 13);
    return toLocalISODate(d);
  });
  const [customTo, setCustomTo] = useState(() => toLocalISODate(new Date()));
  const [use24h, setUse24h] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const statsByPeriod: Record<string, { meHrs: string; meOnTime: number; teamHrs: string; teamOnTime: number }> = {
    'This Week': { meHrs: '8h 12m', meOnTime: 80, teamHrs: '7h 40m', teamOnTime: 75 },
    'Last Week': { meHrs: '5h 3m', meOnTime: 60, teamHrs: '6h 7m', teamOnTime: 70 },
    'This Month': { meHrs: '7h 48m', meOnTime: 72, teamHrs: '7h 2m', teamOnTime: 68 },
  };
  const stats = statsByPeriod[statsPeriod];

  const rows = useMemo(() => {
    const today = new Date();

    if (logRangeMode === 'week') {
      const start = new Date();
      start.setDate(today.getDate() - 6);
      return generateAttendanceRows(start, today);
    }

    if (logRangeMode === 'month') {
      const start = new Date();
      start.setDate(today.getDate() - 29);
      return generateAttendanceRows(start, today);
    }

    // custom: whichever from/to range the user picked
    if (!customFrom || !customTo) return [];
    const start = new Date(`${customFrom}T00:00:00`);
    const end = new Date(`${customTo}T00:00:00`);
    if (end < start) return [];
    return generateAttendanceRows(start, end);
  }, [logRangeMode, customFrom, customTo]);

  const fmtShortDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

  const logRangeLabel =
    logRangeMode === 'week'
      ? 'Last 7 Days'
      : logRangeMode === 'month'
        ? 'Last 30 Days'
        : customFrom && customTo
          ? `${fmtShortDate(customFrom)} - ${fmtShortDate(customTo)}`
          : 'Custom Range';

  const todayLabel = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });
  const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const weekDayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = (now.getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Attendance Stats</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Attendance Stats */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="relative">
              <button
                onClick={() => setStatsMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"
              >
                {statsPeriod}
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </button>
              {statsMenuOpen ? (
                <div className="absolute left-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-md z-10 py-1">
                  {(['This Week', 'Last Week', 'This Month'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setStatsPeriod(p);
                        setStatsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                        p === statsPeriod ? 'text-blue-600 font-medium' : 'text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="text-slate-300" title="Weekly average across working days">
              ⓘ
            </span>
          </div>

          <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 px-1">
            <span />
            <span className="text-right">Avg Hrs / Day</span>
            <span className="text-right">On Time Arrival</span>
          </div>

          <div className="grid grid-cols-3 items-center py-3 border-t border-slate-100">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">
                Me
              </span>
            </span>
            <span className="text-right text-lg font-bold text-slate-900">{stats.meHrs}</span>
            <span className="text-right text-lg font-bold text-slate-900">{stats.meOnTime}%</span>
          </div>

          <div className="grid grid-cols-3 items-center py-3 border-t border-slate-100">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                T
              </span>
              My Team
            </span>
            <span className="text-right text-lg font-bold text-slate-900">{stats.teamHrs}</span>
            <span className="text-right text-lg font-bold text-slate-900">{stats.teamOnTime}%</span>
          </div>
        </div>

        {/* Timings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-base font-bold text-slate-900 mb-4">Timings</h3>
          <div className="flex items-center justify-between mb-5">
            {weekDayLetters.map((letter, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  i === todayIdx ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                {letter}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-500 mb-2">Today (2:00 PM - 11:00 PM)</p>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
            <div className="h-full w-[62%] bg-gradient-to-r from-teal-400 to-teal-500 rounded-full" />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Duration: 9h 0m</span>
            <span className="flex items-center gap-1">
              <CoffeeIcon className="w-3.5 h-3.5" />
              60 min
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-base font-bold text-slate-900 mb-4">Actions</h3>
          <div className="border border-slate-200 rounded-lg px-4 py-3 mb-4">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{timeLabel.replace(/(AM|PM)/, '')}</span>
            <span className="text-sm font-semibold text-slate-500 ml-1">{timeLabel.match(/AM|PM/)?.[0]}</span>
          </div>
          <p className="text-xs text-slate-500 mb-5">{todayLabel}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/attendance/wfh')}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <HomeIcon className="w-4 h-4" />
              Work From Home
            </button>
            <button
              onClick={() => router.push('/help')}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ClockIcon className="w-4 h-4" />
              Attendance Policy
            </button>
          </div>
        </div>
      </div>

      {/* Logs & Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-base font-bold text-slate-900">Logs &amp; Requests</h2>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
            <span
              onClick={() => setUse24h((v) => !v)}
              className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${
                use24h ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow" />
            </span>
            24 hour format
          </label>
        </div>

        <div className="flex gap-6 px-5 mt-4 border-b border-slate-200">
          {(
            [
              ['log', 'Attendance Log'],
              ['calendar', 'Calendar'],
              ['requests', 'Attendance Requests'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setLogSubTab(id)}
              className={`pb-3 -mb-px text-sm font-medium border-b-2 transition-colors ${
                logSubTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {logSubTab === 'log' ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">{logRangeLabel}</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setLogRangeMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50"
                  >
                    {logRangeOptions.find((o) => o.id === logRangeMode)?.label}
                    <ChevronDownIcon className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {logRangeMenuOpen ? (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-md z-10 py-1">
                      {logRangeOptions.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => {
                            setLogRangeMode(o.id);
                            setLogRangeMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                            o.id === logRangeMode ? 'text-blue-600 font-medium' : 'text-slate-600'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                {logRangeMode === 'custom' ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customFrom}
                      max={customTo}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="date"
                      value={customTo}
                      min={customFrom}
                      max={toLocalISODate(new Date())}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full">
                <thead className="bg-slate-50 border-y border-slate-200">
                  <tr>
                    {['Date', 'Attendance Visual', 'Effective Hours', 'Break Taken', 'Gross Hours', 'Arrival', 'Log'].map(
                      (h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.date.toISOString()} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                        {row.date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })}
                        {row.status === 'weekoff' ? (
                          <span className="ml-2 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">
                            W-OFF
                          </span>
                        ) : null}
                        {row.status === 'regularized' ? (
                          <span className="ml-2 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded px-1.5 py-0.5">
                            REG
                          </span>
                        ) : null}
                      </td>
                      {row.status === 'weekoff' ? (
                        <td className="px-5 py-4 text-sm text-slate-400" colSpan={5}>
                          Full day Weekly-off
                        </td>
                      ) : (
                        <>
                          <td className="px-5 py-4">
                            <button
                              onClick={() =>
                                router.push(`/attendance/regularize?date=${toLocalISODate(row.date)}`)
                              }
                              title="Click to regularize this day"
                              className="block w-full text-left cursor-pointer"
                            >
                              <AttendanceVisual
                                checkIn={row.checkIn}
                                checkOut={row.checkOut}
                                breakMinutes={row.breakMinutes}
                              />
                            </button>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                            {fmtHM(row.effectiveMinutes)}
                            {row.status === 'inprogress' ? ' +' : ''}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">{fmtHM(row.breakMinutes)}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {fmtHM(row.grossMinutes)}
                            {row.status === 'inprogress' ? ' +' : ''}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-sm font-medium ${
                                row.arrival === 'Late' ? 'text-amber-600' : 'text-slate-700'
                              }`}
                            >
                              {row.arrival === 'Late' ? '⚠' : '✓'} {row.arrival}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {row.status === 'inprogress' ? (
                              <span className="text-amber-500" title="In progress">
                                <AlertTriangleIcon className="w-4 h-4" />
                              </span>
                            ) : (
                              <span className="text-emerald-500" title="Complete">
                                <CheckCircleIcon className="w-4 h-4" />
                              </span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {logSubTab === 'calendar' ? <MiniCalendar rows={rows} /> : null}
        {logSubTab === 'requests' ? <AttendanceRequestsList rangeLabel={logRangeLabel} /> : null}
      </div>

      {/* only reason use24h/fmtClock helper exists is to keep parity with the toggle; small usage to avoid unused warnings */}
      <span className="sr-only">{fmtClock('09:00', use24h)}</span>
    </div>
  );
}

function MiniCalendar({ rows }: { rows: AttendanceRow[] }) {
  const byDate = new Map(rows.map((r) => [r.date.toDateString(), r]));
  const first = rows[rows.length - 1]?.date ?? new Date();
  const year = first.getFullYear();
  const month = first.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first

  const cells: (Date | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const colorFor = (status?: DayStatus) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-700';
      case 'inprogress':
        return 'bg-blue-100 text-blue-700';
      case 'regularized':
        return 'bg-violet-100 text-violet-700';
      case 'weekoff':
        return 'bg-slate-100 text-slate-400';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-slate-400 uppercase mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((date, i) =>
          date ? (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${colorFor(
                byDate.get(date.toDateString())?.status,
              )}`}
            >
              {date.getDate()}
            </div>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  );
}

function AttendanceRequestsList({ rangeLabel }: { rangeLabel: string }) {
  const regularizations = [
    {
      id: 1,
      date: '29 Jul 2026',
      note: '4AT Declared Work from Home',
      reason: 'System Policy',
      status: 'Approved',
      lastActionBy: 'Marcus Kinsley',
      lastActionOn: '03 Aug 2026',
    },
    {
      id: 2,
      date: '19 Aug 2026',
      note: '4AT declared work from home',
      reason: 'System Policy',
      status: 'Approved',
      lastActionBy: 'Marcus Kinsley',
      lastActionOn: '20 Aug 2026',
    },
    {
      id: 3,
      date: '21 Aug 2026',
      note: 'Feeling unwell and unable to commute to the office.',
      reason: 'Health',
      status: 'Approved',
      lastActionBy: 'Marcus Kinsley',
      lastActionOn: '21 Aug 2026',
    },
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Work From Home / On Duty Requests */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">Work From Home / On Duty Requests</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{rangeLabel}</span>
            <button className="text-slate-400 hover:text-slate-600" title="More">
              &#8942;
            </button>
          </div>
        </div>
        <div className="mx-5 mb-5 rounded-lg bg-blue-50 text-blue-700 text-sm px-4 py-3">
          No Work From Home / On Duty Requests Available.
        </div>
      </div>

      {/* Regularization Requests */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">Regularization Requests</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{rangeLabel}</span>
            <button className="text-slate-400 hover:text-slate-600" title="More">
              &#8942;
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                {[
                  'Date',
                  'Note',
                  'Reason',
                  'Status',
                  'Last Action By',
                  'Next Approver',
                  'Log',
                  'Actions',
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {regularizations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      {r.date}
                      <span className="text-blue-500" title="Regularization">
                        &#8599;
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 max-w-[220px]">{r.note}</td>
                  <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">{r.reason}</td>
                  <td className="px-4 py-4">
                    <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-700 rounded-full px-2.5 py-1">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {r.lastActionBy}
                    <div className="text-xs text-slate-400">on {r.lastActionOn}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400 whitespace-nowrap">&mdash;</td>
                  <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">NA</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <button className="hover:text-slate-600" title="Comments">
                        <MessageCircleIcon className="w-4 h-4" />
                      </button>
                      <button className="hover:text-slate-600" title="More">
                        &#8942;
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 text-xs text-slate-400 border-t border-slate-100">
          <span>
            1 to {regularizations.length} of {regularizations.length}
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
