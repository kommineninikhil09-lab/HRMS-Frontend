'use client';

import { useRouter } from 'next/navigation';
import { DashboardCard } from './DashboardCard';
import {
  CalendarIcon,
  ReceiptIcon,
  HomeIcon,
  FileTextIcon,
  TimerIcon,
  ClockIcon,
  TeamIcon,
  MessageCircleIcon,
} from '@/components/icons';

const actions = [
  { id: 'apply_leave', label: 'Apply Leave', icon: CalendarIcon, href: '/leave/apply' },
  { id: 'log_expense', label: 'Log Expense', icon: ReceiptIcon, href: '/me/expenses' },
  { id: 'request_wfh', label: 'Request WFH', icon: HomeIcon, href: '/attendance/wfh' },
  { id: 'view_payslip', label: 'View Payslip', icon: FileTextIcon, href: '/payslips' },
  { id: 'timesheet', label: 'Timesheet', icon: TimerIcon, href: '/timesheet' },
  { id: 'regularize_attendance', label: 'Regularize Attendance', icon: ClockIcon, href: '/attendance/regularize' },
  { id: 'team_directory', label: 'Team Directory', icon: TeamIcon, href: '/team' },
  { id: 'ask_hr', label: 'Ask HR', icon: MessageCircleIcon, href: '/inbox' },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <DashboardCard title="Quick Actions">
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              title={action.label}
              className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </DashboardCard>
  );
}
