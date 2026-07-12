import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Filter, Search, XCircle } from 'lucide-react';

interface MemberRow {
  name: string;
  sport: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const members: MemberRow[] = [
  { name: 'Mina Patel', sport: 'Badminton', date: '24 Jun 2026', status: 'Pending' },
  { name: 'Daniel Lewis', sport: 'Football', date: '22 Jun 2026', status: 'Approved' },
  { name: 'Sara Noor', sport: 'Swimming', date: '21 Jun 2026', status: 'Pending' },
  { name: 'Omar Haddad', sport: 'Tennis', date: '20 Jun 2026', status: 'Rejected' },
  { name: 'Nadia Chen', sport: 'Cricket', date: '19 Jun 2026', status: 'Approved' },
  { name: 'Noah Grant', sport: 'Football', date: '18 Jun 2026', status: 'Pending' },
];

export default function MembersTable() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | MemberRow['status']>('All');
  const [page, setPage] = useState(1);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesQuery = `${member.name} ${member.sport}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'All' || member.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const pagedMembers = filteredMembers.slice((page - 1) * 5, page * 5);

  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Recent Registrations</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">New member approvals</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent outline-none" placeholder="Search" />
          </label>
          <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter className="h-4 w-4" />
            <select value={filter} onChange={(e) => setFilter(e.target.value as 'All' | MemberRow['status'])} className="bg-transparent outline-none">
              <option value="All">All statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 font-semibold">Member Name</th>
              <th className="pb-3 font-semibold">Sport</th>
              <th className="pb-3 font-semibold">Registration Date</th>
              <th className="pb-3 font-semibold">Membership Status</th>
              <th className="pb-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedMembers.map((member) => (
              <tr key={member.name} className="border-b border-slate-100 last:border-none">
                <td className="py-3 font-semibold text-slate-800">{member.name}</td>
                <td className="py-3 text-slate-600">{member.sport}</td>
                <td className="py-3 text-slate-600">{member.date}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${member.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : member.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                    {member.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Approve</button>
                    <button type="button" className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">Reject</button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">View Profile</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <p>Showing {Math.min(filteredMembers.length, 5)} of {filteredMembers.length} requests</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-slate-200 px-3 py-1.5 font-semibold text-slate-700">Prev</button>
          <button type="button" onClick={() => setPage((p) => p + 1)} className="rounded-full border border-slate-200 px-3 py-1.5 font-semibold text-slate-700">Next <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}
