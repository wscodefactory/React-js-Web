import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function NavigationBars() {
  return <ComponentShowcasePage config={componentShowcases.navigationBars} />;
}
