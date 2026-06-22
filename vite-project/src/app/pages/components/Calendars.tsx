import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { calendarShowcaseConfig } from "@/app/features/calendars";

export function Calendars() {
  return <ComponentShowcasePage config={calendarShowcaseConfig} />;
}
