import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Plus, Sparkles, X, Check, XCircle } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import resourceService, { resourceBookingService, type Resource, type ResourceBooking } from '../../services/resourceService';
import authService from '../../services/authService';

export default function EquipmentPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<ResourceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal State
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);

  const user = authService.getCurrentUser();

  function loadData() {
    setLoading(true);
    Promise.all([resourceService.getAll(), resourceBookingService.getAll()])
      .then(([resList, bkgList]) => {
        setResources(resList);
        setBookings(bkgList.filter((b) => !b.is_cancelled));
        if (resList.length > 0) setSelectedResourceId(resList[0].id);
      })
      .catch(() => {
        setResources([]);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
    window.addEventListener('resource_booking_updated', loadData);
    return () => window.removeEventListener('resource_booking_updated', loadData);
  }, []);

  async function handleReserveResource(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedResourceId) return;
    setFeedback(null);
    try {
      await resourceBookingService.create({
        resource_id: selectedResourceId,
        member_id: user.id,
        booking_date: bookingDate,
        duration_hours: 2,
      });
      setIsReserveOpen(false);
      setFeedback('Resource booking submitted successfully!');
      loadData();
    } catch {
      alert('Failed to reserve equipment / facility');
    }
  }

  async function handleApprove(bookingId: string) {
    await resourceBookingService.updateApprovalStatus(bookingId, 'Confirmed');
    setFeedback('Member facility booking request approved & confirmed!');
    loadData();
  }

  async function handleReject(bookingId: string) {
    await resourceBookingService.updateApprovalStatus(bookingId, 'Rejected');
    setFeedback('Member facility booking request rejected.');
    loadData();
  }

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Facility & Equipment Approval</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Review member facility booking requests, approve arena reservations, and manage team equipment inventory.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsReserveOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Reserve Resource
          </button>
        </div>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4 text-emerald-700" /></button>
        </div>
      )}

      {/* Member Facility Booking Requests Section */}
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Pending Approvals</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Member Facility Booking Requests</h2>
          </div>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
            {bookings.filter((b) => b.approval_status === 'Pending Coach Approval').length} Pending
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading booking requests...</p>
          ) : bookings.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No member facility booking requests at this time.</p>
          ) : (
            bookings.map((b) => {
              const resName = resources.find((r) => r.id === b.resource_id)?.name || 'Facility Arena';
              const displayDate = b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming';

              return (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{resName}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          b.approval_status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.approval_status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {b.approval_status || 'Pending Coach Approval'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Requested for Date: {displayDate} · Duration: {b.duration_hours}h</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {b.approval_status !== 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(b.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5" /> Confirm & Approve
                      </button>
                    )}
                    {b.approval_status !== 'Rejected' && (
                      <button
                        type="button"
                        onClick={() => handleReject(b.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr] mt-4">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Inventory & Arenas</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Available Club Resources</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {loading ? (
              <p className="py-6 text-center text-sm text-slate-500">Loading resources...</p>
            ) : resources.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No resources available</p>
            ) : (
              resources.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.resource_type} • Quantity: {item.quantity}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedResourceId(item.id);
                      setIsReserveOpen(true);
                    }}
                    className="rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                  >
                    Reserve Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Booking Info</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Resource Logistics</h2>
            </div>
            <BookOpen className="h-5 w-5 text-brand-600" />
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4 font-medium text-slate-800">
              Coaches review all member facility requests. Approved bookings appear as confirmed in the member schedule.
            </p>
          </div>
          <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-600" /> All equipment bookings are logged in real time for facility coordination.</div>
          </div>
        </div>
      </section>

      {/* Reserve Resource Modal */}
      {isReserveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <form onSubmit={handleReserveResource} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Reserve Facility / Equipment</h3>
              <button type="button" onClick={() => setIsReserveOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Resource</label>
                <select value={selectedResourceId} onChange={(e) => setSelectedResourceId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.resource_type})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Booking Date</label>
                <input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">Duration (Hours)</label>
                <input type="number" min="1" max="8" defaultValue="2" required className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsReserveOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Confirm Reservation</button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}
