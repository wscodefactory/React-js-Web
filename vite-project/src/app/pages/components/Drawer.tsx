import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Drawer() {
  return <ComponentShowcasePage config={componentShowcases.drawer} />;
}
