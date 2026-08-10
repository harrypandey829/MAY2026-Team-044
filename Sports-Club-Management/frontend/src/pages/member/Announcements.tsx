import { useEffect, useState } from 'react';
import { BellRing, Search } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import announcementService, { type Announcement } from '../../services/announcementService';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    announcementService.getAll()
      .then(setAnnouncements)
      .finally(() => setLoading(false));
  }, []);

  const filtered = announcements.filter((a) =>
    `${a.title} ${a.message}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Announcements</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Read the latest notices, tournament updates, and club-wide communications.</p>
        </div>
      </section>

      <PageCard title="Latest notices" subtitle={`${filtered.length} announcement${filtered.length !== 1 ? 's' : ''}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search announcements"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-5 grid gap-3">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading announcements...</p>
          ) : filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No announcements found</p>
          ) : (
            filtered.map((notice) => (
              <div key={notice.id} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{notice.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{notice.message}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {announcementService.formatTime(notice.created_at)}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <BellRing className="h-4 w-4 text-brand-600" /> Club Announcement
                </div>
              </div>
            ))
          )}
        </div>
      </PageCard>
    </MemberLayout>
  );
}
