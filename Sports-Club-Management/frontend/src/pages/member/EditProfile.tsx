import { useState } from 'react';
import { Camera, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService, { AuthUser } from '../../services/authService';
import userService from '../../services/userService';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [form, setForm] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || 'Male',
    dob: user?.dob || '',
    emergencyContact: user?.emergency_contact || '',
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : 'ME';

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await userService.updateProfile(user.id, {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        dob: form.dob,
        emergency_contact: form.emergencyContact,
      });

      const updatedUser: AuthUser = {
        ...user,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        dob: form.dob,
        emergency_contact: form.emergencyContact,
      };

      authService.updateUserLocal(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/profile');
      }, 1000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Edit Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Update your contact information and personal details kept on record.</p>
        </div>
      </section>

      <PageCard title="Profile details" subtitle="Edit your information">
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white">
                {initials}
              </div>
              <button type="button" className="absolute bottom-0 right-0 rounded-full border border-white bg-white p-2 text-brand-600 shadow-sm">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{user ? `${user.first_name} ${user.last_name}` : 'Member'}</p>
              <p className="text-sm text-slate-500">Update your personal details below</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">First Name</span>
              <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full bg-transparent outline-none font-medium text-slate-800"
              />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Last Name</span>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full bg-transparent outline-none font-medium text-slate-800"
              />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Phone Number</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-transparent outline-none font-medium text-slate-800"
              />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Gender</span>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full bg-transparent outline-none font-medium text-slate-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Date of Birth</span>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full bg-transparent outline-none font-medium text-slate-800"
              />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Emergency Contact</span>
              <input
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                className="w-full bg-transparent outline-none font-medium text-slate-800"
              />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600 md:col-span-2">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Address</span>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-transparent outline-none font-medium text-slate-800"
              />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Email</span>
              <input value={user?.email || ''} readOnly className="w-full bg-transparent outline-none opacity-60 cursor-not-allowed" />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Member ID</span>
              <input value={user?.id ? `CLB-${user.id.slice(0, 6).toUpperCase()}` : ''} readOnly className="w-full bg-transparent outline-none opacity-60 cursor-not-allowed" />
            </label>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Profile updated successfully! Redirecting...
          </div>
        )}

        {saveError && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {saveError}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
          <Link to="/dashboard/profile" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700">Cancel</Link>
        </div>

        <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-600" /> Changes are saved securely to your profile.</div>
          <div className="mt-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Your account details remain protected and ready for club use.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}

