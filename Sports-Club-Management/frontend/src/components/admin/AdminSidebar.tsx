import { motion } from 'framer-motion';
import {
  BarChart3,
  BadgeDollarSign,
  BellRing,
  CalendarDays,
  ChevronLeft,
  FolderKanban,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Megaphone,
  SearchCheck,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  name: string;
  icon: LucideIcon;
  route: string;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutGrid, route: '/admin/dashboard' },
  { name: 'Members', icon: Users, route: '/admin/members' },
  { name: 'Coaches', icon: GraduationCap, route: '/admin/coaches' },
  { name: 'Sports', icon: Trophy, route: '/admin/sports' },
  { name: 'Teams', icon: ShieldCheck, route: '/admin/teams' },
  { name: 'Events', icon: CalendarDays, route: '/admin/events' },
  { name: 'Resources', icon: FolderKanban, route: '/admin/resources' },
  { name: 'Membership Fees', icon: BadgeDollarSign, route: '/admin/membership-fees' },
  { name: 'Payments', icon: BadgeDollarSign, route: '/admin/payments' },
  { name: 'Announcements', icon: Megaphone, route: '/admin/announcements' },
  { name: 'Reports', icon: BarChart3, route: '/admin/reports' },
  { name: 'Lost & Found', icon: SearchCheck, route: '/admin/lost-and-found' },
  { name: 'Settings', icon: Settings, route: '/admin/settings' },
];

export default function AdminSidebar({ isOpen, onClose, collapsed, onToggleCollapse, onLogout }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm transition-all lg:hidden ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={onClose}
      />

      <motion.aside
        initial={false}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -320 }}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200/70 bg-white/90 px-4 py-4 shadow-2xl shadow-sky-100/80 backdrop-blur-xl transition-all lg:fixed lg:top-0 lg:h-screen lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 text-white shadow-lg shadow-sky-300/40">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="font-display text-base font-semibold text-slate-900">SportsClub</p>
                <p className="text-xs text-slate-500">Admin Console</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-sky-50 lg:inline-flex"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.route;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  navigate(item.route);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${active ? 'bg-sky-50 text-brand-700 shadow-sm' : 'text-slate-600 hover:bg-sky-50 hover:text-brand-700'}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 rounded-[1.5rem] border border-sky-100 bg-sky-50/80 p-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-2 text-brand-600 shadow-sm">
              <BellRing className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-slate-900">3 approvals pending</p>
                <p className="text-xs text-slate-500">Review new registrations</p>
              </div>
            )}
          </div>
          <button type="button" onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
            <LogOut className="h-4 w-4" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
