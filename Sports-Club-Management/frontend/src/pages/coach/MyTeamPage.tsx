import { Search, Sparkles, Users } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import CoachRosterTable from '../../components/coach-dashboard/CoachRosterTable';

const players = [
  { name: 'Mina Chen', position: 'Forward', age: 22, contact: '+1 202 555 0148', attendance: 96, status: 'Attending' as const, photo: 'MC' },
  { name: 'Noah Brooks', position: 'Midfielder', age: 24, contact: '+1 202 555 0142', attendance: 88, status: 'Maybe' as const, photo: 'NB' },
  { name: 'Liam Ortiz', position: 'Defender', age: 26, contact: '+1 202 555 0146', attendance: 91, status: 'Attending' as const, photo: 'LO' },
  { name: 'Ava Patel', position: 'Goalkeeper', age: 23, contact: '+1 202 555 0143', attendance: 85, status: 'Not Attending' as const, photo: 'AP' },
  { name: 'Jules Rivera', position: 'Winger', age: 21, contact: '+1 202 555 0160', attendance: 93, status: 'Attending' as const, photo: 'JR' },
];

export default function MyTeamPage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">My Team</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Manage the full roster, monitor player readiness, and stay aligned with the coaching staff.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-brand-700"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Snapshot</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Football Team A</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Team Name', 'Football Team A'],
              ['Sport', 'Football'],
              ['Coach Name', 'Sarah Johnson'],
              ['Assistant Coach', 'Maya Cruz'],
              ['Captain', 'Liam Ortiz'],
              ['Vice Captain', 'Mina Chen'],
              ['Total Players', '24'],
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
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Profiles</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Search players</h2>
            </div>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Filter by Position</button>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none" placeholder="Search players" />
          </label>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Use the roster to review player availability, feedback, and recovery tasks.</div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Roster</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Player list</h2>
          </div>
          <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">View Player</button>
        </div>
        <div className="mt-5">
          <CoachRosterTable players={players} />
        </div>
      </section>
    </CoachPortalLayout>
  );
}
