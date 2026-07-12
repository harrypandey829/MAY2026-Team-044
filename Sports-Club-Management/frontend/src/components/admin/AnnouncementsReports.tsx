import { BarChart3, Megaphone, ShieldCheck, Sparkles } from 'lucide-react';

const announcements = [
  { title: 'Annual Gala & Awards Night', details: 'Invitations sent to all members and sponsors.', time: '2h ago' },
  { title: 'New Nutrition Workshop', details: 'Free workshop for all registered athletes.', time: '5h ago' },
];

const reports = [
  { title: 'Membership Growth', value: '+14.2%' },
  { title: 'Attendance Reliability', value: '92%' },
  { title: 'Revenue Forecast', value: '$84k' },
];

export default function AnnouncementsReports() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Announcements</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Latest updates</h2>
          </div>
          <button type="button" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">Manage</button>
        </div>

        <div className="mt-5 space-y-3">
          {announcements.map((item) => (
            <div key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.details}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Reports</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Operational insights</h2>
          </div>
          <button type="button" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">View All</button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-1">
          {reports.map((report) => (
            <div key={report.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-2 text-emerald-600 shadow-sm">
                  {report.title.includes('Membership') ? <ShieldCheck className="h-4 w-4" /> : report.title.includes('Attendance') ? <Sparkles className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm text-slate-600">{report.title}</p>
                  <p className="text-lg font-semibold text-slate-900">{report.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
