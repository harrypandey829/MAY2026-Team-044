import { motion } from 'framer-motion';

interface EventRow {
  title: string;
  sport: string;
  date: string;
  venue: string;
  status: 'Confirmed' | 'Planning' | 'Cancelled';
  participants: number;
}

const events: EventRow[] = [
  { title: 'Friday Night Football', sport: 'Football', date: '12 Jul 2026', venue: 'North Pitch', status: 'Confirmed', participants: 44 },
  { title: 'Community Swim Meet', sport: 'Swimming', date: '15 Jul 2026', venue: 'Olympic Pool', status: 'Planning', participants: 28 },
  { title: 'Badminton Cup', sport: 'Badminton', date: '18 Jul 2026', venue: 'Arena Hall B', status: 'Confirmed', participants: 36 },
  { title: 'Cricket Skills Clinic', sport: 'Cricket', date: '20 Jul 2026', venue: 'Cricket Ground', status: 'Planning', participants: 24 },
];

export default function EventsTable() {
  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Event Management</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Upcoming club events</h2>
        </div>
        <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-300/40">Create New Event</button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-semibold">Title</th>
              <th className="pb-3 font-semibold">Sport</th>
              <th className="pb-3 font-semibold">Date</th>
              <th className="pb-3 font-semibold">Venue</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Participants</th>
              <th className="pb-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <motion.tr
                key={event.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="border-b border-slate-100 last:border-none"
              >
                <td className="py-3 font-semibold text-slate-800">{event.title}</td>
                <td className="py-3 text-slate-600">{event.sport}</td>
                <td className="py-3 text-slate-600">{event.date}</td>
                <td className="py-3 text-slate-600">{event.venue}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : event.status === 'Planning' ? 'bg-sky-50 text-sky-700' : 'bg-rose-50 text-rose-700'}`}>{event.status}</span>
                </td>
                <td className="py-3 text-slate-600">{event.participants}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Cancel</button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">View</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
