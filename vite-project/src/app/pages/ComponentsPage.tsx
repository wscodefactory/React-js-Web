/**
 * Landing page for the component catalog.
 * Uses a shared catalog shell so search, filtering, and cards stay consistent across sections.
 */
import { CatalogPage } from '../components/catalog/CatalogPage';
import { componentCatalog } from '../data/catalog';

export function ComponentsPage() {
  return (
    <CatalogPage
      title="Library"
      titleHighlight="Component"
      description="Browse and search through our collection of pre-built components."
      searchPlaceholder="Search components..."
      items={componentCatalog}
      storageKey="componentsSearchHistory"
    />
  );
}
