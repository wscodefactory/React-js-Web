import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function ButtonGroup() {
  return <ComponentShowcasePage config={componentShowcases.buttonGroup} />;
}
