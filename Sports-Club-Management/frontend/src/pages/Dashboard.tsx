import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Dumbbell,
  LifeBuoy,
  LogOut,
  MapPin,
  Menu,
  MessageSquareText,
  PencilLine,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserCircle2,
  Users,
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardCard from '../components/dashboard/DashboardCard';
import authService from '../services/authService';
import announcementService, { type Announcement } from '../services/announcementService';
import eventService, { type Event } from '../services/eventService';
import attendanceService, { type AttendanceRecord } from '../services/attendanceService';
import performanceService, { type PerformanceRecord } from '../services/performanceService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingPerformance, setLoadingPerformance] = useState(true);

  const user = authService.getCurrentUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) return;

    eventService.getAll()
      .then((data) => {
        const userSport = user?.sport || 'Badminton';
        const sportEvents = data.filter((e) => !e.sport || e.sport.toLowerCase() === userSport.toLowerCase());
        setEvents(eventService.getUpcoming(sportEvents).slice(0, 3));
      })
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));

    announcementService.getAll()
      .then((data) => setAnnouncements(data.slice(0, 3)))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoadingAnnouncements(false));

    attendanceService.getMemberHistory(user.id)
      .then(setAttendanceRecords)
      .catch(() => setAttendanceRecords([]))
      .finally(() => setLoadingAttendance(false));

    performanceService.getMemberHistory(user.id)
      .then(setPerformanceRecords)
      .catch(() => setPerformanceRecords([]))
      .finally(() => setLoadingPerformance(false));
  }, [user?.id]);

  function handleLogout() {
    authService.logout();
    navigate('/login');
  }

  // Dynamic calculations based on backend API data
  const attendanceRate = useMemo(
    () => attendanceService.getAttendanceRate(attendanceRecords),
    [attendanceRecords]
  );

  const presentCount = useMemo(
    () => attendanceRecords.filter((r) => r.attendance_status === 'Present' || r.attendance_status === 'Late').length,
    [attendanceRecords]
  );

  const attendanceTrend = useMemo(() => {
    if (attendanceRecords.length === 0) return [0, 0, 0, 0, 0];
    const last5 = attendanceRecords.slice(-5);
    const result = last5.map((r) => (r.attendance_status === 'Present' ? 100 : r.attendance_status === 'Late' ? 75 : 0));
    while (result.length < 5) result.unshift(0);
    return result;
  }, [attendanceRecords]);

  const streakDays = useMemo(() => {
    let streak = 0;
    for (let i = attendanceRecords.length - 1; i >= 0; i--) {
      if (attendanceRecords[i].attendance_status === 'Present' || attendanceRecords[i].attendance_status === 'Late') {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [attendanceRecords]);

  const performanceTotals = useMemo(
    () => performanceService.getTotals(performanceRecords),
    [performanceRecords]
  );

  const performanceScore = useMemo(() => {
    if (performanceTotals.avg_rating !== null && performanceTotals.avg_rating > 0) {
      return `${Math.round((performanceTotals.avg_rating / 10) * 100)}%`;
    }
    return performanceRecords.length > 0 ? `${Math.min(100, performanceRecords.length * 20)}%` : '0%';
  }, [performanceTotals, performanceRecords]);

  const latestFeedback = useMemo(() => {
    if (performanceRecords.length === 0) return null;
    const withRemarks = [...performanceRecords].reverse().find((r) => r.remarks && r.remarks.trim().length > 0);
    return withRemarks ? withRemarks.remarks : null;
  }, [performanceRecords]);

  const nextEvent = useMemo(() => (events.length > 0 ? events[0] : null), [events]);

  const summaryCards = useMemo(
    () => [
      {
        title: "Today's Training",
        value: nextEvent ? nextEvent.title : 'No Session Today',
        subtitle: nextEvent
          ? `${eventService.formatTime(nextEvent.start_time)} • ${nextEvent.venue}`
          : 'Check upcoming events schedule',
        icon: <Dumbbell className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-brand-500 to-emerald-500',
        trend: nextEvent ? 'Scheduled' : 'Rest Day',
      },
      {
        title: 'Attendance %',
        value: loadingAttendance ? '...' : `${attendanceRate}%`,
        subtitle: `${presentCount} of ${attendanceRecords.length} sessions attended`,
        icon: <Users className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-brand-500 to-emerald-500',
        trend: attendanceRecords.length > 0 ? `${presentCount}/${attendanceRecords.length}` : '0 sessions',
      },
      {
        title: 'Upcoming Events',
        value: loadingEvents ? '...' : String(events.length),
        subtitle: 'Matches and sessions scheduled',
        icon: <CalendarDays className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-sky-500 to-cyan-400',
        trend: events.length > 0 ? `${events.length} ready` : 'None',
      },
      {
        title: 'Performance Score',
        value: loadingPerformance ? '...' : performanceScore,
        subtitle: performanceTotals.avg_rating !== null
          ? `Avg rating ${performanceTotals.avg_rating.toFixed(1)}/10`
          : 'Based on coach ratings',
        icon: <TrendingUp className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-amber-500 to-orange-500',
        trend: performanceRecords.length > 0 ? `${performanceRecords.length} sessions` : 'No data',
      },
    ],
    [nextEvent, loadingAttendance, attendanceRate, presentCount, attendanceRecords.length, loadingEvents, events.length, loadingPerformance, performanceScore, performanceTotals.avg_rating, performanceRecords.length],
  );

  const performanceMetrics = useMemo(
    () => [
      { label: 'Matches Played', value: String(performanceRecords.length), note: `${performanceRecords.length} total sessions` },
      { label: 'Goals', value: String(performanceTotals.goals), note: 'Total goals recorded' },
      { label: 'Assists', value: String(performanceTotals.assists), note: 'Passes leading to goals' },
      {
        label: 'Performance Trend',
        value: performanceTotals.avg_rating !== null ? `${performanceTotals.avg_rating.toFixed(1)} / 10` : 'N/A',
        note: 'Average coach rating',
      },
    ],
    [performanceRecords.length, performanceTotals]
  );

  const achievements = useMemo(() => {
    const list = [];
    if (attendanceRate >= 80 && attendanceRecords.length > 0) {
      list.push({ title: 'High Attendance', detail: `${attendanceRate}% session attendance rate`, icon: CheckCircle2 });
    } else {
      list.push({ title: 'Attendance Target', detail: 'Aim for 80%+ session attendance', icon: CheckCircle2 });
    }

    if (performanceTotals.goals > 0) {
      list.push({ title: 'Goal Scorer', detail: `${performanceTotals.goals} goals recorded this season`, icon: Target });
    } else {
      list.push({ title: 'Active Participant', detail: 'Participate in sessions to record stats', icon: Target });
    }

    if (performanceTotals.avg_rating !== null && performanceTotals.avg_rating >= 8) {
      list.push({ title: 'Top Performer', detail: `Achieved ${performanceTotals.avg_rating.toFixed(1)}/10 coach rating`, icon: Trophy });
    } else {
      list.push({ title: 'Rising Star', detail: 'Keep training to boost your coach rating', icon: Sparkles });
    }

    if (streakDays > 0) {
      list.push({ title: 'Consistent Player', detail: `${streakDays} session attendance streak`, icon: Sparkles });
    } else {
      list.push({ title: 'Club Member', detail: 'Member of SportsClub community', icon: Trophy });
    }
    return list;
  }, [attendanceRate, attendanceRecords.length, performanceTotals, streakDays]);

  const role = authService.getRole();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'Member') {
    if (role === 'Coach') return <Navigate to="/coach/dashboard" replace />;
    if (role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-4 px-3 py-3 lg:px-4 lg:py-4">
        <Sidebar activeItem={activeItem} onSelect={setActiveItem} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 rounded-[2rem] border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-3 shadow-xl shadow-sky-100/80 lg:p-4">
          <header className="glass rounded-[1.5rem] p-3 shadow-lg shadow-slate-900/5 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-2.5 text-white shadow-lg shadow-sky-300/40">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">SportsClub</p>
                    <p className="text-sm text-slate-500">Member dashboard</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
                <label className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-500 shadow-sm sm:flex">
                  <Search className="h-4 w-4" />
                  <input className="w-full bg-transparent outline-none" placeholder="Search" />
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/announcements')}
                  className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-pitch-500" />
                </button>
                <button type="button" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100">
                  <MessageSquareText className="h-5 w-5" />
                </button>
                <div ref={profileMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((current) => !current)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2 py-1.5 shadow-sm"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-semibold text-white">
                      {authService.getInitials()}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-slate-800">{authService.getDisplayName()}</p>
                      <p className="text-xs text-slate-500">{user?.role ?? 'Member'}</p>
                    </div>
                    <ChevronDown className="mr-1 h-4 w-4 text-slate-500" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-[1.2rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/profile'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <UserCircle2 className="h-4 w-4 text-brand-600" /> My Profile
                      </button>
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/edit-profile'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <PencilLine className="h-4 w-4 text-brand-600" /> Edit Profile
                      </button>
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <SettingsIcon className="h-4 w-4 text-brand-600" /> Settings
                      </button>
                      <div className="group relative">
                        <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/help'); }} className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                          <span className="flex items-center gap-3">
                            <LifeBuoy className="h-4 w-4 text-brand-600" /> Help & Support
                          </span>
                          <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        
                        {/* Hover Submenu */}
                        <div className="absolute right-full top-0 mr-2 w-48 hidden group-hover:block rounded-[1.2rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-right-2 duration-200">
                          <button
                            type="button"
                            onClick={() => { setProfileOpen(false); navigate('/dashboard/help?tab=ticket'); }}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600"
                          >
                            Raise Ticket
                          </button>
                          <button
                            type="button"
                            onClick={() => { setProfileOpen(false); navigate('/dashboard/help?tab=track'); }}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600"
                          >
                            Track Requests
                          </button>
                          <button
                            type="button"
                            onClick={() => { setProfileOpen(false); navigate('/dashboard/help?tab=contact'); }}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600"
                          >
                            Contact Administration
                          </button>
                        </div>
                      </div>
                      <button type="button" onClick={() => { setProfileOpen(false); handleLogout(); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <LogOut className="h-4 w-4 text-brand-600" /> Logout
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="mt-4 space-y-5">
            <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Welcome back</p>
                <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">What should I do today?</h1>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                  Here is your training focus, the latest club updates, and the next activities that matter most today.
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <DashboardCard key={card.title} {...card} />
              ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Today&apos;s schedule</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Your main training block</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {nextEvent ? 'Upcoming' : 'Rest Day'}
                  </span>
                </div>

                {nextEvent ? (
                  <div className="mt-6 rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-3 text-white shadow-lg shadow-sky-300/40">
                          <Dumbbell className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{nextEvent.title}</p>
                          <p className="text-sm text-slate-500">{eventService.formatDate(nextEvent.date)} • {nextEvent.event_type}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">Scheduled</span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Clock3 className="h-4 w-4 text-brand-600" />
                          Time
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{eventService.formatTime(nextEvent.start_time)}</p>
                      </div>
                      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Users className="h-4 w-4 text-brand-600" />
                          Opponent / Coach
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{nextEvent.opponent ? `vs ${nextEvent.opponent}` : 'Club Coach'}</p>
                      </div>
                      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <MapPin className="h-4 w-4 text-brand-600" />
                          Venue
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{nextEvent.venue}</p>
                      </div>
                      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Sparkles className="h-4 w-4 text-brand-600" />
                          Category
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{nextEvent.event_type}</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[1.25rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Event Notice</p>
                      <p className="mt-1">{nextEvent.description || 'Prepare your gear and check in before the session starts.'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-8 text-center">
                    <p className="text-base font-semibold text-slate-800">No scheduled sessions for today</p>
                    <p className="mt-2 text-sm text-slate-500">Check the Events section to view and register for upcoming matches and practice sessions.</p>
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Recent announcements</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Latest updates</h2>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">New</span>
                </div>

                <div className="mt-5 space-y-3">
                  {loadingAnnouncements ? (
                    <div className="py-4 text-center text-sm text-slate-500">Loading...</div>
                  ) : announcements.length === 0 ? (
                    <div className="py-4 text-center text-sm text-slate-500">No announcements</div>
                  ) : (
                    announcements.map((item) => (
                      <div key={item.id} className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                          </div>
                          <span className="text-xs font-medium text-slate-500">{announcementService.formatTime(item.created_at)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Upcoming events</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Next tournaments, matches and practice sessions</h2>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-brand-700">{loadingEvents ? '...' : `${events.length} upcoming`}</span>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {loadingEvents ? (
                  <div className="col-span-3 py-8 text-center text-sm text-slate-500">Loading events...</div>
                ) : events.length === 0 ? (
                  <div className="col-span-3 py-8 text-center text-sm text-slate-500">No upcoming events</div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{event.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{eventService.formatDate(event.date)}</p>
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{event.event_type}</span>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> {eventService.formatTime(event.start_time)}</p>
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> {event.venue}</p>
                      </div>
                      <button type="button" onClick={() => navigate('/dashboard/events')} className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
                        View details
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Attendance overview</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Attendance trend</h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {loadingAttendance ? '...' : `${attendanceRate}% avg`}
                  </div>
                </div>

                <div className="mt-6 flex h-40 items-end gap-3 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  {attendanceTrend.map((value, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-full w-full items-end rounded-full bg-slate-200 p-1">
                        <div className="w-full rounded-full bg-gradient-to-t from-brand-500 to-emerald-500" style={{ height: `${value}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-500">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Performance overview</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Recent form and coach feedback</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                      <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                      <p className="mt-1 text-sm text-slate-500">{metric.note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.25rem] border border-sky-200 bg-sky-50/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Sparkles className="h-4 w-4 text-brand-600" />
                    Coach feedback
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {latestFeedback ? `“${latestFeedback}”` : 'No feedback recorded yet. Your coach will add notes after your sessions.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Achievements</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Badges earned</h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.title} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-3 text-white shadow-lg shadow-sky-300/40">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-lg font-semibold text-slate-900">{achievement.title}</p>
                      <p className="mt-2 text-sm text-slate-600">{achievement.detail}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
