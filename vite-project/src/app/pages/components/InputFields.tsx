import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

/**
 * Route wrapper for the `inputFields` component demo.
 * Keeps route modules small while preview content lives in shared data/config files.
 */
export function InputFields() {
  return <ComponentShowcasePage config={componentShowcases.inputFields} />;
}
