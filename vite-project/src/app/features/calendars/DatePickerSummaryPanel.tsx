import type { AppLanguage } from "@/app/context/LanguageContext";
import type { DatePickerText } from "./datePickerCopy";

type DatePickerSummaryPanelProps = {
  language: AppLanguage;
  onJumpToToday: () => void;
  selectedDate: Date;
  text: DatePickerText;
};

export function DatePickerSummaryPanel({ language, onJumpToToday, selectedDate, text }: DatePickerSummaryPanelProps) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-gradient-to-b from-green-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-gray-900 dark:to-gray-950">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">{text.selectedDate}</p>
      <h4 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
        {selectedDate.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US", {
          day: "numeric",
          month: "long",
          weekday: "long",
          year: "numeric",
        })}
      </h4>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text.description}</p>

      <div className="mt-5 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">{text.quickActions}</span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
            {text.ready}
          </span>
        </div>
        <button
          type="button"
          onClick={onJumpToToday}
          className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-gray-900"
        >
          {text.jumpToday}
        </button>
        <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
          {text.connectedPanel}
        </div>
      </div>
    </aside>
  );
}
