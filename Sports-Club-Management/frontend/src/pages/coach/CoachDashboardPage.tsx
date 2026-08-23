import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, Clock3, MessageSquareText, Trophy, Users, Warehouse, Waves } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import CoachRosterTable from '../../components/coach-dashboard/CoachRosterTable';
import CoachCalendar from '../../components/coach-dashboard/CoachCalendar';
import CoachSummaryCard from '../../components/coach-dashboard/CoachSummaryCard';
import authService, { type AuthUser } from '../../services/authService';
import userService from '../../services/userService';
import eventService, { type Event } from '../../services/eventService';
import announcementService from '../../services/announcementService';
import resourceService from '../../services/resourceService';

export default function CoachDashboardPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcementsCount, setAnnouncementsCount] = useState<number>(0);
  const [resourcesCount, setResourcesCount] = useState<number>(0);

  const coachName = authService.getFirstName();
  const coachUser = authService.getCurrentUser();
  const coachSport = coachUser?.sport || 'Football';

  useEffect(() => {
    userService.getByRole('Member')
      .then((data) => {
        const sportLower = coachSport.toLowerCase();
        const filtered = data.filter(
          (m) => !m.sport || m.sport.toLowerCase().includes(sportLower) || sportLower.includes(m.sport.toLowerCase())
        );
        setMembers(filtered);
      })
      .catch(() => setMembers([]));
    eventService
      .getAll()
      .then((data) => {
        const sportLower = coachSport.toLowerCase();
        const filtered = data.filter(
          (e) => !e.sport || e.sport.toLowerCase().includes(sportLower) || e.title.toLowerCase().includes(sportLower)
        );
        setEvents(filtered);
      })
      .catch(() => setEvents([]));

    announcementService.getAll().then((list) => setAnnouncementsCount(list.length)).catch(() => setAnnouncementsCount(0));
    resourceService.getAll().then((list) => setResourcesCount(list.length)).catch(() => setResourcesCount(0));
  }, [coachSport]);

  const upcomingSessions = events.filter((e) => e.event_type === 'Practice' && e.event_status === 'Scheduled');
  const upcomingMatches = events.filter((e) => e.event_type === 'Match' && e.event_status === 'Scheduled');

  const summaryCardsData = [
    { title: `Total Athletes (${coachSport})`, value: String(members.length), subtitle: `${coachSport} enrolled`, icon: <Users className="h-5 w-5" />, accent: 'bg-gradient-to-br from-brand-500 to-emerald-500', trend: 'Live' },
    { title: 'Upcoming Practice', value: String(upcomingSessions.length), subtitle: 'Scheduled sessions', icon: <Waves className="h-5 w-5" />, accent: 'bg-gradient-to-br from-brand-500 to-emerald-500', trend: 'Live' },
    { title: 'Upcoming Matches', value: String(upcomingMatches.length), subtitle: 'Scheduled fixtures', icon: <Trophy className="h-5 w-5" />, accent: 'bg-gradient-to-br from-sky-500 to-cyan-400', trend: 'Ready' },
    { title: 'Club Facilities', value: String(resourcesCount), subtitle: 'Active grounds & gear', icon: <Warehouse className="h-5 w-5" />, accent: 'bg-gradient-to-br from-amber-500 to-orange-500', trend: 'Active' },
    { title: 'Announcements', value: String(announcementsCount), subtitle: 'Active notices', icon: <MessageSquareText className="h-5 w-5" />, accent: 'bg-gradient-to-br from-emerald-500 to-green-600', trend: 'Live' },
  ];

  const calendarEventsData = events.slice(0, 5).map((e) => {
    const day = new Date(e.date).getDate() || 15;
    const type: 'Training' | 'Match' | 'Tournament' | 'Holiday' =
      e.event_type === 'Practice' ? 'Training' : e.event_type === 'Match' ? 'Match' : e.event_type === 'Tournament' ? 'Tournament' : 'Holiday';
    return { title: e.title, day, type };
  });

  const quickActionsMap: Record<string, string> = {
    'Create Training Session': '/coach/training',
    'Schedule Match': '/coach/matches',
    'Take Attendance': '/coach/attendance',
    'Post Announcement': '/coach/announcements',
    'View Team Calendar': '/coach/calendar',
  };

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-2xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Good Morning, Coach {coachName}!</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Welcome back. Manage your training sessions, review athlete rosters, and direct squad activities.</p>
          </div>
          <div className="rounded-[1.6rem] border border-sky-200 bg-white/80 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-brand-700"><Waves className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-semibold">Primary Discipline</p>
                <p className="text-sm text-slate-600">{coachSport}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCardsData.map((card) => (
          <CoachSummaryCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Overview</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">SportsClub {coachSport} Squad</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/coach/team')}
              className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-300/40 transition-all hover:scale-105"
            >
              View Full Team
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-500">Sport Discipline</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{coachSport}</p>
              <p className="mt-2 text-sm text-slate-500">{members.length} registered members</p>
            </div>
            <div className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <p className="text-sm font-semibold text-slate-500">Staff & Lead</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Head Coach: {coachName}</p>
              <p className="mt-2 text-sm text-slate-500">Status: Active Season</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Quick Actions</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Keep the team moving</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {Object.entries(quickActionsMap).map(([actionLabel, routePath]) => (
              <button
                key={actionLabel}
                type="button"
                onClick={() => navigate(routePath)}
                className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-all hover:border-brand-300 hover:bg-sky-50"
              >
                {actionLabel}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Roster</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Active athletes ({members.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/coach/team')}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            View Roster Details
          </button>
        </div>
        <div className="mt-5">
          <CoachRosterTable members={members} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Training Sessions</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Upcoming practice sessions</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/coach/training')}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              Create Session
            </button>
          </div>
          <div className="mt-5 grid gap-4">
            {upcomingSessions.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
                No practice sessions currently scheduled. Click &quot;Create Session&quot; to add one.
              </div>
            ) : (
              upcomingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{session.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{session.description || 'Practice & conditioning session'}</p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">Scheduled</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-600" /> {eventService.formatDate(session.date)}</p>
                    <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-pitch-600" /> {eventService.formatTime(session.start_time)}</p>
                    <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-600" /> {session.venue}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/coach/training')}
                      className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <CoachCalendar events={calendarEventsData} />
      </section>
    </CoachPortalLayout>
  );
}
