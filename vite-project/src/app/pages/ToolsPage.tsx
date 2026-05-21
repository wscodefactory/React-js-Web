/**
 * Route page that showcases generator and editor style tools.
 * Tool metadata lives outside the component so the page stays declarative and compact.
 */
import { CatalogPage } from '../components/catalog/CatalogPage';
import { toolCatalog } from '../data/catalog';

export function ToolsPage() {
  return (
    <CatalogPage
      title="Tools"
      description="Use focused generators and editors to speed up implementation work across the library."
      searchPlaceholder="Search tools..."
      items={toolCatalog}
      storageKey="toolsSearchHistory"
    />
  );
}
