import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Animations() {
  return <ComponentShowcasePage config={componentShowcases.animations} />;
}
