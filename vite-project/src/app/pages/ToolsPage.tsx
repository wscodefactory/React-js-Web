/**
 * Route page that showcases generator and editor style tools.
 * Tool metadata lives outside the component so the page stays declarative and compact.
 */
import { CatalogPage } from '../components/catalog/CatalogPage';
import { useLanguage } from '../context/LanguageContext';
import { toolCatalog } from '../data/catalog';
import { catalogPageText } from '../i18n';

export function ToolsPage() {
  const { language } = useLanguage();
  const text = catalogPageText[language].tools;

  return (
    <CatalogPage
      title={text.title}
      description={text.description}
      searchPlaceholder={text.searchPlaceholder}
      items={toolCatalog}
      storageKey="toolsSearchHistory"
    />
  );
}
