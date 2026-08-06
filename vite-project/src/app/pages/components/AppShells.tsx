import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function AppShells() {
  return <ComponentShowcasePage config={componentShowcases.appShells} />;
}
