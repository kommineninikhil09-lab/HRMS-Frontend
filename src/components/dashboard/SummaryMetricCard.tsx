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
      className="text-left bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_6px_18px_rgba(15,23,42,0.08)] transition-shadow p-3 shrink-0 w-[190px] sm:w-auto"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">{title}</span>
      </div>
      <div className="text-xl font-bold text-slate-900 leading-tight">{primaryValue}</div>
      <div className={`text-xs mt-1 ${secondaryValueColor}`}>{secondaryValue}</div>
      <div className="text-xs font-medium text-blue-600 mt-1.5">{actionLabel} &rarr;</div>
    </button>
  );
}
