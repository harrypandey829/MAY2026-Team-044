import { BarChart3, MessageSquareText, Sparkles, Target, Trophy } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const metrics = [
  { label: 'Performance Score', value: '88%', note: 'Above your target' },
  { label: 'Goals', value: '8', note: 'Best this season' },
  { label: 'Assists', value: '5', note: 'Steady team play' },
  { label: 'Matches Played', value: '14', note: 'Two more than last month' },
];

export default function PerformancePage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Performance</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Track your current output, review key sport metrics, and stay aligned with coach feedback.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Performance summary" subtitle="Core metrics">
          <div className="grid gap-3 md:grid-cols-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                <p className="mt-1 text-sm text-slate-600">{metric.note}</p>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="Coach feedback" subtitle="Latest notes">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><MessageSquareText className="h-4 w-4" /> Coach update</div>
            <p className="mt-3 text-sm text-slate-600">Your conditioning has improved significantly. Keep the same rhythm for the next two sessions and your timing will be excellent.</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-800"><Sparkles className="h-4 w-4 text-amber-500" /> Focus area: shot placement and recovery</div>
          </div>
        </PageCard>
      </div>

      <PageCard title="Trend and graphs" subtitle="Performance trend">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><BarChart3 className="h-4 w-4" /> Weekly trend</div>
            <div className="mt-4 flex h-36 items-end gap-3">
              {[65, 72, 76, 81, 88].map((value, index) => (
                <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end rounded-full bg-slate-200 p-1">
                    <div className="w-full rounded-full bg-gradient-to-t from-brand-500 to-emerald-500" style={{ height: `${value}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-brand-700"><Trophy className="h-4 w-4" /> Recent highlights</div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Target className="h-4 w-4 text-brand-600" /> Best score this month</div>
              <div className="flex items-center gap-2"><Target className="h-4 w-4 text-brand-600" /> Fastest recovery time</div>
              <div className="flex items-center gap-2"><Target className="h-4 w-4 text-brand-600" /> Strongest finishing run</div>
            </div>
          </div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
