import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import eventService, { type Event } from '../../services/eventService';

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getAll()
      .then((data) => setEvents(data.slice(0, 10)))
      .finally(() => setLoading(false));
  }, []);

  function getStatusClass(status: Event['event_status']) {
    if (status === 'Scheduled') return 'bg-emerald-50 text-emerald-700';
    if (status === 'Completed') return 'bg-sky-50 text-sky-700';
    return 'bg-rose-50 text-rose-700';
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Event Management</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Upcoming club events</h2>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No events found</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Venue</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Max</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-slate-100 last:border-none"
                >
                  <td className="py-3 font-semibold text-slate-800">{event.title}</td>
                  <td className="py-3 text-slate-600">{event.event_type}</td>
                  <td className="py-3 text-slate-600">{eventService.formatDate(event.date)}</td>
                  <td className="py-3 text-slate-600">{event.venue}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(event.event_status)}`}>
                      {event.event_status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{event.max_participants ?? '–'}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                      <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">View</button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
