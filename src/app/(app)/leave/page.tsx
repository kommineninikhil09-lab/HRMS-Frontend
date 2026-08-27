'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

/* ============================== chart primitives ============================== */

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

/* ============================== mock data ============================== */

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ============================== page ============================== */

export default function LeaveManagementPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userName = user ? `${user.firstName} ${user.lastName}`.trim() : 'You';

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
    <div className="min-h-screen bg-slate-50 font-['Inter']">
      <div className="p-4 sm:p-8 space-y-6">
        {/* Pending leave requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
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

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">Weekly Pattern</h3>
              <MiniBarChart data={weeklyPattern} />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center">
              <h3 className="text-base font-bold text-slate-900 mb-4 self-start">Consumed Leave Types</h3>
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">Monthly Stats</h3>
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
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
