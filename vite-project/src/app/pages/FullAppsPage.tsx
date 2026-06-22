import { FullAppsResults, FullAppsStatusBar, FullAppsToolbar, useFullAppsController } from '../features/full-apps';
import { PageIntro } from '../components/showcase/PageIntro';
import { useLanguage } from '../context/LanguageContext';
import { fullAppsPageText } from '../i18n';

export function FullAppsPage() {
  const fullApps = useFullAppsController();
  const { language } = useLanguage();
  const text = fullAppsPageText[language];
  const hasActiveFilters = Boolean(fullApps.query.trim() || fullApps.favoritesOnly);
  const showClearFilters = hasActiveFilters && fullApps.filteredApps.length > 0;

  return (
    <main className="p-4 md:p-8">
      <PageIntro highlight={text.highlight} title={text.title} description={text.description} />

      <FullAppsToolbar
        favoritesOnly={fullApps.favoritesOnly}
        onQueryChange={fullApps.setQuery}
        onToggleFavoritesOnly={() => fullApps.setFavoritesOnly((current) => !current)}
        onViewModeChange={fullApps.setViewMode}
        query={fullApps.query}
        viewMode={fullApps.viewMode}
      />

      <FullAppsStatusBar
        favoritesCount={fullApps.favoritesCount}
        filteredCount={fullApps.filteredApps.length}
        onClearFilters={fullApps.clearFilters}
        showClearFilters={showClearFilters}
        statusMessage={fullApps.statusMessage}
        totalCount={fullApps.totalCount}
      />

      <FullAppsResults
        apps={fullApps.filteredApps}
        isFavorite={fullApps.isFavorite}
        lastOpened={fullApps.lastOpened}
        onClearFilters={fullApps.clearFilters}
        onOpen={fullApps.openApp}
        onToggleFavorite={fullApps.toggleFavorite}
        viewMode={fullApps.viewMode}
      />
    </main>
  );
}
