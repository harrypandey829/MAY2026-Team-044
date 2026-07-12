import { Sparkles, Trophy } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const players = [
  { name: 'Mina Chen', goals: 8, assists: 4, matches: 12, minutes: 980, fitness: '92%' },
  { name: 'Liam Ortiz', goals: 5, assists: 2, matches: 10, minutes: 850, fitness: '88%' },
  { name: 'Noah Brooks', goals: 3, assists: 6, matches: 11, minutes: 910, fitness: '90%' },
];

export default function PerformancePage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Performance</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review player statistics, fitness levels, feedback, and key performers across the season.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Statistics</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Performance metrics</h2>
            </div>
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Update Performance</button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Goals', '24'],
              ['Assists', '18'],
              ['Matches Played', '12'],
              ['Minutes Played', '3,450'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Coach Feedback</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Game-readiness notes</h2>
            </div>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">View Reports</button>
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">Current focus areas: positioning, defensive shape, and finishing under pressure.</div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Performance graphs and top performer insight are ready for team review.</div></div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Top Performers</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Most improved and standout players</h2>
          </div>
          <Trophy className="h-5 w-5 text-brand-600" />
        </div>
        <div className="mt-5 grid gap-3">
          {players.map((player) => (
            <div key={player.name} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div>
                <p className="font-semibold text-slate-900">{player.name}</p>
                <p className="mt-1 text-sm text-slate-600">Goals {player.goals} • Assists {player.assists}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span>Matches {player.matches}</span>
                <span>Minutes {player.minutes}</span>
                <span>Fitness {player.fitness}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CoachPortalLayout>
  );
}
