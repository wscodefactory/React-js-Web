import type { ComponentShowcaseConfig } from '../../types/component-showcase';
import { CalendarDatePickerPreview } from './CalendarDatePickerPreview';
import { CalendarSchedulePreview } from './CalendarSchedulePreview';

export const calendarShowcaseConfig: ComponentShowcaseConfig = {
  eyebrow: "Date Selection",
  title: "Calendars",
  titleHighlight: "Component",
  description: "Interactive calendar layouts for booking, scheduling, and team planning views.",
  updatedAt: "Apr 23, 2026",
  sections: [
    {
      title: "Date Picker Plus",
      description: "A polished monthly date picker with month navigation, day selection, and a linked detail panel.",
      badge: { label: "FREE", tone: "free" },
      preview: <CalendarDatePickerPreview />,
    },
    {
      title: "Schedule Board",
      description: "A weekly calendar layout that pairs quick day selection with a simple agenda list.",
      badge: { label: "PRO", tone: "pro" },
      preview: <CalendarSchedulePreview />,
    },
  ],
};
