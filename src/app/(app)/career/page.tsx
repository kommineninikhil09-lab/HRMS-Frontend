'use client';

import { EmptyState } from '@/components/EmptyState';
import { CompassIcon } from '@/components/icons';

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={<CompassIcon className="w-7 h-7" />}
          title="Career planning is on its way"
          description="Growth plans, internal job postings, and mentorship connections will show up here once the Career module is enabled for your organization."
        />
      </div>
    </div>
  );
}
