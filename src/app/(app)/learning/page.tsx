'use client';

import { EmptyState } from '@/components/EmptyState';
import { GraduationCapIcon } from '@/components/icons';

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Learning</h1>
        <p className="text-base text-gray-600">Courses, certifications, and skill-building resources</p>
      </div>
      <div className="p-8">
        <EmptyState
          icon={<GraduationCapIcon className="w-7 h-7" />}
          title="Learning catalog is on its way"
          description="Course assignments, certifications, and progress tracking will show up here once the Learning module is enabled for your organization."
        />
      </div>
    </div>
  );
}
