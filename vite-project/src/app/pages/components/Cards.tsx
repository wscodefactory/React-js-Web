import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

/**
 * Route wrapper for the `cards` component demo.
 * Keeps route modules small while preview content lives in shared data/config files.
 */
export function Cards() {
  return <ComponentShowcasePage config={componentShowcases.cards} />;
}
