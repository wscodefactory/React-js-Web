import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Steppers() {
  return <ComponentShowcasePage config={componentShowcases.steppers} />;
}
