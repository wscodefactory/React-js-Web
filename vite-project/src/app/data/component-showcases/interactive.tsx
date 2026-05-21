import type { ComponentShowcaseConfig } from '@/app/types/component-showcase';
import { GhostPanel } from './helpers';
import { useState } from 'react';

function AnimatedLineChartPreview() {
  const [expanded, setExpanded] = useState(false);
  const heights = expanded ? [72, 46, 82, 55, 88, 63, 70, 94] : [20, 35, 25, 45, 55, 40, 60, 75];

  return (
    <div className="space-y-4">
      <div className="flex h-56 items-end gap-2">
        {heights.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-300 transition-all duration-500"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {expanded ? 'Show baseline data' : 'Animate new data'}
      </button>
    </div>
  );
}

function AnimatedTogglePreview() {
  const [active, setActive] = useState('Text 1');

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="inline-flex rounded-full bg-gray-200 p-1 dark:bg-gray-700">
        {['Text 1', 'Text 2'].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(label)}
            className={`rounded-full px-6 py-2 font-medium transition ${
              active === label ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">Active option: {active}</p>
    </div>
  );
}

function ModalPreview() {
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState('Waiting for confirmation');

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStatus('Waiting for confirmation');
        }}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
      >
        Open modal
      </button>

      {isOpen ? (
        <GhostPanel className="w-full max-w-md space-y-4 shadow-xl">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Delete this report?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone after the report is removed.</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setStatus('Cancelled');
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setStatus('Report deleted');
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </GhostPanel>
      ) : null}

      <p className="text-sm text-gray-600 dark:text-gray-400">Status: {status}</p>
    </div>
  );
}

function StepperPreview() {
  const steps = ['Details', 'Setup', 'Review', 'Launch'];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(index)}
              className="flex items-center gap-3 text-left"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full font-medium transition ${
                  isComplete ? 'bg-blue-600 text-white' : isActive ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{step}</span>
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep((step) => Math.min(steps.length - 1, step + 1))}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}

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
        preview: <AnimatedLineChartPreview />,
      },
      {
        title: "Animated Toggle",
        description: "Segmented controls with animated state transitions for filters and modes.",
        badge: { label: "PRO", tone: "pro" },
        preview: <AnimatedTogglePreview />,
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
        preview: <ModalPreview />,
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
        preview: <StepperPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
