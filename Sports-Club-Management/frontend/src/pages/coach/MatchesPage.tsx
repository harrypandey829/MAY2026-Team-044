import { useEffect, useMemo, useState } from 'react';
import { Trophy, Clock3, Plus, CheckCircle2, UserCheck, X, Star, MessageSquare } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

import eventService, { type Event } from '../../services/eventService';
import authService, { AuthUser } from '../../services/authService';
import userService from '../../services/userService';
import attendanceService, { AttendanceRecord } from '../../services/attendanceService';
import resourceService, { ResourceBooking } from '../../services/resourceService';

interface AttendanceState {
  [memberId: string]: {
    status: 'PRESENT' | 'ABSENT';
    rating: number;
    remarks: string;
  };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Event[]>([]);
  const [approvedBookings, setApprovedBookings] = useState<ResourceBooking[]>([]);
  const [squadMembers, setSquadMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [attendanceMatch, setAttendanceMatch] = useState<Event | null>(null);
  const [viewingPastMatch, setViewingPastMatch] = useState<Event | null>(null);
  const [pastMatchLogs, setPastMatchLogs] = useState<Record<string, AttendanceRecord>>({});
  const [modalMembers, setModalMembers] = useState<AuthUser[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceState>({});
  const [submittingAtt, setSubmittingAtt] = useState(false);
  const [attSuccess, setAttSuccess] = useState(false);

  const currentUser = authService.getCurrentUser();
  const coachSport = currentUser?.sport || 'Badminton';
  const todayStr = new Date().toISOString().split('T')[0];

  // Form Fields
  const [title, setTitle] = useState('');
  const [opponent, setOpponent] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [description, setDescription] = useState('Competitive league match fixture');

  const loadData = async () => {
    try {
      setLoading(true);
      const [allEvents, allBookings, allMembers] = await Promise.all([
        eventService.getAll(),
        resourceService.getMyBookings(),
        userService.getByRole('Member'),
      ]);

      const sportMatches = allEvents.filter(
        (e) => (e.event_type === 'Match' || e.event_type === 'Tournament') && (!e.sport || e.sport.toLowerCase() === coachSport.toLowerCase())
      );
      setMatches(sportMatches);

      const usedVenueDates = new Set(allEvents.map((e) => `${e.venue}-${e.date}`));
      const approved = allBookings.filter(
        (b) =>
          b.status === 'APPROVED' &&
          b.sport_name?.toLowerCase() === coachSport.toLowerCase() &&
          !usedVenueDates.has(`${b.venue_name}-${b.booking_date}`) &&
          String(b.booking_date) >= todayStr
      );
      setApprovedBookings(approved);

      const sportMembers = allMembers.filter(
        (m) => m.sport && m.sport.toLowerCase() === coachSport.toLowerCase()
      );
      setSquadMembers(sportMembers);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [coachSport]);

  const upcomingMatches = useMemo(
    () => matches.filter((s) => String(s.date) > todayStr),
    [matches, todayStr]
  );
  const todaysMatches = useMemo(
    () => matches.filter((s) => String(s.date) === todayStr),
    [matches, todayStr]
  );
  const pastMatches = useMemo(
    () => matches.filter((s) => String(s.date) < todayStr),
    [matches, todayStr]
  );

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBooking = approvedBookings.find((b) => b.id === selectedBookingId);
    if (!selectedBooking) {
      alert('Please select an admin-approved venue booking!');
      return;
    }

    if (String(selectedBooking.booking_date) < todayStr) {
      alert('Cannot schedule match fixture for past dates!');
      return;
    }

    try {
      await eventService.create({
        title,
        opponent,
        event_type: 'Match',
        sport: coachSport,
        date: String(selectedBooking.booking_date),
        start_time: startTime,
        end_time: endTime,
        venue: selectedBooking.venue_name || 'Indoor Court B',
        description,
        registration_deadline: String(selectedBooking.booking_date),
        created_by: currentUser?.id,
      });
      setIsCreateOpen(false);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to schedule match');
    }
  };

  const openPastMatch = async (match: Event) => {
    setViewingPastMatch(match);
    try {
      const records = await attendanceService.getEventReport(match.id);
      const map: Record<string, AttendanceRecord> = {};
      records.forEach((r) => {
        map[r.member_id] = r;
      });
      setPastMatchLogs(map);
    } catch {
      setPastMatchLogs({});
    }
  };

  const openAttendanceModal = async (match: Event) => {
    if (String(match.date) < todayStr) {
      alert('Match attendance cannot be taken or edited for past dates.');
      return;
    }

    setAttendanceMatch(match);
    setAttSuccess(false);

    let activeSquad = squadMembers;
    try {
      const regs = await eventService.getEventRegistrations(match.id);
      const registeredUserIds = new Set(regs.map((r) => r.member_id));
      if (registeredUserIds.size > 0) {
        activeSquad = squadMembers.filter((m) => registeredUserIds.has(m.id));
      }
    } catch (err) {
      console.error('Error fetching registered members:', err);
    }
    setModalMembers(activeSquad);

    const initial: AttendanceState = {};
    activeSquad.forEach((m) => {
      initial[m.id] = {
        status: 'PRESENT',
        rating: 9,
        remarks: 'Excellent match performance.',
      };
    });

    try {
      const existingRecords = await attendanceService.getEventReport(match.id);
      existingRecords.forEach((rec) => {
        const st = (rec.attendance_status || '').toUpperCase();
        const statusVal = st === 'ABSENT' ? 'ABSENT' : st === 'LATE' ? 'LATE' : 'PRESENT';
        if (initial[rec.member_id]) {
          initial[rec.member_id] = {
            status: statusVal as any,
            rating: rec.rating ?? initial[rec.member_id].rating,
            remarks: rec.remarks ?? initial[rec.member_id].remarks,
          };
        } else {
          initial[rec.member_id] = {
            status: statusVal as any,
            rating: rec.rating ?? 9,
            remarks: rec.remarks || '',
          };
        }
      });
    } catch (err) {
      console.error('Error fetching match attendance:', err);
    }
    setAttendanceData(initial);
  };

  const submitAttendance = async () => {
    if (!attendanceMatch) return;
    if (String(attendanceMatch.date) < todayStr) {
      alert('Match attendance cannot be taken or edited for past dates.');
      return;
    }
    try {
      setSubmittingAtt(true);
      for (const memberId of Object.keys(attendanceData)) {
        const item = attendanceData[memberId];
        await attendanceService.markAttendance({
          event_id: attendanceMatch.id,
          member_id: memberId,
          attendance_status: item.status,
          remarks: item.remarks,
          rating: item.rating,
        });
      }
      setAttSuccess(true);
      setTimeout(() => setAttendanceMatch(null), 1500);
    } catch (err) {
      alert('Failed to submit match attendance & performance log');
    } finally {
      setSubmittingAtt(false);
    }
  };

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Match Operations: {coachSport}</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{coachSport} Match Fixtures</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Schedule competitive matches using approved venue bookings and log player match performance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setOpponent('');
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Schedule Match Fixture
          </button>
        </div>
      </section>

      {/* 1. TODAY'S MATCHES */}
      <section className="mt-6">
        <div className="flex items-center gap-2 text-brand-700 font-bold uppercase tracking-wider text-xs">
          <Clock3 className="h-4 w-4 text-emerald-600" /> Today's Match Fixtures
        </div>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
              Loading match fixtures...
            </div>
          ) : todaysMatches.length === 0 ? (
            <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
              No match fixtures scheduled for today.
            </div>
          ) : (

            todaysMatches.map((match) => (
              <div key={match.id} className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/50 to-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">MATCH TODAY</span>
                  <span className="text-xs font-semibold text-slate-500">{eventService.formatTime(match.start_time)}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{match.title}</h3>
                <p className="mt-1 text-xs text-slate-600">Opponent: <span className="font-bold text-slate-900">{match.opponent || 'TBD'}</span> • Venue: {match.venue}</p>

                <button
                  type="button"
                  onClick={() => openAttendanceModal(match)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  <UserCheck className="h-4 w-4" /> Log Player Match Performance
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 2. UPCOMING MATCHES */}
      <section className="mt-8">
        <div className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-wider text-xs">
          <Trophy className="h-4 w-4 text-brand-600" /> Upcoming Match Fixtures
        </div>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {upcomingMatches.length === 0 ? (
            <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
              No upcoming match fixtures scheduled.
            </div>
          ) : (
            upcomingMatches.map((match) => (
              <div key={match.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">{coachSport}</span>
                  <span className="text-xs text-slate-500">{eventService.formatDate(match.date)}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{match.title}</h3>
                <p className="mt-1 text-xs text-slate-500">Vs: {match.opponent || 'External Club'} • Venue: {match.venue}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. PAST MATCHES */}
      <section className="mt-8">
        <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-xs">
          <Trophy className="h-4 w-4 text-slate-400" /> Completed Past Matches (Click to View Logs)
        </div>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {pastMatches.length === 0 ? (
            <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
              No completed past matches found.
            </div>
          ) : (
            pastMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => openPastMatch(match)}
                className="cursor-pointer rounded-2xl border border-slate-200/60 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{eventService.formatDate(match.date)}</span>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-700">COMPLETED</span>
                </div>
                <h3 className="mt-1 text-base font-semibold text-slate-800">{match.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">Opponent: {match.opponent || 'TBD'} • Venue: {match.venue} →</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SCHEDULE MATCH MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateMatch} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Schedule Match Fixture</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Match Title</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Championship Quarter Final"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Opponent Team</label>
                <input
                  required
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="e.g. South United FC"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Admin-Approved Venue & Date</label>
                <select
                  required
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold outline-none"
                >
                  <option value="">-- Select Approved Venue Booking --</option>
                  {approvedBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.venue_name} on {String(b.booking_date)} ({b.sport_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-600">Start Time</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-600">End Time</label>
                  <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Description</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700">Save Match Fixture</button>
            </div>
          </form>
        </div>
      )}

      {/* LOG PLAYER MATCH PERFORMANCE MODAL */}
      {attendanceMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Match Player Performance Log</h3>
                <p className="text-xs text-slate-500">{attendanceMatch.title} vs {attendanceMatch.opponent}</p>
              </div>
              <button onClick={() => setAttendanceMatch(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            {attSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Match ratings successfully logged to Member Dashboard!
              </div>
            )}

            <div className="mt-4 space-y-4">
              {modalMembers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs font-semibold text-slate-500">
                  No squad members have registered for this match fixture yet.
                </div>
              ) : (
                modalMembers.map((member) => {
                const state = attendanceData[member.id] || { status: 'PRESENT', rating: 9, remarks: '' };
                return (
                  <div key={member.id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white text-xs">
                          {member.first_name[0]}{member.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.first_name} {member.last_name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>

                      {/* PRESENT / ABSENT / LATE TOGGLE */}
                      <div className="flex rounded-xl bg-slate-200 p-1 text-xs font-bold gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [member.id]: {
                                ...state,
                                status: state.status === 'PRESENT' ? 'ABSENT' : 'PRESENT',
                              },
                            }))
                          }
                          className={`rounded-lg px-3 py-1 transition-all ${
                            state.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                              : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          ✓ Present
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [member.id]: {
                                ...state,
                                status: state.status === 'ABSENT' ? 'PRESENT' : 'ABSENT',
                              },
                            }))
                          }
                          className={`rounded-lg px-3 py-1 transition-all ${
                            state.status === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400'
                              : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          ✕ Absent
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setAttendanceData((prev) => ({
                              ...prev,
                              [member.id]: {
                                ...state,
                                status: (state.status as string) === 'LATE' ? 'PRESENT' : ('LATE' as any),
                              },
                            }))
                          }
                          className={`rounded-lg px-3 py-1 transition-all ${
                            (state.status as string) === 'LATE'
                              ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                              : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          ⏱ Late
                        </button>
                      </div>
                    </div>

                    {state.status !== 'ABSENT' && (

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 pt-3 border-t border-slate-200/60">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" /> Match Rating (1-10)
                          </label>
                          <select
                            value={state.rating}
                            onChange={(e) =>
                              setAttendanceData((prev) => ({
                                ...prev,
                                [member.id]: { ...state, rating: Number(e.target.value) },
                              }))
                            }
                            className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-800"
                          >
                            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                              <option key={num} value={num}>
                                {num} / 10
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5 text-brand-600" /> Match Notes
                          </label>
                          <input
                            type="text"
                            value={state.remarks}
                            onChange={(e) =>
                              setAttendanceData((prev) => ({
                                ...prev,
                                [member.id]: { ...state, remarks: e.target.value },
                              }))
                            }
                            placeholder="e.g. Scored 2 goals, excellent offensive positioning"
                            className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2 text-xs text-slate-800 outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setAttendanceMatch(null)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingAtt}
                onClick={submitAttendance}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md"
              >
                {submittingAtt ? 'Submitting Log…' : 'Submit Match Ratings'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* READ-ONLY PAST MATCH DETAILS MODAL */}
      {viewingPastMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">READ-ONLY MATCH ARCHIVE</span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{viewingPastMatch.title}</h3>
                <p className="text-xs text-slate-500">Date: {viewingPastMatch.date} • Opponent: {viewingPastMatch.opponent || 'TBD'} • Venue: {viewingPastMatch.venue}</p>
              </div>
              <button onClick={() => setViewingPastMatch(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">Match Overview & Notes:</p>
                <p className="mt-1">{viewingPastMatch.description || 'League fixture completed.'}</p>
                <p className="mt-2 font-medium text-slate-500">Timing: {eventService.formatTime(viewingPastMatch.start_time)} - {viewingPastMatch.end_time ? eventService.formatTime(viewingPastMatch.end_time) : 'Completed'}</p>
              </div>

              <h4 className="text-sm font-bold text-slate-900 pt-2">Player Match Ratings & Performance Log</h4>
              <div className="space-y-2">
                {squadMembers.map((member) => {
                  const record = pastMatchLogs[member.id];
                  const st = (record?.attendance_status || '').toUpperCase();
                  const isPresent = st === 'PRESENT';
                  const isLate = st === 'LATE';
                  const isAbsent = st === 'ABSENT';
                  const statusText = isPresent ? '✓ Present' : isLate ? '⏱ Late' : isAbsent ? '✕ Absent' : 'Not Logged';
                  const statusClass = isPresent
                    ? 'bg-emerald-100 text-emerald-800'
                    : isLate
                    ? 'bg-amber-100 text-amber-800'
                    : isAbsent
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-600';

                  return (
                    <div key={member.id} className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 font-bold text-white text-xs">
                          {member.first_name[0]}{member.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.first_name} {member.last_name}</p>
                          <p className="text-[11px] text-slate-500">{member.email}</p>
                          {record?.remarks && <p className="mt-0.5 text-[11px] text-slate-600 italic">&quot;{record.remarks}&quot;</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 font-bold ${statusClass}`}>
                          {statusText}
                        </span>
                        {record && record.rating !== undefined && record.rating !== null && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-900">
                            ★ {record.rating}/10 Score
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setViewingPastMatch(null)} className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-900">
                Close Archive View
              </button>
            </div>
          </div>
        </div>
      )}
    </CoachPortalLayout>
  );
}
