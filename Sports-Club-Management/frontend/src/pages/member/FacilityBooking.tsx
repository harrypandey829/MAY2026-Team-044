import { useEffect, useState } from 'react';
import MemberLayout from '../../components/member/MemberLayout';
import PageCard from '../../components/member/PageCard';
import resourceService, { resourceBookingService, type Resource, type ResourceBooking } from '../../services/resourceService';
import authService from '../../services/authService';

export default function FacilityBookingPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<ResourceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = authService.getCurrentUser();

  function loadData() {
    setLoading(true);
    Promise.all([resourceService.getAll(), resourceBookingService.getAll()])
      .then(([res, bkgs]) => {
        setResources(res);
        if (user) {
          setBookings(bkgs.filter((b) => b.member_id === user.id && !b.is_cancelled));
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
    window.addEventListener('resource_booking_updated', loadData);
    return () => window.removeEventListener('resource_booking_updated', loadData);
  }, []);

  async function handleBook(resource: Resource) {
    if (!user) return;
    setBooking(resource.id);
    setError(null);
    setSuccess(null);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const newBooking = await resourceBookingService.create({
        resource_id: resource.id,
        member_id: user.id,
        booking_date: tomorrow.toISOString(),
        duration_hours: 1,
      });
      setBookings((prev) => [...prev, newBooking]);
      setSuccess(`Booking request for ${resource.name} submitted! Awaiting coach approval.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBooking(null);
    }
  }

  async function handleCancel(b: ResourceBooking) {
    try {
      await resourceBookingService.cancel(b.id, b);
      setBookings((prev) => prev.filter((x) => x.id !== b.id));
    } catch {
      setError('Failed to cancel booking');
    }
  }

  const facilities = resources.filter((r) => r.resource_type === 'Facility');
  const equipment = resources.filter((r) => r.resource_type === 'Equipment');

  function getStatusBadge(status?: string) {
    if (status === 'Confirmed') {
      return <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">Confirmed</span>;
    }
    if (status === 'Rejected') {
      return <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700">Rejected</span>;
    }
    return <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-700">Pending Coach Approval</span>;
  }

  return (
    <MemberLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Facility Booking</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Reserve your preferred spaces and equipment. Booking requests are reviewed and approved by game coaches.</p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <PageCard title="Available facilities" subtitle={loading ? 'Loading...' : `${facilities.length} facilities`}>
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading resources...</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {facilities.map((facility) => (
                <div key={facility.id} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{facility.name}</p>
                      <p className="text-sm text-slate-500">{facility.resource_type}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${facility.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {facility.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Capacity: {facility.quantity}</p>
                  {facility.is_available && (
                    <button
                      type="button"
                      disabled={booking === facility.id}
                      onClick={() => handleBook(facility)}
                      className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                    >
                      {booking === facility.id ? 'Requesting...' : 'Book Facility'}
                    </button>
                  )}
                </div>
              ))}
              {equipment.map((eq) => (
                <div key={eq.id} className="rounded-[1.4rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{eq.name}</p>
                      <p className="text-sm text-slate-500">{eq.resource_type}</p>
                    </div>
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">{eq.quantity} units</span>
                  </div>
                  {eq.is_available && (
                    <button
                      type="button"
                      disabled={booking === eq.id}
                      onClick={() => handleBook(eq)}
                      className="mt-4 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                    >
                      {booking === eq.id ? 'Reserving...' : 'Reserve Equipment'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </PageCard>

        <PageCard title="My bookings" subtitle={`${bookings.length} active`}>
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading...</p>
          ) : bookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No active bookings</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
                const resource = resources.find((r) => r.id === b.resource_id);
                const displayDate = b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Upcoming';
                return (
                  <div key={b.id} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{resource?.name ?? 'Facility Booking'}</p>
                        <p className="mt-1 text-sm text-slate-500">{displayDate} · {b.duration_hours}h duration</p>
                      </div>
                      {getStatusBadge(b.approval_status)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancel(b)}
                      className="mt-3 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </PageCard>
      </div>
    </MemberLayout>
  );
}
