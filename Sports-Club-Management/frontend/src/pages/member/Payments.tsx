import { useEffect, useState, useMemo } from 'react';
import { BadgeCheck, CheckCircle2, Clock, CreditCard, Download, FileText, IndianRupee, Printer, RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import paymentService, { type Payment } from '../../services/paymentService';
import sportPlansService, { type SportPlan } from '../../services/sportPlansService';
import announcementService from '../../services/announcementService';

export default function PaymentsPage() {
  const user = authService.getCurrentUser();
  const displayName = authService.getDisplayName();
  const memberId = user ? `CLB-${user.id.slice(0, 6).toUpperCase()}` : 'CLB-2048';

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Pay / Renew Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>(user?.sport || 'Badminton');
  const [selectedDuration, setSelectedDuration] = useState<'Monthly' | '6-Months'>('Monthly');
  const [processingPay, setProcessingPay] = useState(false);

  // View / Download Receipt Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  const [plans, setPlans] = useState<Record<string, SportPlan>>(() => sportPlansService.getPlans());

  function loadPayments() {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    paymentService.getAll(user.id)
      .then((data) => {
        setPayments(data);
      })
      .catch((err) => {
        console.error('Failed to load member payments:', err);
        setPayments([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPayments();

    function handlePaymentEvent() {
      loadPayments();
    }

    function handlePlansUpdate() {
      setPlans(sportPlansService.getPlans());
    }

    window.addEventListener('club_payment_completed', handlePaymentEvent);
    window.addEventListener('sport_plans_updated', handlePlansUpdate);

    return () => {
      window.removeEventListener('club_payment_completed', handlePaymentEvent);
      window.removeEventListener('sport_plans_updated', handlePlansUpdate);
    };
  }, [user?.id]);

  const totalPaid = useMemo(() => {
    return payments
      .filter((p) => p.invoice_status === 'Paid')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  }, [payments]);

  const totalPending = useMemo(() => {
    return payments
      .filter((p) => p.invoice_status === 'Pending' || p.invoice_status === 'Overdue')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  }, [payments]);

  const currentPlan = sportPlansService.getPlan(selectedSport);
  const payAmount = selectedDuration === 'Monthly' ? currentPlan.monthlyPrice : currentPlan.halfYearPrice;

  async function handleSettlePending(invoice: Payment) {
    try {
      await paymentService.payInvoice(invoice.id);
      setFeedback(`Invoice INV-${invoice.id.slice(0, 8).toUpperCase()} settled successfully!`);
      loadPayments();
    } catch (err) {
      console.error('Failed to settle invoice:', err);
      alert('Failed to settle payment. Please try again.');
    }
  }

  async function handleProcessPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setProcessingPay(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      await paymentService.create({
        member_id: user.id,
        amount: payAmount,
        payment_model: selectedDuration === 'Monthly' ? 'Monthly' : 'Annual',
        invoice_status: 'Paid',
        due_date: today,
        paid_date: today,
      });

      await authService.addEnrolledSport(selectedSport);

      await announcementService.create({
        title: `Payment Received: ${selectedSport}`,
        message: `${displayName} completed fee payment for ${selectedSport} (${selectedDuration} Plan - ₹${payAmount.toLocaleString('en-IN')}).`,
        created_by: user.id,
      });

      setShowPayModal(false);
      setFeedback(`Payment of ₹${payAmount.toLocaleString('en-IN')} for ${selectedSport} (${selectedDuration} Plan) completed successfully!`);
      loadPayments();
    } catch (err) {
      console.error('Payment creation error:', err);
      alert('Payment processing failed. Please check network connection.');
    } finally {
      setProcessingPay(false);
    }
  }

  function handlePrintReceipt() {
    window.print();
  }

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Payments & Billing</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Review your live payment ledger, renew your sport memberships, settle pending fees, and download official club tax receipts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
            >
              <CreditCard className="h-4 w-4" /> Make Payment / Renew Plan
            </button>
            <button
              type="button"
              onClick={loadPayments}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 shadow-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-emerald-600" />
            {feedback}
          </span>
          <button type="button" onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Fees Paid</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">{payments.filter((p) => p.invoice_status === 'Paid').length} Completed Transactions</p>
        </div>

        <div className="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Dues</span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600"><Clock className="h-4 w-4" /></div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">
            ₹{totalPending.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs text-amber-600 font-semibold">{payments.filter((p) => p.invoice_status === 'Pending').length} Action Required</p>
        </div>

        <div className="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Invoices</span>
            <div className="rounded-xl bg-brand-50 p-2 text-brand-600"><FileText className="h-4 w-4" /></div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{payments.length}</p>
          <p className="mt-1 text-xs text-brand-600 font-semibold">Live Backend Ledger</p>
        </div>
      </div>

      {/* Live Payment History */}
      <PageCard title="Payment history" subtitle="Live transactions and membership invoices">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-brand-500 mb-2" />
            Loading your real-time payment ledger...
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-[1.2rem] border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
            <IndianRupee className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-semibold text-slate-900">No payment records found</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
              You haven't made any fee payments or membership plan renewals yet. Enroll in a sport to generate your first invoice.
            </p>
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
            >
              <CreditCard className="h-4 w-4" /> Make First Payment
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {payments.map((payment) => {
              const isPaid = payment.invoice_status === 'Paid';
              const displayDate = payment.paid_date || payment.due_date || payment.created_at?.split('T')[0] || 'Today';

              return (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[1.2rem] border border-slate-200/80 bg-slate-50/80 p-4 transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`rounded-2xl p-3 shadow-sm ${isPaid ? 'bg-emerald-100/70 text-emerald-700' : 'bg-amber-100/70 text-amber-700'}`}>
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">INV-{payment.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {payment.invoice_status}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {payment.payment_model} Membership Subscription Fee
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {isPaid ? `Paid on ${displayDate}` : `Due by ${payment.due_date}`} • Payment ID: {payment.id.slice(0, 13)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-base font-extrabold text-slate-900">{paymentService.formatAmount(payment.amount)}</p>
                      <p className="text-xs font-semibold text-slate-500 uppercase">{payment.payment_model}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(payment)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100"
                      >
                        <Download className="h-3.5 w-3.5 text-brand-600" /> Receipt
                      </button>
                      {!isPaid && (
                        <button
                          type="button"
                          onClick={() => handleSettlePending(payment)}
                          className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:scale-105 transition-all"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageCard>

      {/* Side-by-side Utilities */}
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <PageCard title="Online payment" subtitle="Instant fee checkout">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <CreditCard className="h-5 w-5 text-brand-600" /> Secure Card / UPI Checkout
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">Live Active</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Pay your club membership fees or renew your duration plan in a few clicks. Changes instantly synchronize with the club registry.
            </p>
            <button
              type="button"
              onClick={() => setShowPayModal(true)}
              className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition-all"
            >
              Pay / Renew Plan Now
            </button>
          </div>
        </PageCard>

        <PageCard title="Invoices & tax receipts" subtitle="Download official records">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-5">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Download className="h-5 w-5 text-brand-600" /> Membership Invoices
            </div>
            <p className="mt-3 text-sm text-slate-600">
              View and download your official branded PDF tax invoices for reimbursement, club admission, or records.
            </p>
            {payments.length > 0 ? (
              <button
                type="button"
                onClick={() => setSelectedInvoice(payments[0])}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
              >
                <Download className="h-4 w-4 text-brand-600" /> View Latest Invoice (INV-{payments[0].id.slice(0, 8).toUpperCase()})
              </button>
            ) : (
              <p className="mt-4 text-xs font-semibold text-slate-400">No invoices generated yet</p>
            )}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" /> Real-time payment records are automatically synced with admin finance console.
            </div>
          </div>
        </PageCard>
      </div>

      {/* Pay / Renew Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <CreditCard className="h-5 w-5 text-brand-600" /> Pay Membership Fee / Renew
              </div>
              <button type="button" onClick={() => setShowPayModal(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Enrolled Sport Discipline</label>
                <div className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm font-bold text-slate-800">
                  {user?.sport || 'Badminton'}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Select Plan Duration</label>
                <div className="mt-1.5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDuration('Monthly')}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      selectedDuration === 'Monthly'
                        ? 'border-brand-500 bg-brand-50/50 text-brand-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-500">Monthly Plan</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">₹{currentPlan.monthlyPrice.toLocaleString('en-IN')}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Valid 30 Days</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDuration('6-Months')}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      selectedDuration === '6-Months'
                        ? 'border-brand-500 bg-brand-50/50 text-brand-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-bold text-brand-600">6-Months Plan</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">₹{currentPlan.halfYearPrice.toLocaleString('en-IN')}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Valid 180 Days</p>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Checkout Breakdown:</p>
                <p>Member: <strong>{displayName} ({memberId})</strong></p>
                <p>Selected Discipline: <strong>{selectedSport}</strong></p>
                <p>Total Fee Payable: <strong className="text-emerald-700 text-sm">₹{payAmount.toLocaleString('en-IN')}</strong></p>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="submit"
                  disabled={processingPay}
                  className="flex-1 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {processingPay ? 'Processing Payment...' : `Confirm & Pay ₹${payAmount.toLocaleString('en-IN')}`}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <ShieldCheck className="h-5 w-5 text-emerald-600" /> Official Payment Receipt
              </div>
              <button type="button" onClick={() => setSelectedInvoice(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-600 font-bold">SportsClub Arena</p>
                  <p className="text-sm font-extrabold text-slate-900">Tax Invoice / Receipt</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  selectedInvoice.invoice_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedInvoice.invoice_status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p><span className="text-slate-400">Invoice Number:</span> <strong className="text-slate-800">INV-{selectedInvoice.id.slice(0, 8).toUpperCase()}</strong></p>
                <p><span className="text-slate-400">Member Name:</span> <strong className="text-slate-800">{displayName}</strong></p>
                <p><span className="text-slate-400">Member ID:</span> <strong className="text-slate-800">{memberId}</strong></p>
                <p><span className="text-slate-400">Payment Model:</span> <strong className="text-slate-800">{selectedInvoice.payment_model} Subscription</strong></p>
                <p><span className="text-slate-400">Date:</span> <strong className="text-slate-800">{selectedInvoice.paid_date || selectedInvoice.due_date || 'Today'}</strong></p>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Total Fee Amount:</span>
                <span className="text-xl font-extrabold text-emerald-700">{paymentService.formatAmount(selectedInvoice.amount)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-all"
              >
                <Printer className="h-4 w-4" /> Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}
