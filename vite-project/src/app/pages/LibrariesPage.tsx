/**
 * Route page that highlights reusable library-style assets and packages.
 * Shared catalog infrastructure keeps this page aligned with the rest of the app.
 */
import { CatalogPage } from '../components/catalog/CatalogPage';
import { libraryCatalog } from '../data/catalog';

export function LibrariesPage() {
  return (
    <CatalogPage
      title="Libraries"
      titleHighlight="Your"
      description="Discover and manage reusable libraries, asset packs, and shared building blocks."
      searchPlaceholder="Search libraries..."
      items={libraryCatalog}
      storageKey="librariesSearchHistory"
    />
  );
}
