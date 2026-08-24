'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LeavesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('summary');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'apply') {
      setIsModalOpen(true);
    }
  }, [searchParams]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [note, setNote] = useState('');
  const [notifyEmployee, setNotifyEmployee] = useState('');

  const leaveBalance = [
    { type: 'Casual Leave', total: 10, used: 2, available: 8, color: 'bg-blue-100 text-blue-800' },
    { type: 'Sick Leave', total: 10, used: 1, available: 9, color: 'bg-red-100 text-red-800' },
    { type: 'Paid Leave', total: 20, used: 5, available: 15, color: 'bg-green-100 text-green-800' },
    { type: 'Maternity Leave', total: 90, used: 0, available: 90, color: 'bg-pink-100 text-pink-800' },
  ];

  const leaveHistory = [
    { id: 1, type: 'Casual Leave', from: '2026-08-06', to: '2026-08-06', days: 1, status: 'Approved', appliedOn: '2026-08-01' },
    { id: 2, type: 'Paid Leave', from: '2026-07-15', to: '2026-07-17', days: 3, status: 'Approved', appliedOn: '2026-07-08' },
    { id: 3, type: 'Sick Leave', from: '2026-07-22', to: '2026-07-22', days: 1, status: 'Approved', appliedOn: '2026-07-22' },
    { id: 4, type: 'Casual Leave', from: '2026-06-25', to: '2026-06-26', days: 2, status: 'Rejected', appliedOn: '2026-06-20', reason: 'Insufficient project resources' },
  ];

  const calculateDays = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestLeave = () => {
    console.log({
      fromDate,
      toDate,
      leaveType,
      note,
      notifyEmployee,
      days: calculateDays(),
    });
    setIsModalOpen(false);
    setFromDate('');
    setToDate('');
    setLeaveType('');
    setNote('');
    setNotifyEmployee('');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Leave Management</h1>
              <p className="text-base text-gray-600">View your leave balance and history</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            + Request Leave
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setSelectedTab('summary')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'summary' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Leave Summary
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Leave History
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {/* SUMMARY TAB */}
        {selectedTab === 'summary' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Leave Balance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {leaveBalance.map((leave, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">{leave.type}</h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
                        <span>Used</span>
                        <span>{leave.used}/{leave.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(leave.used / leave.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Used</p>
                        <p className="text-lg font-bold text-red-600">{leave.used}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Available</p>
                        <p className="text-lg font-bold text-green-600">{leave.available}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Year to Date Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Year to Date Summary</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Days Taken</p>
                  <p className="text-3xl font-bold text-indigo-600">8</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Days Available</p>
                  <p className="text-3xl font-bold text-green-600">172</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Leaves on Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">1</p>
                </div>
              </div>
            </div>

            {/* Request Credit for Compensatory Off */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Request Credit for Compensatory Off</h3>
                  <p className="text-sm text-gray-600 mt-1">Request additional compensatory off credits</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Request
                </button>
              </div>
            </div>

            {/* Leave Policy Explanation */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Policy Explanation</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Casual Leave</p>
                    <p className="text-sm text-gray-600">10 days per financial year for personal and urgent work</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sick Leave</p>
                    <p className="text-sm text-gray-600">10 days per financial year for health-related issues</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Paid Leave</p>
                    <p className="text-sm text-gray-600">20 days per financial year for vacation and rest</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {selectedTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Leave History</h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Leave Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">From Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">To Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Days</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Applied On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaveHistory.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{leave.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(leave.from).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(leave.to).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{leave.days}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(leave.status)}`}>
                            {leave.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(leave.appliedOn).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Request Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Request Leave</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Date Range */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                    {calculateDays()} days
                  </span>
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select type of leave you want to apply</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select</option>
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="paid">Paid Leave</option>
                  <option value="maternity">Maternity Leave</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type here"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Notify */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notify</label>
                <input
                  type="text"
                  value={notifyEmployee}
                  onChange={(e) => setNotifyEmployee(e.target.value)}
                  placeholder="Search employee"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestLeave}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
