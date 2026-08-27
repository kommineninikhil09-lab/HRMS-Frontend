'use client';

import { EmptyState } from '@/components/EmptyState';
import { GraduationCapIcon } from '@/components/icons';

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <div className="p-4 sm:p-8">
        <EmptyState
          icon={<GraduationCapIcon className="w-7 h-7" />}
          title="Learning catalog is on its way"
          description="Course assignments, certifications, and progress tracking will show up here once the Learning module is enabled for your organization."
        />
      </div>
    </div>
  );
}
