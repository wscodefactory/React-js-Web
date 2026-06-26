import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { searchModalText } from "../i18n";
import type { SearchItem } from "../types/navigation";
import type { StoredRecentSearch } from "../types/common";
import { SearchEmptyState } from "./search/SearchEmptyState";
import { SearchModalInput } from "./search/SearchModalInput";
import { RecentSearchList } from "./search/RecentSearchList";
import { SearchResultList } from "./search/SearchResultList";
import { clampSearchIndex } from "./search/searchModalUtils";
import {
  buildRecentSearchList,
  clearRecentSearches,
  loadRecentSearches,
  saveRecentSearches,
} from "./search/searchModalStorage";
import { getLocalizedNavigationSearchResults } from "../utils/searchCatalog";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<StoredRecentSearch[]>(loadRecentSearches);
  const [activeIndex, setActiveIndex] = useState(0);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const text = searchModalText[language];

  const filteredResults = useMemo(
    () => getLocalizedNavigationSearchResults(searchQuery, language),
    [language, searchQuery],
  );
  const visibleSearchRows = searchQuery.trim() ? filteredResults : recentSearches;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSearchQuery("");
    setActiveIndex(0);
    setRecentSearches(loadRecentSearches());
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  function saveRecentSearch(item: SearchItem) {
    const updatedSearches = buildRecentSearchList(item, recentSearches);
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  }

  function handleItemClick(path: string, item?: SearchItem) {
    if (item) {
      saveRecentSearch(item);
    }

    navigate(path);
    setSearchQuery("");
    onClose();
  }

  function removeRecentSearch(path: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const updatedSearches = recentSearches.filter((search) => search.path !== path);
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  }

  function clearAllRecentSearches() {
    setRecentSearches([]);
    clearRecentSearches();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => clampSearchIndex(current + 1, visibleSearchRows.length));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => clampSearchIndex(current - 1, visibleSearchRows.length));
      return;
    }

    if (event.key !== "Enter" || visibleSearchRows.length === 0) {
      return;
    }

    event.preventDefault();
    if (searchQuery.trim()) {
      const item = filteredResults[activeIndex];
      if (item) {
        handleItemClick(item.path, item);
      }
      return;
    }

    const recent = recentSearches[activeIndex];
    if (recent) {
      handleItemClick(recent.path);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]">
      <button type="button" aria-label={text.closeSearch} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-800">
        <SearchModalInput
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          onClose={onClose}
          onKeyDown={handleKeyDown}
          searchQuery={searchQuery}
          text={text}
        />

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() === "" ? (
            recentSearches.length > 0 ? (
              <RecentSearchList
                activeIndex={activeIndex}
                language={language}
                onClearAll={clearAllRecentSearches}
                onRemove={removeRecentSearch}
                onSelect={handleItemClick}
                recentSearches={recentSearches}
                text={text}
              />
            ) : (
              <SearchEmptyState title={text.empty} description={text.tryExamples} />
            )
          ) : filteredResults.length > 0 ? (
            <SearchResultList activeIndex={activeIndex} onSelect={(item) => handleItemClick(item.path, item)} results={filteredResults} />
          ) : (
            <SearchEmptyState title={text.noResults(searchQuery)} description={text.tryDifferent} />
          )}
        </div>
      </div>
    </div>
  );
}
