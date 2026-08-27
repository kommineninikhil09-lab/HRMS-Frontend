'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { IdCardIcon, FileTextIcon, ReceiptIcon, TrendingUpIcon, ChevronDownIcon } from '@/components/icons';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function DocBlock({
  title,
  groupLabel,
  fields,
}: {
  title: string;
  groupLabel?: string;
  fields: { label: string; value: string }[];
}) {
  return (
    <div>
      {groupLabel ? (
        <p className="text-sm font-bold text-slate-900 mb-3">{groupLabel}</p>
      ) : null}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden>🇮🇳</span>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded px-1.5 py-0.5">
            VERIFIED
          </span>
        </div>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0">1 file</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map((f) => (
          <Field key={f.label} label={f.label} value={f.value} />
        ))}
      </div>
    </div>
  );
}

const payrollSummary = {
  lastProcessedCycle: 'Jul 2026 (28 Jun - 27 Jul)',
  workingDays: '30',
  lossOfPay: '0',
};

const paymentInfo = {
  mode: 'Bank Transfer',
  bankName: 'HDFC Bank',
  accountNumber: 'XXXX XXXX 6712',
  ifsc: 'HDFC0000123',
  nameOnAccount: 'Alex Morgan',
  branch: 'MG Road, Bengaluru',
};

const statutoryInfo = {
  lwfStatus: 'Enabled',
  lwfState: 'Karnataka',
  employeeContribution: '₹20 / month',
  employerContribution: '₹40 / month',
};

const panCardFields = [
  { label: 'Permanent Account Number (PAN)', value: 'ABCDE1234F' },
  { label: 'Name', value: 'Alex Morgan' },
  { label: 'Date of Birth', value: '15 Apr 1996' },
  { label: "Parent's Name", value: 'Jordan Morgan' },
];

const aadhaarFields = [
  { label: 'Aadhaar Number', value: 'XXXX XXXX 3456' },
  { label: 'Enrollment Number', value: 'Not Available' },
  { label: 'Date of Birth', value: '15 Apr 1996' },
  { label: 'Name', value: 'Alex Morgan' },
  { label: 'Address', value: '12 Park Avenue, Indiranagar, Bengaluru, Karnataka' },
  { label: 'Gender', value: 'Male' },
];

const DownloadIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function PayslipsPage() {
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('summary');
  const [expensesSubTab, setExpensesSubTab] = useState('summary');
  const [selectedPayslip, setSelectedPayslip] = useState<number | null>(payslips[0].id);
  const [salaryExpanded, setSalaryExpanded] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'summary' || tab === 'pay' || tab === 'tax' || tab === 'expenses') {
      setSelectedTab(tab);
    }
  }, [searchParams]);

  const currentPayslip = payslips.find(p => p.id === selectedPayslip);
  const totalExpenses = expenseSummary.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenseSummary.filter(exp => exp.status === 'Approved').reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8">
        <div className="flex gap-6">
          <button
            onClick={() => setSelectedTab('summary')}
            className={`px-1 py-3 border-b-2 font-semibold text-sm transition-colors ${
              selectedTab === 'summary'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setSelectedTab('pay')}
            className={`px-1 py-3 border-b-2 font-semibold text-sm transition-colors ${
              selectedTab === 'pay'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Pay
          </button>
          <button
            onClick={() => setSelectedTab('tax')}
            className={`px-1 py-3 border-b-2 font-semibold text-sm transition-colors ${
              selectedTab === 'tax'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Tax
          </button>
          <button
            onClick={() => setSelectedTab('expenses')}
            className={`px-1 py-3 border-b-2 font-semibold text-sm transition-colors ${
              selectedTab === 'expenses'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Expenses &amp; Travel
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Summary Tab */}
        {selectedTab === 'summary' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04)] px-5 py-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                <h2 className="text-lg font-bold text-slate-900 shrink-0">Payroll summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
                  <Field label="Last Processed Cycle" value={payrollSummary.lastProcessedCycle} />
                  <Field label="Working Days" value={payrollSummary.workingDays} />
                  <Field label="Loss of Pay" value={payrollSummary.lossOfPay} />
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Payslip</div>
                    <button
                      onClick={() => setSelectedTab('pay')}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View payslip
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="space-y-5">
                <DashboardCard title="Payment Information" icon={<ReceiptIcon className="w-4 h-4" />}>
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <Field label="Payment Mode" value={paymentInfo.mode} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
                    <Field label="Bank Name" value={paymentInfo.bankName} />
                    <Field label="Account Number" value={paymentInfo.accountNumber} />
                    <Field label="IFSC Code" value={paymentInfo.ifsc} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field label="Name on the Account" value={paymentInfo.nameOnAccount} />
                    <Field label="Branch" value={paymentInfo.branch} />
                  </div>
                </DashboardCard>

                <DashboardCard title="Statutory Information" icon={<FileTextIcon className="w-4 h-4" />}>
                  <p className="text-sm font-bold text-slate-900 mb-3">LWF Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="LWF Status" value={statutoryInfo.lwfStatus} />
                    <Field label="LWF State" value={statutoryInfo.lwfState} />
                    <Field label="Employee Contribution" value={statutoryInfo.employeeContribution} />
                    <Field label="Employer Contribution" value={statutoryInfo.employerContribution} />
                  </div>
                </DashboardCard>
              </div>

              <DashboardCard title="Identity Information" icon={<IdCardIcon className="w-4 h-4" />}>
                <div className="space-y-6">
                  <DocBlock title="PAN Card" fields={panCardFields} />
                  <div className="pt-6 border-t border-slate-100">
                    <DocBlock title="Aadhaar Card" groupLabel="Photo ID" fields={aadhaarFields} />
                  </div>
                  <div className="pt-6 border-t border-slate-100">
                    <DocBlock title="Aadhaar Card" groupLabel="Address Proof" fields={aadhaarFields} />
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        )}

        {/* My Pay Tab */}
        {selectedTab === 'pay' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CalendarIcon />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Compensation</span>
                </div>
                <div className="text-xl font-bold text-slate-900">₹9,00,000</div>
                <div className="text-xs text-slate-500 mt-1">Per annum</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                    <CalendarIcon />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Pay Cycle</span>
                </div>
                <div className="text-xl font-bold text-slate-900">Monthly</div>
                <div className="text-xs text-slate-500 mt-1">Paid on the last working day</div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CalendarIcon />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Next Payday</span>
                </div>
                <div className="text-xl font-bold text-slate-900">Sep 30</div>
                <div className="text-xs text-slate-500 mt-1">2026</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Salary Timeline</h2>

              <div className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <TrendingUpIcon className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">Salary Revision</h3>
                    <span className="text-xs text-slate-500">Effective 01 Jun 2026</span>
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-700 rounded px-1.5 py-0.5 uppercase tracking-wide">
                      Current
                    </span>
                  </div>

                  <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between gap-4">
                      <button
                        onClick={() => setSalaryExpanded((v) => !v)}
                        className="flex items-center gap-4 text-left"
                        aria-expanded={salaryExpanded}
                      >
                        <ChevronDownIcon
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${salaryExpanded ? '' : '-rotate-90'}`}
                        />
                        <div>
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Regular Salary</div>
                          <div className="text-sm font-semibold text-slate-900">₹9,00,000</div>
                        </div>
                        <span className="text-slate-400">=</span>
                        <div>
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Total</div>
                          <div className="text-sm font-semibold text-emerald-600">₹9,00,000</div>
                        </div>
                      </button>
                      <button className="text-xs font-semibold text-purple-600 hover:text-purple-700 shrink-0">
                        View Salary Breakdown
                      </button>
                    </div>

                    {salaryExpanded && (
                      <div className="border-t border-gray-200">
                        <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-3 text-xs">
                          <span className="font-semibold text-slate-500 uppercase tracking-wide">Regular Salary</span>
                          <span className="font-semibold text-slate-900">₹9,00,000 / Annum</span>
                        </div>
                        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Salary / Month</div>
                            <div className="text-sm font-semibold text-slate-900">₹75,000</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Effective From</div>
                            <div className="text-sm font-semibold text-slate-900">01 Jun 2026</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-base font-bold text-slate-900">Payslips</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {payslips.map((payslip) => (
                      <button
                        key={payslip.id}
                        onClick={() => setSelectedPayslip(payslip.id)}
                        className={`w-full text-left px-4 py-3 transition-all ${
                          selectedPayslip === payslip.id
                            ? 'bg-purple-50 border-l-4 border-purple-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-sm font-semibold text-slate-900">{payslip.month}</div>
                        <div className="text-xs text-gray-600 mt-1">£{payslip.netPay.toLocaleString()}</div>
                        <div className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          {payslip.status}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {currentPayslip && (
                <div className="col-span-2">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-bold text-slate-900">Payslip</h2>
                          <p className="text-xs text-gray-500 mt-0.5">{currentPayslip.month}</p>
                        </div>
                        <button className="px-3.5 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-all flex items-center gap-1.5">
                          <DownloadIcon /> Download PDF
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-6 mb-5">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 mb-3">Earnings</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Base Salary</span>
                              <span className="font-medium text-gray-900">£{(currentPayslip.salary * 0.85).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bonus</span>
                              <span className="font-medium text-gray-900">£{(currentPayslip.salary * 0.15).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between">
                              <span className="font-semibold text-gray-900">Gross</span>
                              <span className="font-semibold text-emerald-600">£{currentPayslip.salary.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 mb-3">Deductions</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Income Tax</span>
                              <span className="font-medium text-gray-900">£{(currentPayslip.deductions * 0.45).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">National Insurance</span>
                              <span className="font-medium text-gray-900">£{(currentPayslip.deductions * 0.3).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pension</span>
                              <span className="font-medium text-gray-900">£{(currentPayslip.deductions * 0.25).toLocaleString('en-GB', {maximumFractionDigits: 0})}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between">
                              <span className="font-semibold text-gray-900">Total Deductions</span>
                              <span className="font-semibold text-rose-600">-£{currentPayslip.deductions.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-600">Net Pay</p>
                            <p className="text-xl font-bold text-purple-600 mt-0.5">£{currentPayslip.netPay.toLocaleString()}</p>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">✓</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-4">Manage Tax Information</h2>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Tax Year 2025-2026</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600">Personal Allowance</p>
                    <p className="text-lg font-bold text-blue-900">£12,570</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Taxable Income</p>
                    <p className="text-lg font-bold text-blue-900">£32,430</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Tax Paid</p>
                    <p className="text-lg font-bold text-blue-900">£6,486</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Effective Rate</p>
                    <p className="text-lg font-bold text-blue-900">20%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-base font-bold text-slate-900 mb-3">Tax Documents</h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-purple-600 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">P60 - Tax Year 2025-2026</p>
                      <p className="text-xs text-gray-500">Issued: Dec 31, 2025</p>
                    </div>
                    <DownloadIcon />
                  </a>
                  <a href="#" className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-purple-600 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">P45 - Previous Employer</p>
                      <p className="text-xs text-gray-500">Issued: Jun 15, 2025</p>
                    </div>
                    <DownloadIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses & Travel Tab */}
        {selectedTab === 'expenses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-6 border-b border-gray-200 -mb-px">
                {(
                  [
                    ['summary', 'Summary'],
                    ['expenses', 'Expenses'],
                    ['travel', 'Travel Requests'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setExpensesSubTab(id)}
                    className={`px-1 pb-3 border-b-2 font-semibold text-sm transition-colors ${
                      expensesSubTab === id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-xs">
                + Submit Expense
              </button>
            </div>

            {expensesSubTab === 'summary' && (
              <div className="space-y-5 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Total Expenses</h3>
                    <div className="text-xl font-bold text-indigo-600 mb-1">₹{totalExpenses.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">This financial year</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Approved</h3>
                    <div className="text-xl font-bold text-green-600 mb-1">₹{approvedExpenses.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Amount approved</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Pending</h3>
                    <div className="text-xl font-bold text-yellow-600 mb-1">
                      ₹{(totalExpenses - approvedExpenses).toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500">Awaiting approval</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <h2 className="text-base font-bold text-slate-900 mb-4">Expense Breakdown</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {expenseSummary.map((exp, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-1.5">
                          <h3 className="text-sm font-medium text-gray-900">{exp.type}</h3>
                          <span className="text-sm font-semibold text-indigo-600">₹{exp.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${exp.percentage}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span className="text-xs text-gray-500">{exp.percentage}% of total</span>
                          <div className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${getStatusColor(exp.status)}`}>
                            {exp.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {expensesSubTab === 'expenses' && (
              <div className="pt-3">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {expensesList.map((exp) => (
                          <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {new Date(exp.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${getCategoryColor(exp.category)}`}>
                                {exp.category}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{exp.description}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{exp.amount}</td>
                            <td className="px-4 py-3">
                              <div className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(exp.status)}`}>
                                {exp.status}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {exp.receipt ? (
                                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-xs">📎 View</button>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
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

            {expensesSubTab === 'travel' && (
              <div className="space-y-3 pt-3">
                {travelRequests.map((travel) => (
                  <div key={travel.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{travel.destination}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Purpose: {travel.purpose}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(travel.status)}`}>
                        {travel.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase mb-0.5">Start Date</p>
                        <p className="text-sm font-medium text-gray-900">{new Date(travel.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase mb-0.5">End Date</p>
                        <p className="text-sm font-medium text-gray-900">{new Date(travel.endDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase mb-0.5">Approved By</p>
                        <p className="text-sm font-medium text-gray-900">{travel.approvedBy}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="px-3.5 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-xs font-medium">
                        View Details
                      </button>
                      {travel.status === 'Pending' && (
                        <button className="px-3.5 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium">
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
