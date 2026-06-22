import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, Download, MapPin, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { eventPalette } from "./data";
import { formatDateKey, getEventsForDate, normalizeDate, parseDateKey } from "./calendarUtils";
import type { CalendarEvent } from "./types";

type StoredScheduleDraft = {
  customEvents: Record<string, CalendarEvent[]>;
  draftLocation: string;
  draftTime: string;
  draftTitle: string;
  selectedDateKey: string;
};

const scheduleStorageKey = "web5:calendar-schedule-board:v1";

const scheduleText = {
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
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
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
    restored: "로컬 저장소에서 스케줄 보드를 복원했습니다.",
    scheduled: "예약됨",
    TBD: "미정",
    teamBoard: "팀 가용성 보드",
    time: "시간",
    weekOf: "주간",
    weeklyPlanner: "주간 플래너",
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
  },
} as const;

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

function readStoredScheduleDraft(): StoredScheduleDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(scheduleStorageKey) ?? "null") as Partial<StoredScheduleDraft> | null;
    if (!parsed) {
      return null;
    }

    const selectedDateKey = typeof parsed.selectedDateKey === "string" ? parsed.selectedDateKey : undefined;

    if (!selectedDateKey || !parseDateKey(selectedDateKey)) {
      return null;
    }

    const customEvents = Object.entries(parsed.customEvents ?? {}).reduce<Record<string, CalendarEvent[]>>((eventsByDate, [dateKey, events]) => {
      if (parseDateKey(dateKey) && Array.isArray(events)) {
        const validEvents = events.filter(isCalendarEvent);
        if (validEvents.length > 0) {
          eventsByDate[dateKey] = validEvents;
        }
      }

      return eventsByDate;
    }, {});

    return {
      customEvents,
      draftLocation: typeof parsed.draftLocation === "string" ? parsed.draftLocation : "Project room",
      draftTime: typeof parsed.draftTime === "string" ? parsed.draftTime : "13:00 - 13:30",
      draftTitle: typeof parsed.draftTitle === "string" ? parsed.draftTitle : "Stakeholder review",
      selectedDateKey,
    };
  } catch {
    window.localStorage.removeItem(scheduleStorageKey);
    return null;
  }
}

function countCustomEvents(customEvents: Record<string, CalendarEvent[]>) {
  return Object.values(customEvents).reduce((total, events) => total + events.length, 0);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function CalendarSchedulePreview() {
  const { language } = useLanguage();
  const text = scheduleText[language];
  const [initialDraft] = useState(readStoredScheduleDraft);
  const [viewDate, setViewDate] = useState(() => parseDateKey(initialDraft?.selectedDateKey) ?? normalizeDate(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => parseDateKey(initialDraft?.selectedDateKey) ?? normalizeDate(new Date()));
  const [customEvents, setCustomEvents] = useState<Record<string, CalendarEvent[]>>(() => initialDraft?.customEvents ?? {});
  const [draftTitle, setDraftTitle] = useState(initialDraft?.draftTitle ?? text.defaultTitle);
  const [draftTime, setDraftTime] = useState(initialDraft?.draftTime ?? "13:00 - 13:30");
  const [draftLocation, setDraftLocation] = useState(initialDraft?.draftLocation ?? text.defaultLocation);
  const [status, setStatus] = useState<string>(() => (initialDraft ? text.restored : text.addPrompt));

  const weekDates = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
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
    const draft: StoredScheduleDraft = {
      customEvents,
      draftLocation,
      draftTime,
      draftTitle,
      selectedDateKey,
    };

    window.localStorage.setItem(scheduleStorageKey, JSON.stringify(draft));
  }, [customEvents, draftLocation, draftTime, draftTitle, selectedDateKey]);

  function moveWeek(offset: number) {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + offset * 7);
      return normalizeDate(next);
    });
    setViewDate((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + offset * 7);
      return normalizeDate(next);
    });
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

    setCustomEvents((current) => ({
      ...current,
      [selectedDateKey]: [...(current[selectedDateKey] ?? []), nextEvent],
    }));
    setStatus(text.eventAdded(nextEvent.title, text.months[selectedDate.getMonth()], selectedDate.getDate()));
    setDraftTitle("");
  }

  function handleRemoveEvent(eventId: string) {
    setCustomEvents((current) => {
      const nextEvents = (current[selectedDateKey] ?? []).filter((event) => event.id !== eventId);
      const nextCustomEvents = { ...current };

      if (nextEvents.length > 0) {
        nextCustomEvents[selectedDateKey] = nextEvents;
      } else {
        delete nextCustomEvents[selectedDateKey];
      }

      return nextCustomEvents;
    });
    setStatus(text.removed);
  }

  function handleDownloadSchedule() {
    const payload = {
      customEvents,
      exportedAt: new Date().toISOString(),
      selectedDate: selectedDateKey,
      selectedDateEvents: events,
      totalCustomEvents: customEventCount,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    downloadBlob(blob, `calendar-schedule-${selectedDateKey}.json`);
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

  function formatDisplayDate(date: Date) {
    return date.toLocaleDateString(language === "ko" ? "ko-KR" : "en-US", {
      day: "numeric",
      month: "long",
      weekday: "long",
      year: "numeric",
    });
  }

  function getEventTitle(event: CalendarEvent) {
    return text.calendarEvents[event.title as keyof typeof text.calendarEvents] ?? event.title;
  }

  function getEventLocation(event: CalendarEvent) {
    return text.locations[event.location as keyof typeof text.locations] ?? event.location;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{text.weeklyPlanner}</p>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{text.teamBoard}</h4>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => moveWeek(-1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => moveWeek(1)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-7">
          {weekDates.map((date) => {
            const isSelected = date.getTime() === selectedDate.getTime();
            const dateKey = formatDateKey(date);
            const dailyEvents = [...getEventsForDate(date), ...(customEvents[dateKey] ?? [])];

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  setViewDate(date);
                }}
                className={[
                  "rounded-2xl border p-3 text-left transition",
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md shadow-green-500/10 dark:border-green-500 dark:bg-green-950/30"
                    : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{text.weekdays[date.getDay()]}</p>
                <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{date.getDate()}</p>
                <div className="mt-3 space-y-2">
                  {dailyEvents.slice(0, 2).map((event, index) => (
                    <div key={`${event.title}-${index}`} className={`rounded-xl px-2 py-2 text-xs font-medium ${eventPalette[index % eventPalette.length]}`}>
                      {getEventTitle(event)}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">{text.dailyAgenda}</p>
        <h4 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{formatDisplayDate(selectedDate)}</h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text.description}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          <button type="button" onClick={handleDownloadSchedule} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            <Download className="h-4 w-4" />
            {text.exportJson}
          </button>
          <button type="button" onClick={handleClearCustomEvents} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800" disabled={customEventCount === 0}>
            <RotateCcw className="h-4 w-4" />
            {text.clearCustom}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {events.map((event, index) => (
            <div key={event.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h5 className="font-semibold text-gray-900 dark:text-white">{getEventTitle(event)}</h5>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${eventPalette[index % eventPalette.length]}`}>
                    {event.id.startsWith("custom") ? text.custom : index === 0 ? text.primary : text.scheduled}
                  </span>
                  {event.id.startsWith("custom") ? (
                    <button type="button" onClick={() => handleRemoveEvent(event.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-300" aria-label={text.removeEvent(event.title)}>
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
                  <span>{getEventLocation(event)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <h5 className="font-semibold text-gray-900 dark:text-white">{text.addEvent}</h5>
          <div className="mt-3 grid gap-2">
            <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white" placeholder={text.eventTitle} />
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={draftTime} onChange={(event) => setDraftTime(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white" placeholder={text.time} />
              <input value={draftLocation} onChange={(event) => setDraftLocation(event.target.value)} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-950 dark:text-white" placeholder={text.location} />
            </div>
            <button type="button" onClick={handleAddEvent} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
              <Plus className="h-4 w-4" />
              {text.addEvent}
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{status}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {text.weekOf} {text.months[viewDate.getMonth()]} {viewDate.getDate()}, {viewDate.getFullYear()} / {text.customSaved(customEventCount)}
        </div>
      </aside>
    </div>
  );
}
