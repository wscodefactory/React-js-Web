/**
 * Derived navigation and route metadata.
 * Keep raw route definitions in navigationSections so router, header, sidebar,
 * and search data can share the same source.
 */
import type { NavigationLinkItem, RouteSectionDefinition, RouteSectionKey, SearchItem, SidebarItem } from "../types/navigation";
import { routeSections } from "./navigationSections";

export { routeSections };

const hiddenTopNavigationKeys = new Set<RouteSectionKey>(["home", "account", "admin"]);

export const headerNavigationSections = routeSections.filter((section) => !hiddenTopNavigationKeys.has(section.key));

export const topNavigationItems: NavigationLinkItem[] = headerNavigationSections
  .map((section) => ({
    name: section.label,
    path: section.basePath,
  }));

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
};

export function getSidebarItems(pathname: string, options: SidebarOptions = {}): SidebarItem[] {
  if (pathname === "/") {
    return topNavigationItems.map((item) => ({
      name: item.name,
      path: item.path,
    }));
  }

  const section = getRouteSectionByPath(pathname);
  if (!section?.children?.length) {
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

export const searchItems: SearchItem[] = routeSections.flatMap((section) => {
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
