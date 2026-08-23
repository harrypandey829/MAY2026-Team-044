import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Eye, X, Trophy, Sparkles } from 'lucide-react';

export interface CalendarEvent {
  id?: string;
  title: string;
  day: number;
  dateStr?: string;
  sport?: string;
  venue?: string;
  start_time?: string;
  description?: string;
  type: 'Training' | 'Match' | 'Tournament' | 'Holiday' | 'Club Event';
}

interface CoachCalendarProps {
  events: CalendarEvent[];
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayCells = Array.from({ length: 31 }, (_, index) => index + 1);

export default function CoachCalendar({ events }: CoachCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(events[0] ?? null);
  const [modalEvent, setModalEvent] = useState<CalendarEvent | null>(null);

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      {/* CALENDAR GRID */}
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Interactive Calendar</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{currentMonthYear}</h3>
          </div>
          <div className="rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold text-brand-700 border border-sky-200">
            {events.length} Events Highlighted
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
          {days.map((day) => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {dayCells.map((cell) => {
            const dayEvents = events.filter((item) => item.day === cell);
            const primaryEvent = dayEvents[0];
            const hasEvent = dayEvents.length > 0;
            const isMatch = primaryEvent?.type === 'Match' || primaryEvent?.type === 'Tournament';

            return (
              <button
                key={cell}
                type="button"
                onClick={() => {
                  if (primaryEvent) {
                    setSelectedEvent(primaryEvent);
                    setModalEvent(primaryEvent);
                  }
                }}
                className={`flex h-16 flex-col items-center justify-between rounded-2xl p-1.5 text-xs transition-all ${
                  hasEvent
                    ? isMatch
                      ? 'border-2 border-emerald-400 bg-emerald-50 text-emerald-900 shadow-sm font-bold hover:scale-105'
                      : 'border-2 border-brand-400 bg-brand-50 text-brand-900 shadow-sm font-bold hover:scale-105'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-extrabold">{cell}</span>
                {hasEvent && (
                  <span
                    className={`inline-block w-full truncate rounded-lg px-1 py-0.5 text-[9px] font-extrabold uppercase ${
                      isMatch ? 'bg-emerald-600 text-white' : 'bg-brand-600 text-white'
                    }`}
                  >
                    {primaryEvent.type}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED EVENT SIDE PANEL */}
      <div className="rounded-[1.5rem] border border-sky-200/70 bg-gradient-to-br from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-2xl shadow-sky-100/80">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">Selected Event Details</p>
          {selectedEvent && (
            <span className={`rounded-full px-3 py-0.5 text-xs font-extrabold ${
              selectedEvent.type === 'Match' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-100 text-brand-800'
            }`}>
              {selectedEvent.type}
            </span>
          )}
        </div>

        {selectedEvent ? (
          <>
            <h3 className="mt-3 text-2xl font-extrabold text-slate-900">{selectedEvent.title}</h3>
            <p className="mt-1 text-xs text-slate-500">Scheduled for {currentMonthName} {selectedEvent.day}.</p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-sky-100 text-xs text-slate-700">
                <CalendarIcon className="h-4 w-4 text-brand-600" />
                <span>Date: <strong>{selectedEvent.dateStr || `${currentMonthName} ${selectedEvent.day}`}</strong></span>
              </div>

              {selectedEvent.venue && (
                <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-sky-100 text-xs text-slate-700">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  <span>Venue: <strong>{selectedEvent.venue}</strong></span>
                </div>
              )}

              {selectedEvent.start_time && (
                <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-sky-100 text-xs text-slate-700">
                  <Clock className="h-4 w-4 text-brand-600" />
                  <span>Time: <strong>{selectedEvent.start_time}</strong></span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="rounded-xl bg-white p-3 border border-sky-100 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 mb-1">Details:</p>
                  <p className="text-slate-600">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setModalEvent(selectedEvent)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95"
            >
              <Eye className="h-4 w-4" /> View Full Event Details (Read-Only)
            </button>
          </>
        ) : (
          <p className="mt-4 text-sm text-slate-600">Select a highlighted date on the calendar to view event details.</p>
        )}
      </div>

      {/* READ-ONLY VIEW MODAL */}
      {modalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">VIEW ONLY</span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{modalEvent.title}</h3>
              </div>
              <button onClick={() => setModalEvent(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Sport Discipline</p>
                <p className="font-bold text-slate-900 mt-0.5">{modalEvent.sport || 'General'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Event Type</p>
                <p className="font-bold text-slate-900 mt-0.5">{modalEvent.type}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500 font-semibold uppercase text-[10px]">Venue Location</p>
                <p className="font-bold text-slate-900 mt-0.5">{modalEvent.venue || 'Main Complex'}</p>
              </div>

              {modalEvent.description && (
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-slate-500 font-semibold uppercase text-[10px]">Description</p>
                  <p className="font-medium text-slate-800 mt-0.5">{modalEvent.description}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setModalEvent(null)} className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-900">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
