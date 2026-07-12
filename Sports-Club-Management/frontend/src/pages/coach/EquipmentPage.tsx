import { BookOpen, Sparkles } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';

const equipment = [
  { name: 'Footballs', status: 'Available', booking: 'Ready' },
  { name: 'Cricket Kits', status: 'Booked', booking: 'In use' },
  { name: 'Badminton Rackets', status: 'Available', booking: 'Ready' },
  { name: 'Swimming Equipment', status: 'Pending', booking: 'Review' },
];

export default function EquipmentPage() {
  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Equipment Booking</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Track equipment demand, booking status, and damage reports across training sessions and match days.</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Available Equipment</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Inventory overview</h2>
            </div>
            <button type="button" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Request Equipment</button>
          </div>
          <div className="mt-5 grid gap-3">
            {equipment.map((item) => (
              <div key={item.name} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-600">Booking: {item.booking}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Current Bookings</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Booking history</h2>
            </div>
            <BookOpen className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 grid gap-3">
            {['Cancel Booking', 'Report Damage', 'Reserve Facility'].map((action) => (
              <button key={action} type="button" className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-slate-700">{action}</button>
            ))}
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> Equipment requests are tracked centrally so the coaching team can keep training logistics smooth.</div></div>
        </div>
      </section>
    </CoachPortalLayout>
  );
}
