import { MessageSquareText, Sparkles } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const announcements = [
  { title: 'Training Updates', detail: 'Evening session moved to 6 PM', priority: 'High' },
  { title: 'Match Updates', detail: 'Travel arrangements shared for away fixture', priority: 'Medium' },
  { title: 'Tournament Notices', detail: 'Registration deadline extended by one day', priority: 'Low' },
];

export default function AnnouncementsPage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Announcements</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Share updates with the team, distribute notices, and keep communication organized by category.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Recent Announcements</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Latest communications</h2>
            </div>
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Create Announcement</button>
          </div>
          <div className="mt-5 grid gap-3">
            {announcements.map((item) => (
              <div key={item.title} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{item.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Notification Tools</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Quick actions</h2>
            </div>
            <MessageSquareText className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 grid gap-3">
            {['Edit Announcement', 'Delete Announcement', 'Send Notification', 'Filter by Team'].map((action) => (
              <button key={action} type="button" className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700">{action}</button>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Announcements can be filtered by team and scheduled for broadcast at the right time.</div></div>
        </div>
      </section>
    </CoachPortalLayout>
  );
}
