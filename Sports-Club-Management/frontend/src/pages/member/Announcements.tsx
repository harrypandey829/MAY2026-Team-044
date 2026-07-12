import { BellRing, Search, Sparkles } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const notices = [
  { title: 'Training updates', detail: 'Friday strength sessions will begin 15 minutes earlier.', sport: 'Badminton', type: 'Training' },
  { title: 'Tournament announcement', detail: 'Regional cup registration opens tomorrow at noon.', sport: 'Football', type: 'Tournament' },
  { title: 'Holiday notice', detail: 'The club will be closed on Monday for maintenance.', sport: 'All', type: 'Holiday' },
];

export default function AnnouncementsPage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Announcements</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Read the latest notices, tournament updates, and club-wide communications.</p>
        </div>
      </section>

      <PageCard title="Latest notices" subtitle="Search and filter">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none" placeholder="Search notices" />
          </label>
          <div className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">Filter by sport</div>
        </div>
        <div className="mt-5 grid gap-3">
          {notices.map((notice) => (
            <div key={notice.title} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{notice.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{notice.detail}</p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{notice.sport}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600"><BellRing className="h-4 w-4 text-brand-600" /> {notice.type}</div>
            </div>
          ))}
        </div>
      </PageCard>

      <PageCard title="Club updates" subtitle="What matters next">
        <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Upcoming notices are posted here for quick review before every session.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
