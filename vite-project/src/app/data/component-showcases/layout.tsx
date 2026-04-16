import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';

export const layoutComponentShowcases = {
  appShells: {
    eyebrow: "Layout System",
    title: "App Shells",
    titleHighlight: "Component",
    description: "Application shell patterns with navigation, utility panels, and content regions.",
    sections: [
      {
        title: "Dashboard Shell",
        description: "A foundational layout for admin tools and internal dashboards.",
        badge: { label: "FEATURED", tone: "featured" },
        preview: (
          <div className="grid gap-4 md:grid-cols-[220px_1fr]">
            <GhostPanel className="space-y-2">
              <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-8 rounded bg-gray-200 dark:bg-gray-700" />
            </GhostPanel>
            <GhostPanel className="space-y-3">
              <div className="h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
              <div className="grid gap-3 md:grid-cols-3">
                <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700" />
              </div>
            </GhostPanel>
          </div>
        ),
      },
    ],
  },
  cards: {
    eyebrow: "Content Surfaces",
    title: "Cards",
    titleHighlight: "Component",
    description: "Card patterns for presenting products, metrics, and grouped content blocks.",
    sections: [
      {
        title: "Product Card",
        description: "A product summary card with metadata and call-to-action affordances.",
        preview: (
          <GhostPanel className="max-w-sm space-y-3">
            <div className="h-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Starter Kit</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pre-built dashboard sections and onboarding templates.</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">$49</span>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">View details</button>
            </div>
          </GhostPanel>
        ),
      },
    ],
  },
  drawer: {
    eyebrow: "Panels & Overlays",
    title: "Drawer",
    titleHighlight: "Component",
    description: "Slide-out panels for secondary navigation, forms, and side detail views.",
    sections: [
      {
        title: "Side Drawer",
        description: "A compact details panel that slides over the main canvas.",
        preview: (
          <div className="grid md:grid-cols-[1fr_280px]">
            <div className="min-h-56 rounded-l-xl bg-gray-100 dark:bg-gray-800" />
            <div className="min-h-56 rounded-r-xl border-l border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Team settings</h4>
              <div className="space-y-2">
                <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
                <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
                <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  sidebar: {
    eyebrow: "Navigation Patterns",
    title: "Sidebar",
    titleHighlight: "Component",
    description: "Sidebar layouts for dashboards, settings areas, and information-dense workflows.",
    sections: [
      {
        title: "Collapsible Sidebar",
        description: "A two-column shell with a dedicated side navigation region.",
        preview: (
          <div className="grid gap-4 md:grid-cols-[240px_1fr]">
            <GhostPanel className="space-y-2">
              {["Overview", "Projects", "Reports", "Settings"].map((item, index) => (
                <div key={item} className={`rounded-lg px-3 py-2 text-sm ${index === 0 ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200"}`}>
                  {item}
                </div>
              ))}
            </GhostPanel>
            <GhostPanel className="h-56" />
          </div>
        ),
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
