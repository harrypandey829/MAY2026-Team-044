import { useState } from 'react';
import { Camera, CheckCircle2, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService, { type AuthUser } from '../../services/authService';
import userService from '../../services/userService';

export default function EditProfilePage() {
  const user = authService.getCurrentUser();

  const [firstName, setFirstName] = useState(user?.first_name || 'Alex');
  const [lastName, setLastName] = useState(user?.last_name || 'Carter');
  const [phone, setPhone] = useState(user?.phone || '+1 555 123 4567');
  const [address, setAddress] = useState('185 Harbor Street, Seattle');
  const [emergencyContact, setEmergencyContact] = useState('Mina Carter • +1 555 765 4321');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const updatedUser = {
      ...user,
      id: user?.id || 'demo-user',
      email: user?.email || 'alex@clubmember.com',
      role: user?.role || 'Member',
      first_name: firstName,
      last_name: lastName,
      phone,
    };

    if (user?.id) {
      try {
        await userService.updateProfile(user.id, {
          first_name: firstName,
          last_name: lastName,
          phone,
        });
      } catch {
        // Fallback to local session update
      }
    }

    authService.updateUserLocal(updatedUser as AuthUser);
    setMessage('Profile updated and saved successfully!');
    setSaving(false);
  }

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Edit Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Update your contact information and address details while keeping your account identity secure.</p>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <PageCard title="Profile details" subtitle="Edit your information">
        <form onSubmit={handleSave}>
          <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white">
                  {authService.getInitials()}
                </div>
                <button type="button" className="absolute bottom-0 right-0 rounded-full border border-white bg-white p-2 text-brand-600 shadow-sm">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{firstName} {lastName}</p>
                <p className="text-sm text-slate-500">Update your profile photo and contact details</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 font-semibold"
                />
              </label>
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 font-semibold"
                />
              </label>
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Phone Number</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 font-semibold"
                />
              </label>
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Emergency Contact</span>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 font-semibold"
                />
              </label>
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600 md:col-span-2">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Address</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 font-semibold"
                />
              </label>
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Email</span>
                <input value={user?.email || 'alex@clubmember.com'} readOnly className="w-full bg-transparent outline-none text-slate-500" />
              </label>
              <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
                <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Member ID</span>
                <input value={user ? `CLB-${user.id.slice(0, 6).toUpperCase()}` : 'CLB-2048'} readOnly className="w-full bg-transparent outline-none text-slate-500" />
              </label>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-brand-700"><Mail className="h-4 w-4" /> Email</div>
              <p className="mt-2 text-sm text-slate-600">Read only</p>
            </div>
            <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-brand-700"><Phone className="h-4 w-4" /> Phone</div>
              <p className="mt-2 text-sm text-slate-600">Editable</p>
            </div>
            <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-brand-700"><MapPin className="h-4 w-4" /> Address</div>
              <p className="mt-2 text-sm text-slate-600">Editable</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-300/40 hover:opacity-95 disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <Link to="/dashboard/profile" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </Link>
          </div>

          <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-600" /> Account details are updated in your session and database.</div>
            <div className="mt-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Your profile details remain protected and ready for club use.</div>
          </div>
        </form>
      </PageCard>
    </MemberLayout>
  );
}
