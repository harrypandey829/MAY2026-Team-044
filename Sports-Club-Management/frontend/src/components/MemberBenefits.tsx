import { CalendarCheck, CalendarDays, BookOpen, Bell, CreditCard, Award, TrendingUp, Trophy } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

const benefits = [
  { icon: CalendarCheck, label: 'Track attendance' },
  { icon: CalendarDays, label: 'View match schedules' },
  { icon: BookOpen, label: 'Book sports facilities' },
  { icon: Bell, label: 'Receive announcements' },
  { icon: CreditCard, label: 'Pay fees online' },
  { icon: Award, label: 'View achievements' },
  { icon: TrendingUp, label: 'Track performance' },
  { icon: Trophy, label: 'Participate in tournaments' },
];

export default function MemberBenefits() {
  const { ref, visible } = useReveal();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-50 py-20 lg:py-28">
      <div className="absolute inset-0 bg-mesh-dark opacity-50" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-pitch-500/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        {/* Left: illustration */}
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand-500/20 to-pitch-500/20 blur-2xl" />
          <div className="relative rounded-[1.75rem] border border-sky-200/70 bg-white/80 p-6 shadow-2xl shadow-sky-100/80 backdrop-blur-md">
            {/* Mock app dashboard */}
            <div className="rounded-2xl bg-sky-50/80 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-pitch-400" />
                  <div>
                    <div className="h-2 w-20 rounded-full bg-white/40" />
                    <div className="mt-1 h-1.5 w-12 rounded-full bg-white/20" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-full bg-white/20" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl bg-white/80 p-3 shadow-sm">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-brand-400 to-emerald-400" />
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200" />
                    <div className="mt-1 h-1.5 w-2/3 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                    <div className="flex-1">
                      <div className="h-1.5 w-3/4 rounded-full bg-slate-200" />
                      <div className="mt-1.5 h-1 w-1/2 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-6 w-12 rounded-full bg-emerald-400/40" />
                  </div>
                ))}
              </div>
            </div>
            {/* floating badges */}
            <div className="absolute -right-3 top-8 rounded-2xl glass px-3 py-2 shadow-xl">
              <p className="font-display text-lg font-extrabold text-pitch-600">92%</p>
              <p className="text-[10px] font-medium text-slate-600">Attendance</p>
            </div>
            <div className="absolute -left-3 bottom-10 rounded-2xl glass px-3 py-2 shadow-xl">
              <p className="font-display text-lg font-extrabold text-brand-700">#3</p>
              <p className="text-[10px] font-medium text-slate-600">Rank</p>
            </div>
          </div>
        </div>

        {/* Right: copy + benefits grid */}
        <div
          ref={ref}
          className={`animate-on-scroll ${visible ? 'is-visible' : ''} order-1 lg:order-2`}
        >
          <span className="inline-block rounded-full bg-white/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Member Benefits
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your entire sporting life — <span className="bg-gradient-to-r from-brand-500 to-emerald-500 bg-clip-text text-transparent">in your pocket</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
            From the first practice to the final whistle, manage everything through one
            mobile-friendly portal designed for active members.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.label}
                  className="group flex items-center gap-3 rounded-2xl border border-sky-200/70 bg-white/80 p-3 backdrop-blur-sm transition-all hover:border-sky-300 hover:bg-white"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-pitch-500 transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4 text-white" strokeWidth={2.2} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
