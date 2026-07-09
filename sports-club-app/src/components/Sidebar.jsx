import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Sidebar() {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) return null;

  const renderAdminLinks = () => (
    <>
      <li className="nav-item mb-2">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/admin/members" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-people-fill"></i>
          <span>Member Manager</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/admin/teams" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-shield-fill-check"></i>
          <span>Teams & Coaches</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/admin/announcements" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-megaphone-fill"></i>
          <span>Announcements</span>
        </NavLink>
      </li>
    </>
  );

  const renderCoachLinks = () => (
    <>
      <li className="nav-item mb-2">
        <NavLink to="/coach/dashboard" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/coach/roster" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-people-fill"></i>
          <span>Team Roster</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/coach/attendance" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-calendar-check-fill"></i>
          <span>Mark Attendance</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/coach/matches" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-trophy-fill"></i>
          <span>Schedule Matches</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/coach/practice" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-journal-album"></i>
          <span>Practice Planner</span>
        </NavLink>
      </li>
    </>
  );

  const renderMemberLinks = () => (
    <>
      <li className="nav-item mb-2">
        <NavLink to="/member/dashboard" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/member/schedule" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-calendar3"></i>
          <span>My Schedule</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/member/performance" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-award-fill"></i>
          <span>Badges & Stats</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/member/payments" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-credit-card-fill"></i>
          <span>Fees & Invoices</span>
        </NavLink>
      </li>
      <li className="nav-item mb-2">
        <NavLink to="/feedback" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
          <i className="bi bi-star-half"></i>
          <span>Training Feedback</span>
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 border-end text-light" style={{ width: 'var(--sidebar-width)', background: 'var(--bg-darker)', borderColor: 'var(--border-color) !important', height: 'calc(100vh - 70px)' }}>
      <ul className="nav nav-pills flex-column mb-auto">
        {currentUser.role === 'admin' && renderAdminLinks()}
        {currentUser.role === 'coach' && renderCoachLinks()}
        {currentUser.role === 'member' && renderMemberLinks()}
        
        {/* Global Access Links */}
        <hr className="my-3 border-secondary" style={{ opacity: 0.3 }} />
        <span className="small text-muted px-3 text-uppercase fw-semibold mb-2" style={{ fontSize: '0.7rem' }}>Club Facilities</span>
        
        <li className="nav-item mb-2">
          <NavLink to="/booking" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
            <i className="bi bi-calendar2-week-fill"></i>
            <span>Resource Booking</span>
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/lost-found" className={({ isActive }) => `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none transition-all ${isActive ? 'bg-gradient-primary text-white' : 'text-muted-link'}`}>
            <i className="bi bi-search"></i>
            <span>Lost & Found</span>
          </NavLink>
        </li>
      </ul>

      {/* Footer Details */}
      <div className="mt-auto pt-2 border-top border-secondary border-opacity-25 text-center">
        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>ElitePlay Club v1.0</div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .text-muted-link {
          color: var(--text-muted);
        }
        .text-muted-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.04);
        }
      `}} />
    </div>
  );
}
