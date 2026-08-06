import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function Gallery() {
  return <ComponentShowcasePage config={componentShowcases.gallery} />;
}
