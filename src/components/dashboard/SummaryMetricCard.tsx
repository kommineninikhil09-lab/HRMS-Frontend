'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface SummaryMetricCardProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  primaryValue: string;
  secondaryValue: string;
  secondaryValueColor?: string;
  actionLabel: string;
  href: string;
}

export function SummaryMetricCard({
  title,
  icon,
  iconBg,
  iconColor,
  primaryValue,
  secondaryValue,
  secondaryValueColor = 'text-slate-500',
  actionLabel,
  href,
}: SummaryMetricCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="group text-left bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-md transition-all p-4 sm:p-5 shrink-0 w-[190px] sm:w-auto"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{primaryValue}</div>
        <div className={`text-xs mt-1 ${secondaryValueColor}`}>{secondaryValue}</div>
        <div className="text-xs font-medium text-indigo-600 mt-1.5">{actionLabel} &rarr;</div>
      </div>
    </button>
  );
}
