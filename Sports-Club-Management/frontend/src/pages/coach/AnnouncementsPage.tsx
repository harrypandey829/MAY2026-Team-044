import { useEffect, useState } from 'react';
import { MessageSquareText, Plus, Sparkles, Trash2, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import announcementService, { type Announcement } from '../../services/announcementService';
import authService from '../../services/authService';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const user = authService.getCurrentUser();

  function loadAnnouncements() {
    setLoading(true);
    announcementService.getAll()
      .then(setAnnouncements)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleCreateAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await announcementService.create({
        title,
        message,
        created_by: user.id,
      });
      setIsPostOpen(false);
      setTitle('');
      setMessage('');
      loadAnnouncements();
    } catch {
      alert('Failed to post announcement');
    }
  }

  async function handleDeleteAnnouncement(id: string) {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await announcementService.delete(id);
      loadAnnouncements();
    } catch {
      alert('Failed to delete announcement');
    }
  }

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Announcements</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Post team announcements and stay up to date with club notifications.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPostOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Post Announcement
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Recent Announcements</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Latest communications</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {loading ? (
              <p className="py-6 text-center text-sm text-slate-500">Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No announcements found</p>
            ) : (
              announcements.map((item) => (
                <div key={item.id} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{item.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                        {announcementService.formatTime(item.created_at)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(item.id)}
                        className="rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Broadcast Tools</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Information Stream</h2>
            </div>
            <MessageSquareText className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Announcements are instantly delivered to all member and staff feeds.</div>
          </div>
        </div>
      </section>

      {/* Post Announcement Modal */}
      {isPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateAnnouncement} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Post Announcement</h3>
              <button type="button" onClick={() => setIsPostOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Squad Practice Rescheduled" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Message Content</label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Enter message details for squad members..." className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsPostOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Broadcast Announcement</button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}
