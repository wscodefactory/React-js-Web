import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AppLanguage } from "@/app/context/LanguageContext";
import { isSameDate } from "./calendarUtils";
import type { DatePickerText } from "./datePickerCopy";

type DatePickerCalendarPanelProps = {
  language: AppLanguage;
  monthCells: Date[];
  onMoveMonth: (offset: number) => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  text: DatePickerText;
  today: Date;
  viewDate: Date;
};

export function DatePickerCalendarPanel({
  language,
  monthCells,
  onMoveMonth,
  onSelectDate,
  selectedDate,
  text,
  today,
  viewDate,
}: DatePickerCalendarPanelProps) {
  const title = language === "ko"
    ? `${viewDate.getFullYear()}년 ${text.months[viewDate.getMonth()]}`
    : `${text.months[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{text.interactivePicker}</p>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onMoveMonth(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => onMoveMonth(1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
        {text.weekdays.map((label) => (
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
              onClick={() => onSelectDate(date)}
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
              <span className="text-xs opacity-70">{text.weekdays[date.getDay()].slice(0, 1)}</span>
              <span className="text-base">{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
