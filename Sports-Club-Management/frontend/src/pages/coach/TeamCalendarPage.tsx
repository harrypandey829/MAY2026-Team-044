import { useEffect, useState } from 'react';
import { Plus, Sparkles, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import CoachCalendar from '../../components/coach-dashboard/CoachCalendar';
import eventService, { type Event } from '../../services/eventService';
import authService from '../../services/authService';

export default function TeamCalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const user = authService.getCurrentUser();
  const defaultSport = user?.sport || 'Football';

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState(defaultSport);
  const [eventType, setEventType] = useState<'Practice' | 'Match' | 'Tournament' | 'Club Event' | 'Holiday'>('Practice');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [venue, setVenue] = useState('Main Stadium');

  const sportsOptions = [
    'Football', 'Basketball', 'Cricket', 'Tennis',
    'Badminton', 'Swimming', 'Volleyball', 'Track & Field', 'Gym & Fitness'
  ];

  function loadEvents() {
    setLoading(true);
    eventService.getAll()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    try {
      await eventService.create({
        title,
        event_type: eventType,
        sport: sport || 'Football',
        date,
        start_time: startTime,
        venue,
        registration_deadline: date,
        created_by: user?.id,
      });
      setIsCreateOpen(false);
      loadEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create calendar event');
    }
  }

  // Format events for CoachCalendar component
  const calendarEvents = events.map((ev) => ({
    title: ev.title,
    day: Number(ev.date.split('-')[2]) || 15,
    type: ev.event_type === 'Practice' ? ('Training' as const) : ev.event_type === 'Match' ? ('Match' as const) : ('Tournament' as const),
  }));

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Team Calendar</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Coordinate training, matches, events, and club dates in one live calendar view.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setSport(defaultSport);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Create Calendar Event
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Monthly Calendar</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Live Team Schedule ({events.length} Events)</h2>
          </div>
        </div>
        <div className="mt-5">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading team calendar...</p>
          ) : (
            <CoachCalendar events={calendarEvents.length > 0 ? calendarEvents : [{ title: 'Practice Session', day: 15, type: 'Training' }]} />
          )}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {['Training Sessions', 'Matches', 'Club Events', 'Holidays'].map((item) => (
            <div key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm font-semibold text-slate-700">{item}</div>
          ))}
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> All calendar events synchronize live across athlete and staff portals.</div>
        </div>
      </section>

      {/* Create Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateEvent} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Calendar Event</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Event Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tactical Workshop" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Game / Sport</label>
                  <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                    {sportsOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Event Type</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value as typeof eventType)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                    <option value="Practice">Practice Session</option>
                    <option value="Match">Match Fixture</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Social">Club Event</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Start Time</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Venue</label>
                <input required value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Arena Hall A" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Event</button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}
