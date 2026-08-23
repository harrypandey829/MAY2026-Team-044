import { useEffect, useState } from 'react';
import { CreditCard, FolderKanban } from 'lucide-react';
import resourceService, { type Resource } from '../../services/resourceService';
import paymentService, { type Payment } from '../../services/paymentService';

export default function ResourcesPayments() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  function loadData() {
    setLoading(true);
    Promise.all([resourceService.getAll(), paymentService.getAll()])
      .then(([rList, pList]) => {
        setResources(rList.slice(0, 4));
        setPayments(pList.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();

    function handlePaymentEvent() {
      loadData();
    }

    window.addEventListener('club_payment_completed', handlePaymentEvent);
    return () => window.removeEventListener('club_payment_completed', handlePaymentEvent);
  }, []);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Resources</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Club facilities & gear ({resources.length})</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {loading ? (
            <p className="col-span-2 py-4 text-center text-sm text-slate-500">Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="col-span-2 py-4 text-center text-sm text-slate-500">No resources found</p>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="rounded-[1.35rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${resource.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {resource.is_available ? 'Available' : 'Booked'}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{resource.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{resource.resource_type} • Qty: {resource.quantity}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Payments</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Financial commitments ({payments.length})</h2>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <p className="py-4 text-center text-sm text-slate-500">Loading payments...</p>
          ) : payments.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No payment records found</p>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">INV-{payment.id.slice(0, 6).toUpperCase()}</p>
                    <p className="text-sm text-slate-600">{payment.payment_model} • Due {payment.due_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-emerald-700">{paymentService.formatAmount(payment.amount)}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payment.invoice_status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {payment.invoice_status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
