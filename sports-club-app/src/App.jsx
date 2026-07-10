import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import LostAndFound from './pages/LostAndFound';
import ResourceBooking from './pages/ResourceBooking';
import Feedback from './pages/Feedback';

import AdminDashboard from './pages/AdminDashboard';
import AdminMembers from './pages/admin/Members';
import AdminTeams from './pages/admin/Teams';
import AdminAnnouncements from './pages/admin/Announcements';

import CoachDashboard from './pages/CoachDashboard';
import CoachRoster from './pages/coach/Roster';
import CoachAttendance from './pages/coach/Attendance';
import CoachMatches from './pages/coach/Matches';
import CoachPractice from './pages/coach/Practice';

import MemberDashboard from './pages/MemberDashboard';
import MemberSchedule from './pages/member/Schedule';
import MemberPerformance from './pages/member/Performance';
import MemberPayments from './pages/member/Payments';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Route Redirector based on user role
function HomeRedirect() {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (currentUser.role === 'coach') return <Navigate to="/coach/dashboard" replace />;
  return <Navigate to="/member/dashboard" replace />;
}

// Layout wrapper for dashboard pages
function DashboardLayout({ children }) {
  const { currentUser } = useContext(AppContext);
  if (!currentUser) return <Navigate to="/login" replace />;

  return (
    <div className="d-flex flex-column min-vh-100 bg-darkest text-light">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ height: 'calc(100vh - 70px)' }}>
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function MainRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Authenticated Dashboard Pages */}
      <Route path="/" element={<HomeRedirect />} />
      
      <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
      <Route path="/lost-found" element={<DashboardLayout><LostAndFound /></DashboardLayout>} />
      <Route path="/booking" element={<DashboardLayout><ResourceBooking /></DashboardLayout>} />
      <Route path="/feedback" element={<DashboardLayout><Feedback /></DashboardLayout>} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
      <Route path="/admin/members" element={<DashboardLayout><AdminMembers /></DashboardLayout>} />
      <Route path="/admin/teams" element={<DashboardLayout><AdminTeams /></DashboardLayout>} />
      <Route path="/admin/announcements" element={<DashboardLayout><AdminAnnouncements /></DashboardLayout>} />

      {/* Coach routes */}
      <Route path="/coach/dashboard" element={<DashboardLayout><CoachDashboard /></DashboardLayout>} />
      <Route path="/coach/roster" element={<DashboardLayout><CoachRoster /></DashboardLayout>} />
      <Route path="/coach/attendance" element={<DashboardLayout><CoachAttendance /></DashboardLayout>} />
      <Route path="/coach/matches" element={<DashboardLayout><CoachMatches /></DashboardLayout>} />
      <Route path="/coach/practice" element={<DashboardLayout><CoachPractice /></DashboardLayout>} />

      {/* Member routes */}
      <Route path="/member/dashboard" element={<DashboardLayout><MemberDashboard /></DashboardLayout>} />
      <Route path="/member/schedule" element={<DashboardLayout><MemberSchedule /></DashboardLayout>} />
      <Route path="/member/performance" element={<DashboardLayout><MemberPerformance /></DashboardLayout>} />
      <Route path="/member/payments" element={<DashboardLayout><MemberPayments /></DashboardLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainRoutes />
      </Router>
    </AppProvider>
  );
}
