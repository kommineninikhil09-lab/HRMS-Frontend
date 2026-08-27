'use client';

import { useRouter } from 'next/navigation';

const AttendanceIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.3-1.54c-.2-.24-.58-.27-.81-.08-.24.2-.27.57-.08.81l1.98 2.36c.12.15.3.23.48.23.17 0 .35-.08.47-.23l3.53-4.36c.21-.26.16-.64-.1-.85-.26-.21-.64-.16-.84.1z" />
  </svg>
);

const LeaveIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.92 7.02C17.45 4.18 14.97 2 12 2c-2.97 0-5.45 2.18-5.92 5.02C5.5 7.12 4 8.75 4 10.5 4 12.46 5.54 14 7.5 14h10c1.93 0 3.5-1.54 3.5-3.5 0-2.31-1.8-4.21-4.08-4.48zM19 13h-9v3h9v-3z" />
  </svg>
);

const PerformanceIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z" />
  </svg>
);

const ExpenseIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

export default function MePage() {
  const router = useRouter();

  const sections = [
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'View your attendance logs and records',
      icon: AttendanceIcon,
      path: '/me/attendance',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'leaves',
      title: 'Leaves',
      description: 'Check your leave balance and history',
      icon: LeaveIcon,
      path: '/me/leaves',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Review your performance metrics and feedback',
      icon: PerformanceIcon,
      path: '/me/performance',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'expenses',
      title: 'Expenses & Travel',
      description: 'Manage expenses and travel requests',
      icon: ExpenseIcon,
      path: '/me/expenses',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}

      {/* Navigation Cards */}
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => router.push(section.path)}
                className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all hover:border-gray-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 text-left">{section.title}</h3>
                <p className="text-sm text-gray-600 mb-4 text-left">{section.description}</p>
                <div className="text-indigo-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
