import { useEffect, useState } from 'react';
import { BarChart3, Megaphone, ShieldCheck, Sparkles } from 'lucide-react';
import announcementService, { type Announcement } from '../../services/announcementService';
import userService from '../../services/userService';



export default function AnnouncementsReports() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [coachCount, setCoachCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      announcementService.getAll(),
      userService.getByRole('Member'),
      userService.getByRole('Coach'),
    ]).then(([anns, members, coaches]) => {
      setAnnouncements(anns.slice(0, 3));
      setMemberCount(members.length);
      setCoachCount(coaches.length);
    }).finally(() => setLoading(false));
  }, []);

  const dynamicReports = [
    { title: 'Total Members', value: memberCount !== null ? String(memberCount) : '…' },
    { title: 'Coaches on Staff', value: coachCount !== null ? String(coachCount) : '…' },
    { title: 'Attendance Rate', value: '92%' },
  ];

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
          {loading ? (
            <p className="py-4 text-center text-sm text-slate-500">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No announcements</p>
          ) : (
            announcements.map((item) => (
              <div key={item.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600 line-clamp-1">{item.message}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm text-slate-500">{announcementService.formatTime(item.created_at)}</span>
                </div>
              </div>
            ))
          )}
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
          {dynamicReports.map((report) => (
            <div key={report.title} className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-2 text-emerald-600 shadow-sm">
                  {report.title.includes('Members') ? <ShieldCheck className="h-4 w-4" /> : report.title.includes('Coaches') ? <Sparkles className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
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
