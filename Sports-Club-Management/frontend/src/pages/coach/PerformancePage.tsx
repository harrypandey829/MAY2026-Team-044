import { useEffect, useState } from 'react';
import { CheckCircle2, Plus, Sparkles, Trophy, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import userService from '../../services/userService';
import eventService, { type Event } from '../../services/eventService';
import performanceService from '../../services/performanceService';
import authService, { type AuthUser } from '../../services/authService';

export default function PerformancePage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal State
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [goals, setGoals] = useState('1');
  const [assists, setAssists] = useState('1');
  const [minutesPlayed, setMinutesPlayed] = useState('90');
  const [rating, setRating] = useState('8.5');
  const [remarks, setRemarks] = useState('Great positioning and strong tactical execution.');

  const currentUser = authService.getCurrentUser();
  const coachSport = (currentUser?.sport || 'Football').toLowerCase();

  useEffect(() => {
    Promise.all([
      userService.getByRole('Member'),
      eventService.getAll(),
    ])
      .then(([mList, eList]) => {
        const filteredM = mList.filter(
          (m) => !m.sport || m.sport.toLowerCase().includes(coachSport) || coachSport.includes(m.sport.toLowerCase())
        );
        setMembers(filteredM);
        setEvents(eList);
        if (filteredM.length > 0) setSelectedMemberId(filteredM[0].id);
        if (eList.length > 0) setSelectedEventId(eList[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [coachSport]);

  async function handleRecordPerformance(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMemberId) return;
    setFeedback(null);
    try {
      await performanceService.create({
        member_id: selectedMemberId,
        event_id: selectedEventId || (events[0] ? events[0].id : ''),
        goals: Number(goals) || 0,
        assists: Number(assists) || 0,
        minutes_played: Number(minutesPlayed) || 0,
        rating: Number(rating) || 8.0,
        remarks,
      });
      setIsUpdateOpen(false);
      setFeedback('Performance metrics recorded successfully!');
    } catch {
      alert('Failed to record performance metrics');
    }
  }

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Performance Tracking</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Record match statistics, rating metrics, and tactical feedback for every athlete.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsUpdateOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Record Performance
          </button>
        </div>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4 text-emerald-700" /></button>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Statistics</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Squad Metrics</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Active Roster', String(members.length)],
              ['Matches Tracked', String(events.filter((e) => e.event_type === 'Match').length)],
              ['Training Sessions', String(events.filter((e) => e.event_type === 'Practice').length)],
              ['Feedback Logs', 'Live DB'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Coach Feedback</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Game-readiness notes</h2>
            </div>
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            Focus areas: press intensity, defensive transition, and technical execution under fatigue.
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Click &quot;Record Performance&quot; to log stats for individual athletes.</div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Athletes</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Active Performers</h2>
          </div>
          <Trophy className="h-5 w-5 text-brand-600" />
        </div>
        <div className="mt-5 grid gap-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading squad roster...</p>
          ) : members.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No athletes found</p>
          ) : (
            members.map((m) => (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{m.first_name} {m.last_name}</p>
                  <p className="mt-1 text-sm text-slate-600">{m.sport || 'General Sports'} • {m.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMemberId(m.id);
                    setIsUpdateOpen(true);
                  }}
                  className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:scale-105 transition-all"
                >
                  Record Stats
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Record Performance Modal */}
      {isUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleRecordPerformance} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Record Performance Stats</h3>
              <button type="button" onClick={() => setIsUpdateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Select Athlete</label>
                <select value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.first_name} {m.last_name} ({m.sport || 'Athlete'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Goals</label>
                  <input type="number" required value={goals} onChange={(e) => setGoals(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Assists</label>
                  <input type="number" required value={assists} onChange={(e) => setAssists(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Minutes</label>
                  <input type="number" required value={minutesPlayed} onChange={(e) => setMinutesPlayed(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Rating (1 - 10)</label>
                <input type="number" step="0.1" max="10" min="1" required value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Coach Remarks</label>
                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsUpdateOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Performance</button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}
