import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

/**
 * Route wrapper for the `dropdowns` component demo.
 * Keeps route modules small while preview content lives in shared data/config files.
 */
export function Dropdowns() {
  return <ComponentShowcasePage config={componentShowcases.dropdowns} />;
}
