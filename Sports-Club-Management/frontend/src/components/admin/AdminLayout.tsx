import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { getDemoDisplayName, logoutDemoUser } from '../../utils/demoAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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

          <main className="mt-3 space-y-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
