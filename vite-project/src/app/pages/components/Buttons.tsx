import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Buttons() {
  return <ComponentShowcasePage config={componentShowcases.buttons} />;
}
