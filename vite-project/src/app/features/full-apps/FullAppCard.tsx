import { ArrowRight, CheckCircle2, Clock3, Star } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { fullAppsUiText, getCatalogItemCopy, getFullAppHighlights } from '../../i18n';
import { appHighlights, defaultAppHighlights } from './data';
import type { FullAppItem, ViewMode } from './types';

type FullAppCardProps = {
  app: FullAppItem;
  favorite: boolean;
  lastOpened?: string;
  onOpen: () => void;
  onToggleFavorite: () => void;
  viewMode: ViewMode;
};

export function FullAppCard({
  app,
  favorite,
  lastOpened,
  onOpen,
  onToggleFavorite,
  viewMode,
}: FullAppCardProps) {
  const { language } = useLanguage();
  const text = fullAppsUiText[language];
  const appCopy = getCatalogItemCopy(language, app);
  const highlights = getFullAppHighlights(language, app.name, appHighlights[app.name] ?? defaultAppHighlights);

  return (
    <Card hover>
      <CardContent className={viewMode === 'list' ? 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between' : 'space-y-5'}>
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
              {appCopy.category}
            </span>
            {lastOpened ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                <Clock3 className="h-3 w-3" /> {text.openedAt(lastOpened)}
              </span>
            ) : null}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-white">{appCopy.name}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{appCopy.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300"
              >
                <CheckCircle2 className="h-3 w-3 text-green-600" /> {highlight}
              </span>
            ))}
          </div>
        </div>
        <div className={viewMode === 'list' ? 'flex shrink-0 gap-2' : 'flex gap-2'}>
          <Button
            type="button"
            variant="secondary"
            onClick={onToggleFavorite}
            className={favorite ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300' : ''}
            aria-label={favorite ? text.removeFavorite(appCopy.name) : text.addFavorite(appCopy.name)}
          >
            <Star className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
            {favorite ? text.saved : text.save}
          </Button>
          <Button type="button" variant="secondary" onClick={onOpen} className="shrink-0">
            {text.viewApp} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
