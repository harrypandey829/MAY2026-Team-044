import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Briefcase, Sparkles, X, Edit2, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import userService from '../../services/userService';
import type { AuthUser } from '../../services/authService';

export default function CoachCards() {
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals
  const [viewingCoach, setViewingCoach] = useState<AuthUser | null>(null);
  const [editingCoach, setEditingCoach] = useState<AuthUser | null>(null);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSport, setEditSport] = useState('Football');
  const [editStatus, setEditStatus] = useState('Active');

  function loadCoaches() {
    setLoading(true);
    userService.getByRole('Coach')
      .then(setCoaches)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCoaches();
  }, []);

  async function handleView(id: string) {
    try {
      const fetched = await userService.getById(id);
      setViewingCoach(fetched);
    } catch {
      const fallback = coaches.find((c) => c.id === id) || null;
      setViewingCoach(fallback);
    }
  }

  function handleOpenEdit(coach: AuthUser) {
    setViewingCoach(null);
    setEditingCoach(coach);
    setEditFirstName(coach.first_name);
    setEditLastName(coach.last_name);
    setEditPhone(coach.phone || '');
    setEditSport(coach.sport || 'Football');
    setEditStatus(coach.status || 'Active');
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCoach) return;
    try {
      await userService.updateProfile(editingCoach.id, {
        first_name: editFirstName,
        last_name: editLastName,
        phone: editPhone,
        sport: editSport,
        status: editStatus,
        is_approved: editStatus === 'Active',
      });
      setEditingCoach(null);
      setFeedback(`Coach details updated for ${editFirstName} ${editLastName}!`);
      loadCoaches();
    } catch {
      alert('Failed to update coach profile');
    }
  }

  async function handleAcceptCoach(id: string) {
    try {
      await userService.updateProfile(id, { is_approved: true, status: 'Active' });
      setViewingCoach(null);
      setFeedback('Coach application accepted and account activated!');
      loadCoaches();
    } catch {
      alert('Failed to approve coach application');
    }
  }

  async function handleToggleSuspend(coach: AuthUser) {
    const nextStatus = coach.status === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await userService.updateProfile(coach.id, { status: nextStatus });
      setViewingCoach(null);
      setFeedback(`Coach status changed to ${nextStatus}.`);
      loadCoaches();
    } catch {
      alert('Failed to update coach status');
    }
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Coach Management</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Coaching roster ({coaches.length})</h2>
        </div>
      </div>

      {feedback && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {loading ? (
        <p className="mt-5 py-8 text-center text-sm text-slate-500">Loading coaches...</p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      coach.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : coach.status === 'Suspended'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {!coach.is_approved || coach.status === 'Pending' ? 'Pending Approval' : coach.status}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{coach.first_name} {coach.last_name}</h3>
                <p className="mt-1 text-xs font-semibold text-brand-700">Sport: {coach.sport || 'Unassigned'}</p>
                <p className="mt-1 text-xs text-slate-600 truncate">{coach.email}</p>
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2"><BadgeCheck className="h-3.5 w-3.5 text-brand-600" /> Coaching Staff</p>
                  <p className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-emerald-600" /> {coach.phone || 'No phone'}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-slate-200/60 pt-3">
                <button
                  type="button"
                  onClick={() => handleView(coach.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-brand-600" /> View
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(coach)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5 text-emerald-600" /> Edit
                </button>
                {!coach.is_approved || coach.status === 'Pending' ? (
                  <button
                    type="button"
                    onClick={() => handleAcceptCoach(coach.id)}
                    className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-colors"
                  >
                    Accept
                  </button>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Coach Profile Details</h3>
              <button type="button" onClick={() => setViewingCoach(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500 font-semibold">Full Name</p>
                <p className="mt-1 font-bold text-slate-900">{viewingCoach.first_name} {viewingCoach.last_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500 font-semibold">Assigned Sport</p>
                  <p className="mt-1 font-bold text-brand-700">{viewingCoach.sport || 'Unassigned'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs uppercase text-slate-500 font-semibold">Status</p>
                  <p className="mt-1 font-bold text-slate-900">{viewingCoach.status}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500 font-semibold">Email Address</p>
                <p className="mt-1 font-semibold text-slate-800">{viewingCoach.email}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500 font-semibold">Phone Number</p>
                <p className="mt-1 font-semibold text-slate-800">{viewingCoach.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              {!viewingCoach.is_approved || viewingCoach.status === 'Pending' ? (
                <button
                  type="button"
                  onClick={() => handleAcceptCoach(viewingCoach.id)}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition-colors"
                >
                  Accept & Approve Coach
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleSuspend(viewingCoach)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    viewingCoach.status === 'Suspended' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {viewingCoach.status === 'Suspended' ? 'Unsuspend Coach' : 'Suspend Coach'}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenEdit(viewingCoach)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveEdit} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Coach Details</h3>
              <button type="button" onClick={() => setEditingCoach(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">First Name</label>
                  <input required value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Last Name</label>
                  <input required value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Assigned Sport</label>
                <select value={editSport} onChange={(e) => setEditSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold">
                  {['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Account Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold">
                  <option value="Active">Active (Approved)</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setEditingCoach(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md">Save Coach Profile</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
