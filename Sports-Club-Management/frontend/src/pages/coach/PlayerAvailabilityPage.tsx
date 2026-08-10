import { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import userService from '../../services/userService';
import authService, { type AuthUser } from '../../services/authService';

export default function PlayerAvailabilityPage() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, 'Available' | 'Injured' | 'Resting'>>({});

  useEffect(() => {
    userService.getByRole('Member')
      .then((data) => {
        setMembers(data);
        const map: Record<string, 'Available' | 'Injured' | 'Resting'> = {};
        data.forEach((m, idx) => {
          map[m.id] = idx % 5 === 4 ? 'Injured' : idx % 3 === 2 ? 'Resting' : 'Available';
        });
        setAvailabilityMap(map);
      })
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  function toggleStatus(id: string, status: 'Available' | 'Injured' | 'Resting') {
    setAvailabilityMap((prev) => ({ ...prev, [id]: status }));
  }

  const currentUser = authService.getCurrentUser();
  const coachSport = (currentUser?.sport || 'Football').toLowerCase();

  const filteredMembers = members
    .filter((m) => !m.sport || m.sport.toLowerCase().includes(coachSport) || coachSport.includes(m.sport.toLowerCase()))
    .filter((m) => `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase()));

  const availableCount = Object.values(availabilityMap).filter((s) => s === 'Available').length;
  const injuredCount = Object.values(availabilityMap).filter((s) => s === 'Injured').length;
  const restingCount = Object.values(availabilityMap).filter((s) => s === 'Resting').length;

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Player Availability</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Track athlete game-readiness, injury status, and squad availability for match selection.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Availability Summary</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Roster Readiness</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ['Available', String(availableCount)],
              ['Injured', String(injuredCount)],
              ['Resting', String(restingCount)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Availability statuses guide tactical planning and match lineup selection.</div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Filter Roster</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Search Athlete</h2>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Search athlete by name or email" />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Player Status</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Live Squad Availability</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading availability...</p>
          ) : filteredMembers.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No athletes found</p>
          ) : (
            filteredMembers.map((m) => {
              const currentStatus = availabilityMap[m.id] || 'Available';
              return (
                <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{m.first_name} {m.last_name}</p>
                    <p className="mt-1 text-sm text-slate-600">{m.sport || 'Athlete'} • {m.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStatus(m.id, 'Available')}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        currentStatus === 'Available' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(m.id, 'Injured')}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        currentStatus === 'Injured' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Injured
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(m.id, 'Resting')}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                        currentStatus === 'Resting' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Resting
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </CoachPortalLayout>
  );
}
