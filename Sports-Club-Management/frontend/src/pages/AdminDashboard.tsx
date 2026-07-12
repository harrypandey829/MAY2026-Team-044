import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CreditCard, ShieldCheck, Users } from 'lucide-react';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSidebar from '../components/admin/AdminSidebar';
import AnnouncementsReports from '../components/admin/AnnouncementsReports';
import CoachCards from '../components/admin/CoachCards';
import EventsTable from '../components/admin/EventsTable';
import MembersTable from '../components/admin/MembersTable';
import QuickActions from '../components/admin/QuickActions';
import ResourcesPayments from '../components/admin/ResourcesPayments';
import SportsOverview from '../components/admin/SportsOverview';
import StatsCards from '../components/admin/StatsCards';
import { getDemoDisplayName, logoutDemoUser } from '../utils/demoAuth';

const stats = [
  { title: 'Active Members', value: '2,840', change: '+12%', trend: 'Since last month', icon: Users },
  { title: 'Revenue', value: '$84.2k', change: '+8.4%', trend: 'Quarter target', icon: CreditCard },
  { title: 'Events Booked', value: '36', change: '+6%', trend: 'This month', icon: CalendarDays },
  { title: 'Member Satisfaction', value: '94%', change: '+3%', trend: 'Well above goal', icon: ShieldCheck },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const displayName = getDemoDisplayName();

  function handleLogout() {
    logoutDemoUser();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.22),_transparent_42%),linear-gradient(135deg,_#f8fbff_0%,_#f8fafc_100%)] text-slate-900">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((current) => !current)}
        onLogout={handleLogout}
      />

      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-[5rem]' : 'lg:pl-[18rem]'}`}>
        <div className="mx-auto max-w-7xl px-3 pb-3 pt-0 lg:px-4 lg:pb-4 lg:pt-0">
          <div className="sticky top-0 z-20 bg-transparent pt-3 pb-2">
            <AdminNavbar onMenuClick={() => setSidebarOpen(true)} displayName={displayName} onLogout={handleLogout} />
          </div>

          <main className="mt-3 space-y-5">
            <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Welcome back</p>
                  <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Welcome back, {displayName}</h1>
                  <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                    Manage members, coaches, events, facilities, payments, and club operations from one place.
                  </p>
                </div>
                <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-brand-700">
                  Live operations overview
                </div>
              </div>
            </section>

            <StatsCards stats={stats} />
            <QuickActions />
            <MembersTable />
            <CoachCards />
            <SportsOverview />
            <EventsTable />
            <ResourcesPayments />
            <AnnouncementsReports />
          </main>
        </div>
      </div>
    </div>
  );
}
