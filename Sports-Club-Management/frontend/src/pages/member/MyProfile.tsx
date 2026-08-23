import { Camera, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const profileDetails = [
  { label: 'Full Name', value: 'Alex Carter' },
  { label: 'Member ID', value: 'CLB-2048' },
  { label: 'Email', value: 'alex@clubmember.com' },
  { label: 'Phone Number', value: '+1 555 123 4567' },
  { label: 'Gender', value: 'Male' },
  { label: 'Date of Birth', value: '14 May 1998' },
  { label: 'Address', value: '185 Harbor Street, Seattle' },
  { label: 'Emergency Contact', value: 'Mina Carter • +1 555 765 4321' },
  { label: 'Sports Joined', value: 'Swimming, Badminton' },
  { label: 'Team', value: 'Aquatic Squad / Club A' },
  { label: 'Coach', value: 'Coach Lina / Coach Maya' },
  { label: 'Membership Plan', value: 'Premium Member' },
  { label: 'Membership Status', value: 'Active' },
  { label: 'Date Joined', value: '12 Jan 2023' },
];

export default function MyProfilePage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">My Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Keep your personal and athletic details up to date and access account management tools in one place.</p>
        </div>
      </section>

      <PageCard
        title="Member profile"
        subtitle="Account overview"
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/edit-profile" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">
              Edit Profile
            </Link>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Change Password
            </button>
          </div>
        }
      >
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                <p className="text-xl font-semibold text-slate-900">Alex Carter</p>
                <p className="text-sm text-slate-500">Premium Member • Active</p>
              </div>
            </div>
            <div className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-brand-700">Member since 2023</div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profileDetails.map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-slate-200/70 bg-white/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Mail className="h-4 w-4" /> Contact</div>
            <p className="mt-2 text-sm text-slate-600">alex@clubmember.com</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Phone className="h-4 w-4" /> Phone</div>
            <p className="mt-2 text-sm text-slate-600">+1 555 123 4567</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><MapPin className="h-4 w-4" /> Address</div>
            <p className="mt-2 text-sm text-slate-600">185 Harbor Street</p>
          </div>
        </div>

        <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-600" /> Your profile is protected and visible only to authorized club staff and coaches.</div>
          <div className="mt-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Membership and training details stay synced with your club account.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
