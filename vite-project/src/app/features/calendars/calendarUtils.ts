import { monthLabels } from './data';
import type { CalendarEvent } from './types';

export function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getMonthMatrix(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + index);
    return cellDate;
  });
}

export function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getEventsForDate(date: Date) {
  const day = date.getDate();
  const month = date.getMonth();

  const baseEvents: CalendarEvent[] = [
    {
      id: `design-${formatDateKey(date)}`,
      title: month % 2 === 0 ? "Design review" : "Product sync",
      time: "09:30 - 10:15",
      location: month % 2 === 0 ? "Studio Room A" : "Teams meeting",
    },
    {
      id: `planning-${formatDateKey(date)}`,
      title: day % 3 === 0 ? "Client checkpoint" : "Content planning",
      time: "11:00 - 12:00",
      location: day % 3 === 0 ? "Conference Room" : "Workspace Board",
    },
  ];

  if (day % 2 === 0) {
    baseEvents.push({
      id: `qa-${formatDateKey(date)}`,
      title: "Calendar component QA",
      time: "14:00 - 15:00",
      location: "Preview sandbox",
    });
  }

  if (day % 5 === 0) {
    baseEvents.push({
      id: `launch-${formatDateKey(date)}`,
      title: "Launch prep",
      time: "16:30 - 17:15",
      location: "Operations desk",
    });
  }

  return baseEvents;
}

export function formatShortMonthDay(date: Date) {
  return `${monthLabels[date.getMonth()]} ${date.getDate()}`;
}
