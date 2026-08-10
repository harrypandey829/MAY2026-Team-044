import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, Plus, Trophy, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import eventService, { type Event } from '../../services/eventService';
import userService from '../../services/userService';
import authService, { type AuthUser } from '../../services/authService';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Event[]>([]);
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Past' | 'League' | 'Friendly'>('All');
  const [selectedSportFilter, setSelectedSportFilter] = useState('All');

  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Event | null>(null);
  const [enteringResultMatch, setEnteringResultMatch] = useState<Event | null>(null);

  const user = authService.getCurrentUser();
  const defaultSport = user?.sport || 'Football';

  // Form Fields
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState(defaultSport);
  const [opponent, setOpponent] = useState('River City FC');
  const [venue, setVenue] = useState('North Pitch');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('16:00');
  const [description, setDescription] = useState('League fixture round');

  const sportsOptions = [
    'Football', 'Basketball', 'Cricket', 'Tennis',
    'Badminton', 'Swimming', 'Volleyball', 'Track & Field'
  ];

  // Result Form Fields
  const [score, setScore] = useState('2-1');
  const [resultStatus, setResultStatus] = useState<'Won' | 'Lost' | 'Draw' | 'Pending'>('Won');
  const [playerOfMatch, setPlayerOfMatch] = useState('');

  function loadData() {
    setLoading(true);
    Promise.all([
      eventService.getAll(),
      userService.getByRole('Member'),
    ])
      .then(([eventsList, membersList]) => {
        setMatches(eventsList.filter((e) => e.event_type === 'Match' || e.opponent));
        setMembers(membersList);
        if (membersList.length > 0) {
          setPlayerOfMatch(`${membersList[0].first_name} ${membersList[0].last_name}`);
        }
      })
      .catch(() => {
        setMatches([]);
        setMembers([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredMatches = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return matches.filter((m) => {
      const matchesSport = selectedSportFilter === 'All' || (m.sport && m.sport.toLowerCase() === selectedSportFilter.toLowerCase());
      if (!matchesSport) return false;

      if (activeFilter === 'Upcoming') return m.date >= today && m.event_status === 'Scheduled';
      if (activeFilter === 'Past') return m.date < today || m.event_status === 'Completed';
      if (activeFilter === 'League') return m.title.toLowerCase().includes('league') || (m.description && m.description.toLowerCase().includes('league'));
      if (activeFilter === 'Friendly') return m.title.toLowerCase().includes('friendly') || (m.description && m.description.toLowerCase().includes('friendly'));
      return true;
    });
  }, [matches, activeFilter, selectedSportFilter]);

  async function handleScheduleMatch(e: React.FormEvent) {
    e.preventDefault();
    try {
      await eventService.create({
        title: title || `vs ${opponent}`,
        event_type: 'Match',
        sport: sport || 'Football',
        date,
        start_time: startTime,
        venue,
        opponent,
        description: description || `Match vs ${opponent}`,
        registration_deadline: date,
        created_by: user?.id,
      });
      setIsScheduleOpen(false);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to schedule match');
    }
  }

  async function handleUpdateMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMatch) return;
    try {
      await eventService.update(editingMatch.id, {
        title: title || editingMatch.title,
        event_type: 'Match',
        sport,
        date,
        start_time: startTime,
        venue,
        opponent,
        description,
      });
      setEditingMatch(null);
      loadData();
    } catch {
      alert('Failed to update match details');
    }
  }

  async function handleSaveMatchResult(e: React.FormEvent) {
    e.preventDefault();
    if (!enteringResultMatch) return;
    try {
      const updatedDesc = `Result: ${resultStatus} (${score}) | MVP: ${playerOfMatch || 'None'} | ${description || ''}`;
      await eventService.update(enteringResultMatch.id, {
        title: enteringResultMatch.title,
        event_type: 'Match',
        sport: enteringResultMatch.sport || sport,
        date: enteringResultMatch.date,
        start_time: enteringResultMatch.start_time,
        venue: enteringResultMatch.venue,
        opponent: enteringResultMatch.opponent || opponent,
        description: updatedDesc,
        event_status: 'Completed',
      });
      setEnteringResultMatch(null);
      loadData();
    } catch {
      alert('Failed to save match result');
    }
  }

  function openEditMatch(match: Event) {
    setEditingMatch(match);
    setTitle(match.title);
    setSport(match.sport || defaultSport);
    setOpponent(match.opponent || 'Opponent FC');
    setVenue(match.venue);
    setDate(match.date);
    setStartTime(match.start_time);
    setDescription(match.description || '');
  }

  function openEnterResult(match: Event) {
    setEnteringResultMatch(match);
    setDescription(match.description || '');
  }

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Match Fixtures</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Schedule upcoming fixtures, record scores and match results, and recognize player achievements.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setSport(defaultSport);
              setOpponent('River City FC');
              setIsScheduleOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Schedule Match
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Upcoming & Past Fixtures</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Fixture Plan</h2>
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
              <p className="py-8 text-center text-sm text-slate-500">Loading match fixtures...</p>
            ) : filteredMatches.length === 0 ? (
              <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
                No fixtures found for selected filter. Click &quot;Schedule Match&quot; to add a new fixture.
              </div>
            ) : (
              filteredMatches.map((match) => (
                <div key={match.id} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">{match.sport || 'Match Game'}</span>
                      <h3 className="mt-1.5 text-lg font-semibold text-slate-900">{match.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{match.venue} {match.opponent ? `• vs ${match.opponent}` : ''}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${match.event_status === 'Scheduled' ? 'bg-brand-50 text-brand-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {match.event_status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> {eventService.formatDate(match.date)}</p>
                    <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-sky-600" /> {eventService.formatTime(match.start_time)}</p>
                  </div>
                  {match.description && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 font-medium">
                      {match.description}
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditMatch(match)}
                      className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:scale-105 transition-all"
                    >
                      Edit Match
                    </button>
                    <button
                      type="button"
                      onClick={() => openEnterResult(match)}
                      className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Enter Match Result
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Fixture Categories</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Filter Matches</h2>
            </div>
            <Trophy className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 space-y-2">
            {(['All', 'Upcoming', 'Past', 'League', 'Friendly'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`w-full rounded-[1.2rem] border p-3.5 text-left text-sm font-semibold transition-all ${
                  activeFilter === filter
                    ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-sm'
                    : 'border-slate-200/70 bg-slate-50/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {filter} Matches
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            Schedule fixtures, log match scores, and designate MVP highlights for squad records.
          </div>
        </div>
      </section>

      {/* Schedule Match Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleScheduleMatch} className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Schedule New Match</h3>
              <button type="button" onClick={() => setIsScheduleOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Game / Sport</label>
                  <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500">
                    {sportsOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Opponent Team</label>
                  <input required value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="e.g. River City FC" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Kickoff Time</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Venue</label>
                <input required value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="North Pitch" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Fixture Notes / Type</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="League match round 4" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsScheduleOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Fixture</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Match Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleUpdateMatch} className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Match Fixture</h3>
              <button type="button" onClick={() => setEditingMatch(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Game / Sport</label>
                  <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500">
                    {sportsOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Opponent</label>
                  <input required value={opponent} onChange={(e) => setOpponent(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Time</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Venue</label>
                <input required value={venue} onChange={(e) => setVenue(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingMatch(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Update Fixture</button>
            </div>
          </form>
        </div>
      )}

      {/* Enter Match Result Modal */}
      {enteringResultMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSaveMatchResult} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Enter Result: {enteringResultMatch.title}</h3>
              <button type="button" onClick={() => setEnteringResultMatch(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Result Outcome</label>
                  <select value={resultStatus} onChange={(e) => setResultStatus(e.target.value as typeof resultStatus)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="Draw">Draw</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Score</label>
                  <input required value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g. 2-1" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Player of the Match (MVP)</label>
                <select value={playerOfMatch} onChange={(e) => setPlayerOfMatch(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  {members.map((m) => (
                    <option key={m.id} value={`${m.first_name} ${m.last_name}`}>
                      {m.first_name} {m.last_name} ({m.sport || 'Athlete'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEnteringResultMatch(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Match Result</button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}
