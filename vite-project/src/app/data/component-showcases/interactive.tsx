import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';

export const interactiveComponentShowcases = {
  animations: {
    eyebrow: "Motion Library",
    title: "Power Apps",
    titleHighlight: "Animation Components",
    description: "Animated progress and feedback patterns for dashboard-style interfaces.",
    updatedAt: "Sep 1, 2025",
    sections: [
      {
        title: "Animated Line Chart",
        description: "A chart preview with gradient bars, useful for KPI or trend widgets.",
        badge: { label: "PRO", tone: "pro" },
        preview: (
          <div className="h-56 flex items-end gap-2">
            {[20, 35, 25, 45, 55, 40, 60, 75].map((height, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-300"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        ),
      },
      {
        title: "Animated Toggle",
        description: "Segmented controls with animated state transitions for filters and modes.",
        badge: { label: "PRO", tone: "pro" },
        preview: (
          <div className="flex justify-center">
            <div className="inline-flex rounded-full bg-gray-200 p-1 dark:bg-gray-700">
              <button className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white">Text 1</button>
              <button className="px-6 py-2 font-medium text-gray-600 dark:text-gray-300">Text 2</button>
            </div>
          </div>
        ),
      },
    ],
  },
  calendars: {
    eyebrow: "Date Selection",
    title: "Calendars",
    titleHighlight: "Component",
    description: "Calendar layouts and date pickers for reservation, scheduling, and task views.",
    sections: [
      {
        title: "Date Picker",
        description: "A lightweight monthly view for selecting dates in forms.",
        preview: (
          <GhostPanel className="max-w-sm">
            <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>September 2025</span>
              <span>◀ ▶</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => <span key={day} className="text-gray-500">{day}</span>)}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <span
                  key={day}
                  className={`rounded-lg py-2 ${day === 18 ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-200"}`}
                >
                  {day}
                </span>
              ))}
            </div>
          </GhostPanel>
        ),
      },
    ],
  },
  modals: {
    eyebrow: "Focus States",
    title: "Modals",
    titleHighlight: "Component",
    description: "Dialog patterns for confirmations, warnings, and short focused workflows.",
    sections: [
      {
        title: "Confirmation Modal",
        description: "A modal layout for confirming destructive actions or important changes.",
        preview: (
          <div className="flex justify-center">
            <GhostPanel className="w-full max-w-md space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Delete this report?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone after the report is removed.</p>
              </div>
              <div className="flex justify-end gap-2">
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600">Cancel</button>
                <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white">Delete</button>
              </div>
            </GhostPanel>
          </div>
        ),
      },
    ],
  },
  steppers: {
    eyebrow: "Workflow Progress",
    title: "Steppers",
    titleHighlight: "Component",
    description: "Step indicators for onboarding, setup, and multi-step operational flows.",
    sections: [
      {
        title: "Progress Stepper",
        description: "A horizontal stepper for forms, wizard flows, and approvals.",
        preview: (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {["Details", "Setup", "Review", "Launch"].map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-medium ${index < 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}>
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{step}</span>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
