/**
 * Command-palette style modal used for global navigation.
 * Supports recent searches and quick jumps across showcase sections and detail pages.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, X, Clock } from 'lucide-react';
import { searchItems } from '../config/navigation';
import type { SearchItem } from '../types/navigation';
import type { StoredRecentSearch } from '../types/common';
import { loadStoredList, saveStoredList } from '../utils/storage';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<StoredRecentSearch[]>([]);
  const navigate = useNavigate();

  const filteredResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchItems.filter((item) => {
      const haystacks = [item.name, item.description, item.category, ...item.keywords].map((value) => value.toLowerCase());
      return haystacks.some((value) => value.includes(normalizedQuery));
    });
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(loadStoredList('recentSearches', isStoredRecentSearch));
    }
  }, [isOpen]);

  const saveRecentSearch = (item: SearchItem) => {
    const newSearch: StoredRecentSearch = {
      name: item.name,
      path: item.path,
      timestamp: Date.now(),
    };

    const updated = [newSearch, ...recentSearches.filter((search) => search.path !== item.path)].slice(0, 5);

    setRecentSearches(updated);
    saveStoredList('recentSearches', updated);
  };

  const removeRecentSearch = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = recentSearches.filter((search) => search.path !== path);
    setRecentSearches(updated);
    saveStoredList('recentSearches', updated);
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleItemClick = (path: string, item?: SearchItem) => {
    if (item) {
      saveRecentSearch(item);
    }
    navigate(path);
    onClose();
    setSearchQuery('');
  };

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for components, pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-lg"
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery.trim() === '' ? (
            recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    onClick={clearAllRecentSearches}
                    className="text-xs text-green-600 dark:text-green-400 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.map((item) => (
                  <div
                    key={item.path}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-left"
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.path)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 text-gray-900 dark:text-white">{item.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => removeRecentSearch(item.path, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
                    >
                      <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Type to search for pages and components...</p>
                <p className="text-sm mt-2">Try "button", "modal", "svg", or "project"</p>
              </div>
            )
          ) : filteredResults.length > 0 ? (
            <div className="py-2">
              {filteredResults.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item.path, item)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center flex-shrink-0 mt-1">
                    <Search className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">↵</kbd>
              to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs">ESC</kbd>
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function isStoredRecentSearch(value: unknown): value is StoredRecentSearch {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<StoredRecentSearch>;
  return (
    typeof candidate.name === 'string'
    && typeof candidate.path === 'string'
    && typeof candidate.timestamp === 'number'
  );
}
