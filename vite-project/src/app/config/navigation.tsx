/**
 * Derived navigation and route metadata.
 * Keep raw route definitions in navigationSections so router, header, sidebar,
 * and search data can share the same source.
 */
import type { NavigationLinkItem, RouteSectionDefinition, RouteSectionKey, SearchItem, SidebarItem } from "../types/navigation";
import {
  defaultSiteSettings,
  isConfigurableSectionKey,
  type SiteMenuVisibility,
} from "../types/siteSettings";
import { routeSections } from "./navigationSections";

export { routeSections };

const hiddenTopNavigationKeys = new Set<RouteSectionKey>(["home", "collections", "account", "admin"]);

function isSectionVisible(section: RouteSectionDefinition, menuVisibility = defaultSiteSettings.menuVisibility) {
  return !isConfigurableSectionKey(section.key) || menuVisibility[section.key] !== false;
}

export function getHeaderNavigationSections(menuVisibility: SiteMenuVisibility = defaultSiteSettings.menuVisibility) {
  return routeSections.filter((section) => !hiddenTopNavigationKeys.has(section.key) && isSectionVisible(section, menuVisibility));
}

export const headerNavigationSections = getHeaderNavigationSections();

export function getTopNavigationItems(menuVisibility: SiteMenuVisibility = defaultSiteSettings.menuVisibility): NavigationLinkItem[] {
  return getHeaderNavigationSections(menuVisibility)
    .map((section) => ({
      name: section.label,
      path: section.basePath,
    }));
}

export const topNavigationItems: NavigationLinkItem[] = getTopNavigationItems();

const routeSectionLookup = new Map<RouteSectionKey, RouteSectionDefinition>(
  routeSections.map((section) => [section.key, section]),
);

export function getRouteSectionByPath(pathname: string): RouteSectionDefinition | undefined {
  if (pathname === "/") {
    return routeSectionLookup.get("home");
  }

  if (pathname.startsWith("/components")) {
    return routeSectionLookup.get("components");
  }

  if (pathname.startsWith("/auth")) {
    return routeSectionLookup.get("account");
  }

  return routeSections.find((section) => section.basePath !== "/" && pathname.startsWith(section.basePath));
}

type SidebarOptions = {
  isAuthenticated?: boolean;
  menuVisibility?: SiteMenuVisibility;
};

export function getSidebarItems(pathname: string, options: SidebarOptions = {}): SidebarItem[] {
  if (pathname === "/") {
    return getTopNavigationItems(options.menuVisibility).map((item) => ({
      name: item.name,
      path: item.path,
    }));
  }

  const section = getRouteSectionByPath(pathname);
  if (!section?.children?.length || !isSectionVisible(section, options.menuVisibility)) {
    return [];
  }

  return section.children
    .filter((item) => item.includeInSidebar !== false && item.slug)
    .filter((item) => !(options.isAuthenticated && (item.slug === "auth/login" || item.slug === "auth/signup")))
    .map((item) => ({
      badge: item.badge,
      name: item.label,
      path: `/${item.slug}`,
    }));
}

export function getSearchItems(menuVisibility: SiteMenuVisibility = defaultSiteSettings.menuVisibility): SearchItem[] {
  return routeSections
    .filter((section) => isSectionVisible(section, menuVisibility))
    .flatMap((section) => {
      const landingItem: SearchItem[] = section.key === "home"
        ? [{
            category: "Sections",
            description: section.landingDescription,
            keywords: ["home", "landing"],
            name: section.label,
            path: section.basePath,
          }]
        : [{
            category: "Sections",
            description: section.landingDescription,
            keywords: [section.label.toLowerCase()],
            name: section.label,
            path: section.basePath,
          }];

      const childItems = (section.children ?? [])
        .filter((item) => item.includeInSearch !== false && item.slug)
        .map((item) => ({
          category: section.label,
          description: item.description,
          keywords: item.searchKeywords ?? [],
          name: item.label,
          path: `/${item.slug}`,
        }));

      return [...landingItem, ...childItems];
    });
}

export const searchItems: SearchItem[] = getSearchItems();
