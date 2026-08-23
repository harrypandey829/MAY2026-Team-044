import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import eventService, { type Event } from '../../services/eventService';

interface CoachCalendarProps {
  events: Event[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CoachCalendar({ events }: CoachCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const resetToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
  };

  // Helper to format date string YYYY-MM-DD
  const formatYMD = (d: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Events for selected day
  const selectedDateStr = selectedDay ? formatYMD(selectedDay) : null;
  const dayEvents = selectedDateStr ? events.filter((e) => e.date === selectedDateStr) : [];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Calendar Grid Container */}
      <div className="rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Interactive Schedule</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {MONTH_NAMES[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={resetToToday}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {/* Offset blank cells */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`blank-${i}`} className="h-14 rounded-2xl bg-slate-50/40 opacity-30" />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = formatYMD(dayNum);
            const dayEvList = events.filter((e) => e.date === dateStr);
            const hasEvents = dayEvList.length > 0;
            const isSelected = selectedDay === dayNum;
            const isToday =
              dayNum === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`relative flex h-14 flex-col items-center justify-between rounded-2xl border p-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500 text-white shadow-md shadow-brand-200'
                    : hasEvents
                    ? 'border-brand-300 bg-brand-50/80 text-brand-800 hover:bg-brand-100'
                    : isToday
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : 'border-slate-100 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex w-full justify-between items-center px-1">
                  <span>{dayNum}</span>
                  {isToday && !isSelected && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                </div>

                {hasEvents && (
                  <div className="flex items-center gap-1 w-full justify-center pb-0.5">
                    {dayEvList.slice(0, 2).map((ev, idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : ev.event_type === 'Practice'
                            ? 'bg-brand-500'
                            : ev.event_type === 'Match'
                            ? 'bg-emerald-500'
                            : 'bg-amber-500'
                        }`}
                      />
                    ))}
                    {dayEvList.length > 2 && (
                      <span className={`text-[9px] font-extrabold ${isSelected ? 'text-white' : 'text-brand-600'}`}>
                        +{dayEvList.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <div className="rounded-[1.75rem] border border-sky-200/70 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-5 shadow-lg shadow-sky-100/70">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Events Feed</p>
            <h4 className="mt-0.5 text-lg font-bold text-slate-900">
              {selectedDay ? `${MONTH_NAMES[month]} ${selectedDay}, ${year}` : 'Select a Date'}
            </h4>
          </div>
          <CalendarIcon className="h-5 w-5 text-brand-600" />
        </div>

        <div className="mt-4 space-y-3">
          {dayEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-sm text-slate-500">
              No events or training sessions scheduled for this date.
            </div>
          ) : (
            dayEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-bold text-slate-900">{ev.title}</h5>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      ev.event_type === 'Practice'
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : ev.event_type === 'Match'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {ev.event_type}
                  </span>
                </div>
                {ev.description && <p className="mt-1 text-xs text-slate-600 line-clamp-2">{ev.description}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-brand-600" />
                    {ev.start_time ? eventService.formatTime(ev.start_time) : 'TBD'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    {ev.venue}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

