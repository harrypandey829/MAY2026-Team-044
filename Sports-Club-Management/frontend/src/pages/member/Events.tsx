import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Filter, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import eventService, { type Event } from '../../services/eventService';
import authService from '../../services/authService';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [filterEnrolledOnly, setFilterEnrolledOnly] = useState(false);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [registering, setRegistering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const user = authService.getCurrentUser();
  const enrolledSports = useMemo(() => authService.getEnrolledSports(), []);

  useEffect(() => {
    eventService.getAll()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));

    if (user) {
      eventService.getMemberRegistrations(user.id)
        .then((regs) => setRegisteredIds(regs.map((r) => r.event_id)))
        .catch(() => setRegisteredIds([]));
    }
  }, [user?.id]);

  const eventTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.event_type));
    return ['All', ...Array.from(types)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch = `${ev.title} ${ev.venue} ${ev.event_type}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === 'All' || ev.event_type === selectedType;

      if (filterEnrolledOnly && enrolledSports.length > 0) {
        const matchesEnrolled = enrolledSports.some((s) =>
          ev.title.toLowerCase().includes(s.toLowerCase()) ||
          ev.event_type.toLowerCase().includes(s.toLowerCase()) ||
          (ev.venue && ev.venue.toLowerCase().includes(s.toLowerCase()))
        );
        return matchesSearch && matchesType && matchesEnrolled;
      }

      return matchesSearch && matchesType;
    });
  }, [events, search, selectedType, filterEnrolledOnly, enrolledSports]);

  async function toggleRegistration(event: Event) {
    if (!user) return;
    setRegistering(event.id);
    setError(null);
    setSuccessMsg(null);

    const isRegistered = registeredIds.includes(event.id);

    try {
      if (isRegistered) {
        setRegisteredIds((prev) => prev.filter((id) => id !== event.id));
        setSuccessMsg(`Cancelled registration for "${event.title}".`);
      } else {
        await eventService.registerMember(event.id, user.id);
        setRegisteredIds((prev) => [...prev, event.id]);
        setSuccessMsg(`Successfully registered for "${event.title}"!`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setRegistering(null);
    }
  }

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Events & Sessions</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Browse upcoming events, check your registered activities, and stay tuned with your enrolled sports schedule.</p>
        </div>
      </section>

      <PageCard title="Event schedule" subtitle="Search and filters">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Search events or venues" />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterEnrolledOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                filterEnrolledOnly
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'border border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              {filterEnrolledOnly ? 'Enrolled Sports Only' : 'All Club Events'}
            </button>

            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-600">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-transparent outline-none">
                {eventTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {successMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {successMsg}
          </div>
        )}

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {loading ? (
            <p className="col-span-2 py-8 text-center text-sm text-slate-500">Loading events...</p>
          ) : filteredEvents.length === 0 ? (
            <p className="col-span-2 py-8 text-center text-sm text-slate-500">No events found matching your criteria</p>
          ) : (
            filteredEvents.map((event) => {
              const isRegistered = registeredIds.includes(event.id);
              const isLoading = registering === event.id;
              const isOpen = event.is_registration_open && event.event_status === 'Scheduled';
              return (
                <div key={event.id} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{event.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{eventService.formatDate(event.date)}</p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{event.event_type}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> {eventService.formatTime(event.start_time)}</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> {event.venue}</p>
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> {event.event_status}</p>
                  </div>
                  {isOpen && (
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => toggleRegistration(event)}
                      className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] ${
                        isRegistered ? 'bg-slate-500 hover:bg-slate-600' : 'bg-gradient-to-r from-brand-500 to-emerald-500'
                      }`}
                    >
                      {isLoading ? 'Processing…' : isRegistered ? 'Cancel Registration' : 'Register'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </PageCard>
    </MemberLayout>
  );
}
