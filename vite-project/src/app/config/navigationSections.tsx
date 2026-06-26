import type { RouteSectionDefinition } from "../types/navigation";
import { HomePage } from "../pages/HomePage";
import { ComponentsPage } from "../pages/ComponentsPage";
import { FullAppsPage } from "../pages/FullAppsPage";
import { LibrariesPage } from "../pages/LibrariesPage";
import { ToolsPage } from "../pages/ToolsPage";
import { McpPage } from "../pages/McpPage";
import { Accordions } from "../pages/components/Accordions";
import { Animations } from "../pages/components/Animations";
import { AppShells } from "../pages/components/AppShells";
import { Badge } from "../pages/components/Badge";
import { Buttons } from "../pages/components/Buttons";
import { ButtonGroup } from "../pages/components/ButtonGroup";
import { Calendars } from "../pages/components/Calendars";
import { Cards } from "../pages/components/Cards";
import { Drawer } from "../pages/components/Drawer";
import { Dropdowns } from "../pages/components/Dropdowns";
import { Gallery } from "../pages/components/Gallery";
import { Modals } from "../pages/components/Modals";
import { NavigationBars } from "../pages/components/NavigationBars";
import { SidebarShowcasePage } from "../pages/components/SidebarShowcasePage";
import { Steppers } from "../pages/components/Steppers";
import { Tabs } from "../pages/components/Tabs";
import { Toggles } from "../pages/components/Toggles";
import { InputFields } from "../pages/components/InputFields";
import { FeedbackAppPage } from "../pages/fullapps/FeedbackAppPage";
import { ProjectManagementAppPage } from "../pages/fullapps/ProjectManagementAppPage";
import { ChromeExtensionsPage } from "../pages/fullapps/ChromeExtensionsPage";
import { CleaningConfirmationPage } from "../pages/fullapps/CleaningConfirmationPage";
import { YamlLibraryPage } from "../pages/libraries/YamlLibraryPage";
import { CustomSvgLibraryPage } from "../pages/libraries/CustomSvgLibraryPage";
import { LogoGeneratorPage } from "../pages/tools/LogoGeneratorPage";
import { PowerTsToolkitPage } from "../pages/tools/PowerTsToolkitPage";
import { FormBuilderPage } from "../pages/tools/FormBuilderPage";
import { SvgEditorPage } from "../pages/tools/SvgEditorPage";

export const routeSections: RouteSectionDefinition[] = [
  {
    key: "home",
    label: "Home",
    basePath: "/",
    landingDescription: "One clear starting point for the whole workspace.",
    landingComponent: HomePage,
    children: [],
  },
  {
    key: "components",
    label: "Components",
    basePath: "/components",
    landingDescription: "Ready-to-use UI patterns for everyday product screens.",
    landingComponent: ComponentsPage,
    children: [
      { label: "Accordions", slug: "components/accordions", description: "Collapse long content into focused, scannable sections.", component: Accordions, searchKeywords: ["collapse", "expand"] },
      { label: "Animations", slug: "components/animations", description: "Make state changes feel smooth instead of sudden.", component: Animations, searchKeywords: ["motion", "transition"] },
      { label: "App Shells", slug: "components/app-shells", description: "Start business screens with a sturdy app layout.", component: AppShells, searchKeywords: ["layout", "shell"] },
      { label: "Badge", slug: "components/badge", description: "Show status, priority, and review state in a tiny label.", component: Badge, searchKeywords: ["tag", "status"] },
      { label: "Buttons", slug: "components/buttons", description: "Guide primary and secondary actions with clear button states.", component: Buttons, searchKeywords: ["cta", "actions"] },
      { label: "Button Group", slug: "components/button-group", description: "Switch between related choices without adding extra clutter.", component: ButtonGroup, searchKeywords: ["segmented", "controls"] },
      { label: "Calendars", slug: "components/calendars", description: "Pick dates and review schedules in one flow.", component: Calendars, searchKeywords: ["date picker", "schedule"] },
      { label: "Cards", slug: "components/cards", description: "Group information into small, easy-to-read surfaces.", component: Cards, searchKeywords: ["panel", "surface"] },
      { label: "Drawer", slug: "components/drawer", description: "Open details beside the current screen without losing context.", component: Drawer, searchKeywords: ["panel", "sheet"] },
      { label: "Dropdowns", slug: "components/dropdowns", description: "Keep extra actions tucked away until they are needed.", component: Dropdowns, searchKeywords: ["menu", "select"] },
      { label: "Gallery", slug: "components/gallery", description: "Browse and compare visual assets comfortably.", component: Gallery, searchKeywords: ["media", "images"] },
      { label: "Modals", slug: "components/modals", description: "Pause the flow for important choices and confirmations.", component: Modals, searchKeywords: ["dialog", "overlay"] },
      { label: "Navigation Bars", slug: "components/navigation-bars", description: "Keep top-level destinations and key actions within reach.", component: NavigationBars, searchKeywords: ["navbar", "header"] },
      { label: "Sidebar", slug: "components/sidebar", description: "Help users stay oriented in menu-heavy screens.", component: SidebarShowcasePage, searchKeywords: ["side nav", "navigation"] },
      { label: "Steppers", slug: "components/steppers", description: "Show progress through setup, review, and launch flows.", component: Steppers, searchKeywords: ["progress", "wizard"] },
      { label: "Tabs", slug: "components/tabs", description: "Move between related panels in the same space.", component: Tabs, searchKeywords: ["tabbed", "switcher"] },
      { label: "Toggles", slug: "components/toggles", description: "Turn settings on or off with a clear state change.", component: Toggles, searchKeywords: ["switch", "boolean"] },
      { label: "Input Fields", slug: "components/input-fields", description: "Collect user input and respond with helpful validation.", component: InputFields, badge: "New", searchKeywords: ["form", "inputs"] },
    ],
  },
  {
    key: "full-apps",
    label: "Full Apps",
    basePath: "/full-apps",
    landingDescription: "App-style screens that show shared UI pieces working together.",
    landingComponent: FullAppsPage,
    children: [
      { label: "Chrome Extensions", slug: "full-apps/chrome-extensions", description: "Plan extension files, permissions, and popup behavior in one place.", component: ChromeExtensionsPage, badge: "New", searchKeywords: ["chrome", "extension", "power apps"] },
      { label: "Feedback App", slug: "full-apps/feedback-app", description: "Collect feedback, track ratings, and draft responses.", component: FeedbackAppPage, badge: "New", searchKeywords: ["reviews", "ratings"] },
      { label: "Project Management", slug: "full-apps/project-management", description: "Track projects, tasks, progress, and team ownership.", component: ProjectManagementAppPage, badge: "New", searchKeywords: ["kanban", "tasks"] },
      { label: "Cleaning Confirmation", slug: "full-apps/cleaning-confirmation", description: "Manage visit details, room checks, and final confirmation.", component: CleaningConfirmationPage, badge: "New", searchKeywords: ["service", "schedule"] },
    ],
  },
  {
    key: "libraries",
    label: "Libraries",
    basePath: "/libraries",
    landingDescription: "Shared assets and snippets that are easy to reuse.",
    landingComponent: LibrariesPage,
    children: [
      { label: "YAML Library", slug: "libraries/yaml-library", description: "Save, convert, and reuse YAML snippets without leaving the page.", component: YamlLibraryPage, badge: "New", searchKeywords: ["configuration", "schema"] },
      { label: "Custom SVG Library", slug: "libraries/custom-svg-library", description: "Collect SVG icons, tune their size and color, and export them.", component: CustomSvgLibraryPage, badge: "New", searchKeywords: ["icons", "vector"] },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    basePath: "/tools",
    landingDescription: "Focused helpers for building, converting, and editing faster.",
    landingComponent: ToolsPage,
    children: [
      { label: "Logo Generator", slug: "tools/logo-generator", description: "Create simple logo directions and export the ones you like.", component: LogoGeneratorPage, badge: "New", searchKeywords: ["branding", "generator"] },
      { label: "PowerT's Toolkit", slug: "tools/powerts-toolkit", description: "Clean up snippets and convert them into usable implementation notes.", component: PowerTsToolkitPage, badge: "New", searchKeywords: ["converter", "typescript"] },
      { label: "Form Builder", slug: "tools/form-builder", description: "Assemble fields, preview the form, and export the result.", component: FormBuilderPage, badge: "New", searchKeywords: ["builder", "forms"] },
      { label: "SVG Editor", slug: "tools/svg-editor", description: "Draw, adjust, preview, and export SVG assets in one workspace.", component: SvgEditorPage, badge: "New", searchKeywords: ["vector", "editor"] },
    ],
  },
  {
    key: "mcp",
    label: "MCP",
    basePath: "/mcp",
    landingDescription: "A practical view of how shared component knowledge can be packaged.",
    landingComponent: McpPage,
  },
];
