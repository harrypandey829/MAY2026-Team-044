import { useState } from 'react';
import { Camera, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import userService from '../../services/userService';

export default function EditProfilePage() {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setMsg(null);
      await userService.updateProfile(user.id, {
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
      });

      // Update current user in local state
      const updatedUser = {
        ...user,
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
      };
      localStorage.setItem('sc_current_user', JSON.stringify(updatedUser));

      setMsg({ type: 'success', text: 'Profile successfully updated!' });
      setTimeout(() => navigate('/dashboard/profile'), 1500);
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Account Management</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Edit Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Update your name, phone number, and physical address. Changes persist directly to the club database.
          </p>
        </div>
      </section>

      {msg && (
        <div className={`mt-4 flex items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${msg.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <PageCard title="Profile Details" subtitle="Edit personal and contact information">
          <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white uppercase shadow-md">
                  {user ? `${user.first_name[0]}${user.last_name[0]}` : 'AC'}
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-sm text-slate-500">Enrolled Sport: <span className="font-bold text-brand-700">{user?.sport || 'Badminton'}</span></p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white p-4 text-sm text-slate-600 shadow-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">First Name</span>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-900 outline-none"
                />
              </label>

              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white p-4 text-sm text-slate-600 shadow-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Last Name</span>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-900 outline-none"
                />
              </label>

              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white p-4 text-sm text-slate-600 shadow-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Phone Number</span>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-900 outline-none"
                />
              </label>

              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white p-4 text-sm text-slate-600 shadow-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Email (Read Only)</span>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-transparent font-medium text-slate-400 outline-none"
                />
              </label>

              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white p-4 text-sm text-slate-600 md:col-span-2 shadow-sm">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Address</span>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-900 outline-none"
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-95"
            >
              {saving ? 'Saving Changes…' : 'Save Changes'}
            </button>
            <Link
              to="/dashboard/profile"
              className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </PageCard>
      </form>
    </MemberLayout>
  );
}
