import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, Mail, Phone } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}

const initialTickets: SupportTicket[] = [
  { id: 'TKT-7821', subject: 'Locker room 3 lock issue', category: 'Facilities', priority: 'Medium', description: 'The lock won\'t release the locker key.', status: 'In Progress', date: '10 Jul 2026' },
  { id: 'TKT-7612', subject: 'Membership upgrade billing', category: 'Billing', priority: 'Low', description: 'Requesting invoice detail for premium upgrade.', status: 'Resolved', date: '04 Jul 2026' },
];

export default function HelpPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'ticket';

  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);

  // Form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Facilities');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState('');
  const [messageSuccess, setMessageSuccess] = useState(false);

  // Sync tab search param if none exists
  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'ticket' });
    }
  }, [searchParams, setSearchParams]);

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      priority,
      description,
      status: 'Open',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSubject('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    setMessageSuccess(true);
    setMessage('');
    setTimeout(() => setMessageSuccess(false), 3000);
  };

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Help & Support</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Submit requests, review support tickets, or contact the administrative office directly.</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'ticket', label: 'Raise Ticket' },
          { id: 'track', label: 'Track Requests' },
          { id: 'contact', label: 'Contact Administration' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {/* Raise Ticket View */}
        {activeTab === 'ticket' && (
          <div className="rounded-[2.0rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl animate-in fade-in duration-300">
            <h3 className="text-xl font-semibold text-slate-900">Raise a Support Ticket</h3>
            <p className="mt-1 text-sm text-slate-500">Provide details about your query. Our administrators will review and update your request status.</p>

            {success && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-semibold">
                Ticket submitted successfully! You can track its status in the "Track Requests" tab.
              </div>
            )}

            <form onSubmit={handleAddTicket} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Locker room access issue"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="Facilities">Facilities & Equipment</option>
                    <option value="Billing">Billing & Membership</option>
                    <option value="Coaching">Coaching & Training</option>
                    <option value="Portal">Website & App Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Priority *</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 rounded-xl py-2 text-sm font-semibold border transition-all ${
                          priority === p
                            ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please detail your issue or request here..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 h-28 resize-none"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-300/30 hover:opacity-95 transition-opacity"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Track Requests View */}
        {activeTab === 'track' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {tickets.length === 0 ? (
              <div className="rounded-[2.0rem] border border-slate-200/70 bg-slate-50/80 p-8 text-center text-slate-500">
                No active support requests found.
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="rounded-[1.6rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-400">{t.id} • {t.date}</span>
                      <h4 className="font-semibold text-slate-900 text-base mt-1">{t.subject}</h4>
                      <p className="mt-2 text-sm text-slate-600">{t.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Category: {t.category}</span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Priority: {t.priority}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : t.status === 'In Progress'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Contact Administration View */}
        {activeTab === 'contact' && (
          <div className="grid gap-4 md:grid-cols-2 animate-in fade-in duration-300">
            <div className="space-y-4">
              <PageCard title="Direct Contact" subtitle="Administrative Office">
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <div className="rounded-xl bg-brand-50 p-2.5 text-brand-700"><Phone className="h-5 w-5" /></div>
                    <div>
                      <p className="font-semibold text-slate-800">Phone Support</p>
                      <p className="text-slate-500 mt-0.5">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <div className="rounded-xl bg-brand-50 p-2.5 text-brand-700"><Mail className="h-5 w-5" /></div>
                    <div>
                      <p className="font-semibold text-slate-800">Email Address</p>
                      <p className="text-slate-500 mt-0.5">office@sportsclub.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <div className="rounded-xl bg-brand-50 p-2.5 text-brand-700"><CalendarDays className="h-5 w-5" /></div>
                    <div>
                      <p className="font-semibold text-slate-800">Operational Hours</p>
                      <p className="text-slate-500 mt-0.5">Mon - Fri: 08:00 - 20:00 • Sat: 09:00 - 17:00</p>
                    </div>
                  </div>
                </div>
              </PageCard>
            </div>

            <div className="rounded-[2.0rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-slate-900">Send a Quick Message</h3>
              <p className="mt-1 text-sm text-slate-500 font-medium">Have a minor query? Drop a message and our receptionist will reply to your registered email.</p>

              {messageSuccess && (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 font-semibold">
                  Message sent successfully!
                </div>
              )}

              <form onSubmit={handleSendMessage} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Message *</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 h-28 resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-300/30 hover:opacity-95 transition-opacity"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
}
