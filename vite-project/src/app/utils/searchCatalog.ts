import type { AppLanguage } from "@/app/context/LanguageContext";
import { searchItems } from "@/app/config/navigation";
import { localizeSearchItem } from "@/app/i18n";
import type { SearchItem } from "@/app/types/navigation";

export function getSearchablePageCount() {
  return searchItems.length;
}

export function getLocalizedNavigationSearchResults(query: string, language: AppLanguage, limit?: number): SearchItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const results = searchItems.flatMap((item) => {
    const localizedItem = localizeSearchItem(language, item);
    const searchableValues = [
      item.name,
      item.description,
      item.category,
      ...item.keywords,
      localizedItem.name,
      localizedItem.description,
      localizedItem.category,
      ...localizedItem.keywords,
    ].map((value) => value.toLowerCase());

    return searchableValues.some((value) => value.includes(normalizedQuery)) ? [localizedItem] : [];
  });

  return typeof limit === "number" ? results.slice(0, limit) : results;
}
