'use client';

import { EmptyState } from '@/components/EmptyState';
import { CompassIcon } from '@/components/icons';

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Career</h1>
        <p className="text-base text-gray-600">Growth plans, internal mobility, and career conversations</p>
      </div>
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
