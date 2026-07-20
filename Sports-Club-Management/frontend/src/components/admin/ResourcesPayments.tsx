import { CreditCard, FolderKanban } from 'lucide-react';

const resources = [
  { title: 'Training Hall', type: 'Facility', availability: 'Open' },
  { title: 'Recovery Pods', type: 'Facility', availability: 'Booked' },
  { title: 'Equipment Kit', type: 'Gear', availability: 'Available' },
  { title: 'Video Analysis Room', type: 'Facility', availability: 'Open' },
];

const payments = [
  { name: 'Annual Memberships', amount: '$12,450', due: '3 days', status: 'Collected' },
  { name: 'Team Sponsorship', amount: '$4,800', due: '7 days', status: 'Pending' },
  { name: 'Coach Stipends', amount: '$3,200', due: 'Today', status: 'Scheduled' },
];

export default function ResourcesPayments() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Resources</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Club facilities & gear</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <div key={resource.title} className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${resource.availability === 'Open' ? 'bg-emerald-50 text-emerald-700' : resource.availability === 'Available' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>{resource.availability}</span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{resource.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{resource.type}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Payments</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Financial commitments</h2>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {payments.map((payment) => (
            <div key={payment.name} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{payment.name}</p>
                  <p className="text-sm text-slate-600">Due in {payment.due}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-slate-900">{payment.amount}</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payment.status === 'Collected' ? 'bg-emerald-50 text-emerald-700' : payment.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>{payment.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
