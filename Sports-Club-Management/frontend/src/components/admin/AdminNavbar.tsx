import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LifeBuoy, LogOut, MessageSquareText, Search, Settings, UserCircle2 } from 'lucide-react';

interface AdminNavbarProps {
  onMenuClick: () => void;
  displayName?: string;
  onLogout?: () => void;
}

export default function AdminNavbar({ onMenuClick, displayName = 'Club Administrator', onLogout }: AdminNavbarProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="rounded-[1.75rem] border border-slate-200/70 bg-white/85 p-4 shadow-lg shadow-sky-100/70 backdrop-blur-xl lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 lg:hidden"
            aria-label="Open sidebar"
          >
            <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
            <span className="mt-1 block h-0.5 w-5 rounded-full bg-slate-700" />
            <span className="mt-1 block h-0.5 w-5 rounded-full bg-slate-700" />
          </button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Club Owner Operations</p>
            <h1 className="text-xl font-semibold text-slate-900">Welcome back, {displayName}</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none" placeholder="Search members, teams, payments" />
          </label>
          <button
            type="button"
            onClick={() => navigate('/admin/announcements')}
            className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition-colors hover:bg-slate-50">
            <MessageSquareText className="h-5 w-5" />
          </button>
          <div className="relative">
            <button type="button" onClick={() => setIsProfileOpen((current) => !current)} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-semibold text-white">A</div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-500">Administrator Access</p>
              </div>
              <ChevronDown className="mr-1 h-4 w-4 text-slate-500" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 z-30 mt-2 w-56 rounded-[1.25rem] border border-slate-200/70 bg-white p-2 shadow-xl shadow-sky-100/80">
                <button type="button" onClick={() => { setIsProfileOpen(false); navigate('/admin/profile'); }} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-brand-700">
                  <UserCircle2 className="h-4 w-4" /> My Profile
                </button>
                <button type="button" onClick={() => { setIsProfileOpen(false); navigate('/admin/edit-profile'); }} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-brand-700">
                  <UserCircle2 className="h-4 w-4" /> Edit Profile
                </button>
                <button type="button" onClick={() => { setIsProfileOpen(false); navigate('/admin/settings'); }} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-brand-700">
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <button type="button" onClick={() => { setIsProfileOpen(false); navigate('/admin/help'); }} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-brand-700">
                  <LifeBuoy className="h-4 w-4" /> Help & Support
                </button>
                <button type="button" onClick={() => { setIsProfileOpen(false); onLogout?.(); }} className="mt-1 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-brand-700">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
          <div className="rounded-full bg-sky-50 px-3 py-2 text-sm font-medium text-brand-700">{today}</div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
