'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const modules = [
    {
      title: 'Users Management',
      description: 'Create, edit, and manage user accounts',
      href: '/admin/users',
      comingSoon: false,
    },
    {
      title: 'Roles & Permissions',
      description: 'Manage roles and assign permissions',
      href: '/admin/roles',
      comingSoon: true,
    },
    {
      title: 'Organization',
      description: 'Manage departments, teams, and locations',
      href: '/admin/organization',
      comingSoon: true,
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and changes',
      href: '/admin/audit-logs',
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-base text-gray-600">Manage your organization's system settings</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-semibold text-gray-600 uppercase">Total Users</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">12</div>
          <div className="text-xs text-gray-500 mt-1">Active users</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-semibold text-gray-600 uppercase">Super Admins</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">2</div>
          <div className="text-xs text-gray-500 mt-1">System admins</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-semibold text-gray-600 uppercase">Total Roles</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">5</div>
          <div className="text-xs text-gray-500 mt-1">Active roles</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-semibold text-gray-600 uppercase">Pending Actions</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
          <div className="text-xs text-gray-500 mt-1">No pending</div>
        </div>
      </div>

      {/* Admin Modules */}
      <div className="px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <Link
              key={module.href}
              href={module.comingSoon ? '#' : module.href}
              className={`block p-6 rounded-lg border-2 ${
                module.comingSoon
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                  : 'border-indigo-200 bg-white hover:border-indigo-500 hover:shadow-lg transition-all'
              }`}
            >
              <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{module.description}</p>
              {module.comingSoon && (
                <div className="text-xs font-semibold text-gray-500 mt-4 uppercase">Coming Soon</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
