import { Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface Coach {
  name: string;
  sport: string;
  experience: string;
  specialization: string;
  photo: string;
}

const coaches: Coach[] = [
  { name: 'Coach David Miller', sport: 'Badminton', experience: '12 years', specialization: 'Doubles strategy & footwork', photo: 'https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Coach Sarah Johnson', sport: 'Swimming', experience: '10 years', specialization: 'Freestyle & butterfly technique', photo: 'https://images.pexels.com/photos/863930/pexels-photo-863930.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Coach Raj Patel', sport: 'Cricket', experience: '15 years', specialization: 'Batting & spin bowling', photo: 'https://images.pexels.com/photos/2078265/pexels-photo-2078265.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { name: 'Coach Emma Wilson', sport: 'Tennis', experience: '9 years', specialization: 'Serve & baseline play', photo: 'https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

function CoachCard({ coach, index }: { coach: Coach; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${visible ? 'is-visible' : ''} group overflow-hidden rounded-3xl border border-slate-100 bg-white/90 shadow-lg shadow-sky-100/70 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={coach.photo}
          alt={coach.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-700 backdrop-blur-sm">
          {coach.sport}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-display text-lg font-bold">{coach.name}</h3>
          <p className="text-sm text-white/90">{coach.specialization}</p>
        </div>
      </div>
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Experience</p>
          <p className="font-display text-lg font-bold text-slate-900">{coach.experience}</p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Coaches() {
  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Our Coaches"
          title={<>Learn from the <span className="gradient-text">best in the game</span></>}
          subtitle="Certified, experienced and passionate — our coaches are committed to helping every member reach their potential."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((c, i) => (
            <CoachCard key={c.name} coach={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
