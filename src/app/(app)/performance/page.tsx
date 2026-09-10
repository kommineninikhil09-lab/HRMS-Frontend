'use client';

import { useEffect, useState } from 'react';

const StarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18 9 12.41l4 4 6.3-6.29L20 12v-6z" />
  </svg>
);

interface Appraisal {
  id: string;
  cycleId: string;
  status: string;
  appraisalType: string;
  overallRating: string | null;
  averageRating: string | null;
  finalizedAt: string | null;
}

interface Goal {
  id: string;
  goalTitle: string;
  status: string;
  progressPercentage: string;
  targetDate: string | null;
}

interface Cycle {
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

const statusLabel = (status: string) =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'goals' | 'feedback' | 'skills' | 'meetings'>('reviews');
  const [feedbackType, setFeedbackType] = useState<'give' | 'request'>('give');
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const [reviews, setReviews] = useState<Appraisal[]>([]);
  const [cycles, setCycles] = useState<Record<string, string>>({});
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalsError, setGoalsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const [appraisals, cycleList] = await Promise.all([
          fetchJson<Appraisal[]>('/api/performance/appraisals'),
          fetchJson<Cycle[]>('/api/performance/cycles'),
        ]);
        if (cancelled) return;
        setReviews(appraisals);
        setCycles(Object.fromEntries(cycleList.map((c) => [c.id, c.name])));
      } catch (e) {
        if (!cancelled) setReviewsError(e instanceof Error ? e.message : 'Failed to load reviews');
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setGoalsLoading(true);
        setGoalsError(null);
        const data = await fetchJson<Goal[]>('/api/performance/goals');
        if (!cancelled) setGoals(data);
      } catch (e) {
        if (!cancelled) setGoalsError(e instanceof Error ? e.message : 'Failed to load goals');
      } finally {
        if (!cancelled) setGoalsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeGoalsCount = goals.filter((g) => g.status !== 'completed' && g.status !== 'cancelled').length;
  const latestRating = reviews
    .map((r) => r.overallRating ?? r.averageRating)
    .filter((v): v is string => v != null)
    .map(Number)[0];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}

      <div className="p-4 sm:p-8">
        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-blue-600 mb-3 text-lg"><StarIcon /></div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Overall Rating</div>
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {latestRating !== undefined ? `${latestRating}/5` : '—'}
            </div>
            <div className="text-sm text-blue-600">Based on latest review</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-emerald-600 mb-3 text-lg"><TrendingUpIcon /></div>
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Active Goals</div>
            <div className="text-4xl font-bold text-emerald-700 mb-2">{activeGoalsCount}</div>
            <div className="text-sm text-emerald-600">
              {activeGoalsCount === goals.length ? 'All on track' : `${goals.length - activeGoalsCount} completed`}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-purple-600 mb-3 text-lg"><StarIcon /></div>
            <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">Next Review</div>
            <div className="text-4xl font-bold text-purple-700 mb-2">—</div>
            <div className="text-sm text-purple-600">Not yet scheduled</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-5 border-b border-gray-200 overflow-x-auto">
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
            {reviewsLoading && <p className="text-sm text-gray-500">Loading reviews...</p>}
            {reviewsError && !reviewsLoading && <p className="text-sm text-red-600">{reviewsError}</p>}
            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <p className="text-sm text-gray-500">No performance reviews yet.</p>
            )}

            {reviews.map((review) => {
              const rawRating = review.overallRating ?? review.averageRating;
              const hasRating = rawRating != null;
              const rating = hasRating ? Number(rawRating) : 0;

              return (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative">
                  {/* Heritage Accent */}
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{cycles[review.cycleId] ?? 'Performance Review'}</h3>
                        <p className="text-gray-600 mt-1">
                          {review.appraisalType.charAt(0).toUpperCase() + review.appraisalType.slice(1)} review • {statusLabel(review.status)}
                        </p>
                      </div>
                      {hasRating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-5 h-5 ${i < Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 font-bold text-gray-900">{rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            {goalsLoading && <p className="text-sm text-gray-500">Loading goals...</p>}
            {goalsError && !goalsLoading && <p className="text-sm text-red-600">{goalsError}</p>}
            {!goalsLoading && !goalsError && goals.length === 0 && (
              <p className="text-sm text-gray-500">No goals yet.</p>
            )}

            {goals.map((goal) => {
              const progress = Math.round(Number(goal.progressPercentage) || 0);
              return (
                <div key={goal.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{goal.goalTitle}</h3>
                        {goal.targetDate && (
                          <p className="text-sm text-gray-600 mt-1">Due: {new Date(goal.targetDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        goal.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : goal.status === 'cancelled'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {statusLabel(goal.status)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

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
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
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
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
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

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-base font-bold text-slate-900 mb-4">Feedback History</h3>
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
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
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

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3">Recommended Development Areas</h3>
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
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
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
              <h3 className="text-base font-bold text-slate-900">Upcoming 1:1s</h3>
              {[
                { date: 'Aug 28, 2026 at 2:00 PM', manager: 'Sarah Jenkins', status: 'scheduled', topics: 'Q3 review, career goals' },
                { date: 'Sep 4, 2026 at 2:00 PM', manager: 'Sarah Jenkins', status: 'scheduled', topics: 'Project updates' },
              ].map((meeting, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
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
              <h3 className="text-base font-bold text-slate-900">Past 1:1s</h3>
              {[
                { date: 'Aug 21, 2026', manager: 'Sarah Jenkins', notes: 'Discussed H2 roadmap and skill development' },
                { date: 'Aug 14, 2026', manager: 'Sarah Jenkins', notes: 'Performance review prep, career path planning' },
              ].map((meeting, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5">
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
