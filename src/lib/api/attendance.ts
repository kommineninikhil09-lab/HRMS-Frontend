/**
 * Browser-side Attendance API client. Talks only to the local
 * `/api/attendance/*` route handlers (never the NestJS backend directly);
 * those proxy to NestJS and carry the httpOnly session cookie.
 */

export type AttendanceDayStatus =
  | 'present'
  | 'work_from_home'
  | 'half_day'
  | 'on_leave'
  | 'holiday'
  | 'weekend'
  | 'absent'
  | 'not_marked';

export interface AttendanceDayView {
  attendance_date: string;
  status: AttendanceDayStatus;
  check_in: string | null;
  check_out: string | null;
  working_minutes: number | null;
  late_minutes: number | null;
  early_leave_minutes: number | null;
  is_weekend: boolean;
  is_holiday: boolean;
  holiday_name: string | null;
  on_leave: boolean;
  leave_type_name: string | null;
  source: string | null;
  notes: string | null;
  record_id: string | null;
}

export interface AttendanceSummary {
  from: string;
  to: string;
  elapsed_days: number;
  total_days: number;
  weekend_days: number;
  holiday_days: number;
  working_days: number;
  present_days: number;
  leave_days: number;
  absent_days: number;
  late_days: number;
  total_working_minutes: number;
  total_working_hours: number;
}

export interface AttendanceRecord {
  id: string;
  organization_id: string;
  employee_id: string;
  attendance_date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  working_minutes: number | null;
  late_minutes: number | null;
  early_leave_minutes: number | null;
  status: string;
  source: string;
  notes: string | null;
  marked_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWindow {
  month?: string;
  from?: string;
  to?: string;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string | string[] };
}

/** Thrown for any non-2xx local API response; `message` is backend-friendly. */
export class AttendanceApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'AttendanceApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/attendance${path}`, {
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

    if (res.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new AttendanceApiError(message, res.status);
  }

  return json.data as T;
}

function windowQuery(w: AttendanceWindow): string {
  const params = new URLSearchParams();
  if (w.month) params.set('month', w.month);
  if (w.from) params.set('from', w.from);
  if (w.to) params.set('to', w.to);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const attendanceApi = {
  getToday: () => request<AttendanceDayView>('/today'),
  getHistory: (w: AttendanceWindow) => request<AttendanceDayView[]>(windowQuery(w)),
  getSummary: (w: AttendanceWindow) => request<AttendanceSummary>(`/summary${windowQuery(w)}`),
  checkIn: (notes?: string) =>
    request<AttendanceRecord>('/check-in', {
      method: 'POST',
      body: JSON.stringify(notes ? { notes } : {}),
    }),
  checkOut: (notes?: string) =>
    request<AttendanceRecord>('/check-out', {
      method: 'POST',
      body: JSON.stringify(notes ? { notes } : {}),
    }),
};
