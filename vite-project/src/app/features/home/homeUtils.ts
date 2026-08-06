import type { AppLanguage } from "@/app/context/LanguageContext";
import { routeSections } from "@/app/config/navigation";
import { localizeRouteDescription, localizeRouteLabel } from "@/app/i18n";
import { getLocalizedNavigationSearchResults, getSearchablePageCount } from "@/app/utils/searchCatalog";
import type { RouteSectionDefinition } from "@/app/types/navigation";
import type { SiteMenuVisibility } from "@/app/types/siteSettings";
import { isConfigurableSectionKey } from "@/app/types/siteSettings";

export function getMainRouteSections(menuVisibility?: SiteMenuVisibility) {
  return routeSections.filter((section) => (
    section.key !== "home"
    && (!isConfigurableSectionKey(section.key) || menuVisibility?.[section.key] !== false)
  ));
}

export function countReadySections(sections: RouteSectionDefinition[]) {
  return sections.filter((section) => section.children?.length || section.basePath === "/mcp").length;
}

export function getLocalizedRouteSectionCopy(language: AppLanguage, section: RouteSectionDefinition) {
  return {
    description: localizeRouteDescription(language, section.basePath, section.landingDescription),
    label: localizeRouteLabel(language, section.key, section.label),
  };
}

export function getLocalizedSearchResults(query: string, language: AppLanguage, menuVisibility?: SiteMenuVisibility) {
  return getLocalizedNavigationSearchResults(query, language, 8, menuVisibility);
}

export { getSearchablePageCount };
