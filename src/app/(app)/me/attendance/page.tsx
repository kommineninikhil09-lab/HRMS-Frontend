'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import {
  ClockIcon,
  HomeIcon,
  ChevronDownIcon,
  CoffeeIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  MessageCircleIcon,
} from '@/components/icons';

/* ============================== shared chart primitives ============================== */

function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const peak = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-1.5 h-20">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div className="w-full flex items-end h-14">
            <div
              className={`w-full rounded-t ${d.value > 0 ? 'bg-violet-400' : 'bg-slate-100'}`}
              style={{ height: d.value > 0 ? `${Math.max(10, (d.value / peak) * 100)}%` : '4px' }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-[10px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({
  segments,
  size = 120,
  thickness = 14,
  centerLabel,
  centerSub,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total <= 0) {
    return (
      <div
        className="relative shrink-0 rounded-full border-[14px] border-slate-100 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-[11px] text-slate-400 text-center px-3">No data to display.</span>
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circumference;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      {centerLabel || centerSub ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
          {centerLabel ? <span className="text-sm font-bold text-slate-900 leading-tight">{centerLabel}</span> : null}
          {centerSub ? <span className="text-[10px] text-slate-500 leading-tight mt-0.5">{centerSub}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

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

const leaveBalanceInit = [
  { type: 'Casual Leave', total: 10, used: 2 },
  { type: 'Sick Leave', total: 10, used: 1 },
  { type: 'Paid Leave', total: 20, used: 5 },
];

interface LeaveHistoryEntry {
  id: number;
  dates: string;
  days: number;
  type: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  requestedBy: string;
  approvedBy?: string;
  actionTakenOn: string;
  note: string;
  reason: string;
}

const SELF = '__self__';

const initialLeaveHistory: LeaveHistoryEntry[] = [
  {
    id: 1,
    dates: '17 Jul 2026',
    days: 1,
    type: 'Casual Leave',
    status: 'Approved',
    requestedBy: SELF,
    approvedBy: 'Marcus Kinsley',
    actionTakenOn: '18 Jul 2026',
    note: 'Personal work',
    reason: '',
  },
  {
    id: 2,
    dates: '16 Jul 2026',
    days: 1,
    type: 'Sick Leave',
    status: 'Approved',
    requestedBy: SELF,
    approvedBy: 'Marcus Kinsley',
    actionTakenOn: '17 Jul 2026',
    note: 'Fever',
    reason: '',
  },
  {
    id: 3,
    dates: '14 Jul – 15 Jul 2026',
    days: 2,
    type: 'Paid Leave',
    status: 'Approved',
    requestedBy: SELF,
    approvedBy: 'Sarah Jenkins',
    actionTakenOn: '10 Jul 2026',
    note: 'Family function',
    reason: '',
  },
  {
    id: 4,
    dates: '30 Jun 2026',
    days: 1,
    type: 'Casual Leave',
    status: 'Rejected',
    requestedBy: SELF,
    approvedBy: 'Marcus Kinsley',
    actionTakenOn: '28 Jun 2026',
    note: 'Personal work',
    reason: 'Insufficient project coverage',
  },
];

const leaveTabs = ['ATTENDANCE', 'LEAVE'] as const;

/* ============================== page ============================== */

export default function AttendancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const activeMainTab = (searchParams.get('tab') || 'attendance').toLowerCase();

  const goToTab = (tab: string) => {
    router.push(`/me/attendance?tab=${tab}`);
  };

  const handleTabBarClick = (label: (typeof leaveTabs)[number]) => {
    if (label === 'ATTENDANCE') goToTab('attendance');
    else if (label === 'LEAVE') goToTab('leave');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Lato']">
      {/* Top sub-nav, mirrors the Keka reference */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="flex gap-8 overflow-x-auto">
          {leaveTabs.map((label) => {
            const isAttendance = label === 'ATTENDANCE' && activeMainTab === 'attendance';
            const isLeave = label === 'LEAVE' && activeMainTab === 'leave';
            const active = isAttendance || isLeave;
            return (
              <button
                key={label}
                onClick={() => handleTabBarClick(label)}
                className={`relative py-4 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors ${
                  active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
                {active ? (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-blue-600" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {activeMainTab === 'leave' ? (
          <LeaveTab userName={user ? `${user.firstName} ${user.lastName}`.trim() : 'You'} searchParams={searchParams} />
        ) : (
          <AttendanceTab />
        )}
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Timings</h3>
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Actions</h3>
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
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
          <h3 className="text-sm font-semibold text-slate-900">Work From Home / On Duty Requests</h3>
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
          <h3 className="text-sm font-semibold text-slate-900">Regularization Requests</h3>
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

/* ============================== leave tab ============================== */

function LeaveTab({
  userName,
  searchParams,
}: {
  userName: string;
  searchParams: ReturnType<typeof useSearchParams>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [note, setNote] = useState('');
  const [notifyEmployee, setNotifyEmployee] = useState('');

  const [leaveBalance, setLeaveBalance] = useState(leaveBalanceInit);
  const [leaveHistory, setLeaveHistory] = useState(initialLeaveHistory);
  const [pendingRequests, setPendingRequests] = useState<LeaveHistoryEntry[]>([]);

  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (searchParams.get('action') === 'apply') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const calculateDays = () => {
    if (fromDate && toDate) {
      const diff = Math.abs(new Date(toDate).getTime() - new Date(fromDate).getTime());
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const leaveTypeOptions: Record<string, string> = {
    casual: 'Casual Leave',
    sick: 'Sick Leave',
    paid: 'Paid Leave',
    unpaid: 'Unpaid Leave',
  };

  const handleRequestLeave = () => {
    if (!fromDate || !toDate || !leaveType) return;
    const days = calculateDays();
    const label = leaveTypeOptions[leaveType] || 'Leave';

    const entry: LeaveHistoryEntry = {
      id: Date.now(),
      dates: fromDate === toDate ? formatDate(fromDate) : `${formatDate(fromDate)} – ${formatDate(toDate)}`,
      days,
      type: label,
      status: 'Pending',
      requestedBy: userName,
      actionTakenOn: '—',
      note: note || '—',
      reason: '',
    };

    setPendingRequests((prev) => [entry, ...prev]);
    setLeaveHistory((prev) => [entry, ...prev]);

    if (leaveType !== 'unpaid') {
      setLeaveBalance((prev) =>
        prev.map((b) => (b.type === label ? { ...b, used: b.used + days } : b)),
      );
    }

    setIsModalOpen(false);
    setFromDate('');
    setToDate('');
    setLeaveType('');
    setNote('');
    setNotifyEmployee('');
  };

  const cancelPending = (id: number) => {
    setPendingRequests((prev) => prev.filter((p) => p.id !== id));
    setLeaveHistory((prev) => prev.filter((p) => p.id !== id));
  };

  const weeklyPattern = [
    { label: 'Mon', value: 2 },
    { label: 'Tue', value: 3 },
    { label: 'Wed', value: 0 },
    { label: 'Thu', value: 2 },
    { label: 'Fri', value: 1 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 0 },
  ];

  const monthlyStats = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 1 },
    { label: 'Mar', value: 0 },
    { label: 'Apr', value: 0 },
    { label: 'May', value: 0 },
    { label: 'Jun', value: 3 },
    { label: 'Jul', value: 4 },
    { label: 'Aug', value: 1 },
    { label: 'Sep', value: 0 },
    { label: 'Oct', value: 0 },
    { label: 'Nov', value: 0 },
    { label: 'Dec', value: 0 },
  ];

  const consumedColors: Record<string, string> = {
    'Casual Leave': '#3B82F6',
    'Sick Leave': '#F59E0B',
    'Paid Leave': '#10B981',
  };
  const consumedSegments = leaveBalance
    .filter((b) => b.used > 0)
    .map((b) => ({ value: b.used, color: consumedColors[b.type] || '#94A3B8' }));

  const paidUsed = leaveBalance.find((b) => b.type === 'Paid Leave')?.used ?? 0;
  const paidTotal = leaveBalance.find((b) => b.type === 'Paid Leave')?.total ?? 0;
  const paidAvailable = Math.max(0, paidTotal - paidUsed - 6.5).toFixed(1);

  const filteredHistory = leaveHistory.filter((h) => {
    if (filterType !== 'All' && h.type !== filterType) return false;
    if (filterStatus !== 'All' && h.status !== filterStatus) return false;
    if (search && !`${h.type} ${h.note}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Pending leave requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 mb-3">Pending leave requests</h2>
          {pendingRequests.length === 0 ? (
            <div className="flex items-center gap-3 py-2">
              <span className="text-xl">🎉</span>
              <div>
                <p className="text-sm font-semibold text-slate-700">Hurray! No pending leave requests</p>
                <p className="text-xs text-slate-400">Request leave on the right!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((p) => (
                <div key={p.id} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {p.type} &middot; {p.dates}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.days} day(s) &middot; {p.note}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full px-2.5 py-1">
                      Pending
                    </span>
                    <button
                      onClick={() => cancelPending(p.id)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Request Leave
          </button>
          <button className="text-left text-sm font-medium text-blue-600 hover:text-blue-700">
            Request Credit for Compensatory Off
          </button>
          <button className="text-left text-sm font-medium text-blue-600 hover:text-blue-700">
            Leave Policy Explanation
          </button>
        </div>
      </div>

      {/* My Leave Stats */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">My Leave Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Weekly Pattern</h3>
            <MiniBarChart data={weeklyPattern} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 self-start">Consumed Leave Types</h3>
            <Donut segments={consumedSegments} centerLabel="Leave" centerSub="Types" />
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {leaveBalance
                .filter((b) => b.used > 0)
                .map((b) => (
                  <span key={b.type} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="w-2 h-2 rounded-full" style={{ background: consumedColors[b.type] }} />
                    {b.type}
                  </span>
                ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Stats</h3>
            <MiniBarChart data={monthlyStats} />
          </div>
        </div>
      </div>

      {/* Leave Balances */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Leave Balances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <LeaveBalanceCard title="4AT Declared Holiday" available="∞" consumed="0 day" quota="∞" segments={[]} />
          <LeaveBalanceCard title="Comp Offs" available="0 day" consumed="0 day" quota="0 day" segments={[]} />
          <LeaveBalanceCard
            title="Paid Time Off"
            available={`${paidAvailable} days`}
            consumed="1 day"
            quota="10.5 days"
            accrued="4.5 days"
            segments={[
              { value: Number(paidAvailable), color: '#7C3AED' },
              { value: 10.5 - Number(paidAvailable), color: '#E9D5FF' },
            ]}
          />
          <LeaveBalanceCard
            title="Unpaid Leave"
            available="8 days"
            consumed="4 days"
            quota="12 days"
            segments={[
              { value: 8, color: '#F59E0B' },
              { value: 4, color: '#FDE68A' },
            ]}
          />
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Other leave types available: <span className="font-medium text-slate-700">Maternity Leave, Optional Holiday</span>
        </p>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <h2 className="text-base font-bold text-slate-900">Leave History</h2>
        </div>
        <div className="flex flex-wrap gap-3 px-5 py-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option>All</option>
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Paid Leave</option>
            <option>Unpaid Leave</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          >
            <option>All</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 min-w-[160px] text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-y border-slate-200">
              <tr>
                {['Leave Dates', 'Leave Type', 'Status', 'Requested By', 'Action Taken On', 'Leave Note', 'Reason'].map(
                  (h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                    {h.dates}
                    <div className="text-xs text-slate-400">{h.days} day(s)</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">{h.type}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        h.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : h.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {h.status}
                    </span>
                    {h.approvedBy ? <div className="text-[11px] text-slate-400 mt-1">by {h.approvedBy}</div> : null}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {h.requestedBy === SELF ? userName : h.requestedBy}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{h.actionTakenOn}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{h.note}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{h.reason || '—'}</td>
                </tr>
              ))}
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                    No leave requests match your filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Leave Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Request Leave</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                    {calculateDays()} days
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select type of leave you want to apply</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select</option>
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="paid">Paid Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type here"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notify</label>
                <input
                  type="text"
                  value={notifyEmployee}
                  onChange={(e) => setNotifyEmployee(e.target.value)}
                  placeholder="Search employee"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestLeave}
                disabled={!fromDate || !toDate || !leaveType}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LeaveBalanceCard({
  title,
  available,
  consumed,
  quota,
  accrued,
  segments,
}: {
  title: string;
  available: string;
  consumed: string;
  quota: string;
  accrued?: string;
  segments: { value: number; color: string }[];
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View details</button>
      </div>
      <div className="flex items-center justify-center py-6">
        <Donut segments={segments} size={104} thickness={12} centerLabel={available} centerSub="Available" />
      </div>
      <div className={`grid ${accrued ? 'grid-cols-2' : 'grid-cols-2'} border-t border-slate-100 text-center`}>
        <div className="px-3 py-3 border-r border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Available</p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">{available}</p>
        </div>
        <div className="px-3 py-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">Consumed</p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">{consumed}</p>
        </div>
        <div className="px-3 py-3 border-r border-t border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase">{accrued ? 'Accrued So Far' : 'Annual Quota'}</p>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">{accrued || quota}</p>
        </div>
        {accrued ? (
          <div className="px-3 py-3 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Annual Quota</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{quota}</p>
          </div>
        ) : (
          <div className="px-3 py-3 border-t border-slate-100" />
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}
