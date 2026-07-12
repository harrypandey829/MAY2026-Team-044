import { Award, Sparkles, Trophy } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const badges = [
  { title: 'MVP', detail: 'Best performer in the last match', progress: 'Completed' },
  { title: 'Perfect Attendance', detail: 'Five weeks of full attendance', progress: 'Completed' },
  { title: 'Top Scorer', detail: 'Highest goal tally this month', progress: 'Completed' },
  { title: 'Most Improved', detail: 'Greatest momentum over the last three weeks', progress: '85%' },
];

export default function AchievementsPage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Achievements</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Celebrate your milestones, review your earned badges, and see what is still ahead.</p>
        </div>
      </section>

      <PageCard title="Earned badges" subtitle="Your recognition">
        <div className="grid gap-3 md:grid-cols-2">
          {badges.map((badge) => (
            <div key={badge.title} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-full bg-white p-2.5 text-brand-600"><Trophy className="h-4 w-4" /></div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{badge.progress}</span>
              </div>
              <p className="mt-4 font-semibold text-slate-900">{badge.title}</p>
              <p className="mt-2 text-sm text-slate-600">{badge.detail}</p>
            </div>
          ))}
        </div>
      </PageCard>

      <PageCard title="Certificates" subtitle="Progress towards the next badge">
        <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-brand-700"><Award className="h-4 w-4" /> Next target: Elite Consistency</div>
          <p className="mt-3 text-sm text-slate-600">You are 85% of the way to earning your next certificate. Keep your attendance streak going and finish the next two sessions.</p>
          <div className="mt-4 h-3 rounded-full bg-slate-200">
            <div className="h-3 w-[85%] rounded-full bg-gradient-to-r from-brand-500 to-emerald-500" />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-700"><Sparkles className="h-4 w-4 text-brand-600" /> One more week of consistency unlocks the next badge.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
