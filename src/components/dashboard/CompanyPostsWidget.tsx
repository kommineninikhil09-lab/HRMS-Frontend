'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardCard } from './DashboardCard';
import { VoteIcon } from '@/components/icons';

interface Post {
  id: number;
  author: string;
  role: string;
  initials: string;
  avatarColor: string;
  time: string;
  title: string;
  text: string;
  likes: number;
  comments: number;
  views: number;
}

const posts: Post[] = [
  {
    id: 1,
    author: 'HR Department',
    role: 'Admin',
    initials: 'HR',
    avatarColor: 'from-blue-600 to-indigo-600',
    time: '2 hours ago',
    title: 'Celebrating Excellence!',
    text: 'Huge congratulations to the team for successfully launching Project Phoenix! Your hard work and dedication have made this possible.',
    likes: 34,
    comments: 8,
    views: 156,
  },
  {
    id: 2,
    author: 'IT Support',
    role: 'Admin',
    initials: 'IT',
    avatarColor: 'from-slate-600 to-slate-800',
    time: '5 hours ago',
    title: 'Scheduled Maintenance',
    text: 'Scheduled maintenance for the internal network will take place this Saturday from 12:00 AM to 04:00 AM. Expect intermittent connectivity issues.',
    likes: 12,
    comments: 3,
    views: 89,
  },
];

const following: Post[] = [
  {
    id: 3,
    author: 'Sarah Jenkins',
    role: 'Senior Product Designer',
    initials: 'SJ',
    avatarColor: 'from-rose-600 to-pink-600',
    time: '1 day ago',
    title: 'New design system components are live',
    text: 'Check out the refreshed component library — spacing, color tokens, and states are all documented in Figma.',
    likes: 21,
    comments: 4,
    views: 67,
  },
];

export function CompanyPostsWidget() {
  const router = useRouter();
  const [tab, setTab] = useState<'posts' | 'following'>('posts');
  const [content, setContent] = useState('');
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const feed = tab === 'posts' ? posts : following;

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const handlePost = () => {
    if (!content.trim()) return;
    setContent('');
  };

  return (
    <DashboardCard title="Company Posts" actionLabel="View more posts" actionHref="/engage">
      <div className="flex gap-6 mb-4 -mt-1 border-b border-slate-100">
        {(['posts', 'following'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-semibold pb-2.5 border-b-2 transition-colors capitalize ${
              tab === t ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="border border-slate-200 rounded-lg p-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            ME
          </div>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update with your organization..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
          />
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
          <div className="flex items-center gap-4 text-slate-400">
            <button title="Text" className="hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 4v3h5.5v12h3V7H19V4z" />
              </svg>
            </button>
            <button title="Image" className="hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </button>
            <button title="Video" className="hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </button>
            <button title="Link" className="hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
              </svg>
            </button>
            <button
              title="Poll"
              onClick={() => router.push('/engage?tab=poll')}
              className="hover:text-blue-600 transition-colors"
            >
              <VoteIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handlePost}
            disabled={!content.trim()}
            className="px-4 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {feed.map((post, idx) => (
          <div key={post.id} className={idx > 0 ? 'pt-4 border-t border-slate-100' : ''}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${post.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                >
                  {post.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{post.author}</span>
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                      {post.role}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{post.time}</span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 px-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8a2 2 0 100-4 2 2 0 000 4zm0 2a2 2 0 100 4 2 2 0 000-4zm0 6a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-900 mb-1">{post.title}</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2.5">{post.text}</p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">👍 {post.likes}</span>
                <span className="flex items-center gap-1">💬 {post.comments}</span>
                <span className="flex items-center gap-1">👁 {post.views}</span>
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
        ))}
        {feed.length === 0 ? <p className="text-sm text-slate-400 text-center py-6">Nothing to show yet.</p> : null}
      </div>
    </DashboardCard>
  );
}
