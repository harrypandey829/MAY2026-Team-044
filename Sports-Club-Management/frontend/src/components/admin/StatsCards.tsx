import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardData {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: string;
}

interface StatsCardsProps {
  stats: StatCardData[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.article
            key={stat.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-[1.6rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-3 text-white shadow-lg shadow-sky-300/40">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">{stat.change}</span>
              <span className="text-slate-500">{stat.trend}</span>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
