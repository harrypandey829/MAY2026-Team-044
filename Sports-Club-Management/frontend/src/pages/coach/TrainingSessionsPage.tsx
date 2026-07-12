import { BookOpen, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const sessions = [
  { title: 'Today\'s Training', subtitle: 'Strength & Conditioning', time: '06:30 AM', venue: 'Arena Hall A', status: 'Live' },
  { title: 'Upcoming Sessions', subtitle: 'Tactical Review', time: '07:00 PM', venue: 'Training Room 2', status: 'Scheduled' },
  { title: 'Past Sessions', subtitle: 'Match Recovery', time: '08:00 AM', venue: 'Recovery Zone', status: 'Completed' },
];

const plan = ['Warm-up', 'Fitness', 'Drills', 'Match Practice'];

export default function TrainingSessionsPage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Training Sessions</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Plan sessions, track attendance, and keep every training block structured and visible to the team.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Training Plan</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Today&apos;s training overview</h2>
            </div>
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Create Training Session</button>
          </div>
          <div className="mt-5 grid gap-4">
            {sessions.map((session) => (
              <div key={session.title} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">{session.title}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{session.subtitle}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{session.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> {session.time}</p>
                  <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sky-600" /> {session.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Training Calendar</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Session blocks</h2>
            </div>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Edit Session</button>
          </div>
          <div className="mt-5 grid gap-3">
            {plan.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  <p className="font-semibold text-slate-800">{item}</p>
                </div>
                <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">View Attendance</button>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand-600" /> Training sessions can be edited, canceled, or expanded with attendance notes.</div>
          </div>
        </div>
      </section>
    </CoachPortalLayout>
  );
}
