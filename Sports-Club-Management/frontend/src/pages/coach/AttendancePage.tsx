import { ClipboardCheck, Search, Sparkles } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const rows = [
  { player: 'Mina Chen', training: 'Present', match: 'Present', percentage: '100%' },
  { player: 'Noah Brooks', training: 'Late', match: 'Present', percentage: '90%' },
  { player: 'Liam Ortiz', training: 'Absent', match: 'Present', percentage: '80%' },
];

export default function AttendancePage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Attendance</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review attendance patterns across training and match days with clear summaries and quick action buttons.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Attendance Overview</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Training and match attendance</h2>
            </div>
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Mark Attendance</button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Attendance Percentage', '94%'],
              ['Training Attendance', '92%'],
              ['Match Attendance', '97%'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Attendance trends show steadily improving punctuality and participation across the week.</div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Attendance Calendar</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Weekly view</h2>
            </div>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Edit Attendance</button>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none" placeholder="Search player" />
          </label>
          <div className="mt-4 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">Filter by player or date to narrow the attendance review.</div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Attendance Table</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Player attendance</h2>
          </div>
          <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Download Report</button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Player</th>
                <th className="px-4 py-3 font-semibold">Training</th>
                <th className="px-4 py-3 font-semibold">Match</th>
                <th className="px-4 py-3 font-semibold">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.player} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.player}</td>
                  <td className="px-4 py-3 text-slate-600">{row.training}</td>
                  <td className="px-4 py-3 text-slate-600">{row.match}</td>
                  <td className="px-4 py-3 text-slate-600">{row.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-700"><div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-brand-600" /> Attendance updates are visible to the coaching staff and can be exported at any time.</div></div>
      </section>
    </CoachPortalLayout>
  );
}
