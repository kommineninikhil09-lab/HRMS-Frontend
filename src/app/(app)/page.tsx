'use client';

import React, { useState } from 'react';

const HomeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 12l9-9 9 9h-2v7a2 2 0 01-2 2h-10a2 2 0 01-2-2v-7H3z" />
  </svg>
);

const PersonIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5zm0 10c3.86 0 7 1.79 7 4v3H5v-3c0-2.21 3.14-4 7-4z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.83-2.83-1.41 1.41L10.5 17l4.96-6.29-1.46-1.42z" />
  </svg>
);

const TeamIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2.15c-.3-1.23-1.31-2.1-2.85-2.1h-4c-1.54 0-2.55.87-2.85 2.1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-2h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

const HandshakeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm3-4c0 .83-.67 1.5-1.5 1.5S15 9.33 15 8.5 15.67 7 16.5 7 18 7.67 18 8.5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const CakeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7-2h14V5H7v14z" />
  </svg>
);

const GiftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2.15c-.3-1.23-1.31-2.1-2.85-2.1h-4c-1.54 0-2.55.87-2.85 2.1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-2h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" />
  </svg>
);

const VoteIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 7h2v13h-2zm4-4h2v17h-2zM7 10h2v10H7z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.5-3 5h2c0-2.5 3-3 3-5 0-2.21-1.79-4-4-4z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.64l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.5-.41h-3.84c-.26 0-.46.17-.49.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.22-.07.49.12.64l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.64l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.5.41h3.84c.26 0 .46-.17.49-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.64l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('organization');

  return (
    <div className="flex flex-col h-full bg-gray-50 font-['Lato']">
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-gray-200 px-8 py-5 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-8 flex-1">
            <h1 className="text-sm font-bold text-gray-900 uppercase tracking-wide">HRMS Portal</h1>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search (ALT+K)"
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
                <span className="absolute right-3 top-3 text-gray-400"><SearchIcon /></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Notifications"><BellIcon /></button>
            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Help"><HelpIcon /></button>
            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Settings"><SettingsIcon /></button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                NK
              </div>
              <div className="text-xs">
                <div className="font-semibold text-gray-900">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Welcome Section */}
          <div className="bg-white border-b border-gray-200 px-8 py-7">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Nikhil</h2>
            <p className="text-base text-gray-600">Here's what's happening in your organization today</p>
          </div>

          {/* Main Grid */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="col-span-3 space-y-6">
                {/* Inbox */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-sm font-semibold text-gray-900">Inbox</h3>
                    <span className="text-gray-400"><MailIcon /></span>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">5</div>
                    <p className="text-sm text-gray-600 mb-5">Tasks pending your action</p>
                    <button className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                      Take Action
                    </button>
                  </div>
                </div>

                {/* Time Today */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-sm font-semibold text-gray-900">Time Today</h3>
                    <span className="text-gray-400"><ClockIcon /></span>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 font-mono mb-2">04:32</div>
                    <p className="text-sm text-gray-600 mb-5">Clocked in at 09:00 AM</p>
                    <button className="w-full border-2 border-yellow-400 text-yellow-600 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-yellow-50 transition-all">
                      ⏸ Take Break
                    </button>
                  </div>
                </div>

                {/* Holidays */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-gray-900">Holidays</h3>
                    <a href="#" className="text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors">View All</a>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">25</div>
                      <div className="text-xs text-gray-600 mt-1">DEC<br/>Monday</div>
                    </div>
                    <div className="flex-1 flex items-center text-gray-700 text-sm font-medium">
                      Christmas Day
                    </div>
                  </div>
                </div>

                {/* On Leave */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">On Leave Today (2)</h3>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold shadow-sm">👤</div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold shadow-sm">👤</div>
                  </div>
                </div>
              </div>

              {/* Center Column */}
              <div className="col-span-6 space-y-6">
                {/* Stats Row - Distinctive Design */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <CakeIcon />, value: '4', label: 'Birthdays', accent: 'from-amber-50 to-orange-50', border: 'border-amber-200', text: 'text-amber-600' },
                    { icon: <GiftIcon />, value: '2', label: 'Anniversaries', accent: 'from-rose-50 to-pink-50', border: 'border-rose-200', text: 'text-rose-600' },
                    { icon: <PersonIcon />, value: '7', label: 'New Joiners', accent: 'from-emerald-50 to-teal-50', border: 'border-emerald-200', text: 'text-emerald-600' },
                  ].map((stat) => (
                    <div key={stat.label} className={`bg-gradient-to-br ${stat.accent} rounded-xl border ${stat.border} p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
                      {/* Signature accent line */}
                      <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${stat.text} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                      <div className={`text-gray-600 mb-3 text-lg group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                      <div className={`text-3xl font-bold ${stat.text} mb-1`}>{stat.value}</div>
                      <div className="text-xs text-gray-700 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Share Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">NK</div>
                    <input
                      type="text"
                      placeholder="Share something with your team..."
                      className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 font-[Lato]"
                    />
                  </div>
                  <div className="flex gap-6 pt-4 border-t border-gray-200 text-xs font-medium text-gray-600">
                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><DocumentIcon /> Post</button>
                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><VoteIcon /> Poll</button>
                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><StarIcon /> Praise</button>
                  </div>
                </div>

                {/* Feed */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* Tabs */}
                  <div className="flex gap-8 mb-6 pb-4 border-b border-gray-200">
                    {['Organization', 'Technology'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`text-sm font-semibold pb-3 border-b-2 transition-all ${
                          activeTab === tab.toLowerCase()
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-600 border-transparent hover:text-gray-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-4">
                    {[
                      {
                        icon: <BuildingIcon />,
                        title: 'HR Department',
                        time: '2 hours ago',
                        text: 'Welcome to the new Quarter! We have exciting updates regarding the new performance review cycle. Please check your inbox for detailed instructions.',
                        likes: '24',
                        comments: '5',
                      },
                      {
                        icon: <BuildingIcon />,
                        title: 'IT Support',
                        time: '5 hours ago',
                        text: 'Scheduled maintenance for the internal network will take place this Saturday from 12:00 AM to 04:00 AM. Expect intermittent connectivity issues.',
                        likes: '12',
                        comments: '3',
                      },
                    ].map((post, idx) => (
                      <div key={idx} className={idx > 0 ? 'pt-4 border-t border-gray-100' : ''}>
                        <div className="flex gap-3">
                          <div className="text-gray-600">{post.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-gray-900">{post.title}</h4>
                              <span className="text-xs text-gray-500">{post.time}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2 leading-relaxed">{post.text}</p>
                            <div className="flex gap-3 text-xs text-gray-600">
                              <span>👍 {post.likes}</span>
                              <span>💬 {post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-3">
                {/* Announcements */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2"><span className="text-gray-500"><BellIcon /></span> Announcements</h3>
                  <div className="space-y-6">
                    {[
                      {
                        color: 'blue',
                        title: 'Policy Update',
                        subtitle: 'Updated Work From Home Guidelines',
                        desc: 'Effective starting next month. Please review the updated handbook.',
                      },
                      {
                        color: 'green',
                        title: 'Event',
                        subtitle: 'Annual Townhall 2024',
                        desc: 'Join us on Friday at 3 PM in the main cafeteria or via Zoom.',
                      },
                    ].map((announce, idx) => (
                      <div key={idx} className={idx > 0 ? 'pt-6 border-t border-gray-200' : ''}>
                        <div className={`w-1.5 h-8 rounded-full mb-3 ${announce.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                        <h4 className="text-sm font-bold text-gray-900 mb-0.5">{announce.title}</h4>
                        <p className="text-sm font-semibold text-gray-900 mb-1.5">{announce.subtitle}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{announce.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-7 py-2.5 text-xs text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                    View All Announcements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
