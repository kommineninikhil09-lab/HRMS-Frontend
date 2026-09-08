'use client';

import { usePermission } from '@/lib/auth/usePermission';
import { EmptyState } from '@/components/EmptyState';
import { BarChartIcon } from '@/components/icons';

export default function ReportsPage() {
  usePermission(['admin', 'superadmin']);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
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
