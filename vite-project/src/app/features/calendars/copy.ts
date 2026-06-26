import type { AppLanguage } from "@/app/context/LanguageContext";

type CalendarEventCopy = Record<
  "Calendar component QA" | "Client checkpoint" | "Content planning" | "Design review" | "Launch prep" | "Product sync",
  string
>;

type CalendarLocationCopy = Record<
  "Conference Room" | "Operations desk" | "Preview sandbox" | "Studio Room A" | "Teams meeting" | "Workspace Board",
  string
>;

export type ScheduleText = {
  addEvent: string;
  addPrompt: string;
  addTitleFirst: string;
  allDay: string;
  calendarEvents: CalendarEventCopy;
  clearCustom: string;
  cleared: string;
  custom: string;
  customSaved: (count: number) => string;
  dailyAgenda: string;
  defaultLocation: string;
  defaultTitle: string;
  description: string;
  eventAdded: (title: string, month: string, day: number) => string;
  eventTitle: string;
  exportJson: string;
  exported: (count: number) => string;
  location: string;
  locations: CalendarLocationCopy;
  months: string[];
  noCustom: string;
  primary: string;
  removed: string;
  removeEvent: (title: string) => string;
  restored: string;
  scheduled: string;
  TBD: string;
  teamBoard: string;
  time: string;
  weekOf: string;
  weeklyPlanner: string;
  weekdays: string[];
};

export const scheduleText: Record<AppLanguage, ScheduleText> = {
  en: {
    addEvent: "Add event",
    addPrompt: "Add an agenda item to the selected date.",
    addTitleFirst: "Add a title before creating the agenda item.",
    allDay: "All day",
    calendarEvents: {
      "Calendar component QA": "Calendar component QA",
      "Client checkpoint": "Client checkpoint",
      "Content planning": "Content planning",
      "Design review": "Design review",
      "Launch prep": "Launch prep",
      "Product sync": "Product sync",
    },
    clearCustom: "Clear custom",
    cleared: "Custom agenda items cleared.",
    custom: "Custom",
    customSaved: (count: number) => `${count} custom saved`,
    dailyAgenda: "Daily agenda",
    defaultLocation: "Project room",
    defaultTitle: "Stakeholder review",
    description: "Build schedule dashboards, booking sidebars, or staff rosters from the same layout.",
    eventAdded: (title: string, month: string, day: number) => `${title} added to ${month} ${day}.`,
    eventTitle: "Event title",
    exportJson: "Export JSON",
    exported: (count: number) => `${count} custom agenda item${count === 1 ? "" : "s"} exported.`,
    location: "Location",
    locations: {
      "Conference Room": "Conference Room",
      "Operations desk": "Operations desk",
      "Preview sandbox": "Preview sandbox",
      "Studio Room A": "Studio Room A",
      "Teams meeting": "Teams meeting",
      "Workspace Board": "Workspace Board",
    },
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    noCustom: "No custom agenda items to clear.",
    primary: "Primary",
    removed: "Agenda item removed from the selected date.",
    removeEvent: (title: string) => `Remove ${title}`,
    restored: "Schedule board restored from local storage.",
    scheduled: "Scheduled",
    TBD: "TBD",
    teamBoard: "Team availability board",
    time: "Time",
    weekOf: "Week of",
    weeklyPlanner: "Weekly planner",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  ko: {
    addEvent: "일정 추가",
    addPrompt: "선택한 날짜에 일정 항목을 추가해보세요.",
    addTitleFirst: "일정 항목을 만들기 전에 제목을 입력하세요.",
    allDay: "종일",
    calendarEvents: {
      "Calendar component QA": "캘린더 컴포넌트 QA",
      "Client checkpoint": "클라이언트 체크포인트",
      "Content planning": "콘텐츠 기획",
      "Design review": "디자인 리뷰",
      "Launch prep": "출시 준비",
      "Product sync": "제품 동기화",
    },
    clearCustom: "사용자 일정 비우기",
    cleared: "사용자 일정 항목을 모두 지웠습니다.",
    custom: "사용자",
    customSaved: (count: number) => `사용자 일정 ${count}개 저장됨`,
    dailyAgenda: "일간 일정",
    defaultLocation: "프로젝트룸",
    defaultTitle: "이해관계자 리뷰",
    description: "같은 레이아웃으로 일정 대시보드, 예약 사이드바, 직원 로스터를 만들 수 있습니다.",
    eventAdded: (title: string, month: string, day: number) => `${title} 항목을 ${month} ${day}일에 추가했습니다.`,
    eventTitle: "일정 제목",
    exportJson: "JSON 내보내기",
    exported: (count: number) => `사용자 일정 ${count}개를 내보냈습니다.`,
    location: "장소",
    locations: {
      "Conference Room": "회의실",
      "Operations desk": "운영 데스크",
      "Preview sandbox": "미리보기 샌드박스",
      "Studio Room A": "스튜디오 A",
      "Teams meeting": "Teams 회의",
      "Workspace Board": "작업 보드",
    },
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    noCustom: "지울 사용자 일정 항목이 없습니다.",
    primary: "주요",
    removed: "선택한 날짜에서 일정 항목을 제거했습니다.",
    removeEvent: (title: string) => `${title} 제거`,
    restored: "로컬 저장소에서 일정 보드를 복원했습니다.",
    scheduled: "예약됨",
    TBD: "미정",
    teamBoard: "팀 가용성 보드",
    time: "시간",
    weekOf: "주간",
    weeklyPlanner: "주간 플래너",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  },
};
