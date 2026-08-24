'use client';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-20 flex flex-col items-center text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-600 max-w-sm">{description}</p>
    </div>
  );
}
