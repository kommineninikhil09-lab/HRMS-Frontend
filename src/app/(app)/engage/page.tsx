'use client';

import { useState } from 'react';

const HeartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function EngagePage() {
  const [selectedTab, setSelectedTab] = useState('announcements');

  const announcements = [
    { id: 1, title: 'Q4 2026 Planning Meeting', date: 'Aug 20', content: 'Join us for our quarterly planning session', author: 'Leadership Team' },
    { id: 2, title: 'Company Picnic This Friday', date: 'Aug 18', content: 'All employees invited to our annual summer picnic', author: 'HR Department' },
  ];

  const polls = [
    { id: 1, title: 'What time should lunch be?', options: ['11:30 AM', '12:00 PM', '12:30 PM'], votes: [45, 78, 32] },
    { id: 2, title: 'Office Culture: Remote vs Hybrid', options: ['Full Remote', 'Hybrid', 'Office Days'], votes: [120, 85, 45] },
  ];

  const articles = [
    { id: 1, title: 'Productivity Tips for Remote Workers', author: 'HR Team', date: 'Aug 10' },
    { id: 2, title: 'Our New Wellness Initiative', author: 'People Team', date: 'Aug 05' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Engage</h1>
        <p className="text-base text-gray-600">Stay connected with company announcements, polls, and articles</p>
      </div>

      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setSelectedTab('announcements')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'announcements' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setSelectedTab('polls')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'polls' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Polls
          </button>
          <button
            onClick={() => setSelectedTab('articles')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors ${
              selectedTab === 'articles' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Articles
          </button>
        </div>
      </div>

      <div className="p-8">
        {selectedTab === 'announcements' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-blue-900 font-semibold mb-2">📢 Company Announcements</p>
              <p className="text-blue-800">Stay informed about important company news and updates</p>
            </div>
            {announcements.map(ann => (
              <div key={ann.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{ann.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{ann.author}</p>
                  </div>
                  <span className="text-sm text-gray-500">{ann.date}</span>
                </div>
                <p className="text-gray-600">{ann.content}</p>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'polls' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-green-900 font-semibold mb-2">📊 Company Polls</p>
              <p className="text-green-800">Share your opinion on company matters</p>
            </div>
            {polls.map(poll => (
              <div key={poll.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">{poll.title}</h3>
                <div className="space-y-3">
                  {poll.options.map((option, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{option}</span>
                        <span className="text-sm text-gray-600">{poll.votes[idx]} votes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{width: `${(poll.votes[idx] / Math.max(...poll.votes)) * 100}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'articles' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <p className="text-purple-900 font-semibold mb-2">📚 Knowledge Base</p>
              <p className="text-purple-800">Read articles to improve your work experience</p>
            </div>
            {articles.map(article => (
              <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{article.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>By {article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <div className="text-purple-600">→</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
