import { loadStoredJson, saveStoredJson } from "@/app/utils/storage";
import { parseDateKey } from "./calendarUtils";
import type { CalendarEvent } from "./types";

export type StoredScheduleDraft = {
  customEvents: Record<string, CalendarEvent[]>;
  draftLocation: string;
  draftTime: string;
  draftTitle: string;
  selectedDateKey: string;
};

const scheduleStorageKey = "web5:calendar-schedule-board:v1";
const defaultStoredDraft: StoredScheduleDraft | null = null;

function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const event = value as CalendarEvent;
  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.time === "string" &&
    typeof event.location === "string"
  );
}

function isStoredScheduleDraft(value: unknown): value is StoredScheduleDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Partial<StoredScheduleDraft>;
  if (
    typeof draft.selectedDateKey !== "string" ||
    !parseDateKey(draft.selectedDateKey) ||
    typeof draft.draftTitle !== "string" ||
    typeof draft.draftTime !== "string" ||
    typeof draft.draftLocation !== "string" ||
    !draft.customEvents ||
    typeof draft.customEvents !== "object"
  ) {
    return false;
  }

  return Object.entries(draft.customEvents).every(([dateKey, events]) => (
    Boolean(parseDateKey(dateKey)) &&
    Array.isArray(events) &&
    events.every(isCalendarEvent)
  ));
}

export function readStoredScheduleDraft() {
  return loadStoredJson(scheduleStorageKey, defaultStoredDraft, isStoredScheduleDraft);
}

export function saveStoredScheduleDraft(draft: StoredScheduleDraft) {
  saveStoredJson(scheduleStorageKey, draft);
}
