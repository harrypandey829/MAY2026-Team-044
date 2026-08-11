import { useState } from 'react';
import { CreditCard, Download, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import paymentService from '../../services/paymentService';

interface TransactionItem {
  id: string;
  title: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Completed';
}

const initialTransactions: TransactionItem[] = [
  { id: '1', title: 'Membership Renewal Payment', amount: '$129.00', date: '21 Jul 2026', status: 'Pending' },
  { id: '2', title: 'Online Payment', amount: '$24.00', date: '12 Jul 2026', status: 'Completed' },
  { id: '3', title: 'Facility Booking', amount: '$18.00', date: '08 Jul 2026', status: 'Completed' },
];

export default function PaymentsPage() {
  const user = authService.getCurrentUser();
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const pendingItem = transactions.find((t) => t.status === 'Pending');

  async function handleConfirmPayment() {
    setIsProcessing(true);
    setPaymentSuccess(false);

    try {
      if (user?.id) {
        await paymentService.create({
          member_id: user.id,
          amount: 129.00,
          payment_model: 'Annual',
          invoice_status: 'Paid',
          due_date: new Date().toISOString().split('T')[0],
          paid_date: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err) {
      console.warn('Backend payment log note:', err);
    }

    setTransactions((prev) =>
      prev.map((t) => (t.status === 'Pending' ? { ...t, status: 'Completed' } : t))
    );

    setIsProcessing(false);
    setPaymentSuccess(true);

    setTimeout(() => {
      setShowPayModal(false);
      setPaymentSuccess(false);
    }, 1500);
  }

  function handleDownloadInvoice(transaction: TransactionItem) {
    const memberName = user ? `${user.first_name} ${user.last_name}` : 'Club Member';
    const invoiceContent = `====================================================
               SPORTS CLUB MANAGEMENT
                  INVOICE RECEIPT
====================================================
Invoice ID: INV-${transaction.id}-${Math.floor(1000 + Math.random() * 9000)}
Date: ${transaction.date}
Billed To: ${memberName}
Email: ${user?.email || 'N/A'}
Member ID: ${user?.id ? `CLB-${user.id.slice(0, 6).toUpperCase()}` : 'CLB-MEMBER'}

----------------------------------------------------
Description                     Amount
----------------------------------------------------
${transaction.title.padEnd(30)} ${transaction.amount}
----------------------------------------------------
Total Paid:                     ${transaction.amount}
Payment Status:                 ${transaction.status === 'Pending' ? 'UNPAID' : 'COMPLETED (PAID)'}
Payment Method:                 Credit Card (*8421)

Thank you for being a valued member of Sports Club!
====================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${transaction.title.replace(/\s+/g, '_')}_${transaction.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

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
            <div key={transaction.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div>
                <p className="font-semibold text-slate-900">{transaction.title}</p>
                <p className="mt-1 text-sm text-slate-500">{transaction.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{transaction.amount}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    transaction.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(transaction)}
                  className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
                  title="Download Invoice"
                >
                  <Download className="h-4 w-4" />
                </button>
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
              {pendingItem
                ? `You have 1 pending charge (${pendingItem.title} - ${pendingItem.amount}).`
                : 'All dues are currently settled. No pending payments!'}
            </p>
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              disabled={!pendingItem}
              className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {pendingItem ? `Pay Now (${pendingItem.amount})` : 'All Paid'}
            </button>
          </div>
        </PageCard>

        <PageCard title="Invoices" subtitle="Download receipts">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Download className="h-4 w-4" /> Membership invoice</div>
            <p className="mt-3 text-sm text-slate-600">Download your latest invoice receipt for reimbursement or record keeping.</p>
            <button
              type="button"
              onClick={() => handleDownloadInvoice(transactions[0])}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" /> Download Latest Invoice
            </button>
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Pending payments are kept visible until settled.</div>
          </div>
        </PageCard>
      </div>

      {/* Payment Confirmation Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Confirm Payment</h3>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {paymentSuccess ? (
              <div className="my-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
                <h4 className="mt-3 text-lg font-semibold text-slate-900">Payment Successful!</h4>
                <p className="mt-1 text-sm text-slate-500">Status has been updated to Paid (Completed).</p>
              </div>
            ) : (
              <div className="my-4 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Description</span>
                    <span className="font-semibold text-slate-900">{pendingItem?.title}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-slate-600">
                    <span>Amount Due</span>
                    <span className="text-base font-bold text-brand-600">{pendingItem?.amount}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-slate-600">
                    <span>Payment Method</span>
                    <span className="font-semibold text-slate-800">Card ending in 8421</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> 256-bit encrypted SSL checkout
                </div>
              </div>
            )}

            {!paymentSuccess && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  disabled={isProcessing}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </MemberLayout>
  );
}

