'use client';

import { useState, useEffect } from 'react';

interface Role {
  id: string;
  name: string;
}

interface RoleAssignmentModalProps {
  userId: string;
  assignedRoles: Role[];
  isOpen: boolean;
  onClose: () => void;
  onRoleAdded: (role: Role) => void;
  onRoleRemoved: (roleId: string) => void;
}

export default function RoleAssignmentModal({
  userId,
  assignedRoles,
  isOpen,
  onClose,
  onRoleAdded,
  onRoleRemoved,
}: RoleAssignmentModalProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assigning, setAssigning] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableRoles();
    }
  }, [isOpen]);

  const fetchAvailableRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      const data = await response.json();
      setAvailableRoles(data.roles || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (roleId: string) => {
    setAssigning(roleId);
    setError('');
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to assign role');
      }

      const data = await response.json();
      const role = availableRoles.find(r => r.id === roleId);
      if (role) {
        onRoleAdded(role);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigning(null);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    setRemoving(roleId);
    setError('');
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles/${roleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove role');
      }

      onRoleRemoved(roleId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRemoving(null);
    }
  };

  if (!isOpen) return null;

  const assignedRoleIds = new Set(assignedRoles.map(r => r.id));
  const unassignedRoles = availableRoles.filter(r => !assignedRoleIds.has(r.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Manage Roles</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Loading roles...</div>
        ) : (
          <div className="space-y-4">
            {/* Assigned Roles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Assigned Roles</h3>
              {assignedRoles.length === 0 ? (
                <p className="text-sm text-gray-500">No roles assigned</p>
              ) : (
                <div className="space-y-2">
                  {assignedRoles.map(role => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200"
                    >
                      <span className="font-medium text-gray-900">{role.name}</span>
                      <button
                        onClick={() => handleRemoveRole(role.id)}
                        disabled={removing === role.id}
                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 font-medium"
                      >
                        {removing === role.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Roles */}
            {unassignedRoles.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Roles</h3>
                <div className="space-y-2">
                  {unassignedRoles.map(role => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <span className="font-medium text-gray-900">{role.name}</span>
                      <button
                        onClick={() => handleAssignRole(role.id)}
                        disabled={assigning === role.id}
                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 disabled:opacity-50 font-medium"
                      >
                        {assigning === role.id ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
