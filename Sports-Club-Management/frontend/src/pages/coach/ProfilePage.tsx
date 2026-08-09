import { useState } from 'react';
import { Camera, CheckCircle2, Clock, Mail, ShieldCheck, Sparkles, Trophy, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import authService from '../../services/authService';
import userService from '../../services/userService';

const AVAILABLE_SPORTS = ['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'];

export default function ProfilePage() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [feedback, setFeedback] = useState<string | null>(null);

  // Pending Sport Change Request State
  const pendingKey = user ? `sc_sport_change_request_${user.id}` : 'sc_sport_change_request';
  const [pendingRequest, setPendingRequest] = useState<string | null>(() => {
    return localStorage.getItem(pendingKey);
  });

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSportModalOpen, setIsSportModalOpen] = useState(false);

  // Form States
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedSport, setSelectedSport] = useState(user?.sport || 'Football');

  const [newPassword, setNewPassword] = useState('');

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Coach Portal';
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : 'CP';

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setFeedback(null);
    try {
      const updated = await userService.updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      setUser(updated);
      authService.updateUserLocal(updated);
      setIsEditOpen(false);
      setFeedback('Profile details updated successfully!');
    } catch {
      alert('Failed to update profile');
    }
  }

  function handleApplySportChange(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSport) return;
    if (selectedSport === (user?.sport || 'Football')) {
      alert('You are already assigned to ' + selectedSport);
      return;
    }
    localStorage.setItem(pendingKey, selectedSport);
    setPendingRequest(selectedSport);
    setIsSportModalOpen(false);
    setFeedback(`Sport change request to "${selectedSport}" submitted to Admin for approval.`);
  }

  function handleAdminApprove() {
    if (!user || !pendingRequest) return;
    const updatedUser = { ...user, sport: pendingRequest };
    authService.updateUserLocal(updatedUser);
    setUser(updatedUser);
    localStorage.removeItem(pendingKey);
    setPendingRequest(null);
    setFeedback(`Admin Approved: Assigned sport updated to "${updatedUser.sport}".`);
  }

  function handleAdminReject() {
    localStorage.removeItem(pendingKey);
    setPendingRequest(null);
    setFeedback('Admin Rejected: Sport change request declined by administrator.');
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newPassword) return;
    setFeedback(null);
    try {
      await userService.resetPassword({
        email: user.email,
        old_password: 'password123',
        new_password: newPassword,
      });
      setIsPasswordOpen(false);
      setNewPassword('');
      setFeedback('Password changed successfully!');
    } catch {
      alert('Failed to change password');
    }
  }

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Coach Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Manage assigned sport discipline, credentials, and account settings with Admin approval workflows.</p>
        </div>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4 text-emerald-700" /></button>
        </div>
      )}

      {/* Pending Admin Approval Banner */}
      {pendingRequest && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Sport Assignment Change Request Pending Admin Approval</p>
              <p className="mt-1 text-xs text-amber-800">
                Requested discipline change to <strong className="font-bold underline">{pendingRequest}</strong>. You will remain assigned to <strong className="font-bold">{user?.sport || 'Football'}</strong> until the administrator approves.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdminApprove}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              [Demo Admin] Approve Request
            </button>
            <button
              type="button"
              onClick={handleAdminReject}
              className="rounded-full border border-rose-300 bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white shadow-md">
                {initials}
              </div>
              <button type="button" onClick={() => setIsEditOpen(true)} className="absolute bottom-0 right-0 rounded-full border border-white bg-white p-2 text-brand-600 shadow-sm hover:bg-slate-50"><Camera className="h-4 w-4" /></button>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">{fullName}</p>
              <p className="text-sm font-semibold text-brand-700">Head Coach • {user?.sport || 'Football'}</p>
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {user?.status || 'Active Staff'}
              </span>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsSportModalOpen(true)}
              className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition-all shadow-md"
            >
              Request Sport Change
            </button>
            <button
              type="button"
              onClick={() => {
                setFirstName(user?.first_name || '');
                setLastName(user?.last_name || '');
                setPhone(user?.phone || '');
                setIsEditOpen(true);
              }}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setIsPasswordOpen(true)}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-brand-700"><Trophy className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Coach Details</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Professional Overview</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Full Name', fullName],
              ['User Role', user?.role || 'Coach'],
              ['Email Address', user?.email || '–'],
              ['Phone Number', user?.phone || 'Not set'],
              ['Assigned Sport Discipline', user?.sport || 'Football'],
              ['Staff ID', user ? `COACH-${user.id.slice(0, 6).toUpperCase()}` : '–'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Sport assignment changes require Admin verification before taking effect across squad rosters.</div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-brand-600" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Contact</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Primary Contact Details</h2>
          </div>
        </div>
        <div className="mt-5 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
          Email: <span className="font-semibold text-slate-900">{user?.email}</span> • Phone: <span className="font-semibold text-slate-900">{user?.phone || 'Not set'}</span>
        </div>
      </section>

      {/* Sport Change Request Modal */}
      {isSportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleApplySportChange} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Select / Change Assigned Sport</h3>
              <button type="button" onClick={() => setIsSportModalOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Currently Assigned Sport</label>
                <p className="mt-1 font-bold text-slate-900">{user?.sport || 'Football'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Choose New Sport Discipline</label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500 font-semibold"
                >
                  {AVAILABLE_SPORTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>Note: Sport assignment changes will be submitted to the Admin for approval.</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsSportModalOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Submit Request for Admin Approval</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdateProfile} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile Details</h3>
              <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
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
                <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 202 555 0199" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleChangePassword} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
              <button type="button" onClick={() => setIsPasswordOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">New Password</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsPasswordOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Update Password</button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}
