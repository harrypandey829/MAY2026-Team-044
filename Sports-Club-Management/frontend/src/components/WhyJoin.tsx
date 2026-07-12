import { Users, CalendarRange, LineChart, CalendarCheck, Gift, Smartphone } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';

const features = [
  { icon: Users, title: 'Professional Coaches', desc: 'Train under experienced coaches.', color: 'from-brand-500 to-brand-700', bg: 'bg-brand-50' },
  { icon: CalendarRange, title: 'Regular Events', desc: 'Participate in practice sessions and tournaments.', color: 'from-pitch-500 to-pitch-700', bg: 'bg-pitch-50' },
  { icon: LineChart, title: 'Performance Tracking', desc: 'Monitor your attendance and progress.', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
  { icon: CalendarCheck, title: 'Easy Facility Booking', desc: 'Reserve courts and equipment online.', color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-50' },
  { icon: Gift, title: 'Membership Benefits', desc: 'Receive exclusive access to club activities.', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50' },
  { icon: Smartphone, title: 'Digital Experience', desc: 'Everything accessible through one mobile-friendly portal.', color: 'from-violet-500 to-indigo-600', bg: 'bg-violet-50' },
];

function FeatureCard({ f, index }: { f: (typeof features)[number]; index: number }) {
  const { ref, visible } = useReveal();
  const Icon = f.icon;
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${visible ? 'is-visible' : ''} group rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-md shadow-sky-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-200/70`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className={`grid h-14 w-14 place-items-center rounded-2xl ${f.bg} transition-transform duration-500 group-hover:scale-110`}>
        <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
        </div>
      </div>
      <h3 className="mt-5 font-display text-lg font-bold text-slate-900">{f.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
    </div>
  );
}

export default function WhyJoin() {
  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Why Join Our Club"
          title={<>Everything you need to <span className="gradient-text">play your best</span></>}
          subtitle="More than just a club — a complete sporting ecosystem built around your growth and enjoyment."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
