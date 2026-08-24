'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequestWfhPage() {
  const router = useRouter();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Request Work From Home</h1>
            <p className="text-base text-gray-600">Submit a WFH request for manager approval</p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-xl">
        {submitted ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 text-2xl">
              ✓
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Request submitted</h2>
            <p className="text-sm text-gray-600 mb-6">Your WFH request has been sent for approval.</p>
            <button
              onClick={() => router.push('/me/attendance')}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Back to Attendance
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  type="date"
                  required
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  type="date"
                  required
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Let your manager know why you're requesting WFH..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
