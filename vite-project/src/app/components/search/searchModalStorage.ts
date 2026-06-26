import type { SearchItem } from "@/app/types/navigation";
import type { StoredRecentSearch } from "@/app/types/common";
import { loadStoredList, removeStoredValue, saveStoredList } from "@/app/utils/storage";

const recentSearchesStorageKey = "recentSearches";
const maxRecentSearches = 5;

function isStoredRecentSearch(value: unknown): value is StoredRecentSearch {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.name === "string"
    && typeof record.path === "string"
    && typeof record.timestamp === "number"
  );
}

export function loadRecentSearches() {
  return loadStoredList(recentSearchesStorageKey, isStoredRecentSearch);
}

export function saveRecentSearches(searches: StoredRecentSearch[]) {
  saveStoredList(recentSearchesStorageKey, searches);
}

export function clearRecentSearches() {
  removeStoredValue(recentSearchesStorageKey);
}

export function buildRecentSearchList(item: SearchItem, currentSearches: StoredRecentSearch[]) {
  const nextItem: StoredRecentSearch = {
    name: item.name,
    path: item.path,
    timestamp: Date.now(),
  };

  return [nextItem, ...currentSearches.filter((search) => search.path !== item.path)].slice(0, maxRecentSearches);
}
