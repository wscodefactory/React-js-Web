import { CatalogCard } from './CatalogCard';
import { CatalogSearch } from './CatalogSearch';
import { SectionHeader } from '../common';
import { useCatalogSearch } from '../../hooks/useCatalogSearch';
import type { CatalogItem } from '../../types/catalog';

interface CatalogPageProps {
  title: string;
  titleHighlight?: string;
  description: string;
  searchPlaceholder: string;
  items: CatalogItem[];
  storageKey: string;
}

export function CatalogPage({ title, titleHighlight, description, searchPlaceholder, items, storageKey }: CatalogPageProps) {
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

  return (
    <div className="container-page">
      <SectionHeader title={title} titleHighlight={titleHighlight} description={description} />

      <CatalogSearch
        items={searchQuery.trim() === '' ? [] : filteredItems}
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
      />

      <section className="grid-auto">
        {filteredItems.map((item) => (
          <CatalogCard key={item.path} item={item} />
        ))}
      </section>
    </div>
  );
}
