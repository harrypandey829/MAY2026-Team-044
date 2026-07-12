import { CalendarDays, Clock3, TrendingUp } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const monthlyAttendance = [91, 88, 94, 90, 92];
const yearlyAttendance = [76, 80, 82, 86, 89, 92];

export default function AttendancePage() {
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
          <div className="rounded-[1.5rem] border border-slate-200/70 bg-gradient-to-br from-sky-50 to-emerald-50 p-5">
            <p className="text-sm text-slate-600">Attendance percentage</p>
            <p className="mt-2 text-4xl font-semibold text-slate-900">92%</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-white/70 bg-white/70 p-4">
                <p className="text-sm text-slate-500">Practice attendance</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">24/26</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/70 bg-white/70 p-4">
                <p className="text-sm text-slate-500">Match attendance</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">8/9</p>
              </div>
            </div>
          </div>
        </PageCard>

        <PageCard title="Attendance graph" subtitle="Monthly trend">
          <div className="flex h-40 items-end gap-3 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
            {monthlyAttendance.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end rounded-full bg-slate-200 p-1">
                  <div className="w-full rounded-full bg-gradient-to-t from-brand-500 to-emerald-500" style={{ height: `${value}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-500">W{index + 1}</span>
              </div>
            ))}
          </div>
        </PageCard>
      </div>

      <PageCard title="Calendar" subtitle="Attendance highlights">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: 'Attendance calendar', detail: 'All sessions are visible for the next 30 days', icon: CalendarDays },
            { label: 'Monthly attendance', detail: 'Weekly consistency is above your target', icon: TrendingUp },
            { label: 'Yearly attendance', detail: 'You have improved steadily across the season', icon: Clock3 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2 text-brand-700"><Icon className="h-4 w-4" /> {item.label}</div>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
          <p className="text-sm text-slate-600">Yearly attendance trend</p>
          <div className="mt-3 flex h-28 items-end gap-3">
            {yearlyAttendance.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end rounded-full bg-slate-200 p-1">
                  <div className="w-full rounded-full bg-gradient-to-t from-brand-500 to-emerald-500" style={{ height: `${value}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-500">{2020 + index}</span>
              </div>
            ))}
          </div>
        </div>
      </PageCard>
    </MemberLayout>
  );
}
