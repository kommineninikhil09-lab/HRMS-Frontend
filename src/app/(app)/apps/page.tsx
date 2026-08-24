'use client';

import { useRouter } from 'next/navigation';
import {
  PersonIcon,
  CalendarCheckIcon,
  CalendarIcon,
  BriefcaseIcon,
  WalletIcon,
  TrendingUpIcon,
  TimerIcon,
  TeamIcon,
  MessageCircleIcon,
  GraduationCapIcon,
  CompassIcon,
} from '@/components/icons';

const apps = [
  { label: 'Me', description: 'Your personal hub', icon: PersonIcon, href: '/me', color: 'from-blue-500 to-blue-600' },
  { label: 'Attendance', description: 'Logs & regularization', icon: CalendarCheckIcon, href: '/me/attendance', color: 'from-emerald-500 to-teal-600' },
  { label: 'Leave', description: 'Balance & requests', icon: CalendarIcon, href: '/me/leaves', color: 'from-indigo-500 to-indigo-600' },
  { label: 'Expenses & Travel', description: 'Claims & travel requests', icon: BriefcaseIcon, href: '/me/expenses', color: 'from-amber-500 to-orange-600' },
  { label: 'My Finances', description: 'Payslips & payroll', icon: WalletIcon, href: '/payslips', color: 'from-violet-500 to-purple-600' },
  { label: 'Performance', description: 'Reviews & goals', icon: TrendingUpIcon, href: '/me/performance', color: 'from-green-500 to-emerald-600' },
  { label: 'Timesheet', description: 'Logged hours', icon: TimerIcon, href: '/timesheet', color: 'from-sky-500 to-blue-600' },
  { label: 'My Team', description: 'Directory & org chart', icon: TeamIcon, href: '/team', color: 'from-rose-500 to-pink-600' },
  { label: 'Engage', description: 'Posts, polls & praise', icon: MessageCircleIcon, href: '/engage', color: 'from-fuchsia-500 to-purple-600' },
  { label: 'Learning', description: 'Courses & certifications', icon: GraduationCapIcon, href: '/learning', color: 'from-cyan-500 to-teal-600' },
  { label: 'Career', description: 'Growth & mobility', icon: CompassIcon, href: '/career', color: 'from-slate-500 to-slate-700' },
];

export default function AppsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Apps</h1>
        <p className="text-base text-gray-600">Every module in your HRMS portal, in one place</p>
      </div>
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.label}
                onClick={() => router.push(app.href)}
                className="text-left bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white mb-4`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{app.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{app.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
