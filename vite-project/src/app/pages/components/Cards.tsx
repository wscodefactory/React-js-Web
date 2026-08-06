import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Cards() {
  return <ComponentShowcasePage config={componentShowcases.cards} />;
}
