'use client';

import { useState } from 'react';

const MailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const messages = [
  {
    id: 1,
    from: 'Sarah Jenkins',
    title: 'Performance Review Scheduled',
    preview: 'Your Q3 performance review is scheduled for Aug 28 at 2:00 PM...',
    time: '2 hours ago',
    read: false,
    type: 'review',
  },
  {
    id: 2,
    from: 'HR Department',
    title: 'Updated Leave Policy',
    preview: 'We\'ve updated our leave policy effective from next month...',
    time: '5 hours ago',
    read: false,
    type: 'policy',
  },
  {
    id: 3,
    from: 'Team Lead',
    title: 'Project Kickoff Meeting',
    preview: 'Joining us for the new client project kickoff tomorrow at 10 AM?...',
    time: '1 day ago',
    read: true,
    type: 'meeting',
  },
  {
    id: 4,
    from: 'Nikhil Kommineni',
    title: 'Expense Report Approval',
    preview: 'Your expense report for the recent client visit has been approved...',
    time: '2 days ago',
    read: true,
    type: 'expense',
  },
];

export default function InboxPage() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-['Lato']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-base text-gray-600">Stay updated with important messages and notifications</p>
      </div>

      <div className="flex h-screen">
        {/* Messages List */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedMessage === msg.id
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {!msg.read && (
                    <div className="w-2.5 h-2.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${msg.read ? 'text-gray-900' : 'text-gray-900 font-bold'}`}>
                        {msg.from}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        msg.type === 'review' ? 'bg-amber-100 text-amber-700' :
                        msg.type === 'policy' ? 'bg-blue-100 text-blue-700' :
                        msg.type === 'meeting' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {msg.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mt-1">{msg.title}</p>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{msg.preview}</p>
                    <p className="text-xs text-gray-500 mt-2">{msg.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedMessage ? (
            (() => {
              const msg = messages.find(m => m.id === selectedMessage);
              if (!msg) return null;
              return (
                <>
                  <div className="border-b border-gray-200 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{msg.title}</h2>
                        <p className="text-gray-600">From: <span className="font-semibold text-gray-900">{msg.from}</span></p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        NK
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <ClockIcon /> {msg.time}
                      </p>
                      {msg.read && (
                        <p className="text-sm text-emerald-600 flex items-center gap-2">
                          <CheckIcon /> Read
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 p-8 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {msg.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        Please review and take necessary action at your earliest convenience.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-8 flex gap-4">
                    <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all">
                      Mark as Done
                    </button>
                    <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
                      Archive
                    </button>
                  </div>
                </>
              );
            })()
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MailIcon className="text-gray-400 w-8 h-8" />
                </div>
                <p className="text-gray-600 font-medium">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
