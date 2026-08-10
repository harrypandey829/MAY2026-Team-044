import { useEffect, useState } from 'react';
import { BookOpen, CalendarDays, Clock3, Plus, Sparkles, UserCheck, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import eventService, { type Event } from '../../services/eventService';
import authService from '../../services/authService';

export default function TrainingSessionsPage() {
  const [sessions, setSessions] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSportFilter, setSelectedSportFilter] = useState('All');

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Event | null>(null);
  const [attendanceSession, setAttendanceSession] = useState<Event | null>(null);

  const user = authService.getCurrentUser();
  const defaultSport = user?.sport || 'Football';

  // Form Fields
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState(defaultSport);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:30');
  const [endTime, setEndTime] = useState('08:00');
  const [venue, setVenue] = useState('Arena Hall A');
  const [description, setDescription] = useState('Full body conditioning and tactical drills');

  const sportsOptions = [
    'Football', 'Basketball', 'Cricket', 'Tennis',
    'Badminton', 'Swimming', 'Volleyball', 'Track & Field', 'Gym & Fitness'
  ];

  function loadSessions() {
    setLoading(true);
    eventService.getAll()
      .then((data) => {
        setSessions(data.filter((e) => e.event_type === 'Practice'));
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    try {
      await eventService.create({
        title,
        event_type: 'Practice',
        sport: sport || 'Football',
        date,
        start_time: startTime,
        end_time: endTime,
        venue,
        description,
        registration_deadline: date,
        created_by: user?.id,
      });
      setIsCreateOpen(false);
      loadSessions();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create training session');
    }
  }

  async function handleUpdateSession(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSession) return;
    try {
      await eventService.update(editingSession.id, {
        title,
        event_type: 'Practice',
        sport,
        date,
        start_time: startTime,
        end_time: endTime,
        venue,
        description,
      });
      setEditingSession(null);
      loadSessions();
    } catch {
      alert('Failed to update training session');
    }
  }

  async function handleCancelSession(id: string) {
    if (!confirm('Are you sure you want to cancel this training session?')) return;
    try {
      await eventService.cancel(id);
      loadSessions();
    } catch {
      alert('Failed to cancel session');
    }
  }

  function openEditModal(session: Event) {
    setEditingSession(session);
    setTitle(session.title);
    setSport(session.sport || defaultSport);
    setDate(session.date);
    setStartTime(session.start_time);
    setEndTime(session.end_time || '08:00');
    setVenue(session.venue);
    setDescription(session.description || '');
  }

  const filteredSessions = sessions.filter((s) => {
    if (selectedSportFilter === 'All') return true;
    return s.sport?.toLowerCase() === selectedSportFilter.toLowerCase();
  });

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Training Sessions</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Plan sessions, schedule practice blocks, select games, and track team attendance in real time.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setSport(defaultSport);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Create Training Session
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Training Schedule</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Active Practice Sessions</h2>
            </div>
            <select
              value={selectedSportFilter}
              onChange={(e) => setSelectedSportFilter(e.target.value)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Games / Sports</option>
              {sportsOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="mt-5 grid gap-4">
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">Loading training sessions...</p>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
                No practice sessions scheduled for selected game. Click &quot;Create Training Session&quot; to get started.
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div key={session.id} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">{session.sport || 'General'}</span>
                        <p className="text-xs font-semibold uppercase text-slate-500">{session.event_type}</p>
                      </div>
                      <p className="mt-1.5 text-lg font-semibold text-slate-900">{session.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{session.description || 'General session'}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${session.event_status === 'Scheduled' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {session.event_status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> {eventService.formatTime(session.start_time)}</p>
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-sky-600" /> {eventService.formatDate(session.date)} • {session.venue}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(session)}
                      className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:scale-105 transition-all"
                    >
                      Edit Session
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendanceSession(session)}
                      className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Attendance
                    </button>
                    {session.event_status === 'Scheduled' && (
                      <button
                        type="button"
                        onClick={() => handleCancelSession(session.id)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Structure</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Standard Practice Blocks</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {['Warm-up & Mobility', 'Fitness & Speed', 'Tactical Drills', 'Match Practice Scrimmage'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  <p className="font-semibold text-slate-800">{item}</p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Active Block</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand-600" /> All practice sessions are tagged by game and broadcast to registered member portals.</div>
          </div>
        </div>
      </section>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateSession} className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Training Session</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Session Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Strength & Tactical Drills" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Game / Sport</label>
                  <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                    {sportsOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Venue</label>
                  <input required value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Arena Hall A" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Start Time</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">End Time</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Session</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdateSession} className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Training Session</h3>
              <button type="button" onClick={() => setEditingSession(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Session Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Game / Sport</label>
                  <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                    {sportsOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Venue</label>
                  <input required value={venue} onChange={(e) => setVenue(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Start Time</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">End Time</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingSession(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Update Session</button>
            </div>
          </form>
        </div>
      )}

      {/* View Attendance Modal */}
      {attendanceSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Attendance: {attendanceSession.title}</h3>
              <button type="button" onClick={() => setAttendanceSession(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Date:</span> {eventService.formatDate(attendanceSession.date)}</p>
              <p><span className="font-semibold text-slate-900">Time:</span> {eventService.formatTime(attendanceSession.start_time)}</p>
              <p><span className="font-semibold text-slate-900">Venue:</span> {attendanceSession.venue}</p>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              <UserCheck className="h-5 w-5 text-emerald-600" /> Session active. Members can register & check-in.
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setAttendanceSession(null)} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </CoachPortalLayout>
  );
}
