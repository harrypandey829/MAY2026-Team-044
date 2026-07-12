import { UserPlus, Trophy, CreditCard, Rocket, ArrowDown } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';

const steps = [
  { icon: UserPlus, title: 'Register', desc: 'Create your member account.', color: 'from-brand-500 to-brand-700' },
  { icon: Trophy, title: 'Choose Your Sport', desc: 'Select badminton, cricket, football, swimming or tennis.', color: 'from-pitch-500 to-pitch-700' },
  { icon: CreditCard, title: 'Pay Membership Fee', desc: 'Complete your membership payment securely.', color: 'from-amber-500 to-orange-600' },
  { icon: Rocket, title: 'Start Your Journey', desc: 'Access training schedules, events, attendance, bookings and club updates.', color: 'from-cyan-500 to-blue-600' },
];

function StepCard({ step, index, isLast }: { step: (typeof steps)[number]; index: number; isLast: boolean }) {
  const { ref, visible } = useReveal();
  const Icon = step.icon;
  return (
    <div className="relative">
      <div
        ref={ref}
        className={`animate-on-scroll ${visible ? 'is-visible' : ''} group relative h-full rounded-3xl border border-slate-100 bg-white/90 p-7 text-center shadow-lg shadow-sky-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl`}
        style={{ transitionDelay: `${index * 120}ms` }}
      >
        <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-brand-500 to-pitch-500" />
        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg transition-transform duration-500 group-hover:scale-110`}>
          <Icon className="h-7 w-7 text-white" strokeWidth={2.2} />
        </div>
        <div className="mt-4 font-display text-5xl font-extrabold text-slate-100">{index + 1}</div>
        <h3 className="mt-1 font-display text-lg font-bold text-slate-900">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
      </div>
      {!isLast && (
        <div className="flex justify-center py-3 lg:hidden">
          <ArrowDown className="h-6 w-6 text-brand-400" />
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title={<>Get started in <span className="gradient-text">four simple steps</span></>}
          subtitle="From sign-up to your first training session in minutes — no paperwork, no waiting."
        />
        <div className="relative mt-12 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* connecting line (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-20 hidden h-0.5 bg-gradient-to-r from-brand-200 via-pitch-200 to-brand-200 lg:block" />
          {steps.map((s, i) => (
            <StepCard key={s.title} step={s} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
