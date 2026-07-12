import { useMemo, useEffect, useRef, useState, type ReactNode } from 'react';
import { Bell, ChevronDown, ChevronLeft, Dumbbell, Menu, MessageSquareText, Search, UserCircle2, Settings as SettingsIcon, LifeBuoy, LogOut, PencilLine } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import { logoutDemoUser } from '../../utils/demoAuth';

interface MemberLayoutProps {
  children: ReactNode;
}

const routeToLabel: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/my-sports': 'My Sports',
  '/dashboard/events': 'Events',
  '/dashboard/membership': 'Membership',
  '/dashboard/facility-booking': 'Facility Booking',
  '/dashboard/attendance': 'Attendance',
  '/dashboard/performance': 'Performance',
  '/dashboard/achievements': 'Achievements',
  '/dashboard/payments': 'Payments',
  '/dashboard/announcements': 'Announcements',
  '/dashboard/lost-and-found': 'Lost & Found',
  '/dashboard/settings': 'Settings',
};

export default function MemberLayout({ children }: MemberLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const activeItem = useMemo(() => routeToLabel[location.pathname] || 'Dashboard', [location.pathname]);

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

  return (
    <div className="min-h-screen bg-background text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-4 px-3 py-3 lg:px-4 lg:py-4">
        <Sidebar activeItem={activeItem} onSelect={() => undefined} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 rounded-[2rem] border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-3 shadow-xl shadow-sky-100/80 lg:p-4">
          <header className="relative z-30 glass rounded-[1.5rem] p-3 shadow-lg shadow-slate-900/5 sm:p-4">
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
                    <p className="text-sm text-slate-500">Member portal</p>
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

          <main className="mt-4 space-y-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
