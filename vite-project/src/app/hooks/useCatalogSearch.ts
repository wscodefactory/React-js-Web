import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from 'react';
import type { CatalogItem } from '../types/catalog';
import { loadStoredList, saveStoredList } from '../utils/storage';

interface SearchState {
  searchQuery: string;
  isDropdownOpen: boolean;
  recentSearches: CatalogItem[];
  filteredItems: CatalogItem[];
  dropdownRef: RefObject<HTMLDivElement>;
  setSearchQuery: (value: string) => void;
  setIsDropdownOpen: (value: boolean) => void;
  handleInputFocus: () => void;
  handleResultClick: (item: CatalogItem) => void;
  removeRecentSearch: (path: string, event: ReactMouseEvent<Element>) => void;
  clearAllRecentSearches: () => void;
}

export function useCatalogSearch(items: CatalogItem[], storageKey: string): SearchState {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<CatalogItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null!);

  const filteredItems = useMemo(() => {
    if (searchQuery.trim() === '') {
      return items;
    }

    const normalizedQuery = searchQuery.toLowerCase();
    return items.filter((item) => {
      return [item.name, item.description, item.category]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });
  }, [items, searchQuery]);

  useEffect(() => {
    setRecentSearches(loadStoredList(storageKey, isCatalogItem));
  }, [storageKey]);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const persistRecentSearches = (nextItems: CatalogItem[]) => {
    setRecentSearches(nextItems);
    saveStoredList(storageKey, nextItems);
  };

  const handleResultClick = (item: CatalogItem) => {
    const updated = [item, ...recentSearches.filter((entry) => entry.path !== item.path)].slice(0, 5);
    persistRecentSearches(updated);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const removeRecentSearch = (path: string, event: ReactMouseEvent<Element>) => {
    event.preventDefault();
    event.stopPropagation();
    persistRecentSearches(recentSearches.filter((entry) => entry.path !== path));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(storageKey);
  };

  return {
    searchQuery,
    isDropdownOpen,
    recentSearches,
    filteredItems,
    dropdownRef,
    setSearchQuery,
    setIsDropdownOpen,
    handleInputFocus: () => setIsDropdownOpen(true),
    handleResultClick,
    removeRecentSearch,
    clearAllRecentSearches,
  };
}

function isCatalogItem(value: unknown): value is CatalogItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<CatalogItem>;
  const hasIcon = candidate.icon === undefined || typeof candidate.icon === 'function';

  return (
    typeof candidate.name === 'string'
    && typeof candidate.description === 'string'
    && typeof candidate.path === 'string'
    && (candidate.badge === undefined || typeof candidate.badge === 'string')
    && (candidate.category === undefined || typeof candidate.category === 'string')
    && hasIcon
  );
}
