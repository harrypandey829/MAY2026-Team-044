import { CreditCard, Download, Sparkles } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const transactions = [
  { title: 'Membership Renewal Payment', amount: '$129.00', date: '21 Jul 2026', status: 'Pending' },
  { title: 'Online Payment', amount: '$24.00', date: '12 Jul 2026', status: 'Completed' },
  { title: 'Facility Booking', amount: '$18.00', date: '08 Jul 2026', status: 'Completed' },
];

export default function PaymentsPage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Payments</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review your payment history, settle pending charges, and download invoices whenever needed.</p>
        </div>
      </section>

      <PageCard title="Payment history" subtitle="Recent transactions">
        <div className="grid gap-3">
          {transactions.map((transaction) => (
            <div key={transaction.title} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div>
                <p className="font-semibold text-slate-900">{transaction.title}</p>
                <p className="mt-1 text-sm text-slate-500">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{transaction.amount}</p>
                <p className="mt-1 text-sm text-slate-500">{transaction.status}</p>
              </div>
            </div>
          ))}
        </div>
      </PageCard>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <PageCard title="Online payment" subtitle="Secure checkout">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><CreditCard className="h-4 w-4" /> Card ending in 8421</div>
            <p className="mt-3 text-sm text-slate-600">Use your saved card to settle pending dues or renew membership in a few clicks.</p>
            <button type="button" className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Pay Now</button>
          </div>
        </PageCard>

        <PageCard title="Invoices" subtitle="Download receipts">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Download className="h-4 w-4" /> Membership invoice</div>
            <p className="mt-3 text-sm text-slate-600">Download your latest invoice for reimbursement or record keeping.</p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <Download className="h-4 w-4" /> Download Invoice
            </button>
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Pending payments are kept visible until settled.</div>
          </div>
        </PageCard>
      </div>
    </MemberLayout>
  );
}
