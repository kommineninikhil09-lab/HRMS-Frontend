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
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 px-5 py-5 sm:px-8 sm:py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-bold text-white leading-tight">
          {greeting}, {firstName}! <span aria-hidden>👋</span>
        </h1>
        <p className="text-sm text-indigo-200/80 mt-1">
          Here&apos;s what&apos;s happening with you and your organization today.
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm text-indigo-100 shrink-0">
        <div className="text-right">
          <div className="font-semibold text-white">{dateLabel}</div>
          <div className="flex items-center justify-end gap-1 text-xs text-indigo-200/80">
            <MapPinIcon className="w-3.5 h-3.5" />
            Bengaluru, India
          </div>
        </div>
        <div className="flex items-center gap-1.5 pl-4 border-l border-white/10 text-indigo-100">
          <SunCloudIcon className="w-6 h-6 text-amber-400" />
          <span className="font-semibold">28°C</span>
        </div>
      </div>
    </div>
  );
}
