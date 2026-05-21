import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';
import { useState } from 'react';

function SegmentedControlsPreview() {
  const options = ['Overview', 'Activity', 'Files'];
  const [active, setActive] = useState(options[0]);

  return (
    <div className="space-y-4">
      <div className="inline-flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        {options.map((option) => (
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
  const actions = ['Rename', 'Duplicate', 'Share', 'Archive'];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('No action selected');

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
          {actions.map((action) => (
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
  const links = ['Components', 'Templates', 'Pricing'];
  const [activeLink, setActiveLink] = useState(links[0]);
  const [started, setStarted] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
        <span className="font-semibold text-gray-900 dark:text-white">Power UI</span>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
          {links.map((link) => (
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
  const tabs = [
    { label: 'Overview', content: 'Overview metrics and summary cards appear here.' },
    { label: 'Details', content: 'Detailed properties, owner notes, and configuration appear here.' },
    { label: 'History', content: 'Recent updates and audit trail entries appear here.' },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const activeContent = tabs.find((tab) => tab.label === activeTab)?.content ?? tabs[0].content;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 dark:border-gray-700">
        {tabs.map((tab) => (
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
