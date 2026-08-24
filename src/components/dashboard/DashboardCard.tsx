'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface DashboardCardProps {
  title?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

export function DashboardCard({
  title,
  icon,
  actionLabel,
  actionHref,
  className = '',
  bodyClassName = '',
  children,
}: DashboardCardProps) {
  const router = useRouter();

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)] transition-shadow ${className}`}
    >
      {title ? (
        <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-3">
          <h3 className="min-w-0 truncate text-sm font-semibold text-slate-900 flex items-center gap-2">
            {icon ? <span className="text-slate-500 shrink-0">{icon}</span> : null}
            <span className="truncate">{title}</span>
          </h3>
          {actionLabel && actionHref ? (
            <button
              onClick={() => router.push(actionHref)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              {actionLabel}
              <span aria-hidden>&rarr;</span>
            </button>
          ) : null}
        </div>
      ) : null}
      <div className={`px-5 pb-5 ${title ? '' : 'p-5'} ${bodyClassName}`}>{children}</div>
    </div>
  );
}
