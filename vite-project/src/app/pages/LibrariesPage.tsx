/**
 * Route page that highlights reusable library-style assets and packages.
 * Shared catalog infrastructure keeps this page aligned with the rest of the app.
 */
import { CatalogPage } from '../components/catalog/CatalogPage';
import { useLanguage } from '../context/LanguageContext';
import { libraryCatalog } from '../data/catalog';
import { catalogPageText } from '../i18n';

export function LibrariesPage() {
  const { language } = useLanguage();
  const text = catalogPageText[language].libraries;

  return (
    <CatalogPage
      title={text.title}
      titleHighlight={text.titleHighlight}
      description={text.description}
      searchPlaceholder={text.searchPlaceholder}
      items={libraryCatalog}
      storageKey="librariesSearchHistory"
    />
  );
}
