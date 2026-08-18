import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Plus, Building2 } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import authService from '../../services/authService';
import resourceService, { Resource, ResourceBooking } from '../../services/resourceService';

export default function EquipmentPage() {
  const [adminVenues, setAdminVenues] = useState<Resource[]>([]);
  const [bookings, setBookings] = useState<ResourceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [selectedVenue, setSelectedVenue] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<'FN' | 'AN' | 'FULL'>('FN');
  const [remarks, setRemarks] = useState('Squad practice & match preparation');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentUser = authService.getCurrentUser();
  const coachSport = currentUser?.sport || 'Badminton';

  const loadData = async () => {
    try {
      setLoading(true);
      const allVenues = await resourceService.getAll().catch(() => []);
      const myBookings = await resourceService.getMyBookings().catch(() => []);

      const validVenues = Array.isArray(allVenues) ? allVenues : [];
      const validBookings = Array.isArray(myBookings) ? myBookings : [];

      setAdminVenues(validVenues);
      if (validVenues.length > 0 && !selectedVenue) {
        setSelectedVenue(validVenues[0].name);
      }

      const filtered = validBookings.filter(
        (b) => (currentUser?.id && b.coach_id === currentUser.id) || !b.sport_name || b.sport_name.toLowerCase() === coachSport.toLowerCase()
      );
      setBookings(filtered);
    } catch {
      // Safe fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [coachSport]);

  const handleRequestVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) {
      setMsg({ type: 'error', text: 'Please select a venue created by Admin.' });
      return;
    }

    let startTime = '09:00';
    let endTime = '13:00';
    if (timeSlot === 'AN') {
      startTime = '14:00';
      endTime = '18:00';
    } else if (timeSlot === 'FULL') {
      startTime = '09:00';
      endTime = '18:00';
    }

    try {
      setSubmitting(true);
      setMsg(null);
      await resourceService.createBooking({
        coach_id: currentUser?.id,
        sport_name: coachSport,
        venue_name: selectedVenue,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        remarks: `${timeSlot === 'FN' ? 'Forenoon (FN)' : timeSlot === 'AN' ? 'Afternoon (AN)' : 'Full Day'} - ${remarks}`,
      });

      setMsg({ type: 'success', text: `Venue booking request for '${selectedVenue}' submitted to Admin for approval!` });
      setIsModalOpen(false);
      setRemarks('Squad practice & match preparation');
      await loadData();
    } catch (err) {
      const errorText = err instanceof Error && err.message === 'Failed to fetch'
        ? 'Failed to connect to backend server. Please ensure the backend is running on port 8000.'
        : (err instanceof Error ? err.message : 'Failed to submit venue request');
      setMsg({ type: 'error', text: errorText });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Venue Operations: {coachSport}</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{coachSport} Venue Reservations</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Reserve Admin-created sports venues for Forenoon (FN) or Afternoon (AN) slots. Once Admin accepts your request, the venue becomes available for scheduling your training sessions & matches.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-4 w-4" /> Request Venue Reservation
          </button>
        </div>
      </section>

      {msg && (
        <div className={`mt-4 flex items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${msg.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
          {msg.text}
        </div>
      )}

      {/* VENUE BOOKING REQUESTS LOG */}
      <section className="mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Venue Booking Requests Log</h2>
          <p className="text-xs text-slate-500">Track status of submitted field & court booking requests sent to Admin</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100/80 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Venue / Court</th>
                  <th className="px-4 py-3">Sport</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Slot / Details</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">Loading venue bookings...</td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">No venue bookings requested yet.</td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-brand-600" />
                        {b.venue_name || 'Admin Venue'}
                      </td>
                      <td className="px-4 py-3">{b.sport_name || coachSport}</td>
                      <td className="px-4 py-3 text-xs font-semibold">{String(b.booking_date)}</td>
                      <td className="px-4 py-3 text-xs">{b.remarks?.split(' - ')[0] || (b.start_time ? `${b.start_time} - ${b.end_time}` : 'FN/AN Slot')}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                            b.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{b.remarks || '–'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* REQUEST VENUE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleRequestVenue} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <h3 className="text-lg font-bold text-slate-900">Request Venue Reservation</h3>
            <p className="mt-1 text-xs text-slate-500">Select an Admin-created venue and FN/AN session slot</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Available Admin Venues</label>
                {adminVenues.length === 0 ? (
                  <p className="mt-1 text-xs text-rose-600 font-semibold">No active venues created by Admin yet. Please ask Admin to add venues in the Resources console.</p>
                ) : (
                  <select
                    required
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold outline-none"
                  >
                    {adminVenues.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} (Capacity: {v.capacity || 50})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Booking Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Session Time Slot (FN / AN)</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold outline-none"
                >
                  <option value="FN">Forenoon (FN) - 09:00 AM to 01:00 PM</option>
                  <option value="AN">Afternoon (AN) - 02:00 PM to 06:00 PM</option>
                  <option value="FULL">Full Day - 09:00 AM to 06:00 PM</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-600">Purpose / Remarks</label>
                <input
                  type="text"
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. League match practice or tactical drill"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
              <button
                type="submit"
                disabled={submitting || adminVenues.length === 0}
                className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Submit Reservation Request'}
              </button>
            </div>
          </form>
        </div>
      )}
    </CoachPortalLayout>
  );
}
