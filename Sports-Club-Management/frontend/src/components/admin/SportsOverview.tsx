import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users2 } from 'lucide-react';
import userService from '../../services/userService';
import eventService, { type Event } from '../../services/eventService';
import type { AuthUser } from '../../services/authService';

export default function SportsOverview() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getByRole('Member'),
      userService.getByRole('Coach'),
      eventService.getAll(),
    ])
      .then(([mList, cList, eList]) => {
        setMembers(mList);
        setCoaches(cList);
        setEvents(eList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sportsList = ['Football', 'Cricket', 'Badminton', 'Swimming', 'Tennis'];

  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Sports & Teams</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Sport performance overview</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-5">
          {sportsList.map((sportName, index) => {
            const sportLower = sportName.toLowerCase();
            const memberCount = members.filter((m) => !m.sport || m.sport.toLowerCase().includes(sportLower) || sportLower.includes(m.sport.toLowerCase())).length;
            const coachCount = coaches.filter((c) => !c.sport || c.sport.toLowerCase().includes(sportLower) || sportLower.includes(c.sport.toLowerCase())).length;

            return (
              <motion.div
                key={sportName}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{sportName}</h3>
                  <div className="rounded-full bg-white p-2 text-brand-600 shadow-sm">
                    <Users2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p><strong>{loading ? '…' : memberCount}</strong> athletes</p>
                  <p><strong>{loading ? '…' : coachCount}</strong> coaches</p>
                </div>
                <button type="button" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-brand-700">Manage <ArrowRight className="h-4 w-4" /></button>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Upcoming events feed</h2>
            <p className="text-sm text-slate-500">Live database matches & training fixtures</p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-semibold">Event Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Venue</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-6 text-center text-sm text-slate-500">Loading events...</td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-sm text-slate-500">No events found</td></tr>
              ) : (
                events.slice(0, 4).map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-100 last:border-none">
                    <td className="py-3 font-semibold text-slate-800">{ev.title}</td>
                    <td className="py-3 text-slate-600">{ev.event_type}</td>
                    <td className="py-3 text-slate-600">{eventService.formatDate(ev.date)}</td>
                    <td className="py-3 text-slate-600">{ev.venue}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{ev.event_status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
