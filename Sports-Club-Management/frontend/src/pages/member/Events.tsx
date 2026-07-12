import { CalendarDays, Clock3, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const events = [
  { id: 1, title: 'Friday Match', date: 'Fri, Jul 12', time: '7:00 PM', venue: 'North Pitch', sport: 'Football', status: 'Registered', type: 'upcoming' },
  { id: 2, title: 'Recovery Session', date: 'Sat, Jul 13', time: '8:30 AM', venue: 'Wellness Studio', sport: 'Swimming', status: 'Open', type: 'upcoming' },
  { id: 3, title: 'Club Dinner', date: 'Mon, Jul 08', time: '7:30 PM', venue: 'Main Hall', sport: 'Community', status: 'Completed', type: 'past' },
];

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [registeredIds, setRegisteredIds] = useState<number[]>([1]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = `${event.title} ${event.sport}`.toLowerCase().includes(search.toLowerCase());
      const matchesSport = selectedSport === 'All' || event.sport === selectedSport;
      return matchesSearch && matchesSport;
    });
  }, [search, selectedSport]);

  const toggleRegistration = (id: number) => {
    setRegisteredIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Events</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Browse upcoming events, check your registered activities, and keep track of your club calendar.</p>
        </div>
      </section>

      <PageCard title="Event schedule" subtitle="Search and filters">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Search events" />
          </label>
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            <select value={selectedSport} onChange={(event) => setSelectedSport(event.target.value)} className="bg-transparent outline-none">
              <option>All</option>
              <option>Football</option>
              <option>Swimming</option>
              <option>Community</option>
            </select>
          </label>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {filteredEvents.map((event) => {
            const registered = registeredIds.includes(event.id);
            return (
              <div key={event.id} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{event.date}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{event.sport}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> {event.time}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> {event.venue}</p>
                  <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> {event.status}</p>
                </div>
                <button type="button" onClick={() => toggleRegistration(event.id)} className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">
                  {registered ? 'Cancel Registration' : 'Register'}
                </button>
              </div>
            );
          })}
        </div>
      </PageCard>
    </MemberLayout>
  );
}
