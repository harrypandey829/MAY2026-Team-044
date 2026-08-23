import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  PencilLine,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  SearchCheck,
  Sparkles,
  Trophy,
  UserCircle2,
  UserRound,
  Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutCoachDemoUser } from '../../utils/coachDemoAuth';
import authService from '../../services/authService';

interface SidebarItem {
  name: string;
  icon: typeof LayoutDashboard;
  route: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, route: '/coach/dashboard' },
  { name: 'My Team', icon: Users, route: '/coach/team' },
  { name: 'Training Sessions', icon: Sparkles, route: '/coach/training' },
  { name: 'Matches', icon: Trophy, route: '/coach/matches' },
  { name: 'Attendance', icon: ClipboardCheck, route: '/coach/attendance' },
  { name: 'Team Calendar', icon: CalendarDays, route: '/coach/calendar' },
  { name: 'Player Availability', icon: UserRound, route: '/coach/availability' },
  { name: 'Performance', icon: Sparkles, route: '/coach/performance' },
  { name: 'Announcements', icon: MessageSquareText, route: '/coach/announcements' },
  { name: 'Equipment Booking', icon: BookOpen, route: '/coach/equipment' },
  { name: 'Lost & Found', icon: SearchCheck, route: '/coach/lost-and-found' },
  { name: 'Profile', icon: ShieldCheck, route: '/coach/profile' },
  { name: 'Settings', icon: FileText, route: '/coach/settings' },
];

interface CoachPortalLayoutProps {
  children: ReactNode;
}

export default function CoachPortalLayout({ children }: CoachPortalLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const activeItem = useMemo(() => sidebarItems.find((item) => item.route === location.pathname)?.name ?? 'Dashboard', [location.pathname]);

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
                <p className="text-sm text-slate-600">Coach Portal</p>
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
                    navigate(item.route);
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
          <header className="relative z-30 glass rounded-[1.5rem] p-3 shadow-lg shadow-slate-900/5 sm:p-4">
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
                    <p className="text-sm text-slate-500">Coach Portal</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
                <label className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-500 shadow-sm sm:flex">
                  <Search className="h-4 w-4" />
                  <input className="w-full bg-transparent outline-none" placeholder="Search team" />
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/coach/announcements')}
                  className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-pitch-500" />
                </button>
                <button type="button" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-100">
                  <Mail className="h-5 w-5" />
                </button>
                <div ref={profileMenuRef} className="relative">
                  <button type="button" onClick={() => setProfileOpen((current) => !current)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1.5 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-semibold text-white">{authService.getInitials()}</div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-slate-800">{authService.getDisplayName()}</p>
                      <p className="text-xs text-brand-700 font-semibold">{authService.getCurrentUser()?.sport || 'Football'} Coach</p>
                    </div>
                    <ChevronDown className="mr-1 h-4 w-4 text-slate-500" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-[1.2rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/coach/profile'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <UserCircle2 className="h-4 w-4 text-brand-600" /> My Profile
                      </button>
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/coach/profile'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <PencilLine className="h-4 w-4 text-brand-600" /> Edit Profile
                      </button>
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/coach/settings'); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <SettingsIcon className="h-4 w-4 text-brand-600" /> Settings
                      </button>
                      <div className="group relative">
                        <button type="button" onClick={() => { setProfileOpen(false); navigate('/coach/help'); }} className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                          <span className="flex items-center gap-3">
                            <LifeBuoy className="h-4 w-4 text-brand-600" /> Help & Support
                          </span>
                          <ChevronLeft className="h-4 w-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        
                        {/* Hover Submenu */}
                        <div className="absolute right-full top-0 mr-2 w-48 hidden group-hover:block rounded-[1.2rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-right-2 duration-200">
                          <button
                            type="button"
                            onClick={() => { setProfileOpen(false); navigate('/coach/help?tab=ticket'); }}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600"
                          >
                            Raise Ticket
                          </button>
                          <button
                            type="button"
                            onClick={() => { setProfileOpen(false); navigate('/coach/help?tab=track'); }}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-600"
                          >
                            Track Requests
                          </button>
                          <button
                            type="button"
                            onClick={() => { setProfileOpen(false); navigate('/coach/help?tab=contact'); }}
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
                <button type="button" onClick={handleLogout} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100">Logout</button>
              </div>
            </div>
          </header>

          <div className="mt-3 flex items-center justify-between rounded-2xl border border-sky-200/80 bg-sky-50/90 px-4 py-2.5 text-xs font-semibold text-sky-900 shadow-sm">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Coach Scope: Filtered strictly to <strong className="text-brand-700 font-bold uppercase tracking-wider">{authService.getCurrentUser()?.sport || 'Football'}</strong> enrolled athletes & fixtures.
            </span>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-sky-800 border border-sky-200">
              Assigned Discipline: {authService.getCurrentUser()?.sport || 'Football'}
            </span>
          </div>

          <main className="mt-4 space-y-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
