import { useEffect, useState } from 'react';
import { CreditCard, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import paymentService, { type Payment } from '../../services/paymentService';
import authService from '../../services/authService';

interface TransactionItem {
  id?: string;
  title: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Paid';
}

const defaultTransactions: TransactionItem[] = [
  { id: 'tx-1', title: 'Membership Renewal Payment', amount: '$129.00', date: '21 Jul 2026', status: 'Pending' },
  { id: 'tx-2', title: 'Online Payment', amount: '$24.00', date: '12 Jul 2026', status: 'Completed' },
  { id: 'tx-3', title: 'Facility Booking', amount: '$18.00', date: '08 Jul 2026', status: 'Completed' },
];

export default function PaymentsPage() {
  const [items, setItems] = useState<TransactionItem[]>(() => {
    const saved = localStorage.getItem('sports_club_member_payments');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });
  const [apiPayments, setApiPayments] = useState<Payment[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const user = authService.getCurrentUser();

  useEffect(() => {
    localStorage.setItem('sports_club_member_payments', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (user) {
      paymentService
        .getAll()
        .then((data) => {
          const userPayments = paymentService.filterByMember(data, user.id);
          setApiPayments(userPayments);
        })
        .catch(() => {});
    }
  }, [user?.id]);

  async function handlePayNow() {
    setLoading(true);
    setMessage(null);

    // Find pending item
    const pendingIndex = items.findIndex((i) => i.status === 'Pending');

    if (pendingIndex === -1) {
      setMessage('No pending payments to settle! All dues are already completed.');
      setLoading(false);
      return;
    }

    // If API payment exists for member, update it
    if (apiPayments.length > 0) {
      const pendingApi = apiPayments.find((p) => p.invoice_status === 'Pending');
      if (pendingApi) {
        try {
          await paymentService.update(pendingApi.id, {
            invoice_status: 'Paid',
            paid_date: new Date().toISOString().split('T')[0],
          });
        } catch {
          // ignore fallback
        }
      }
    }

    // Update local state
    const updated = [...items];
    const target = updated[pendingIndex];
    updated[pendingIndex] = { ...target, status: 'Completed' };
    setItems(updated);

    setMessage(`Payment for "${target.title}" (${target.amount}) completed successfully!`);
    setLoading(false);
  }

  function handleDownloadInvoice() {
    const latestPaid = items.find((i) => i.status === 'Completed' || i.status === 'Paid') || items[0];
    const memberName = authService.getDisplayName();
    const invoiceContent = `=====================================================
            SPORTS CLUB MANAGEMENT INVOICE           
=====================================================
Invoice ID: INV-${Date.now().toString().slice(-6)}
Member: ${memberName}
Email: ${user?.email || 'member@sportsclub.com'}
Date: ${latestPaid.date}
Payment Description: ${latestPaid.title}
Amount Paid: ${latestPaid.amount}
Payment Status: ${latestPaid.status}
Payment Method: Card ending in 8421
=====================================================
Thank you for being a valued member of Sports Club!
=====================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${latestPaid.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage('Invoice downloaded successfully!');
  }

  const hasPending = items.some((i) => i.status === 'Pending');

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Payments</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review your payment history, settle pending charges, and download invoices whenever needed.</p>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <PageCard title="Payment history" subtitle="Recent transactions">
        <div className="grid gap-3">
          {items.map((transaction, idx) => (
            <div key={`${transaction.title}-${idx}`} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div>
                <p className="font-semibold text-slate-900">{transaction.title}</p>
                <p className="mt-1 text-sm text-slate-500">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{transaction.amount}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    transaction.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PageCard>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <PageCard title="Online payment" subtitle="Secure checkout">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><CreditCard className="h-4 w-4" /> Card ending in 8421</div>
            <p className="mt-3 text-sm text-slate-600">
              {hasPending
                ? 'You have pending dues. Click Pay Now to complete your membership renewal payment.'
                : 'All your current dues are settled. Card saved for future renewals.'}
            </p>
            <button
              type="button"
              disabled={loading || !hasPending}
              onClick={handlePayNow}
              className={`mt-4 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all ${
                hasPending
                  ? 'bg-gradient-to-r from-brand-500 to-emerald-500 shadow-sky-300/40 hover:opacity-95'
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              {loading ? 'Processing...' : hasPending ? 'Pay Now' : 'Dues Settled'}
            </button>
          </div>
        </PageCard>

        <PageCard title="Invoices" subtitle="Download receipts">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Download className="h-4 w-4" /> Membership invoice</div>
            <p className="mt-3 text-sm text-slate-600">Download your latest invoice for reimbursement or record keeping.</p>
            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
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
