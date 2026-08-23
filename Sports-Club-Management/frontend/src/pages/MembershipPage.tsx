import { useState, useEffect } from 'react';
import { Crown, ShieldCheck, TrendingUp, CalendarDays, CheckCircle2, ArrowRight, BadgeCheck, Bell, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import MembershipStat from '../components/membership/MembershipStat';
import authService from '../services/authService';
import paymentService, { type Payment } from '../services/paymentService';

const membershipDetails = [
  { label: 'Current Membership Plan', value: 'Active Sports Plan', icon: <Crown className="h-4 w-4" /> },
  { label: 'Membership Status', value: 'Active', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'Membership ID', value: 'SP-2048', icon: <BadgeCheck className="h-4 w-4" /> },
  { label: 'Start Date', value: 'Jan 01, 2026', icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'Expiry Date', value: 'Dec 31, 2026', icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'Renewal Model', value: 'Monthly / 6-Month', icon: <TrendingUp className="h-4 w-4" /> },
  { label: 'Auto Renewal Status', value: 'Enabled', icon: <CheckCircle2 className="h-4 w-4" /> },
];

const timeline = ['Active', 'Grace Period', 'Expired', 'Renewed'];
const notifications = ['Membership expires in 15 days', 'Auto-renewal is enabled', 'Payment successful', 'Renewal completed'];
const quickActions = ['Renew Membership', 'Download Membership Card', 'View Receipts', 'Contact Support'];

function statusBadge(status: string) {
  const styles = {
    Active: 'bg-pitch-100 text-pitch-700',
    'Grace Period': 'bg-amber-100 text-amber-700',
    Expired: 'bg-red-100 text-red-700',
  } as const;

  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${styles[status as keyof typeof styles]}`}>{status}</span>;
}

export default function MembershipPage() {
  const user = authService.getCurrentUser();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.getAll(user?.id)
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-3 py-3 lg:px-4 lg:py-4">
        <div className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-slate-50 to-brand-50 p-3 shadow-xl shadow-slate-900/10 lg:p-4">
          <header className="glass rounded-[1.5rem] p-4 shadow-lg shadow-slate-900/5 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Membership Center</p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Your Membership Overview</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">Manage your membership plan, payments and renewal options from one premium dashboard.</p>
              </div>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100">
                Back to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </header>

          <main className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.95fr]">
            <div className="space-y-4">
              <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Current Membership</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">{user?.sport || 'General'} Sports Membership</h2>
                    <p className="mt-2 text-sm text-slate-600">Your membership stays active and unlocked for all premium features.</p>
                  </div>
                  {statusBadge('Active')}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {membershipDetails.map((item) => (
                    <MembershipStat key={item.label} label={item.label} value={item.value} icon={item.icon} />
                  ))}
                </div>
              </section>

            </div>

            <div className="space-y-4">
              <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">Payment History</h2>
                  <Link to="/dashboard/payments" className="text-sm font-semibold text-brand-700 hover:text-brand-800">View all</Link>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Model</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} className="py-4 text-center text-xs text-slate-400">Loading payments...</td></tr>
                      ) : payments.length === 0 ? (
                        <tr><td colSpan={5} className="py-4 text-center text-xs text-slate-400">No payment invoices found</td></tr>
                      ) : (
                        payments.slice(0, 4).map((row) => (
                          <tr key={row.id} className="border-b border-slate-100 last:border-0">
                            <td className="py-3 font-mono font-medium text-slate-700">INV-{row.id.slice(0, 8).toUpperCase()}</td>
                            <td className="py-3 text-slate-600">{row.paid_date || row.due_date}</td>
                            <td className="py-3 font-semibold text-emerald-700">{paymentService.formatAmount(row.amount)}</td>
                            <td className="py-3 text-slate-600">{row.payment_model}</td>
                            <td className="py-3">
                              {row.invoice_status === 'Paid' ? (
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Paid</span>
                              ) : (
                                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{row.invoice_status}</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-br from-brand-500 to-emerald-500 p-5 text-white shadow-xl shadow-sky-200/70">
                <h2 className="text-xl font-semibold">Membership Renewal</h2>
                <p className="mt-2 text-sm text-white/90">Renew your subscription to enjoy uninterrupted sports privileges.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/dashboard/membership" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow">
                    <CreditCard className="h-4 w-4" /> Renew in Member Portal
                  </Link>
                  <Link to="/dashboard/payments" className="rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                    View Invoices
                  </Link>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-slate-900">Membership Timeline</h2>
                <div className="mt-5 space-y-4">
                  {timeline.map((stage, index) => {
                    const current = stage === 'Active';
                    return (
                      <div key={stage} className="flex items-start gap-3">
                        <div className={`mt-1 h-3 w-3 rounded-full ${current ? 'bg-brand-600' : 'bg-slate-300'}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${current ? 'text-brand-700' : 'text-slate-700'}`}>{stage}</p>
                          {index < timeline.length - 1 && <div className="mt-2 h-6 w-px bg-slate-200" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
                <div className="mt-4 space-y-3">
                  {notifications.map((note) => (
                    <div key={note} className="flex items-start gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-3 text-sm text-slate-700">
                      <Bell className="mt-0.5 h-4 w-4 text-brand-600" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
                <div className="mt-4 grid gap-3">
                  {quickActions.map((action) => (
                    <button key={action} type="button" className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100">
                      {action}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
