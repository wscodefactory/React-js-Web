import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";
import { ComponentPreviewCard } from "@/app/components/showcase/ComponentPreviewCard";
import type { ComponentShowcaseConfig } from "@/app/types/component-showcase";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventPalette = [
  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
];

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMonthMatrix(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    return cellDate;
  });
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

function getEventsForDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth();

  const baseEvents = [
    {
      title: month % 2 === 0 ? "Design review" : "Product sync",
      time: "09:30 - 10:15",
      location: month % 2 === 0 ? "Studio Room A" : "Teams meeting",
    },
    {
      title: day % 3 === 0 ? "Client checkpoint" : "Content planning",
      time: "11:00 - 12:00",
      location: day % 3 === 0 ? "Conference Room" : "Workspace Board",
    },
  ];

  if (day % 2 === 0) {
    baseEvents.push({
      title: "Calendar component QA",
      time: "14:00 - 15:00",
      location: "Preview sandbox",
    });
  }

  if (day % 5 === 0) {
    baseEvents.push({
      title: "Launch prep",
      time: "16:30 - 17:15",
      location: "Operations desk",
    });
  }

  return baseEvents;
}

function CalendarDatePickerPreview() {
  const today = useMemo(() => normalizeDate(new Date()), []);
  const [viewDate, setViewDate] = useState(() => normalizeDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => normalizeDate(new Date()));

  const monthCells = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  function moveMonth(offset: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_280px]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Interactive Picker</p>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthLabels[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
          {weekdayLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthCells.map((date) => {
            const isCurrentMonth = date.getMonth() === viewDate.getMonth();
            const isSelected = isSameDate(date, selectedDate);
            const isToday = isSameDate(date, today);

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleDateSelect(date)}
                className={[
                  "flex aspect-square min-h-[52px] flex-col items-center justify-center rounded-2xl border text-sm font-medium transition",
                  isSelected
                    ? "border-green-600 bg-green-600 text-white shadow-md shadow-green-500/20"
                    : isCurrentMonth
                      ? "border-gray-200 bg-gray-50 text-gray-800 hover:border-green-300 hover:bg-green-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-green-700 dark:hover:bg-gray-800"
                      : "border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-600 dark:hover:bg-gray-900",
                  isToday && !isSelected ? "ring-2 ring-green-200 dark:ring-green-900" : "",
                ].join(" ")}
              >
                <span className="text-xs opacity-70">{weekdayLabels[date.getDay()].slice(0, 1)}</span>
                <span className="text-base">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="rounded-2xl border border-gray-200 bg-gradient-to-b from-green-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-gray-900 dark:to-gray-950">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">Selected date</p>
        <h4 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{formatFullDate(selectedDate)}</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Use this block for reservation forms, booking flows, and dashboard filters.
        </p>

        <div className="mt-5 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Quick actions</span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
              Ready
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedDate(today);
              setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
            }}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-gray-900"
          >
            Jump to today
          </button>
          <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
            Current selection updates the monthly grid and any connected schedule panels.
          </div>
        </div>
      </aside>
    </div>
  );
}

function CalendarSchedulePreview() {
  const [viewDate, setViewDate] = useState(() => normalizeDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => normalizeDate(new Date()));

  const weekDates = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  const events = useMemo(() => getEventsForDate(selectedDate), [selectedDate]);

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

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Weekly planner</p>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Team availability board</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveWeek(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => moveWeek(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-7">
          {weekDates.map((date) => {
            const isSelected = isSameDate(date, selectedDate);
            const dailyEvents = getEventsForDate(date);

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
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${eventPalette[index % eventPalette.length]}`}>
                  {index === 0 ? "Primary" : "Scheduled"}
                </span>
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

        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Week of {monthLabels[viewDate.getMonth()]} {viewDate.getDate()}, {viewDate.getFullYear()}
        </div>
      </aside>
    </div>
  );
}

const calendarShowcaseConfig: ComponentShowcaseConfig = {
  eyebrow: "Date Selection",
  title: "Calendars",
  titleHighlight: "Component",
  description: "Interactive calendar layouts for booking, scheduling, and team planning views.",
  updatedAt: "Apr 23, 2026",
  sections: [
    {
      title: "Date Picker Plus",
      description: "A polished monthly date picker with month navigation, day selection, and a linked detail panel.",
      badge: { label: "FREE", tone: "free" },
      preview: <CalendarDatePickerPreview />,
    },
    {
      title: "Schedule Board",
      description: "A weekly calendar layout that pairs quick day selection with a simple agenda list.",
      badge: { label: "PRO", tone: "pro" },
      preview: <CalendarSchedulePreview />,
    },
  ],
};

/**
 * Component page for calendar-related demos.
 * Keeps the overall gallery shell while allowing richer interactive previews than the generic data file provided.
 */
export function Calendars() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          {calendarShowcaseConfig.eyebrow}
        </p>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">
          {calendarShowcaseConfig.title}{" "}
          <span className="text-green-600 dark:text-green-400">{calendarShowcaseConfig.titleHighlight}</span>
        </h1>
        <p className="mb-2 text-gray-600 dark:text-gray-400">{calendarShowcaseConfig.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Last updated: {calendarShowcaseConfig.updatedAt}</p>
      </header>

      <div className="space-y-6">
        {calendarShowcaseConfig.sections.map((section) => (
          <ComponentPreviewCard key={section.title} item={section} />
        ))}
      </div>
    </div>
  );
}
