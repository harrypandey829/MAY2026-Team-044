import { useEffect, useState } from 'react';
import { CheckCircle2, Plus, Search, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import userService from '../../services/userService';
import eventService, { type Event } from '../../services/eventService';
import attendanceService, { type AttendanceRecord } from '../../services/attendanceService';
import authService, { type AuthUser } from '../../services/authService';

export default function AttendancePage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventAttendanceMap, setEventAttendanceMap] = useState<Record<string, AttendanceRecord>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'Absent' | 'Late' | 'Excused'>('Present');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      userService.getByRole('Member'),
      eventService.getAll(),
    ])
      .then(([mList, eList]) => {
        setMembers(mList);
        setEvents(eList);
        if (eList.length > 0) setSelectedEventId(eList[0].id);
        if (mList.length > 0) setSelectedMemberId(mList[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch session attendance report when selected event changes
  useEffect(() => {
    if (!selectedEventId) return;
    attendanceService.getEventReport(selectedEventId)
      .then((records) => {
        const map: Record<string, AttendanceRecord> = {};
        records.forEach((r) => {
          map[r.member_id] = r;
        });
        setEventAttendanceMap(map);
      })
      .catch(() => setEventAttendanceMap({}));
  }, [selectedEventId]);

  async function handleMarkAttendance(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEventId || !selectedMemberId) return;
    setFeedback(null);
    setSubmitting(true);
    try {
      const record = await attendanceService.markAttendance({
        event_id: selectedEventId,
        member_id: selectedMemberId,
        attendance_status: attendanceStatus,
        remarks: remarks.trim() || undefined,
      });

      // Update local state map immediately
      setEventAttendanceMap((prev) => ({
        ...prev,
        [selectedMemberId]: record,
      }));

      const member = members.find((m) => m.id === selectedMemberId);
      const memberName = member ? `${member.first_name} ${member.last_name}` : 'Athlete';

      setIsMarkModalOpen(false);
      setRemarks('');
      setFeedback(`Attendance successfully updated to "${attendanceStatus}" for ${memberName}!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  }

  const currentUser = authService.getCurrentUser();
  const coachSport = (currentUser?.sport || 'Football').toLowerCase();

  const filteredMembers = members
    .filter((m) => !m.sport || m.sport.toLowerCase().includes(coachSport) || coachSport.includes(m.sport.toLowerCase()))
    .filter((m) => `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase()));

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Attendance Management</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review and log attendance for training sessions and match fixtures.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMarkModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Mark Attendance
          </button>
        </div>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4 text-emerald-700" /></button>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Overview</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Roster Metrics</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Active Members', String(members.length)],
              ['Scheduled Sessions', String(events.filter((e) => e.event_type === 'Practice').length)],
              ['Match Fixtures', String(events.filter((e) => e.event_type === 'Match').length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Search</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Search Athletes</h2>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Search by name or email" />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Roster</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Athletes List ({filteredMembers.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase text-slate-500">Active Session:</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none max-w-xs"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.event_type} • {eventService.formatDate(ev.date)})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading attendance data...</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Athlete Name</th>
                  <th className="px-4 py-3 font-semibold">Sport</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Current Session Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const record = eventAttendanceMap[m.id];
                  const status = record ? record.attendance_status : 'Not Marked';
                  return (
                    <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{m.first_name} {m.last_name}</td>
                      <td className="px-4 py-3 text-slate-600">{m.sport || 'General Sports'}</td>
                      <td className="px-4 py-3 text-slate-600">{m.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : status === 'Late'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : status === 'Absent'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : status === 'Excused'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMemberId(m.id);
                            if (record) {
                              setAttendanceStatus(record.attendance_status as any);
                              setRemarks(record.remarks || '');
                            } else {
                              setAttendanceStatus('Present');
                              setRemarks('');
                            }
                            setIsMarkModalOpen(true);
                          }}
                          className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white hover:scale-105 transition-all shadow-sm"
                        >
                          {record ? 'Edit Attendance' : 'Mark Attendance'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Mark Attendance Modal */}
      {isMarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleMarkAttendance} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Mark Athlete Attendance</h3>
              <button type="button" onClick={() => setIsMarkModalOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Select Event / Session</label>
                <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.sport ? ev.sport + ' • ' : ''}{ev.event_type} • {eventService.formatDate(ev.date)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Select Athlete</label>
                <select value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.first_name} {m.last_name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Status</label>
                <select value={attendanceStatus} onChange={(e) => setAttendanceStatus(e.target.value as typeof attendanceStatus)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Excused">Excused</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Remarks (Optional)</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Great energy, or Arrived 5 mins late"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsMarkModalOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">
                {submitting ? 'Submitting...' : 'Submit Attendance'}
              </button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}

