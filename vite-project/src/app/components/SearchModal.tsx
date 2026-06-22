import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Clock, CornerDownLeft, Search, X } from 'lucide-react';
import { searchItems } from '../config/navigation';
import { useLanguage } from '../context/LanguageContext';
import { localizeRouteLabel, localizeSearchItem, searchModalText } from '../i18n';
import type { SearchItem } from '../types/navigation';
import type { StoredRecentSearch } from '../types/common';
import { loadStoredList, saveStoredList } from '../utils/storage';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function isStoredRecentSearch(value: unknown): value is StoredRecentSearch {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.name === 'string'
    && typeof record.path === 'string'
    && typeof record.timestamp === 'number'
  );
}

function clampIndex(index: number, length: number) {
  if (length === 0) return -1;
  if (index < 0) return length - 1;
  if (index >= length) return 0;
  return index;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<StoredRecentSearch[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { language } = useLanguage();
  const navigate = useNavigate();
  const text = searchModalText[language];

  const filteredResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchItems.flatMap((item) => {
      const localizedItem = localizeSearchItem(language, item);
      const haystacks = [
        item.name,
        item.description,
        item.category,
        ...item.keywords,
        localizedItem.name,
        localizedItem.description,
        localizedItem.category,
        ...localizedItem.keywords,
      ].map((value) => value.toLowerCase());

      return haystacks.some((value) => value.includes(normalizedQuery)) ? [localizedItem] : [];
    });
  }, [language, searchQuery]);

  const visibleItems = searchQuery.trim() ? filteredResults : recentSearches;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSearchQuery('');
    setActiveIndex(0);
    setRecentSearches(loadStoredList('recentSearches', isStoredRecentSearch));
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const saveRecentSearch = (item: SearchItem) => {
    const nextItem: StoredRecentSearch = {
      name: item.name,
      path: item.path,
      timestamp: Date.now(),
    };

    const updated = [nextItem, ...recentSearches.filter((search) => search.path !== item.path)].slice(0, 5);
    setRecentSearches(updated);
    saveStoredList('recentSearches', updated);
  };

  const handleItemClick = (path: string, item?: SearchItem) => {
    if (item) {
      saveRecentSearch(item);
    }

    navigate(path);
    setSearchQuery('');
    onClose();
  };

  const removeRecentSearch = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const updated = recentSearches.filter((search) => search.path !== path);
    setRecentSearches(updated);
    saveStoredList('recentSearches', updated);
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => clampIndex(current + 1, visibleItems.length));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => clampIndex(current - 1, visibleItems.length));
      return;
    }

    if (event.key !== 'Enter' || visibleItems.length === 0) {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]">
      <button type="button" aria-label={text.closeSearch} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-700">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={text.placeholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          />
          {searchQuery.trim() ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label={text.clearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={text.closeSearchModal}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() === '' ? (
            recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{text.recent}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllRecentSearches}
                    className="text-xs text-green-600 hover:underline dark:text-green-400"
                  >
                    {text.clearAll}
                  </button>
                </div>
                {recentSearches.map((item, index) => (
                  <div
                    key={item.path}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors group ${
                      activeIndex === index ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.path)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <Clock className="h-5 w-5 shrink-0 text-gray-400" />
                      <span className="flex-1 text-gray-900 dark:text-white">{localizeRouteLabel(language, item.path, item.name)}</span>
                      {activeIndex === index ? <CornerDownLeft className="h-4 w-4 text-gray-400" /> : null}
                    </button>
                    <button
                      type="button"
                      onClick={(event) => removeRecentSearch(item.path, event)}
                      className="rounded p-1 text-gray-500 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:text-gray-400 dark:hover:bg-gray-600"
                      aria-label={text.removeRecent(localizeRouteLabel(language, item.path, item.name))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                <Search className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>{text.empty}</p>
                <p className="mt-2 text-sm">{text.tryExamples}</p>
              </div>
            )
          ) : filteredResults.length > 0 ? (
            <div className="py-2">
              {filteredResults.map((item, index) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleItemClick(item.path, item)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    activeIndex === index ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded bg-green-100 dark:bg-green-900/30">
                    <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                  {activeIndex === index ? <CornerDownLeft className="mt-3 h-4 w-4 text-gray-400" /> : null}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
              <Search className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p>{text.noResults(searchQuery)}</p>
              <p className="mt-2 text-sm">{text.tryDifferent}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
