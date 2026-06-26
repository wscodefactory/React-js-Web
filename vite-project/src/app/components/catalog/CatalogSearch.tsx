import type { MouseEvent, RefObject } from 'react';
import { Clock, Search, X } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';
import { catalogText, getCatalogItemCopy } from '../../i18n';
import type { CatalogItem } from '../../types/catalog';

export interface CatalogSearchProps {
  items: CatalogItem[];
  searchQuery: string;
  isDropdownOpen: boolean;
  recentSearches: CatalogItem[];
  dropdownRef: RefObject<HTMLDivElement>;
  placeholder: string;
  onSearchQueryChange: (value: string) => void;
  onInputFocus: () => void;
  onResultClick: (item: CatalogItem) => void;
  onRemoveRecent: (path: string, event: MouseEvent<Element>) => void;
  onClearAllRecent: () => void;
  onClearSearch: () => void;
}

export function CatalogSearch({
  items,
  searchQuery,
  isDropdownOpen,
  recentSearches,
  dropdownRef,
  placeholder,
  onSearchQueryChange,
  onInputFocus,
  onResultClick,
  onRemoveRecent,
  onClearAllRecent,
  onClearSearch,
}: CatalogSearchProps) {
  const { language } = useLanguage();
  const text = catalogText[language];
  const searchableItems = searchQuery.trim() === '' ? [] : items;

  return (
    <div className="relative mb-6 md:mb-8" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 icon text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          onFocus={onInputFocus}
          className="form-input w-full !pl-12 !pr-12"
        />
        {searchQuery.trim() ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label={text.clearSearch}
          >
            <X className="icon-sm" />
          </button>
        ) : null}
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-10">
          {searchQuery.trim() === '' ? (
            recentSearches.length > 0 ? (
              <div className="py-2">
                <header className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Clock className="icon-sm" />
                    <span>{text.recent}</span>
                  </div>
                  <button type="button" onClick={onClearAllRecent} className="text-xs text-primary hover:underline">
                    {text.clearAll}
                  </button>
                </header>
                {recentSearches.map((item) => {
                  const itemCopy = getCatalogItemCopy(language, item);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => onResultClick(item)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    >
                      <Clock className="icon text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="block text-gray-900 dark:text-white">{itemCopy.name}</span>
                        {itemCopy.category && <span className="text-xs text-muted">{itemCopy.category}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={(event) => onRemoveRecent(item.path, event)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
                      >
                        <X className="icon-sm text-gray-500 dark:text-gray-400" />
                      </button>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{text.noRecent}</p>
                <p className="text-xs mt-1">{text.noRecentHelp}</p>
              </div>
            )
          ) : searchableItems.length > 0 ? (
            <div className="py-2">
              {searchableItems.map((item) => {
                const itemCopy = getCatalogItemCopy(language, item);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => onResultClick(item)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Search className="icon text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white">{itemCopy.name}</h3>
                      <p className="text-sm text-muted mt-0.5">{itemCopy.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-muted">
              <p>{text.noResults(searchQuery)}</p>
              <p className="text-sm mt-1">{text.searchAgain}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
