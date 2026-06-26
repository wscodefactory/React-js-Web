import { useLanguage } from "@/app/context/LanguageContext";
import { DatePickerCalendarPanel } from "./DatePickerCalendarPanel";
import { DatePickerSummaryPanel } from "./DatePickerSummaryPanel";
import { useCalendarDatePickerController } from "./useCalendarDatePickerController";

export function CalendarDatePickerPreview() {
  const { language } = useLanguage();
  const datePicker = useCalendarDatePickerController(language);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_280px]">
      <DatePickerCalendarPanel
        language={language}
        monthCells={datePicker.monthCells}
        onMoveMonth={datePicker.moveMonth}
        onSelectDate={datePicker.selectDate}
        selectedDate={datePicker.selectedDate}
        text={datePicker.text}
        today={datePicker.today}
        viewDate={datePicker.viewDate}
      />
      <DatePickerSummaryPanel
        language={language}
        onJumpToToday={datePicker.jumpToToday}
        selectedDate={datePicker.selectedDate}
        text={datePicker.text}
      />
    </div>
  );
}
