'use client';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Click on your profile icon, select "Change Password", and follow the instructions to set a new password.',
    },
    {
      question: 'How do I view my payslips?',
      answer: 'Navigate to "My Finances" in the sidebar and select "My Pay" tab to view and download your payslips.',
    },
    {
      question: 'How do I apply for leave?',
      answer: 'Use the Leave Management section to request time off. Your manager will review and approve or reject your request.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to "Me" in the navigation menu to view and update your personal profile information.',
    },
    {
      question: 'Who do I contact for technical issues?',
      answer: 'Use the Help section in the top navigation bar, or contact your IT support team for technical assistance.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">

      <div className="p-4 sm:p-8 max-w-3xl">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 group">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                <span>{faq.question}</span>
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </summary>
              <p className="text-gray-600 mt-4 text-sm leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
