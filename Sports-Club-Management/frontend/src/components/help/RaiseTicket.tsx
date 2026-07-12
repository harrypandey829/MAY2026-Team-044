import { useState } from 'react';

interface RaiseTicketProps {
  onAddTicket: (subject: string, category: string, priority: string, description: string) => void;
}

export default function RaiseTicket({ onAddTicket }: RaiseTicketProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Facilities');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    onAddTicket(subject, category, priority, description);
    setSubject('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="rounded-[2.0rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl animate-in fade-in duration-300">
      <h3 className="text-xl font-semibold text-slate-900">Raise a Support Ticket</h3>
      <p className="mt-1 text-sm text-slate-500">Provide details about your query. Our administrators will review and update your request status.</p>
      
      {success && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 font-semibold animate-in fade-in">
          Ticket submitted successfully! You can track its status in the "Track Requests" tab.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Subject *</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Locker room access issue"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-all ${
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
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 h-28 resize-none"
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
  );
}
