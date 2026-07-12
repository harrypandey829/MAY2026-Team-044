import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

const plans = [
  {
    name: 'Individual Plan',
    price: '$120/year',
    subtitle: 'Best for one adult member.',
    features: ['Full access to club facilities', 'Coaching sessions', 'Tournament participation', 'Attendance tracking', 'Performance reports'],
    cta: 'Become a Member',
    highlight: false,
  },
  {
    name: 'Junior Plan',
    price: '$80/year',
    subtitle: 'Suitable for members under 18.',
    features: ['Junior coaching programs', 'Parent/Guardian support', 'Tournament eligibility', 'Attendance tracking', 'Skill development'],
    cta: 'Choose Junior Plan',
    highlight: true,
  },
  {
    name: 'Family Plan',
    price: '$280/year',
    subtitle: 'Suitable for parents and children.',
    features: ['Up to 4 family members', 'Shared membership', 'Family discounts', 'All club facilities', 'Priority event registration'],
    cta: 'Choose Family Plan',
    highlight: false,
  },
];

const paymentOptions = [
  { title: 'Annual Membership', description: 'Pay once every year and save more.' },
  { title: 'Monthly Subscription', description: 'Pay monthly with automatic renewal.' },
  { title: 'Pay Per Use', description: 'Book facilities and sessions without a membership.' },
];

const benefits = [
  'Professional Coaching',
  'Access to Sports Facilities',
  'Tournament Participation',
  'Online Payments',
  'Attendance Tracking',
  'Performance Analytics',
  'Exclusive Member Events',
  'Priority Facility Booking',
];

export default function Membership() {
  const { ref } = useReveal();

  return (
    <section id="membership" className="relative overflow-hidden bg-mesh py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-emerald-200/45 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center" ref={ref}>
          <span className="inline-block rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Membership Plans
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Choose the Membership That&apos;s Right for You
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Flexible membership options designed for individuals, juniors and families. Enjoy premium facilities, professional coaching and exclusive club benefits.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-[1.75rem] border p-6 shadow-2xl shadow-slate-300/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                plan.highlight
                  ? 'border-sky-300 bg-gradient-to-br from-sky-50 to-emerald-50'
                  : 'border-slate-200/70 bg-white/80 backdrop-blur-xl'
              }`}
            >
              {plan.highlight && (
                <span className="absolute right-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-sky-300/40">
                  {plan.highlight ? <Crown className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                  <p className="text-sm text-slate-500">{plan.subtitle}</p>
                </div>
              </div>

              <div className="mt-6 flex items-end gap-1.5">
                <span className="font-display text-4xl font-extrabold text-slate-900">{plan.price}</span>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pitch-100">
                      <Check className="h-3 w-3 text-pitch-700" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-sky-300/40 hover:scale-[1.01]'
                    : 'border border-sky-200 bg-sky-50/70 text-brand-700 hover:bg-sky-100'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {paymentOptions.map((option) => (
            <div key={option.title} className="rounded-[1.4rem] border border-slate-200/70 bg-white/80 p-5 shadow-lg shadow-slate-300/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 p-2.5 text-white">
                  {option.title.includes('Annual') ? <CalendarDays className="h-4 w-4" /> : option.title.includes('Monthly') ? <CreditCard className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{option.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{option.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-2xl shadow-slate-300/30 backdrop-blur-xl lg:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Membership Benefits</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">Everything You Need to Train Better</h3>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-3 text-white shadow-lg shadow-sky-300/40">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <Trophy className="h-4 w-4" />
                </div>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-sky-200/70 bg-gradient-to-br from-sky-100 via-sky-50 to-emerald-50 p-8 text-center text-slate-900 shadow-2xl shadow-sky-200/60 lg:p-10">
          <h3 className="text-3xl font-semibold">Ready to Join SportsClub?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Become a member today and enjoy professional coaching, premium facilities and an active sporting community.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 transition-all hover:scale-[1.01]">
              <UserPlus className="h-4 w-4" />
              Become a Member
            </Link>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
