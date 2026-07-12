import { Camera, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

export default function EditProfilePage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Edit Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Update your contact information and address details while keeping your account identity secure.</p>
        </div>
      </section>

      <PageCard title="Profile details" subtitle="Edit your information">
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white">
                AC
              </div>
              <button type="button" className="absolute bottom-0 right-0 rounded-full border border-white bg-white p-2 text-brand-600 shadow-sm">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Alex Carter</p>
              <p className="text-sm text-slate-500">Update your profile photo and contact details</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Name</span>
              <input defaultValue="Alex Carter" className="w-full bg-transparent outline-none" />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Phone Number</span>
              <input defaultValue="+1 555 123 4567" className="w-full bg-transparent outline-none" />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600 md:col-span-2">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Address</span>
              <input defaultValue="185 Harbor Street, Seattle" className="w-full bg-transparent outline-none" />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Emergency Contact</span>
              <input defaultValue="Mina Carter • +1 555 765 4321" className="w-full bg-transparent outline-none" />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Email</span>
              <input defaultValue="alex@clubmember.com" readOnly className="w-full bg-transparent outline-none" />
            </label>
            <label className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
              <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Member ID</span>
              <input defaultValue="CLB-2048" readOnly className="w-full bg-transparent outline-none" />
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
          <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Save</button>
          <Link to="/dashboard/profile" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Cancel</Link>
        </div>

        <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-600" /> Changes are saved locally in this demo experience.</div>
          <div className="mt-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Your account details remain protected and ready for club use.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
