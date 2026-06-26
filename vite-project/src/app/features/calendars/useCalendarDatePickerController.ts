import { useEffect, useMemo, useState } from "react";
import { getMonthMatrix, normalizeDate } from "./calendarUtils";
import { datePickerText } from "./datePickerCopy";
import { readStoredDate, saveSelectedDate } from "./datePickerStorage";
import type { AppLanguage } from "@/app/context/LanguageContext";

export function useCalendarDatePickerController(language: AppLanguage) {
  const text = datePickerText[language];
  const today = useMemo(() => normalizeDate(new Date()), []);
  const [initialDate] = useState(readStoredDate);
  const [viewDate, setViewDate] = useState(() => initialDate ?? normalizeDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => initialDate ?? normalizeDate(new Date()));
  const monthCells = useMemo(() => getMonthMatrix(viewDate), [viewDate]);

  useEffect(() => {
    saveSelectedDate(selectedDate);
  }, [selectedDate]);

  function moveMonth(offset: number) {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function selectDate(date: Date) {
    setSelectedDate(date);
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  function jumpToToday() {
    setSelectedDate(today);
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  return {
    jumpToToday,
    monthCells,
    moveMonth,
    selectDate,
    selectedDate,
    text,
    today,
    viewDate,
  };
}
