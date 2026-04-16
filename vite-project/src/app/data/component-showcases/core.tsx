import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel, PreviewStack } from './helpers';

export const coreComponentShowcases = {
  accordions: {
    eyebrow: "Power Apps UI",
    title: "Power Apps",
    titleHighlight: "Accordion Components",
    description:
      "Collapsible content sections for FAQs, settings panels, and organized information layouts.",
    updatedAt: "Sep 1, 2025",
    sections: [
      {
        title: "Accordion Plus",
        description: "Animated plus/minus accordions for dense settings or help content.",
        badge: { label: "PRO", tone: "pro" },
        preview: (
          <PreviewStack>
            {[
              "Why should I use accordions in my Power Apps?",
              "How do accordions improve mobile responsiveness?",
              "Are accordions difficult to implement in Power Apps?",
            ].map((label) => (
              <GhostPanel key={label}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                  <span className="text-2xl text-gray-500">+</span>
                </div>
              </GhostPanel>
            ))}
          </PreviewStack>
        ),
      },
      {
        title: "Classic Accordion",
        description: "Simple stacked headings for documentation and answers.",
        badge: { label: "FREE", tone: "free" },
        preview: (
          <PreviewStack>
            {[
              "How do I import custom icons?",
              "Where can I learn more Power Apps design tricks?",
              "Why do most Power Apps look outdated?",
            ].map((label) => (
              <div key={label} className="border-b border-gray-200 pb-3 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                  <span className="text-sm text-gray-500">▼</span>
                </div>
              </div>
            ))}
          </PreviewStack>
        ),
      },
    ],
  },
  badge: {
    eyebrow: "Status Indicators",
    title: "Badge",
    titleHighlight: "Component",
    description: "Compact status labels for priorities, system states, and release markers.",
    sections: [
      {
        title: "Status Badges",
        description: "Reusable badges for success, warning, draft, and reviewed states.",
        badge: { label: "NEW", tone: "new" },
        preview: (
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">Active</span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">Pending</span>
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/50 dark:text-red-300">Blocked</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">Reviewed</span>
          </div>
        ),
      },
    ],
  },
  buttons: {
    eyebrow: "Action Library",
    title: "Power Apps",
    titleHighlight: "Button Components",
    description: "Primary, secondary, and icon button patterns for common app actions.",
    updatedAt: "Sep 1, 2025",
    sections: [
      {
        title: "Primary Button",
        description: "Main action buttons with distinct priority styling.",
        badge: { label: "FREE", tone: "free" },
        preview: (
          <div className="flex flex-wrap gap-4">
            <button className="rounded-md bg-blue-600 px-6 py-2 text-white">Primary</button>
            <button className="rounded-md bg-gray-600 px-6 py-2 text-white">Secondary</button>
            <button className="rounded-md bg-green-600 px-6 py-2 text-white">Success</button>
            <button className="rounded-md bg-red-600 px-6 py-2 text-white">Danger</button>
          </div>
        ),
      },
      {
        title: "Outline Buttons",
        description: "Lighter emphasis buttons for secondary flows.",
        badge: { label: "PRO", tone: "pro" },
        preview: (
          <div className="flex flex-wrap gap-4">
            <button className="rounded-md border-2 border-blue-600 px-6 py-2 text-blue-600">Primary</button>
            <button className="rounded-md border-2 border-gray-500 px-6 py-2 text-gray-600 dark:text-gray-300">Secondary</button>
            <button className="rounded-md border-2 border-green-600 px-6 py-2 text-green-600">Success</button>
          </div>
        ),
      },
      {
        title: "Icon Buttons",
        description: "Buttons that combine icon hints with action labels.",
        badge: { label: "PRO", tone: "pro" },
        preview: (
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white"><span>➕</span>Add New</button>
            <button className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-white"><span>🗑️</span>Delete</button>
            <button className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-2 text-white"><span>✓</span>Confirm</button>
          </div>
        ),
      },
    ],
  },
  inputFields: {
    eyebrow: "Form Controls",
    title: "Input Fields",
    titleHighlight: "Component",
    description: "Input controls for forms, search, validation, and user data entry.",
    sections: [
      {
        title: "Text Input",
        description: "A standard text field with validation status and helper text support.",
        badge: { label: "NEW", tone: "new" },
        preview: (
          <div className="max-w-lg space-y-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Project name</label>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Enter a project name"
                readOnly
              />
            </div>
            <p className="text-sm text-gray-500">Used in dashboards, reports, and notification emails.</p>
          </div>
        ),
      },
    ],
  },
  toggles: {
    eyebrow: "Binary Controls",
    title: "Toggles",
    titleHighlight: "Component",
    description: "Toggle controls for preference changes, feature flags, and small configuration states.",
    sections: [
      {
        title: "Switch Toggle",
        description: "A standard binary switch with clear enabled and disabled states.",
        preview: (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Notifications</span>
            <div className="flex h-8 w-14 items-center rounded-full bg-blue-600 px-1">
              <div className="ml-auto h-6 w-6 rounded-full bg-white" />
            </div>
          </div>
        ),
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
