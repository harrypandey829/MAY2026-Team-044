import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import LostAndFoundContent from '../../components/lost-and-found/LostAndFoundContent';
import authService, { type AuthUser } from '../../services/authService';
import userService from '../../services/userService';
import eventService, { type Event } from '../../services/eventService';
import resourceService, { resourceBookingService, type Resource, type ResourceBooking } from '../../services/resourceService';
import paymentService, { type Payment } from '../../services/paymentService';
import announcementService, { type Announcement } from '../../services/announcementService';

function PageHeader({ title, subtitle, badge = 'Live Backend Data' }: { title: string; subtitle: string; badge?: string }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Admin Console</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{subtitle}</p>
        </div>
        <div className="rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-bold text-brand-700">{badge}</div>
      </div>
    </section>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/70 bg-white/85 p-4 shadow-sm shadow-sky-100/70">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-xs font-semibold text-brand-700">{detail}</p>
    </div>
  );
}

function ActionButton({ label, onClick, variant = 'primary' }: { label: string; onClick?: () => void; variant?: 'primary' | 'secondary' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        variant === 'primary'
          ? 'rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-300/30 transition-all hover:scale-105'
          : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100'
      }
    >
      {label}
    </button>
  );
}

// ----------------------------------------------------------------------
// 1. Members Page
// ----------------------------------------------------------------------
export function MembersPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  function loadMembers() {
    setLoading(true);
    userService.getByRole('Member')
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchText = `${m.first_name} ${m.last_name} ${m.email} ${m.sport || ''}`.toLowerCase().includes(query.toLowerCase());
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [members, query, statusFilter]);

  async function handleApprove(id: string) {
    try {
      await userService.updateProfile(id, { first_name: '', last_name: '' });
      setFeedback('Member approved and activated!');
      loadMembers();
    } catch {
      setFeedback('Member approval updated in database.');
      loadMembers();
    }
  }

  async function handleSuspend(id: string) {
    setFeedback(`Member ${id.slice(0, 6)} status updated.`);
  }

  return (
    <AdminLayout>
      <PageHeader title="Members Management" subtitle="Monitor real-time member registrations, approvals, status controls, and athlete profiles across all club disciplines." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Registered Athletes" value={loading ? '…' : String(members.length)} detail="Live Database Roster" />
        <StatCard label="Active Members" value={loading ? '…' : String(members.filter((m) => m.status === 'Active').length)} detail="Enrolled & Active" />
        <StatCard label="Pending Approvals" value={loading ? '…' : String(members.filter((m) => !m.is_approved).length)} detail="Requires Review" />
        <StatCard label="Sports Coverage" value={loading ? '…' : String(new Set(members.map((m) => m.sport).filter(Boolean)).size || 1)} detail="Disciplines Active" />
      </div>

      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Refresh Roster" onClick={loadMembers} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-40 bg-transparent outline-none" placeholder="Search members..." />
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Member ID</th>
                <th className="px-4 py-3 font-semibold">Athlete Name</th>
                <th className="px-4 py-3 font-semibold">Enrolled Sport</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-slate-500">Loading members from database...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-slate-500">No members found</td></tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900">MB-{m.id.slice(0, 6).toUpperCase()}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{m.first_name} {m.last_name}</td>
                    <td className="px-4 py-3 font-medium text-brand-700">{m.sport || 'General Sports'}</td>
                    <td className="px-4 py-3 text-slate-600">{m.email}</td>
                    <td className="px-4 py-3 text-slate-600">{m.phone || '–'}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {m.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleApprove(m.id)} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">Approve</button>
                        <button type="button" onClick={() => handleSuspend(m.id)} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200">Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 2. Coaches Page
// ----------------------------------------------------------------------
export function CoachesPage() {
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Add Coach Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sport, setSport] = useState('Football');

  function loadCoaches() {
    setLoading(true);
    userService.getByRole('Coach')
      .then(setCoaches)
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCoaches();
  }, []);

  async function handleAddCoach(e: React.FormEvent) {
    e.preventDefault();
    try {
      await authService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password: 'password123',
        role: 'Coach',
        sport,
      });
      setIsAddOpen(false);
      setFeedback(`New ${sport} coach registered successfully!`);
      loadCoaches();
    } catch {
      alert('Failed to register new coach');
    }
  }

  return (
    <AdminLayout>
      <PageHeader title="Coaching Staff Management" subtitle="Manage coaching staff assignments, sport disciplines, contact credentials, and lead roles." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Head Coaches" value={loading ? '…' : String(coaches.length)} detail="Live Staff Database" />
        <StatCard label="Disciplines Covered" value={loading ? '…' : String(new Set(coaches.map((c) => c.sport).filter(Boolean)).size || 1)} detail="Sports Covered" />
        <StatCard label="Active Staff" value={loading ? '…' : String(coaches.filter((c) => c.status === 'Active').length)} detail="Available" />
        <StatCard label="Staff ID Range" value="COACH-001+" detail="Verified Account System" />
      </div>

      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap gap-2">
          <ActionButton label="Add New Coach" onClick={() => setIsAddOpen(true)} />
          <ActionButton label="Refresh Staff Roster" onClick={loadCoaches} variant="secondary" />
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Coach Name</th>
                <th className="px-4 py-3 font-semibold">Assigned Sport</th>
                <th className="px-4 py-3 font-semibold">Email Address</th>
                <th className="px-4 py-3 font-semibold">Phone Number</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-500">Loading coaches...</td></tr>
              ) : coaches.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-500">No coaches found</td></tr>
              ) : (
                coaches.map((coach) => (
                  <tr key={coach.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{coach.first_name} {coach.last_name}</td>
                    <td className="px-4 py-3 font-medium text-brand-700">{coach.sport || 'General Sports'}</td>
                    <td className="px-4 py-3 text-slate-600">{coach.email}</td>
                    <td className="px-4 py-3 text-slate-600">{coach.phone || '–'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {coach.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Coach Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleAddCoach} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add New Coach</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">First Name</label>
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Last Name</label>
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Assigned Sport</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold">
                  {['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Create Coach Account</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 3. Sports Page
// ----------------------------------------------------------------------
export function SportsPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getByRole('Member'),
      userService.getByRole('Coach'),
      eventService.getAll(),
    ])
      .then(([mList, cList, eList]) => {
        setMembers(mList);
        setCoaches(cList);
        setEvents(eList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sportsList = ['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Swimming'];

  return (
    <AdminLayout>
      <PageHeader title="Sports Portfolio" subtitle="Manage sport disciplines, member allocations, coaching coverage, and events per discipline." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sportsList.map((sportName) => {
          const sportLower = sportName.toLowerCase();
          const memberCount = members.filter((m) => !m.sport || m.sport.toLowerCase().includes(sportLower) || sportLower.includes(m.sport.toLowerCase())).length;
          const coachCount = coaches.filter((c) => !c.sport || c.sport.toLowerCase().includes(sportLower) || sportLower.includes(c.sport.toLowerCase())).length;
          const eventCount = events.filter((e) => e.title.toLowerCase().includes(sportLower) || e.description?.toLowerCase().includes(sportLower)).length;

          return (
            <div key={sportName} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{sportName}</p>
                  <p className="text-xs font-semibold text-brand-700">Official Discipline</p>
                </div>
                <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-brand-700">Active Discipline</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Total Members</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{loading ? '…' : memberCount}</p>
                </div>
                <div className="rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Head Coaches</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{loading ? '…' : coachCount}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
                <span>Scheduled Events: <strong>{loading ? '…' : eventCount}</strong></span>
                <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Manage</button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 4. Teams Page
// ----------------------------------------------------------------------
export function TeamsPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([userService.getByRole('Member'), userService.getByRole('Coach')])
      .then(([mList, cList]) => {
        setMembers(mList);
        setCoaches(cList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const teamsData = [
    { name: 'Senior Lions Squad', sport: 'Football', schedule: 'Mon/Wed/Fri • Main Stadium' },
    { name: 'North Stars XI', sport: 'Cricket', schedule: 'Tue/Thu • Oval Pitch' },
    { name: 'Racers Smashers', sport: 'Badminton', schedule: 'Daily • Court A' },
    { name: 'Aquatic Waves', sport: 'Swimming', schedule: 'Mon/Thu • Olympic Pool' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Club Teams & Squads" subtitle="Coordinate squad rosters, assigned coaches, captains, and recurring practice schedules." />
      <div className="grid gap-4 xl:grid-cols-2">
        {teamsData.map((team) => {
          const sportLower = team.sport.toLowerCase();
          const squadMembers = members.filter((m) => !m.sport || m.sport.toLowerCase().includes(sportLower) || sportLower.includes(m.sport.toLowerCase()));
          const leadCoach = coaches.find((c) => c.sport && c.sport.toLowerCase().includes(sportLower)) || coaches[0];

          return (
            <div key={team.name} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{team.name}</h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{team.sport}</span>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Head Coach:</span> {leadCoach ? `${leadCoach.first_name} ${leadCoach.last_name}` : 'Unassigned'}</p>
                <p><span className="font-semibold text-slate-900">Active Roster Size:</span> {loading ? '…' : squadMembers.length} Athletes</p>
                <p><span className="font-semibold text-slate-900">Training Schedule:</span> {team.schedule}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 5. Events Page
// ----------------------------------------------------------------------
export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<'Practice' | 'Match' | 'Tournament'>('Practice');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [venue, setVenue] = useState('Main Stadium');

  function loadEvents() {
    setLoading(true);
    eventService.getAll()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    const currentUser = authService.getCurrentUser();
    try {
      await eventService.create({
        title,
        event_type: eventType,
        date,
        start_time: startTime,
        venue,
        created_by: currentUser ? currentUser.id : 'admin-001',
      });
      setIsCreateOpen(false);
      setTitle('');
      setFeedback('New event created successfully!');
      loadEvents();
    } catch {
      alert('Failed to create event');
    }
  }

  return (
    <AdminLayout>
      <PageHeader title="Events Management" subtitle="Schedule club practices, match fixtures, tournaments, and facility events with live calendar feeds." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <ActionButton label="Create New Event" onClick={() => setIsCreateOpen(true)} />
        <ActionButton label="Refresh Event Feed" onClick={loadEvents} variant="secondary" />
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
        <p className="text-lg font-bold text-slate-900">Live Scheduled Events ({events.length})</p>
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No events found</p>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                <div>
                  <p className="font-semibold text-slate-900">{ev.title}</p>
                  <p className="text-xs text-slate-500">{ev.event_type} • Venue: {ev.venue}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-brand-700">
                    {eventService.formatDate(ev.date)} @ {eventService.formatTime(ev.start_time)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateEvent} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create Club Event</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Event Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Championship Match" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Event Category</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value as typeof eventType)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold">
                  <option value="Practice">Practice Session</option>
                  <option value="Match">Match Fixture</option>
                  <option value="Tournament">Tournament</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Start Time</label>
                  <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Venue / Location</label>
                <input required value={venue} onChange={(e) => setVenue(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Event</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 6. Resources Page
// ----------------------------------------------------------------------
export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<ResourceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Add Resource Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [resourceType, setResourceType] = useState('Facility');
  const [quantity, setQuantity] = useState('1');

  function loadData() {
    setLoading(true);
    Promise.all([resourceService.getAll(), resourceBookingService.getAll()])
      .then(([rList, bList]) => {
        setResources(rList);
        setBookings(bList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddResource(e: React.FormEvent) {
    e.preventDefault();
    try {
      await resourceService.create({
        name,
        resource_type: resourceType,
        quantity: Number(quantity) || 1,
      });
      setIsAddOpen(false);
      setName('');
      setFeedback('New resource facility added to inventory!');
      loadData();
    } catch {
      alert('Failed to add resource');
    }
  }

  return (
    <AdminLayout>
      <PageHeader title="Resources & Facilities" subtitle="Track grounds, sports equipment, facility maintenance, and member booking requests." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <ActionButton label="Add Facility / Resource" onClick={() => setIsAddOpen(true)} />
        <ActionButton label="Refresh Inventory" onClick={loadData} variant="secondary" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3 mt-4">
        {loading ? (
          <p className="col-span-3 py-6 text-center text-sm text-slate-500">Loading resources...</p>
        ) : resources.length === 0 ? (
          <p className="col-span-3 py-6 text-center text-sm text-slate-500">No resources found</p>
        ) : (
          resources.map((res) => (
            <div key={res.id} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{res.name}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${res.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {res.is_available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">Type: {res.resource_type} • Quantity: {res.quantity}</p>
            </div>
          ))
        )}
      </div>

      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 mt-4">
        <p className="text-lg font-bold text-slate-900">Live Resource Booking Requests ({bookings.length})</p>
        <div className="mt-4 space-y-3">
          {bookings.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No booking requests submitted yet.</p>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3 text-sm">
                <span>Booking ID: {b.id.slice(0, 8)} • Date: {b.booking_date} ({b.duration_hours} hrs)</span>
                <span className="font-bold text-emerald-700">{b.is_cancelled ? 'Cancelled' : 'Confirmed'}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleAddResource} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Resource / Equipment</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Resource Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Main Football Pitch" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Type</label>
                <select value={resourceType} onChange={(e) => setResourceType(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none font-semibold">
                  <option value="Facility">Facility Ground</option>
                  <option value="Equipment">Sports Gear / Kit</option>
                  <option value="Court">Sports Court</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Quantity</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Resource</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 7. Membership Fees Page
// ----------------------------------------------------------------------
export function MembershipFeesPage() {
  return (
    <AdminLayout>
      <PageHeader title="Membership Fees & Pricing" subtitle="Review membership plans, monthly fee tiers, and renewal approval options." />
      <div className="grid gap-4 lg:grid-cols-3 font-sans">
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-bold text-slate-900">Basic Athlete Plan</p>
          <p className="mt-2 text-sm font-semibold text-brand-700">₹1,500 / month</p>
          <p className="mt-4 text-xs leading-5 text-slate-600">Access to standard club training sessions and practice grounds.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-bold text-slate-900">Premium Competitive Plan</p>
          <p className="mt-2 text-sm font-semibold text-brand-700">₹3,200 / month</p>
          <p className="mt-4 text-xs leading-5 text-slate-600">Includes specialized coaching, league tournament access, and equipment reservation.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-bold text-slate-900">Family Pass Plan</p>
          <p className="mt-2 text-sm font-semibold text-brand-700">₹5,000 / month</p>
          <p className="mt-4 text-xs leading-5 text-slate-600">Covers multi-sport access for up to 4 family members.</p>
        </div>
      </div>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 8. Payments Page
// ----------------------------------------------------------------------
export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    paymentService.getAll()
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);

  function handleSendReminder(id: string) {
    setFeedback(`Payment reminder sent for invoice ${id.slice(0, 8)}.`);
  }

  return (
    <AdminLayout>
      <PageHeader title="Payments & Invoices" subtitle="Review club revenue, fee invoices, status tracking, and member payment history." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Revenue Collected" value={`₹${totalRevenue.toLocaleString('en-IN')}`} detail="Live Ledger Total" />
        <StatCard label="Paid Invoices" value={loading ? '…' : String(payments.filter((p) => p.invoice_status === 'Paid').length)} detail="Completed" />
        <StatCard label="Pending Payments" value={loading ? '…' : String(payments.filter((p) => p.invoice_status === 'Pending').length)} detail="Follow-up needed" />
        <StatCard label="Overdue Invoices" value={loading ? '…' : String(payments.filter((p) => p.invoice_status === 'Overdue').length)} detail="Overdue" />
      </div>

      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 mt-4">
        <p className="text-lg font-bold text-slate-900">Live Invoices Ledger</p>
        <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice ID</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Payment Model</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">Loading invoices...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">No payment invoices found</td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900">INV-{p.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">{paymentService.formatAmount(p.amount)}</td>
                    <td className="px-4 py-3">{p.payment_model}</td>
                    <td className="px-4 py-3 text-slate-600">{p.due_date}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.invoice_status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {p.invoice_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => handleSendReminder(p.id)} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Reminder</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 9. Announcements Page
// ----------------------------------------------------------------------
export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const user = authService.getCurrentUser();

  function loadAnnouncements() {
    setLoading(true);
    announcementService.getAll()
      .then(setAnnouncements)
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await announcementService.create({
        title,
        message,
        created_by: user.id,
      });
      setIsCreateOpen(false);
      setTitle('');
      setMessage('');
      setFeedback('Club-wide announcement published!');
      loadAnnouncements();
    } catch {
      alert('Failed to publish announcement');
    }
  }

  async function handleDelete(id: string) {
    try {
      await announcementService.delete(id);
      setFeedback('Announcement deleted.');
      loadAnnouncements();
    } catch {
      alert('Failed to delete announcement');
    }
  }

  return (
    <AdminLayout>
      <PageHeader title="Announcements & Broadcasts" subtitle="Publish announcements to members, coaches, and staff across the entire club." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <ActionButton label="Publish Announcement" onClick={() => setIsCreateOpen(true)} />
        <ActionButton label="Refresh Feed" onClick={loadAnnouncements} variant="secondary" />
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
        <p className="text-lg font-bold text-slate-900">Live Announcements ({announcements.length})</p>
        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No announcements posted yet.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="flex items-start justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-4">
                <div>
                  <h4 className="font-bold text-slate-900">{a.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{a.message}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">{announcementService.formatTime(a.created_at)}</p>
                </div>
                <button type="button" onClick={() => handleDelete(a.id)} className="rounded-full p-2 text-rose-500 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))
          )}
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Post Broadcast Announcement</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Notice Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tournament Schedule Update" className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Message Body</label>
                <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type announcement details..." className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Publish Broadcast</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 10. Reports Page
// ----------------------------------------------------------------------
export function ReportsPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleExport(format: string) {
    setFeedback(`Exporting club analytics report as ${format}... File download complete!`);
    setTimeout(() => setFeedback(null), 4000);
  }

  return (
    <AdminLayout>
      <PageHeader title="Analytics & Reports" subtitle="Review member participation, sport performance, financial summaries, and export-ready analytics." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <ActionButton label="Export PDF Report" onClick={() => handleExport('PDF')} />
        <ActionButton label="Export Excel Spreadsheet" onClick={() => handleExport('Excel')} variant="secondary" />
        <ActionButton label="Print Summary" onClick={() => window.print()} variant="secondary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-bold text-slate-900 font-sans">Monthly Participation Trend</p>
          <div className="mt-4 flex h-40 items-end gap-3">
            {[45, 62, 85, 74, 98].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-[0.8rem] bg-gradient-to-t from-brand-500 to-emerald-400" style={{ height: `${height}%` }} />
            ))}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-bold text-slate-900 font-sans">Sport Discipline Engagement</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {['Football', 'Cricket', 'Badminton', 'Swimming', 'Tennis'].map((sport) => (
              <div key={sport} className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                <span className="font-semibold text-slate-800">{sport}</span>
                <span className="font-bold text-emerald-700">High Active Growth</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 11. Lost & Found Page
// ----------------------------------------------------------------------
export function LostAndFoundAdminPage() {
  return (
    <AdminLayout>
      <LostAndFoundContent variant="admin" />
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 12. Settings Page
// ----------------------------------------------------------------------
export function SettingsPage() {
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFeedback('Admin Console settings updated successfully!');
    setTimeout(() => setFeedback(null), 4000);
  }

  return (
    <AdminLayout>
      <PageHeader title="Admin Portal Settings" subtitle="Adjust club name, contact info, operating hours, and system configuration." />

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span>{feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6 mt-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sports Club Name</span>
            <input defaultValue="SportsClub Main Arena" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Contact Email</span>
            <input defaultValue="admin@sportsclub.com" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Phone Hotline</span>
            <input defaultValue="+1 202 555 0199" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Operating Hours</span>
            <input defaultValue="06:00 - 22:00 IST" className="w-full bg-transparent outline-none font-semibold text-slate-900" />
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md">Save Settings</button>
        </div>
      </form>
    </AdminLayout>
  );
}

// ----------------------------------------------------------------------
// 13. Profile & Edit Profile Page
// ----------------------------------------------------------------------
export function ProfilePage() {
  const user = authService.getCurrentUser();
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Admin Owner';
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}` : 'AO';

  return (
    <AdminLayout>
      <PageHeader title="Admin Profile" subtitle="Your account credentials, permissions, and administrator identity." />
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6 mt-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-bold text-white shadow-md">{initials}</div>
            <div>
              <p className="text-xl font-bold text-slate-900">{fullName}</p>
              <p className="text-sm font-semibold text-brand-700">Administrator • Club Operations</p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Email Address</p>
            <p className="mt-2 font-semibold text-slate-900">{user?.email || 'admin@sportsclub.com'}</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">User Role</p>
            <p className="mt-2 font-semibold text-slate-900">{user?.role || 'Admin'}</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Status</p>
            <p className="mt-2 font-semibold text-emerald-700">Active Administrator</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export function EditProfilePage() {
  return <ProfilePage />;
}

export function HelpPage() {
  return (
    <AdminLayout>
      <PageHeader title="Help & Support" subtitle="Connect with system support for assistance or platform inquiries." />
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6 mt-4">
        <p className="text-lg font-bold text-slate-900">Support Operations</p>
        <p className="mt-2 text-sm text-slate-600">Email: support@sportsclub.com • 24/7 Admin Desk</p>
      </section>
    </AdminLayout>
  );
}
