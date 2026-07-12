import { Camera, Mail, Sparkles, Trophy } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const profileDetails = [
  ['Name', 'Sarah Johnson'],
  ['Employee ID', 'COACH-001'],
  ['Email', 'democoach@sportsclub.com'],
  ['Phone', '+1 202 555 0199'],
  ['Qualification', 'UEFA B'],
  ['Experience', '8 Years'],
  ['Assigned Sport', 'Football'],
  ['Assigned Team', 'Football Team A'],
  ['Certifications', 'First Aid, Strength & Conditioning'],
];

export default function ProfilePage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Access your coaching profile details, certifications, and account controls from one place.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white">SJ</div>
              <button type="button" className="absolute bottom-0 right-0 rounded-full border border-white bg-white p-2 text-brand-600 shadow-sm"><Camera className="h-4 w-4" /></button>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">Sarah Johnson</p>
              <p className="text-sm text-slate-500">Head Coach • Football Team A</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Edit Profile</button>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Change Password</button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-brand-700"><Trophy className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Coach Details</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Professional overview</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {profileDetails.map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Your coaching account is kept current for club communication and planning.</div></div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-brand-600" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Contact</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Primary contact details</h2>
          </div>
        </div>
        <div className="mt-5 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">Email and phone details are shared with the club operations team for scheduling and communication.</div>
      </section>
    </CoachPortalLayout>
  );
}
