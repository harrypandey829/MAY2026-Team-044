import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Plus, Sparkles, X } from 'lucide-react';
import CoachPortalLayout from '../../components/coach-dashboard/CoachPortalLayout';
import resourceService, { resourceBookingService, type Resource } from '../../services/resourceService';
import authService from '../../services/authService';

export default function EquipmentPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modal State
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);

  const user = authService.getCurrentUser();

  function loadResources() {
    setLoading(true);
    resourceService.getAll()
      .then((data) => {
        setResources(data);
        if (data.length > 0) setSelectedResourceId(data[0].id);
      })
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadResources();
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
    } catch {
      alert('Failed to reserve equipment / facility');
    }
  }

  return (
    <CoachPortalLayout>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Coach Portal</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Facility & Equipment Booking</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Reserve training facilities, practice arenas, and club equipment for squad sessions.</p>
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
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> {feedback}</span>
          <button type="button" onClick={() => setFeedback(null)}><X className="h-4 w-4 text-emerald-700" /></button>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
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
              Coaches have priority booking access for training pitches and equipment kits.
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
