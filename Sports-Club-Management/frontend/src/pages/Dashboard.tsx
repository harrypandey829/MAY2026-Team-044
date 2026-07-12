import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
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
  Waves,
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardCard from '../components/dashboard/DashboardCard';
import { getDemoRole, isDemoAuthenticated, logoutDemoUser } from '../utils/demoAuth';

const events = [
  { title: 'Friday Match', date: 'Fri, Jul 12', time: '7:00 PM', venue: 'North Pitch', sport: 'Football' },
  { title: 'Training Camp', date: 'Sat, Jul 13', time: '8:30 AM', venue: 'Arena Hall A', sport: 'Badminton' },
  { title: 'Recovery Session', date: 'Sun, Jul 14', time: '9:00 AM', venue: 'Wellness Studio', sport: 'Swimming' },
];

const announcements = [
  { title: 'Tournament registration closes today', detail: 'Register before 8 PM to secure your squad slot.', time: '15 min ago' },
  { title: 'Coach availability update', detail: 'Friday afternoon sessions have moved to the main court.', time: '1 hr ago' },
  { title: 'Facility reminder', detail: 'Please bring your training kit to the pool session.', time: '3 hrs ago' },
];

const performanceMetrics = [
  { label: 'Matches Played', value: '14', note: '+2 this month' },
  { label: 'Goals', value: '8', note: 'Top score in your group' },
  { label: 'Assists', value: '5', note: 'Steady passing rhythm' },
  { label: 'Performance Trend', value: '+12%', note: 'Up from last week' },
];

const achievements = [
  { title: 'MVP', detail: 'Best performer in the last match', icon: Trophy },
  { title: 'Perfect Attendance', detail: '5 weeks of full attendance', icon: CheckCircle2 },
  { title: 'Top Scorer', detail: 'Highest goals this month', icon: Target },
  { title: 'Most Improved Player', detail: 'Greatest progress in conditioning', icon: Sparkles },
];

const attendanceTrend = [72, 78, 81, 86, 92];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const role = getDemoRole();

  if (!isDemoAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'member') {
    return <Navigate to="/coach/dashboard" replace />;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logoutDemoUser();
    navigate('/login');
  }

  const summaryCards = useMemo(
    () => [
      {
        title: "Today's Training",
        value: 'Strength & Conditioning',
        subtitle: '06:30 AM • Arena Hall A',
        icon: <Dumbbell className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-brand-500 to-emerald-500',
        trend: 'Live',
      },
      {
        title: 'Attendance %',
        value: '92%',
        subtitle: 'Steady progress this week',
        icon: <Users className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-brand-500 to-emerald-500',
        trend: '+4%',
      },
      {
        title: 'Upcoming Events',
        value: '3',
        subtitle: 'Matches and sessions scheduled',
        icon: <CalendarDays className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-sky-500 to-cyan-400',
        trend: 'Ready',
      },
      {
        title: 'Performance Score',
        value: '88%',
        subtitle: 'Personal best this month',
        icon: <TrendingUp className="h-5 w-5" />,
        accent: 'bg-gradient-to-br from-amber-500 to-orange-500',
        trend: '+8%',
      },
    ],
    [],
  );

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
                <button type="button" className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100">
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
                      A
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-slate-800">Alex Carter</p>
                      <p className="text-xs text-slate-500">Member</p>
                    </div>
                    <ChevronDown className="mr-1 h-4 w-4 text-slate-500" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-[1.2rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/my-profile'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <UserCircle2 className="h-4 w-4 text-brand-600" /> My Profile
                      </button>
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/edit-profile'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <PencilLine className="h-4 w-4 text-brand-600" /> Edit Profile
                      </button>
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/dashboard/settings'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <SettingsIcon className="h-4 w-4 text-brand-600" /> Settings
                      </button>
                      <button type="button" className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <LifeBuoy className="h-4 w-4 text-brand-600" /> Help & Support
                      </button>
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
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Today</span>
                </div>

                <div className="mt-6 rounded-[1.6rem] border border-slate-200/70 bg-slate-50/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-3 text-white shadow-lg shadow-sky-300/40">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">Strength & Conditioning</p>
                        <p className="text-sm text-slate-500">Morning session • Focus on mobility and power</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">Ready</span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Clock3 className="h-4 w-4 text-brand-600" />
                        Time
                      </div>
                      <p className="mt-2 text-sm text-slate-600">06:30 AM</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Users className="h-4 w-4 text-brand-600" />
                        Coach
                      </div>
                      <p className="mt-2 text-sm text-slate-600">Coach Maya</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <MapPin className="h-4 w-4 text-brand-600" />
                        Venue
                      </div>
                      <p className="mt-2 text-sm text-slate-600">Arena Hall A</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Sparkles className="h-4 w-4 text-brand-600" />
                        Sport
                      </div>
                      <p className="mt-2 text-sm text-slate-600">Badminton</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.25rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Equipment reminder</p>
                    <p className="mt-1">Bring your shuttlecocks, grip tape, and water bottle to prepare for the session.</p>
                  </div>
                </div>
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
                  {announcements.map((item) => (
                    <div key={item.title} className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Upcoming events</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Next tournaments, matches and practice sessions</h2>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-brand-700">3 upcoming</span>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {events.map((event) => (
                  <div key={event.title} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{event.date}</p>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{event.sport}</span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-brand-600" /> {event.time}</p>
                      <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> {event.venue}</p>
                    </div>
                    <button type="button" className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]">
                      View details
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Attendance overview</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">Attendance trend this week</h2>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">92% avg</div>
                </div>

                <div className="mt-6 flex h-40 items-end gap-3 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  {attendanceTrend.map((value, index) => (
                    <div key={value} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-full w-full items-end rounded-full bg-slate-200 p-1">
                        <div className="w-full rounded-full bg-gradient-to-t from-brand-500 to-emerald-500" style={{ height: `${value}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-500">W{index + 1}</span>
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
                    “You have shown great consistency this week and your movement quality keeps improving. Keep the focus on recovery and precision.”
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
