import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent: string;
  trend?: string;
}

export default function DashboardCard({ title, value, subtitle, icon, accent, trend }: DashboardCardProps) {
  return (
    <div className="group rounded-[1.6rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`inline-flex rounded-2xl p-3 text-white ${accent}`}>
        {icon}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">{value}</p>
        </div>
        {trend && (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
