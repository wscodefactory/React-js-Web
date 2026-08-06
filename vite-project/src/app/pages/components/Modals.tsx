import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Modals() {
  return <ComponentShowcasePage config={componentShowcases.modals} />;
}
