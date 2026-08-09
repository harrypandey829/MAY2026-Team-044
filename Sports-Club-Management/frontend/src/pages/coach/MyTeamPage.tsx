import { useEffect, useState } from 'react';
import { Search, Sparkles, Users } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import userService from '../../services/userService';
import authService from '../../services/authService';
import type { AuthUser } from '../../services/authService';

export default function MyTeamPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    userService.getByRole('Member')
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const coachSport = (user?.sport || 'Football').toLowerCase();
  const filtered = members
    .filter((m) => !m.sport || m.sport.toLowerCase().includes(coachSport) || coachSport.includes(m.sport.toLowerCase()))
    .filter((m) => `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">My Team</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Manage the full roster, monitor player readiness, and stay aligned with the coaching staff.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-brand-700"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Snapshot</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Club Members</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Head Coach', user ? `${user.first_name} ${user.last_name}` : '–'],
              ['Assigned Sport', user?.sport || 'Football'],
              [`Total Squad (${user?.sport || 'Football'})`, loading ? '…' : String(filtered.length)],
              ['Active Squad Athletes', loading ? '…' : String(filtered.filter((m) => m.status === 'Active').length)],
              ['Total Club Members', loading ? '…' : String(members.length)],
              ['Other Sports Members', loading ? '…' : String(Math.max(0, members.length - filtered.length))],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Profiles</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Search members</h2>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Use the roster below to review member profiles and status.</div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Roster</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Member list</h2>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading members...</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No members found</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 last:border-none">
                    <td className="py-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-xs font-bold text-white">
                          {m.first_name[0]}{m.last_name[0]}
                        </div>
                        {m.first_name} {m.last_name}
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">{m.email}</td>
                    <td className="py-3 text-slate-600">{m.phone ?? '–'}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </CoachPortalLayout>
  );
}
