import type { AppLanguage } from "@/app/context/LanguageContext";
import type { ScheduleText } from "./copy";
import type { CalendarEvent } from "./types";

export function countCustomEvents(customEvents: Record<string, CalendarEvent[]>) {
  return Object.values(customEvents).reduce((total, events) => total + events.length, 0);
}

export function downloadJsonFile(payload: unknown, fileName: string) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function formatScheduleDate(date: Date, language: AppLanguage) {
  return date.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });
}

export function getLocalizedEventTitle(event: CalendarEvent, text: ScheduleText) {
  return text.calendarEvents[event.title as keyof ScheduleText["calendarEvents"]] ?? event.title;
}

export function getLocalizedEventLocation(event: CalendarEvent, text: ScheduleText) {
  return text.locations[event.location as keyof ScheduleText["locations"]] ?? event.location;
}
