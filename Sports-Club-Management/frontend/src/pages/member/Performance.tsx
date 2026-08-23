import { useEffect, useState } from 'react';
import { Star, MessageSquareText, Sparkles, Trophy, Calendar } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import authService from '../../services/authService';
import attendanceService, { AttendanceRecord } from '../../services/attendanceService';
import eventService, { Event } from '../../services/eventService';

interface PerformanceEntry {
  attendanceId: string;
  eventTitle: string;
  eventDate: string;
  rating: number | null;
  remarks: string | null;
  status: string;
}

export default function PerformancePage() {
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();
  const userSport = user?.sport || 'Badminton';

  useEffect(() => {
    if (!user) return;

    const loadPerformance = async () => {
      try {
        setLoading(true);
        const [attHistory, allEvents] = await Promise.all([
          attendanceService.getMemberHistory(user.id),
          eventService.getAll(),
        ]);

        const eventMap = new Map<string, Event>();
        allEvents.forEach((ev) => eventMap.set(ev.id, ev));

        const mapped: PerformanceEntry[] = attHistory.map((att: AttendanceRecord) => {
          const ev = eventMap.get(att.event_id);
          return {
            attendanceId: att.id,
            eventTitle: ev?.title || 'Training Session / Match',
            eventDate: ev ? String(ev.date) : att.marked_at,
            rating: (att as any).rating ?? null,
            remarks: att.remarks || null,
            status: att.attendance_status,
          };
        });

        setEntries(mapped);
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    loadPerformance();
  }, [user?.id]);

  const ratedEntries = entries.filter((e) => e.rating !== null && e.rating > 0);
  const averageRating =
    ratedEntries.length > 0
      ? (ratedEntries.reduce((sum, e) => sum + (e.rating || 0), 0) / ratedEntries.length).toFixed(1)
      : '–';

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">{userSport} Performance</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Coach Evaluation & Ratings</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Per-event performance ratings and coach feedback logged during {userSport} training sessions and matches.
          </p>
        </div>
      </section>

      {/* OVERALL SCORE BANNER */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-brand-600 to-indigo-700 p-6 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-100">Overall Average Rating</span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tracking-tight">{averageRating}</span>
            <span className="text-lg font-medium text-sky-200">/ 10</span>
          </div>
          <p className="mt-2 text-xs text-sky-100">Calculated across {ratedEntries.length} evaluated sessions</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-brand-700">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Evaluated Sessions</span>
          </div>
          <p className="mt-4 text-4xl font-extrabold text-slate-900">{ratedEntries.length}</p>
          <p className="mt-2 text-xs text-slate-500">Total sessions rated by coach</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700">
            <Star className="h-5 w-5 fill-emerald-500 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Highest Score</span>
          </div>
          <p className="mt-4 text-4xl font-extrabold text-slate-900">
            {ratedEntries.length > 0 ? `${Math.max(...ratedEntries.map((e) => e.rating!))}/10` : '–'}
          </p>
          <p className="mt-2 text-xs text-slate-500">Peak performance score</p>
        </div>
      </div>

      {/* EVENT-WISE RATINGS & FEEDBACK TABLE */}
      <div className="mt-8">
        <PageCard title="Per-Event Coach Ratings" subtitle="Feedback & score breakdown per session">
          <div className="space-y-4">
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">Loading performance evaluations...</p>
            ) : entries.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No attendance or performance ratings logged yet.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry.attendanceId} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-brand-100 px-3 py-0.5 text-xs font-bold text-brand-800">{userSport}</span>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                          <Calendar className="h-3.5 w-3.5" /> {entry.eventDate}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{entry.eventTitle}</h3>
                    </div>

                    {entry.rating !== null ? (
                      <div className="flex items-center gap-1.5 rounded-2xl bg-amber-50 px-4 py-2 text-amber-900 border border-amber-200">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                        <span className="text-xl font-extrabold">{entry.rating}</span>
                        <span className="text-xs font-semibold text-amber-700">/ 10</span>
                      </div>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">No score given</span>
                    )}
                  </div>

                  {entry.remarks && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700 border border-slate-200/60">
                      <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <div>
                        <span className="font-semibold text-slate-900">Coach Feedback: </span>
                        {entry.remarks}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </PageCard>
      </div>
    </MemberLayout>
  );
}
