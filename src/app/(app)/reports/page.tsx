'use client';

import { usePermission } from '@/lib/auth/usePermission';
import { EmptyState } from '@/components/EmptyState';
import { BarChartIcon } from '@/components/icons';

export default function ReportsPage() {
  usePermission(['manager', 'admin']);

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-base text-gray-600">Headcount, attendance, leave, and payroll analytics</p>
      </div>
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={<BarChartIcon className="w-7 h-7" />}
          title="Reports are on their way"
          description="Organization-wide analytics and exportable reports will show up here once the Reports module is enabled."
        />
      </div>
    </div>
  );
}
