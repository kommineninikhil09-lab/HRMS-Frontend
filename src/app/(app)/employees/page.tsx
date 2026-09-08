'use client';

import { useState } from 'react';
import { usePermission } from '@/lib/auth/usePermission';

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

const employees = [
  { id: 1, name: 'Sarah Jenkins', email: 'sarah.jenkins@company.com', department: 'Design & UX', position: 'Senior Product Designer', location: 'New York HQ' },
  { id: 2, name: 'Marcus Kinsley', email: 'm.kinsley@company.com', department: 'Engineering', position: 'VP of Engineering', location: 'London' },
  { id: 3, name: 'David Chen', email: 'd.chen@company.com', department: 'Finance', position: 'Financial Analyst', location: 'New York HQ' },
];

export default function EmployeesPage() {
  // Organization-wide employee directory — Super Admin only.
  usePermission(['superadmin']);
  const [selectedTab, setSelectedTab] = useState('employees');

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
                <input type="text" placeholder="Search employees..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map(emp => (
                <div key={emp.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{emp.name}</h3>
                  <p className="text-purple-600 text-sm font-semibold mb-3">{emp.position}</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">{emp.department}</p>
                    <p className="text-gray-500">{emp.location}</p>
                    <p className="text-blue-600 hover:underline cursor-pointer">{emp.email}</p>
                  </div>
                </div>
              ))}
            </div>
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
