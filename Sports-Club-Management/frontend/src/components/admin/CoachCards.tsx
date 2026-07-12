import { motion } from 'framer-motion';
import { BadgeCheck, Briefcase, Sparkles } from 'lucide-react';

interface CoachCardData {
  name: string;
  sport: string;
  team: string;
  experience: string;
  status: 'Active' | 'On Leave' | 'Available';
}

const coaches: CoachCardData[] = [
  { name: 'Maya Singh', sport: 'Badminton', team: 'Elite Badminton', experience: '12 years', status: 'Active' },
  { name: 'Rafi Hassan', sport: 'Football', team: 'Premier FC', experience: '15 years', status: 'Active' },
  { name: 'Lina Torres', sport: 'Swimming', team: 'Aquatic Squad', experience: '9 years', status: 'Available' },
  { name: 'Aarav Desai', sport: 'Tennis', team: 'Club Tennis', experience: '11 years', status: 'On Leave' },
];

export default function CoachCards() {
  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Coach Management</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Coaching roster</h2>
        </div>
        <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-300/40">+ Add Coach</button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {coaches.map((coach, index) => (
          <motion.div
            key={coach.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${coach.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : coach.status === 'Available' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>{coach.status}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{coach.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{coach.sport}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand-600" /> {coach.team}</p>
              <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-600" /> {coach.experience}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">View</button>
              <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
              <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Assign</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
