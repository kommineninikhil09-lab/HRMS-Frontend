'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import {
  leaveApi,
  LeaveApiError,
  formatDays,
  formatDateShort,
  formatDateRange,
  statusLabel,
  type HalfDayOption,
  type LeaveBalanceItem,
  type LeaveRequest,
  type LeaveType,
  type LeaveStatus,
} from '@/lib/api/leave';

/* ============================== donut primitive ============================== */

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

/* ============================== helpers ============================== */

/** Client-side working-day estimate (weekdays only). The backend is
 *  authoritative and also excludes public holidays. */
function estimateDays(from: string, to: string, dayType: HalfDayOption): number {
  if (!from) return 0;
  if (dayType !== 'full_day') return 0.5;
  const end = to || from;
  const start = new Date(`${from}T00:00:00`);
  const stop = new Date(`${end}T00:00:00`);
  if (start > stop) return 0;
  let n = 0;
  for (const d = new Date(start); d <= stop; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) n += 1;
  }
  return n;
}

function statusPillClass(status: LeaveStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700';
    case 'submitted':
      return 'bg-amber-100 text-amber-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    case 'cancelled':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

/* ============================== page ============================== */

export default function LeaveManagementPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const canApprove = user?.permissions.includes('leave.approve') ?? false;

  const [types, setTypes] = useState<LeaveType[]>([]);
  const [balances, setBalances] = useState<LeaveBalanceItem[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [approvals, setApprovals] = useState<LeaveRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // apply modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dayType, setDayType] = useState<HalfDayOption>('full_day');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // history filters
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  // per-row action state
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const refresh = useCallback(async () => {
    const [t, b, r] = await Promise.all([
      leaveApi.getTypes(),
      leaveApi.getBalance(),
      leaveApi.getRequests(),
    ]);
    setTypes(t);
    setBalances(b);
    setRequests(r);
    if (canApprove) {
      try {
        setApprovals(await leaveApi.getPendingApprovals());
      } catch {
        setApprovals([]);
      }
    } else {
      setApprovals([]);
    }
  }, [canApprove]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    refresh()
      .catch((e) => {
        if (active) setLoadError(e instanceof Error ? e.message : 'Failed to load leave data');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refresh]);

  useEffect(() => {
    if (searchParams.get('action') === 'apply') setIsModalOpen(true);
  }, [searchParams]);

  const typesById = useMemo(() => {
    const m = new Map<string, LeaveType>();
    types.forEach((t) => m.set(t.id, t));
    return m;
  }, [types]);

  const typeName = useCallback(
    (req: LeaveRequest) => req.leave_type_name || typesById.get(req.leave_type_id)?.name || 'Leave',
    [typesById],
  );

  const myPending = useMemo(
    () => requests.filter((r) => r.status === 'submitted'),
    [requests],
  );

  const balanceRows = useMemo(
    () =>
      balances.map((b) => ({
        ...b,
        name: typesById.get(b.leave_type_id)?.name ?? 'Leave',
      })),
    [balances, typesById],
  );

  const historyTypeNames = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => set.add(typeName(r)));
    return Array.from(set).sort();
  }, [requests, typeName]);

  const filteredHistory = useMemo(
    () =>
      requests.filter((r) => {
        if (filterType !== 'All' && typeName(r) !== filterType) return false;
        if (filterStatus !== 'All' && statusLabel(r.status) !== filterStatus) return false;
        if (search) {
          const hay = `${typeName(r)} ${r.reason ?? ''} ${r.rejection_reason ?? ''}`.toLowerCase();
          if (!hay.includes(search.toLowerCase())) return false;
        }
        return true;
      }),
    [requests, filterType, filterStatus, search, typeName],
  );

  const estimated = estimateDays(fromDate, toDate, dayType);
  const isHalf = dayType !== 'full_day';
  const effectiveTo = isHalf ? fromDate : toDate;

  const resetForm = () => {
    setLeaveTypeId('');
    setFromDate('');
    setToDate('');
    setDayType('full_day');
    setReason('');
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    // "To" is optional for a full day — an empty "To" means a single-day leave.
    if (!leaveTypeId || !fromDate) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await leaveApi.createRequest({
        leave_type_id: leaveTypeId,
        start_date: fromDate,
        end_date: effectiveTo || fromDate,
        half_day_option: dayType,
        reason: reason.trim() || undefined,
      });
      setIsModalOpen(false);
      resetForm();
      setActionError(null);
      setActionMessage(
        `Leave requested for ${formatDays(created.duration_days)} day(s) — ${statusLabel(created.status)}.`,
      );
      await refresh();
    } catch (e) {
      setSubmitError(e instanceof LeaveApiError ? e.message : 'Could not submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    setActionError(null);
    setActionMessage(null);
    try {
      await leaveApi.cancelRequest(id);
      setActionMessage('Leave request cancelled.');
      await refresh();
    } catch (e) {
      setActionError(e instanceof LeaveApiError ? e.message : 'Could not cancel this request');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDecide = async (id: string, approve: boolean) => {
    setDecidingId(id);
    setActionError(null);
    setActionMessage(null);
    try {
      await leaveApi.decide(id, approve, approve ? undefined : rejectReason.trim());
      setActionMessage(approve ? 'Leave approved.' : 'Leave rejected.');
      setRejectingId(null);
      setRejectReason('');
      await refresh();
    } catch (e) {
      setActionError(e instanceof LeaveApiError ? e.message : 'Could not update this request');
    } finally {
      setDecidingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-['Inter'] p-4 sm:p-8">
        <div className="text-sm text-slate-500">Loading leave data…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 font-['Inter'] p-4 sm:p-8">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 max-w-lg">
          <p className="text-sm font-semibold text-red-700">Couldn&apos;t load leave data</p>
          <p className="text-xs text-slate-500 mt-1">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter']">
      <div className="p-4 sm:p-8 space-y-6">
        {/* Pending leave requests + actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3">Pending leave requests</h2>
            {myPending.length === 0 ? (
              <div className="flex items-center gap-3 py-2">
                <span className="text-xl">🎉</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Hurray! No pending leave requests</p>
                  <p className="text-xs text-slate-400">Request leave on the right!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {myPending.map((p) => (
                  <div key={p.id} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {typeName(p)} &middot; {formatDateRange(p.start_date, p.end_date, p.half_day_option)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDays(p.duration_days)} day(s){p.reason ? ` · ${p.reason}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full px-2.5 py-1">
                        Pending
                      </span>
                      <button
                        onClick={() => handleCancel(p.id)}
                        disabled={cancellingId === p.id}
                        className="text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        {cancellingId === p.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Leave
            </button>
            {actionMessage ? <p className="text-xs font-medium text-emerald-600">{actionMessage}</p> : null}
            {actionError ? <p className="text-xs font-medium text-red-600">{actionError}</p> : null}
          </div>
        </div>

        {/* Approvals (managers/HR only) */}
        {canApprove ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-900 mb-3">Approvals</h2>
            {approvals.length === 0 ? (
              <p className="text-sm text-slate-400">No leave requests awaiting your approval.</p>
            ) : (
              <div className="space-y-3">
                {approvals.map((a) => (
                  <div key={a.id} className="border border-slate-200 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {a.employee_name || 'Employee'} — {typeName(a)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDateRange(a.start_date, a.end_date, a.half_day_option)} ·{' '}
                          {formatDays(a.duration_days)} day(s){a.reason ? ` · ${a.reason}` : ''}
                        </p>
                      </div>
                      {rejectingId === a.id ? null : (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleDecide(a.id, true)}
                            disabled={decidingId === a.id}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(a.id);
                              setRejectReason('');
                            }}
                            disabled={decidingId === a.id}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    {rejectingId === a.id ? (
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection (required)"
                          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/10"
                        />
                        <button
                          onClick={() => handleDecide(a.id, false)}
                          disabled={decidingId === a.id || rejectReason.trim().length === 0}
                          className="text-xs font-semibold px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Confirm reject
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason('');
                          }}
                          className="text-xs font-medium px-3 py-2 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Leave Balances */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">Leave Balances</h2>
          {balanceRows.length === 0 ? (
            <p className="text-sm text-slate-400">No leave balances have been set up for you yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {balanceRows.map((b) => (
                <LeaveBalanceCard
                  key={b.id}
                  name={b.name}
                  entitled={b.entitled}
                  used={b.used}
                  pending={b.pending}
                  available={b.available}
                />
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-4">
            Financial year {balances[0]?.financial_year ?? '—'} · weekends and mandatory public holidays don&apos;t consume
            leave.
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
              {historyTypeNames.map((n) => (
                <option key={n}>{n}</option>
              ))}
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
              <option>Cancelled</option>
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
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((h) => {
                  const actionOn = h.approved_at ?? h.cancelled_at;
                  return (
                    <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                        {formatDateRange(h.start_date, h.end_date, h.half_day_option)}
                        <div className="text-xs text-slate-400">{formatDays(h.duration_days)} day(s)</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">{typeName(h)}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusPillClass(h.status)}`}
                        >
                          {statusLabel(h.status)}
                        </span>
                        {h.approver_name && (h.status === 'approved' || h.status === 'rejected') ? (
                          <div className="text-[11px] text-slate-400 mt-1">by {h.approver_name}</div>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {h.employee_name || 'You'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {actionOn ? formatDateShort(actionOn.slice(0, 10)) : '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{h.reason || '—'}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{h.rejection_reason || '—'}</td>
                    </tr>
                  );
                })}
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                      {requests.length === 0
                        ? 'No leave requests yet.'
                        : 'No leave requests match your filters.'}
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
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave type</label>
                  <select
                    value={leaveTypeId}
                    onChange={(e) => setLeaveTypeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Select</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day type</label>
                  <div className="flex gap-2">
                    {(
                      [
                        ['full_day', 'Full day'],
                        ['first_half', 'First half'],
                        ['second_half', 'Second half'],
                      ] as [HalfDayOption, string][]
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setDayType(value);
                          if (value !== 'full_day') setToDate('');
                        }}
                        className={`flex-1 text-xs font-semibold px-2 py-2 rounded-lg border transition-colors ${
                          dayType === value
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isHalf ? 'Date' : 'From'}</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div className={isHalf ? 'opacity-40 pointer-events-none' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="date"
                      value={isHalf ? fromDate : toDate}
                      min={fromDate || undefined}
                      onChange={(e) => setToDate(e.target.value)}
                      disabled={isHalf}
                      placeholder="Same as From"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                    ≈ {formatDays(estimated)} working day(s)
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Final duration is calculated by the server (public holidays excluded).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Optional"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {submitError ? (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {submitError}
                  </div>
                ) : null}
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !leaveTypeId || !fromDate}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {submitting ? 'Submitting…' : 'Request'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ============================== balance card ============================== */

function LeaveBalanceCard({
  name,
  entitled,
  used,
  pending,
  available,
}: {
  name: string;
  entitled: number;
  used: number;
  pending: number;
  available: number;
}) {
  const consumed = used + pending;
  const segments =
    available > 0 || consumed > 0
      ? [
          { value: Math.max(0, available), color: '#7C3AED' },
          { value: Math.max(0, consumed), color: '#E9D5FF' },
        ]
      : [];

  const cell = (label: string, value: string, extra = '') => (
    <div className={`px-3 py-3 ${extra}`}>
      <p className="text-[10px] font-semibold text-slate-400 uppercase">{label}</p>
      <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 pt-5">
        <h3 className="text-base font-bold text-slate-900 truncate">{name}</h3>
      </div>
      <div className="flex items-center justify-center py-6">
        <Donut segments={segments} size={104} thickness={12} centerLabel={formatDays(available)} centerSub="Available" />
      </div>
      <div className="grid grid-cols-2 border-t border-slate-100 text-center">
        {cell('Used', formatDays(used), 'border-r border-slate-100')}
        {cell('Pending', formatDays(pending))}
        {cell('Available', formatDays(available), 'border-r border-t border-slate-100')}
        {cell('Entitled', formatDays(entitled), 'border-t border-slate-100')}
      </div>
    </div>
  );
}
