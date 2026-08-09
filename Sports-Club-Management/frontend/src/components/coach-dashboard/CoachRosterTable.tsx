import { useState } from 'react';
import { Mail, MessageSquareText, Phone, ShieldCheck, UserRound, X } from 'lucide-react';
import type { AuthUser } from '../../services/authService';

interface CoachRosterTableProps {
  members: AuthUser[];
  onSelectMember?: (member: AuthUser) => void;
}

export default function CoachRosterTable({ members, onSelectMember }: CoachRosterTableProps) {
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  function getInitials(m: AuthUser) {
    const f = m.first_name?.[0] || 'M';
    const l = m.last_name?.[0] || 'A';
    return `${f}${l}`.toUpperCase();
  }

  function handleViewProfile(m: AuthUser) {
    if (onSelectMember) {
      onSelectMember(m);
    } else {
      setSelectedUser(m);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Athlete Name</th>
                <th className="px-4 py-3 font-semibold">Enrolled Sport</th>
                <th className="px-4 py-3 font-semibold">Contact Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No active members found in team database.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-semibold text-white shadow-sm">
                          {getInitials(member)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{member.first_name} {member.last_name}</p>
                          <p className="text-xs text-slate-500">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{member.sport || 'General Sports'}</td>
                    <td className="px-4 py-3 text-slate-600">{member.email}</td>
                    <td className="px-4 py-3 text-slate-600">{member.phone || '–'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {member.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          title="View Athlete Profile"
                          onClick={() => handleViewProfile(member)}
                          className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          <UserRound className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Contact Athlete"
                          onClick={() => window.open(`mailto:${member.email}`)}
                          className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                        >
                          <MessageSquareText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <ShieldCheck className="h-5 w-5 text-emerald-600" /> Athlete Profile
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 text-xl font-bold text-white shadow-md">
                {getInitials(selectedUser)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedUser.first_name} {selectedUser.last_name}</h3>
                <p className="text-sm font-semibold text-brand-700">{selectedUser.sport || 'General Athlete'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-600" /> {selectedUser.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-600" /> {selectedUser.phone || 'No phone registered'}</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-600" /> Status: <span className="font-semibold text-emerald-700">{selectedUser.status}</span></div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
