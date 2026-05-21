import { ComponentShowcasePage } from "@/app/components/showcase/ComponentShowcasePage";
import { componentShowcases } from "@/app/data/componentShowcases";

/**
 * Route wrapper for the `tabs` component demo.
 * Keeps route modules small while preview content lives in shared data/config files.
 */
export function Tabs() {
  return <ComponentShowcasePage config={componentShowcases.tabs} />;
}
