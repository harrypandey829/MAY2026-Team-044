import { useEffect, useState } from 'react';
import { Users, Eye, X, Phone, Mail, MapPin, Award } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import userService from '../../services/userService';
import authService, { AuthUser } from '../../services/authService';

export default function MyTeamPage() {
  const [coaches, setCoaches] = useState<AuthUser[]>([]);
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  const currentUser = authService.getCurrentUser();
  const coachSport = currentUser?.sport || 'Badminton';

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true);
        const [allCoaches, allMembers] = await Promise.all([
          userService.getByRole('Coach'),
          userService.getByRole('Member'),
        ]);

        const sportCoaches = allCoaches.filter(
          (c) => c.sport && c.sport.toLowerCase() === coachSport.toLowerCase()
        );
        const sportMembers = allMembers.filter(
          (m) => m.sport && m.sport.toLowerCase() === coachSport.toLowerCase()
        );

        setCoaches(sportCoaches);
        setMembers(sportMembers);
      } catch {
        setCoaches([]);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [coachSport]);

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Sport Roster: {coachSport}</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{coachSport} Team & Squad Roster</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Coaching staff and enrolled athletes strictly bound to the {coachSport} division.
          </p>
        </div>
      </section>

      {/* 1. COACHING STAFF SECTION */}
      <section className="mt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-100 p-2.5 text-brand-700"><Users className="h-5 w-5" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Coaching Staff ({coachSport})</h2>
            <p className="text-xs text-slate-500">Coaches assigned to {coachSport}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 py-6 text-center text-sm text-slate-500">Loading coaching staff...</p>
          ) : coaches.length === 0 ? (
            <p className="col-span-3 py-6 text-center text-sm text-slate-500">No coaches listed for {coachSport}</p>
          ) : (
            coaches.map((c) => (
              <div key={c.id} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 font-bold text-white text-base shadow-sm">
                    {c.first_name[0]}{c.last_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{c.first_name} {c.last_name}</h3>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">Coach ({coachSport})</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">{c.email}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(c)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 2. ENROLLED MEMBERS / ATHLETES SECTION */}
      <section className="mt-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700"><Award className="h-5 w-5" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Enrolled Athletes ({members.length})</h2>
            <p className="text-xs text-slate-500">Registered members in {coachSport}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 py-6 text-center text-sm text-slate-500">Loading squad members...</p>
          ) : members.length === 0 ? (
            <p className="col-span-3 py-6 text-center text-sm text-slate-500">No members currently enrolled in {coachSport}</p>
          ) : (
            members.map((m) => (
              <div key={m.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white text-base shadow-sm">
                    {m.first_name[0]}{m.last_name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{m.first_name} {m.last_name}</h3>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Athlete</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> {m.email}</p>
                  <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> {m.phone || '–'}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{m.status || 'Active'}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(m)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800"
                  >
                    <Eye className="h-3.5 w-3.5" /> Full Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-emerald-600 text-xl font-bold text-white">
                {selectedUser.first_name[0]}{selectedUser.last_name[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedUser.first_name} {selectedUser.last_name}</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{selectedUser.role} • {selectedUser.sport}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700 border border-slate-200/80">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Email:</span> {selectedUser.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Phone:</span> {selectedUser.phone || 'Not provided'}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Address:</span> {selectedUser.address || 'Main Sports Complex'}</p>
              <p className="flex items-center gap-2"><Award className="h-4 w-4 text-slate-500" /> <span className="font-semibold">Status:</span> {selectedUser.status || 'Active'}</p>
            </div>

            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </CoachPortalLayout>
  );
}
