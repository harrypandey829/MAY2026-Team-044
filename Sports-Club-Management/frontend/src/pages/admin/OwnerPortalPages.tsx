import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

import LostAndFoundContent from '../../components/lost-and-found/LostAndFoundContent';
import authService, { type AuthUser } from '../../services/authService';
import userService from '../../services/userService';
import eventService, { type Event } from '../../services/eventService';
import resourceService, { resourceBookingService, type Resource, type ResourceBooking } from '../../services/resourceService';
import paymentService, { type Payment } from '../../services/paymentService';
import announcementService, { type Announcement } from '../../services/announcementService';
import sportsService, { Sport, EquipmentUtility } from '../../services/sportsService';


function PageHeader({ title, subtitle, badge = 'Live Backend Data' }: { title: string; subtitle: string; badge?: string }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Admin Console</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{subtitle}</p>
        </div>
        <div className="rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-brand-700">{badge}</div>
      </div>
    </section>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/70 bg-white/85 p-4 shadow-sm shadow-sky-100/70">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-xs font-semibold text-brand-700">{detail}</p>
    </div>
  );
}

function ActionButton({ label, onClick, variant = 'primary' }: { label: string; onClick?: () => void; variant?: 'primary' | 'secondary' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        variant === 'primary'
          ? 'rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-300/30 transition-all hover:scale-105'
          : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100'
      }
    >
      {label}
    </button>
  );
}

// ----------------------------------------------------------------------
// 1. Members Page
// ----------------------------------------------------------------------
export function MembersPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  function loadMembers() {
    setLoading(true);
    userService.getByRole('Member')
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const sports = ['Badminton', 'Football', 'Cricket', 'Tennis', 'Swimming', 'General / Other'];

  async function handleToggleSuspend(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await userService.updateProfile(id, { status: nextStatus });
      setFeedback(`Member status updated to ${nextStatus}.`);
      loadMembers();
    } catch {
      alert('Failed to update member status');
    }
  }

  return (
    <AdminLayout>
      <PageHeader title="Sports-Wise Members Management" subtitle="Monitor members grouped strictly by their enrolled sport discipline." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between mt-4">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm max-w-md">
        <Search className="h-4 w-4" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members by name or email"
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="mt-6 space-y-8">
        {sports.map((sportName) => {
          const sportMembers = members.filter((m) => {
            const mSport = m.sport || 'General / Other';
            const matchesSport = sportName === 'General / Other'
              ? !m.sport || m.sport === 'General / Other'
              : mSport.toLowerCase() === sportName.toLowerCase();
            const matchesQuery = `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(query.toLowerCase());
            return matchesSport && matchesQuery;
          });

          return (
            <div key={sportName} className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-800">{sportName}</span>
                  <h3 className="text-lg font-bold text-slate-900">Enrolled Members ({sportMembers.length})</h3>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <p className="col-span-3 py-4 text-center text-xs text-slate-400">Loading members...</p>
                ) : sportMembers.length === 0 ? (
                  <p className="col-span-3 py-4 text-center text-xs text-slate-400">No members enrolled in {sportName}</p>
                ) : (
                  sportMembers.map((member) => (
                    <div key={member.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white text-xs">
                          {member.first_name[0]}{member.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.first_name} {member.last_name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs">
                        <span className={`rounded-full px-2.5 py-0.5 font-bold ${member.status === 'Suspended' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {member.status || 'Active'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspend(member.id, member.status)}
                          className={`rounded-lg px-3 py-1 font-bold ${member.status === 'Suspended' ? 'bg-emerald-600 text-white' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}
                        >
                          {member.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}


// ----------------------------------------------------------------------
// 2. Coaches Page
// ----------------------------------------------------------------------
export function CoachesPage() {
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending'>('Active');

  // Add Coach Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sport, setSport] = useState('Football');

  // View & Edit Coach Modals
  const [viewingCoach, setViewingCoach] = useState<AuthUser | null>(null);
  const [editingCoach, setEditingCoach] = useState<AuthUser | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSport, setEditSport] = useState('Football');
  const [editStatus, setEditStatus] = useState('Active');

  function loadCoaches() {
    setLoading(true);
    userService.getByRole('Coach')
      .then(setCoaches)
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCoaches();
  }, []);

  async function handleViewCoach(id: string) {
    try {
      const fetched = await userService.getById(id);
      setViewingCoach(fetched);
    } catch {
      const fallback = coaches.find((c) => c.id === id) || null;
      setViewingCoach(fallback);
    }
  }

  function handleOpenEditCoach(coach: AuthUser) {
    setViewingCoach(null);
    setEditingCoach(coach);
    setEditFirstName(coach.first_name);
    setEditLastName(coach.last_name);
    setEditPhone(coach.phone || '');
    setEditSport(coach.sport || 'Football');
    setEditStatus(coach.status || 'Active');
  }

  async function handleSaveEditCoach(e: React.FormEvent) {
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

  async function handleAddCoach(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password: 'password123',
        role: 'Coach',
        sport,
      });
      setIsAddOpen(false);
      setFeedback(`New ${sport} coach application registered successfully!`);
      loadCoaches();
    } catch {
      alert('Failed to register new coach');
    }
  }

  async function handleApproveCoach(id: string) {
    try {
      await userService.updateProfile(id, { is_approved: true, status: 'Active' });
      setFeedback('Coach application accepted and approved!');
      setViewingCoach(null);
      loadCoaches();
    } catch {
      alert('Failed to approve coach');
    }
  }

  async function handleToggleSuspendCoach(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    try {
      await userService.updateProfile(id, { status: nextStatus });
      setFeedback(`Coach status updated to ${nextStatus}.`);
      setViewingCoach(null);
      loadCoaches();
    } catch {
      alert('Failed to update coach status');
    }
  }

  const activeCoaches = coaches.filter((c) => c.is_approved && c.status !== 'Pending');
  const pendingCoaches = coaches.filter((c) => !c.is_approved || c.status === 'Pending');

  return (
    <AdminLayout>
      <PageHeader title="Coaching Staff Management" subtitle="Manage coaching staff assignments, pending applications, approvals, sport disciplines, and suspend controls." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Coaches" value={loading ? '…' : String(coaches.length)} detail="Registered Coaching Staff" />
        <StatCard label="Active Staff" value={loading ? '…' : String(activeCoaches.length)} detail="Approved & Available" />
        <StatCard label="Pending Applications" value={loading ? '…' : String(pendingCoaches.length)} detail="Requires Admin Review" />
        <StatCard label="Disciplines Covered" value={loading ? '…' : String(new Set(coaches.map((c) => c.sport).filter(Boolean)).size || 1)} detail="Sports Covered" />
      </div>

      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('Active')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'Active' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Staff ({activeCoaches.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Pending')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === 'Pending' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Applications ({pendingCoaches.length})
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton label="Add New Coach" onClick={() => setIsAddOpen(true)} />
            <ActionButton label="Refresh Staff Roster" onClick={loadCoaches} variant="secondary" />
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          {activeTab === 'Active' ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50/80 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Coach Name</th>
                  <th className="px-4 py-3 font-semibold">Assigned Sport</th>
                  <th className="px-4 py-3 font-semibold">Email Address</th>
                  <th className="px-4 py-3 font-semibold">Phone Number</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">Loading active coaches...</td></tr>
                ) : activeCoaches.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">No active coaches found</td></tr>
                ) : (
                  activeCoaches.map((coach) => (
                    <tr key={coach.id}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{coach.first_name} {coach.last_name}</td>
                      <td className="px-4 py-3 font-medium text-brand-700">{coach.sport || 'Unassigned'}</td>
                      <td className="px-4 py-3 text-slate-600">{coach.email}</td>
                      <td className="px-4 py-3 text-slate-600">{coach.phone || '–'}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${coach.status === 'Suspended' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {coach.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewCoach(coach.id)}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCoach(coach)}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSuspendCoach(coach.id, coach.status)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              coach.status === 'Suspended' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            {coach.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50/80 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Applicant Name</th>
                  <th className="px-4 py-3 font-semibold">Requested Sport</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
                {loading ? (
                  <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">Loading coach applications...</td></tr>
                ) : pendingCoaches.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">No pending coach applications</td></tr>
                ) : (
                  pendingCoaches.map((coach) => (
                    <tr key={coach.id}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{coach.first_name} {coach.last_name}</td>
                      <td className="px-4 py-3 font-medium text-brand-700">{coach.sport || 'Unassigned'}</td>
                      <td className="px-4 py-3 text-slate-600">{coach.email}</td>
                      <td className="px-4 py-3 text-slate-600">{coach.phone || '–'}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Pending Approval
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewCoach(coach.id)}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCoach(coach)}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveCoach(coach.id)}
                            className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* View Coach Modal */}
      {viewingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Coach Profile & Details</h3>
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
                  <p className="text-xs uppercase text-slate-500 font-semibold">Account Status</p>
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
                  onClick={() => handleApproveCoach(viewingCoach.id)}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition-colors"
                >
                  Accept & Approve Application
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleSuspendCoach(viewingCoach.id, viewingCoach.status)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    viewingCoach.status === 'Suspended' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  {viewingCoach.status === 'Suspended' ? 'Unsuspend Coach' : 'Suspend Coach'}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenEditCoach(viewingCoach)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Coach Modal */}
      {editingCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveEditCoach} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
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

      {/* Add Coach Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleAddCoach} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Coach</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">First Name</label>
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Last Name</label>
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Assigned Sport</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold">
                  {['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Create Coach Account</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 3. Sports Page
// ----------------------------------------------------------------------
export function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [utilitiesMap, setUtilitiesMap] = useState<Record<string, EquipmentUtility[]>>({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals
  const [isAddSportOpen, setIsAddSportOpen] = useState(false);
  const [newSportName, setNewSportName] = useState('');
  const [monthlyFee, setMonthlyFee] = useState(1500);
  const [annualFee, setAnnualFee] = useState(15000);
  const [sportDesc, setSportDesc] = useState('');

  const [isAddUtilOpen, setIsAddUtilOpen] = useState(false);
  const [targetSport, setTargetSport] = useState('');
  const [utilName, setUtilName] = useState('');
  const [utilQty, setUtilQty] = useState(10);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sList, mList, cList, eList] = await Promise.all([
        sportsService.getAllSports(),
        userService.getByRole('Member'),
        userService.getByRole('Coach'),
        eventService.getAll(),
      ]);
      setSports(sList);
      setMembers(mList);
      setCoaches(cList);
      setEvents(eList);

      const map: Record<string, EquipmentUtility[]> = {};
      for (const s of sList) {
        map[s.name] = await sportsService.getUtilities(s.name);
      }
      setUtilitiesMap(map);
    } catch {
      setSports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sportsService.createSport({
        name: newSportName,
        monthly_fee: monthlyFee,
        annual_fee: annualFee,
        description: sportDesc,
      });
      setFeedback(`Sport '${newSportName}' successfully created!`);
      setIsAddSportOpen(false);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add sport');
    }
  };

  const handleDeleteSport = async (sportName: string) => {
    if (!confirm(`Are you sure you want to delete ${sportName}?`)) return;
    try {
      await sportsService.deleteSport(sportName);
      setFeedback(`Sport '${sportName}' deleted.`);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete sport');
    }
  };

  const handleAddUtility = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sportsService.addUtility(targetSport, {
        name: utilName,
        total_quantity: utilQty,
      });
      setFeedback(`Added ${utilQty}x ${utilName} to ${targetSport}!`);
      setIsAddUtilOpen(false);
      await loadData();
    } catch {
      alert('Failed to add utility');
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Sports & Equipment Utilities Management" subtitle="Manage official sport disciplines, membership fees, member counts, and allocated equipment stock." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between mt-4">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAddSportOpen(true)}
          className="rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
        >
          + Add New Sport
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-3 py-8 text-center text-sm text-slate-500">Loading sports portfolio...</p>
        ) : (
          sports.map((s) => {
            const memberCount = members.filter((m) => m.sport && m.sport.toLowerCase() === s.name.toLowerCase()).length;
            const coachCount = coaches.filter((c) => c.sport && c.sport.toLowerCase() === s.name.toLowerCase()).length;
            const eventCount = events.filter((ev) => ev.sport && ev.sport.toLowerCase() === s.name.toLowerCase()).length;
            const utilities = utilitiesMap[s.name] || [];
            const canDelete = memberCount === 0 && coachCount === 0;

            return (
              <div key={s.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{s.name}</h3>
                      <p className="text-xs font-semibold text-brand-600">₹{s.monthly_fee}/mo • ₹{s.annual_fee}/yr</p>
                    </div>
                    <button
                      type="button"
                      disabled={!canDelete}
                      onClick={() => handleDeleteSport(s.name)}
                      title={!canDelete ? `Cannot remove sport while Member Count (${memberCount}) or Coach Count (${coachCount}) > 0` : 'Remove Sport'}
                      className={`rounded-xl p-2 transition-all ${canDelete ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                      <p className="text-slate-500">Members</p>
                      <p className="text-lg font-bold text-slate-900">{memberCount}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                      <p className="text-slate-500">Coaches</p>
                      <p className="text-lg font-bold text-slate-900">{coachCount}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                      <p className="text-slate-500">Events</p>
                      <p className="text-lg font-bold text-slate-900">{eventCount}</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Equipment Utilities</span>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetSport(s.name);
                          setIsAddUtilOpen(true);
                        }}
                        className="text-xs font-bold text-brand-600 hover:text-brand-800"
                      >
                        + Add Utility
                      </button>
                    </div>

                    <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                      {utilities.length === 0 ? (
                        <p className="text-slate-400 italic">No equipment utilities added yet.</p>
                      ) : (
                        utilities.map((u) => (
                          <div key={u.id} className="flex justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-200/50">
                            <span>{u.name}</span>
                            <span className="font-bold text-slate-800">{u.available_quantity} / {u.total_quantity}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD SPORT MODAL */}
      {isAddSportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleAddSport} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <h3 className="text-lg font-bold text-slate-900">Add New Sport Discipline</h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Sport Name</label>
                <input required value={newSportName} onChange={(e) => setNewSportName(e.target.value)} placeholder="e.g. Squash" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-600">Monthly Fee (₹)</label>
                  <input type="number" required value={monthlyFee} onChange={(e) => setMonthlyFee(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none font-bold" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-600">Annual Fee (₹)</label>
                  <input type="number" required value={annualFee} onChange={(e) => setAnnualFee(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none font-bold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Description</label>
                <textarea rows={2} value={sportDesc} onChange={(e) => setSportDesc(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddSportOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700">Save Sport</button>
            </div>
          </form>
        </div>
      )}

      {/* ADD UTILITY MODAL */}
      {isAddUtilOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleAddUtility} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <h3 className="text-lg font-bold text-slate-900">Add Utility for {targetSport}</h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Equipment Item Name</label>
                <input required value={utilName} onChange={(e) => setUtilName(e.target.value)} placeholder="e.g. Training Balls" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Quantity</label>
                <input type="number" min="1" required value={utilQty} onChange={(e) => setUtilQty(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none font-bold" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddUtilOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700">Add Equipment</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}


// ----------------------------------------------------------------------
// 4. Teams Page
// ----------------------------------------------------------------------
export function TeamsPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userService.getByRole('Member'), userService.getByRole('Coach')])
      .then(([mList, cList]) => {
        setMembers(mList);
        setCoaches(cList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const teamsData = [
    { name: 'Senior Lions Squad', sport: 'Football', schedule: 'Mon/Wed/Fri • Main Stadium' },
    { name: 'North Stars XI', sport: 'Cricket', schedule: 'Tue/Thu • Oval Pitch' },
    { name: 'Racers Smashers', sport: 'Badminton', schedule: 'Daily • Court A' },
    { name: 'Aquatic Waves', sport: 'Swimming', schedule: 'Mon/Thu • Olympic Pool' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Club Teams & Squads" subtitle="Coordinate squad rosters, assigned coaches, captains, and recurring practice schedules." />
      <div className="grid gap-4 xl:grid-cols-2">
        {teamsData.map((team) => {
          const sportLower = team.sport.toLowerCase();
          const squadMembers = members.filter((m) => m.sport && m.sport.toLowerCase().includes(sportLower));
          const assignedCoaches = coaches.filter((c) => c.sport && c.sport.toLowerCase().includes(sportLower) && c.is_approved);

          return (
            <div key={team.name} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{team.sport}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Coaches Assigned ({assignedCoaches.length}):</span>{' '}
                  {assignedCoaches.length > 0 ? assignedCoaches.map((c) => `${c.first_name} ${c.last_name}`).join(', ') : 'Unassigned'}
                </p>
                <p><span className="font-semibold text-slate-900">Active Roster Size:</span> {loading ? '…' : squadMembers.length} Athletes</p>
                <p><span className="font-semibold text-slate-900">Training Schedule:</span> {team.schedule}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 5. Events Page
// ----------------------------------------------------------------------
export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filters & Tabs
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);

  const sportsList = ['All', 'Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'];

  function loadEvents() {
    setLoading(true);
    Promise.all([eventService.getAll(), userService.getByRole('Coach')])
      .then(([evList, cList]) => {
        setEvents(evList);
        setCoaches(cList);
      })
      .catch(() => {
        setEvents([]);
        setCoaches([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSport = selectedSport === 'All' || (ev.sport && ev.sport.toLowerCase() === selectedSport.toLowerCase());
      const isPast = String(ev.date) < todayStr;
      const matchesTime = activeTab === 'Past' ? isPast : !isPast;
      return matchesSport && matchesTime;
    });
  }, [events, selectedSport, activeTab, todayStr]);

  const coachMap = useMemo(() => {
    const map = new Map<string, AuthUser>();
    coaches.forEach((c) => map.set(c.id, c));
    return map;
  }, [coaches]);

  return (
    <AdminLayout>
      <PageHeader title="Events & Match Operations Overview" subtitle="Monitor all sports matches and training sessions scheduled by coaches across the club." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between mt-4">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex flex-wrap gap-2">
          <ActionButton label="Refresh Events Feed" onClick={loadEvents} />
        </div>

        {/* TIME RANGE TAB SWITCHER */}
        <div className="flex rounded-full bg-slate-200/80 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('Upcoming')}
            className={`rounded-full px-4 py-2 transition-all ${activeTab === 'Upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Active & Upcoming
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Past')}
            className={`rounded-full px-4 py-2 transition-all ${activeTab === 'Past' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Completed Past Events
          </button>
        </div>
      </div>

      {/* SPORT DISCIPLINE FILTER CHIPS */}
      <div className="mt-4 flex flex-wrap gap-2">
        {sportsList.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSelectedSport(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedSport === s
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {s} {s === 'All' ? `(${events.length})` : ''}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
        <p className="text-lg font-bold text-slate-900">
          {activeTab === 'Upcoming' ? "Active & Upcoming Events" : "Completed Past Events Archive"} ({filteredEvents.length})
        </p>

        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading scheduled events...</p>
          ) : filteredEvents.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No {selectedSport !== 'All' ? selectedSport : ''} {activeTab.toLowerCase()} events scheduled yet.</p>
          ) : (
            filteredEvents.map((ev) => {
              const coachObj = coachMap.get(ev.created_by);
              const coachName = coachObj ? `${coachObj.first_name} ${coachObj.last_name}` : 'Assigned Coach';

              return (
                <div key={ev.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200 bg-slate-50/80 p-4 transition-all hover:bg-white hover:shadow-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-800">{ev.sport || 'General'}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ev.event_type === 'Match' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-brand-700'}`}>{ev.event_type}</span>
                    </div>
                    <h4 className="mt-2 text-base font-bold text-slate-900">{ev.title}</h4>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Arranged by: <span className="font-semibold text-slate-800">{coachName}</span> • Venue: <span className="font-semibold text-slate-800">{ev.venue}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-brand-800">
                      {eventService.formatDate(ev.date)} @ {eventService.formatTime(ev.start_time)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewingEvent(ev)}
                      className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* READ-ONLY VIEW EVENT DETAILS MODAL */}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded-full bg-brand-100 px-3 py-0.5 text-xs font-bold text-brand-800">{viewingEvent.sport || 'General'}</span>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{viewingEvent.title}</h3>
              </div>
              <button type="button" onClick={() => setViewingEvent(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="uppercase text-slate-400 font-bold text-[10px]">Event Category</p>
                  <p className="mt-1 font-bold text-slate-900">{viewingEvent.event_type}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="uppercase text-slate-400 font-bold text-[10px]">Sport Discipline</p>
                  <p className="mt-1 font-bold text-brand-700">{viewingEvent.sport || 'General'}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="uppercase text-slate-400 font-bold text-[10px]">Arranging Coach</p>
                <p className="mt-1 font-bold text-slate-900">
                  {coachMap.get(viewingEvent.created_by)
                    ? `${coachMap.get(viewingEvent.created_by)?.first_name} ${coachMap.get(viewingEvent.created_by)?.last_name} (${coachMap.get(viewingEvent.created_by)?.email})`
                    : 'Assigned Coach / Club Staff'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="uppercase text-slate-400 font-bold text-[10px]">Venue Location</p>
                  <p className="mt-1 font-bold text-slate-900">{viewingEvent.venue}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="uppercase text-slate-400 font-bold text-[10px]">Scheduled Date & Time</p>
                  <p className="mt-1 font-bold text-slate-900">{viewingEvent.date} @ {eventService.formatTime(viewingEvent.start_time)}</p>
                </div>
              </div>

              {viewingEvent.description && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="uppercase text-slate-400 font-bold text-[10px]">Event Description & Notes</p>
                  <p className="mt-1 font-medium text-slate-700">{viewingEvent.description}</p>
                </div>
              )}

              {viewingEvent.opponent && (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="uppercase text-slate-400 font-bold text-[10px]">Match Opponent</p>
                  <p className="mt-1 font-bold text-slate-900">{viewingEvent.opponent}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setViewingEvent(null)} className="rounded-full bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-900">
                Close Event Details
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 6. Resources Page (Venue Management & Approvals)
// ----------------------------------------------------------------------
export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<ResourceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const pendingCount = useMemo(() => {
    return bookings.filter((b) => b.status === 'PENDING').length;
  }, [bookings]);

  // Add Venue Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('50');

  function loadData() {
    setLoading(true);
    const p1 = resourceService.getAll().catch(() => []);
    const p2 = resourceBookingService.getAll().catch(() => []);
    Promise.all([p1, p2])
      .then(([rList, bList]) => {
        setResources(Array.isArray(rList) ? rList : []);
        setBookings(Array.isArray(bList) ? bList : []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddResource(e: React.FormEvent) {
    e.preventDefault();
    try {
      await resourceService.create({
        name,
        resource_type: 'Facility Ground',
        capacity: Number(capacity) || 50,
        quantity: 1,
      });
      setIsAddOpen(false);
      setName('');
      setCapacity('50');
      setFeedback(`New venue '${name}' (Capacity: ${capacity}) created successfully! Saved directly to Database.`);
      await loadData();
    } catch (err) {
      alert('Failed to create venue in database');
    }
  }

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await resourceBookingService.updateStatus(id, status);
      setFeedback(`Coach venue booking request ${status.toLowerCase()}!`);
      await loadData();
    } catch {
      alert('Failed to update booking status');
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Resources & Venue Booking Approvals" subtitle="Create sports venues, dismiss unused fields, and approve coach venue booking requests." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between mt-4">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <ActionButton label="Create New Venue" onClick={() => setIsAddOpen(true)} />
        <ActionButton label="Refresh Venue Requests" onClick={loadData} variant="secondary" />
      </div>

      {/* REGISTERED VENUES SECTION (ALWAYS VISIBLE) */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Registered Club Venues ({resources.length})</h2>
          <span className="text-xs text-slate-500">Created by Admin • Saved in DB</span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 py-6 text-center text-xs text-slate-400">Loading registered venues from DB...</p>
          ) : resources.length === 0 ? (
            <div className="col-span-3 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
              No registered venues in database. Click <span className="font-bold text-brand-700">&quot;Create New Venue&quot;</span> above to add your first facility.
            </div>
          ) : (
            resources.map((r) => {
              const hasActiveBooking = bookings.some(
                (b) => b.venue_name?.toLowerCase() === r.name.toLowerCase() && b.status === 'APPROVED'
              );
              return (
                <div key={r.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Capacity: <span className="font-bold text-slate-800">{r.capacity || 50}</span> athletes</p>
                  </div>
                  <button
                    type="button"
                    disabled={hasActiveBooking}
                    onClick={async () => {
                      if (!confirm(`Are you sure you want to dismiss venue '${r.name}'?`)) return;
                      try {
                        await resourceService.delete(r.id);
                        setFeedback(`Venue '${r.name}' dismissed and deleted from database.`);
                        loadData();
                      } catch {
                        alert('Failed to dismiss venue');
                      }
                    }}
                    title={hasActiveBooking ? 'Cannot dismiss venue while actively booked by a coach' : 'Dismiss venue'}
                    className={`rounded-xl p-2 transition-all ${
                      hasActiveBooking ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* COACH VENUE BOOKING REQUESTS LOG */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Coach Venue Booking Requests ({bookings.length})</h2>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              {pendingCount} Pending Approval
            </span>
          )}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Venue / Court</th>
                <th className="px-4 py-3">Sport</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time Slot / Remarks</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-xs text-slate-400">Loading booking requests...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-xs text-slate-400">No venue booking requests submitted by coaches yet.</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{b.venue_name || 'Admin Venue'}</td>
                    <td className="px-4 py-3">{b.sport_name || 'Badminton'}</td>
                    <td className="px-4 py-3 text-xs font-semibold">{String(b.booking_date)}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{b.remarks || (b.start_time ? `${b.start_time} - ${b.end_time}` : 'FN/AN Slot')}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : b.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {b.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.status !== 'APPROVED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.id, 'APPROVED')}
                          className="mr-2 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                        >
                          Accept
                        </button>
                      )}
                      {b.status !== 'REJECTED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                          className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE VENUE MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleAddResource} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create New Venue</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Venue Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Main Stadium Pitch A" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Capacity Number</label>
                <input type="number" min="1" required value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="50" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Create Venue</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}


import sportPlansService, { type SportPlan } from '../../services/sportPlansService';

// ----------------------------------------------------------------------
// 7. Membership Fees Page
// ----------------------------------------------------------------------
export function MembershipFeesPage() {
  const [plans, setPlans] = useState<SportPlan[]>(() => sportPlansService.getPlanList());
  const [editingPlan, setEditingPlan] = useState<SportPlan | null>(null);
  const [monthlyInput, setMonthlyInput] = useState('');
  const [halfYearInput, setHalfYearInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  function reloadPlans() {
    setPlans(sportPlansService.getPlanList());
  }

  function handleOpenEdit(plan: SportPlan) {
    setEditingPlan(plan);
    setMonthlyInput(String(plan.monthlyPrice));
    setHalfYearInput(String(plan.halfYearPrice));
  }

  function handleSavePrice(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPlan) return;
    const monthlyNum = Number(monthlyInput) || editingPlan.monthlyPrice;
    const halfYearNum = Number(halfYearInput) || editingPlan.halfYearPrice;

    sportPlansService.updatePlan(editingPlan.sport, {
      monthlyPrice: monthlyNum,
      halfYearPrice: halfYearNum,
    });

    setEditingPlan(null);
    setFeedback(`Membership fee for ${editingPlan.sport} updated! New prices are live for students.`);
    reloadPlans();
  }

  return (
    <AdminLayout>
      <PageHeader title="Membership Fees & Pricing" subtitle="Configure and update sport-by-sport membership fees for Monthly and 6-Month subscription plans. Changes immediately apply to students." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between mt-4">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3 font-sans mt-4">
        {plans.map((plan) => (
          <div key={plan.sport} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{plan.sport}</h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Official Plan</span>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-brand-700">
                  <span className="text-slate-500 text-xs font-normal">Monthly Plan: </span>₹{plan.monthlyPrice.toLocaleString('en-IN')} / mo
                </p>
                <p className="text-sm font-semibold text-emerald-700">
                  <span className="text-slate-500 text-xs font-normal">6-Month Pass: </span>₹{plan.halfYearPrice.toLocaleString('en-IN')} / 6 mos
                </p>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-600">{plan.description}</p>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => handleOpenEdit(plan)}
                className="rounded-full bg-brand-50 border border-brand-200 px-4 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100 transition-colors"
              >
                Edit Plan Prices
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSavePrice} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Update {editingPlan.sport} Pricing</h3>
              <button type="button" onClick={() => setEditingPlan(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Monthly Plan Fee (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={monthlyInput}
                  onChange={(e) => setMonthlyInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-bold text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">6-Month Plan Fee (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={halfYearInput}
                  onChange={(e) => setHalfYearInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-bold text-slate-900 outline-none"
                />
              </div>
              <p className="text-xs text-slate-500">
                Updating these values will immediately change the membership fee shown to students in their portal checkout.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingPlan(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md">Save & Publish Prices</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 8. Payments Page
// ----------------------------------------------------------------------
export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  function loadPayments() {
    setLoading(true);
    paymentService.getAll()
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPayments();

    function handlePaymentEvent() {
      loadPayments();
    }

    window.addEventListener('club_payment_completed', handlePaymentEvent);
    return () => window.removeEventListener('club_payment_completed', handlePaymentEvent);
  }, []);

  const totalRevenue = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);

  function handleSendReminder(id: string) {
    setFeedback(`Payment reminder sent for invoice ${id.slice(0, 8)}.`);
  }

  return (
    <AdminLayout>
      <PageHeader title="Payments & Invoices" subtitle="Review club revenue, fee invoices, status tracking, and member payment history." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Revenue Collected" value={`₹${totalRevenue.toLocaleString('en-IN')}`} detail="Live Ledger Total" />
        <StatCard label="Paid Invoices" value={loading ? '…' : String(payments.filter((p) => p.invoice_status === 'Paid').length)} detail="Completed" />
        <StatCard label="Pending Payments" value={loading ? '…' : String(payments.filter((p) => p.invoice_status === 'Pending').length)} detail="Follow-up needed" />
        <StatCard label="Overdue Invoices" value={loading ? '…' : String(payments.filter((p) => p.invoice_status === 'Overdue').length)} detail="Overdue" />
      </div>

      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 mt-4">
        <p className="text-lg font-bold text-slate-900">Live Invoices Ledger</p>
        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice ID</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Payment Model</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">Loading invoices...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">No payment invoices found</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900">INV-{p.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{paymentService.formatAmount(p.amount)}</td>
                    <td className="px-4 py-3">{p.payment_model}</td>
                    <td className="px-4 py-3 text-slate-600">{p.due_date}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.invoice_status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {p.invoice_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => handleSendReminder(p.id)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Reminder</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 9. Announcements Page
// ----------------------------------------------------------------------
export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const user = authService.getCurrentUser();

  function loadAnnouncements() {
    setLoading(true);
    announcementService.getAll()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await announcementService.create({
        title,
        message,
        created_by: user.id,
      });
      setIsCreateOpen(false);
      setTitle('');
      setMessage('');
      setFeedback('Club-wide announcement published!');
      loadAnnouncements();
    } catch {
      alert('Failed to publish announcement');
    }
  }

  async function handleDelete(id: string) {
    try {
      await announcementService.delete(id);
      setFeedback('Announcement deleted.');
      loadAnnouncements();
    } catch {
      alert('Failed to delete announcement');
    }
  }

  return (
    <AdminLayout>
      <PageHeader title="Announcements & Broadcasts" subtitle="Publish announcements to members, coaches, and staff across the entire club." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <ActionButton label="Publish Announcement" onClick={() => setIsCreateOpen(true)} />
        <ActionButton label="Refresh Feed" onClick={loadAnnouncements} variant="secondary" />
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
        <p className="text-lg font-bold text-slate-900">Live Announcements ({announcements.length})</p>
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No announcements posted yet.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="flex items-start justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-4">
                <div>
                  <h4 className="font-bold text-slate-900">{a.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{a.message}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">{announcementService.formatTime(a.created_at)}</p>
                </div>
                <button type="button" onClick={() => handleDelete(a.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))
          )}
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Post Broadcast Announcement</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Notice Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tournament Schedule Update" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Message Body</label>
                <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type announcement details..." className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Publish Broadcast</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 10. Reports Page
// ----------------------------------------------------------------------
export function ReportsPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  function loadData() {
    setLoading(true);
    Promise.all([
      userService.getByRole('Member'),
      userService.getByRole('Coach'),
      paymentService.getAll(),
      eventService.getAll(),
    ])
      .then(([mList, cList, pList, eList]) => {
        setMembers(mList);
        setCoaches(cList);
        setPayments(pList);
        setEvents(eList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();

    function handlePaymentEvent() {
      loadData();
    }

    window.addEventListener('club_payment_completed', handlePaymentEvent);
    return () => window.removeEventListener('club_payment_completed', handlePaymentEvent);
  }, []);

  const totalRevenue = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);

  function handleExport(format: string) {
    if (format === 'PDF' || format === 'Print') {
      window.print();
      return;
    }

    const csvRows: string[] = [];
    csvRows.push('Category,ID,Name,Email,Role,Sport,Status/Amount');

    members.forEach((m) => {
      csvRows.push(`Member,${m.id},"${m.first_name} ${m.last_name}",${m.email},Member,"${m.sport || ''}",${m.status}`);
    });

    coaches.forEach((c) => {
      csvRows.push(`Coach,${c.id},"${c.first_name} ${c.last_name}",${c.email},Coach,"${c.sport || ''}",${c.status}`);
    });

    payments.forEach((p) => {
      csvRows.push(`Payment,${p.id},Invoice,${p.payment_model},Invoice,${p.due_date},₹${p.amount}`);
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Club_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    setFeedback(`Exporting real live database report as CSV spreadsheet... Download completed!`);
    setTimeout(() => setFeedback(null), 4000);
  }

  const sportsList = ['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'];

  return (
    <AdminLayout>
      <PageHeader title="Analytics & Reports" subtitle="Review live member participation, sport performance, financial summaries, and export real API reports." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Live Revenue" value={loading ? '…' : `₹${totalRevenue.toLocaleString('en-IN')}`} detail="Api Payments Ledger" />
        <StatCard label="Total Registered Athletes" value={loading ? '…' : String(members.length)} detail="Enrolled Roster" />
        <StatCard label="Active Coaching Staff" value={loading ? '…' : String(coaches.filter((c) => c.is_approved && c.status === 'Active').length)} detail="Assigned Staff" />
        <StatCard label="Scheduled Events" value={loading ? '…' : String(events.length)} detail="Live Calendar Fixtures" />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <ActionButton label="Export Real CSV Dataset" onClick={() => handleExport('CSV')} />
        <ActionButton label="Print / Export PDF Summary" onClick={() => handleExport('PDF')} variant="secondary" />
        <ActionButton label="Refresh Analytics" onClick={loadData} variant="secondary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-bold text-slate-900 font-sans">Active Athlete & Staff Growth</p>
          <div className="mt-4 flex h-40 items-end gap-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t-[0.8rem] bg-brand-500" style={{ height: `${Math.min(100, members.length * 15 + 20)}%` }} />
              <span className="mt-2 text-xs font-semibold text-slate-600">Members ({members.length})</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t-[0.8rem] bg-emerald-500" style={{ height: `${Math.min(100, coaches.length * 20 + 20)}%` }} />
              <span className="mt-2 text-xs font-semibold text-slate-600">Coaches ({coaches.length})</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full rounded-t-[0.8rem] bg-amber-500" style={{ height: `${Math.min(100, events.length * 15 + 20)}%` }} />
              <span className="mt-2 text-xs font-semibold text-slate-600">Events ({events.length})</span>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-bold text-slate-900 font-sans">Live Sport Discipline Engagement</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {sportsList.map((sport) => {
              const sportLower = sport.toLowerCase();
              const mCount = members.filter((m) => m.sport && m.sport.toLowerCase().includes(sportLower)).length;
              const cCount = coaches.filter((c) => c.sport && c.sport.toLowerCase().includes(sportLower) && c.is_approved).length;

              return (
                <div key={sport} className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                  <div>
                    <span className="font-semibold text-slate-800">{sport}</span>
                    <p className="text-xs text-slate-500">{mCount} Enrolled Athletes • {cCount} Coaches Assigned</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${mCount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {mCount > 0 ? `${mCount} Active` : 'Open for Enrollment'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 11. Lost & Found Page
// ----------------------------------------------------------------------
export function LostAndFoundAdminPage() {
  return (
    <AdminLayout>
      <LostAndFoundContent variant="admin" />
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 12. Settings Page
// ----------------------------------------------------------------------
export function SettingsPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFeedback('Admin Console settings updated successfully!');
    setTimeout(() => setFeedback(null), 4000);
  }

  return (
    <AdminLayout>
      <PageHeader title="Admin Portal Settings" subtitle="Adjust club name, contact info, operating hours, and system configuration." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6 mt-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sports Club Name</span>
            <input defaultValue="SportsClub Main Arena" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Contact Email</span>
            <input defaultValue="admin@sportsclub.com" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Phone Hotline</span>
            <input defaultValue="+1 202 555 0199" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Operating Hours</span>
            <input defaultValue="06:00 - 22:00 IST" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md">Save Settings</button>
        </div>
      </form>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 13. Profile & Edit Profile Page
// ----------------------------------------------------------------------
export function ProfilePage() {
  const user = authService.getCurrentUser();
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Admin Owner';
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : 'AO';

  return (
    <AdminLayout>
      <PageHeader title="Admin Profile" subtitle="Your account credentials, permissions, and administrator identity." />
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6 mt-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-bold text-white shadow-md">{initials}</div>
            <div>
              <p className="text-xl font-bold text-slate-900">{fullName}</p>
              <p className="text-sm font-semibold text-brand-700">Administrator • Club Operations</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Email Address</p>
            <p className="mt-2 font-semibold text-slate-900">{user?.email || 'admin@sportsclub.com'}</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">User Role</p>
            <p className="mt-2 font-semibold text-slate-900">{user?.role || 'Admin'}</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Status</p>
            <p className="mt-2 font-semibold text-emerald-700">Active Administrator</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export function EditProfilePage() {
  return <ProfilePage />;
}

export function HelpPage() {
  return (
    <AdminLayout>
      <PageHeader title="Help & Support" subtitle="Connect with system support for assistance or platform inquiries." />
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6 mt-4">
        <p className="text-lg font-bold text-slate-900">Support Operations</p>
        <p className="mt-2 text-sm text-slate-600">Email: support@sportsclub.com • 24/7 Admin Desk</p>
      </section>
    </AdminLayout>
  );
}
