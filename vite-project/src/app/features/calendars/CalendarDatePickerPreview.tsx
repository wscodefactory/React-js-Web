import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthLabels, weekdayLabels } from "./data";
import { formatDateKey, formatFullDate, getMonthMatrix, isSameDate, normalizeDate, parseDateKey } from "./calendarUtils";

const datePickerStorageKey = "web5:calendar-date-picker:v1";

function readStoredDate() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(datePickerStorageKey) ?? "null") as { selectedDateKey?: unknown } | null;
    return parseDateKey(typeof parsed?.selectedDateKey === "string" ? parsed.selectedDateKey : undefined);
  } catch {
    window.localStorage.removeItem(datePickerStorageKey);
    return null;
  }
}

export function CalendarDatePickerPreview() {
  const today = useMemo(() => normalizeDate(new Date()), []);
  const [initialDate] = useState(readStoredDate);
  const [viewDate, setViewDate] = useState(() => initialDate ?? normalizeDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => initialDate ?? normalizeDate(new Date()));

  const monthCells = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  useEffect(() => {
    window.localStorage.setItem(datePickerStorageKey, JSON.stringify({ selectedDateKey: formatDateKey(selectedDate) }));
  }, [selectedDate]);

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
            <button type="button" onClick={() => moveMonth(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => moveMonth(1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
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
