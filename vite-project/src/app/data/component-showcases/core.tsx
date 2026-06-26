import type { ComponentShowcaseConfig } from "@/app/types/component-showcase";
import {
  ButtonActionPreview,
  EditableInputPreview,
  InteractiveAccordionPreview,
  StatusBadgePreview,
  TogglePreview,
} from "./corePreviews";

export const coreComponentShowcases = {
  accordions: {
    eyebrow: "Power Apps UI",
    title: "Power Apps",
    titleHighlight: "Accordion Components",
    description: "Keep long content tidy while letting users open only what they need.",
    updatedAt: "Sep 1, 2025",
    sections: [
      {
        title: "Accordion Plus",
        description: "A clear plus/minus accordion for dense settings or help content.",
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
        description: "A quiet stacked layout for documentation, help, and answers.",
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
    description: "Small labels that make state, priority, and review status easy to scan.",
    sections: [
      {
        title: "Status Badges",
        description: "Reusable badges for success, pending, blocked, and reviewed states.",
        badge: { label: "NEW", tone: "new" },
        preview: <StatusBadgePreview />,
      },
    ],
  },
  buttons: {
    eyebrow: "Action Library",
    title: "Power Apps",
    titleHighlight: "Button Components",
    description: "Button patterns that make the next action feel obvious.",
    updatedAt: "Sep 1, 2025",
    sections: [
      {
        title: "Primary Button",
        description: "Strong buttons for the action users should notice first.",
        badge: { label: "FREE", tone: "free" },
        preview: <ButtonActionPreview variant="solid" />,
      },
      {
        title: "Outline Buttons",
        description: "Softer buttons for secondary choices and supporting actions.",
        badge: { label: "PRO", tone: "pro" },
        preview: <ButtonActionPreview variant="outline" />,
      },
      {
        title: "Icon Buttons",
        description: "Compact buttons that pair an icon cue with a readable label.",
        badge: { label: "PRO", tone: "pro" },
        preview: <ButtonActionPreview variant="icon" />,
      },
    ],
  },
  inputFields: {
    eyebrow: "Form Controls",
    title: "Input Fields",
    titleHighlight: "Component",
    description: "Input controls that guide users while they type.",
    sections: [
      {
        title: "Text Input",
        description: "A text field that gives helpful validation feedback right away.",
        badge: { label: "NEW", tone: "new" },
        preview: <EditableInputPreview />,
      },
    ],
  },
  toggles: {
    eyebrow: "Binary Controls",
    title: "Toggles",
    titleHighlight: "Component",
    description: "Simple switches for settings that are either on or off.",
    sections: [
      {
        title: "Switch Toggle",
        description: "A clear switch for notification, preference, and feature settings.",
        preview: <TogglePreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
