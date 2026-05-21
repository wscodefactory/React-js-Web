import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, MapPin, Plus, Trash2 } from "lucide-react";
import { eventPalette, monthLabels, weekdayLabels } from "./data";
import { formatDateKey, formatFullDate, getEventsForDate, normalizeDate } from "./calendarUtils";
import type { CalendarEvent } from "./types";

export function CalendarSchedulePreview() {
  const [viewDate, setViewDate] = useState(() => normalizeDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => normalizeDate(new Date()));
  const [customEvents, setCustomEvents] = useState<Record<string, CalendarEvent[]>>({});
  const [draftTitle, setDraftTitle] = useState("Stakeholder review");
  const [draftTime, setDraftTime] = useState("13:00 - 13:30");
  const [draftLocation, setDraftLocation] = useState("Project room");
  const [status, setStatus] = useState("Add an agenda item to the selected date.");

  const weekDates = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  const selectedDateKey = formatDateKey(selectedDate);
  const events = useMemo(
    () => [...getEventsForDate(selectedDate), ...(customEvents[selectedDateKey] ?? [])],
    [customEvents, selectedDate, selectedDateKey],
  );

  function moveWeek(offset: number) {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + offset * 7);
      return normalizeDate(next);
    });
    setViewDate((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + offset * 7);
      return normalizeDate(next);
    });
  }

  function handleAddEvent() {
    if (!draftTitle.trim()) {
      setStatus("Add a title before creating the agenda item.");
      return;
    }

    const nextEvent = {
      id: `custom-${Date.now()}`,
      title: draftTitle.trim(),
      time: draftTime.trim() || "All day",
      location: draftLocation.trim() || "TBD",
    };

    setCustomEvents((current) => ({
      ...current,
      [selectedDateKey]: [...(current[selectedDateKey] ?? []), nextEvent],
    }));
    setStatus(`${nextEvent.title} added to ${monthLabels[selectedDate.getMonth()]} ${selectedDate.getDate()}.`);
    setDraftTitle("");
  }

  function handleRemoveEvent(eventId: string) {
    setCustomEvents((current) => ({
      ...current,
      [selectedDateKey]: (current[selectedDateKey] ?? []).filter((event) => event.id !== eventId),
    }));
    setStatus("Agenda item removed from the selected date.");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Weekly planner</p>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Team availability board</h4>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => moveWeek(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => moveWeek(1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-7">
          {weekDates.map((date) => {
            const isSelected = date.getTime() === selectedDate.getTime();
            const dateKey = formatDateKey(date);
            const dailyEvents = [...getEventsForDate(date), ...(customEvents[dateKey] ?? [])];

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  setViewDate(date);
                }}
                className={[
                  "rounded-2xl border p-3 text-left transition",
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md shadow-green-500/10 dark:border-green-500 dark:bg-green-950/30"
                    : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{weekdayLabels[date.getDay()]}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{date.getDate()}</p>
                <div className="mt-3 space-y-2">
                  {dailyEvents.slice(0, 2).map((event, index) => (
                    <div key={`${event.title}-${index}`} className={`rounded-xl px-2 py-2 text-xs font-medium ${eventPalette[index % eventPalette.length]}`}>
                      {event.title}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">Daily agenda</p>
        <h4 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{formatFullDate(selectedDate)}</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Build schedule dashboards, booking sidebars, or staff rosters from the same layout.
        </p>

        <div className="mt-5 space-y-3">
          {events.map((event, index) => (
            <div key={`${event.title}-${event.time}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h5 className="font-semibold text-gray-900 dark:text-white">{event.title}</h5>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${eventPalette[index % eventPalette.length]}`}>
                    {event.id.startsWith("custom") ? "Custom" : index === 0 ? "Primary" : "Scheduled"}
                  </span>
                  {event.id.startsWith("custom") ? (
                    <button type="button" onClick={() => handleRemoveEvent(event.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-300" aria-label={`Remove ${event.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <h5 className="font-semibold text-gray-900 dark:text-white">Add agenda item</h5>
          <div className="mt-3 grid gap-2">
            <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white" placeholder="Event title" />
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={draftTime} onChange={(event) => setDraftTime(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white" placeholder="Time" />
              <input value={draftLocation} onChange={(event) => setDraftLocation(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white" placeholder="Location" />
            </div>
            <button type="button" onClick={handleAddEvent} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
              <Plus className="h-4 w-4" />
              Add event
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{status}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Week of {monthLabels[viewDate.getMonth()]} {viewDate.getDate()}, {viewDate.getFullYear()}
        </div>
      </aside>
    </div>
  );
}
