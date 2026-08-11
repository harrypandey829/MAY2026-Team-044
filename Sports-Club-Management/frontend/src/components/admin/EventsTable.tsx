import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Pencil, Plus, X, Calendar, MapPin, Users as UsersIcon, CheckCircle2 } from 'lucide-react';
import eventService, { type Event, type CreateEventRequest } from '../../services/eventService';

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editMax, setEditMax] = useState<number | undefined>(undefined);
  const [editStatus, setEditStatus] = useState<Event['event_status']>('Scheduled');

  // Create form state
  const [createForm, setCreateForm] = useState<CreateEventRequest>({
    title: '',
    description: '',
    event_type: 'Match',
    date: new Date().toISOString().split('T')[0],
    venue: '',
    event_status: 'Scheduled',
    max_participants: 50,
  });

  const loadEvents = () => {
    setLoading(true);
    eventService
      .getAll()
      .then((data) => setEvents(data.slice(0, 10)))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  function getStatusClass(status: Event['event_status']) {
    if (status === 'Scheduled') return 'bg-emerald-50 text-emerald-700';
    if (status === 'Completed') return 'bg-sky-50 text-sky-700';
    return 'bg-rose-50 text-rose-700';
  }

  const handleOpenEdit = (event: Event) => {
    setEditEvent(event);
    setEditTitle(event.title);
    setEditVenue(event.venue);
    setEditMax(event.max_participants ?? 50);
    setEditStatus(event.event_status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEvent) return;
    setIsSaving(true);
    try {
      await eventService.update(editEvent.id, {
        title: editTitle,
        venue: editVenue,
        max_participants: editMax,
        event_status: editStatus,
      });
      setEditEvent(null);
      loadEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update event.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title || !createForm.venue) return;
    setIsSaving(true);
    try {
      await eventService.create(createForm);
      setIsCreateOpen(false);
      setCreateForm({
        title: '',
        description: '',
        event_type: 'Match',
        date: new Date().toISOString().split('T')[0],
        venue: '',
        event_status: 'Scheduled',
        max_participants: 50,
      });
      loadEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create event.');
    } finally {
      setIsSaving(false);
    }
  };

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
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-300/40 hover:scale-105 transition-transform"
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewEvent(event)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
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
      {viewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Event Details</h3>
              <button type="button" onClick={() => setViewEvent(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="my-4 space-y-3 text-sm text-slate-700">
              <h4 className="text-xl font-bold text-slate-900">{viewEvent.title}</h4>
              <p className="text-slate-600">{viewEvent.description || 'No description provided.'}</p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                  <Calendar className="h-4 w-4 text-brand-600" />
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="font-semibold">{eventService.formatDate(viewEvent.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  <div>
                    <p className="text-xs text-slate-400">Venue</p>
                    <p className="font-semibold">{viewEvent.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                  <UsersIcon className="h-4 w-4 text-brand-600" />
                  <div>
                    <p className="text-xs text-slate-400">Max Capacity</p>
                    <p className="font-semibold">{viewEvent.max_participants ?? 'Unlimited'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="font-semibold">{viewEvent.event_status}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setViewEvent(null)} className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Event</h3>
              <button type="button" onClick={() => setEditEvent(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="my-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={editVenue}
                  onChange={(e) => setEditVenue(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Max Participants</label>
                  <input
                    type="number"
                    value={editMax || ''}
                    onChange={(e) => setEditMax(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Event['event_status'])}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setEditEvent(null)} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Create New Event</h3>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCreate} className="my-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="e.g. Annual Football Tournament"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Type *</label>
                  <select
                    value={createForm.event_type}
                    onChange={(e) => setCreateForm({ ...createForm, event_type: e.target.value as CreateEventRequest['event_type'] })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                  >
                    <option value="Match">Match</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Training">Training</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.date}
                    onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  value={createForm.venue}
                  onChange={(e) => setCreateForm({ ...createForm, venue: e.target.value })}
                  placeholder="e.g. Main Stadium Court"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-brand-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isSaving ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

