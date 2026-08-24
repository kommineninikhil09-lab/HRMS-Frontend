'use client';

import { useState } from 'react';

const EditIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2.15c-.3-1.23-1.31-2.1-2.85-2.1h-4c-1.54 0-2.55.87-2.85 2.1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-2h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1z" />
  </svg>
);

const SchoolIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L1 9v2h2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h2V9L12 3zm6 16H6v-7h12v7zm-5.5-8h3v3h-3z" />
  </svg>
);

const ContactIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2.5 17.5h-11v-11h11v11zm-5.5-13.5c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

const SkillIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-8-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V4l5 5h-5z" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

const tabs = [
  { id: 'about', label: 'ABOUT' },
  { id: 'profile', label: 'PROFILE' },
  { id: 'job', label: 'JOB' },
  { id: 'documents', label: 'DOCUMENTS' },
  { id: 'assets', label: 'ASSETS' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">Me</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Profile</span>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg">
            <EditIcon />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-10">
        <div className="flex items-start gap-8">
          {/* Profile Photo */}
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              NK
            </div>
            <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 border-3 border-white rounded-full shadow-md"></div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Nikhil Kommineni</h1>
            <div className="flex items-center gap-8 text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-blue-600"><BriefcaseIcon /></span>
                <span className="font-[Lato] text-base">Senior Product Designer</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span className="font-[Lato] text-base">London, UK</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-8 text-right">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Employee ID</div>
              <div className="text-xl font-semibold text-gray-900">EMP-0012</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reporting To</div>
              <div className="text-lg font-semibold text-indigo-600">Sarah Jenkins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Distinctive Design */}
      <div className="bg-white border-b border-gray-200 px-8 relative">
        {/* Heritage accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-transparent"></div>

        <div className="flex gap-8">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-5 px-1 border-b-2 font-semibold text-sm transition-all relative ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {/* ABOUT Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-7">
              {/* About Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">About</h2>
                  <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors">
                    <EditIcon />
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed mb-8 font-[Lato]">
                  Hi, I'm Nikhil, a B.Tech Graduate with a strong interest in software development, artificial intelligence, and modern web technologies. I enjoy building scalable applications, solving real-world problems, and continuously learning new technologies. I'm focused on strengthening my skills in Full-Stack Development, collaborating with teams, and understanding industry best practices. I believe in taking ownership of my work, paying attention to detail, and constantly improving through feedback. I'm excited to contribute, learn from experienced professionals, and grow into software engineering. Driven by a commitment to continuous learning and professional growth, I aim to build scalable, user-centric solutions while contributing effectively in collaborative, fast-paced environments.
                </p>

                <div className="space-y-5">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">What I love about my job?</h3>
                    <button className="px-5 py-2.5 border-2 border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-all">
                      Add your response
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">My interests and hobbies</h3>
                    <button className="px-5 py-2.5 border-2 border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-all">
                      Add your response
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-7">
              {/* Skills */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <span className="text-gray-600"><SkillIcon /></span> Skills
                </h2>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-700 font-medium mb-2">No skills added yet</p>
                  <p className="text-sm text-gray-600">Showcase your skills to your colleagues!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-7">
              {/* Personal Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-7 flex items-center gap-2">
                  <span className="text-gray-600"><EditIcon /></span> Personal Details
                </h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date of Birth</div>
                    <div className="text-base font-semibold text-gray-900">14 Oct 1990</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gender</div>
                    <div className="text-base font-semibold text-gray-900">Male</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Marital Status</div>
                    <div className="text-base font-semibold text-gray-900">Married</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nationality</div>
                    <div className="text-base font-semibold text-gray-900">Indian</div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-7 flex items-center gap-2">
                  <span className="text-gray-600"><ContactIcon /></span> Contact Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <span className="text-gray-500"><MailIcon /></span> Work Email
                    </div>
                    <div className="text-base font-semibold text-indigo-600">nikhil.k@company.com</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <span className="text-gray-500"><MailIcon /></span> Personal Email
                    </div>
                    <div className="text-base font-semibold text-indigo-600">nikhil.designs@email.com</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <span className="text-gray-500"><PhoneIcon /></span> Phone Number
                    </div>
                    <div className="text-base font-semibold text-gray-900">+44 7911 123456</div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold text-gray-900 mb-7 flex items-center gap-2">
                  <span className="text-gray-600"><SchoolIcon /></span> Education
                </h2>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-6">Degrees & Certificates</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Branch / Specialization</div>
                      <div className="text-base font-semibold text-gray-900">CSE-AIML</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">CGPA / Percentage</div>
                      <div className="text-base font-semibold text-gray-900">6.5</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Degree</div>
                      <div className="text-base font-semibold text-gray-900">B.Tech</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">University / College</div>
                      <div className="text-base font-semibold text-gray-900">GITAM University, Hyderabad</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Year of Completion</div>
                      <div className="text-base font-semibold text-gray-900">20 Apr 2026</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Year of Joining</div>
                      <div className="text-base font-semibold text-gray-900">17 Aug 2022</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Empty for now */}
            <div></div>
          </div>
        )}

        {/* JOB Tab */}
        {activeTab === 'job' && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              {/* Work Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BriefcaseIcon /> Work Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Department</div>
                    <div className="text-base font-medium text-gray-900">Product & Engineering</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Business Unit</div>
                    <div className="text-base font-medium text-gray-900">Core Platform</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Date of Joining</div>
                    <div className="text-base font-medium text-gray-900">Sep 01, 2022</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Employment Type</div>
                    <div className="text-base font-medium text-gray-900">Full-Time Permanent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Emergency Contacts */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AlertIcon /> Emergency Contacts
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Name</div>
                    <div className="text-base font-medium text-gray-900">Ananya Kommineni</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Relationship</div>
                    <div className="text-base font-medium text-gray-900">Spouse</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Contact Number</div>
                    <div className="text-base font-medium text-gray-900">+44 7911 987654</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <DocumentIcon className="w-12 h-12 mb-4 opacity-30" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Documents</h2>
              <p className="text-gray-600">Your documents will appear here</p>
            </div>
          </div>
        )}

        {/* ASSETS Tab */}
        {activeTab === 'assets' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <PackageIcon className="w-12 h-12 mb-4 opacity-30" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assets</h2>
              <p className="text-gray-600">Your assets will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
