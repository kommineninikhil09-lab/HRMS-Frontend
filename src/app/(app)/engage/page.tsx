'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';

/* ------------------------------ icons ------------------------------ */

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 10v4a1 1 0 0 0 1 1h2l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L6 9H4a1 1 0 0 0-1 1zm13.5 2c0-1.77-.77-3.37-2-4.47v8.94c1.23-1.1 2-2.7 2-4.47zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const PollIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 6h2v12h-2zm4-4h2v16h-2z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H6v2H2v4c0 2.21 1.79 4 4 4h.28A6.01 6.01 0 0 0 11 17.91V20H7v2h10v-2h-4v-2.09A6.01 6.01 0 0 0 17.72 14H18c2.21 0 4-1.79 4-4V4h-4V2zM6 10c-1.1 0-2-.9-2-2V6h2v4zm14-2c0 1.1-.9 2-2 2V6h2v2z" />
  </svg>
);

/* ------------------------------ data ------------------------------ */

type FeedKind = 'announcement' | 'poll' | 'praise' | 'post';

interface BaseItem {
  id: string;
  kind: FeedKind;
  author: string;
  initials: string;
  avatar: string;
  time: string;
  createdAt: string;
  likes: number;
  comments: number;
}

interface AnnouncementItem extends BaseItem {
  kind: 'announcement';
  title: string;
  body: string;
}

interface PollItem extends BaseItem {
  kind: 'poll';
  question: string;
  options: { id: string; label: string; votes: number }[];
  closesOn: string;
  closed: boolean;
}

interface PraiseItem extends BaseItem {
  kind: 'praise';
  recipient: string;
  badge: string;
  badgeLabel: string;
  message: string;
}

interface PostItem extends BaseItem {
  kind: 'post';
  message: string;
  category: string;
}

type FeedItem = AnnouncementItem | PollItem | PraiseItem | PostItem;

interface RawAnnouncement {
  id: string;
  title: string;
  content?: string;
  priority: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

interface RawPost {
  id: string;
  user_id: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface RawPollOption {
  id: string;
  option_text: string;
  vote_count: number;
}

interface RawPoll {
  id: string;
  user_id: string;
  question: string;
  status: string;
  total_votes: number;
  created_at: string;
  options?: RawPollOption[];
}

interface RawPraise {
  id: string;
  from_user_id: string;
  to_employee_id: string;
  badge_type: string;
  description: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

const badgeLabels: Record<string, string> = {
  top_performer: '🏆 Top Performer',
  leadership_impact: '👑 Leadership Impact',
  customer_hero: '🦸 Customer Hero',
  above_beyond: '🌟 Above & Beyond',
  team_player: '🤝 Team Player',
  rockstar_rookie: '🚀 Rockstar Rookie',
  legacy_builder: '🏛️ Legacy Builder',
  all_day_everyday: '💪 All Day Everyday',
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  const body = await res.json();
  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.message || `Request to ${url} failed`);
  }
  return body.data as T;
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'polls', label: 'Polls' },
  { id: 'praise', label: 'Praise' },
  { id: 'media', label: 'Media' },
] as const;

type FilterId = (typeof filters)[number]['id'];

const kindMeta: Record<FeedKind, { label: string; icon: React.ReactNode; chip: string }> = {
  announcement: { label: 'Announcement', icon: <MegaphoneIcon />, chip: 'bg-blue-100 text-blue-700' },
  poll: { label: 'Poll', icon: <PollIcon />, chip: 'bg-violet-100 text-violet-700' },
  praise: { label: 'Praise', icon: <TrophyIcon />, chip: 'bg-amber-100 text-amber-700' },
  post: { label: 'Post', icon: <CommentIcon />, chip: 'bg-slate-100 text-slate-600' },
};

type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

interface PostRequest {
  id: number;
  type: string;
  title: string;
  status: RequestStatus;
  submitted: string;
}

const initialRequests: PostRequest[] = [
  { id: 1, type: 'Announcement', title: 'Weekend charity run — sign-up open', status: 'Pending', submitted: '1 day ago' },
  { id: 2, type: 'Praise', title: 'Shout-out to the on-call team', status: 'Approved', submitted: '4 days ago' },
];

const statusStyles: Record<RequestStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

/* ------------------------------ media ------------------------------ */

type MediaKind = 'photo' | 'video';

interface MediaItem {
  id: number;
  kind: MediaKind;
  title: string;
  album: string;
  uploader: string;
  initials: string;
  avatar: string;
  date: string;
  gradient: string;
  duration?: string;
  count?: number;
  pending?: boolean;
}

const mediaAlbums = ['Team Photos', 'Training Videos', 'Events', 'Offsites'];

const mediaGradients = [
  'from-sky-400 to-indigo-500',
  'from-rose-400 to-orange-400',
  'from-emerald-400 to-teal-500',
  'from-violet-400 to-fuchsia-500',
  'from-amber-400 to-pink-500',
];

const media: MediaItem[] = [
  {
    id: 101,
    kind: 'photo',
    title: 'Q3 all-hands group photo',
    album: 'Team Photos',
    uploader: 'Priya Nair',
    initials: 'PN',
    avatar: 'from-rose-600 to-pink-600',
    date: '3 days ago',
    gradient: 'from-sky-400 to-indigo-500',
    count: 18,
  },
  {
    id: 102,
    kind: 'video',
    title: 'Onboarding: navigating the HR portal',
    album: 'Training Videos',
    uploader: 'People Team',
    initials: 'PT',
    avatar: 'from-blue-600 to-indigo-600',
    date: '1 week ago',
    gradient: 'from-violet-400 to-fuchsia-500',
    duration: '6:24',
  },
  {
    id: 103,
    kind: 'photo',
    title: 'Diwali celebration at the office',
    album: 'Events',
    uploader: 'Marcus Kinsley',
    initials: 'MK',
    avatar: 'from-emerald-600 to-teal-600',
    date: '1 week ago',
    gradient: 'from-amber-400 to-pink-500',
    count: 32,
  },
  {
    id: 104,
    kind: 'video',
    title: 'Fire safety & evacuation drill',
    album: 'Training Videos',
    uploader: 'People Team',
    initials: 'PT',
    avatar: 'from-blue-600 to-indigo-600',
    date: '2 weeks ago',
    gradient: 'from-emerald-400 to-teal-500',
    duration: '3:58',
  },
  {
    id: 105,
    kind: 'photo',
    title: 'Goa offsite — day two',
    album: 'Offsites',
    uploader: 'Rahul Sharma',
    initials: 'RS',
    avatar: 'from-orange-600 to-amber-600',
    date: '1 month ago',
    gradient: 'from-rose-400 to-orange-400',
    count: 47,
  },
  {
    id: 106,
    kind: 'video',
    title: 'Design system walkthrough',
    album: 'Training Videos',
    uploader: 'Design Guild',
    initials: 'DG',
    avatar: 'from-fuchsia-600 to-purple-600',
    date: '1 month ago',
    gradient: 'from-sky-400 to-indigo-500',
    duration: '12:10',
  },
];

/* ------------------------------ page ------------------------------ */

export default function EngagePage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterId>('all');
  const [search, setSearch] = useState('');

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);

  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [votedOption, setVotedOption] = useState<Record<string, string>>({});

  const [requests, setRequests] = useState<PostRequest[]>(initialRequests);
  const [showRequests, setShowRequests] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const [mediaAlbum, setMediaAlbum] = useState('All');
  const [uploads, setUploads] = useState<MediaItem[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'all' || tab === 'announcements' || tab === 'polls' || tab === 'praise' || tab === 'media') {
      setFilter(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setFeedLoading(true);
        setFeedError(null);

        const [announcements, posts, polls, praise] = await Promise.all([
          fetchJson<RawAnnouncement[]>('/api/community/announcements/active?limit=20'),
          fetchJson<RawPost[]>('/api/community/posts?limit=20'),
          fetchJson<RawPoll[]>('/api/community/polls?limit=20'),
          fetchJson<RawPraise[]>('/api/community/praise?limit=20'),
        ]);

        // List endpoints omit body content/poll options - fetch full detail
        // per item for the two kinds that need it to render.
        const [announcementDetails, pollDetails] = await Promise.all([
          Promise.all(
            announcements.map((a) =>
              fetchJson<RawAnnouncement>(`/api/community/announcements/${a.id}`).catch(() => a)
            )
          ),
          Promise.all(
            polls.map((p) => fetchJson<RawPoll>(`/api/community/polls/${p.id}`).catch(() => p))
          ),
        ]);

        // Resolve praise recipients to real names where the viewer's scope allows it.
        const recipientIds = Array.from(new Set(praise.map((p) => p.to_employee_id)));
        const recipientNames = new Map<string, string>();
        await Promise.all(
          recipientIds.map(async (id) => {
            try {
              const emp = await fetchJson<{ first_name: string; last_name: string }>(`/api/employees/${id}`);
              recipientNames.set(id, `${emp.first_name} ${emp.last_name}`.trim());
            } catch {
              // Outside this viewer's management scope - fall back below.
            }
          })
        );

        const items: FeedItem[] = [
          ...announcementDetails.map(
            (a): AnnouncementItem => ({
              id: a.id,
              kind: 'announcement',
              author: 'People Team',
              initials: 'PT',
              avatar: 'from-blue-600 to-indigo-600',
              time: relativeTime(a.published_at ?? a.created_at),
              createdAt: a.published_at ?? a.created_at,
              likes: 0,
              comments: 0,
              title: a.title,
              body: a.content ?? '',
            })
          ),
          ...posts.map(
            (p): PostItem => ({
              id: p.id,
              kind: 'post',
              author: user && p.user_id === user.id ? 'You' : 'A colleague',
              initials: user && p.user_id === user.id ? 'ME' : '—',
              avatar: 'from-purple-600 to-fuchsia-600',
              time: relativeTime(p.created_at),
              createdAt: p.created_at,
              likes: p.likes_count,
              comments: p.comments_count,
              message: p.content,
              category: p.category,
            })
          ),
          ...pollDetails.map((p): PollItem => {
            const closed = p.status !== 'active';
            return {
              id: p.id,
              kind: 'poll',
              author: user && p.user_id === user.id ? 'You' : 'A colleague',
              initials: user && p.user_id === user.id ? 'ME' : '—',
              avatar: 'from-blue-600 to-indigo-600',
              time: relativeTime(p.created_at),
              createdAt: p.created_at,
              likes: 0,
              comments: 0,
              question: p.question,
              options: (p.options ?? []).map((o) => ({ id: o.id, label: o.option_text, votes: o.vote_count })),
              closesOn: closed ? 'Closed' : 'Open',
              closed,
            };
          }),
          ...praise.map(
            (pr): PraiseItem => ({
              id: pr.id,
              kind: 'praise',
              author: user && pr.from_user_id === user.id ? 'You' : 'A colleague',
              initials: user && pr.from_user_id === user.id ? 'ME' : '—',
              avatar: 'from-emerald-600 to-teal-600',
              time: relativeTime(pr.created_at),
              createdAt: pr.created_at,
              likes: pr.likes_count,
              comments: pr.comments_count,
              recipient: recipientNames.get(pr.to_employee_id) ?? '—',
              badge: (badgeLabels[pr.badge_type] ?? pr.badge_type).split(' ')[0],
              badgeLabel: (badgeLabels[pr.badge_type] ?? pr.badge_type).split(' ').slice(1).join(' '),
              message: pr.description,
            })
          ),
        ];

        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (!cancelled) setFeed(items);
      } catch (e) {
        if (!cancelled) setFeedError(e instanceof Error ? e.message : 'Failed to load feed');
      } finally {
        if (!cancelled) setFeedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isMedia = filter === 'media';

  const toggleLike = async (item: FeedItem) => {
    const alreadyLiked = likedIds.has(item.id);
    const path =
      item.kind === 'post'
        ? `/api/community/posts/${item.id}/like`
        : item.kind === 'praise'
          ? `/api/community/praise/${item.id}/like`
          : null;
    if (!path) return; // Announcements/polls have no like endpoint.

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) next.delete(item.id);
      else next.add(item.id);
      return next;
    });

    try {
      const res = await fetch(path, { method: alreadyLiked ? 'DELETE' : 'POST', credentials: 'include' });
      const body = await res.json();
      if (res.ok && body?.success) {
        setFeed((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, likes: body.data.likes_count } : f))
        );
      }
    } catch {
      // Leave the optimistic toggle in place - a stale count is preferable to reverting silently.
    }
  };

  const castVote = async (poll: PollItem, optionId: string) => {
    if (poll.closed || votedOption[poll.id]) return;
    setVotedOption((prev) => ({ ...prev, [poll.id]: optionId }));
    try {
      await fetch(`/api/community/polls/${poll.id}/vote`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_option_id: optionId }),
      });
      setFeed((prev) =>
        prev.map((f) =>
          f.id === poll.id && f.kind === 'poll'
            ? { ...f, options: f.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)) }
            : f
        )
      );
    } catch {
      // Leave the optimistic vote in place.
    }
  };

  const visible = useMemo(() => {
    return feed.filter((item) => {
      if (filter === 'announcements' && item.kind !== 'announcement') return false;
      if (filter === 'polls' && item.kind !== 'poll') return false;
      if (filter === 'praise' && item.kind !== 'praise') return false;
      if (search.trim()) {
        const haystack = [
          item.author,
          'title' in item ? item.title : '',
          'body' in item ? item.body : '',
          'question' in item ? item.question : '',
          'recipient' in item ? item.recipient : '',
          'message' in item ? item.message : '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [feed, filter, search]);

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  const galleryItems = useMemo(() => {
    const all = [...uploads, ...media];
    return all.filter((m) => {
      if (mediaAlbum !== 'All' && m.album !== mediaAlbum) return false;
      if (search.trim()) {
        const hay = `${m.title} ${m.uploader} ${m.album}`.toLowerCase();
        if (!hay.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [uploads, mediaAlbum, search]);

  const submitRequest = (type: string, title: string) => {
    setRequests((prev) => [
      { id: Date.now(), type, title, status: 'Pending', submitted: 'Just now' },
      ...prev,
    ]);
    setModalOpen(false);
    setShowRequests(true);
    setToast('Request sent to the People Team for approval');
    window.setTimeout(() => setToast(''), 3000);
  };

  const submitUpload = (kind: MediaKind, title: string, album: string) => {
    setUploads((prev) => [
      {
        id: Date.now(),
        kind,
        title,
        album,
        uploader: 'You',
        initials: 'YO',
        avatar: 'from-purple-600 to-fuchsia-600',
        date: 'Just now',
        gradient: mediaGradients[prev.length % mediaGradients.length],
        duration: kind === 'video' ? '0:00' : undefined,
        pending: true,
      },
      ...prev,
    ]);
    setUploadOpen(false);
    setToast('Media sent to the People Team for review');
    window.setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-6 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-1 py-3 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${
                  filter === f.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => (isMedia ? setUploadOpen(true) : setModalOpen(true))}
            className="shrink-0 px-3.5 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            {isMedia ? 'Upload media' : 'Request to post'}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className={`${isMedia ? 'max-w-5xl' : 'max-w-2xl'} mx-auto space-y-4`}>
          {/* Search + type-specific filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isMedia ? 'Search media by title, album or uploader…' : 'Search announcements, polls, praise…'}
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
            />
            {isMedia ? (
              <select
                value={mediaAlbum}
                onChange={(e) => setMediaAlbum(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
              >
                <option value="All">All albums</option>
                {mediaAlbums.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            ) : null}
          </div>

          {/* Media gallery */}
          {isMedia ? (
            galleryItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 text-center">
                <p className="text-sm font-semibold text-slate-600">No media yet</p>
                <p className="text-xs text-gray-400 mt-1">Upload a team photo or training video to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map((m) => (
                  <MediaCard key={m.id} item={m} />
                ))}
              </div>
            )
          ) : null}

          {/* Your requests */}
          {!isMedia ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowRequests((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold text-slate-900">
                Your post requests
                {pendingCount > 0 ? (
                  <span className="ml-2 text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                    {pendingCount} pending
                  </span>
                ) : null}
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${showRequests ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            {showRequests ? (
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                {requests.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-gray-500">You haven&apos;t requested any posts yet.</p>
                ) : (
                  requests.map((r) => (
                    <div key={r.id} className="px-4 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{r.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {r.type} · {r.submitted}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusStyles[r.status]}`}>
                        {r.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>
          ) : null}

          {/* Feed */}
          {!isMedia ? (
            feedLoading ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 text-center">
                <p className="text-sm text-gray-500">Loading…</p>
              </div>
            ) : feedError ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 text-center">
                <p className="text-sm text-red-600">{feedError}</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 text-center">
                <p className="text-sm font-semibold text-slate-600">Nothing to show</p>
                <p className="text-xs text-gray-400 mt-1">Try a different filter or search term.</p>
              </div>
            ) : (
              visible.map((item) => (
                <FeedCard
                  key={item.id}
                  item={item}
                  liked={likedIds.has(item.id)}
                  onLike={() => toggleLike(item)}
                  votedOptionId={item.kind === 'poll' ? votedOption[item.id] : undefined}
                  onVote={(optionId) => item.kind === 'poll' && castVote(item, optionId)}
                />
              ))
            )
          ) : null}
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      ) : null}

      {modalOpen ? <RequestModal onClose={() => setModalOpen(false)} onSubmit={submitRequest} /> : null}
      {uploadOpen ? <MediaUploadModal onClose={() => setUploadOpen(false)} onSubmit={submitUpload} /> : null}
    </div>
  );
}

/* ------------------------------ media card ------------------------------ */

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={`relative aspect-video bg-gradient-to-br ${item.gradient}`}>
        {item.kind === 'video' ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-11 h-11 rounded-full bg-white/85 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-900 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        ) : (
          <span className="absolute top-2 right-2 text-[11px] font-semibold bg-black/35 text-white rounded-full px-2 py-0.5">
            {item.count} photos
          </span>
        )}
        {item.kind === 'video' && item.duration ? (
          <span className="absolute bottom-2 right-2 text-[11px] font-semibold bg-black/55 text-white rounded px-1.5 py-0.5">
            {item.duration}
          </span>
        ) : null}
        {item.pending ? (
          <span className="absolute top-2 left-2 text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
            Pending review
          </span>
        ) : null}
      </div>
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {item.album}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 capitalize">
            {item.kind}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.avatar} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
          >
            {item.initials}
          </span>
          <span className="text-xs text-gray-500 truncate">
            {item.uploader} · {item.date}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ media upload modal ------------------------------ */

function MediaUploadModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (kind: MediaKind, title: string, album: string) => void;
}) {
  const [kind, setKind] = useState<MediaKind>('photo');
  const [title, setTitle] = useState('');
  const [album, setAlbum] = useState(mediaAlbums[0]);
  const [caption, setCaption] = useState('');
  const canSubmit = title.trim().length > 2;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Upload media</h2>
            <p className="text-xs text-gray-500 mt-0.5">The People Team reviews uploads before they appear in Media.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          <div>
            <label className={labelClass}>Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['photo', 'video'] as MediaKind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`px-2 py-2 text-sm font-semibold rounded-lg border capitalize transition-colors ${
                    kind === k
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-600">Drag &amp; drop {kind === 'photo' ? 'photos' : 'a video'} here</p>
            <p className="text-xs text-gray-400 mt-1">or</p>
            <button className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-700">Browse files</button>
            <p className="text-[11px] text-gray-400 mt-2">
              {kind === 'photo' ? 'JPG or PNG up to 10 MB each' : 'MP4 up to 500 MB'}
            </p>
          </div>

          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={kind === 'photo' ? 'e.g. Team lunch — March' : 'e.g. Onboarding walkthrough'}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Album</label>
            <select value={album} onChange={(e) => setAlbum(e.target.value)} className={fieldClass}>
              {mediaAlbums.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Caption (optional)</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add context for viewers or the reviewer."
              className={`${fieldClass} h-16 resize-none`}
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(kind, title.trim(), album)}
            disabled={!canSubmit}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Submit for review
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ feed card ------------------------------ */

function FeedCard({
  item,
  liked,
  onLike,
  votedOptionId,
  onVote,
}: {
  item: FeedItem;
  liked: boolean;
  onLike: () => void;
  votedOptionId: string | undefined;
  onVote: (optionId: string) => void;
}) {
  const meta = kindMeta[item.kind];
  const likable = item.kind === 'post' || item.kind === 'praise';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.avatar} flex items-center justify-center text-white text-xs font-bold shrink-0`}
        >
          {item.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-900">{item.author}</span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.chip}`}>
              {meta.icon}
              {meta.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
        </div>
      </div>

      <div className="mt-3">
        {item.kind === 'announcement' ? (
          <>
            <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{item.body}</p>
          </>
        ) : null}

        {item.kind === 'post' ? <p className="text-sm text-gray-700 leading-relaxed">{item.message}</p> : null}

        {item.kind === 'poll' ? <PollBody item={item} votedOptionId={votedOptionId} onVote={onVote} /> : null}

        {item.kind === 'praise' ? (
          <>
            <p className="text-sm text-slate-900">
              <span className="font-semibold">{item.author}</span> praised{' '}
              <span className="font-semibold">{item.recipient}</span>
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <span className="text-base leading-none">{item.badge}</span>
              <span className="text-xs font-semibold text-amber-800">{item.badgeLabel}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">{item.message}</p>
          </>
        ) : null}
      </div>

      {likable ? (
        <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              liked ? 'text-rose-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <HeartIcon filled={liked} />
            {item.likes}
          </button>
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <CommentIcon />
            {item.comments}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function PollBody({
  item,
  votedOptionId,
  onVote,
}: {
  item: PollItem;
  votedOptionId: string | undefined;
  onVote: (optionId: string) => void;
}) {
  const hasVoted = votedOptionId !== undefined || item.closed;
  const baseTotal = item.options.reduce((s, o) => s + o.votes, 0);

  return (
    <>
      <h3 className="text-base font-bold text-slate-900">{item.question}</h3>
      <div className="mt-3 space-y-2">
        {item.options.map((opt) => {
          const pct = baseTotal ? Math.round((opt.votes / baseTotal) * 100) : 0;
          if (!hasVoted) {
            return (
              <button
                key={opt.id}
                onClick={() => onVote(opt.id)}
                className="w-full text-left text-sm font-medium text-slate-700 border border-gray-200 rounded-lg px-3 py-2 hover:border-purple-400 hover:bg-purple-50/50 transition-colors"
              >
                {opt.label}
              </button>
            );
          }
          return (
            <div key={opt.id} className="relative border border-gray-200 rounded-lg px-3 py-2 overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${votedOptionId === opt.id ? 'bg-purple-100' : 'bg-gray-100'}`}
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center justify-between text-sm">
                <span className={`font-medium ${votedOptionId === opt.id ? 'text-purple-700' : 'text-slate-700'}`}>
                  {opt.label}
                  {votedOptionId === opt.id ? ' · your vote' : ''}
                </span>
                <span className="text-xs font-semibold text-slate-500">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {baseTotal} {baseTotal === 1 ? 'vote' : 'votes'} · {item.closesOn}
      </p>
    </>
  );
}

/* ------------------------------ request modal ------------------------------ */

const requestTypes = ['Announcement', 'Poll', 'Praise'] as const;
type RequestType = (typeof requestTypes)[number];

const praiseBadges = [
  '🌟 Above & Beyond',
  '🏆 Team Player',
  '🚀 Ship It',
  '💡 Bright Idea',
  '🤝 Great Collaborator',
  '🛟 Clutch Save',
];

const fieldClass =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400';
const labelClass = 'block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5';

function RequestModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (type: string, title: string) => void;
}) {
  const [type, setType] = useState<RequestType>('Announcement');
  const [audience, setAudience] = useState('Organization');
  const [reviewerNote, setReviewerNote] = useState('');

  // Announcement
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);

  // Poll
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [closesOn, setClosesOn] = useState('');
  const [multiChoice, setMultiChoice] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  // Praise
  const [recipient, setRecipient] = useState('');
  const [badge, setBadge] = useState(praiseBadges[0]);
  const [message, setMessage] = useState('');
  const [project, setProject] = useState('');

  const updateOption = (i: number, v: string) => setOptions((o) => o.map((x, idx) => (idx === i ? v : x)));
  const addOption = () => setOptions((o) => (o.length >= 6 ? o : [...o, '']));
  const removeOption = (i: number) => setOptions((o) => (o.length <= 2 ? o : o.filter((_, idx) => idx !== i)));

  const filledOptions = options.map((o) => o.trim()).filter(Boolean);

  const canSubmit =
    type === 'Announcement'
      ? title.trim().length > 3 && body.trim().length > 0
      : type === 'Poll'
        ? question.trim().length > 3 && filledOptions.length >= 2
        : recipient.trim().length > 0 && message.trim().length > 0;

  const derivedTitle =
    type === 'Announcement' ? title.trim() : type === 'Poll' ? question.trim() : `Praise for ${recipient.trim()}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-900">Request to post</h2>
            <p className="text-xs text-gray-500 mt-0.5">The People Team reviews and publishes approved requests.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className={labelClass}>Type</label>
            <div className="grid grid-cols-3 gap-2">
              {requestTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-2 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                    type === t
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className={fieldClass}>
              <option>Organization</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>People Team</option>
            </select>
          </div>

          {/* Announcement fields */}
          {type === 'Announcement' ? (
            <>
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Office closed for Diwali, Oct 29–31"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Announcement body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the full announcement as it should appear."
                  className={`${fieldClass} h-28 resize-none`}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Request this be pinned to the top
              </label>
            </>
          ) : null}

          {/* Poll fields */}
          {type === 'Poll' ? (
            <>
              <div>
                <label className={labelClass}>Poll question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Which week works best for the offsite?"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Options</label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className={fieldClass}
                      />
                      <button
                        onClick={() => removeOption(i)}
                        disabled={options.length <= 2}
                        className="px-2 text-gray-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-gray-400"
                        aria-label="Remove option"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {options.length < 6 ? (
                  <button onClick={addOption} className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-700">
                    + Add option
                  </button>
                ) : null}
              </div>
              <div>
                <label className={labelClass}>Closes on</label>
                <input type="date" value={closesOn} onChange={(e) => setClosesOn(e.target.value)} className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={multiChoice}
                    onChange={(e) => setMultiChoice(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Allow selecting multiple options
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Keep responses anonymous
                </label>
              </div>
            </>
          ) : null}

          {/* Praise fields */}
          {type === 'Praise' ? (
            <>
              <div>
                <label className={labelClass}>Who are you praising?</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Search a colleague or team"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Badge</label>
                <select value={badge} onChange={(e) => setBadge(e.target.value)} className={fieldClass}>
                  {praiseBadges.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What did they do that deserves recognition?"
                  className={`${fieldClass} h-24 resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Project (optional)</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. Payroll Revamp"
                  className={fieldClass}
                />
              </div>
            </>
          ) : null}

          <div>
            <label className={labelClass}>Note for the reviewer (optional)</label>
            <textarea
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Context, timing, or anything the People Team should know."
              className={`${fieldClass} h-16 resize-none`}
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5 sticky bottom-0 bg-white pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(type, derivedTitle)}
            disabled={!canSubmit}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Send for approval
          </button>
        </div>
      </div>
    </div>
  );
}
