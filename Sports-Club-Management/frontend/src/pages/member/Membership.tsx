import { BadgeCheck, CreditCard, Download, Sparkles, UserRoundCheck } from 'lucide-react';
import { useState } from 'react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const benefits = ['Priority booking', 'Free recovery class', 'Guest passes', 'Member-only events'];

export default function MembershipPage() {
  const [renewed, setRenewed] = useState(false);

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Membership</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review your plan details, renew your membership, and keep your digital card handy whenever you visit the club.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Membership plan" subtitle="Current plan">
          <div className="rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-br from-sky-50 to-emerald-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-600">Membership status</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">Premium Member</p>
              </div>
              <div className="rounded-full bg-white/80 p-2.5 text-emerald-600"><BadgeCheck className="h-5 w-5" /></div>
            </div>
            <p className="mt-5 text-sm text-slate-600">Valid until 21 Jul 2026</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">$129/month</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <span key={benefit} className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-700">{benefit}</span>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => setRenewed((current) => !current)} className="mt-5 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">
            {renewed ? 'Renewal scheduled' : 'Renew Membership'}
          </button>
        </PageCard>

        <PageCard title="Membership card" subtitle="Digital access">
          <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-5">
            <div className="rounded-[1.4rem] bg-slate-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">SportsClub</p>
                  <p className="mt-1 text-xl font-semibold">Alex Carter</p>
                </div>
                <div className="rounded-full bg-white/10 p-2.5"><UserRoundCheck className="h-5 w-5" /></div>
              </div>
              <p className="mt-6 text-sm text-slate-300">Member ID: CLB-2048</p>
              <p className="mt-1 text-sm text-slate-300">Premium Access</p>
            </div>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <Download className="h-4 w-4" /> Download Membership Card
            </button>
          </div>
        </PageCard>
      </div>

      <PageCard title="Payments" subtitle="Renewal and billing">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><CreditCard className="h-4 w-4" /> Auto pay</div>
            <p className="mt-2 text-sm text-slate-600">Your next renewal payment will be collected automatically on 21 Jul 2026.</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Sparkles className="h-4 w-4" /> Benefits active</div>
            <p className="mt-2 text-sm text-slate-600">You are still receiving priority booking and guest access this month.</p>
          </div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
