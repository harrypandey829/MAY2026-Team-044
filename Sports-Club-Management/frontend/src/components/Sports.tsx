import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface Sport {
  name: string;
  desc: string;
  gradient: string;
  accent: string;
  illustration: React.ReactNode;
}

const sports: Sport[] = [
  {
    name: 'Badminton',
    desc: 'Professional indoor courts and coaching.',
    gradient: 'from-sky-400 to-blue-600',
    accent: 'text-sky-600',
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
        <ellipse cx="60" cy="100" rx="34" ry="6" fill="#000" opacity="0.08" />
        <path d="M60 30 L60 78" stroke="#1e3a8a" strokeWidth="3" />
        <path d="M60 78 L48 96 M60 78 L72 96" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 40 L80 30" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" />
        <g transform="rotate(-25 82 28)">
          <ellipse cx="82" cy="28" rx="9" ry="14" fill="#fff" stroke="#22c55e" strokeWidth="2" />
          <path d="M73 28 L91 28 M82 14 L82 42" stroke="#22c55e" strokeWidth="1" />
        </g>
        <circle cx="50" cy="22" r="6" fill="#fbbf24" />
      </svg>
    ),
  },
  {
    name: 'Cricket',
    desc: 'Practice nets, league matches and tournaments.',
    gradient: 'from-amber-400 to-orange-600',
    accent: 'text-amber-600',
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
        <ellipse cx="60" cy="100" rx="34" ry="6" fill="#000" opacity="0.08" />
        <rect x="40" y="70" width="5" height="30" rx="2" fill="#92400e" />
        <rect x="75" y="55" width="5" height="45" rx="2" transform="rotate(15 77 77)" fill="#92400e" />
        <circle cx="50" cy="62" r="10" fill="#dc2626" />
        <path d="M40 62 a10 10 0 0 1 20 0" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M50 52 L50 72" stroke="#fff" strokeWidth="1" />
        <circle cx="82" cy="50" r="5" fill="#fff" stroke="#dc2626" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Swimming',
    desc: 'Modern swimming pool with certified instructors.',
    gradient: 'from-cyan-400 to-blue-600',
    accent: 'text-cyan-600',
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
        <ellipse cx="60" cy="100" rx="34" ry="6" fill="#000" opacity="0.08" />
        <path d="M30 70 Q42 62 54 70 T78 70 T102 70" stroke="#06b6d4" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M30 82 Q42 74 54 82 T78 82 T102 82" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="52" cy="50" r="9" fill="#bfdbfe" />
        <path d="M52 59 L52 72" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />
        <path d="M52 62 L40 58" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />
        <circle cx="36" cy="55" r="4" fill="#1d4ed8" />
      </svg>
    ),
  },
  {
    name: 'Football',
    desc: 'Weekly training sessions and competitive matches.',
    gradient: 'from-green-500 to-emerald-700',
    accent: 'text-emerald-600',
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
        <ellipse cx="60" cy="100" rx="34" ry="6" fill="#000" opacity="0.08" />
        <circle cx="60" cy="60" r="22" fill="#fff" stroke="#1e293b" strokeWidth="2.5" />
        <path d="M60 38 L60 82 M38 60 L82 60 M45 45 L75 75 M75 45 L45 75" stroke="#1e293b" strokeWidth="2" />
        <circle cx="60" cy="60" r="4" fill="#1e293b" />
      </svg>
    ),
  },
  {
    name: 'Tennis',
    desc: 'Professional courts and coaching programs.',
    gradient: 'from-lime-400 to-green-600',
    accent: 'text-lime-600',
    illustration: (
      <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
        <ellipse cx="60" cy="100" rx="34" ry="6" fill="#000" opacity="0.08" />
        <ellipse cx="55" cy="70" rx="7" ry="24" transform="rotate(-30 55 70)" fill="#a16207" />
        <circle cx="40" cy="45" r="4" fill="#a16207" />
        <circle cx="78" cy="52" r="12" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
        <path d="M66 52 a12 12 0 0 1 24 0" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M78 40 L78 64" stroke="#fff" strokeWidth="1" />
      </svg>
    ),
  },
];

function SportCard({ sport, index }: { sport: Sport; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${visible ? 'is-visible' : ''} group relative overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-lg shadow-sky-100/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-200/70`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${sport.gradient} opacity-10 transition-transform duration-700 group-hover:scale-150`} />
      <div className={`relative mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-gradient-to-br ${sport.gradient} p-3 shadow-lg`}>
        <div className="h-full w-full">{sport.illustration}</div>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-slate-900">{sport.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{sport.desc}</p>
      <button className={`mt-4 inline-flex items-center gap-1.5 text-sm font-bold ${sport.accent} transition-all hover:gap-2.5`}>
        Explore
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Sports() {
  return (
    <section id="sports" className="relative bg-mesh py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Sports"
          title={<>Five sports. <span className="gradient-text">One community.</span></>}
          subtitle="Pick your game and train with the best. Every sport comes with dedicated facilities, certified coaches and a full calendar of events."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {sports.map((s, i) => (
            <SportCard key={s.name} sport={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
