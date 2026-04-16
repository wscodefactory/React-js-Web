import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

/**
 * Route wrapper for the `navigationBars` component demo.
 * Keeps route modules small while preview content lives in shared data/config files.
 */
export function NavigationBars() {
  return <ComponentShowcasePage config={componentShowcases.navigationBars} />;
}
