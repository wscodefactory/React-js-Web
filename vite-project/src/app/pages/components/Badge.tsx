import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Badge() {
  return <ComponentShowcasePage config={componentShowcases.badge} />;
}
