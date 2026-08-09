import { useEffect, useState } from 'react';
import { Award, Sparkles, Trophy } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import attendanceService, { type AttendanceRecord } from '../../services/attendanceService';
import performanceService, { type PerformanceRecord } from '../../services/performanceService';
import authService from '../../services/authService';

export default function AchievementsPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) return;

    Promise.all([
      attendanceService.getMemberHistory(user.id).catch(() => []),
      performanceService.getMemberHistory(user.id).catch(() => []),
    ]).then(([att, perf]) => {
      setAttendanceRecords(att);
      setPerformanceRecords(perf);
    }).finally(() => setLoading(false));
  }, [user?.id]);

  const attendanceRate = attendanceService.getAttendanceRate(attendanceRecords);
  const totals = performanceService.getTotals(performanceRecords);

  const badges = [
    {
      title: 'High Attendance',
      detail: `${attendanceRate}% session attendance rate`,
      progress: attendanceRate >= 80 ? 'Unlocked' : `${attendanceRate}%`,
    },
    {
      title: 'Active Player',
      detail: `${performanceRecords.length} sessions attended so far`,
      progress: performanceRecords.length >= 5 ? 'Unlocked' : `${performanceRecords.length}/5 sessions`,
    },
    {
      title: 'Goal Scorer',
      detail: `${totals.goals} goals scored in recorded matches`,
      progress: totals.goals > 0 ? 'Unlocked' : 'In Progress',
    },
    {
      title: 'Coach Choice',
      detail: totals.avg_rating !== null ? `Average rating ${totals.avg_rating.toFixed(1)}/10` : 'Pending ratings',
      progress: totals.avg_rating && totals.avg_rating >= 8 ? 'Unlocked' : 'In Progress',
    },
  ];

  const targetProgress = Math.min(100, Math.max(10, attendanceRate));

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Achievements</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Celebrate your milestones, review your earned badges, and see what is still ahead.</p>
        </div>
      </section>

      <PageCard title="Earned badges" subtitle={loading ? 'Loading...' : 'Your recognition'}>
        {loading ? (
          <p className="py-6 text-center text-sm text-slate-500">Loading achievements...</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {badges.map((badge) => (
              <div key={badge.title} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-full bg-white p-2.5 text-brand-600"><Trophy className="h-4 w-4" /></div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.progress === 'Unlocked' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {badge.progress}
                  </span>
                </div>
                <p className="mt-4 font-semibold text-slate-900">{badge.title}</p>
                <p className="mt-2 text-sm text-slate-600">{badge.detail}</p>
              </div>
            ))}
          </div>
        )}
      </PageCard>

      <PageCard title="Certificates" subtitle="Progress towards the next badge">
        <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-brand-700"><Award className="h-4 w-4" /> Next target: Elite Consistency</div>
          <p className="mt-3 text-sm text-slate-600">You are {targetProgress}% of the way to earning your next certificate. Keep your attendance streak going and finish your upcoming sessions.</p>
          <div className="mt-4 h-3 rounded-full bg-slate-200">
            <div className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500" style={{ width: `${targetProgress}%` }} />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-700"><Sparkles className="h-4 w-4 text-brand-600" /> Keep training consistently to unlock higher tiers.</div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
