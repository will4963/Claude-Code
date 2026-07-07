import { useState, type FormEvent } from 'react';
import { Mail, MessageSquare, CheckCircle2, Send } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // In production, send to a backend or email service.
    // For this demo we just show a success message.
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  }

  const topics = [
    'Feedback on the app',
    'Report a bug',
    'Request a new workout',
    'Question about an exercise',
    'Account issue',
    'Other',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500/15 rounded-2xl mb-4">
          <Mail className="w-7 h-7 text-orange-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Contact & Feedback</h1>
        <p className="text-gray-400">Have a question, suggestion, or issue? We'd love to hear from you.</p>
      </div>

      {sent ? (
        <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h2 className="text-white font-black text-xl mb-2">Message Sent!</h2>
          <p className="text-gray-400 mb-4">Thank you for reaching out. We'll get back to you as soon as possible.</p>
          <button onClick={() => setSent(false)} className="text-orange-400 hover:text-orange-300 text-sm font-medium">
            Send another message
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Topic</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              >
                <option value="">Select a topic…</option>
                {topics.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind. The more detail, the better!"
                rows={5}
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center gap-2 justify-center"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      )}

      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-bold">Quick Tips</h3>
        </div>
        <ul className="flex flex-col gap-2 text-gray-400 text-sm">
          <li>• For exercise questions, check the instructions in the workout sessions first.</li>
          <li>• If a video isn't loading, try refreshing the page.</li>
          <li>• Your progress is stored in your browser — clearing browser data will reset it.</li>
          <li>• For the best experience, use Chrome or Firefox on mobile or desktop.</li>
        </ul>
      </div>
    </div>
  );
}
