import type { ComponentShowcaseConfig } from "@/app/types/component-showcase";
import { extractExportedFunctionSource } from "@/app/utils/componentSource";
import {
  AnimatedLineChartPreview,
  AnimatedTogglePreview,
  CalendarPreview,
  ModalPreview,
  StepperPreview,
} from "./interactivePreviews";

const interactivePreviewSourcePath = "src/app/data/component-showcases/interactivePreviews.tsx";

async function loadInteractivePreviewSource(exportName: string) {
  const sourceModule = await import("./interactivePreviews.tsx?raw");
  return extractExportedFunctionSource(sourceModule.default, exportName);
}

export const interactiveComponentShowcases = {
  animations: {
    eyebrow: "Motion Library",
    title: "Power Apps",
    titleHighlight: "Animation Components",
    description: "Motion patterns that make progress and feedback easier to follow.",
    updatedAt: "Sep 1, 2025",
    sections: [
      {
        title: "Animated Line Chart",
        description: "A small chart motion for KPI cards and trend widgets.",
        badge: { label: "PRO", tone: "pro" },
        loadSourceCode: () => loadInteractivePreviewSource("AnimatedLineChartPreview"),
        sourcePath: interactivePreviewSourcePath,
        preview: <AnimatedLineChartPreview />,
      },
      {
        title: "Animated Toggle",
        description: "A segmented control that makes mode changes feel smoother.",
        badge: { label: "PRO", tone: "pro" },
        loadSourceCode: () => loadInteractivePreviewSource("AnimatedTogglePreview"),
        sourcePath: interactivePreviewSourcePath,
        preview: <AnimatedTogglePreview />,
      },
    ],
  },
  calendars: {
    eyebrow: "Date Selection",
    title: "Calendars",
    titleHighlight: "Component",
    description: "Calendar layouts for picking dates, planning schedules, and reviewing tasks.",
    sections: [
      {
        title: "Date Picker",
        description: "A lightweight monthly view for choosing a date inside a form.",
        loadSourceCode: () => loadInteractivePreviewSource("CalendarPreview"),
        sourcePath: interactivePreviewSourcePath,
        preview: <CalendarPreview />,
      },
    ],
  },
  modals: {
    eyebrow: "Focus States",
    title: "Modals",
    titleHighlight: "Component",
    description: "Dialog patterns for decisions that need a short pause.",
    sections: [
      {
        title: "Confirmation Modal",
        description: "A confirmation modal for destructive or important actions.",
        loadSourceCode: () => loadInteractivePreviewSource("ModalPreview"),
        sourcePath: interactivePreviewSourcePath,
        preview: <ModalPreview />,
      },
    ],
  },
  steppers: {
    eyebrow: "Workflow Progress",
    title: "Steppers",
    titleHighlight: "Component",
    description: "Step indicators that keep multi-step work easy to follow.",
    sections: [
      {
        title: "Progress Stepper",
        description: "A horizontal stepper for setup, review, and approval flows.",
        loadSourceCode: () => loadInteractivePreviewSource("StepperPreview"),
        sourcePath: interactivePreviewSourcePath,
        preview: <StepperPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
