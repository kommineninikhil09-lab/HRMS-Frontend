'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import {
  EditIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  IdCardIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  FileTextIcon,
  PackageIcon,
  CalendarIcon,
} from '@/components/icons';

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'profile', label: 'Profile' },
  { id: 'job', label: 'Job' },
  { id: 'documents', label: 'Documents' },
  { id: 'assets', label: 'Assets' },
];

const aboutTabs = [
  { id: 'summary', label: 'Summary' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'wall', label: 'Wall Activity' },
];

const roleLabel: Record<string, string> = {
  employee: 'Employee',
  admin: 'Manager',
  superadmin: 'HR Administrator',
};

interface EssProfile {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  work_email?: string;
  personal_email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  department_id?: string;
  designation_id?: string;
  location_id?: string;
  date_of_joining?: string;
  status: string;
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

function fmtDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function IdentityDocumentRow({
  label,
  status,
  date,
}: {
  label: string;
  status: 'uploaded' | 'pending';
  date?: string;
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">PDF, JPG, JPEG or PNG</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              status === 'uploaded' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {status === 'uploaded' ? 'Uploaded' : 'Not uploaded'}
          </span>
          {date ? <span className="text-[11px] text-slate-400">{date}</span> : null}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {status === 'uploaded' ? (
          <>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View</button>
            <button className="text-xs font-medium text-slate-500 hover:text-slate-700">Replace</button>
            <button className="text-xs font-medium text-red-500 hover:text-red-600">Remove</button>
          </>
        ) : (
          <button className="text-xs font-medium text-blue-600 border border-blue-600 rounded-md px-2.5 py-1.5 hover:bg-blue-50 transition-colors">
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyPanel({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(15,23,42,0.04)] py-20 flex flex-col items-center text-center px-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-base font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [aboutTab, setAboutTab] = useState('summary');

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Employee';
  const initials = user ? `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}` : 'E';
  const title = (user && roleLabel[user.role]) || 'Team Member';

  const [name, setName] = useState(fullName);
  const [displayName, setDisplayName] = useState(user?.firstName || '');
  const [justSaved, setJustSaved] = useState(false);

  const [ess, setEss] = useState<EssProfile | null>(null);
  const [essLoading, setEssLoading] = useState(true);
  const [departments, setDepartments] = useState<Record<string, string>>({});
  const [locations, setLocations] = useState<Record<string, string>>({});
  const [designations, setDesignations] = useState<Record<string, string>>({});
  const [managerName, setManagerName] = useState<string | null>(null);

  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setEssLoading(true);
        const [profile, depts, locs, desigs] = await Promise.all([
          fetchJson<EssProfile>('/api/ess/profile'),
          fetchJson<NamedEntity[]>('/api/departments'),
          fetchJson<NamedEntity[]>('/api/locations'),
          fetchJson<NamedEntity[]>('/api/designations'),
        ]);
        if (cancelled) return;
        setEss(profile);
        setDepartments(toNameMap(depts));
        setLocations(toNameMap(locs));
        setDesignations(toNameMap(desigs));
        setDob(profile.dob ?? '');
        setGender(profile.gender ?? '');

        if (profile.manager_id) {
          try {
            const manager = await fetchJson<{ first_name: string; last_name: string }>(
              `/api/employees/${profile.manager_id}`
            );
            if (!cancelled) setManagerName(`${manager.first_name} ${manager.last_name}`.trim());
          } catch {
            // Manager may be outside the viewer's own scope to look up directly — non-fatal.
          }
        }
      } catch {
        if (!cancelled) setEss(null);
      } finally {
        if (!cancelled) setEssLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await fetch('/api/ess/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dob: dob || undefined, gender: gender || undefined }),
      }).then((r) => r.json());
      if (!updated?.success) throw new Error(updated?.error?.message || 'Failed to save');
      setEss(updated.data);
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 2500);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(fullName);
  const [editError, setEditError] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const openEditModal = () => {
    setEditName(fullName);
    setEditError('');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditError('');
  };

  const handleSaveName = async () => {
    const trimmed = editName.trim().replace(/\s+/g, ' ');
    if (!trimmed || !/^[A-Za-z' -]+$/.test(trimmed) || trimmed.length > 60) {
      setEditError('Please enter a valid name');
      return;
    }

    setIsSavingName(true);
    setEditError('');
    try {
      const parts = trimmed.split(' ');
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      await updateProfile({ firstName, lastName });
      setIsEditModalOpen(false);
      setNameSaved(true);
      window.setTimeout(() => setNameSaved(false), 2500);
    } catch {
      setEditError('Please enter a valid name');
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter']">
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 sm:px-8 pt-6 pb-6">
          {/* Identity row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                {initials || 'E'}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{fullName}</h1>
                </div>
                <p className="text-slate-500 flex items-center gap-1.5 mt-1 text-sm">
                  <BriefcaseIcon className="w-4 h-4" />
                  {(ess?.designation_id && designations[ess.designation_id]) || title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {nameSaved ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <CheckCircleIcon className="w-4 h-4" />
                  Profile updated successfully
                </span>
              ) : null}
              <button
                onClick={openEditModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0"
              >
                <EditIcon className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 text-slate-400" />
              {user?.email || 'you@company.com'}
            </span>
            {ess?.phone ? (
              <span className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-slate-400" />
                {ess.phone}
              </span>
            ) : null}
            {ess?.location_id && locations[ess.location_id] ? (
              <span className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-slate-400" />
                {locations[ess.location_id]}
              </span>
            ) : null}
            {ess?.employee_code ? (
              <span className="flex items-center gap-2">
                <IdCardIcon className="w-4 h-4 text-slate-400" />
                {ess.employee_code}
              </span>
            ) : null}
          </div>

          {/* Department / Reporting manager */}
          <div className="flex flex-wrap gap-x-16 gap-y-3 mt-5">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Department</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {(ess?.department_id && departments[ess.department_id]) || '—'}
              </p>
            </div>
            {managerName ? (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Reporting Manager</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                    {managerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-blue-600">{managerName}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-8 border-t border-slate-100">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        {activeTab === 'about' && (
          <>
            <div className="flex gap-6 mb-5 border-b border-slate-200">
              {aboutTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAboutTab(tab.id)}
                  className={`pb-3 -mb-px text-sm font-medium border-b-2 transition-colors ${
                    aboutTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {aboutTab === 'summary' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <DashboardCard title="About">
                    <p className="text-sm text-slate-400 mb-3">Share a short introduction about yourself.</p>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
                      Add your response
                    </button>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <h3 className="text-base font-bold text-slate-900 mb-3">What I love about my job?</h3>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
                        Add your response
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <h3 className="text-base font-bold text-slate-900 mb-3">My interests and hobbies</h3>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
                        Add your response
                      </button>
                    </div>
                  </DashboardCard>
                </div>

                <div>
                  <DashboardCard title="Skills">
                    <div className="flex flex-col items-center text-center py-10">
                      <CheckCircleIcon className="w-9 h-9 text-slate-300 mb-3" />
                      <p className="text-sm font-semibold text-slate-700">No skills added yet</p>
                      <p className="text-xs text-slate-400 mt-1">Showcase your skills to your colleagues!</p>
                    </div>
                  </DashboardCard>
                </div>
              </div>
            )}

            {aboutTab === 'timeline' && (
              <EmptyPanel
                icon={<CalendarIcon className="w-7 h-7" />}
                title="No timeline events yet"
                description="Milestones like promotions, transfers, and work anniversaries will show up here."
              />
            )}

            {aboutTab === 'wall' && (
              <EmptyPanel
                icon={<MailIcon className="w-7 h-7" />}
                title="No wall activity yet"
                description="Posts, praise, and comments involving you will show up here."
              />
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 space-y-5">
              <DashboardCard title="Personal Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 pb-5 border-b border-slate-100">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Preferred name shown across the app"
                      className="w-full px-3 py-2 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    >
                      <option value="">—</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving || essLoading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  {justSaved ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <CheckCircleIcon className="w-4 h-4" />
                      Saved
                    </span>
                  ) : null}
                  {saveError ? <span className="text-sm font-medium text-red-600">{saveError}</span> : null}
                </div>
              </DashboardCard>

              <DashboardCard title="Contact Information">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <Field label="Work Email" value={user?.email || 'you@company.com'} />
                  <Field label="Personal Email" value={ess?.personal_email || '—'} />
                  <Field label="Phone Number" value={ess?.phone || '—'} />
                </div>
              </DashboardCard>

              <DashboardCard title="Education" icon={<GraduationCapIcon className="w-4 h-4" />}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <Field label="Degree" value="B.Tech" />
                  <Field label="Branch / Specialization" value="CSE - AIML" />
                  <Field label="CGPA / Percentage" value="8.4" />
                  <Field label="University / College" value="State University" />
                  <Field label="Year of Completion" value="Jun 2022" />
                  <Field label="Year of Joining" value="Aug 2022" />
                </div>
              </DashboardCard>
            </div>

            <div className="space-y-5">
              <DashboardCard title="Address">
                <div className="space-y-5">
                  <Field label="Current Address" value="221B Jubilee Hills, Hyderabad, Telangana 500033" />
                  <Field label="Permanent Address" value="Same as current address" />
                </div>
              </DashboardCard>

              <DashboardCard title="Identity Information" icon={<IdCardIcon className="w-4 h-4" />}>
                <div className="grid grid-cols-1 gap-4">
                  <IdentityDocumentRow label="Aadhaar" status="uploaded" date="12 Jan 2023" />
                  <IdentityDocumentRow label="PAN" status="uploaded" date="15 Jan 2023" />
                  <IdentityDocumentRow label="Voter ID" status="pending" />
                  <IdentityDocumentRow label="Address Proof" status="pending" />
                </div>
              </DashboardCard>
            </div>
          </div>
        )}

        {activeTab === 'job' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <DashboardCard title="Work Information" icon={<BriefcaseIcon className="w-4 h-4" />}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <Field label="Department" value={(ess?.department_id && departments[ess.department_id]) || '—'} />
                  <Field label="Date of Joining" value={fmtDate(ess?.date_of_joining)} />
                  <Field label="Work Location" value={(ess?.location_id && locations[ess.location_id]) || '—'} />
                  <Field label="Reporting Manager" value={managerName || '—'} />
                </div>
              </DashboardCard>
            </div>

            <div>
              <DashboardCard title="Emergency Contact" icon={<AlertTriangleIcon className="w-4 h-4" />}>
                <div className="space-y-5">
                  <Field label="Name" value="Add emergency contact" />
                  <Field label="Relationship" value="—" />
                  <Field label="Contact Number" value="—" />
                </div>
              </DashboardCard>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <EmptyPanel
            icon={<FileTextIcon className="w-7 h-7" />}
            title="No Documents"
            description="Offer letters, ID proofs, and other documents will appear here."
          />
        )}

        {activeTab === 'assets' && (
          <EmptyPanel
            icon={<PackageIcon className="w-7 h-7" />}
            title="No Assets"
            description="Laptops, badges, and other assigned assets will appear here."
          />
        )}
      </div>

      {isEditModalOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-base font-bold text-slate-900">Edit Profile</h2>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-5">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                className="w-full px-3 py-2 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
              {editError ? <p className="text-xs text-red-500 mt-1.5">{editError}</p> : null}
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveName}
                disabled={isSavingName}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                {isSavingName ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
