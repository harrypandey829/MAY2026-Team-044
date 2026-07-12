import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  FileText,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  Waves,
} from 'lucide-react';
import CoachSummaryCard from '../components/coach-dashboard/CoachSummaryCard';
import CoachRosterTable from '../components/coach-dashboard/CoachRosterTable';
import CoachCalendar from '../components/coach-dashboard/CoachCalendar';
import { getDemoRole } from '../utils/demoAuth';
import { isCoachAuthenticated, logoutCoachDemoUser } from '../utils/coachDemoAuth';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'My Team', icon: Users },
  { name: 'Training Sessions', icon: Dumbbell },
  { name: 'Matches', icon: Trophy },
  { name: 'Attendance', icon: ClipboardCheck },
  { name: 'Team Calendar', icon: CalendarDays },
  { name: 'Player Availability', icon: UserRound },
  { name: 'Performance', icon: Sparkles },
  { name: 'Announcements', icon: MessageSquareText },
  { name: 'Equipment Booking', icon: BookOpen },
  { name: 'Profile', icon: ShieldCheck },
  { name: 'Settings', icon: FileText },
];

const summaryCards = [
  { title: 'Total Players', value: '24', subtitle: '2 new sign-ups', icon: <Users className="h-5 w-5" />, accent: 'bg-gradient-to-br from-brand-500 to-emerald-500', trend: '+8%' },
  { title: 'Upcoming Sessions', value: '6', subtitle: '2 high intensity', icon: <Dumbbell className="h-5 w-5" />, accent: 'bg-gradient-to-br from-brand-500 to-emerald-500', trend: 'Live' },
  { title: 'Upcoming Matches', value: '3', subtitle: '1 league fixture', icon: <Trophy className="h-5 w-5" />, accent: 'bg-gradient-to-br from-sky-500 to-cyan-400', trend: 'Ready' },
  { title: 'Attendance Rate', value: '94%', subtitle: 'Above weekly target', icon: <ClipboardCheck className="h-5 w-5" />, accent: 'bg-gradient-to-br from-amber-500 to-orange-500', trend: '+4%' },
  { title: 'Unread Announcements', value: '5', subtitle: '2 require action', icon: <MessageSquareText className="h-5 w-5" />, accent: 'bg-gradient-to-br from-emerald-500 to-green-600', trend: 'New' },
];

const teamRoster = [
  { name: 'Mina Chen', position: 'Forward', age: 22, contact: '+1 202 555 0148', attendance: 96, status: 'Attending' as const, photo: 'MC' },
  { name: 'Noah Brooks', position: 'Midfielder', age: 24, contact: '+1 202 555 0142', attendance: 88, status: 'Maybe' as const, photo: 'NB' },
  { name: 'Liam Ortiz', position: 'Defender', age: 26, contact: '+1 202 555 0146', attendance: 91, status: 'Attending' as const, photo: 'LO' },
  { name: 'Ava Patel', position: 'Goalkeeper', age: 23, contact: '+1 202 555 0143', attendance: 85, status: 'Not Attending' as const, photo: 'AP' },
];

const trainingSessions = [
  { name: 'Strength & Conditioning', date: 'Tue, Jul 15', time: '6:30 PM', venue: 'Arena Hall A', description: 'Power-based session for match preparation.', participants: 18 },
  { name: 'Tactical Review', date: 'Thu, Jul 17', time: '7:00 PM', venue: 'Training Room 2', description: 'Review match patterns and set pieces.', participants: 14 },
];

const matches = [
  { opponent: 'River City FC', type: 'League', venue: 'North Pitch', date: 'Sat, Jul 19', time: '4:00 PM', status: 'Confirmed' },
  { opponent: 'Harbor Tigers', type: 'Friendly', venue: 'West Arena', date: 'Mon, Jul 21', time: '6:00 PM', status: 'Pending' },
];

const attendanceRows = [
  { player: 'Mina Chen', session: 'Strength & Conditioning', attendance: 'Present', remarks: 'Excellent energy' },
  { player: 'Noah Brooks', session: 'Tactical Review', attendance: 'Late', remarks: 'Arrived 10 mins late' },
  { player: 'Liam Ortiz', session: 'Strength & Conditioning', attendance: 'Absent', remarks: 'Medical note pending' },
];

const availability = [
  { label: 'Attending', value: 72, tone: 'bg-pitch-600' },
  { label: 'Maybe', value: 18, tone: 'bg-amber-500' },
  { label: 'Not Attending', value: 10, tone: 'bg-rose-500' },
];

const calendarEvents = [
  { title: 'Training Session', day: 12, type: 'Training' as const },
  { title: 'League Match', day: 19, type: 'Match' as const },
  { title: 'Tournament', day: 24, type: 'Tournament' as const },
  { title: 'Club Holiday', day: 28, type: 'Holiday' as const },
];

const announcements = [
  { title: 'Training moved to 6 PM', detail: 'The evening session will start earlier.', action: 'Edit' },
  { title: 'Tournament registration open', detail: 'Entries close on Friday.', action: 'Delete' },
  { title: 'New fitness schedule', detail: 'Recovery focus planned for next week.', action: 'Edit' },
];

const equipment = [
  { name: 'Practice Ground', status: 'Available', action: 'Reserve Facility' },
  { name: 'Football Field', status: 'Booked', action: 'Request Equipment' },
  { name: 'Tennis Court', status: 'Available', action: 'Reserve Facility' },
  { name: 'Swimming Pool', status: 'Available', action: 'Reserve Facility' },
  { name: 'Equipment Kit', status: 'Pending', action: 'Request Equipment' },
];

const quickActions = ['Create Training Session', 'Schedule Match', 'Take Attendance', 'Post Announcement', 'View Team Calendar'];

const activityFeed = [
  { title: 'Training Session Created', detail: 'Strength & Conditioning scheduled', time: '10 mins ago' },
  { title: 'Attendance Updated', detail: '3 player statuses changed', time: '35 mins ago' },
  { title: 'Match Scheduled', detail: 'League fixture added to calendar', time: '1 hr ago' },
  { title: 'Announcement Posted', detail: 'Tournament registration shared', time: '2 hrs ago' },
  { title: 'Equipment Reserved', detail: 'Training ground confirmed', time: 'Today' },
];

const coachProfile = {
  name: 'Sarah Johnson',
  role: 'Coach',
  id: 'COACH-001',
  sport: 'Football',
  experience: '8 Years',
  certification: 'UEFA B',
  email: 'democoach@sportsclub.com',
  phone: '+1 202 555 0199',
  team: 'Football Team A',
};

export default function CoachDashboard() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const summary = useMemo(() => summaryCards, []);
  const role = getDemoRole();

  if (!isCoachAuthenticated()) {
    if (role === 'member') {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logoutCoachDemoUser();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-4 px-3 py-3 lg:px-4 lg:py-4">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform rounded-r-[2rem] border-r border-sky-200/70 bg-gradient-to-b from-sky-100 via-white to-emerald-50 p-4 text-slate-900 shadow-2xl shadow-sky-100/80 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-2.5 text-white shadow-lg shadow-sky-300/40">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">SportsClub</p>
                <p className="text-sm text-slate-600">Coach Dashboard</p>
              </div>
            </div>
            <button type="button" className="rounded-2xl border border-sky-200 p-2 text-slate-600 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-7 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setActiveItem(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition-all ${isActive ? 'bg-sky-100 text-slate-900 shadow-lg' : 'text-slate-700 hover:bg-sky-50 hover:text-slate-900'}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 rounded-[2rem] border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-3 shadow-xl shadow-sky-100/80 lg:p-4">
          <header className="glass rounded-[1.5rem] p-3 shadow-lg shadow-slate-900/5 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden" aria-label="Open sidebar">
                  <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-2.5 text-white shadow-lg shadow-sky-300/40">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">SportsClub</p>
                    <p className="text-sm text-slate-500">Coach Dashboard</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
                <label className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-500 shadow-sm sm:flex">
                  <Search className="h-4 w-4" />
                  <input className="w-full bg-transparent outline-none" placeholder="Search team" />
                </label>
                <button type="button" className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-pitch-500" />
                </button>
                <button type="button" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100">
                  <Mail className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2 py-1.5 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-semibold text-white">S</div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">{coachProfile.name}</p>
                    <p className="text-xs text-slate-500">{coachProfile.role}</p>
                  </div>
                  <ChevronDown className="mr-1 h-4 w-4 text-slate-500" />
                </div>
                <button type="button" onClick={handleLogout} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">Logout</button>
              </div>
            </div>
          </header>

          <main className="mt-4 space-y-4">
            <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-2xl shadow-sky-100/80 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Welcome back</p>
                  <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Good Morning, Coach Sarah!</h1>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Welcome back. Here&apos;s today&apos;s team overview and everything that needs your attention.</p>
                </div>
                <div className="rounded-[1.6rem] border border-sky-200 bg-white/80 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-100 p-3 text-brand-700"><Waves className="h-6 w-6" /></div>
                    <div>
                      <p className="text-sm font-semibold">Training Focus</p>
                      <p className="text-sm text-slate-600">Match readiness</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {summary.map((card) => (
                <CoachSummaryCard key={card.title} {...card} />
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Overview</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">SportsClub First Team</h2>
                  </div>
                  <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-300/40">View Full Team</button>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-500">Sport</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Football</p>
                    <p className="mt-2 text-sm text-slate-500">24 players • 2 assistant coaches</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-500">Team Details</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Assistant Coach: Maya</p>
                    <p className="mt-2 text-sm text-slate-500">Captain: Liam Ortiz</p>
                    <p className="mt-2 text-sm text-slate-500">Average Attendance: 94%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Quick Actions</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Keep the team moving</h2>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  {quickActions.map((action) => (
                    <button key={action} type="button" className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100">{action}</button>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Roster</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Active players</h2>
                </div>
                <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">View Profile</button>
              </div>
              <div className="mt-5">
                <CoachRosterTable players={teamRoster} />
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Training Sessions</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Upcoming practice sessions</h2>
                  </div>
                  <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">Create Session</button>
                </div>
                <div className="mt-5 grid gap-4">
                  {trainingSessions.map((session) => (
                    <div key={session.name} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{session.name}</h3>
                          <p className="mt-2 text-sm text-slate-500">{session.description}</p>
                        </div>
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{session.participants} participants</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> {session.date}</p>
                        <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-pitch-600" /> {session.time}</p>
                        <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-600" /> {session.venue}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                        <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Matches</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Scheduled matches</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-4">
                  {matches.map((match) => (
                    <div key={match.opponent} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">vs {match.opponent}</h3>
                          <p className="mt-2 text-sm text-slate-500">{match.type} • {match.venue}</p>
                        </div>
                        <span className="rounded-full bg-pitch-100 px-2.5 py-1 text-xs font-semibold text-pitch-700">{match.status}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                        <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> {match.date}</p>
                        <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-pitch-600" /> {match.time}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">View Details</button>
                        <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Edit Match</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Attendance Management</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Session attendance overview</h2>
                  </div>
                  <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">Mark Attendance</button>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Player</th>
                        <th className="px-4 py-3 font-semibold">Training Session</th>
                        <th className="px-4 py-3 font-semibold">Attendance</th>
                        <th className="px-4 py-3 font-semibold">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRows.map((row) => (
                        <tr key={row.player} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-semibold text-slate-900">{row.player}</td>
                          <td className="px-4 py-3 text-slate-600">{row.session}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.attendance === 'Present' ? 'bg-pitch-100 text-pitch-700' : row.attendance === 'Late' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{row.attendance}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{row.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Availability</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Responses for next event</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {availability.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100">
                        <div className={`h-2.5 rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <CoachCalendar events={calendarEvents} />
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Performance</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Current analytics</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-500">Goals</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">12</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-500">Assists</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">8</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-500">Training Rating</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">4.8/5</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-500">Fitness Score</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">91</p>
                  </div>
                </div>
                <div className="mt-5 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <p className="text-sm font-semibold text-slate-500">Coach Remarks</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">The squad&apos;s energy and tactical discipline have improved significantly over the last month.</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Announcements</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Recent communication</h2>
                  </div>
                  <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">Create Announcement</button>
                </div>
                <div className="mt-5 space-y-3">
                  {announcements.map((item) => (
                    <div key={item.title} className="rounded-[1.3rem] border border-slate-200/70 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{item.action}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Equipment & Facility Requests</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Resource requests</h2>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {equipment.map((item) => (
                    <div key={item.name} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{item.status}</span>
                      </div>
                      <button type="button" className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">{item.action}</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Recent Activity</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Latest coach actions</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {activityFeed.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-3">
                      <div className="mt-1 h-3 w-3 rounded-full bg-brand-600" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Coach Profile</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Professional details</h2>
                </div>
                <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">Edit Profile</button>
              </div>
              <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white">CS</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Coach Name</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Coach ID</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Sport</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.sport}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Experience</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Certification</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.certification}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Email</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Phone</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Assigned Team</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{coachProfile.team}</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
