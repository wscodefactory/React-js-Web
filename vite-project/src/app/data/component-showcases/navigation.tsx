import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';
import { useEffect, useState } from 'react';

const segmentedOptions = ['Overview', 'Activity', 'Files'] as const;
const dropdownActions = ['Rename', 'Duplicate', 'Share', 'Archive'] as const;
const dropdownActionStates = ['No action selected', ...dropdownActions] as const;
const navLinks = ['Components', 'Templates', 'Pricing'] as const;
const tabItems = [
  { label: 'Overview', content: 'Overview metrics and summary cards appear here.' },
  { label: 'Details', content: 'Detailed properties, owner notes, and configuration appear here.' },
  { label: 'History', content: 'Recent updates and audit trail entries appear here.' },
] as const;

type SegmentedOption = typeof segmentedOptions[number];
type DropdownActionState = typeof dropdownActionStates[number];
type NavLink = typeof navLinks[number];
type TabLabel = typeof tabItems[number]['label'];

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isStringOption<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && options.includes(value as T);
}

function useStoredPreviewState<T>(
  storageKey: string,
  fallbackValue: T,
  isValue: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return fallbackValue;
    }

    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null') as unknown;
      return isValue(parsed) ? parsed : fallbackValue;
    } catch {
      window.localStorage.removeItem(storageKey);
      return fallbackValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue] as const;
}

function SegmentedControlsPreview() {
  const [active, setActive] = useStoredPreviewState<SegmentedOption>(
    'web5:component-preview:button-group-active:v1',
    segmentedOptions[0],
    (value): value is SegmentedOption => isStringOption(segmentedOptions, value),
  );

  return (
    <div className="space-y-4">
      <div className="inline-flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        {segmentedOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setActive(option)}
            className={`px-5 py-2 text-sm font-medium transition ${
              active === option
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">Selected segment: {active}</p>
    </div>
  );
}

function DropdownPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useStoredPreviewState<DropdownActionState>(
    'web5:component-preview:dropdown-action:v1',
    'No action selected',
    (value): value is DropdownActionState => isStringOption(dropdownActionStates, value),
  );

  return (
    <div className="relative max-w-xs">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
      >
        Actions
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen ? (
        <GhostPanel className="absolute left-0 top-14 z-10 w-full space-y-2 bg-white shadow-xl dark:bg-gray-900">
          {dropdownActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => {
                setSelectedAction(action);
                setIsOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {action}
            </button>
          ))}
        </GhostPanel>
      ) : null}
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{selectedAction}</p>
    </div>
  );
}

function NavigationBarPreview() {
  const [activeLink, setActiveLink] = useStoredPreviewState<NavLink>(
    'web5:component-preview:navigation-link:v1',
    navLinks[0],
    (value): value is NavLink => isStringOption(navLinks, value),
  );
  const [started, setStarted] = useStoredPreviewState(
    'web5:component-preview:navigation-started:v1',
    false,
    isBoolean,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
        <span className="font-semibold text-gray-900 dark:text-white">Power UI</span>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
          {navLinks.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => setActiveLink(link)}
              className={`rounded-lg px-3 py-2 transition ${activeLink === link ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-900' : 'hover:bg-white/70 dark:hover:bg-gray-900'}`}
            >
              {link}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStarted((current) => !current)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          {started ? 'Started' : 'Get started'}
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">Current route: {activeLink}</p>
    </div>
  );
}

function TabsPreview() {
  const [activeTab, setActiveTab] = useStoredPreviewState<TabLabel>(
    'web5:component-preview:tabs-active:v1',
    tabItems[0].label,
    (value): value is TabLabel => isStringOption(tabItems.map((tab) => tab.label), value),
  );
  const activeContent = tabItems.find((tab) => tab.label === activeTab)?.content ?? tabItems[0].content;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
        {tabItems.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.label ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <GhostPanel>{activeContent}</GhostPanel>
    </div>
  );
}

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
        preview: <SegmentedControlsPreview />,
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
        preview: <DropdownPreview />,
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
        preview: <NavigationBarPreview />,
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
        preview: <TabsPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
