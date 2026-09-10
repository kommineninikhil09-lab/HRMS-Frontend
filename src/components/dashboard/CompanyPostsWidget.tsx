'use client';

import { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { RequestToPostModal, RequestType } from '@/components/engage/RequestToPostModal';
import { useAuth } from '@/lib/auth/useAuth';

interface Post {
  id: string;
  user_id: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const requestTypeButtons: { type: RequestType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'Announcement',
    label: 'Announcement',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 10v4a1 1 0 0 0 1 1h2l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L6 9H4a1 1 0 0 0-1 1zm13.5 2c0-1.77-.77-3.37-2-4.47v8.94c1.23-1.1 2-2.7 2-4.47zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
    ),
  },
  {
    type: 'Poll',
    label: 'Poll',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 6h2v12h-2zm4-4h2v16h-2z" />
      </svg>
    ),
  },
  {
    type: 'Praise',
    label: 'Praise',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2H6v2H2v4c0 2.21 1.79 4 4 4h.28A6.01 6.01 0 0 0 11 17.91V20H7v2h10v-2h-4v-2.09A6.01 6.01 0 0 0 17.72 14H18c2.21 0 4-1.79 4-4V4h-4V2zM6 10c-1.1 0-2-.9-2-2V6h2v4zm14-2c0 1.1-.9 2-2 2V6h2v2z" />
      </svg>
    ),
  },
];

export function CompanyPostsWidget() {
  const { user } = useAuth();
  const [feed, setFeed] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/community/posts?limit=5', { credentials: 'include' });
        const body = await res.json();
        if (!cancelled && res.ok && body?.success) setFeed(body.data);
      } catch {
        // Leave the widget empty on failure - dashboard tiles shouldn't crash the page.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const submitRequest = () => {
    setRequestType(null);
    setToast('Request sent to the People Team for approval');
    window.setTimeout(() => setToast(''), 3000);
  };

  return (
    <DashboardCard title="Company Posts" actionLabel="View more posts" actionHref="/engage">
      {/* Composer — mirrors Engage: employees request a post for People Team approval */}
      <div className="border border-slate-200 rounded-lg p-3 mb-5">
        <button
          type="button"
          onClick={() => setRequestType('Announcement')}
          className="flex items-center gap-3 w-full text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ME
          </div>
          <span className="flex-1 text-sm text-slate-400">Share an announcement, poll or praise…</span>
        </button>
        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {requestTypeButtons.map((b) => (
              <button
                key={b.type}
                title={`Request ${b.label}`}
                onClick={() => setRequestType(b.type)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                {b.icon}
                <span className="hidden sm:inline">{b.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setRequestType('Announcement')}
            className="shrink-0 px-4 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors"
          >
            Request to post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-6">Loading…</p>
        ) : feed.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Nothing to show yet.</p>
        ) : (
          feed.map((post, idx) => {
            const isMine = user && post.user_id === user.id;
            return (
              <div key={post.id} className={idx > 0 ? 'pt-4 border-t border-slate-100' : ''}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {isMine ? 'ME' : '—'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{isMine ? 'You' : 'A colleague'}</span>
                        <span className="text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                          {post.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{relativeTime(post.created_at)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-2.5">{post.content}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">👍 {post.likes_count}</span>
                    <span className="flex items-center gap-1">💬 {post.comments_count}</span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    title="Bookmark"
                    className={bookmarked.includes(post.id) ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {requestType ? (
        <RequestToPostModal
          initialType={requestType}
          onClose={() => setRequestType(null)}
          onSubmit={submitRequest}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      ) : null}
    </DashboardCard>
  );
}
