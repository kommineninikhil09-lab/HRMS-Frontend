'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/* ------------------------------ data ------------------------------ */

interface Employee {
  id: string;
  name: string;
  initials: string;
  color: string;
  title: string;
  email: string;
  managerId: string | null;
  businessUnit: string;
  department: string;
  location: string;
  costCenter: string;
}

interface RawEmployee {
  id: string;
  first_name: string;
  last_name: string;
  work_email?: string;
  department_id?: string;
  business_unit_id?: string;
  location_id?: string;
  cost_center_id?: string;
  designation_id?: string;
  manager_id?: string;
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

const AVATAR_COLORS = [
  'from-slate-600 to-slate-800',
  'from-rose-600 to-pink-600',
  'from-blue-600 to-indigo-600',
  'from-fuchsia-600 to-purple-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-indigo-600 to-violet-600',
  'from-teal-600 to-emerald-600',
  'from-pink-600 to-rose-600',
];

function colorFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function toEmployee(
  e: RawEmployee,
  departments: Record<string, string>,
  businessUnits: Record<string, string>,
  locations: Record<string, string>,
  costCenters: Record<string, string>,
  designations: Record<string, string>,
): Employee {
  const initials = `${e.first_name?.[0] ?? ''}${e.last_name?.[0] ?? ''}`.toUpperCase() || '—';
  return {
    id: e.id,
    name: `${e.first_name} ${e.last_name}`.trim(),
    initials,
    color: colorFor(e.id),
    title: (e.designation_id && designations[e.designation_id]) || '—',
    email: e.work_email ?? '',
    managerId: e.manager_id ?? null,
    businessUnit: (e.business_unit_id && businessUnits[e.business_unit_id]) || '—',
    department: (e.department_id && departments[e.department_id]) || '—',
    location: (e.location_id && locations[e.location_id]) || '—',
    costCenter: (e.cost_center_id && costCenters[e.cost_center_id]) || '—',
  };
}

const filterKeys = ['businessUnit', 'department', 'location', 'costCenter'] as const;
type FilterKey = (typeof filterKeys)[number];

const filterMeta: Record<FilterKey, string> = {
  businessUnit: 'Business Unit',
  department: 'Department',
  location: 'Location',
  costCenter: 'Cost Center',
};

const uniqueValues = (employees: Employee[], key: FilterKey) =>
  Array.from(new Set(employees.map((e) => e[key]))).sort();

/* ------------------------------ page ------------------------------ */

export default function OrgPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'directory' | 'chart' | 'documents'>('directory');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'directory' || t === 'chart' || t === 'documents') setTab(t);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [rawEmployees, departments, businessUnits, locations, costCenters, designations, profile] =
          await Promise.all([
            fetchJson<RawEmployee[]>('/api/employees'),
            fetchJson<NamedEntity[]>('/api/departments'),
            fetchJson<NamedEntity[]>('/api/business-units'),
            fetchJson<NamedEntity[]>('/api/locations'),
            fetchJson<NamedEntity[]>('/api/cost-centers'),
            fetchJson<NamedEntity[]>('/api/designations'),
            fetchJson<{ id: string }>('/api/ess/profile'),
          ]);
        if (cancelled) return;
        const deptMap = toNameMap(departments);
        const buMap = toNameMap(businessUnits);
        const locMap = toNameMap(locations);
        const ccMap = toNameMap(costCenters);
        const desigMap = toNameMap(designations);
        setEmployees(rawEmployees.map((e) => toEmployee(e, deptMap, buMap, locMap, ccMap, desigMap)));
        setMeId(profile.id);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load organisation data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8">
        <div className="flex gap-6">
          {(
            [
              ['directory', 'Employee Directory'],
              ['chart', 'Organisation Chart'],
              ['documents', 'Organization Documents'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-1 py-3 border-b-2 font-semibold text-sm transition-colors ${
                tab === id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {tab === 'documents' ? (
          <Documents />
        ) : loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : tab === 'directory' ? (
          <Directory employees={employees} />
        ) : (
          <OrgChart employees={employees} meId={meId} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------ documents ------------------------------ */

interface OrgDocument {
  title: string;
  description: string;
  expires: string;
  size: string;
  updated: string;
}

interface DocFolder {
  name: string;
  documents: OrgDocument[];
}

const docFolders: DocFolder[] = [
  {
    name: 'Human Resources Policies',
    documents: [
      { title: 'Employee Training and Development', description: '', expires: 'No', size: '316.60 KB', updated: '24 May 2024' },
      { title: 'Grievance Policy', description: '', expires: 'No', size: '334.18 KB', updated: '24 May 2024' },
      { title: 'Code of Conduct Policy', description: '', expires: 'No', size: '269.41 KB', updated: '24 May 2024' },
      { title: 'Work From Home Policy', description: 'Guidelines for remote and hybrid working', expires: 'No', size: '258.23 KB', updated: '24 May 2024' },
      { title: 'Drug & Alcohol Policy', description: '', expires: 'No', size: '244.01 KB', updated: '24 May 2024' },
      { title: 'Rewards and Recognition Policy', description: '', expires: 'No', size: '260.21 KB', updated: '24 May 2024' },
      { title: 'Leave Policy', description: 'Leave types, accrual and application process', expires: 'No', size: '376.88 KB', updated: '25 May 2024' },
      { title: 'Hiring Policy', description: '', expires: 'No', size: '243.49 KB', updated: '25 May 2024' },
    ],
  },
  {
    name: 'Compliance Policies',
    documents: [
      { title: 'Anti-Bribery & Corruption Policy', description: '', expires: 'No', size: '198.44 KB', updated: '18 Apr 2024' },
      { title: 'Whistleblower Policy', description: '', expires: 'No', size: '176.10 KB', updated: '18 Apr 2024' },
      { title: 'Data Protection & Privacy Policy', description: 'How employee and customer data is handled', expires: 'No', size: '312.77 KB', updated: '02 May 2024' },
      { title: 'Conflict of Interest Policy', description: '', expires: 'No', size: '154.30 KB', updated: '02 May 2024' },
      { title: 'Regulatory Reporting Guidelines', description: '', expires: '31 Dec 2025', size: '221.09 KB', updated: '11 Jun 2024' },
    ],
  },
  {
    name: 'Operational Policies',
    documents: [
      { title: 'Travel & Expense Policy', description: 'Booking, limits and reimbursement claims', expires: 'No', size: '287.65 KB', updated: '09 Mar 2024' },
      { title: 'Asset Management Policy', description: '', expires: 'No', size: '203.12 KB', updated: '09 Mar 2024' },
    ],
  },
  {
    name: 'Information Security Policies',
    documents: [
      { title: 'Acceptable Use Policy', description: 'Use of company devices, email and internet', expires: 'No', size: '241.88 KB', updated: '20 Feb 2024' },
      { title: 'Password & Access Control Policy', description: '', expires: 'No', size: '188.44 KB', updated: '20 Feb 2024' },
    ],
  },
  {
    name: 'Communication Policy',
    documents: [
      { title: 'Internal & External Communication Guidelines', description: '', expires: 'No', size: '167.20 KB', updated: '14 Jan 2024' },
    ],
  },
  {
    name: 'Risk Management Policies',
    documents: [
      { title: 'Enterprise Risk Management Framework', description: '', expires: 'No', size: '402.55 KB', updated: '30 Apr 2024' },
      { title: 'Business Continuity Plan', description: 'Response and recovery procedures', expires: '30 Apr 2025', size: '355.90 KB', updated: '30 Apr 2024' },
    ],
  },
  {
    name: 'Insurance Policy',
    documents: [
      { title: 'Group Health Insurance Handbook', description: 'Coverage, network hospitals and claims', expires: '31 Mar 2025', size: '512.34 KB', updated: '01 Apr 2024' },
    ],
  },
];

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
  );
}

function Documents() {
  const [activeFolder, setActiveFolder] = useState(docFolders[0].name);
  const [folderSearch, setFolderSearch] = useState('');

  const visibleFolders = docFolders.filter((f) =>
    f.name.toLowerCase().includes(folderSearch.trim().toLowerCase()),
  );
  const folder = docFolders.find((f) => f.name === activeFolder) ?? docFolders[0];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Organization documents</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Documents in these folders are uploaded by admin and available for viewing by all employees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Folder list */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 h-max">
          <div className="relative mb-2">
            <input
              type="text"
              value={folderSearch}
              onChange={(e) => setFolderSearch(e.target.value)}
              placeholder="Search"
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
            />
            <svg className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="space-y-0.5">
            {visibleFolders.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-gray-400">No folders found.</p>
            ) : (
              visibleFolders.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setActiveFolder(f.name)}
                  className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    f.name === activeFolder ? 'bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <FolderIcon className={`w-4 h-4 mt-0.5 shrink-0 ${f.name === activeFolder ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className="min-w-0">
                    <span className={`block text-sm font-medium truncate ${f.name === activeFolder ? 'text-purple-700' : 'text-slate-800'}`}>
                      {f.name}
                    </span>
                    <span className="block text-xs text-gray-400">{f.documents.length} document{f.documents.length === 1 ? '' : 's'}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Document table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
            <span className="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <FolderIcon className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">{folder.name}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Document Title</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Expiration Date</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Size</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {folder.documents.map((doc) => (
                  <tr key={doc.title} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <button className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline text-left">
                        {doc.title}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500">{doc.description || '—'}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{doc.expires}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{doc.size}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{doc.updated}</td>
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

/* ------------------------------ directory ------------------------------ */

function Directory({ employees }: { employees: Employee[] }) {
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    businessUnit: '',
    department: '',
    location: '',
    costCenter: '',
  });
  const [search, setSearch] = useState('');

  const hasActiveFilter = Object.values(filters).some(Boolean) || search.trim() !== '';

  const rows = useMemo(() => {
    return employees.filter((e) => {
      for (const key of filterKeys) {
        if (filters[key] && e[key] !== filters[key]) return false;
      }
      if (search.trim()) {
        const hay = `${e.name} ${e.title} ${e.email} ${e.department}`.toLowerCase();
        if (!hay.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [employees, filters, search]);

  const clearAll = () => {
    setFilters({ businessUnit: '', department: '', location: '', costCenter: '' });
    setSearch('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-end gap-3">
          {filterKeys.map((key) => (
            <div key={key} className="min-w-[150px] flex-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                {filterMeta[key]}
              </label>
              <select
                value={filters[key]}
                onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              >
                <option value="">All</option>
                {uniqueValues(employees, key).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="min-w-[180px] flex-1">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, title or email"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
            />
          </div>
          {hasActiveFilter ? (
            <button
              onClick={clearAll}
              className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-slate-900">Employees</h2>
          <span className="text-xs text-gray-500">
            Showing {rows.length} of {employees.length}
          </span>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-gray-500">No employees match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Department</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Business Unit</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Location</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase">Cost Center</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                        >
                          {e.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{e.name}</p>
                          <p className="text-xs text-gray-500 truncate">{e.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">{e.department}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{e.businessUnit}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{e.location}</td>
                    <td className="px-5 py-3 text-sm text-gray-700">{e.costCenter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ org chart ------------------------------ */

function ancestorsOf(employees: Employee[], id: string): string[] {
  const byId = (i: string) => employees.find((e) => e.id === i);
  const chain: string[] = [];
  let cur = byId(id);
  while (cur?.managerId != null) {
    chain.push(cur.managerId);
    cur = byId(cur.managerId);
  }
  return chain;
}

function OrgChart({ employees, meId }: { employees: Employee[]; meId: string | null }) {
  const byId = (id: string) => employees.find((e) => e.id === id);
  const me = meId ? byId(meId) : undefined;
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [groupByDept, setGroupByDept] = useState(false);
  const [deptFocus, setDeptFocus] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const expandTo = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      ancestorsOf(employees, id).forEach((a) => next.delete(a));
      return next;
    });

  const scrollToNode = (id: string) =>
    window.setTimeout(() => {
      document.getElementById(`org-node-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }, 60);

  const goTopOfOrg = () => {
    setGroupByDept(false);
    setDeptFocus(false);
    setCollapsed(new Set());
    setHighlightId(null);
  };

  const goMyDepartment = () => {
    setGroupByDept(false);
    setDeptFocus(true);
    setHighlightId(null);
  };

  const goMe = () => {
    if (!meId) return;
    setGroupByDept(false);
    setDeptFocus(false);
    expandTo(meId);
    setHighlightId(meId);
    scrollToNode(meId);
  };

  const exportChart = () => {
    const lines: string[] = ['Organisation Chart', ''];
    const walk = (emp: Employee, depth: number) => {
      lines.push(`${'  '.repeat(depth)}${emp.name} — ${emp.title} (${emp.department})`);
      employees.filter((e) => e.managerId === emp.id).forEach((c) => walk(c, depth + 1));
    };
    employees.filter((e) => e.managerId === null).forEach((r) => walk(r, 0));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'org-chart.txt';
    a.click();
    URL.revokeObjectURL(url);
    setToast('Organisation chart exported');
    window.setTimeout(() => setToast(''), 2500);
  };

  // "Root" = no manager, or a manager outside what this viewer's scope can
  // see (e.g. a self-scoped employee whose real manager isn't in the list).
  const visibleIds = new Set(employees.map((e) => e.id));
  const deptFilter = deptFocus ? me?.department : undefined;
  const roots = deptFilter
    ? employees.filter((e) => e.department === deptFilter && (e.managerId ? byId(e.managerId)?.department : undefined) !== deptFilter)
    : employees.filter((e) => e.managerId === null || !visibleIds.has(e.managerId));

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Go to</span>
          <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            <button
              onClick={goMyDepartment}
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                deptFocus ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              My Department
            </button>
            <button
              onClick={goTopOfOrg}
              className={`px-3 py-2 text-sm font-medium border-l border-gray-200 transition-colors ${
                !deptFocus && !groupByDept ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Top of the Org
            </button>
            <button
              onClick={goMe}
              className="px-3 py-2 text-sm font-medium border-l border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Me
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setGroupByDept((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <span
              className={`relative w-9 h-5 rounded-full transition-colors ${groupByDept ? 'bg-purple-600' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  groupByDept ? 'translate-x-4' : ''
                }`}
              />
            </span>
            Group by department
          </button>
          <button
            onClick={exportChart}
            className="p-2 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg"
            title="Export organisation chart"
            aria-label="Export organisation chart"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10 overflow-x-auto">
        <div className="flex justify-center gap-10 min-w-max">
          {roots.map((r) => (
            <OrgNode
              key={r.id}
              employee={r}
              employees={employees}
              collapsed={collapsed}
              onToggle={toggle}
              deptFilter={deptFilter}
              highlightId={highlightId}
              grouped={groupByDept}
            />
          ))}
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

const deptTheme: Record<string, string> = {
  Technology: 'border-blue-300 bg-blue-50/40',
  Design: 'border-fuchsia-300 bg-fuchsia-50/40',
  Finance: 'border-emerald-300 bg-emerald-50/40',
  People: 'border-amber-300 bg-amber-50/40',
  Consulting: 'border-violet-300 bg-violet-50/40',
  Management: 'border-slate-300 bg-slate-50/60',
};

// Connector stub classes for a column at position `i` of `count` siblings.
function connectorClass(i: number, count: number) {
  if (count === 1) return '';
  const base =
    "before:content-[''] before:absolute before:top-0 before:h-6 before:w-px before:bg-gray-300 before:left-1/2 " +
    "after:content-[''] after:absolute after:top-0 after:h-px after:bg-gray-300 ";
  if (i === 0) return base + 'after:left-1/2 after:right-0';
  if (i === count - 1) return base + 'after:left-0 after:right-1/2';
  return base + 'after:left-0 after:right-0';
}

function groupByDepartment(list: Employee[]) {
  const groups: { dept: string; bu: string; members: Employee[] }[] = [];
  for (const e of list) {
    const last = groups[groups.length - 1];
    if (last && last.dept === e.department) last.members.push(e);
    else groups.push({ dept: e.department, bu: e.businessUnit, members: [e] });
  }
  return groups;
}

function OrgNode({
  employee,
  employees,
  collapsed,
  onToggle,
  deptFilter,
  highlightId,
  grouped,
}: {
  employee: Employee;
  employees: Employee[];
  collapsed: Set<string>;
  onToggle: (id: string) => void;
  deptFilter?: string;
  highlightId?: string | null;
  grouped?: boolean;
}) {
  const reports = employees.filter(
    (e) => e.managerId === employee.id && (!deptFilter || e.department === deptFilter),
  );
  const isCollapsed = collapsed.has(employee.id);
  const showChildren = reports.length > 0 && !isCollapsed;
  const single = reports.length === 1;
  const groups = grouped ? groupByDepartment(reports) : [];

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        id={`org-node-${employee.id}`}
        className={`relative w-56 rounded-xl border bg-white shadow-sm px-3 py-3 ${
          highlightId === employee.id ? 'border-purple-400 ring-2 ring-purple-200' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${employee.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
          >
            {employee.initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{employee.name}</p>
            <p className="text-xs text-gray-500 truncate">{employee.title}</p>
          </div>
        </div>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400 truncate">
          {employee.businessUnit} · {employee.department}
        </p>

        {reports.length > 0 ? (
          <button
            onClick={() => onToggle(employee.id)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shadow hover:bg-purple-700 z-10"
            aria-label={isCollapsed ? 'Expand reports' : 'Collapse reports'}
          >
            {isCollapsed ? reports.length : '–'}
          </button>
        ) : null}
      </div>

      {/* Connector down from this card */}
      {showChildren ? <div className="w-px h-6 bg-gray-300" /> : null}

      {/* Children row — grouped by department */}
      {showChildren && grouped ? (
        <div className="flex">
          {groups.map((g, gi) => (
            <div
              key={g.dept + gi}
              className={`relative flex flex-col items-center px-4 pt-6 ${
                groups.length === 1 ? '' : connectorClass(gi, groups.length)
              }`}
            >
              {groups.length === 1 ? <div className="absolute top-0 left-1/2 w-px h-6 bg-gray-300" /> : null}
              <div className={`rounded-2xl border-2 ${deptTheme[g.dept] ?? 'border-gray-300 bg-gray-50/50'} p-4`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  {g.bu} <span className="mx-1">›</span> {g.dept}
                </p>
                <div className="flex gap-6">
                  {g.members.map((child) => (
                    <OrgNode
                      key={child.id}
                      employee={child}
                      employees={employees}
                      collapsed={collapsed}
                      onToggle={onToggle}
                      deptFilter={deptFilter}
                      highlightId={highlightId}
                      grouped
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Children row — plain */}
      {showChildren && !grouped ? (
        <div className="flex">
          {reports.map((child, i) => (
            <div
              key={child.id}
              className={`relative flex flex-col items-center px-4 pt-6 ${
                single ? '' : connectorClass(i, reports.length)
              }`}
            >
              {single ? <div className="absolute top-0 left-1/2 w-px h-6 bg-gray-300" /> : null}
              <OrgNode
                employee={child}
                employees={employees}
                collapsed={collapsed}
                onToggle={onToggle}
                deptFilter={deptFilter}
                highlightId={highlightId}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
