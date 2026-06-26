import type { ExtensionTemplate, PreviewNote, PreviewTab } from "./types";

export const extensionTemplates: ExtensionTemplate[] = [
  {
    id: "notes",
    name: "Quick Notes Extension",
    category: "Productivity",
    description: "Popup-based note capture with local storage and keyboard-friendly controls.",
    permissions: ["storage"],
    files: ["manifest.json", "popup.html", "popup.js", "styles.css"],
  },
  {
    id: "tabs",
    name: "Tab Organizer Extension",
    category: "Browser utility",
    description: "Group open tabs, search sessions, and restore selected workspaces.",
    permissions: ["tabs", "storage"],
    files: ["manifest.json", "popup.html", "background.js", "styles.css"],
  },
  {
    id: "links",
    name: "Quick Links Extension",
    category: "Navigation",
    description: "Pinned shortcut panel for frequently used dashboards and docs.",
    permissions: ["storage"],
    files: ["manifest.json", "popup.html", "popup.js", "icons/icon.svg"],
  },
];

export const initialPreviewNotes: PreviewNote[] = [
  { id: 1, title: "Research notes", body: "Summarize sources before the meeting.", pinned: true },
  { id: 2, title: "Code review", body: "Check route handling and empty states.", pinned: false },
  { id: 3, title: "Release checklist", body: "Build, typecheck, and verify permissions.", pinned: true },
  { id: 4, title: "Ideas", body: "Add command palette shortcuts.", pinned: false },
];

export const checklistItems = [
  "Define permissions",
  "Create popup UI",
  "Connect storage",
  "Run browser test",
];

export const previewTabs: PreviewTab[] = ["All", "Pinned", "Recent"];

export {
  chromeExtensionText,
  getChecklistItemLabel,
  getExtensionTemplateCopy,
  getPreviewNoteCopy,
  getPreviewTabLabel,
} from "./copy";
