import type { ComponentShowcaseConfig } from "@/app/types/component-showcase";
import { extractExportedFunctionSource } from "@/app/utils/componentSource";
import { DropdownPreview, NavigationBarPreview, SegmentedControlsPreview, TabsPreview } from "./navigationPreviews";

const navigationPreviewSourcePath = "src/app/data/component-showcases/navigationPreviews.tsx";

async function loadNavigationPreviewSource(exportName: string) {
  const sourceModule = await import("./navigationPreviews.tsx?raw");
  return extractExportedFunctionSource(sourceModule.default, exportName);
}

export const navigationComponentShowcases = {
  buttonGroup: {
    eyebrow: "Action Clusters",
    title: "Button Group",
    titleHighlight: "Component",
    description: "Grouped controls for switching between related choices.",
    sections: [
      {
        title: "Segmented Controls",
        description: "Connected buttons for moving between sibling views.",
        loadSourceCode: () => loadNavigationPreviewSource("SegmentedControlsPreview"),
        sourcePath: navigationPreviewSourcePath,
        preview: <SegmentedControlsPreview />,
      },
    ],
  },
  dropdowns: {
    eyebrow: "Selection Menus",
    title: "Dropdowns",
    titleHighlight: "Component",
    description: "Dropdowns that keep extra actions available without crowding the page.",
    sections: [
      {
        title: "Menu Dropdown",
        description: "A compact action menu for rename, duplicate, share, and archive.",
        loadSourceCode: () => loadNavigationPreviewSource("DropdownPreview"),
        sourcePath: navigationPreviewSourcePath,
        preview: <DropdownPreview />,
      },
    ],
  },
  navigationBars: {
    eyebrow: "Global Navigation",
    title: "Navigation Bars",
    titleHighlight: "Component",
    description: "Top navigation that keeps routes and starting actions visible.",
    sections: [
      {
        title: "Top Navigation",
        description: "A responsive navbar with a logo, links, and a clear start button.",
        loadSourceCode: () => loadNavigationPreviewSource("NavigationBarPreview"),
        sourcePath: navigationPreviewSourcePath,
        preview: <NavigationBarPreview />,
      },
    ],
  },
  tabs: {
    eyebrow: "Content Switching",
    title: "Tabs",
    titleHighlight: "Component",
    description: "Tabbed areas for moving between related content without leaving the page.",
    sections: [
      {
        title: "Horizontal Tabs",
        description: "A simple tab strip with a clear active state.",
        loadSourceCode: () => loadNavigationPreviewSource("TabsPreview"),
        sourcePath: navigationPreviewSourcePath,
        preview: <TabsPreview />,
      },
    ],
  },
} satisfies Record<string, ComponentShowcaseConfig>;
