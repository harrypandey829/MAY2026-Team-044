import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MapPin, Trophy, History, Star, MessageSquare, X } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import eventService, { type Event } from '../../services/eventService';
import authService from '../../services/authService';
import attendanceService, { type AttendanceRecord } from '../../services/attendanceService';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [registering, setRegistering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedPastEvent, setSelectedPastEvent] = useState<Event | null>(null);

  const user = authService.getCurrentUser();
  const userSport = user?.sport || 'Badminton';

  useEffect(() => {
    eventService.getAll()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));

    if (user) {
      eventService.getMemberRegistrations(user.id)
        .then((regs) => setRegisteredIds(regs.map((r) => r.event_id)))
        .catch(() => setRegisteredIds([]));

      attendanceService.getMemberHistory(user.id)
        .then(setAttendanceRecords)
        .catch(() => setAttendanceRecords([]));
    }
  }, [user?.id]);

  // Filter events strictly to user's enrolled sport
  const sportEvents = useMemo(() => {
    return events.filter((ev) => {
      if (!ev.sport) return true;
      return ev.sport.toLowerCase() === userSport.toLowerCase();
    });
  }, [events, userSport]);

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingEvents = useMemo(() => {
    return sportEvents.filter((ev) => String(ev.date) >= todayStr);
  }, [sportEvents, todayStr]);

  const pastEvents = useMemo(() => {
    return sportEvents.filter((ev) => String(ev.date) < todayStr);
  }, [sportEvents, todayStr]);

  async function toggleRegistration(event: Event) {
    if (!user) return;
    setRegistering(event.id);
    setError(null);
    setSuccessMsg(null);

    const isRegistered = registeredIds.includes(event.id);

    try {
      if (isRegistered) {
        await eventService.unregisterMember(event.id, user.id);
        setRegisteredIds((prev) => prev.filter((id) => id !== event.id));
        setSuccessMsg(`Cancelled registration for "${event.title}".`);
      } else {
        await eventService.registerMember(event.id, user.id);
        setRegisteredIds((prev) => [...prev, event.id]);
        setSuccessMsg(`Successfully registered for "${event.title}"!`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration action failed');
    } finally {
      setRegistering(null);
    }
  }

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Enrolled Sport: {userSport}</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{userSport} Events & Fixtures</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">View and register for training sessions, matches, and tournaments strictly isolated for {userSport}.</p>
        </div>
      </section>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {successMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* 1. UPCOMING EVENTS */}
      <div className="mt-6">
        <PageCard title={`Upcoming ${userSport} Events`} subtitle="Future training sessions and match fixtures">
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {loading ? (
              <p className="col-span-2 py-8 text-center text-sm text-slate-500">Loading events...</p>
            ) : upcomingEvents.length === 0 ? (
              <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <Trophy className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">No upcoming events scheduled for {userSport}</p>
              </div>
            ) : (
              upcomingEvents.map((event) => {
                const isRegistered = registeredIds.includes(event.id);
                const isLoading = registering === event.id;
                const isOpen = event.is_registration_open && event.event_status === 'Scheduled';
                return (
                  <div key={event.id} className="rounded-[1.4rem] border border-sky-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">{event.sport || userSport}</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{event.event_type}</span>
                        </div>
                        <p className="mt-3 text-lg font-semibold text-slate-900">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{eventService.formatDate(event.date)}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> {eventService.formatTime(event.start_time)}</p>
                      <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> {event.venue}</p>
                      <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> Status: {event.event_status}</p>
                    </div>
                    {isOpen && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => toggleRegistration(event)}
                        className={`mt-4 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] ${
                          isRegistered ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gradient-to-r from-brand-500 to-emerald-500 shadow-md'
                        }`}
                      >
                        {isLoading ? 'Processing…' : isRegistered ? 'Cancel Registration' : 'Register for Event'}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </PageCard>
      </div>

      {/* 2. PAST EVENTS */}
      <div className="mt-8">
        <PageCard title={`Past ${userSport} Events & History`} subtitle="Completed events, attendance logs and coach feedback">
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {pastEvents.length === 0 ? (
              <div className="col-span-2 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <History className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">No past events recorded for {userSport}</p>
              </div>
            ) : (
              pastEvents.map((event) => {
                const isRegistered = registeredIds.includes(event.id);
                const attRec = attendanceRecords.find((a) => a.event_id === event.id);

                return (
                  <div key={event.id} className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/60 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">{event.event_type}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${isRegistered ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {isRegistered ? 'Registered' : 'Not Registered'}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">Completed</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold text-slate-800">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{eventService.formatDate(event.date)} • {event.venue}</p>

                    {attRec && (
                      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                        <span className={`font-bold ${attRec.attendance_status === 'PRESENT' || attRec.attendance_status === 'Present' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          Status: {attRec.attendance_status}
                        </span>
                        {attRec.rating && (
                          <span className="flex items-center gap-1 font-bold text-amber-700">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> Rating: {attRec.rating} / 10
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedPastEvent(event)}
                      className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm"
                    >
                      View Details
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </PageCard>
      </div>

      {/* PAST EVENT DETAILS MODAL */}
      {selectedPastEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-800">{selectedPastEvent.sport || userSport}</span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{selectedPastEvent.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedPastEvent(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p><span className="font-bold text-slate-800">Date & Time:</span> {eventService.formatDate(selectedPastEvent.date)} at {eventService.formatTime(selectedPastEvent.start_time)}</p>
              <p><span className="font-bold text-slate-800">Venue:</span> {selectedPastEvent.venue}</p>
              <p><span className="font-bold text-slate-800">Event Type:</span> {selectedPastEvent.event_type}</p>

              {(() => {
                const attRec = attendanceRecords.find((a) => a.event_id === selectedPastEvent.id);
                return (
                  <div className="mt-4 rounded-2xl bg-sky-50/80 p-4 border border-sky-100 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-800">Coach Evaluation & Performance</p>
                    <p className="text-xs"><span className="font-bold text-slate-800">Attendance:</span> {attRec?.attendance_status || 'Marked Present'}</p>
                    {attRec?.rating && (
                      <p className="text-xs flex items-center gap-1 font-bold text-amber-700">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-500" /> Score: {attRec.rating} / 10
                      </p>
                    )}
                    {attRec?.remarks && (
                      <p className="text-xs flex items-start gap-1 text-slate-700 mt-2">
                        <MessageSquare className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                        <span><em>"{attRec.remarks}"</em></span>
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setSelectedPastEvent(null)} className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-900">
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
}

