import { useEffect, useMemo, useState } from "react";
import type { AppLanguage } from "@/app/context/LanguageContext";
import { formatDateKey, getEventsForDate, normalizeDate, parseDateKey } from "./calendarUtils";
import { scheduleText } from "./copy";
import { readStoredScheduleDraft, saveStoredScheduleDraft } from "./scheduleStorage";
import { countCustomEvents, downloadJsonFile } from "./scheduleUtils";
import type { CalendarEvent } from "./types";

export function useCalendarScheduleController(language: AppLanguage) {
  const text = scheduleText[language];
  const [initialDraft] = useState(readStoredScheduleDraft);
  const [selectedDate, setSelectedDate] = useState(() => parseDateKey(initialDraft?.selectedDateKey) ?? normalizeDate(new Date()));
  const [customEvents, setCustomEvents] = useState<Record<string, CalendarEvent[]>>(() => initialDraft?.customEvents ?? {});
  const [draftTitle, setDraftTitle] = useState(initialDraft?.draftTitle ?? text.defaultTitle);
  const [draftTime, setDraftTime] = useState(initialDraft?.draftTime ?? "13:00 - 13:30");
  const [draftLocation, setDraftLocation] = useState(initialDraft?.draftLocation ?? text.defaultLocation);
  const [status, setStatus] = useState<string>(() => (initialDraft ? text.restored : text.addPrompt));

  const weekDates = useMemo(() => {
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - selectedDate.getDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  const selectedDateKey = formatDateKey(selectedDate);
  const customEventCount = useMemo(() => countCustomEvents(customEvents), [customEvents]);
  const events = useMemo(
    () => [...getEventsForDate(selectedDate), ...(customEvents[selectedDateKey] ?? [])],
    [customEvents, selectedDate, selectedDateKey],
  );

  useEffect(() => {
    saveStoredScheduleDraft({
      customEvents,
      draftLocation,
      draftTime,
      draftTitle,
      selectedDateKey,
    });
  }, [customEvents, draftLocation, draftTime, draftTitle, selectedDateKey]);

  function moveWeek(offset: number) {
    setSelectedDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + offset * 7);
      return normalizeDate(nextDate);
    });
  }

  function selectDate(date: Date) {
    setSelectedDate(normalizeDate(date));
  }

  function handleAddEvent() {
    if (!draftTitle.trim()) {
      setStatus(text.addTitleFirst);
      return;
    }

    const nextEvent = {
      id: `custom-${Date.now()}`,
      title: draftTitle.trim(),
      time: draftTime.trim() || text.allDay,
      location: draftLocation.trim() || text.TBD,
    };

    setCustomEvents((currentEvents) => ({
      ...currentEvents,
      [selectedDateKey]: [...(currentEvents[selectedDateKey] ?? []), nextEvent],
    }));
    setStatus(text.eventAdded(nextEvent.title, text.months[selectedDate.getMonth()], selectedDate.getDate()));
    setDraftTitle("");
  }

  function handleRemoveEvent(eventId: string) {
    setCustomEvents((currentEvents) => {
      const remainingEvents = (currentEvents[selectedDateKey] ?? []).filter((event) => event.id !== eventId);
      const nextCustomEvents = { ...currentEvents };

      if (remainingEvents.length > 0) {
        nextCustomEvents[selectedDateKey] = remainingEvents;
      } else {
        delete nextCustomEvents[selectedDateKey];
      }

      return nextCustomEvents;
    });
    setStatus(text.removed);
  }

  function handleDownloadSchedule() {
    downloadJsonFile({
      customEvents,
      exportedAt: new Date().toISOString(),
      selectedDate: selectedDateKey,
      selectedDateEvents: events,
      totalCustomEvents: customEventCount,
    }, `calendar-schedule-${selectedDateKey}.json`);
    setStatus(text.exported(customEventCount));
  }

  function handleClearCustomEvents() {
    if (customEventCount === 0) {
      setStatus(text.noCustom);
      return;
    }

    setCustomEvents({});
    setStatus(text.cleared);
  }

  return {
    customEventCount,
    customEvents,
    draftLocation,
    draftTime,
    draftTitle,
    events,
    handleAddEvent,
    handleClearCustomEvents,
    handleDownloadSchedule,
    handleRemoveEvent,
    moveWeek,
    selectedDate,
    selectDate,
    setDraftLocation,
    setDraftTime,
    setDraftTitle,
    status,
    text,
    weekDates,
  };
}
