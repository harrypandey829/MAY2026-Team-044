import { UserCircle2, Sparkles } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

export default function ProfilePage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Profile</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Access your personal details and keep your member information up to date.</p>
        </div>
      </section>

      <PageCard title="Personal details" subtitle="Account overview">
        <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 p-3 text-white"><UserCircle2 className="h-6 w-6" /></div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Alex Carter</p>
              <p className="text-sm text-slate-500">Member since 2023</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 font-semibold text-slate-800">alex@clubmember.com</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Member ID</p>
              <p className="mt-1 font-semibold text-slate-800">CLB-2048</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Your profile information is ready for future updates from the club team.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
