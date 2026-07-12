import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface EventItem {
  title: string;
  date: string;
  time: string;
  venue: string;
  gradient: string;
  tag: string;
}

const events: EventItem[] = [
  { title: 'Saturday Badminton Practice', date: 'Jul 12', time: '8:00 AM', venue: 'Court 1 · Indoor Hall', gradient: 'from-sky-400 to-blue-600', tag: 'Practice' },
  { title: 'Sunday Football League', date: 'Jul 13', time: '4:00 PM', venue: 'Main Ground', gradient: 'from-green-500 to-emerald-700', tag: 'League' },
  { title: 'Swimming Championship', date: 'Jul 20', time: '7:00 AM', venue: 'Olympic Pool', gradient: 'from-cyan-400 to-blue-600', tag: 'Championship' },
  { title: 'Cricket Training Camp', date: 'Jul 27', time: '6:30 AM', venue: 'Nets Pavilion', gradient: 'from-amber-400 to-orange-600', tag: 'Camp' },
  { title: 'Tennis Open Tournament', date: 'Aug 03', time: '9:00 AM', venue: 'Tennis Center', gradient: 'from-lime-400 to-green-600', tag: 'Tournament' },
];

function EventCard({ ev, index }: { ev: EventItem; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${visible ? 'is-visible' : ''} group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white/90 shadow-lg shadow-sky-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`relative h-28 bg-gradient-to-br ${ev.gradient} p-5`}>
        <div className="absolute inset-0 bg-mesh-dark opacity-10" />
        <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          {ev.tag}
        </div>
        <div className="absolute bottom-4 left-5 flex items-baseline gap-1.5 text-white">
          <span className="font-display text-3xl font-extrabold leading-none">{ev.date.split(' ')[1]}</span>
          <span className="text-sm font-semibold opacity-90">{ev.date.split(' ')[0]}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-bold text-slate-900">{ev.title}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-500" />
            {ev.time}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-pitch-500" />
            {ev.venue}
          </p>
        </div>
        <button className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-brand-600 hover:text-white">
          Register
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function Events() {
  return (
    <section id="events" className="relative bg-mesh py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Upcoming Events"
            title={<>Don't miss the <span className="gradient-text">next match</span></>}
            subtitle="Browse the club calendar and reserve your spot in upcoming practice sessions, leagues and tournaments."
          />
          <a
            href="#events"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-brand-200 hover:text-brand-700 sm:inline-flex"
          >
            <Calendar className="h-4 w-4" />
            View full calendar
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {events.map((ev, i) => (
            <EventCard key={ev.title} ev={ev} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
