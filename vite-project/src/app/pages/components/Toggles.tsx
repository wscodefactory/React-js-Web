import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Toggles() {
  return <ComponentShowcasePage config={componentShowcases.toggles} />;
}
