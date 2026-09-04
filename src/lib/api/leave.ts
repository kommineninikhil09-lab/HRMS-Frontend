/**
 * Browser-side Leave API client. Talks only to the local `/api/leave/*` route
 * handlers (never the NestJS backend directly); those proxy to NestJS and carry
 * the httpOnly session cookie.
 */

export type HalfDayOption = 'full_day' | 'first_half' | 'second_half';
export type LeaveStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  annual_allocation: number;
  carry_forward_limit: number;
  requires_approval: boolean;
  is_paid: boolean;
  description: string | null;
  status: string;
}

export interface LeaveBalanceItem {
  id: string;
  leave_type_id: string;
  financial_year: string;
  opening_balance: number;
  allocated: number;
  used: number;
  pending: number;
  carry_forward: number;
  lapsed: number;
  entitled: number;
  available: number;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  half_day_option: HalfDayOption;
  reason: string | null;
  status: LeaveStatus;
  approver_id: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  leave_type_name: string | null;
  leave_type_code: string | null;
  employee_name: string | null;
  approver_name: string | null;
}

export interface Holiday {
  id: string;
  name: string;
  holiday_date: string;
  is_optional: boolean;
  description: string | null;
}

export interface CreateLeaveRequestInput {
  leave_type_id: string;
  start_date: string;
  end_date: string;
  half_day_option?: HalfDayOption;
  reason?: string;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string | string[] };
}

/** Thrown for any non-2xx local API response; `message` is backend-friendly. */
export class LeaveApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'LeaveApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/leave${path}`, {
    credentials: 'include',
    ...init,
    headers: init?.body
      ? { 'Content-Type': 'application/json', ...(init.headers ?? {}) }
      : init?.headers,
  });

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    json = null;
  }

  if (!res.ok || !json?.success) {
    const raw = json?.error?.message;
    const message = Array.isArray(raw)
      ? raw.join(', ')
      : raw || `Request failed (${res.status})`;

    // The proxy already cleared the auth cookies — send the user to sign in
    // rather than surfacing a generic error inside the UI.
    if (res.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new LeaveApiError(message, res.status);
  }

  return json.data as T;
}

export const leaveApi = {
  getTypes: () => request<LeaveType[]>('/types'),
  getBalance: () => request<LeaveBalanceItem[]>('/balance'),
  getRequests: () => request<LeaveRequest[]>('/requests'),
  getRequest: (id: string) => request<LeaveRequest>(`/requests/${id}`),
  createRequest: (input: CreateLeaveRequestInput) =>
    request<LeaveRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  cancelRequest: (id: string) =>
    request<LeaveRequest>(`/requests/${id}/cancel`, { method: 'POST' }),
  getPendingApprovals: () => request<LeaveRequest[]>('/approvals/pending'),
  decide: (id: string, approve: boolean, rejectionReason?: string) =>
    request<LeaveRequest>(`/requests/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify(
        approve
          ? { approve: true }
          : { approve: false, rejection_reason: rejectionReason },
      ),
    }),
  getHolidays: (year: number) => request<Holiday[]>(`/holidays?year=${year}`),
  getCalendar: (from: string, to: string) =>
    request<LeaveRequest[]>(`/calendar?from=${from}&to=${to}`),
};

// ---- small formatting helpers shared by the leave UI ----

export function formatDays(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function formatDateShort(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(
  start: string,
  end: string,
  half: HalfDayOption,
): string {
  const suffix =
    half === 'first_half'
      ? ' · First half'
      : half === 'second_half'
        ? ' · Second half'
        : '';
  if (start === end) return `${formatDateShort(start)}${suffix}`;
  return `${formatDateShort(start)} – ${formatDateShort(end)}`;
}

const STATUS_LABEL: Record<LeaveStatus, string> = {
  draft: 'Draft',
  submitted: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export function statusLabel(s: LeaveStatus): string {
  return STATUS_LABEL[s] ?? s;
}
