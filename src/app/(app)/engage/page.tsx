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
  const [selectedTab, setSelectedTab] = useState('post');
  const [postContent, setPostContent] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '', '']);
  const [pollExpiry, setPollExpiry] = useState('');
  const [praiseEmployee, setPraiseEmployee] = useState('');
  const [praiseContent, setPraiseContent] = useState('');
  const [praiseProject, setPraiseProject] = useState('');

  const handleAddOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handleRemoveOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Engage</h1>
        <p className="text-base text-gray-600">Stay connected with company announcements, polls, and articles</p>
      </div>

      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setSelectedTab('post')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              selectedTab === 'post' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>
            Post
          </button>
          <button
            onClick={() => setSelectedTab('poll')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              selectedTab === 'poll' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z"/></svg>
            Poll
          </button>
          <button
            onClick={() => setSelectedTab('praise')}
            className={`px-1 py-4 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              selectedTab === 'praise' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            Praise
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* POST TAB */}
        {selectedTab === 'post' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your post here and mention your peers"
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            />

            <div className="flex gap-4 my-4 text-gray-400">
              <button className="hover:text-purple-600 transition-colors">@</button>
              <button className="hover:text-purple-600 transition-colors">📷</button>
              <button className="hover:text-purple-600 transition-colors">😊</button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600">
                <option>Organization</option>
              </select>
              <div className="flex gap-3">
                <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POLL TAB */}
        {selectedTab === 'poll' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="What this poll is about"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-6"
            />

            <div className="space-y-3 mb-6">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    placeholder="Add option here"
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddOption}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm mb-6"
            >
              +Add Option
            </button>

            <div className="space-y-4 border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">Poll Expires on</span>
                <input
                  type="date"
                  value={pollExpiry}
                  onChange={(e) => setPollExpiry(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 focus:ring-purple-600" />
                <span className="text-sm text-gray-700">Notify employees</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 focus:ring-purple-600" />
                <span className="text-sm text-gray-700">Anonymous poll</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600">
                <option>Organization</option>
              </select>
              <div className="flex gap-3">
                <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRAISE TAB */}
        {selectedTab === 'praise' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
            <input
              type="text"
              value={praiseEmployee}
              onChange={(e) => setPraiseEmployee(e.target.value)}
              placeholder="Search Employee"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-6"
            />

            <textarea
              value={praiseContent}
              onChange={(e) => setPraiseContent(e.target.value)}
              placeholder="What did the employee do to deserve the praise"
              className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none mb-6"
            />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  🏆
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-purple-600 transition-colors">
                  Select badge
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Projects (optional)</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600">
                  <option>Select project</option>
                </select>
              </div>

              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2">
                📎 Add Attachment
              </button>
              <p className="text-xs text-gray-500">Max number of files allowed is 5</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600">
                <option>Organization</option>
              </select>
              <div className="flex gap-3">
                <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                  Cancel
                </button>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
