import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Dumbbell, Sparkles, TimerReset, Trophy, Waves } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';

const CLUB_SPORTS = [
  { name: 'Badminton', team: 'Club Squad A', coach: 'Coach Maya', position: 'Player', schedule: 'Tue & Thu · 18:00', icon: Dumbbell },
  { name: 'Swimming', team: 'Aquatic Squad', coach: 'Coach Lina', position: 'Lead', schedule: 'Mon & Wed · 06:30', icon: Waves },
  { name: 'Football', team: 'North FC', coach: 'Coach Rafi', position: 'Forward / Midfielder', schedule: 'Fri & Sat · 17:00', icon: Activity },
  { name: 'Tennis', team: 'Court Masters', coach: 'Coach Aarav', position: 'Singles Player', schedule: 'Sat & Sun · 08:00', icon: Trophy },
  { name: 'Cricket', team: 'Strikers XI', coach: 'Coach Singh', position: 'All-Rounder', schedule: 'Wed & Sun · 16:00', icon: Sparkles },
  { name: 'Yoga', team: 'Wellness Block', coach: 'Coach Maya', position: 'Practitioner', schedule: 'Daily · 07:00', icon: Waves },
];

export default function MySportsPage() {
  const navigate = useNavigate();
  const enrolledSports = useMemo(() => {
    const list = authService.getEnrolledSports();
    // Default fallback if user has no sport specified
    if (list.length === 0) {
      const user = authService.getCurrentUser();
      return [user?.sport || 'Badminton'];
    }
    return list;
  }, []);

  const joinedList = useMemo(
    () => CLUB_SPORTS.filter((s) => enrolledSports.includes(s.name)),
    [enrolledSports]
  );

  const exploreList = useMemo(
    () => CLUB_SPORTS.filter((s) => !enrolledSports.includes(s.name)),
    [enrolledSports]
  );

  function handleJoinSport(sportName: string) {
    navigate(`/dashboard/membership?sport=${encodeURIComponent(sportName)}`);
  }

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">My Sports</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Manage every sport you are enrolled in, review your coach details, and explore new sports memberships.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <PageCard title="Joined sports" subtitle={`${joinedList.length} enrolled`}>
          <div className="space-y-3">
            {joinedList.length === 0 ? (
              <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-6 text-center text-slate-500">
                You haven&apos;t joined any sports yet. Explore available sports to get started!
              </div>
            ) : (
              joinedList.map((item) => (
                <div key={item.name} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.team}</p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Enrolled</div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Coach</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{item.coach}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Role</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{item.position}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Weekly schedule</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{item.schedule}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </PageCard>

        <PageCard title="Explore more" subtitle="Join another sport">
          <div className="space-y-3">
            {exploreList.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center justify-between rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-2.5 text-brand-600 shadow-sm"><Icon className="h-5 w-5" /></div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">Membership plan available</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJoinSport(item.name)}
                    className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-3 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
                  >
                    Join
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Select a sport to view its membership plan and enroll instantly.</div>
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
