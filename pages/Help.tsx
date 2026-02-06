import React from 'react';
import { HelpCircle, BookOpen, MessageCircle, FileText } from 'lucide-react';

export default function Help() {
  const faqs = [
    {
      question: "How do I add a new farm or unit?",
      answer: "Navigate to the 'Crops & Farms' section from the sidebar. If you are an Admin, you will see a '+ New Farm' button at the top right. Click it to enter details."
    },
    {
      question: "How do staff submit expenses?",
      answer: "Staff can submit expenses via the 'Finance' tab using the 'Request Funds' button. This creates a requisition that Admins must approve before it affects the balance."
    },
    {
      question: "Why is my Export Order pending?",
      answer: "If a Staff member creates an export order, it enters a 'Pending Approval' state. An Admin must review and approve it in the Exports section to finalize the inventory deduction and financial record."
    },
    {
      question: "How do I manage inventory stock?",
      answer: "Go to the 'Inventory' page. Use the 'Stock In' button to add new items. Stock is automatically deducted when you create approved Export Orders."
    },
    {
        question: "Can I change the application theme?",
        answer: "Yes! Go to Settings in the sidebar and toggle between Light and Dark mode under the Appearance section."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">How can we help you?</h1>
        <p className="text-slate-500 dark:text-slate-400">Find answers and guidance for managing your agricultural business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center hover:shadow-md transition-all">
              <BookOpen size={32} className="mx-auto text-primary-600 mb-4" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">User Guide</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Detailed documentation on all features.</p>
              <button className="text-primary-600 font-medium text-sm hover:underline">Read Guide</button>
          </div>
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center hover:shadow-md transition-all">
              <MessageCircle size={32} className="mx-auto text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Support Chat</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Talk to our support team directly.</p>
              <button className="text-blue-600 font-medium text-sm hover:underline">Start Chat</button>
          </div>
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center hover:shadow-md transition-all">
              <FileText size={32} className="mx-auto text-purple-600 mb-4" />
              <h3 className="font-bold text-slate-800 dark:text-white mb-2">Tutorials</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Video guides for common tasks.</p>
              <button className="text-purple-600 font-medium text-sm hover:underline">Watch Videos</button>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
              <HelpCircle size={24} className="mr-2 text-slate-400" /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
              {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">{faq.question}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}