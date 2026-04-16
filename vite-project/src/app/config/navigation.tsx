/**
 * Central navigation and route metadata.
 * Keep labels, descriptions, badges, and page-to-path mappings here so the router,
 * header, sidebar, and search modal stay in sync.
 */
import type { SearchItem, SidebarItem, RouteSectionDefinition, RouteSectionKey, NavigationLinkItem } from '../types/navigation';
import { HomePage } from '../pages/HomePage';
import { ComponentsPage } from '../pages/ComponentsPage';
import { FullAppsPage } from '../pages/FullAppsPage';
import { LibrariesPage } from '../pages/LibrariesPage';
import { ToolsPage } from '../pages/ToolsPage';
import { McpPage } from '../pages/McpPage';
import { Accordions } from '../pages/components/Accordions';
import { Animations } from '../pages/components/Animations';
import { AppShells } from '../pages/components/AppShells';
import { Badge } from '../pages/components/Badge';
import { Buttons } from '../pages/components/Buttons';
import { ButtonGroup } from '../pages/components/ButtonGroup';
import { Calendars } from '../pages/components/Calendars';
import { Cards } from '../pages/components/Cards';
import { Drawer } from '../pages/components/Drawer';
import { Dropdowns } from '../pages/components/Dropdowns';
import { Gallery } from '../pages/components/Gallery';
import { Modals } from '../pages/components/Modals';
import { NavigationBars } from '../pages/components/NavigationBars';
import { SidebarShowcasePage } from '../pages/components/SidebarShowcasePage';
import { Steppers } from '../pages/components/Steppers';
import { Tabs } from '../pages/components/Tabs';
import { Toggles } from '../pages/components/Toggles';
import { InputFields } from '../pages/components/InputFields';
import { FeedbackAppPage } from '../pages/fullapps/FeedbackAppPage';
import { ProjectManagementAppPage } from '../pages/fullapps/ProjectManagementAppPage';
import { CleaningConfirmationPage } from '../pages/fullapps/CleaningConfirmationPage';
import { YamlLibraryPage } from '../pages/libraries/YamlLibraryPage';
import { CustomSvgLibraryPage } from '../pages/libraries/CustomSvgLibraryPage';
import { LogoGeneratorPage } from '../pages/tools/LogoGeneratorPage';
import { PowerTsToolkitPage } from '../pages/tools/PowerTsToolkitPage';
import { FormBuilderPage } from '../pages/tools/FormBuilderPage';
import { SvgEditorPage } from '../pages/tools/SvgEditorPage';

export const routeSections: RouteSectionDefinition[] = [
  {
    key: 'home',
    label: 'Home',
    basePath: '/',
    landingDescription: 'Unified landing page for the entire showcase and search experience.',
    landingComponent: HomePage,
    children: [],
  },
  {
    key: 'components',
    label: 'Components',
    basePath: '/components',
    landingDescription: 'Reusable interface building blocks and interaction patterns.',
    landingComponent: ComponentsPage,
    children: [
      { label: 'Accordions', slug: 'components/accordions', description: 'Interactive accordion components', component: Accordions, searchKeywords: ['collapse', 'expand'] },
      { label: 'Animations', slug: 'components/animations', description: 'Animation effects and transitions', component: Animations, searchKeywords: ['motion', 'transition'] },
      { label: 'App Shells', slug: 'components/app-shells', description: 'Application shell templates', component: AppShells, searchKeywords: ['layout', 'shell'] },
      { label: 'Badge', slug: 'components/badge', description: 'Badge and tag components', component: Badge, searchKeywords: ['tag', 'status'] },
      { label: 'Buttons', slug: 'components/buttons', description: 'Button styles and variants', component: Buttons, searchKeywords: ['cta', 'actions'] },
      { label: 'Button Group', slug: 'components/button-group', description: 'Grouped button components', component: ButtonGroup, searchKeywords: ['segmented', 'controls'] },
      { label: 'Calendars', slug: 'components/calendars', description: 'Calendar and date picker components', component: Calendars, searchKeywords: ['date picker', 'schedule'] },
      { label: 'Cards', slug: 'components/cards', description: 'Card layout components', component: Cards, searchKeywords: ['panel', 'surface'] },
      { label: 'Drawer', slug: 'components/drawer', description: 'Drawer and sidebar components', component: Drawer, searchKeywords: ['panel', 'sheet'] },
      { label: 'Dropdowns', slug: 'components/dropdowns', description: 'Dropdown menu components', component: Dropdowns, searchKeywords: ['menu', 'select'] },
      { label: 'Gallery', slug: 'components/gallery', description: 'Image gallery components', component: Gallery, searchKeywords: ['media', 'images'] },
      { label: 'Modals', slug: 'components/modals', description: 'Modal and dialog components', component: Modals, searchKeywords: ['dialog', 'overlay'] },
      { label: 'Navigation Bars', slug: 'components/navigation-bars', description: 'Navigation bar components', component: NavigationBars, searchKeywords: ['navbar', 'header'] },
      { label: 'Sidebar', slug: 'components/sidebar', description: 'Sidebar layout components', component: SidebarShowcasePage, searchKeywords: ['side nav', 'navigation'] },
      { label: 'Steppers', slug: 'components/steppers', description: 'Stepper and progress components', component: Steppers, searchKeywords: ['progress', 'wizard'] },
      { label: 'Tabs', slug: 'components/tabs', description: 'Tab navigation components', component: Tabs, searchKeywords: ['tabbed', 'switcher'] },
      { label: 'Toggles', slug: 'components/toggles', description: 'Toggle and switch components', component: Toggles, searchKeywords: ['switch', 'boolean'] },
      { label: 'Input Fields', slug: 'components/input-fields', description: 'Form input field components', component: InputFields, badge: 'New', searchKeywords: ['form', 'inputs'] },
    ],
  },
  {
    key: 'full-apps',
    label: 'Full Apps',
    basePath: '/full-apps',
    landingDescription: 'Complete workflow demos that combine multiple UI building blocks.',
    landingComponent: FullAppsPage,
    children: [
      { label: 'Feedback App', slug: 'full-apps/feedback-app', description: 'Complete feedback collection and rating system', component: FeedbackAppPage, badge: 'New', searchKeywords: ['reviews', 'ratings'] },
      { label: 'Project Management', slug: 'full-apps/project-management', description: 'Project tracking with analytics and team collaboration', component: ProjectManagementAppPage, badge: 'New', searchKeywords: ['kanban', 'tasks'] },
      { label: 'Cleaning Confirmation', slug: 'full-apps/cleaning-confirmation', description: 'Service confirmation and scheduling application', component: CleaningConfirmationPage, badge: 'New', searchKeywords: ['service', 'schedule'] },
    ],
  },
  {
    key: 'libraries',
    label: 'Libraries',
    basePath: '/libraries',
    landingDescription: 'Reusable asset collections and curated resources.',
    landingComponent: LibrariesPage,
    children: [
      { label: 'YAML Library', slug: 'libraries/yaml-library', description: 'Store and manage reusable YAML assets for faster development.', component: YamlLibraryPage, badge: 'New', searchKeywords: ['configuration', 'schema'] },
      { label: 'Custom SVG Library', slug: 'libraries/custom-svg-library', description: 'Import, organize, and reuse custom SVG icons.', component: CustomSvgLibraryPage, badge: 'New', searchKeywords: ['icons', 'vector'] },
    ],
  },
  {
    key: 'tools',
    label: 'Tools',
    basePath: '/tools',
    landingDescription: 'Focused utilities for prototyping, conversion, and asset editing.',
    landingComponent: ToolsPage,
    children: [
      { label: 'Logo Generator', slug: 'tools/logo-generator', description: 'AI-assisted logo creation workflow for quick concept generation.', component: LogoGeneratorPage, badge: 'New', searchKeywords: ['branding', 'generator'] },
      { label: "PowerT's Toolkit", slug: 'tools/powerts-toolkit', description: 'Convert PowerT code into React or vanilla JavaScript implementations.', component: PowerTsToolkitPage, badge: 'New', searchKeywords: ['converter', 'typescript'] },
      { label: 'Form Builder', slug: 'tools/form-builder', description: 'Build forms with a visual workflow and configurable field presets.', component: FormBuilderPage, badge: 'New', searchKeywords: ['builder', 'forms'] },
      { label: 'SVG Editor', slug: 'tools/svg-editor', description: 'Edit, preview, and export SVG assets in one workspace.', component: SvgEditorPage, badge: 'New', searchKeywords: ['vector', 'editor'] },
    ],
  },
  {
    key: 'mcp',
    label: 'MCP',
    basePath: '/mcp',
    landingDescription: 'Model Context Protocol overview and showcase entry point.',
    landingComponent: McpPage,
  },
];

export const topNavigationItems: NavigationLinkItem[] = routeSections
  .filter((section) => section.key !== 'home')
  .map((section) => ({
    name: section.label,
    path: section.basePath,
  }));

const routeSectionLookup = new Map<RouteSectionKey, RouteSectionDefinition>(
  routeSections.map((section) => [section.key, section]),
);

export function getRouteSectionByPath(pathname: string): RouteSectionDefinition | undefined {
  if (pathname === '/') {
    return routeSectionLookup.get('home');
  }

  if (pathname.startsWith('/components')) {
    return routeSectionLookup.get('components');
  }

  return routeSections.find((section) => section.basePath !== '/' && pathname.startsWith(section.basePath));
}

export function getSidebarItems(pathname: string): SidebarItem[] {
  const section = getRouteSectionByPath(pathname);
  if (!section?.children?.length) {
    return [];
  }

  return section.children
    .filter((item) => item.includeInSidebar !== false && item.slug)
    .map((item) => ({
      name: item.label,
      path: `/${item.slug}`,
      badge: item.badge,
    }));
}

export const searchItems: SearchItem[] = routeSections.flatMap((section) => {
  const landingItem: SearchItem[] = section.key === 'home'
    ? [{
        name: section.label,
        description: section.landingDescription,
        path: section.basePath,
        category: 'Sections',
        keywords: ['home', 'landing'],
      }]
    : [{
        name: section.label,
        description: section.landingDescription,
        path: section.basePath,
        category: 'Sections',
        keywords: [section.label.toLowerCase()],
      }];

  const childItems = (section.children ?? [])
    .filter((item) => item.includeInSearch !== false && item.slug)
    .map((item) => ({
      name: item.label,
      description: item.description,
      path: `/${item.slug}`,
      category: section.label,
      keywords: item.searchKeywords ?? [],
    }));

  return [...landingItem, ...childItems];
});
