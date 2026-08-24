'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { SearchIcon, BellIcon, HelpIcon, SettingsIcon } from '@/components/icons';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TimesheetOverview } from '@/components/dashboard/TimesheetOverview';
import { AnnouncementsWidget } from '@/components/dashboard/AnnouncementsWidget';
import { CompanyPostsWidget } from '@/components/dashboard/CompanyPostsWidget';
import { UpcomingEventsWidget } from '@/components/dashboard/UpcomingEventsWidget';
import { CelebrationsWidget } from '@/components/dashboard/CelebrationsWidget';
import { OnLeaveTodayWidget } from '@/components/dashboard/OnLeaveTodayWidget';
import { HolidaysWidget } from '@/components/dashboard/HolidaysWidget';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-slate-50 font-['Lato']">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between bg-white shadow-sm gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for people, documents, policies and more..."
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hidden sm:flex items-center gap-1">
                <SearchIcon className="w-4 h-4" />
                <kbd className="text-[10px] font-semibold border border-slate-200 rounded px-1 py-0.5">⌘K</kbd>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => router.push('/notifications')}
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/help')}
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Help"
            >
              <HelpIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <div className="pl-2 sm:pl-4 border-l border-slate-200">
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50">
          <div className="p-4 sm:p-8 space-y-6">
            <DashboardHeader firstName={user?.firstName || 'there'} />

            <DashboardSummary clockedInAt="09:02 AM" workingSince="Working since 1h 15m" />

            {/*
              At `xl`, the left group (Quick Actions/Timesheet, Holidays stacked, col-8) and
              Announcements (col-4) share a row — grid's default `align-items: stretch` makes
              Announcements match the left group's full height, so their bottoms land on the same
              line. The next row pairs Company Posts (col-7) with a right group (col-5, self-start)
              containing Celebrations/On Leave followed by Upcoming Events, stacked. Below `xl`,
              `contents` on both groups unbundles them so every widget stacks individually in
              natural reading order.
            */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="contents xl:flex xl:flex-col xl:gap-5 xl:col-span-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <QuickActions />
                  <TimesheetOverview />
                </div>
                <HolidaysWidget />
              </div>

              <div className="xl:col-span-4">
                <AnnouncementsWidget />
              </div>

              <div className="xl:col-span-7">
                <CompanyPostsWidget />
              </div>

              <div className="contents xl:flex xl:flex-col xl:gap-4 xl:col-span-5 xl:self-start">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CelebrationsWidget />
                  <OnLeaveTodayWidget />
                </div>
                <UpcomingEventsWidget />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
