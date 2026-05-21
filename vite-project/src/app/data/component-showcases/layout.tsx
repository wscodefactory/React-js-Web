import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';
import { useState } from 'react';

function AppShellPreview() {
  const navItems = ['Dashboard', 'Reports', 'Team', 'Settings'];
  const [activeNav, setActiveNav] = useState(navItems[0]);
  const [compact, setCompact] = useState(false);

  return (
    <div className={`grid gap-4 ${compact ? 'md:grid-cols-[160px_1fr]' : 'md:grid-cols-[220px_1fr]'}`}>
      <GhostPanel className="space-y-2">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <button
            type="button"
            onClick={() => setCompact((current) => !current)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            {compact ? 'Wide' : 'Compact'}
          </button>
        </div>
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setActiveNav(item)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              activeNav === item ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {item}
          </button>
        ))}
      </GhostPanel>
      <GhostPanel className="space-y-3">
        <div className="flex h-12 items-center justify-between rounded-xl bg-gray-200 px-4 dark:bg-gray-700">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{activeNav}</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            {compact ? 'Compact shell' : 'Comfort shell'}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 rounded-xl bg-gray-200 p-3 dark:bg-gray-700">
              <div className="h-3 w-16 rounded bg-white/70 dark:bg-gray-900/70" />
            </div>
          ))}
        </div>
      </GhostPanel>
    </div>
  );
}

function ProductCardPreview() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <GhostPanel className="max-w-sm space-y-3">
      <div className="h-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Starter Kit</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">Pre-built dashboard sections and onboarding templates.</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">$49</span>
        <button
          type="button"
          onClick={() => setShowDetails((current) => !current)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          {showDetails ? 'Hide details' : 'View details'}
        </button>
      </div>
      {showDetails ? (
        <div className="rounded-xl bg-white p-3 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          Includes KPI cards, chart shells, activity feeds, and responsive dashboard spacing.
        </div>
      ) : null}
    </GhostPanel>
  );
}

function DrawerPreview() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
      >
        {isOpen ? 'Close drawer' : 'Open drawer'}
      </button>
      <div className={isOpen ? 'grid md:grid-cols-[1fr_280px]' : 'grid'}>
        <div className={`min-h-56 bg-gray-100 dark:bg-gray-800 ${isOpen ? 'rounded-l-xl' : 'rounded-xl'}`} />
        {isOpen ? (
          <div className="min-h-56 rounded-r-xl border-l border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Team settings</h4>
            <div className="space-y-2">
              <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SidebarPreview() {
  const items = ['Overview', 'Projects', 'Reports', 'Settings'];
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(items[0]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsCollapsed((current) => !current)}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
      >
        {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      </button>
      <div className={`grid gap-4 ${isCollapsed ? 'md:grid-cols-[88px_1fr]' : 'md:grid-cols-[240px_1fr]'}`}>
        <GhostPanel className="space-y-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveItem(item)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                activeItem === item ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {isCollapsed ? item.slice(0, 1) : item}
            </button>
          ))}
        </GhostPanel>
        <GhostPanel className="h-56">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active section: {activeItem}</p>
        </GhostPanel>
      </div>
    </div>
  );
}

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
        preview: <AppShellPreview />,
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
        preview: <ProductCardPreview />,
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
        preview: <DrawerPreview />,
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
        preview: <SidebarPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
