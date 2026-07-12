import type { ReactNode } from 'react';

interface MembershipStatProps {
  label: string;
  value: string;
  icon: ReactNode;
}

export default function MembershipStat({ label, value, icon }: MembershipStatProps) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-2.5 text-white">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-base font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
