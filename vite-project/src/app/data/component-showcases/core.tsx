import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel, PreviewStack } from './helpers';
import { useState } from 'react';

function InteractiveAccordionPreview({ items, variant }: { items: string[]; variant: 'plus' | 'classic' }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <PreviewStack>
      {items.map((label, index) => {
        const isOpen = openIndex === index;

        return (
          <GhostPanel key={label}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="font-medium text-gray-900 dark:text-white">{label}</span>
              <span className="text-xl text-gray-500">{variant === 'plus' ? (isOpen ? '-' : '+') : isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen ? (
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                This panel is open. Click another row to move the active state or click this row again to collapse it.
              </p>
            ) : null}
          </GhostPanel>
        );
      })}
    </PreviewStack>
  );
}

function ButtonActionPreview({ variant }: { variant: 'solid' | 'outline' | 'icon' }) {
  const [activeAction, setActiveAction] = useState('Primary');
  const solidActions = ['Primary', 'Secondary', 'Success', 'Danger'];
  const outlineActions = ['Primary', 'Secondary', 'Success'];
  const iconActions = ['Add New', 'Delete', 'Confirm'];
  const actions = variant === 'solid' ? solidActions : variant === 'outline' ? outlineActions : iconActions;

  const baseClass = 'rounded-md px-6 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400';
  const solidClassMap: Record<string, string> = {
    Primary: 'bg-blue-600 text-white',
    Secondary: 'bg-gray-600 text-white',
    Success: 'bg-green-600 text-white',
    Danger: 'bg-red-600 text-white',
  };
  const outlineClassMap: Record<string, string> = {
    Primary: 'border-2 border-blue-600 text-blue-600',
    Secondary: 'border-2 border-gray-500 text-gray-600 dark:text-gray-300',
    Success: 'border-2 border-green-600 text-green-600',
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setActiveAction(action)}
            className={[
              baseClass,
              variant === 'solid' ? solidClassMap[action] : '',
              variant === 'outline' ? outlineClassMap[action] : '',
              variant === 'icon' ? 'flex items-center gap-2 bg-blue-600 text-white' : '',
              activeAction === action ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : '',
            ].join(' ')}
          >
            {variant === 'icon' ? <span aria-hidden="true">{action === 'Add New' ? '+' : action === 'Delete' ? '-' : '✓'}</span> : null}
            {action}
          </button>
        ))}
      </div>
      <p className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Last action: <span className="font-semibold">{activeAction}</span>
      </p>
    </div>
  );
}

function EditableInputPreview() {
  const [value, setValue] = useState('Launch dashboard');
  const isValid = value.trim().length >= 3;

  return (
    <div className="max-w-lg space-y-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Project name</label>
        <input
          className={`w-full rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none transition dark:bg-gray-900 dark:text-white ${
            isValid ? 'border-green-500 focus:ring-2 focus:ring-green-200' : 'border-red-500 focus:ring-2 focus:ring-red-200'
          }`}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Enter a project name"
        />
      </div>
      <p className={`text-sm ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isValid ? `${value.trim().length} characters ready for use.` : 'Project name must be at least 3 characters.'}
      </p>
    </div>
  );
}

function TogglePreview() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 dark:text-gray-300">Notifications</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((current) => !current)}
        className={`flex h-8 w-14 items-center rounded-full px-1 transition ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
      >
        <span className={`h-6 w-6 rounded-full bg-white transition ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{enabled ? 'On' : 'Off'}</span>
    </div>
  );
}

function StatusBadgePreview() {
  const statuses = [
    { label: 'Active', className: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' },
    { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' },
    { label: 'Blocked', className: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' },
    { label: 'Reviewed', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  ];
  const [activeStatus, setActiveStatus] = useState(statuses[0].label);
  const [reviewCount, setReviewCount] = useState(12);
  const activeClassName = statuses.find((status) => status.label === activeStatus)?.className ?? statuses[0].className;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status.label}
            type="button"
            onClick={() => setActiveStatus(status.label)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${status.className} ${
              activeStatus === status.label ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
      <GhostPanel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Selected status</p>
          <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${activeClassName}`}>{activeStatus}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
            {reviewCount} items
          </span>
          <button
            type="button"
            onClick={() => setReviewCount((count) => count + 1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Increment
          </button>
        </div>
      </GhostPanel>
    </div>
  );
}

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
          <InteractiveAccordionPreview
            variant="plus"
            items={[
              "Why should I use accordions in my Power Apps?",
              "How do accordions improve mobile responsiveness?",
              "Are accordions difficult to implement in Power Apps?",
            ]}
          />
        ),
      },
      {
        title: "Classic Accordion",
        description: "Simple stacked headings for documentation and answers.",
        badge: { label: "FREE", tone: "free" },
        preview: (
          <InteractiveAccordionPreview
            variant="classic"
            items={[
              "How do I import custom icons?",
              "Where can I learn more Power Apps design tricks?",
              "Why do most Power Apps look outdated?",
            ]}
          />
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
        preview: <StatusBadgePreview />,
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
        preview: <ButtonActionPreview variant="solid" />,
      },
      {
        title: "Outline Buttons",
        description: "Lighter emphasis buttons for secondary flows.",
        badge: { label: "PRO", tone: "pro" },
        preview: <ButtonActionPreview variant="outline" />,
      },
      {
        title: "Icon Buttons",
        description: "Buttons that combine icon hints with action labels.",
        badge: { label: "PRO", tone: "pro" },
        preview: <ButtonActionPreview variant="icon" />,
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
        preview: <EditableInputPreview />,
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
        preview: <TogglePreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
