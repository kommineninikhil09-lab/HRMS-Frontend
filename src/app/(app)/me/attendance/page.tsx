'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AttendancePage() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('2026-08');

  const attendanceData = [
    { date: '2026-08-01', status: 'Present', checkIn: '09:15 AM', checkOut: '06:30 PM', duration: '9h 15m' },
    { date: '2026-08-02', status: 'Present', checkIn: '09:05 AM', checkOut: '06:45 PM', duration: '9h 40m' },
    { date: '2026-08-03', status: 'Absent', checkIn: '-', checkOut: '-', duration: '-' },
    { date: '2026-08-04', status: 'Present', checkIn: '09:30 AM', checkOut: '06:15 PM', duration: '8h 45m' },
    { date: '2026-08-05', status: 'Present', checkIn: '09:00 AM', checkOut: '07:00 PM', duration: '10h' },
    { date: '2026-08-06', status: 'Leave', checkIn: '-', checkOut: '-', duration: 'Full Day' },
    { date: '2026-08-07', status: 'Present', checkIn: '09:20 AM', checkOut: '06:30 PM', duration: '9h 10m' },
    { date: '2026-08-08', status: 'Present', checkIn: '09:10 AM', checkOut: '06:40 PM', duration: '9h 30m' },
    { date: '2026-08-09', status: 'Present', checkIn: '09:00 AM', checkOut: '06:20 PM', duration: '9h 20m' },
    { date: '2026-08-10', status: 'Holiday', checkIn: '-', checkOut: '-', duration: 'Holiday' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Leave':
        return 'bg-blue-100 text-blue-800';
      case 'Holiday':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return '✓';
      case 'Absent':
        return '✕';
      case 'Leave':
        return '📋';
      case 'Holiday':
        return '🎉';
      default:
        return '-';
    }
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Attendance Logs</h1>
              <p className="text-base text-gray-600">Track your daily attendance records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Present Days</h3>
            <div className="text-3xl font-bold text-green-600">18</div>
            <p className="text-xs text-gray-600 mt-2">Out of 20 working days</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Absent Days</h3>
            <div className="text-3xl font-bold text-red-600">1</div>
            <p className="text-xs text-gray-600 mt-2">Unauthorized</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Leave Days</h3>
            <div className="text-3xl font-bold text-blue-600">1</div>
            <p className="text-xs text-gray-600 mt-2">Approved</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Avg Daily Hours</h3>
            <div className="text-3xl font-bold text-purple-600">9h 24m</div>
            <p className="text-xs text-gray-600 mt-2">This month</p>
          </div>
        </div>

        {/* Month Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Check Out</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendanceData.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        {record.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{record.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{record.checkOut}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{record.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
