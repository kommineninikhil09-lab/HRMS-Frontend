'use client';

import { SummaryMetricCard } from './SummaryMetricCard';
import { ClockIcon, CalendarIcon, ClipboardCheckIcon, WalletIcon } from '@/components/icons';

interface DashboardSummaryProps {
  clockedInAt: string;
  workingSince: string;
}

export function DashboardSummary({ clockedInAt, workingSince }: DashboardSummaryProps) {
  const cards = [
    {
      title: 'Clocked In',
      icon: <ClockIcon className="w-4 h-4" />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      primaryValue: clockedInAt,
      secondaryValue: workingSince,
      secondaryValueColor: 'text-green-600 font-medium',
      actionLabel: 'View attendance',
      href: '/me/attendance',
    },
    {
      title: 'Leave Balance',
      icon: <CalendarIcon className="w-4 h-4" />,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      primaryValue: '18.5',
      secondaryValue: 'Days available',
      actionLabel: 'View details',
      href: '/me/leaves',
    },
    {
      title: 'Pending Actions',
      icon: <ClipboardCheckIcon className="w-4 h-4" />,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      primaryValue: '3',
      secondaryValue: 'Requests awaiting action',
      actionLabel: 'View all',
      href: '/inbox',
    },
    {
      title: 'Next Payroll',
      icon: <WalletIcon className="w-4 h-4" />,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      primaryValue: '₹45,000',
      secondaryValue: 'Payday: 30 Aug 2026',
      actionLabel: 'View payroll',
      href: '/payslips',
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
      {cards.map((card) => (
        <SummaryMetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}
