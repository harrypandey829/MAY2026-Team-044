import type { ReactNode } from 'react';

interface PageCardProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function PageCard({ title, subtitle, action, children, className = '' }: PageCardProps) {
  return (
    <section className={`rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6 ${className}`.trim()}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">{title}</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{subtitle}</h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
