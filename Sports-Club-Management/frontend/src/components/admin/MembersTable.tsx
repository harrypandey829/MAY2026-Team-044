import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Filter, Search } from 'lucide-react';
import userService from '../../services/userService';
import type { AuthUser } from '../../services/authService';

export default function MembersTable() {
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    userService.getByRole('Member')
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const fullName = `${m.first_name} ${m.last_name}`;
      const matchesQuery = `${fullName} ${m.email}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'All' || m.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [members, query, filter]);

  const pagedMembers = filteredMembers.slice((page - 1) * 5, page * 5);



  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Members</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">All members ({members.length})</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none" placeholder="Search" />
          </label>
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter className="h-4 w-4" />
            <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="bg-transparent outline-none">
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading members...</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Phone</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {pagedMembers.map((member) => (
                <tr key={member.id} className="border-b border-slate-100 last:border-none">
                  <td className="py-3 font-semibold text-slate-800">{member.first_name} {member.last_name}</td>
                  <td className="py-3 text-slate-600">{member.email}</td>
                  <td className="py-3 text-slate-600">{member.phone ?? '–'}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${member.is_approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">–</td>
                </tr>
              ))}
              {pagedMembers.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-500">No members found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <p>Showing {pagedMembers.length} of {filteredMembers.length} members</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-slate-200 px-3 py-1.5 font-semibold text-slate-700">Prev</button>
          <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page * 5 >= filteredMembers.length} className="rounded-full border border-slate-200 px-3 py-1.5 font-semibold text-slate-700">Next <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}
