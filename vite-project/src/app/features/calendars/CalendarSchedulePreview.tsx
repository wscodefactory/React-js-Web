import { useLanguage } from "@/app/context/LanguageContext";
import { CalendarWeekBoard } from "./CalendarWeekBoard";
import { DailyAgendaPanel } from "./DailyAgendaPanel";
import { useCalendarScheduleController } from "./useCalendarScheduleController";

export function CalendarSchedulePreview() {
  const { language } = useLanguage();
  const schedule = useCalendarScheduleController(language);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
      <CalendarWeekBoard
        customEvents={schedule.customEvents}
        onMoveWeek={schedule.moveWeek}
        onSelectDate={schedule.selectDate}
        selectedDate={schedule.selectedDate}
        text={schedule.text}
        weekDates={schedule.weekDates}
      />
      <DailyAgendaPanel
        customEventCount={schedule.customEventCount}
        draftLocation={schedule.draftLocation}
        draftTime={schedule.draftTime}
        draftTitle={schedule.draftTitle}
        events={schedule.events}
        language={language}
        onAddEvent={schedule.handleAddEvent}
        onClearCustomEvents={schedule.handleClearCustomEvents}
        onDownloadSchedule={schedule.handleDownloadSchedule}
        onRemoveEvent={schedule.handleRemoveEvent}
        onUpdateDraftLocation={schedule.setDraftLocation}
        onUpdateDraftTime={schedule.setDraftTime}
        onUpdateDraftTitle={schedule.setDraftTitle}
        selectedDate={schedule.selectedDate}
        status={schedule.status}
        text={schedule.text}
      />
    </div>
  );
}
