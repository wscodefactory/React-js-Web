import { FullAppCard } from './FullAppCard';
import { FullAppsEmptyState } from './FullAppsEmptyState';
import type { FullAppItem, ViewMode } from './types';

type FullAppsResultsProps = {
  apps: FullAppItem[];
  isFavorite: (path: string) => boolean;
  lastOpened: Record<string, string>;
  onClearFilters: () => void;
  onOpen: (app: FullAppItem) => void;
  onToggleFavorite: (app: FullAppItem) => void;
  viewMode: ViewMode;
};

export function FullAppsResults({
  apps,
  isFavorite,
  lastOpened,
  onClearFilters,
  onOpen,
  onToggleFavorite,
  viewMode,
}: FullAppsResultsProps) {
  if (apps.length === 0) {
    return <FullAppsEmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <section className={viewMode === 'grid' ? 'grid gap-5 lg:grid-cols-2' : 'space-y-4'}>
      {apps.map((app) => (
        <FullAppCard
          key={app.path}
          app={app}
          viewMode={viewMode}
          favorite={isFavorite(app.path)}
          lastOpened={lastOpened[app.path]}
          onOpen={() => onOpen(app)}
          onToggleFavorite={() => onToggleFavorite(app)}
        />
      ))}
    </section>
  );
}
