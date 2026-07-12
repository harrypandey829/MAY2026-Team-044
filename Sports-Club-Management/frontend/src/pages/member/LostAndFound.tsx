import { Search, Sparkles } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const items = [
  { name: 'Blue Water Bottle', description: 'Found near the pool lounge after the morning session.', date: '10 Jul 2026', location: 'Pool Lounge', status: 'Found', reportedBy: 'Mina R.' },
  { name: 'Training Towel', description: 'Lost during the evening badminton class.', date: '08 Jul 2026', location: 'Court 2', status: 'Lost', reportedBy: 'Alex C.' },
];

export default function LostAndFoundPage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Lost & Found</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Report a missing item, check what has been found, and contact the owner when a match is identified.</p>
        </div>
      </section>

      <PageCard title="Report items" subtitle="Quick actions">
        <div className="flex flex-wrap gap-3">
          <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Report Lost Item</button>
          <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Report Found Item</button>
        </div>
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none" placeholder="Search items" />
          </label>
          <div className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">Filter by status</div>
        </div>
      </PageCard>

      <PageCard title="Item listings" subtitle="Lost and found records">
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.name} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  <p className="mt-3 text-sm text-slate-500">{item.date} • {item.location}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Found' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.status}</span>
                  <p className="mt-3 text-sm text-slate-500">Reported by {item.reportedBy}</p>
                </div>
              </div>
              <button type="button" className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Contact Owner</button>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> The front desk team reviews new reports each day.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
