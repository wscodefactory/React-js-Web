import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';

export const navigationComponentShowcases = {
  buttonGroup: {
    eyebrow: "Action Clusters",
    title: "Button Group",
    titleHighlight: "Component",
    description: "Grouped controls for mode switching, segmented filters, and compact actions.",
    sections: [
      {
        title: "Segmented Controls",
        description: "Connected buttons for switching between closely related options.",
        preview: (
          <div className="inline-flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <button className="bg-blue-600 px-5 py-2 text-sm font-medium text-white">Overview</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Activity</button>
            <button className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Files</button>
          </div>
        ),
      },
    ],
  },
  dropdowns: {
    eyebrow: "Selection Menus",
    title: "Dropdowns",
    titleHighlight: "Component",
    description: "Dropdown patterns for action menus, filters, and contextual selections.",
    sections: [
      {
        title: "Menu Dropdown",
        description: "Contextual menus with grouped actions and hover states.",
        preview: (
          <GhostPanel className="max-w-xs space-y-2">
            {["Rename", "Duplicate", "Share", "Archive"].map((item) => (
              <div key={item} className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                {item}
              </div>
            ))}
          </GhostPanel>
        ),
      },
    ],
  },
  navigationBars: {
    eyebrow: "Global Navigation",
    title: "Navigation Bars",
    titleHighlight: "Component",
    description: "Top-level navigation patterns for product shells and marketing sites.",
    sections: [
      {
        title: "Top Navigation",
        description: "A responsive navbar with logo, links, and utility actions.",
        preview: (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
            <span className="font-semibold text-gray-900 dark:text-white">Power UI</span>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span>Components</span>
              <span>Templates</span>
              <span>Pricing</span>
            </div>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">Get started</button>
          </div>
        ),
      },
    ],
  },
  tabs: {
    eyebrow: "Content Switching",
    title: "Tabs",
    titleHighlight: "Component",
    description: "Tabbed content areas for dashboards, settings groups, and dense content modules.",
    sections: [
      {
        title: "Horizontal Tabs",
        description: "A standard tab strip with a focused active state.",
        preview: (
          <div className="space-y-4">
            <div className="flex gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">Overview</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Details</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">History</button>
            </div>
            <GhostPanel>Panel content appears here.</GhostPanel>
          </div>
        ),
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
