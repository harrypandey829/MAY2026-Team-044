import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, MapPin, X, Plus } from 'lucide-react';
import eventService, { type Event } from '../../services/eventService';

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState<Event['event_status']>('Scheduled');

  // Create form state
  const [createTitle, setCreateTitle] = useState('');
  const [createType, setCreateType] = useState<Event['event_type']>('Match');
  const [createDate, setCreateDate] = useState(new Date().toISOString().split('T')[0]);
  const [createTime, setCreateTime] = useState('16:00');
  const [createVenue, setCreateVenue] = useState('Main Stadium');

  function loadEvents() {
    setLoading(true);
    eventService
      .getAll()
      .then((data) => setEvents(data.slice(0, 10)))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function getStatusClass(status: Event['event_status']) {
    if (status === 'Scheduled') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'Completed') return 'bg-sky-50 text-sky-700 border border-sky-200';
    return 'bg-rose-50 text-rose-700 border border-rose-200';
  }

  function handleOpenEdit(event: Event) {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditVenue(event.venue);
    setEditDate(event.date);
    setEditStatus(event.event_status);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await eventService.update(editingEvent.id, {
        title: editTitle,
        venue: editVenue,
        date: editDate,
        event_status: editStatus,
      });
      setEditingEvent(null);
      loadEvents();
    } catch {
      alert('Failed to update event details');
    }
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    try {
      await eventService.create({
        title: createTitle,
        event_type: createType,
        date: createDate,
        start_time: createTime,
        venue: createVenue,
      });
      setIsCreateOpen(false);
      setCreateTitle('');
      loadEvents();
    } catch {
      alert('Failed to create event');
    }
  }

  return (
    <section className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Event Management</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Upcoming club events</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-300/40 hover:opacity-95 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Create New Event
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No events found</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Venue</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Max</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-slate-100 last:border-none"
                >
                  <td className="py-3 font-semibold text-slate-800">{event.title}</td>
                  <td className="py-3 text-slate-600">{event.event_type}</td>
                  <td className="py-3 text-slate-600">{eventService.formatDate(event.date)}</td>
                  <td className="py-3 text-slate-600">{event.venue}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(event.event_status)}`}>
                      {event.event_status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{event.max_participants ?? '–'}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(event)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewingEvent(event)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Event Modal */}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Event Details</h3>
              <button type="button" onClick={() => setViewingEvent(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Title</p>
                <p className="text-lg font-bold text-slate-900">{viewingEvent.title}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-brand-600" /> {eventService.formatDate(viewingEvent.date)}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand-600" /> {eventService.formatTime(viewingEvent.start_time)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-brand-600" /> {viewingEvent.venue}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Type & Status</p>
                <p className="mt-1 text-sm text-slate-700">{viewingEvent.event_type} • Status: <span className="font-semibold">{viewingEvent.event_status}</span></p>
              </div>
              {viewingEvent.description && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Description</p>
                  <p className="mt-1 text-sm text-slate-600">{viewingEvent.description}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewingEvent(null)} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <form onSubmit={handleSaveEdit} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Event</h3>
              <button type="button" onClick={() => setEditingEvent(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Title</label>
                <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Venue</label>
                <input type="text" required value={editVenue} onChange={(e) => setEditVenue(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Date</label>
                <input type="date" required value={editDate} onChange={(e) => setEditDate(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Status</label>
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as Event['event_status'])} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditingEvent(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <form onSubmit={handleCreateEvent} className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Create New Club Event</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Event Title *</label>
                <input type="text" required value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="e.g. League Match vs City FC" className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Type</label>
                <select value={createType} onChange={(e) => setCreateType(e.target.value as Event['event_type'])} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none">
                  <option value="Match">Match</option>
                  <option value="Practice">Practice</option>
                  <option value="Tournament">Tournament</option>
                  <option value="Club Event">Club Event</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Date</label>
                  <input type="date" required value={createDate} onChange={(e) => setCreateDate(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Time</label>
                  <input type="time" required value={createTime} onChange={(e) => setCreateTime(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-slate-500 mb-1">Venue</label>
                <input type="text" required value={createVenue} onChange={(e) => setCreateVenue(e.target.value)} className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2 text-sm font-semibold text-white">Create Event</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
