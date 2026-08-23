import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BadgeCheck, CreditCard, Download, QrCode, ShieldCheck, Sparkles, UserRoundCheck, X } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import paymentService from '../../services/paymentService';
import announcementService from '../../services/announcementService';
import sportPlansService, { type SportPlan } from '../../services/sportPlansService';

const benefits = ['Priority facility booking', 'Free recovery & mobility class', 'Guest passes included', 'Member-only tournaments'];

export default function MembershipPage() {
  const [searchParams] = useSearchParams();
  const targetSport = searchParams.get('sport');

  const user = authService.getCurrentUser();
  const [enrolledSports, setEnrolledSports] = useState<string[]>(() => authService.getEnrolledSports());
  const [renewed, setRenewed] = useState(false);
  const [payingSport, setPayingSport] = useState<string | null>(targetSport || null);
  const [selectedDuration, setSelectedDuration] = useState<'Monthly' | '6-Months'>('Monthly');
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [plans, setPlans] = useState<Record<string, SportPlan>>(() => sportPlansService.getPlans());

  useEffect(() => {
    function handlePlansUpdate() {
      setPlans(sportPlansService.getPlans());
    }
    window.addEventListener('sport_plans_updated', handlePlansUpdate);
    return () => window.removeEventListener('sport_plans_updated', handlePlansUpdate);
  }, []);

  const displayName = authService.getDisplayName();
  const memberId = user ? `CLB-${user.id.slice(0, 6).toUpperCase()}` : 'CLB-2048';
  const sportsJoinedText = enrolledSports.length > 0 ? enrolledSports.join(', ') : user?.sport || 'General Sports';
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewSport, setRenewSport] = useState<string>(user?.sport || 'Badminton');
  const [renewDuration, setRenewDuration] = useState<'Monthly' | '6-Months'>('Monthly');
  const [renewing, setRenewing] = useState(false);

  async function handleCompletePayment(sportName: string) {
    const planInfo = sportPlansService.getPlan(sportName);
    const amount = selectedDuration === 'Monthly' ? planInfo.monthlyPrice : planInfo.halfYearPrice;
    const today = new Date().toISOString().split('T')[0];

    await authService.addEnrolledSport(sportName);
    const updated = authService.getEnrolledSports();
    setEnrolledSports(updated);

    try {
      if (user) {
        await paymentService.create({
          member_id: user.id,
          amount: amount,
          payment_model: selectedDuration === 'Monthly' ? 'Monthly' : 'Annual',
          invoice_status: 'Paid',
          due_date: today,
          paid_date: today,
        });
        await announcementService.create({
          title: `New Sports Enrollment: ${sportName}`,
          message: `${displayName} enrolled in ${sportName} (${selectedDuration} Plan - ₹${amount.toLocaleString('en-IN')}).`,
          created_by: user.id,
        });
      }
    } catch (err) {
      console.error('Payment record creation error:', err);
    }

    setPayingSport(null);
    setPaymentSuccess(`Payment Successful! You have unlocked membership and joined ${sportName} (${selectedDuration} Plan - ₹${amount.toLocaleString('en-IN')}). Your fee invoice has been added to Payment History and Admin Console.`);
  }

  async function handleRenewMembership() {
    if (!user) return;
    setRenewing(true);
    const planInfo = sportPlansService.getPlan(renewSport);
    const amount = renewDuration === 'Monthly' ? planInfo.monthlyPrice : planInfo.halfYearPrice;
    const today = new Date().toISOString().split('T')[0];

    try {
      await paymentService.create({
        member_id: user.id,
        amount: amount,
        payment_model: renewDuration === 'Monthly' ? 'Monthly' : 'Annual',
        invoice_status: 'Paid',
        due_date: today,
        paid_date: today,
      });

      await announcementService.create({
        title: `Membership Renewed: ${renewSport}`,
        message: `${displayName} renewed membership for ${renewSport} (${renewDuration} Plan - ₹${amount.toLocaleString('en-IN')}).`,
        created_by: user.id,
      });

      setShowRenewModal(false);
      setRenewed(true);
      setPaymentSuccess(`Membership Renewed Successfully for ${renewSport}! Paid ₹${amount.toLocaleString('en-IN')} (${renewDuration} Plan). Fee invoice is now live in your Payment History and Admin Reports.`);
    } catch (err) {
      console.error('Renewal payment error:', err);
      alert('Failed to process renewal payment. Please try again.');
    } finally {
      setRenewing(false);
    }
  }

  const currentPayingPlan = payingSport ? sportPlansService.getPlan(payingSport) : null;
  const currentRenewPlan = sportPlansService.getPlan(renewSport);

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Membership</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review your active membership plan, manage fee renewals for your enrolled sport, and present your digital access card at the club.</p>
        </div>
      </section>

      {paymentSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 shadow-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-emerald-600" />
            {paymentSuccess}
          </span>
          <button type="button" onClick={() => setPaymentSuccess(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <CreditCard className="h-5 w-5 text-brand-600" /> Renew Sports Membership
              </div>
              <button type="button" onClick={() => setShowRenewModal(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Enrolled Sport Discipline</label>
                <div className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm font-bold text-slate-800">
                  {user?.sport || 'Badminton'}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Select Renewal Duration</label>
                <div className="mt-1.5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRenewDuration('Monthly')}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      renewDuration === 'Monthly'
                        ? 'border-brand-500 bg-brand-50/50 text-brand-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-500">Monthly Plan</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">₹{currentRenewPlan.monthlyPrice.toLocaleString('en-IN')}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Valid for 30 Days</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenewDuration('6-Months')}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      renewDuration === '6-Months'
                        ? 'border-brand-500 bg-brand-50/50 text-brand-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-bold text-brand-600">6-Months Saver</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">₹{currentRenewPlan.halfYearPrice.toLocaleString('en-IN')}</p>
                    <p className="mt-0.5 text-xs text-slate-500">Valid for 180 Days</p>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Renewal Summary:</p>
                <p>Member: <strong>{displayName} ({memberId})</strong></p>
                <p>Sport: <strong>{user?.sport || 'Badminton'}</strong></p>
                <p>Amount to Charge: <strong className="text-emerald-700 text-sm">₹{(renewDuration === 'Monthly' ? currentRenewPlan.monthlyPrice : currentRenewPlan.halfYearPrice).toLocaleString('en-IN')}</strong></p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                disabled={renewing}
                onClick={handleRenewMembership}
                className="flex-1 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {renewing ? 'Processing Payment...' : `Pay ₹${(renewDuration === 'Monthly' ? currentRenewPlan.monthlyPrice : currentRenewPlan.halfYearPrice).toLocaleString('en-IN')} & Renew`}
              </button>
              <button
                type="button"
                onClick={() => setShowRenewModal(false)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Membership plan" subtitle="Active subscriptions">
          <div className="rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-br from-sky-50 to-emerald-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-600">Membership status</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">Active Member</p>
              </div>
              <div className="rounded-full bg-white/80 p-2.5 text-emerald-600"><BadgeCheck className="h-5 w-5" /></div>
            </div>
            <p className="mt-4 text-sm text-slate-600">Enrolled Sports: <strong className="text-slate-900">{sportsJoinedText}</strong></p>
            <p className="mt-1 text-sm text-slate-600">Valid until {renewed ? '30 Jun 2027' : '31 Dec 2026'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {benefits.map((benefit) => (
                <span key={benefit} className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-700">{benefit}</span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowRenewModal(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-105 transition-all"
          >
            <CreditCard className="h-4 w-4" /> Renew Membership & Settle Fee
          </button>
        </PageCard>

        <PageCard title="Membership card" subtitle="Digital access">
          <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-5">
            <div className="rounded-[1.4rem] bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-5 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-brand-400">SportsClub Portal</p>
                  <p className="mt-1 text-xl font-bold text-white">{displayName}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md"><UserRoundCheck className="h-5 w-5 text-emerald-400" /></div>
              </div>
              <div className="mt-6 space-y-1 text-xs text-slate-300">
                <p><span className="text-slate-400">Member ID:</span> <span className="font-semibold text-white">{memberId}</span></p>
                <p><span className="text-slate-400">Sports:</span> <span className="font-semibold text-emerald-300">{sportsJoinedText}</span></p>
                <p><span className="text-slate-400">Role:</span> {user?.role || 'Member'}</p>
              </div>

              {/* Barcode Graphic */}
              <div className="mt-6 flex items-center justify-between rounded-xl bg-white/10 p-3 backdrop-blur-md">
                <div className="flex h-8 gap-1">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2].map((w, idx) => (
                    <div key={idx} className="h-full bg-white/80 rounded-sm" style={{ width: `${w * 2}px` }} />
                  ))}
                </div>
                <QrCode className="h-7 w-7 text-sky-300" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCardModal(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              <Download className="h-4 w-4 text-brand-600" /> View & Download Digital Card
            </button>
          </div>
        </PageCard>
      </div>

      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <ShieldCheck className="h-5 w-5 text-emerald-600" /> Digital Membership Card
              </div>
              <button type="button" onClick={() => setShowCardModal(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 rounded-[1.6rem] bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 p-6 text-white shadow-2xl">
              <p className="text-xs uppercase tracking-widest text-brand-400 font-semibold">SportsClub Official Pass</p>
              <p className="mt-2 text-2xl font-bold text-white">{displayName}</p>
              <p className="text-sm text-emerald-400 font-medium">{user?.role || 'Member'} Access</p>
              <div className="mt-6 space-y-1.5 text-xs text-slate-300 border-t border-white/10 pt-4">
                <p><span className="text-slate-400">Member ID:</span> <span className="font-semibold text-white">{memberId}</span></p>
                <p><span className="text-slate-400">Enrolled Sports:</span> <span className="font-semibold text-white">{sportsJoinedText}</span></p>
                <p><span className="text-slate-400">Valid Through:</span> 31 Dec 2026</p>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-xl bg-white/10 p-3 backdrop-blur-md">
                <div className="flex h-8 gap-1">
                  {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2].map((w, idx) => (
                    <div key={idx} className="h-full bg-white/90 rounded-sm" style={{ width: `${w * 2}px` }} />
                  ))}
                </div>
                <QrCode className="h-8 w-8 text-sky-300" />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  alert('Membership card saved to downloads!');
                  setShowCardModal(false);
                }}
                className="flex-1 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-all"
              >
                Download Image / PDF
              </button>
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <PageCard title="Payments" subtitle="Renewal and billing">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><CreditCard className="h-4 w-4" /> Auto pay</div>
            <p className="mt-2 text-sm text-slate-600">Your renewal payment will be collected automatically on 31 Dec 2026.</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Sparkles className="h-4 w-4" /> Benefits active</div>
            <p className="mt-2 text-sm text-slate-600">You are receiving priority booking and full sports access for {sportsJoinedText}.</p>
          </div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
