'use client';

import { useEffect, useState } from 'react';
import { useRequireAccess } from '@/lib/auth/useRequireAccess';

const SearchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  work_email?: string;
  department_id?: string;
  designation_id?: string;
  location_id?: string;
  status: string;
}

interface NamedEntity {
  id: string;
  name: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  const body = await res.json();
  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.message || `Request to ${url} failed`);
  }
  return body.data as T;
}

function toNameMap(entities: NamedEntity[]): Record<string, string> {
  return Object.fromEntries(entities.map((e) => [e.id, e.name]));
}

export default function EmployeesPage() {
  // Organization-wide employee directory — requires org scope, not a
  // specific role, since a team-scoped Admin would only ever see their own
  // resolved set through the underlying API regardless.
  const { hasAccess, isLoading: permissionLoading } = useRequireAccess({ requireOrgScope: true });
  const [selectedTab, setSelectedTab] = useState('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Record<string, string>>({});
  const [designations, setDesignations] = useState<Record<string, string>>({});
  const [locations, setLocations] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (permissionLoading || !hasAccess) return;

    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [emps, depts, desigs, locs] = await Promise.all([
          fetchJson<Employee[]>('/api/employees'),
          fetchJson<NamedEntity[]>('/api/departments'),
          fetchJson<NamedEntity[]>('/api/designations'),
          fetchJson<NamedEntity[]>('/api/locations'),
        ]);
        if (cancelled) return;
        setEmployees(emps);
        setDepartments(toNameMap(depts));
        setDesignations(toNameMap(desigs));
        setLocations(toNameMap(locs));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load employees');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [permissionLoading, hasAccess]);

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const name = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    return (
      name.includes(term) ||
      emp.employee_code.toLowerCase().includes(term) ||
      (emp.work_email ?? '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">

      <div className="bg-white border-b border-gray-200 px-4 sm:px-8">
        <div className="flex gap-5">
          <button
            onClick={() => setSelectedTab('employees')}
            className={`px-1 py-3 border-b-2 font-semibold transition-colors ${
              selectedTab === 'employees' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setSelectedTab('documents')}
            className={`px-1 py-3 border-b-2 font-semibold transition-colors ${
              selectedTab === 'documents' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {selectedTab === 'employees' && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex-1 relative">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {isLoading && (
              <p className="text-gray-500 text-sm">Loading employees...</p>
            )}

            {error && !isLoading && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {!isLoading && !error && filteredEmployees.length === 0 && (
              <p className="text-gray-500 text-sm">No employees found.</p>
            )}

            {!isLoading && !error && filteredEmployees.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map(emp => (
                  <div key={emp.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{emp.first_name} {emp.last_name}</h3>
                    <p className="text-purple-600 text-sm font-semibold mb-3">
                      {emp.designation_id ? designations[emp.designation_id] ?? '—' : '—'}
                    </p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">{emp.department_id ? departments[emp.department_id] ?? '—' : '—'}</p>
                      <p className="text-gray-500">{emp.location_id ? locations[emp.location_id] ?? '—' : '—'}</p>
                      {emp.work_email && (
                        <p className="text-blue-600 hover:underline cursor-pointer">{emp.work_email}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedTab === 'documents' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Organization Documents</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-600 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">Organization Charter</p>
                    <p className="text-sm text-gray-600">Last updated: Aug 15, 2026</p>
                  </div>
                  <DownloadIcon />
                </a>
                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-600 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">Employee Handbook</p>
                    <p className="text-sm text-gray-600">Last updated: Jul 01, 2026</p>
                  </div>
                  <DownloadIcon />
                </a>
                <a href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-600 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">Policy Documents</p>
                    <p className="text-sm text-gray-600">Last updated: Jun 30, 2026</p>
                  </div>
                  <DownloadIcon />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
