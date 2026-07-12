import type { ReactNode } from 'react';

interface CoachSummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent: string;
  trend: string;
}

export default function CoachSummaryCard({ title, value, subtitle, icon, accent, trend }: CoachSummaryCardProps) {
  return (
    <div className="group rounded-[1.5rem] border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-2xl ${accent} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-slate-500">{subtitle}</p>
        <span className="rounded-full bg-pitch-100 px-2.5 py-1 font-semibold text-pitch-700">{trend}</span>
      </div>
    </div>
  );
}
