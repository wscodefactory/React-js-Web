import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateKey, getEventsForDate } from "./calendarUtils";
import { eventPalette } from "./data";
import { getLocalizedEventTitle } from "./scheduleUtils";
import type { ScheduleText } from "./copy";
import type { CalendarEvent } from "./types";

type CalendarWeekBoardProps = {
  customEvents: Record<string, CalendarEvent[]>;
  onMoveWeek: (offset: number) => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  text: ScheduleText;
  weekDates: Date[];
};

export function CalendarWeekBoard({
  customEvents,
  onMoveWeek,
  onSelectDate,
  selectedDate,
  text,
  weekDates,
}: CalendarWeekBoardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{text.weeklyPlanner}</p>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{text.teamBoard}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMoveWeek(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveWeek(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
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
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(date)}
              className={[
                "rounded-2xl border p-3 text-left transition",
                isSelected
                  ? "border-green-500 bg-green-50 shadow-md shadow-green-500/10 dark:border-green-500 dark:bg-green-950/30"
                  : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{text.weekdays[date.getDay()]}</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{date.getDate()}</p>
              <div className="mt-3 space-y-2">
                {dailyEvents.slice(0, 2).map((event, index) => (
                  <div key={`${event.id}-${index}`} className={`rounded-xl px-2 py-2 text-xs font-medium ${eventPalette[index % eventPalette.length]}`}>
                    {getLocalizedEventTitle(event, text)}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
