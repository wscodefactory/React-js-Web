import { useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { CatalogCard } from './CatalogCard';
import { CatalogSearch } from './CatalogSearch';
import { Button, Card, CardContent, SectionHeader } from '../common';
import { useCatalogSearch } from '../../hooks/useCatalogSearch';
import type { CatalogItem } from '../../types/catalog';

export interface CatalogPageProps {
  title: string;
  titleHighlight?: string;
  description: string;
  searchPlaceholder: string;
  items: CatalogItem[];
  storageKey: string;
}

export function CatalogPage({ title, titleHighlight, description, searchPlaceholder, items, storageKey }: CatalogPageProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const {
    searchQuery,
    isDropdownOpen,
    recentSearches,
    filteredItems,
    dropdownRef,
    setSearchQuery,
    setIsDropdownOpen,
    handleInputFocus,
    handleResultClick,
    removeRecentSearch,
    clearAllRecentSearches,
  } = useCatalogSearch(items, storageKey);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(items.map((item) => item.category).filter(Boolean) as string[]))];
  }, [items]);

  const visibleItems = useMemo(() => {
    if (activeCategory === 'All') {
      return filteredItems;
    }

    return filteredItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, filteredItems]);

  const clearFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="container-page">
      <SectionHeader title={title} titleHighlight={titleHighlight} description={description} />

      <CatalogSearch
        items={searchQuery.trim() === '' ? [] : visibleItems}
        searchQuery={searchQuery}
        isDropdownOpen={isDropdownOpen}
        recentSearches={recentSearches}
        dropdownRef={dropdownRef}
        placeholder={searchPlaceholder}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          setIsDropdownOpen(true);
        }}
        onInputFocus={handleInputFocus}
        onResultClick={handleResultClick}
        onRemoveRecent={removeRecentSearch}
        onClearAllRecent={clearAllRecentSearches}
        onClearSearch={() => {
          setSearchQuery('');
          setIsDropdownOpen(false);
        }}
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                activeCategory === category
                  ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{visibleItems.length} of {items.length} items</p>
      </div>

      {visibleItems.length > 0 ? (
        <section className="grid-auto">
          {visibleItems.map((item) => (
          <CatalogCard key={item.path} item={item} />
          ))}
        </section>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <SearchX className="mb-4 h-10 w-10 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No matching items</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Try a different keyword or reset the category filter.
            </p>
            <Button variant="secondary" onClick={clearFilters} className="mt-5">
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
