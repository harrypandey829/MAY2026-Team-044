import { CheckCircle2, Search, Sparkles, XCircle } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const availabilityRows = [
  { name: 'Mina Chen', status: 'Available', note: 'Ready for training' },
  { name: 'Noah Brooks', status: 'Unavailable', note: 'Recovery day' },
  { name: 'Liam Ortiz', status: 'Injured', note: 'Medical check' },
];

export default function PlayerAvailabilityPage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Player Availability</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review available, unavailable, injured, and leave-requested players so plans can be adjusted quickly.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Availability Overview</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Roster readiness</h2>
            </div>
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Update Availability</button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Available Players', '18'],
              ['Unavailable Players', '3'],
              ['Injured Players', '2'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Availability snapshots help the staff plan sessions and protect players with recovery needs.</div></div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Leave Requests</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Pending approvals</h2>
            </div>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Approve Leave</button>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none" placeholder="Search player" />
          </label>
          <div className="mt-4 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">A player availability calendar and leave requests are displayed here for quick staff decisions.</div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Status</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Availability by player</h2>
          </div>
          <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Reject Leave</button>
        </div>
        <div className="mt-5 grid gap-3">
          {availabilityRows.map((row) => (
            <div key={row.name} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div>
                <p className="font-semibold text-slate-900">{row.name}</p>
                <p className="mt-1 text-sm text-slate-600">{row.note}</p>
              </div>
              <div className="flex items-center gap-2">
                {row.status === 'Available' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
                <span className="text-sm font-semibold text-slate-700">{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CoachPortalLayout>
  );
}
