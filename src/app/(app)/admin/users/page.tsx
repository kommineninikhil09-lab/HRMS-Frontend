'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  roles: Array<{ id: string; name: string }>;
  createdAt: string;
}

interface ListUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export default function UsersManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: ListUsersResponse = await response.json();
      setUsers(data.data.users);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = (newUser: User) => {
    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Users Management</h1>
            <p className="text-base text-gray-600">Manage all users in your organization</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            + Create User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">All Roles</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Super Admin">Super Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-8">
        {loading ? (
          <div className="text-center text-gray-600">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-600 py-12">No users found</div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.map((role) => (
                              <span
                                key={role.id}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                              >
                                {role.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
              </div>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPagination({ ...pagination, page: pageNum })}
                        className={`px-3 py-2 rounded-lg ${
                          pagination.page === pageNum
                            ? 'bg-indigo-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateUser}
        />
      )}
    </div>
  );
}

/**
 * Create User Modal Component
 */
function CreateUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (user: User) => void;
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create user');
      }

      const data = await response.json();
      onSuccess(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="user@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
