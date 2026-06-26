import { loadStoredJson, saveStoredJson } from "@/app/utils/storage";
import { formatDateKey, parseDateKey } from "./calendarUtils";

const datePickerStorageKey = "web5:calendar-date-picker:v1";

type StoredDatePickerDraft = {
  selectedDateKey: string;
};

function isStoredDatePickerDraft(value: unknown): value is StoredDatePickerDraft {
  if (!value || typeof value !== "object") {
    return false;
  }

  const draft = value as Partial<StoredDatePickerDraft>;
  return typeof draft.selectedDateKey === "string" && Boolean(parseDateKey(draft.selectedDateKey));
}

export function readStoredDate() {
  const draft = loadStoredJson<StoredDatePickerDraft | null>(datePickerStorageKey, null, (value): value is StoredDatePickerDraft | null => (
    value === null || isStoredDatePickerDraft(value)
  ));

  return parseDateKey(draft?.selectedDateKey);
}

export function saveSelectedDate(date: Date) {
  saveStoredJson(datePickerStorageKey, { selectedDateKey: formatDateKey(date) });
}
