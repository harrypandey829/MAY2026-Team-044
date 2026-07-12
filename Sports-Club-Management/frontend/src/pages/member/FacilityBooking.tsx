import { CalendarDays, MapPin, Search, Sparkles, XCircle } from 'lucide-react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';

const facilities = [
  { name: 'Football Ground', type: 'Outdoor', available: '2 slots today' },
  { name: 'Cricket Pitch', type: 'Outdoor', available: '1 slot today' },
  { name: 'Swimming Pool', type: 'Indoor', available: '3 slots today' },
  { name: 'Badminton Court', type: 'Indoor', available: '4 slots today' },
  { name: 'Tennis Court', type: 'Outdoor', available: '2 slots today' },
];

const bookings = [
  { title: 'Football Ground', date: 'Fri, Jul 12 · 18:00', status: 'Confirmed' },
  { title: 'Swimming Pool', date: 'Sun, Jul 14 · 09:00', status: 'Pending' },
];

export default function FacilityBookingPage() {
  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Facility Booking</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Reserve your preferred spaces, review upcoming bookings, and manage your facility schedule with ease.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Available facilities" subtitle="Reserve now">
          <div className="grid gap-3 md:grid-cols-2">
            {facilities.map((facility) => (
              <div key={facility.name} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{facility.name}</p>
                    <p className="text-sm text-slate-500">{facility.type}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">Open</span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{facility.available}</p>
                <button type="button" className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white">Book</button>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="Booking history" subtitle="Manage reservations">
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.title} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{booking.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{booking.date}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{booking.status}</span>
                </div>
                <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <XCircle className="h-4 w-4" /> Cancel Booking
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Search className="h-4 w-4 text-brand-600" /> Booking calendar updates are shared with your coach automatically.</div>
          </div>
        </PageCard>
      </div>

      <PageCard title="Calendar" subtitle="Upcoming schedule">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { day: 'Thu', detail: 'Badminton Court · 18:30' },
            { day: 'Fri', detail: 'Football Ground · 19:00' },
            { day: 'Sun', detail: 'Swimming Pool · 09:00' },
          ].map((item) => (
            <div key={item.day} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center gap-2 text-brand-700"><CalendarDays className="h-4 w-4" /> {item.day}</div>
              <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </PageCard>
    </MemberLayout>
  );
}
