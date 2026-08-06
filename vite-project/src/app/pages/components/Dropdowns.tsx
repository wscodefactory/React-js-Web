import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Dropdowns() {
  return <ComponentShowcasePage config={componentShowcases.dropdowns} />;
}
