import { CalendarDays, Sparkles } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import CoachCalendar from '../../components/coach-dashboard/CoachCalendar';

const events = [
  { title: 'Training Session', day: 12, type: 'Training' as const },
  { title: 'League Match', day: 19, type: 'Match' as const },
  { title: 'Tournament', day: 24, type: 'Tournament' as const },
  { title: 'Club Holiday', day: 28, type: 'Holiday' as const },
];

export default function TeamCalendarPage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Team Calendar</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Coordinate training, matches, events, and club dates in one structured calendar view.</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Monthly Calendar</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">July 2026 highlights</h2>
          </div>
          <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Create Event</button>
        </div>
        <div className="mt-5">
          <CoachCalendar events={events} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {['Training Sessions', 'Matches', 'Club Events', 'Holidays'].map((item) => (
            <div key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm font-semibold text-slate-700">{item}</div>
          ))}
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Calendar events are ready to be edited or deleted as the schedule changes.</div></div>
      </section>
    </CoachPortalLayout>
  );
}
