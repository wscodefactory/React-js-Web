import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

export function InputFields() {
  return <ComponentShowcasePage config={componentShowcases.inputFields} />;
}
