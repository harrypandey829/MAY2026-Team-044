import { MessageSquareText, UserRound } from 'lucide-react';

interface Player {
  name: string;
  position: string;
  age: number;
  contact: string;
  attendance: number;
  status: 'Attending' | 'Maybe' | 'Not Attending';
  photo: string;
}

interface CoachRosterTableProps {
  players: Player[];
}

export default function CoachRosterTable({ players }: CoachRosterTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Player</th>
              <th className="px-4 py-3 font-semibold">Position</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Attendance</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.name} className="border-t border-slate-100 last:border-none">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-semibold text-white">
                      {player.photo}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{player.name}</p>
                      <p className="text-xs text-slate-500">#{player.contact}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{player.position}</td>
                <td className="px-4 py-3 text-slate-600">{player.age}</td>
                <td className="px-4 py-3 text-slate-600">{player.contact}</td>
                <td className="px-4 py-3 text-slate-600">{player.attendance}%</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${player.status === 'Attending' ? 'bg-pitch-100 text-pitch-700' : player.status === 'Maybe' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    {player.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100">
                      <UserRound className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100">
                      <MessageSquareText className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
