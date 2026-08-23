import { useState } from 'react';
import { Camera, Mail, MapPin, Phone, ShieldCheck, Sparkles, Key, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import userService from '../../services/userService';

export default function MyProfilePage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const user = authService.getCurrentUser();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setPwdLoading(true);
      setPwdMsg(null);
      await userService.resetPassword({
        email: user.email,
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPwdMsg({ type: 'success', text: 'Password successfully changed!' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setPwdMsg({ type: 'error', text: err instanceof Error ? err.message : 'Password change failed' });
    } finally {
      setPwdLoading(false);
    }
  };

  const profileDetails = [
    { label: 'Full Name', value: user ? `${user.first_name} ${user.last_name}` : 'Alex Carter' },
    { label: 'Member ID', value: user ? `CLB-${user.id.slice(0, 6).toUpperCase()}` : 'CLB-2048' },
    { label: 'Email', value: user?.email || 'alex.carter@sportsclub.com' },
    { label: 'Phone Number', value: user?.phone || '+91-9000000006' },
    { label: 'Address', value: user?.address || '12 Baker Street, Central City' },
    { label: 'Sports Joined', value: user?.sport || 'Badminton' },
    { label: 'Membership Status', value: user?.status || 'Active' },
    { label: 'Date Joined', value: '12 Jan 2026' },
  ];

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Account Overview</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">My Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Manage your personal profile, view membership status, and update your security settings.
          </p>
        </div>
      </section>

      <PageCard
        title="Member Profile"
        subtitle="Account Overview & Details"
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/edit-profile" className="rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
              Edit Profile
            </Link>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Key className="h-4 w-4" /> Change Password
            </button>
          </div>
        }
      >
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white uppercase shadow-md">
                  {user ? `${user.first_name[0]}${user.last_name[0]}` : 'AC'}
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-sm text-slate-500">Enrolled Sport: <span className="font-bold text-brand-700">{user?.sport || 'Badminton'}</span></p>
              </div>
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-sm border border-brand-100">
              Status: {user?.status || 'Active'}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileDetails.map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-slate-200/70 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">{item.label}</p>
                <p className="mt-2 text-sm font-bold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Mail className="h-4 w-4" /> Contact Email</div>
            <p className="mt-2 text-sm font-medium text-slate-800">{user?.email}</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Phone className="h-4 w-4" /> Phone Number</div>
            <p className="mt-2 text-sm font-medium text-slate-800">{user?.phone || 'Not provided'}</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><MapPin className="h-4 w-4" /> Address</div>
            <p className="mt-2 text-sm font-medium text-slate-800">{user?.address || 'Not provided'}</p>
          </div>
        </div>
      </PageCard>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
            <p className="mt-1 text-xs text-slate-500">Update your account password</p>

            {pwdMsg && (
              <div className={`mt-4 p-3 text-xs font-semibold rounded-xl ${pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {pwdMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
                >
                  {pwdLoading ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}
