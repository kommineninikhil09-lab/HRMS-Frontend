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

const financialYears = [
  { id: 'FY2026', label: 'Apr 2026 – Mar 2027' },
  { id: 'FY2025', label: 'Apr 2025 – Mar 2026' },
];

type TaxData = {
  regime: string;
  grossEarnings: number;
  exemptDeductions: number;
  netTaxableIncome: number;
  taxOnIncome: number;
  rebate: number;
  cess: number;
  totalTaxPayable: number;
  taxPaidTillNow: number;
};

const taxDataByFy: Record<string, TaxData> = {
  FY2026: {
    regime: 'New Tax Regime',
    grossEarnings: 197419,
    exemptDeductions: 75000,
    netTaxableIncome: 122419,
    taxOnIncome: 0,
    rebate: 0,
    cess: 0,
    totalTaxPayable: 0,
    taxPaidTillNow: 0,
  },
  FY2025: {
    regime: 'New Tax Regime',
    grossEarnings: 840000,
    exemptDeductions: 75000,
    netTaxableIncome: 765000,
    taxOnIncome: 26500,
    rebate: 0,
    cess: 1060,
    totalTaxPayable: 27560,
    taxPaidTillNow: 27560,
  },
};

const taxWindows = [
  { title: 'Investment Declaration', status: 'Open', closes: 'Till Aug 31, 2026', note: 'Monthly window open till 25th Dec 2026' },
  { title: 'Proof Submission', status: 'Open', closes: 'Till Jan 22, 2027', note: 'Upload proofs for declared investments' },
];

const declarationRows = [
  { section: '80C – Deductions (max ₹1.5L)', count: 0, declared: 0, proofs: 0, accepted: 0 },
  { section: 'Other Deductions', count: 1, declared: 0, proofs: 0, accepted: 0 },
  { section: 'Tax Saving Allowances', count: 0, declared: 0, proofs: 0, accepted: 0 },
  { section: 'House Property', count: 0, declared: 0, proofs: 0, accepted: 0 },
];

const previousIncomeRows = [
  { month: 'April 2026', gross: 0, tax: 0 },
  { month: 'May 2026', gross: 0, tax: 0 },
];

const taxForms = [
  { name: 'Form 16', formerly: 'Formerly Form 16', desc: 'Summary of your salary, deductions and tax paid — needed to file your tax return.' },
  { name: 'Form 12BB', formerly: 'Formerly Form 12BB', desc: 'Details of your proposed investments and expenses that are tax deductible.' },
];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const DownloadIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
  </svg>
);

interface SalarySlip {
  id: string;
  month: string;
  grossAmount: number;
  totalDeductions: number;
  netAmount: number;
  status: 'draft' | 'approved' | 'paid' | 'cancelled';
}

interface SlipComponent {
  id: string;
  componentName: string;
  componentType: 'earnings' | 'deduction' | 'tax';
  amount: number;
}

const monthLabel = (month: string) => {
  const [y, m] = month.split('-').map(Number);
  if (!y || !m) return month;
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  const body = await res.json();
  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.message || `Request to ${url} failed`);
  }
  return body.data as T;
}

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
  const [salaryExpanded, setSalaryExpanded] = useState(false);
  const [taxSubTab, setTaxSubTab] = useState('overview');
  const [taxFy, setTaxFy] = useState('FY2026');

  const [slips, setSlips] = useState<SalarySlip[]>([]);
  const [slipsLoading, setSlipsLoading] = useState(true);
  const [slipsError, setSlipsError] = useState<string | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<SlipComponent[] | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setSlipsLoading(true);
        setSlipsError(null);
        const data = await fetchJson<SalarySlip[]>('/api/payroll/slips');
        if (cancelled) return;
        setSlips(data);
        setSelectedPayslip(data[0]?.id ?? null);
      } catch (e) {
        if (!cancelled) setSlipsError(e instanceof Error ? e.message : 'Failed to load payslips');
      } finally {
        if (!cancelled) setSlipsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedPayslip) {
      setBreakdown(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setBreakdownLoading(true);
        const data = await fetchJson<{ components: SlipComponent[] }>(
          `/api/payroll/slips/${selectedPayslip}/breakdown`
        );
        if (!cancelled) setBreakdown(data.components);
      } catch {
        if (!cancelled) setBreakdown(null);
      } finally {
        if (!cancelled) setBreakdownLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPayslip]);

  const fyLabel = financialYears.find((f) => f.id === taxFy)?.label ?? '';
  const td = taxDataByFy[taxFy];
  const balanceTax = Math.max(td.totalTaxPayable - td.taxPaidTillNow, 0);

  const downloadTaxDoc = (title: string) => {
    const lines = [
      title,
      `Financial Year: ${fyLabel}`,
      `Tax Regime: ${td.regime}`,
      '',
      `Gross Earnings:              ${inr(td.grossEarnings)}`,
      `Exemptions & Deductions:     ${inr(td.exemptDeductions)}`,
      `Net Taxable Income:          ${inr(td.netTaxableIncome)}`,
      `Tax on Income:               ${inr(td.taxOnIncome)}`,
      `Rebate:                      ${inr(td.rebate)}`,
      `Health & Education Cess:     ${inr(td.cess)}`,
      `Total Tax Payable:           ${inr(td.totalTaxPayable)}`,
      `Tax Paid Till Now:           ${inr(td.taxPaidTillNow)}`,
      `Balance Tax Payable:         ${inr(balanceTax)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-')}-${taxFy}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'summary' || tab === 'pay' || tab === 'tax' || tab === 'expenses') {
      setSelectedTab(tab);
    }
  }, [searchParams]);

  const currentPayslip = slips.find(p => p.id === selectedPayslip);
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

                  {slipsLoading && (
                    <p className="text-sm text-gray-500 px-4 py-3">Loading...</p>
                  )}
                  {slipsError && !slipsLoading && (
                    <p className="text-sm text-red-600 px-4 py-3">{slipsError}</p>
                  )}
                  {!slipsLoading && !slipsError && slips.length === 0 && (
                    <p className="text-sm text-gray-500 px-4 py-3">No payslips yet.</p>
                  )}

                  {!slipsLoading && !slipsError && slips.length > 0 && (
                    <div className="divide-y divide-gray-200">
                      {slips.map((payslip) => (
                        <button
                          key={payslip.id}
                          onClick={() => setSelectedPayslip(payslip.id)}
                          className={`w-full text-left px-4 py-3 transition-all ${
                            selectedPayslip === payslip.id
                              ? 'bg-purple-50 border-l-4 border-purple-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-sm font-semibold text-slate-900">{monthLabel(payslip.month)}</div>
                          <div className="text-xs text-gray-600 mt-1">₹{payslip.netAmount.toLocaleString()}</div>
                          <div className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            {payslip.status}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {currentPayslip && (
                <div className="col-span-2">
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-base font-bold text-slate-900">Payslip</h2>
                          <p className="text-xs text-gray-500 mt-0.5">{monthLabel(currentPayslip.month)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      {breakdownLoading && (
                        <p className="text-sm text-gray-500 mb-4">Loading breakdown...</p>
                      )}

                      {!breakdownLoading && (
                        <div className="grid grid-cols-2 gap-6 mb-5">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 mb-3">Earnings</h3>
                            <div className="space-y-2 text-sm">
                              {(breakdown ?? [])
                                .filter((c) => c.componentType === 'earnings')
                                .map((c) => (
                                  <div key={c.id} className="flex justify-between">
                                    <span className="text-gray-600">{c.componentName}</span>
                                    <span className="font-medium text-gray-900">₹{c.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                  </div>
                                ))}
                              <div className="pt-2 border-t border-gray-200 flex justify-between">
                                <span className="font-semibold text-gray-900">Gross</span>
                                <span className="font-semibold text-emerald-600">₹{currentPayslip.grossAmount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900 mb-3">Deductions</h3>
                            <div className="space-y-2 text-sm">
                              {(breakdown ?? [])
                                .filter((c) => c.componentType === 'deduction' || c.componentType === 'tax')
                                .map((c) => (
                                  <div key={c.id} className="flex justify-between">
                                    <span className="text-gray-600">{c.componentName}</span>
                                    <span className="font-medium text-gray-900">₹{c.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                  </div>
                                ))}
                              <div className="pt-2 border-t border-gray-200 flex justify-between">
                                <span className="font-semibold text-gray-900">Total Deductions</span>
                                <span className="font-semibold text-rose-600">-₹{currentPayslip.totalDeductions.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-600">Net Pay</p>
                            <p className="text-xl font-bold text-purple-600 mt-0.5">₹{currentPayslip.netAmount.toLocaleString()}</p>
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
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-6 border-b border-gray-200 -mb-px">
                {(
                  [
                    ['overview', 'Overview'],
                    ['declarations', 'Declarations'],
                    ['previous', 'Previous Income'],
                    ['forms', 'Forms'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setTaxSubTab(id)}
                    className={`px-1 pb-3 border-b-2 font-semibold text-sm transition-colors ${
                      taxSubTab === id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <select
                value={taxFy}
                onChange={(e) => setTaxFy(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-400"
              >
                {financialYears.map((f) => (
                  <option key={f.id} value={f.id}>
                    FY {f.label}
                  </option>
                ))}
              </select>
            </div>

            {taxSubTab === 'overview' && (
              <div className="space-y-5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {taxWindows.map((w) => (
                    <div key={w.title} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-slate-900">{w.title}</h3>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {w.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{w.closes}</p>
                      <p className="text-xs text-gray-500 mt-1">{w.note}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Income Tax Computation</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {td.regime} · FY {fyLabel}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadTaxDoc('Income Tax Statement')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <DownloadIcon /> Download statement
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pb-4 mb-4 border-b border-gray-100">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Net Taxable Income</div>
                      <div className="text-lg font-bold text-slate-900">{inr(td.netTaxableIncome)}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Total Tax Payable</div>
                      <div className="text-lg font-bold text-slate-900">{inr(td.totalTaxPayable)}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Tax Paid Till Now</div>
                      <div className="text-lg font-bold text-emerald-600">{inr(td.taxPaidTillNow)}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Balance Tax</div>
                      <div className="text-lg font-bold text-slate-900">{inr(balanceTax)}</div>
                    </div>
                  </div>

                  <dl className="text-sm divide-y divide-gray-100">
                    {(
                      [
                        ['Gross earnings from employment', inr(td.grossEarnings)],
                        ['Exemptions & deductions', `- ${inr(td.exemptDeductions)}`],
                        ['Net taxable income', inr(td.netTaxableIncome)],
                        ['Tax on income', inr(td.taxOnIncome)],
                        ['Rebate', `- ${inr(td.rebate)}`],
                        ['Health & education cess', inr(td.cess)],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2">
                        <dt className="text-gray-600">{label}</dt>
                        <dd className="font-medium text-gray-900">{value}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between py-2.5">
                      <dt className="font-semibold text-slate-900">Total tax payable</dt>
                      <dd className="font-bold text-purple-600">{inr(td.totalTaxPayable)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {taxSubTab === 'declarations' && (
              <div className="pt-2">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <h2 className="text-base font-bold text-slate-900">My Declarations</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Declarations you have made under various tax sections.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Section</th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase">Declarations</th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase">Declared</th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase">Proofs</th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase">Accepted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {declarationRows.map((r) => (
                          <tr key={r.section} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3 text-sm font-medium text-gray-900">{r.section}</td>
                            <td className="px-5 py-3 text-sm text-gray-700 text-right">{r.count}</td>
                            <td className="px-5 py-3 text-sm text-gray-700 text-right">{inr(r.declared)}</td>
                            <td className="px-5 py-3 text-sm text-gray-700 text-right">{r.proofs}</td>
                            <td className="px-5 py-3 text-sm font-medium text-gray-900 text-right">{inr(r.accepted)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {taxSubTab === 'previous' && (
              <div className="pt-2 space-y-4">
                <p className="text-sm text-gray-600">
                  Add income from your previous employer this financial year so your tax is computed correctly.
                  You can add previous income till <span className="font-semibold text-gray-900">Aug 31, 2026</span>.
                </p>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Month</th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase">Gross Earnings</th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase">Income Tax</th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {previousIncomeRows.map((r) => (
                          <tr key={r.month} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3 text-sm font-medium text-gray-900">{r.month}</td>
                            <td className="px-5 py-3 text-sm text-gray-700 text-right">{inr(r.gross)}</td>
                            <td className="px-5 py-3 text-sm text-gray-700 text-right">{inr(r.tax)}</td>
                            <td className="px-5 py-3 text-right">
                              <button className="text-xs font-semibold text-purple-600 hover:text-purple-700">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {taxSubTab === 'forms' && (
              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {taxForms.map((f) => (
                  <div key={f.name} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <h2 className="text-base font-bold text-slate-900">{f.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{f.formerly}</p>
                    <p className="text-sm text-gray-600 mt-3">{f.desc}</p>
                    <p className="text-xs text-gray-500 mt-3">For FY {fyLabel}</p>
                    <button
                      onClick={() => downloadTaxDoc(f.name)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <DownloadIcon /> Download {f.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
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
