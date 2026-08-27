'use client';

import { useAuth } from '@/lib/auth/useAuth';
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
  const { user } = useAuth();

  return (
    <div className="bg-slate-50 font-['Inter'] p-4 sm:p-8 space-y-6">
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
  );
}
