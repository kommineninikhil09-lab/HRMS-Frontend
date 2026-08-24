'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PerformancePage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('overview');

  const performanceTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'competencies', label: 'Competencies' },
    { id: 'objectives', label: 'Objectives & KRA' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'meetings', label: '1-on-1 Meetings' },
    { id: 'skills', label: 'Skills' },
  ];

  const competencies = [
    { name: 'Communication', rating: 8.5, level: 'Excellent' },
    { name: 'Problem Solving', rating: 8.0, level: 'Excellent' },
    { name: 'Technical Skills', rating: 9.0, level: 'Excellent' },
    { name: 'Team Collaboration', rating: 7.5, level: 'Good' },
    { name: 'Leadership', rating: 7.0, level: 'Good' },
    { name: 'Project Management', rating: 8.0, level: 'Excellent' },
  ];

  const objectives = [
    { id: 1, title: 'Complete Full-Stack Development Course', status: 'In Progress', progress: 65, dueDate: '2026-12-31' },
    { id: 2, title: 'Lead 2 Product Feature Releases', status: 'In Progress', progress: 50, dueDate: '2026-12-31' },
    { id: 3, title: 'Mentor 2 Junior Developers', status: 'Completed', progress: 100, dueDate: '2026-08-15' },
    { id: 4, title: 'Improve Code Quality Metrics by 20%', status: 'In Progress', progress: 75, dueDate: '2026-10-31' },
  ];

  const feedbacks = [
    { id: 1, from: 'Sarah Jenkins (Manager)', date: '2026-08-10', rating: 9, comment: 'Outstanding work on the recent project. Your attention to detail and proactive communication was exceptional.' },
    { id: 2, from: 'John Smith (Peer)', date: '2026-07-25', rating: 8, comment: 'Great collaboration on the API integration. Appreciated your problem-solving approach.' },
    { id: 3, from: 'Emma Davis (Manager)', date: '2026-06-30', rating: 8, comment: 'Strong technical contributions. Keep up the momentum!' },
  ];

  const reviews = [
    { year: '2026 Q2', status: 'Pending', rating: '-', reviewer: 'Sarah Jenkins', type: 'Mid-Year Review' },
    { year: '2025 Annual', status: 'Completed', rating: '8.5/10', reviewer: 'Sarah Jenkins', type: 'Annual Review' },
    { year: '2025 Q4', status: 'Completed', rating: '8.2/10', reviewer: 'Sarah Jenkins', type: 'Quarterly Review' },
  ];

  const meetings = [
    { id: 1, date: '2026-08-15', manager: 'Sarah Jenkins', duration: '30 mins', topics: ['Project Updates', 'Performance Goals'], notes: 'Discussed Q3 objectives and project roadmap.' },
    { id: 2, date: '2026-08-08', manager: 'Sarah Jenkins', duration: '30 mins', topics: ['Career Development', 'Learning Goals'], notes: 'Reviewed course progress and discussed next steps.' },
    { id: 3, date: '2026-08-01', manager: 'Sarah Jenkins', duration: '30 mins', topics: ['Project Updates', 'Blockers'], notes: 'Covered current project status and resolved blockers.' },
  ];

  const skills = [
    { name: 'React.js', level: 'Expert', yearsExperience: 3 },
    { name: 'TypeScript', level: 'Expert', yearsExperience: 2 },
    { name: 'Node.js', level: 'Advanced', yearsExperience: 2 },
    { name: 'PostgreSQL', level: 'Advanced', yearsExperience: 1 },
    { name: 'AWS', level: 'Intermediate', yearsExperience: 1 },
    { name: 'Docker', level: 'Intermediate', yearsExperience: 1 },
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <div className="flex items-center gap-4 mb-2">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Performance</h1>
            <p className="text-base text-gray-600">Track your performance metrics and feedback</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 overflow-x-auto">
        <div className="flex gap-8">
          {performanceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-1 py-4 border-b-2 font-semibold transition-colors whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {/* OVERVIEW TAB */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Overall Performance</h2>
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="10"
                        strokeDasharray={`${2 * 3.14159 * 45 * 0.82}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="text-3xl font-bold text-indigo-600">8.2</div>
                      <div className="text-xs text-gray-600">Overall</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Rating Period: Jan - Aug 2026</p>
                      <p className="text-sm text-gray-600">Last Reviewed: 25 Aug 2026</p>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      You are performing consistently well with strong technical contributions and excellent collaboration skills.
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Objectives */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Current Objectives</h2>
                <div className="space-y-4">
                  {objectives.map((obj) => (
                    <div key={obj.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{obj.title}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(obj.status)}`}>
                          {obj.status}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${obj.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{obj.progress}% Complete</span>
                        <span>Due: {new Date(obj.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Total Feedbacks</div>
                    <div className="text-2xl font-bold text-indigo-600">8</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Avg Rating</div>
                    <div className="text-2xl font-bold text-green-600">8.3/10</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">1-on-1 Meetings</div>
                    <div className="text-2xl font-bold text-blue-600">12</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPETENCIES TAB */}
        {selectedTab === 'competencies' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Your Competencies</h2>
            <div className="space-y-6">
              {competencies.map((comp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{comp.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${getRatingColor(comp.rating)}`}>{comp.rating}/10</span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">{comp.level}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(comp.rating / 10) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OBJECTIVES & KRA TAB */}
        {selectedTab === 'objectives' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Objectives & KRA</h2>
            <div className="space-y-4">
              {objectives.map((obj) => (
                <div key={obj.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-base">{obj.title}</h3>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(obj.status)}`}>
                      {obj.status}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${obj.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{obj.progress}% Complete</span>
                    <span>Due: {new Date(obj.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {selectedTab === 'feedback' && (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{fb.from}</h3>
                    <p className="text-sm text-gray-600">{new Date(fb.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{fb.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* REVIEWS TAB */}
        {selectedTab === 'reviews' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Period</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Reviewer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{review.year}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{review.reviewer}</td>
                      <td className="px-6 py-4 text-sm font-medium text-indigo-600">{review.rating}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`}>
                          {review.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 1-ON-1 MEETINGS TAB */}
        {selectedTab === 'meetings' && (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{meeting.manager}</h3>
                    <p className="text-sm text-gray-600">{new Date(meeting.date).toLocaleDateString()} • {meeting.duration}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Topics:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {meeting.topics.map((topic, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Notes: </span>
                  {meeting.notes}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* SKILLS TAB */}
        {selectedTab === 'skills' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Your Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, idx) => (
                <div key={idx} className="pb-6 border-b border-gray-200 md:last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{skill.name}</h3>
                    <span className="text-xs px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">{skill.level}</span>
                  </div>
                  <p className="text-xs text-gray-600">{skill.yearsExperience} year{skill.yearsExperience !== 1 ? 's' : ''} of experience</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
