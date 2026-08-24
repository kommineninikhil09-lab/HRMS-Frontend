'use client';

import { useState } from 'react';

const DownloadIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
  </svg>
);

const payslips = [
  {
    id: 1,
    month: 'August 2026',
    date: '2026-08-31',
    salary: 45000,
    deductions: 8200,
    netPay: 36800,
    status: 'paid',
  },
  {
    id: 2,
    month: 'July 2026',
    date: '2026-07-31',
    salary: 45000,
    deductions: 8200,
    netPay: 36800,
    status: 'paid',
  },
];

export default function PayslipsPage() {
  const [selectedTab, setSelectedTab] = useState('pay');
  const [selectedPayslip, setSelectedPayslip] = useState<number | null>(payslips[0].id);

  const currentPayslip = payslips.find(p => p.id === selectedPayslip);

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-8 py-6 sm:py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Finances</h1>
        <p className="text-base text-gray-600">View and download your payslips and salary information</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setSelectedTab('pay')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'pay'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Pay
          </button>
          <button
            onClick={() => setSelectedTab('tax')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'tax'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Tax
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {/* My Pay Tab */}
        {selectedTab === 'pay' && (
          <>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-emerald-600 mb-3 text-lg"><CalendarIcon /></div>
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Current Month</div>
                <div className="text-3xl font-bold text-emerald-700">£45,000</div>
                <div className="text-sm text-emerald-600 mt-2">Gross Salary</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-purple-600 mb-3 text-lg"><DownloadIcon /></div>
                <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">YTD Total</div>
                <div className="text-3xl font-bold text-purple-700">£180,000</div>
                <div className="text-sm text-purple-600 mt-2">Year-to-Date Earnings</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-3 text-lg"><CalendarIcon /></div>
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Next Payday</div>
                <div className="text-3xl font-bold text-blue-700">Sep 30</div>
                <div className="text-sm text-blue-600 mt-2">2026</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-bold text-gray-900">Payslips</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {payslips.map((payslip) => (
                      <button
                        key={payslip.id}
                        onClick={() => setSelectedPayslip(payslip.id)}
                        className={`w-full text-left p-4 transition-all ${
                          selectedPayslip === payslip.id
                            ? 'bg-purple-50 border-l-4 border-purple-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{payslip.month}</div>
                        <div className="text-sm text-gray-600 mt-1">£{payslip.netPay.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                          {payslip.status}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {currentPayslip && (
                <div className="col-span-2">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-8 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Payslip</h2>
                          <p className="text-gray-600 mt-1">{currentPayslip.month}</p>
                        </div>
                        <button className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2">
                          <DownloadIcon /> Download PDF
                        </button>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-4 text-lg">Earnings</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Base Salary</span>
                              <span className="font-semibold text-gray-900">£{(currentPayslip.salary * 0.85).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bonus</span>
                              <span className="font-semibold text-gray-900">£{(currentPayslip.salary * 0.15).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200 flex justify-between">
                              <span className="font-semibold text-gray-900">Gross</span>
                              <span className="font-bold text-emerald-600">£{currentPayslip.salary.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-900 mb-4 text-lg">Deductions</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Income Tax</span>
                              <span className="font-semibold text-gray-900">£{(currentPayslip.deductions * 0.45).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">National Insurance</span>
                              <span className="font-semibold text-gray-900">£{(currentPayslip.deductions * 0.3).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pension</span>
                              <span className="font-semibold text-gray-900">£{(currentPayslip.deductions * 0.25).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200 flex justify-between">
                              <span className="font-semibold text-gray-900">Total Deductions</span>
                              <span className="font-bold text-rose-600">-£{currentPayslip.deductions.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Net Pay</p>
                            <p className="text-3xl font-bold text-purple-600 mt-1">£{currentPayslip.netPay.toLocaleString()}</p>
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Manage Tax Tab */}
        {selectedTab === 'tax' && (
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Tax Information</h2>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">Tax Year 2025-2026</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600">Personal Allowance</p>
                    <p className="text-2xl font-bold text-blue-900">£12,570</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Taxable Income</p>
                    <p className="text-2xl font-bold text-blue-900">£32,430</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Tax Paid</p>
                    <p className="text-2xl font-bold text-blue-900">£6,486</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Effective Rate</p>
                    <p className="text-2xl font-bold text-blue-900">20%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Tax Documents</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-600 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">P60 - Tax Year 2025-2026</p>
                      <p className="text-sm text-gray-600">Issued: Dec 31, 2025</p>
                    </div>
                    <DownloadIcon />
                  </a>
                  <a href="#" className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-600 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900">P45 - Previous Employer</p>
                      <p className="text-sm text-gray-600">Issued: Jun 15, 2025</p>
                    </div>
                    <DownloadIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
