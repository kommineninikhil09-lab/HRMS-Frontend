'use client';

import { SunCloudIcon, MapPinIcon } from '@/components/icons';

interface DashboardHeaderProps {
  firstName: string;
}

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardHeader({ firstName }: DashboardHeaderProps) {
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const dateLabel = now.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-slate-900 leading-tight">
          {greeting}, {firstName}! <span aria-hidden>👋</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s what&apos;s happening with you and your organization today.
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-600 shrink-0">
        <div className="text-right">
          <div className="font-semibold text-slate-900">{dateLabel}</div>
          <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
            <MapPinIcon className="w-3.5 h-3.5" />
            Bengaluru, India
          </div>
        </div>
        <div className="flex items-center gap-1.5 pl-4 border-l border-slate-200 text-slate-700">
          <SunCloudIcon className="w-6 h-6 text-amber-500" />
          <span className="font-semibold">28°C</span>
        </div>
      </div>
    </div>
  );
}
