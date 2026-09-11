'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon } from '@/components/icons';
import { notificationsApi, type Notification, NotificationsApiError } from '@/lib/api/notifications';

// No link/entity field on the backend row yet (P3-02 hasn't wired up any
// producers, so there's nothing real to point at either) — a light prefix
// match on `type` is enough to route a click somewhere useful once real
// notifications exist, without inventing a backend field ahead of need.
function linkForType(type: string): string {
  if (type.startsWith('leave.')) return '/leave';
  if (type.startsWith('payroll.') || type.startsWith('payslip.')) return '/payslips';
  if (type.startsWith('performance.')) return '/performance';
  if (type.startsWith('attendance.')) return '/me/attendance';
  return '/notifications';
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationsApi.list();
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    } catch (e) {
      setError(e instanceof NotificationsApiError ? e.message : 'Could not load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch once on mount so the unread badge is accurate before the dropdown
  // is ever opened, then refresh on each open for anything new since.
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) load();
  };

  const handleSelect = async (notification: Notification) => {
    setIsOpen(false);
    if (!notification.readAt) {
      // Optimistic - the badge/list should reflect the click immediately,
      // not wait on a round trip before navigating away.
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, readAt: new Date().toISOString() } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      notificationsApi.markRead(notification.id).catch(() => {
        // Best-effort - a failed mark-read isn't worth blocking navigation
        // or showing an error for; it'll just show as unread again next load.
      });
    }
    router.push(linkForType(notification.type));
  };

  const handleMarkAllRead = async () => {
    const previous = notifications;
    const previousCount = unreadCount;
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await notificationsApi.markAllRead();
    } catch {
      setNotifications(previous);
      setUnreadCount(previousCount);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleOpen}
        className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        title="Notifications"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 ? (
          <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            {unreadCount > 0 ? (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">Loading…</div>
            ) : error ? (
              <div className="px-4 py-8 text-center text-sm text-red-600">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">You&apos;re all caught up.</div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleSelect(notification)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      notification.readAt ? 'bg-transparent' : 'bg-indigo-600'
                    }`}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-900 truncate">
                      {notification.title}
                    </span>
                    {notification.body ? (
                      <span className="block text-xs text-gray-500 truncate">{notification.body}</span>
                    ) : null}
                    <span className="block text-[11px] text-gray-400 mt-0.5">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
