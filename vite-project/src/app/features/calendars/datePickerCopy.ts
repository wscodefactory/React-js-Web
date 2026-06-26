import type { AppLanguage } from "@/app/context/LanguageContext";

export type DatePickerText = {
  connectedPanel: string;
  description: string;
  interactivePicker: string;
  jumpToday: string;
  months: string[];
  quickActions: string;
  ready: string;
  selectedDate: string;
  weekdays: string[];
};

export const datePickerText: Record<AppLanguage, DatePickerText> = {
  en: {
    connectedPanel: "Current selection updates the monthly grid and any connected schedule panels.",
    description: "Use this block for reservation forms, booking flows, and dashboard filters.",
    interactivePicker: "Interactive Picker",
    jumpToday: "Jump to today",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    quickActions: "Quick actions",
    ready: "Ready",
    selectedDate: "Selected date",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  ko: {
    connectedPanel: "현재 선택값이 월간 그리드와 연결된 일정 패널에 함께 반영됩니다.",
    description: "예약 폼, 예약 흐름, 대시보드 필터에 이 블록을 사용할 수 있습니다.",
    interactivePicker: "인터랙티브 선택기",
    jumpToday: "오늘로 이동",
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    quickActions: "빠른 동작",
    ready: "준비됨",
    selectedDate: "선택한 날짜",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  },
};
