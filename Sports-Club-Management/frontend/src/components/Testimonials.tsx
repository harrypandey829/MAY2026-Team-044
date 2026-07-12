import { Quote, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface Testimonial {
  role: string;
  quote: string;
  name: string;
  photo: string;
  accent: string;
}

const testimonials: Testimonial[] = [
  {
    role: 'Player',
    quote: 'Joining SportSphere helped me stay active and participate in regular tournaments.',
    name: 'Alex Carter',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
    accent: 'from-brand-500 to-brand-700',
  },
  {
    role: 'Coach',
    quote: 'Managing training sessions and communicating with players has become much easier.',
    name: 'Priya Sharma',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    accent: 'from-pitch-500 to-pitch-700',
  },
  {
    role: 'Member',
    quote: 'I can book courts, pay fees and track my progress from one place.',
    name: 'Marcus Lee',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    accent: 'from-amber-500 to-orange-600',
  },
];

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${visible ? 'is-visible' : ''} group relative flex flex-col rounded-3xl border border-slate-100 bg-white/90 p-7 shadow-lg shadow-sky-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`absolute -top-3 left-7 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${t.accent} shadow-lg`}>
        <Quote className="h-5 w-5 text-white" fill="currentColor" />
      </div>
      <div className="mt-3 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-base font-medium leading-relaxed text-slate-700">
        "{t.quote}"
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <img src={t.photo} alt={t.name} loading="lazy" className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-display text-sm font-bold text-slate-900">{t.name}</p>
          <p className="text-xs font-medium text-slate-400">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative bg-mesh py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Loved by <span className="gradient-text">players & coaches</span></>}
          subtitle="Real stories from the people who make SportsClub the vibrant community it is."
        />
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
