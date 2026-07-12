import { Activity, Dumbbell, Sparkles, TimerReset, Trophy, Waves } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const joinedSports = [
  { sport: 'Swimming', team: 'Aquatic Squad', coach: 'Coach Lina', position: 'Freestyle Lead', schedule: 'Mon & Wed · 06:30' },
  { sport: 'Badminton', team: 'Club A', coach: 'Coach Maya', position: 'Singles Player', schedule: 'Tue & Thu · 18:00' },
];

export default function MySportsPage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">My Sports</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Manage every sport you are part of, review your coach details, and stay ahead of your weekly schedule.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <PageCard title="Joined sports" subtitle="Current programs">
          <div className="space-y-3">
            {joinedSports.map((item) => (
              <div key={item.sport} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.sport}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.team}</p>
                  </div>
                  <div className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">Active</div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Coach</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{item.coach}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Position</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{item.position}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Weekly schedule</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{item.schedule}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="Explore more" subtitle="Join another sport">
          <div className="space-y-3">
            {[
              { name: 'Football', icon: Activity },
              { name: 'Tennis', icon: Dumbbell },
              { name: 'Yoga', icon: Waves },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center justify-between rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-2.5 text-brand-600 shadow-sm"><Icon className="h-5 w-5" /></div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">New intake available</p>
                    </div>
                  </div>
                  <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-3 py-2 text-sm font-semibold text-white">Join</button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Our coaches can help you find the best fit for your training goals.</div>
          </div>
        </PageCard>
      </div>

      <PageCard title="Training focus" subtitle="Weekly preparation">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: 'Recovery', detail: 'Mobility and recovery sessions', icon: TimerReset },
            { label: 'Performance', detail: 'Strength and speed drills', icon: Trophy },
            { label: 'Balance', detail: 'Cross training and rest planning', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2 text-brand-700"><Icon className="h-4 w-4" /> {item.label}</div>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </PageCard>
    </MemberLayout>
  );
}
