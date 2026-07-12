import { motion } from 'framer-motion';
import { CalendarRange, FileText, Megaphone, Plus, ShieldCheck, Sparkles, Users2, Warehouse } from 'lucide-react';

const actions = [
  { label: 'Approve New Members', icon: ShieldCheck },
  { label: 'Add Coach', icon: Users2 },
  { label: 'Create Team', icon: Sparkles },
  { label: 'Create Event', icon: CalendarRange },
  { label: 'Add Resource', icon: Warehouse },
  { label: 'Create Announcement', icon: Megaphone },
  { label: 'Generate Report', icon: FileText },
];

export default function QuickActions() {
  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Quick Actions</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Keep club operations moving</h2>
        </div>
        <button type="button" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-brand-700 transition-colors hover:bg-sky-50">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              whileHover={{ y: -3, scale: 1.01 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              type="button"
              className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all hover:border-brand-200 hover:bg-sky-50"
            >
              <span>{action.label}</span>
              <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
                <Icon className="h-4 w-4" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
