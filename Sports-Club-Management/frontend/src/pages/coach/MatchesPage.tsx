import { CalendarDays, Clock3, Trophy } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const matches = [
  { opponent: 'River City FC', type: 'League', venue: 'North Pitch', date: 'Sat, Jul 19', time: '4:00 PM', result: 'Pending', score: '-', playerOfMatch: 'Mina Chen', status: 'Upcoming' },
  { opponent: 'Harbor Tigers', type: 'Friendly', venue: 'West Arena', date: 'Mon, Jul 21', time: '6:00 PM', result: 'Won', score: '2-1', playerOfMatch: 'Liam Ortiz', status: 'Completed' },
];

export default function MatchesPage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Matches</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Track match plans, results, and key player contributions without leaving the portal.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Upcoming Matches</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Fixture plan</h2>
            </div>
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Schedule Match</button>
          </div>
          <div className="mt-5 grid gap-4">
            {matches.map((match) => (
              <div key={match.opponent} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">vs {match.opponent}</h3>
                    <p className="mt-2 text-sm text-slate-500">{match.type} • {match.venue}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${match.status === 'Upcoming' ? 'bg-brand-50 text-brand-700' : 'bg-emerald-50 text-emerald-700'}`}>{match.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> {match.date}</p>
                  <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-sky-600" /> {match.time}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Result</p>
                    <p className="mt-1 font-semibold text-slate-900">{match.result}</p>
                  </div>
                  <div className="rounded-[1rem] border border-slate-200 bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Score</p>
                    <p className="mt-1 font-semibold text-slate-900">{match.score}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-[1rem] border border-slate-200 bg-white p-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Player of the Match:</span> {match.playerOfMatch}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Edit Match</button>
                  <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Enter Match Result</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Match Overview</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Past and friendly fixtures</h2>
            </div>
            <Trophy className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 space-y-3">
            {['Upcoming Matches', 'Past Matches', 'Friendly Matches', 'League Matches'].map((section) => (
              <div key={section} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm font-semibold text-slate-700">{section}</div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">Match details, opposition, venue, date, time, score, and match MVP are available here for quick review.</div>
        </div>
      </section>
    </CoachPortalLayout>
  );
}
