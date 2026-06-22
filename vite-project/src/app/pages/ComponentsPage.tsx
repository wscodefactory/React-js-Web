/**
 * Landing page for the component catalog.
 * Uses a shared catalog shell so search, filtering, and cards stay consistent across sections.
 */
import { CatalogPage } from '../components/catalog/CatalogPage';
import { useLanguage } from '../context/LanguageContext';
import { componentCatalog } from '../data/catalog';
import { catalogPageText } from '../i18n';

export function ComponentsPage() {
  const { language } = useLanguage();
  const text = catalogPageText[language].components;

  return (
    <CatalogPage
      title={text.title}
      titleHighlight={text.titleHighlight}
      description={text.description}
      searchPlaceholder={text.searchPlaceholder}
      items={componentCatalog}
      storageKey="componentsSearchHistory"
    />
  );
}
