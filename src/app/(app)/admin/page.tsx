'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const adminModules = [
    {
      title: 'Users Management',
      description: 'Create, edit, and manage user accounts',
      icon: '👥',
      href: '/admin/users',
      color: 'bg-blue-100',
    },
    {
      title: 'Roles & Permissions',
      description: 'Manage roles and assign permissions',
      icon: '🔑',
      href: '/admin/roles',
      color: 'bg-purple-100',
      disabled: true,
    },
    {
      title: 'Organization',
      description: 'Manage departments, teams, and locations',
      icon: '🏢',
      href: '/admin/organization',
      color: 'bg-green-100',
      disabled: true,
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and changes',
      icon: '📋',
      href: '/admin/audit',
      color: 'bg-orange-100',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-base text-gray-600">Manage your organization's system settings</p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Users</p>
            <p className="text-3xl font-bold text-indigo-600">12</p>
            <p className="text-xs text-gray-600 mt-2">Active users</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Super Admins</p>
            <p className="text-3xl font-bold text-purple-600">2</p>
            <p className="text-xs text-gray-600 mt-2">System admins</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Roles</p>
            <p className="text-3xl font-bold text-green-600">5</p>
            <p className="text-xs text-gray-600 mt-2">Active roles</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pending Actions</p>
            <p className="text-3xl font-bold text-orange-600">0</p>
            <p className="text-xs text-gray-600 mt-2">No pending</p>
          </div>
        </div>

        {/* Admin Modules */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminModules.map((module) => (
              <div
                key={module.href}
                onClick={() => !module.disabled && router.push(module.href)}
                className={`rounded-xl border border-gray-200 p-6 shadow-sm transition-all ${
                  module.disabled
                    ? 'cursor-not-allowed opacity-50 bg-gray-50'
                    : 'bg-white cursor-pointer hover:shadow-md hover:border-indigo-300'
                }`}
              >
                <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {module.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                {module.disabled && (
                  <span className="text-xs font-medium text-gray-500">Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
