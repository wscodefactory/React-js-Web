import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Tabs() {
  return <ComponentShowcasePage config={componentShowcases.tabs} />;
}
