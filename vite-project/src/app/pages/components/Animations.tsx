import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

/**
 * Route wrapper for the `animations` component demo.
 * Keeps route modules small while preview content lives in shared data/config files.
 */
export function Animations() {
  return <ComponentShowcasePage config={componentShowcases.animations} />;
}
