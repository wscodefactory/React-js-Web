/**
 * Route page that lists larger application demos.
 * The page is now data-driven rather than hand-authored card markup.
 */
import { CatalogPage } from '../components/catalog/CatalogPage';
import { fullAppCatalog } from '../data/catalog';

export function FullAppsPage() {
  return (
    <CatalogPage
      title="Apps"
      titleHighlight="Full"
      description="Explore complete application templates built from reusable UI and workflow patterns."
      searchPlaceholder="Search full apps..."
      items={fullAppCatalog}
      storageKey="fullAppsSearchHistory"
    />
  );
}
