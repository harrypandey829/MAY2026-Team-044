import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sports from './components/Sports';
import WhyJoin from './components/WhyJoin';
import Membership from './components/Membership';
import HowItWorks from './components/HowItWorks';
import Events from './components/Events';
import Coaches from './components/Coaches';
import MemberBenefits from './components/MemberBenefits';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MembershipPage from './pages/MembershipPage';
import AdminDashboard from './pages/AdminDashboard';
import {
  AnnouncementsPage as AdminAnnouncementsPage,
  CoachesPage as AdminCoachesPage,
  EditProfilePage as AdminEditProfilePage,
  EventsPage as AdminEventsPage,
  HelpPage as AdminHelpPage,
  LostAndFoundAdminPage as AdminLostAndFoundPage,
  MembershipFeesPage as AdminMembershipFeesPage,
  MembersPage as AdminMembersPage,
  PaymentsPage as AdminPaymentsPage,
  ProfilePage as AdminProfilePage,
  ReportsPage as AdminReportsPage,
  ResourcesPage as AdminResourcesPage,
  SettingsPage as AdminSettingsPage,
  SportsPage as AdminSportsPage,
  TeamsPage as AdminTeamsPage,
} from './pages/admin/OwnerPortalPages';
import CoachDashboardPage from './pages/coach/CoachDashboardPage';
import MyTeamPage from './pages/coach/MyTeamPage';
import TrainingSessionsPage from './pages/coach/TrainingSessionsPage';
import MatchesPage from './pages/coach/MatchesPage';
import AttendancePage from './pages/coach/AttendancePage';
import TeamCalendarPage from './pages/coach/TeamCalendarPage';
import PlayerAvailabilityPage from './pages/coach/PlayerAvailabilityPage';
import PerformancePage from './pages/coach/PerformancePage';
import CoachAnnouncementsPage from './pages/coach/AnnouncementsPage';
import EquipmentPage from './pages/coach/EquipmentPage';
import CoachProfilePage from './pages/coach/ProfilePage';
import CoachSettingsPage from './pages/coach/SettingsPage';
import CoachLostAndFoundPage from './pages/coach/LostAndFoundPage';
import MySportsPage from './pages/member/MySports';
import MemberEventsPage from './pages/member/Events';
import MembershipPortalPage from './pages/member/Membership';
import FacilityBookingPage from './pages/member/FacilityBooking';
import MemberAttendancePage from './pages/member/Attendance';
import MemberPerformancePage from './pages/member/Performance';
import AchievementsPage from './pages/member/Achievements';
import MemberPaymentsPage from './pages/member/Payments';
import MemberAnnouncementsPage from './pages/member/Announcements';
import MemberLostAndFoundPage from './pages/member/LostAndFoundPage';
import MemberProfilePage from './pages/member/Profile';
import MemberSettingsPage from './pages/member/Settings';
import MyProfilePage from './pages/member/MyProfile';
import MemberEditProfilePage from './pages/member/EditProfile';
import { getDemoRole, isDemoAuthenticated } from './utils/demoAuth';

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <Sports />
        <WhyJoin />
        <Membership />
        <HowItWorks />
        <Events />
        <Coaches />
        <MemberBenefits />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  if (!isDemoAuthenticated() || getDemoRole() !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/my-sports" element={<MySportsPage />} />
        <Route path="/dashboard/events" element={<MemberEventsPage />} />
        <Route path="/dashboard/membership" element={<MembershipPortalPage />} />
        <Route path="/dashboard/facility-booking" element={<FacilityBookingPage />} />
        <Route path="/dashboard/attendance" element={<MemberAttendancePage />} />
        <Route path="/dashboard/performance" element={<MemberPerformancePage />} />
        <Route path="/dashboard/achievements" element={<AchievementsPage />} />
        <Route path="/dashboard/payments" element={<MemberPaymentsPage />} />
        <Route path="/dashboard/announcements" element={<MemberAnnouncementsPage />} />
        <Route path="/dashboard/lost-and-found" element={<MemberLostAndFoundPage />} />
        <Route path="/dashboard/profile" element={<MemberProfilePage />} />
        <Route path="/dashboard/my-profile" element={<MyProfilePage />} />
        <Route path="/dashboard/edit-profile" element={<MemberEditProfilePage />} />
        <Route path="/dashboard/settings" element={<MemberSettingsPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/coach/dashboard" element={<CoachDashboardPage />} />
        <Route path="/coach/team" element={<MyTeamPage />} />
        <Route path="/coach/training" element={<TrainingSessionsPage />} />
        <Route path="/coach/matches" element={<MatchesPage />} />
        <Route path="/coach/attendance" element={<AttendancePage />} />
        <Route path="/coach/calendar" element={<TeamCalendarPage />} />
        <Route path="/coach/availability" element={<PlayerAvailabilityPage />} />
        <Route path="/coach/performance" element={<PerformancePage />} />
        <Route path="/coach/announcements" element={<CoachAnnouncementsPage />} />
        <Route path="/coach/equipment" element={<EquipmentPage />} />
        <Route path="/coach/lost-and-found" element={<CoachLostAndFoundPage />} />
        <Route path="/coach/profile" element={<CoachProfilePage />} />
        <Route path="/coach/settings" element={<CoachSettingsPage />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/members" element={<ProtectedAdminRoute><AdminMembersPage /></ProtectedAdminRoute>} />
        <Route path="/admin/coaches" element={<ProtectedAdminRoute><AdminCoachesPage /></ProtectedAdminRoute>} />
        <Route path="/admin/sports" element={<ProtectedAdminRoute><AdminSportsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/teams" element={<ProtectedAdminRoute><AdminTeamsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/events" element={<ProtectedAdminRoute><AdminEventsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/resources" element={<ProtectedAdminRoute><AdminResourcesPage /></ProtectedAdminRoute>} />
        <Route path="/admin/membership-fees" element={<ProtectedAdminRoute><AdminMembershipFeesPage /></ProtectedAdminRoute>} />
        <Route path="/admin/payments" element={<ProtectedAdminRoute><AdminPaymentsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/announcements" element={<ProtectedAdminRoute><AdminAnnouncementsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminReportsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/lost-and-found" element={<ProtectedAdminRoute><AdminLostAndFoundPage /></ProtectedAdminRoute>} />
        <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettingsPage /></ProtectedAdminRoute>} />
        <Route path="/admin/profile" element={<ProtectedAdminRoute><AdminProfilePage /></ProtectedAdminRoute>} />
        <Route path="/admin/edit-profile" element={<ProtectedAdminRoute><AdminEditProfilePage /></ProtectedAdminRoute>} />
        <Route path="/admin/help" element={<ProtectedAdminRoute><AdminHelpPage /></ProtectedAdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
