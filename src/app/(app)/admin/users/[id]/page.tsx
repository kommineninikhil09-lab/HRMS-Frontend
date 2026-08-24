'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import RoleAssignmentModal from './components/RoleAssignmentModal';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: Array<{ id: string; name: string }>;
  permissions: string[];
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [paramId, setParamId] = useState<string | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      setParamId(id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (paramId) {
      fetchUser();
    }
  }, [paramId]);

  const fetchUser = async () => {
    if (!paramId) return;
    try {
      const response = await fetch(`/api/admin/users/${paramId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUser(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAdded = (role: { id: string; name: string }) => {
    if (user) {
      setUser({
        ...user,
        roles: [...user.roles, role],
      });
    }
  };

  const handleRoleRemoved = (roleId: string) => {
    if (user) {
      setUser({
        ...user,
        roles: user.roles.filter(r => r.id !== roleId),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Lato'] p-8">
        <div className="text-center text-red-600">{error || 'User not found'}</div>
        <div className="text-center mt-4">
          <Link href="/admin/users" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-base text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">User Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">First Name</p>
                    <p className="text-gray-900 font-medium mt-1">{user.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Last Name</p>
                    <p className="text-gray-900 font-medium mt-1">{user.lastName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-gray-900 font-medium mt-1">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Roles Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Assigned Roles</h2>
              {user.roles.length === 0 ? (
                <p className="text-gray-600">No roles assigned</p>
              ) : (
                <div className="space-y-2">
                  {user.roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      <span className="font-medium text-gray-900">{role.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Permissions Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Permissions</h2>
              {user.permissions.length === 0 ? (
                <p className="text-gray-600">No permissions assigned</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                  Edit User
                </button>
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  Manage Roles
                </button>
                <button className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                  Deactivate User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoleAssignmentModal
        userId={paramId || ''}
        assignedRoles={user?.roles || []}
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleAdded={handleRoleAdded}
        onRoleRemoved={handleRoleRemoved}
      />
    </div>
  );
}
