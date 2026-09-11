/**
 * Browser-side Notifications API client. Talks only to the local
 * `/api/notifications/*` route handler (never the NestJS backend directly);
 * it proxies to NestJS and carries the httpOnly session cookie.
 */

export interface Notification {
  id: string;
  organizationId: string;
  userId: string;
  type: string;
  title: string;
  body: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationsList {
  notifications: Notification[];
  unreadCount: number;
}

interface Envelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string | string[] };
}

/** Thrown for any non-2xx local API response; `message` is backend-friendly. */
export class NotificationsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'NotificationsApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/notifications${path}`, {
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
    throw new NotificationsApiError(message, res.status);
  }

  return json.data as T;
}

export const notificationsApi = {
  list: (limit = 20) => request<NotificationsList>(`?limit=${limit}`),
  markRead: (id: string) =>
    request<{ notification: Notification }>(`/${id}/read`, { method: 'PUT' }),
  markAllRead: () =>
    request<{ markedCount: number }>('/read-all', { method: 'PUT' }),
};
