import { ArrowRight, BadgeDollarSign, BarChart3, BellRing, CalendarDays, Camera, ChevronRight, CircleDollarSign, Clock3, CreditCard, FileSpreadsheet, FileText, FolderKanban, GraduationCap, LayoutGrid, Megaphone, PencilLine, Printer, Search, Settings, ShieldCheck, Sparkles, Trophy, UserCircle2, Users, Waves } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import LostAndFoundContent from '../../components/lost-and-found/LostAndFoundContent';

function PageHeader({ title, subtitle, badge = 'Club Operations' }: { title: string; subtitle: string; badge?: string }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Owner Portal</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">{subtitle}</p>
        </div>
        <div className="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-brand-700">{badge}</div>
      </div>
    </section>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/70 bg-white/85 p-4 shadow-sm shadow-sky-100/70">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-brand-700">{detail}</p>
    </div>
  );
}

function ActionButton({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' }) {
  return (
    <button
      type="button"
      className={variant === 'primary' ? 'rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700'}
    >
      {label}
    </button>
  );
}

export function MembersPage() {
  const members = [
    { id: 'MB-1042', name: 'Ava Reynolds', sport: 'Football', team: 'Senior Lions', status: 'Active', attendance: '96%', payment: 'Paid' },
    { id: 'MB-1045', name: 'Liam Chen', sport: 'Cricket', team: 'North Stars', status: 'Pending', attendance: '84%', payment: 'Pending' },
    { id: 'MB-1051', name: 'Sofia Alvarez', sport: 'Badminton', team: 'Racers', status: 'Expired', attendance: '72%', payment: 'Overdue' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Members" subtitle="Monitor member health, approvals, renewals, and attendance across the club." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Members" value="2,840" detail="+12% this quarter" />
        <StatCard label="Pending Approvals" value="24" detail="Needs review" />
        <StatCard label="Active Members" value="2,612" detail="91.9% retention" />
        <StatCard label="Expired Memberships" value="88" detail="3.1% of roster" />
      </div>
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Approve" />
            <ActionButton label="Reject" variant="secondary" />
            <ActionButton label="View Profile" variant="secondary" />
            <ActionButton label="Edit Member" variant="secondary" />
            <ActionButton label="Suspend Member" variant="secondary" />
            <ActionButton label="Delete Member" variant="secondary" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
              <Search className="h-4 w-4" />
              <input className="w-36 bg-transparent outline-none" placeholder="Search" />
            </label>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">Filter</button>
          </div>
        </div>
        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Member ID</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Sport</th>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Membership Status</th>
                <th className="px-4 py-3 font-semibold">Attendance %</th>
                <th className="px-4 py-3 font-semibold">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-3 font-semibold">{member.id}</td>
                  <td className="px-4 py-3">{member.name}</td>
                  <td className="px-4 py-3">{member.sport}</td>
                  <td className="px-4 py-3">{member.team}</td>
                  <td className="px-4 py-3">{member.status}</td>
                  <td className="px-4 py-3">{member.attendance}</td>
                  <td className="px-4 py-3">{member.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Showing 1-3 of 24 members</span>
          <div className="flex gap-2">
            <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2">Previous</button>
            <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2">Next</button>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export function CoachesPage() {
  const coaches = [
    { name: 'Maya Patel', sport: 'Swimming', team: 'Aquatic Squad', experience: '8 years', status: 'Active' },
    { name: 'Daniel Brooks', sport: 'Football', team: 'Senior Lions', experience: '12 years', status: 'Assigned' },
    { name: 'Rosa Kim', sport: 'Badminton', team: 'Racers', experience: '6 years', status: 'On leave' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Coaches" subtitle="Track coaching assignments, experience levels, and team coverage across all sports." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Coaches" value="18" detail="Across 5 sports" />
        <StatCard label="Assigned Sports" value="5" detail="Full coverage" />
        <StatCard label="Assigned Teams" value="14" detail="Active rosters" />
        <StatCard label="Experience" value="9.2 yrs" detail="Average tenure" />
      </div>
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap gap-2">
          <ActionButton label="Add Coach" />
          <ActionButton label="Edit Coach" variant="secondary" />
          <ActionButton label="Assign Team" variant="secondary" />
          <ActionButton label="Remove Coach" variant="secondary" />
          <ActionButton label="View Profile" variant="secondary" />
        </div>
        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Coach Name</th>
                <th className="px-4 py-3 font-semibold">Sport</th>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
              {coaches.map((coach) => (
                <tr key={coach.name}>
                  <td className="px-4 py-3 font-semibold">{coach.name}</td>
                  <td className="px-4 py-3">{coach.sport}</td>
                  <td className="px-4 py-3">{coach.team}</td>
                  <td className="px-4 py-3">{coach.experience}</td>
                  <td className="px-4 py-3">{coach.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export function SportsPage() {
  const sports = [
    { name: 'Football', members: '640', coaches: '4', teams: '3', events: '8' },
    { name: 'Cricket', members: '480', coaches: '3', teams: '2', events: '6' },
    { name: 'Badminton', members: '320', coaches: '3', teams: '2', events: '4' },
    { name: 'Swimming', members: '260', coaches: '4', teams: '2', events: '5' },
    { name: 'Tennis', members: '210', coaches: '2', teams: '1', events: '3' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Sports" subtitle="Manage sport-specific membership, coaching resources, teams, and events." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sports.map((sport) => (
          <div key={sport.name} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{sport.name}</p>
                <p className="text-sm text-slate-500">Club performance portfolio</p>
              </div>
              <div className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-brand-700">{sport.teams} teams</div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                <p className="text-sm text-slate-500">Total Members</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{sport.members}</p>
              </div>
              <div className="rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                <p className="text-sm text-slate-500">Total Coaches</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{sport.coaches}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>Upcoming events: {sport.events}</span>
              <div className="flex gap-2">
                <ActionButton label="Edit Sport" variant="secondary" />
                <ActionButton label="Manage Sport" variant="secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export function TeamsPage() {
  const teams = [
    { name: 'Senior Lions', sport: 'Football', coach: 'Daniel Brooks', captain: 'Nadia Green', players: '24', schedule: 'Training Mon/Wed' },
    { name: 'North Stars', sport: 'Cricket', coach: 'Asha Singh', captain: 'Rohan Das', players: '18', schedule: 'Practice Tue/Fri' },
    { name: 'Racers', sport: 'Badminton', coach: 'Rosa Kim', captain: 'Mina Park', players: '16', schedule: 'Sessions Daily' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Teams" subtitle="Coordinate team rosters, captains, coaches, and weekly training schedules." />
      <div className="flex flex-wrap gap-2">
        <ActionButton label="Create Team" />
        <ActionButton label="Assign Coach" variant="secondary" />
        <ActionButton label="Assign Players" variant="secondary" />
        <ActionButton label="Edit Team" variant="secondary" />
        <ActionButton label="Delete Team" variant="secondary" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {teams.map((team) => (
          <div key={team.name} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
            <p className="text-lg font-semibold text-slate-900">{team.name}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Sport:</span> {team.sport}</p>
              <p><span className="font-semibold text-slate-800">Coach:</span> {team.coach}</p>
              <p><span className="font-semibold text-slate-800">Captain:</span> {team.captain}</p>
              <p><span className="font-semibold text-slate-800">Players:</span> {team.players}</p>
              <p><span className="font-semibold text-slate-800">Schedule:</span> {team.schedule}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export function EventsPage() {
  const events = [
    { title: 'Morning Swim Clinic', type: 'Practice Session', date: '12 Jul' },
    { title: 'Summer Tournament', type: 'Tournament', date: '18 Jul' },
    { title: 'Junior Football Match', type: 'Match', date: '20 Jul' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Events" subtitle="Plan upcoming activities, review past sessions, and coordinate participation." />
      <div className="flex flex-wrap gap-2">
        <ActionButton label="Create Event" />
        <ActionButton label="Edit Event" variant="secondary" />
        <ActionButton label="Cancel Event" variant="secondary" />
        <ActionButton label="View Participants" variant="secondary" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-slate-900">Upcoming Events</p>
              <p className="text-sm text-slate-500">Live calendar overview</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Calendar View</div>
          </div>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div key={event.title} className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                <div>
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-500">{event.type}</p>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-brand-700">{event.date}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Monthly calendar</p>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm text-slate-500">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => <div key={day}>{day}</div>)}
            {Array.from({ length: 21 }).map((_, index) => (
              <div key={index} className={`rounded-full p-2 ${index === 5 || index === 10 || index === 16 ? 'bg-sky-100 text-brand-700' : 'bg-slate-50'}`}>{index + 1}</div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export function ResourcesPage() {
  const resources = [
    { name: 'Football Ground', status: 'Available', next: 'Booked 11:00' },
    { name: 'Cricket Pitch', status: 'Maintenance', next: 'Reopens 16:00' },
    { name: 'Swimming Pool', status: 'Available', next: 'Open for evening lanes' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Resources" subtitle="Track facilities, equipment inventory, maintenance needs, and booking requests." />
      <div className="flex flex-wrap gap-2">
        <ActionButton label="Add Resource" />
        <ActionButton label="Edit Resource" variant="secondary" />
        <ActionButton label="Approve Booking" variant="secondary" />
        <ActionButton label="Reject Booking" variant="secondary" />
        <ActionButton label="Mark Under Maintenance" variant="secondary" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {resources.map((resource) => (
          <div key={resource.name} className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
            <p className="text-lg font-semibold text-slate-900">{resource.name}</p>
            <p className="mt-2 text-sm text-slate-500">Status: {resource.status}</p>
            <p className="mt-2 text-sm text-brand-700">{resource.next}</p>
          </div>
        ))}
      </div>
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
        <p className="text-lg font-semibold text-slate-900">Booking requests</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600">
            <span>Swimming Pool • Evening lane booking</span>
            <span className="font-semibold text-brand-700">Pending</span>
          </div>
          <div className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600">
            <span>Badminton Courts • Tournament warmup</span>
            <span className="font-semibold text-brand-700">Approved</span>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export function MembershipFeesPage() {
  return (
    <AdminLayout>
      <PageHeader title="Membership Fees" subtitle="Review membership plans, fee structure, renewals, and pending discount approvals." />
      <div className="flex flex-wrap gap-2">
        <ActionButton label="Create Plan" />
        <ActionButton label="Edit Plan" variant="secondary" />
        <ActionButton label="Delete Plan" variant="secondary" />
        <ActionButton label="Approve Renewal" variant="secondary" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Basic</p>
          <p className="mt-2 text-sm text-slate-500">$35/month</p>
          <p className="mt-4 text-sm text-slate-600">Access to club facilities and public training sessions.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Premium</p>
          <p className="mt-2 text-sm text-slate-500">$72/month</p>
          <p className="mt-4 text-sm text-slate-600">Includes premium coaching, event access, and priority booking.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Family</p>
          <p className="mt-2 text-sm text-slate-500">$95/month</p>
          <p className="mt-4 text-sm text-slate-600">Covers multiple members and family-friendly training slots.</p>
        </div>
      </div>
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
        <p className="text-lg font-semibold text-slate-900">Pending renewals</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600">
            <span>Family Package • 6 accounts</span>
            <span className="font-semibold text-brand-700">Due 14 Jul</span>
          </div>
          <div className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600">
            <span>Premium Membership • 1 renewal</span>
            <span className="font-semibold text-brand-700">Needs approval</span>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export function PaymentsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Payments" subtitle="Review revenue health, payment issues, invoices, and refund requests." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Revenue Overview" value="$84.2k" detail="+8.4% vs last month" />
        <StatCard label="Pending Payments" value="37" detail="Needs follow-up" />
        <StatCard label="Successful Payments" value="1,420" detail="98.2% completion" />
        <StatCard label="Failed Payments" value="14" detail="1.0% of volume" />
      </div>
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <ActionButton label="View Invoice" variant="secondary" />
          <ActionButton label="Download Invoice" variant="secondary" />
          <ActionButton label="Send Reminder" variant="secondary" />
          <ActionButton label="Refund Payment" variant="secondary" />
        </div>
        <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-200/70">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50/80 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Invoice</th>
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80 text-slate-700">
              <tr><td className="px-4 py-3">INV-2049</td><td className="px-4 py-3">Sofia Alvarez</td><td className="px-4 py-3">$72</td><td className="px-4 py-3">Successful</td></tr>
              <tr><td className="px-4 py-3">INV-2050</td><td className="px-4 py-3">Liam Chen</td><td className="px-4 py-3">$35</td><td className="px-4 py-3">Pending</td></tr>
              <tr><td className="px-4 py-3">INV-2051</td><td className="px-4 py-3">Noah Brooks</td><td className="px-4 py-3">$95</td><td className="px-4 py-3">Failed</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export function AnnouncementsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Announcements" subtitle="Publish club-wide updates, schedule communications, and manage drafts and audience segments." />
      <div className="flex flex-wrap gap-2">
        <ActionButton label="Create Announcement" />
        <ActionButton label="Edit" variant="secondary" />
        <ActionButton label="Delete" variant="secondary" />
        <ActionButton label="Publish" variant="secondary" />
        <ActionButton label="Schedule" variant="secondary" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Recent announcements</p>
          <p className="mt-3 text-sm text-slate-600">New swim lane booking rules were published to all members.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Scheduled announcements</p>
          <p className="mt-3 text-sm text-slate-600">Summer tournament reminders will go live on Friday at 9:00 AM.</p>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Draft announcements</p>
          <p className="mt-3 text-sm text-slate-600">Coach mentoring session reminder is ready for review.</p>
        </div>
      </div>
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
        <p className="text-lg font-semibold text-slate-900">Audience</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-sky-50 px-3 py-2">Members</span>
          <span className="rounded-full bg-sky-50 px-3 py-2">Coaches</span>
          <span className="rounded-full bg-sky-50 px-3 py-2">Entire Club</span>
        </div>
      </section>
    </AdminLayout>
  );
}

export function ReportsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Reports" subtitle="Review club analytics, participation, performance, and facility trends with export-ready reporting." />
      <div className="flex flex-wrap gap-2">
        <ActionButton label="Export PDF" />
        <ActionButton label="Export Excel" variant="secondary" />
        <ActionButton label="Print Report" variant="secondary" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Dashboard analytics</p>
          <div className="mt-4 flex h-40 items-end gap-3">
            {[35, 55, 78, 64, 92].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-[0.8rem] bg-gradient-to-t from-brand-500 to-emerald-400" style={{ height: `${height}%` }} />
            ))}
          </div>
        </section>
        <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70">
          <p className="text-lg font-semibold text-slate-900">Sport-wise participation</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {['Football', 'Cricket', 'Swimming', 'Badminton', 'Tennis'].map((sport) => (
              <div key={sport} className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50/80 p-3">
                <span>{sport}</span>
                <span className="font-semibold text-brand-700">High</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export function LostAndFoundAdminPage() {
  return (
    <AdminLayout>
      <LostAndFoundContent variant="admin" />
    </AdminLayout>
  );
}

export function SettingsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Settings" subtitle="Adjust club information, memberships, notifications, and portal preferences." />
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <ActionButton label="Save Changes" />
          <ActionButton label="Cancel" variant="secondary" />
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Club Name</span>
            <input defaultValue="Northstar Sports Club" className="w-full bg-transparent outline-none" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Email</span>
            <input defaultValue="admin@northstarsports.com" className="w-full bg-transparent outline-none" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Phone Number</span>
            <input defaultValue="+1 555 012 3456" className="w-full bg-transparent outline-none" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Operating Hours</span>
            <input defaultValue="06:00 - 22:00" className="w-full bg-transparent outline-none" />
          </label>
        </div>
      </section>
    </AdminLayout>
  );
}

export function ProfilePage() {
  return (
    <AdminLayout>
      <PageHeader title="My Profile" subtitle="Your owner account details, club affiliation, and access permissions." />
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white">AL</div>
            <div>
              <p className="text-xl font-semibold text-slate-900">Alex Lewis</p>
              <p className="text-sm text-slate-500">Club Owner • Northstar Sports Club</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Edit Profile" />
            <ActionButton label="Change Password" variant="secondary" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Email</p>
            <p className="mt-2 font-semibold text-slate-800">alex@northstarsports.com</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Phone</p>
            <p className="mt-2 font-semibold text-slate-800">+1 555 012 3456</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Role</p>
            <p className="mt-2 font-semibold text-slate-800">Administrator</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Club Name</p>
            <p className="mt-2 font-semibold text-slate-800">Northstar Sports Club</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Address</p>
            <p className="mt-2 font-semibold text-slate-800">185 Harbor Street, Seattle</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Date Joined</p>
            <p className="mt-2 font-semibold text-slate-800">12 Jan 2023</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export function EditProfilePage() {
  return (
    <AdminLayout>
      <PageHeader title="Edit Profile" subtitle="Update your personal contact details and club information while keeping your email address read-only." />
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-2xl font-semibold text-white">AL</div>
            <button type="button" className="absolute bottom-0 right-0 rounded-full border border-white bg-white p-2 text-brand-600 shadow-sm">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Alex Lewis</p>
            <p className="text-sm text-slate-500">Update your owner profile details</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Name</span>
            <input defaultValue="Alex Lewis" className="w-full bg-transparent outline-none" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Phone</span>
            <input defaultValue="+1 555 012 3456" className="w-full bg-transparent outline-none" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600 md:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Address</span>
            <input defaultValue="185 Harbor Street, Seattle" className="w-full bg-transparent outline-none" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Club Name</span>
            <input defaultValue="Northstar Sports Club" className="w-full bg-transparent outline-none" />
          </label>
          <label className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Email</span>
            <input defaultValue="alex@northstarsports.com" readOnly className="w-full bg-transparent outline-none" />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <ActionButton label="Save" />
          <ActionButton label="Cancel" variant="secondary" />
        </div>
      </section>
    </AdminLayout>
  );
}

export function HelpPage() {
  return (
    <AdminLayout>
      <PageHeader title="Help & Support" subtitle="Connect with the club operations team for assistance, troubleshooting, or training."></PageHeader>
      <section className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-sky-100/70 sm:p-6">
        <p className="text-lg font-semibold text-slate-900">Support options</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Live support</p>
            <p className="mt-2 text-sm text-slate-600">Available 07:00–22:00 for urgent portal issues.</p>
          </div>
          <div className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
            <p className="font-semibold text-slate-900">Email support</p>
            <p className="mt-2 text-sm text-slate-600">support@northstarsports.com</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
