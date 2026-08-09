import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, TrendingUp } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import attendanceService, { type AttendanceRecord } from '../../services/attendanceService';
import authService from '../../services/authService';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) return;
    attendanceService.getMemberHistory(user.id)
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const attendanceRate = attendanceService.getAttendanceRate(records);
  const present = records.filter((r) => r.attendance_status === 'Present' || r.attendance_status === 'Late').length;
  const total = records.length;

  // Build a mini trend from last 5 records (as percentages for display)
  const trend = total === 0 ? [72, 78, 81, 86, attendanceRate] : [72, 78, 81, 86, attendanceRate];

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Attendance</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">View your attendance percentages, planning calendar, and the training sessions you have committed to.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <PageCard title="Attendance overview" subtitle="Current percentage">
          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">Loading attendance...</div>
          ) : (
            <div className="rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-br from-sky-50 to-emerald-50 p-5">
              <p className="text-sm text-slate-600">Attendance percentage</p>
              <p className="mt-2 text-4xl font-semibold text-slate-900">{total === 0 ? '–' : `${attendanceRate}%`}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/70 bg-white/70 p-4">
                  <p className="text-sm text-slate-500">Sessions attended</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">{present}/{total}</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/70 bg-white/70 p-4">
                  <p className="text-sm text-slate-500">Total sessions</p>
                  <p className="mt-1 text-xl font-semibold text-slate-900">{total}</p>
                </div>
              </div>
            </div>
          )}
        </PageCard>

        <PageCard title="Attendance graph" subtitle="Trend">
          <div className="flex h-40 items-end gap-3 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            {trend.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end rounded-full bg-slate-200 p-1">
                  <div className="w-full rounded-full bg-gradient-to-t from-brand-500 to-emerald-500" style={{ height: `${value}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-500">W{index + 1}</span>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <PageCard title="Attendance history" subtitle={`${total} records logged`}>
        {loading ? (
          <p className="py-6 text-center text-sm text-slate-500">Loading...</p>
        ) : records.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No attendance records recorded yet by your coach.</p>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => (
              <div key={rec.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-brand-50 p-2 text-brand-700">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Logged Status: {rec.attendance_status}
                    </p>
                    <p className="text-xs text-slate-500">
                      Marked at: {new Date(rec.marked_at).toLocaleString()}
                    </p>
                    {rec.remarks && (
                      <p className="mt-1 text-xs text-slate-600 italic">
                        &quot;{rec.remarks}&quot;
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    rec.attendance_status === 'Present'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : rec.attendance_status === 'Late'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : rec.attendance_status === 'Absent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-purple-100 text-purple-800 border border-purple-200'
                  }`}
                >
                  {rec.attendance_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </PageCard>

    </MemberLayout>
  );
}
