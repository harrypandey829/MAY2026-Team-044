import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Award,
  CalendarDays,
  Clock3,
  CreditCard,
  Home,
  LayoutGrid,
  Newspaper,
  Search,
  Settings,
  Sparkles,
  Trophy,
  UserCircle2,
  Waves,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  route: string;
}

const items: SidebarItem[] = [
  { label: 'Dashboard', icon: Home, route: '/dashboard' },
  { label: 'My Sports', icon: Activity, route: '/dashboard/my-sports' },
  { label: 'Events', icon: CalendarDays, route: '/dashboard/events' },
  { label: 'Membership', icon: Sparkles, route: '/dashboard/membership' },
  { label: 'Facility Booking', icon: LayoutGrid, route: '/dashboard/facility-booking' },
  { label: 'Attendance', icon: Clock3, route: '/dashboard/attendance' },
  { label: 'Performance', icon: Trophy, route: '/dashboard/performance' },
  { label: 'Achievements', icon: Award, route: '/dashboard/achievements' },
  { label: 'Payments', icon: CreditCard, route: '/dashboard/payments' },
  { label: 'Announcements', icon: Newspaper, route: '/dashboard/announcements' },
  { label: 'Lost & Found', icon: Search, route: '/dashboard/lost-and-found' },
  { label: 'Profile', icon: UserCircle2, route: '/dashboard/profile' },
  { label: 'Settings', icon: Settings, route: '/dashboard/settings' },
];

interface SidebarProps {
  activeItem: string;
  onSelect: (item: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeItem, onSelect, isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const resolvedActiveItem = activeItem || items.find((item) => item.route === location.pathname)?.label || 'Dashboard';

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-slate-200/70 bg-white/85 p-4 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:rounded-[2rem] lg:border lg:border-sky-200/70 lg:shadow-xl lg:shadow-sky-100/80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
          <div>
            <p className="text-lg font-semibold text-slate-900">SportsClub</p>
            <p className="text-sm text-slate-500">Member hub</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <Waves className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-5 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = item.label === resolvedActiveItem;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onSelect(item.label);
                  navigate(item.route);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-sky-300/40'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-brand-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[1.5rem] border border-sky-200 bg-gradient-to-br from-sky-50 to-emerald-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Training streak</p>
          <p className="mt-2 text-3xl font-extrabold text-brand-700">12 days</p>
          <p className="mt-2 text-sm text-slate-600">Keep it going with your next session.</p>
        </div>
      </aside>

      {isOpen && <button type="button" aria-label="Close overlay" onClick={onClose} className="fixed inset-0 z-30 bg-sky-950/10 backdrop-blur-sm lg:hidden" />}
    </>
  );
}
