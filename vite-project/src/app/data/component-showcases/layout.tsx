import type { ComponentShowcaseConfig } from "@/app/types/component-showcase";
import { extractExportedFunctionSource } from "@/app/utils/componentSource";
import { AppShellPreview, DrawerPreview, ProductCardPreview, SidebarPreview } from "./layoutPreviews";

const layoutPreviewSourcePath = "src/app/data/component-showcases/layoutPreviews.tsx";

async function loadLayoutPreviewSource(exportName: string) {
  const sourceModule = await import("./layoutPreviews.tsx?raw");
  return extractExportedFunctionSource(sourceModule.default, exportName);
}

export const layoutComponentShowcases = {
  appShells: {
    eyebrow: "Layout System",
    title: "App Shells",
    titleHighlight: "Component",
    description: "A sturdy app layout for navigation, utilities, and main content.",
    sections: [
      {
        title: "Dashboard Shell",
        description: "A practical layout for admin tools and internal dashboards.",
        badge: { label: "FEATURED", tone: "featured" },
        loadSourceCode: () => loadLayoutPreviewSource("AppShellPreview"),
        sourcePath: layoutPreviewSourcePath,
        preview: <AppShellPreview />,
      },
    ],
  },
  cards: {
    eyebrow: "Content Surfaces",
    title: "Cards",
    titleHighlight: "Component",
    description: "Cards that make grouped information easier to read.",
    sections: [
      {
        title: "Product Card",
        description: "A product summary card with details and a clear next action.",
        loadSourceCode: () => loadLayoutPreviewSource("ProductCardPreview"),
        sourcePath: layoutPreviewSourcePath,
        preview: <ProductCardPreview />,
      },
    ],
  },
  drawer: {
    eyebrow: "Panels & Overlays",
    title: "Drawer",
    titleHighlight: "Component",
    description: "Slide-out panels for details users need without leaving the page.",
    sections: [
      {
        title: "Side Drawer",
        description: "A compact side panel for settings and supporting details.",
        loadSourceCode: () => loadLayoutPreviewSource("DrawerPreview"),
        sourcePath: layoutPreviewSourcePath,
        preview: <DrawerPreview />,
      },
    ],
  },
  sidebar: {
    eyebrow: "Navigation Patterns",
    title: "Sidebar",
    titleHighlight: "Component",
    description: "Sidebar layouts that keep menu-heavy screens easy to navigate.",
    sections: [
      {
        title: "Collapsible Sidebar",
        description: "A two-column shell with navigation that can expand or collapse.",
        loadSourceCode: () => loadLayoutPreviewSource("SidebarPreview"),
        sourcePath: layoutPreviewSourcePath,
        preview: <SidebarPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
