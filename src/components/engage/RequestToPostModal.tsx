'use client';

import { useState } from 'react';

/* ------------------------------ request modal ------------------------------ */

export const requestTypes = ['Announcement', 'Poll', 'Praise'] as const;
export type RequestType = (typeof requestTypes)[number];

const praiseBadges = [
  '🌟 Above & Beyond',
  '🏆 Team Player',
  '🚀 Ship It',
  '💡 Bright Idea',
  '🤝 Great Collaborator',
  '🛟 Clutch Save',
];

const fieldClass =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400';
const labelClass = 'block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5';

export function RequestToPostModal({
  onClose,
  onSubmit,
  initialType = 'Announcement',
}: {
  onClose: () => void;
  onSubmit: (type: string, title: string) => void;
  initialType?: RequestType;
}) {
  const [type, setType] = useState<RequestType>(initialType);
  const [audience, setAudience] = useState('Organization');
  const [reviewerNote, setReviewerNote] = useState('');

  // Announcement
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);

  // Poll
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [closesOn, setClosesOn] = useState('');
  const [multiChoice, setMultiChoice] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  // Praise
  const [recipient, setRecipient] = useState('');
  const [badge, setBadge] = useState(praiseBadges[0]);
  const [message, setMessage] = useState('');
  const [project, setProject] = useState('');

  const updateOption = (i: number, v: string) => setOptions((o) => o.map((x, idx) => (idx === i ? v : x)));
  const addOption = () => setOptions((o) => (o.length >= 6 ? o : [...o, '']));
  const removeOption = (i: number) => setOptions((o) => (o.length <= 2 ? o : o.filter((_, idx) => idx !== i)));

  const filledOptions = options.map((o) => o.trim()).filter(Boolean);

  const canSubmit =
    type === 'Announcement'
      ? title.trim().length > 3 && body.trim().length > 0
      : type === 'Poll'
        ? question.trim().length > 3 && filledOptions.length >= 2
        : recipient.trim().length > 0 && message.trim().length > 0;

  const derivedTitle =
    type === 'Announcement' ? title.trim() : type === 'Poll' ? question.trim() : `Praise for ${recipient.trim()}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-900">Request to post</h2>
            <p className="text-xs text-gray-500 mt-0.5">The People Team reviews and publishes approved requests.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className={labelClass}>Type</label>
            <div className="grid grid-cols-3 gap-2">
              {requestTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-2 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                    type === t
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-slate-600 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className={fieldClass}>
              <option>Organization</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>People Team</option>
            </select>
          </div>

          {/* Announcement fields */}
          {type === 'Announcement' ? (
            <>
              <div>
                <label className={labelClass}>Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Office closed for Diwali, Oct 29–31"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Announcement body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the full announcement as it should appear."
                  className={`${fieldClass} h-28 resize-none`}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Request this be pinned to the top
              </label>
            </>
          ) : null}

          {/* Poll fields */}
          {type === 'Poll' ? (
            <>
              <div>
                <label className={labelClass}>Poll question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Which week works best for the offsite?"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Options</label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                        className={fieldClass}
                      />
                      <button
                        onClick={() => removeOption(i)}
                        disabled={options.length <= 2}
                        className="px-2 text-gray-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-gray-400"
                        aria-label="Remove option"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                {options.length < 6 ? (
                  <button onClick={addOption} className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-700">
                    + Add option
                  </button>
                ) : null}
              </div>
              <div>
                <label className={labelClass}>Closes on</label>
                <input type="date" value={closesOn} onChange={(e) => setClosesOn(e.target.value)} className={fieldClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={multiChoice}
                    onChange={(e) => setMultiChoice(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Allow selecting multiple options
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Keep responses anonymous
                </label>
              </div>
            </>
          ) : null}

          {/* Praise fields */}
          {type === 'Praise' ? (
            <>
              <div>
                <label className={labelClass}>Who are you praising?</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Search a colleague or team"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Badge</label>
                <select value={badge} onChange={(e) => setBadge(e.target.value)} className={fieldClass}>
                  {praiseBadges.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What did they do that deserves recognition?"
                  className={`${fieldClass} h-24 resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Project (optional)</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="e.g. Payroll Revamp"
                  className={fieldClass}
                />
              </div>
            </>
          ) : null}

          <div>
            <label className={labelClass}>Note for the reviewer (optional)</label>
            <textarea
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Context, timing, or anything the People Team should know."
              className={`${fieldClass} h-16 resize-none`}
            />
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5 sticky bottom-0 bg-white pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-slate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(type, derivedTitle)}
            disabled={!canSubmit}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Send for approval
          </button>
        </div>
      </div>
    </div>
  );
}
