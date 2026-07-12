import { Trophy } from 'lucide-react';

/** Brand mark for SportsClub. */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 shadow-lg shadow-sky-300/40">
        <Trophy className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Sports<span className="text-brand-600">Club</span>
      </span>
    </div>
  );
}
