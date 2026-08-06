import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function SidebarShowcasePage() {
  return <ComponentShowcasePage config={componentShowcases.sidebar} />;
}
