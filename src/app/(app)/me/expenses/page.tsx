'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExpensesPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('summary');

  const expenseSummary = [
    { type: 'Travel', amount: 5420, status: 'Approved', percentage: 45 },
    { type: 'Meals', amount: 2890, status: 'Approved', percentage: 24 },
    { type: 'Accommodation', amount: 3120, status: 'Approved', percentage: 26 },
    { type: 'Other', amount: 570, status: 'Pending', percentage: 5 },
  ];

  const expensesList = [
    { id: 1, date: '2026-08-10', category: 'Travel', description: 'Flight to New York - Client Meeting', amount: 850, status: 'Approved', receipt: true },
    { id: 2, date: '2026-08-09', category: 'Meals', description: 'Team Lunch - Project Kickoff', amount: 150, status: 'Approved', receipt: true },
    { id: 3, date: '2026-08-08', category: 'Accommodation', description: 'Hotel - New York Stay (3 nights)', amount: 780, status: 'Approved', receipt: true },
    { id: 4, date: '2026-08-07', category: 'Travel', description: 'Taxi - Airport Transfer', amount: 65, status: 'Approved', receipt: true },
    { id: 5, date: '2026-08-06', category: 'Meals', description: 'Client Dinner', amount: 220, status: 'Pending', receipt: true },
    { id: 6, date: '2026-08-05', category: 'Other', description: 'Conference Registration', amount: 570, status: 'Pending', receipt: true },
  ];

  const travelRequests = [
    { id: 1, destination: 'New York, USA', purpose: 'Client Meeting', startDate: '2026-08-08', endDate: '2026-08-10', status: 'Approved', approvedBy: 'Sarah Jenkins' },
    { id: 2, destination: 'London, UK', purpose: 'Team Building Event', startDate: '2026-09-15', endDate: '2026-09-17', status: 'Pending', approvedBy: '-' },
    { id: 3, destination: 'Paris, France', purpose: 'Conference Attendance', startDate: '2026-07-15', endDate: '2026-07-18', status: 'Approved', approvedBy: 'Sarah Jenkins' },
  ];

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Travel':
        return 'bg-blue-100 text-blue-800';
      case 'Meals':
        return 'bg-orange-100 text-orange-800';
      case 'Accommodation':
        return 'bg-purple-100 text-purple-800';
      case 'Other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalExpenses = expenseSummary.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenseSummary.filter(exp => exp.status === 'Approved').reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Expenses & Travel</h1>
              <p className="text-base text-gray-600">Manage your expenses and travel requests</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            + Submit Expense
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setSelectedTab('summary')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'summary' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setSelectedTab('expenses')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'expenses' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setSelectedTab('travel')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'travel' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Travel Requests
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* SUMMARY TAB */}
        {selectedTab === 'summary' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Expenses</h3>
                <div className="text-3xl font-bold text-indigo-600 mb-2">₹{totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-gray-600">This financial year</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Approved</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">₹{approvedExpenses.toLocaleString()}</div>
                <p className="text-xs text-gray-600">Amount approved</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Pending</h3>
                <div className="text-3xl font-bold text-yellow-600 mb-2">₹{(totalExpenses - approvedExpenses).toLocaleString()}</div>
                <p className="text-xs text-gray-600">Awaiting approval</p>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Expense Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expenseSummary.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">{exp.type}</h3>
                      <span className="text-lg font-bold text-indigo-600">₹{exp.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${exp.percentage}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-600">{exp.percentage}% of total</span>
                      <div className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}>
                        {exp.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXPENSES TAB */}
        {selectedTab === 'expenses' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Expenses</h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expensesList.map((exp) => (
                      <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {new Date(exp.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(exp.category)}`}>
                            {exp.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{exp.description}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{exp.amount}</td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}>
                            {exp.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {exp.receipt ? (
                            <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                              📎 View
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TRAVEL TAB */}
        {selectedTab === 'travel' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Travel Requests</h2>
            <div className="space-y-4">
              {travelRequests.map((travel) => (
                <div key={travel.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{travel.destination}</h3>
                      <p className="text-sm text-gray-600 mt-1">Purpose: {travel.purpose}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(travel.status)}`}>
                      {travel.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(travel.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">End Date</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(travel.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Approved By</p>
                      <p className="text-sm font-medium text-gray-900">{travel.approvedBy}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    {travel.status === 'Pending' && (
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
