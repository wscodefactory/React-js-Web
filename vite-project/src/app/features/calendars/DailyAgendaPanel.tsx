import { Clock3, Download, MapPin, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { AppLanguage } from "@/app/context/LanguageContext";
import type { ScheduleText } from "./copy";
import { eventPalette } from "./data";
import { formatScheduleDate, getLocalizedEventLocation, getLocalizedEventTitle } from "./scheduleUtils";
import type { CalendarEvent } from "./types";

type DailyAgendaPanelProps = {
  customEventCount: number;
  draftLocation: string;
  draftTime: string;
  draftTitle: string;
  events: CalendarEvent[];
  language: AppLanguage;
  onAddEvent: () => void;
  onClearCustomEvents: () => void;
  onDownloadSchedule: () => void;
  onRemoveEvent: (eventId: string) => void;
  onUpdateDraftLocation: (value: string) => void;
  onUpdateDraftTime: (value: string) => void;
  onUpdateDraftTitle: (value: string) => void;
  selectedDate: Date;
  status: string;
  text: ScheduleText;
};

export function DailyAgendaPanel({
  customEventCount,
  draftLocation,
  draftTime,
  draftTitle,
  events,
  language,
  onAddEvent,
  onClearCustomEvents,
  onDownloadSchedule,
  onRemoveEvent,
  onUpdateDraftLocation,
  onUpdateDraftTime,
  onUpdateDraftTitle,
  selectedDate,
  status,
  text,
}: DailyAgendaPanelProps) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">{text.dailyAgenda}</p>
      <h4 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{formatScheduleDate(selectedDate, language)}</h4>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text.description}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <button
          type="button"
          onClick={onDownloadSchedule}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Download className="h-4 w-4" />
          {text.exportJson}
        </button>
        <button
          type="button"
          onClick={onClearCustomEvents}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          disabled={customEventCount === 0}
        >
          <RotateCcw className="h-4 w-4" />
          {text.clearCustom}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {events.map((event, index) => (
          <div key={event.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h5 className="font-semibold text-gray-900 dark:text-white">{getLocalizedEventTitle(event, text)}</h5>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${eventPalette[index % eventPalette.length]}`}>
                  {event.id.startsWith("custom") ? text.custom : index === 0 ? text.primary : text.scheduled}
                </span>
                {event.id.startsWith("custom") ? (
                  <button
                    type="button"
                    onClick={() => onRemoveEvent(event.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                    aria-label={text.removeEvent(event.title)}
                  >
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
                <span>{getLocalizedEventLocation(event, text)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <h5 className="font-semibold text-gray-900 dark:text-white">{text.addEvent}</h5>
        <div className="mt-3 grid gap-2">
          <input
            value={draftTitle}
            onChange={(event) => onUpdateDraftTitle(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white"
            placeholder={text.eventTitle}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={draftTime}
              onChange={(event) => onUpdateDraftTime(event.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white"
              placeholder={text.time}
            />
            <input
              value={draftLocation}
              onChange={(event) => onUpdateDraftLocation(event.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white"
              placeholder={text.location}
            />
          </div>
          <button type="button" onClick={onAddEvent} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
            <Plus className="h-4 w-4" />
            {text.addEvent}
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{status}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        {text.weekOf} {text.months[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()} / {text.customSaved(customEventCount)}
      </div>
    </aside>
  );
}
