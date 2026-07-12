import { useState } from 'react';

interface CalendarEvent {
  title: string;
  day: number;
  type: 'Training' | 'Match' | 'Tournament' | 'Holiday';
}

interface CoachCalendarProps {
  events: CalendarEvent[];
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayCells = Array.from({ length: 35 }, (_, index) => index + 1);

export default function CoachCalendar({ events }: CoachCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(events[0] ?? null);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Team Calendar</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">July 2026</h3>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Monthly View</div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          {days.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2">
          {dayCells.map((cell) => {
            const event = events.find((item) => item.day === cell);
            return (
              <button
                key={cell}
                type="button"
                onClick={() => setSelectedEvent(event ?? null)}
                className={`flex h-16 flex-col items-center justify-center rounded-2xl border text-sm transition-all ${event ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="font-semibold">{cell}</span>
                {event && <span className="mt-1 text-[10px]">{event.type}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-sky-200/70 bg-gradient-to-br from-sky-100 via-white to-emerald-50 p-5 text-slate-900 shadow-2xl shadow-sky-100/80">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Selected Event</p>
        {selectedEvent ? (
          <>
            <h3 className="mt-3 text-2xl font-semibold">{selectedEvent.title}</h3>
            <p className="mt-3 text-sm text-slate-600">Scheduled for July {selectedEvent.day}, 2026.</p>
            <div className="mt-5 rounded-[1.3rem] border border-sky-200 bg-white/80 p-4 backdrop-blur-md">
              <p className="text-sm font-semibold">Type</p>
              <p className="mt-1 text-lg">{selectedEvent.type}</p>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Select a day to preview the team activity.</p>
        )}
      </div>
    </div>
  );
}
