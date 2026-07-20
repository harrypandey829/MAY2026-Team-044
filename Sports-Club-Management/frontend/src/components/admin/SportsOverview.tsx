import { motion } from 'framer-motion';
import { ArrowRight, Users2 } from 'lucide-react';

interface SportCardData {
  name: string;
  teams: number;
  members: number;
  coaches: number;
}

const sports: SportCardData[] = [
  { name: 'Football', teams: 3, members: 84, coaches: 4 },
  { name: 'Cricket', teams: 2, members: 62, coaches: 3 },
  { name: 'Badminton', teams: 4, members: 55, coaches: 2 },
  { name: 'Swimming', teams: 2, members: 48, coaches: 2 },
  { name: 'Tennis', teams: 2, members: 41, coaches: 2 },
];

const teams = [
  { name: 'Premier FC', sport: 'Football', captain: 'Daniel Lewis', status: 'Active' },
  { name: 'Aquatic Squad', sport: 'Swimming', captain: 'Sara Noor', status: 'Active' },
  { name: 'Elite Badminton', sport: 'Badminton', captain: 'Mina Patel', status: 'Training' },
];

export default function SportsOverview() {
  return (
    <div className="space-y-5">
      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Sports & Teams</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Sport performance overview</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-5">
          {sports.map((sport, index) => (
            <motion.div
              key={sport.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{sport.name}</h3>
                <div className="rounded-full bg-white p-2 text-brand-600 shadow-sm">
                  <Users2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>{sport.teams} teams</p>
                <p>{sport.members} members</p>
                <p>{sport.coaches} coaches</p>
              </div>
              <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">Manage <ArrowRight className="h-4 w-4" /></button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Teams roster</h2>
            <p className="text-sm text-slate-500">Active teams and captains</p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-semibold">Team</th>
                <th className="pb-3 font-semibold">Sport</th>
                <th className="pb-3 font-semibold">Captain</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.name} className="border-b border-slate-100 last:border-none">
                  <td className="py-3 font-semibold text-slate-800">{team.name}</td>
                  <td className="py-3 text-slate-600">{team.sport}</td>
                  <td className="py-3 text-slate-600">{team.captain}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{team.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
