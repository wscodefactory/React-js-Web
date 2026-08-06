import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Accordions() {
  return <ComponentShowcasePage config={componentShowcases.accordions} />;
}
