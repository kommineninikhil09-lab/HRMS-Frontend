'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MailIcon, ClockIcon, CheckCircleIcon, ArchiveIcon } from '@/components/icons';

type Category = 'review' | 'policy' | 'meeting' | 'expense' | 'system';
type Kind = 'action' | 'notification';

interface InboxItem {
  id: number;
  from: string;
  initials: string;
  avatarColor: string;
  title: string;
  preview: string;
  body: string;
  time: string;
  category: Category;
  kind: Kind;
}

const categoryStyles: Record<Category, string> = {
  review: 'bg-amber-100 text-amber-700',
  policy: 'bg-blue-100 text-blue-700',
  meeting: 'bg-emerald-100 text-emerald-700',
  expense: 'bg-violet-100 text-violet-700',
  system: 'bg-slate-100 text-slate-600',
};

const initialItems: InboxItem[] = [
  {
    id: 1,
    from: 'Sarah Jenkins',
    initials: 'SJ',
    avatarColor: 'from-rose-600 to-pink-600',
    title: 'Performance Review Scheduled',
    preview: 'Your Q3 performance review is scheduled for Aug 28 at 2:00 PM...',
    body: 'Your Q3 performance review is scheduled for Aug 28 at 2:00 PM with your reporting manager. Please come prepared with your self-assessment and any supporting documentation for the projects you led this quarter.',
    time: '2 hours ago',
    category: 'review',
    kind: 'action',
  },
  {
    id: 2,
    from: 'HR Department',
    initials: 'HR',
    avatarColor: 'from-blue-600 to-indigo-600',
    title: 'Updated Leave Policy — Acknowledge',
    preview: "We've updated our leave policy effective from next month...",
    body: "We've updated our leave policy effective from next month. Please review the revised policy document and acknowledge that you've read and understood the changes before the end of this week.",
    time: '5 hours ago',
    category: 'policy',
    kind: 'action',
  },
  {
    id: 3,
    from: 'Team Lead',
    initials: 'TL',
    avatarColor: 'from-emerald-600 to-teal-600',
    title: 'Project Kickoff Meeting — RSVP',
    preview: 'Joining us for the new client project kickoff tomorrow at 10 AM?...',
    body: 'Joining us for the new client project kickoff tomorrow at 10 AM? Please RSVP so we can finalize the meeting room booking and share the agenda in advance.',
    time: '1 day ago',
    category: 'meeting',
    kind: 'action',
  },
  {
    id: 4,
    from: 'HRMS',
    initials: 'HR',
    avatarColor: 'from-slate-600 to-slate-800',
    title: 'Welcome to HRMS',
    preview: 'Your HR Management System is ready to use.',
    body: 'Your HR Management System is ready to use. Explore your dashboard, apply for leave, check your payslips, and stay connected with your team all in one place.',
    time: 'Just now',
    category: 'system',
    kind: 'notification',
  },
  {
    id: 5,
    from: 'HRMS',
    initials: 'HR',
    avatarColor: 'from-slate-600 to-slate-800',
    title: 'Account Created',
    preview: 'Your account has been successfully set up.',
    body: 'Your account has been successfully set up. You can now sign in and access all the modules assigned to your role.',
    time: '2 hours ago',
    category: 'system',
    kind: 'notification',
  },
  {
    id: 6,
    from: 'Payroll',
    initials: 'PY',
    avatarColor: 'from-violet-600 to-purple-600',
    title: 'Payslip Generated',
    preview: 'Your August payslip is now available.',
    body: 'Your August payslip is now available under My Finances. Download it as a PDF or view the breakdown online.',
    time: '1 day ago',
    category: 'expense',
    kind: 'notification',
  },
];

const tabs = [
  { id: 'action', label: 'Take Action' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'archive', label: 'Archive' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function InboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabId) || 'action';

  const items = initialItems;
  const [archivedIds, setArchivedIds] = useState<number[]>([]);
  const [readIds, setReadIds] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const goToTab = (tab: TabId) => {
    router.push(`/inbox?tab=${tab}`);
    setSelectedId(null);
  };

  const visibleItems = items.filter((item) => {
    const isArchived = archivedIds.includes(item.id);
    if (activeTab === 'archive') return isArchived;
    if (isArchived) return false;
    return activeTab === 'action' ? item.kind === 'action' : item.kind === 'notification';
  });

  const selected = items.find((i) => i.id === selectedId) || null;

  const select = (id: number) => {
    setSelectedId(id);
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const archiveItem = (id: number) => {
    setArchivedIds((prev) => [...prev, id]);
    setSelectedId(null);
  };

  const restoreItem = (id: number) => {
    setArchivedIds((prev) => prev.filter((i) => i !== id));
    setSelectedId(null);
  };

  const takeActionCount = items.filter(
    (i) => i.kind === 'action' && !archivedIds.includes(i.id),
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter']">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goToTab(tab.id)}
                className={`relative py-4 text-xs font-semibold tracking-wide whitespace-nowrap transition-colors uppercase ${
                  active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {tab.id === 'action' ? ` (${takeActionCount})` : ''}
                {active ? (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-blue-600" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex h-[calc(100vh-49px)]">
        {/* List */}
        <div className="w-full sm:w-96 bg-white border-r border-slate-200 overflow-y-auto shrink-0">
          {visibleItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6">
              <MailIcon className="w-8 h-8 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Nothing here</p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === 'archive' ? 'Archived items will show up here.' : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {visibleItems.map((item) => {
                const unread = !readIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => select(item.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                      selectedId === item.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                      >
                        {item.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{item.from}</h3>
                          {unread ? <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" /> : null}
                        </div>
                        <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">{item.title}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.preview}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryStyles[item.category]}`}
                          >
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="hidden sm:flex flex-1 flex-col bg-white">
          {selected ? (
            <>
              <div className="border-b border-slate-200 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selected.title}</h2>
                    <p className="text-sm text-slate-500">
                      From: <span className="font-semibold text-slate-800">{selected.from}</span>
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-lg bg-gradient-to-br ${selected.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  >
                    {selected.initials}
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" /> {selected.time}
                  </span>
                  {readIds.includes(selected.id) ? (
                    <span className="text-sm text-emerald-600 flex items-center gap-1.5">
                      <CheckCircleIcon className="w-4 h-4" /> Read
                    </span>
                  ) : null}
                  {archivedIds.includes(selected.id) ? (
                    <span className="text-sm text-slate-500 flex items-center gap-1.5">
                      <ArchiveIcon className="w-4 h-4" /> Archived
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
                <p className="text-slate-700 leading-relaxed">{selected.body}</p>
              </div>

              <div className="border-t border-slate-200 p-6 sm:p-8 flex gap-3">
                {archivedIds.includes(selected.id) ? (
                  <button
                    onClick={() => restoreItem(selected.id)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Move back to Inbox
                  </button>
                ) : (
                  <>
                    {selected.kind === 'action' ? (
                      <button
                        onClick={() => archiveItem(selected.id)}
                        className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark as Done
                      </button>
                    ) : null}
                    <button
                      onClick={() => archiveItem(selected.id)}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <ArchiveIcon className="w-4 h-4" />
                      Archive
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MailIcon className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
