'use client';

import { useState } from 'react';
import { useCallback } from 'react';

const StarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18 9 12.41l4 4 6.3-6.29L20 12v-6z" />
  </svg>
);

const reviews = [
  {
    id: 1,
    reviewer: 'Sarah Jenkins',
    role: 'Manager',
    period: 'Q3 2026',
    rating: 4.5,
    feedback: 'Exceptional technical skills and great team collaboration. Continue working on communication clarity.',
    status: 'completed',
  },
  {
    id: 2,
    reviewer: 'HR Department',
    role: 'HR Lead',
    period: 'Q2 2026',
    rating: 4,
    feedback: 'Strong performance this quarter. Great progress on your development goals.',
    status: 'completed',
  },
];

const goals = [
  {
    id: 1,
    title: 'Complete Advanced TypeScript Course',
    status: 'in_progress',
    progress: 65,
    dueDate: '2026-12-31',
    owner: 'You',
  },
  {
    id: 2,
    title: 'Lead 2 Cross-functional Projects',
    status: 'in_progress',
    progress: 50,
    dueDate: '2026-12-31',
    owner: 'You',
  },
  {
    id: 3,
    title: 'Improve Code Review Quality',
    status: 'in_progress',
    progress: 80,
    dueDate: '2026-12-31',
    owner: 'You',
  },
];

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'goals' | 'feedback' | 'skills' | 'meetings'>('reviews');
  const [feedbackType, setFeedbackType] = useState<'give' | 'request'>('give');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Performance</h1>
        <p className="text-base text-gray-600">Track your reviews, goals, and career development</p>
      </div>

      <div className="p-8">
        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 mb-3 text-lg"><StarIcon /></div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Overall Rating</div>
            <div className="text-4xl font-bold text-blue-700 mb-2">4.5/5</div>
            <div className="text-sm text-blue-600">Based on latest review</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-emerald-600 mb-3 text-lg"><TrendingUpIcon /></div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Active Goals</div>
            <div className="text-4xl font-bold text-emerald-700 mb-2">3</div>
            <div className="text-sm text-emerald-600">All on track</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-purple-600 mb-3 text-lg"><StarIcon /></div>
            <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Next Review</div>
            <div className="text-4xl font-bold text-purple-700 mb-2">Dec 15</div>
            <div className="text-sm text-purple-600">Q4 performance review</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'reviews', label: 'Performance Reviews' },
            { id: 'goals', label: 'Development Goals' },
            { id: 'feedback', label: 'Feedback' },
            { id: 'skills', label: 'Skills' },
            { id: 'meetings', label: '1:1 Meetings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative">
                {/* Heritage Accent */}
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{review.period} Performance Review</h3>
                      <p className="text-gray-600 mt-1">by {review.reviewer} • {review.role}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(review.rating)
                              ? 'text-amber-400'
                              : i < review.rating
                              ? 'text-amber-300'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-bold text-gray-900">{review.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{review.feedback}</p>

                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">
                      View Full Review
                    </button>
                    <button className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
                      Discuss with Manager
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Due: {goal.dueDate}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      goal.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {goal.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-bold text-gray-900">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all text-sm">
                      Update Progress
                    </button>
                    <button className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all text-sm">
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Goal Button */}
            <button className="w-full p-6 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-purple-600 font-semibold">
              <span className="text-2xl">+</span> Add New Goal
            </button>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFeedbackType('give')}
                className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                  feedbackType === 'give'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Give Feedback
              </button>
              <button
                onClick={() => setFeedbackType('request')}
                className={`px-6 py-3 font-semibold rounded-lg transition-all ${
                  feedbackType === 'request'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Request Feedback
              </button>
            </div>

            {feedbackType === 'give' && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Give Feedback</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">To</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Select a colleague</option>
                      <option>Sarah Jenkins</option>
                      <option>Marcus Kinsley</option>
                      <option>David Chen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Select category</option>
                      <option>Technical Skills</option>
                      <option>Communication</option>
                      <option>Leadership</option>
                      <option>Collaboration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Feedback</label>
                    <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows={5} placeholder="Share constructive feedback..."></textarea>
                  </div>
                  <button className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">
                    Send Feedback
                  </button>
                </div>
              </div>
            )}

            {feedbackType === 'request' && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Request Feedback</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">From</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Select a person</option>
                      <option>Sarah Jenkins (Manager)</option>
                      <option>Marcus Kinsley (VP Engineering)</option>
                      <option>Team Members</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Focus Area</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Select area</option>
                      <option>Overall Performance</option>
                      <option>Technical Skills</option>
                      <option>Communication</option>
                      <option>Leadership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Due Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  </div>
                  <button className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">
                    Request Feedback
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Feedback History</h3>
              <div className="space-y-4">
                {[
                  { from: 'Sarah Jenkins', date: '2 weeks ago', category: 'Communication', sentiment: 'positive' },
                  { from: 'Marcus Kinsley', date: '1 month ago', category: 'Technical Skills', sentiment: 'positive' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">From: {item.from}</span>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        item.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.sentiment}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.category} • {item.date}</p>
                    <p className="text-sm text-gray-700">Great work on the project presentation and team collaboration...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Skills Assessment</h3>
              <div className="space-y-6">
                {[
                  { skill: 'TypeScript', selfRating: 4, managerRating: 4, importance: 'Critical' },
                  { skill: 'React', selfRating: 4, managerRating: 5, importance: 'Critical' },
                  { skill: 'System Design', selfRating: 3, managerRating: 4, importance: 'High' },
                  { skill: 'Leadership', selfRating: 3, managerRating: 3, importance: 'High' },
                  { skill: 'Communication', selfRating: 4, managerRating: 4, importance: 'High' },
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.skill}</h4>
                        <p className="text-xs text-gray-600">{item.importance}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Your Rating</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full ${i < item.selfRating ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Manager Rating</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full ${i < item.managerRating ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 w-full px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all">
                + Add New Skill
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Development Areas</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">→</span>
                  <span className="text-gray-700">Deepen expertise in Cloud Architecture (AWS/GCP)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">→</span>
                  <span className="text-gray-700">Strengthen stakeholder management skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1">→</span>
                  <span className="text-gray-700">Mentor junior engineers on your team</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 1:1 Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <button
                onClick={() => setShowMeetingForm(!showMeetingForm)}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
              >
                + Schedule 1:1 Meeting
              </button>
            </div>

            {showMeetingForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule 1:1 Meeting</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">With</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Sarah Jenkins (Manager)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                      <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Time</label>
                      <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Duration</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Topics to Discuss</label>
                    <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows={4} placeholder="Add topics for the meeting..."></textarea>
                  </div>
                  <button className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">
                    Schedule Meeting
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Upcoming 1:1s</h3>
              {[
                { date: 'Aug 28, 2026 at 2:00 PM', manager: 'Sarah Jenkins', status: 'scheduled', topics: 'Q3 review, career goals' },
                { date: 'Sep 4, 2026 at 2:00 PM', manager: 'Sarah Jenkins', status: 'scheduled', topics: 'Project updates' },
              ].map((meeting, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{meeting.date}</p>
                      <p className="text-sm text-gray-600 mt-1">with {meeting.manager}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {meeting.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">Topics: {meeting.topics}</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all">
                      Join Meeting
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Past 1:1s</h3>
              {[
                { date: 'Aug 21, 2026', manager: 'Sarah Jenkins', notes: 'Discussed H2 roadmap and skill development' },
                { date: 'Aug 14, 2026', manager: 'Sarah Jenkins', notes: 'Performance review prep, career path planning' },
              ].map((meeting, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="font-semibold text-gray-900">{meeting.date}</p>
                  <p className="text-sm text-gray-600 mt-1">with {meeting.manager}</p>
                  <p className="text-sm text-gray-700 mt-3">{meeting.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
