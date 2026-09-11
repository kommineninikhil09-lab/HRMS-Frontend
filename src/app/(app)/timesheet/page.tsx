'use client';

import { EmptyState } from '@/components/EmptyState';
import { TimerIcon } from '@/components/icons';

export default function TimesheetPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={<TimerIcon className="w-7 h-7" />}
          title="Timesheet is coming in v1.1"
          description="Logging hours against projects and categories, and reviewing your weekly totals, will show up here once the Timesheet module ships."
        />
      </div>
    </div>
  );
}
