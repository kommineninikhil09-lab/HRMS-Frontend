'use client';

import { useState } from 'react';

const PhoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const teamMembers = [
  {
    id: 1,
    name: 'Marcus Kinsley',
    role: 'VP of Engineering',
    department: 'Engineering',
    email: 'm.kinsley@company.com',
    phone: '+44 7911 123456',
    status: 'active',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Senior Product Designer',
    department: 'Design & UX',
    email: 'sarah.jenkins@company.com',
    phone: '+44 7911 654321',
    status: 'active',
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'Financial Analyst',
    department: 'Finance',
    email: 'd.chen@company.com',
    phone: '+44 7911 789123',
    status: 'active',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Senior Engineer',
    department: 'Engineering',
    email: 'j.wilson@company.com',
    phone: '+44 7911 456789',
    status: 'active',
  },
];

const avatarColors = ['from-blue-600 to-indigo-600', 'from-emerald-600 to-teal-600', 'from-purple-600 to-indigo-600', 'from-rose-600 to-pink-600'];

export default function TeamPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Team</h1>
            <p className="text-base text-gray-600">Connect with your team members and collaborate</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {view === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={member.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group relative">
                {/* Heritage Accent */}
                <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${avatarColors[idx % avatarColors.length]} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                {/* Header */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className={`w-16 h-16 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4 group-hover:scale-110 transition-transform`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                  <p className="text-xs text-gray-500 mt-2">{member.department}</p>
                </div>

                {/* Contact */}
                <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                  <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
                    <MailIcon /> {member.email}
                  </a>
                  <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors">
                    <PhoneIcon /> {member.phone}
                  </a>
                </div>

                {/* Action */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <button className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-sm">
                    Send Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Department</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-900">Phone</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, idx) => (
                  <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-lg flex items-center justify-center text-white font-bold text-xs`}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{member.role}</td>
                    <td className="px-6 py-4 text-gray-600">{member.department}</td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${member.email}`} className="text-purple-600 hover:text-purple-700 text-sm">
                        {member.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`tel:${member.phone}`} className="text-purple-600 hover:text-purple-700 text-sm">
                        {member.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-sm">
                        Message
                      </button>
                    </td>
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
