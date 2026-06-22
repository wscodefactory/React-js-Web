import { LayoutGrid, ListFilter, Search, Star } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { fullAppsUiText } from '../../i18n';
import type { ViewMode } from './types';

type FullAppsToolbarProps = {
  favoritesOnly: boolean;
  onQueryChange: (query: string) => void;
  onToggleFavoritesOnly: () => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  query: string;
  viewMode: ViewMode;
};

export function FullAppsToolbar({
  favoritesOnly,
  onQueryChange,
  onToggleFavoritesOnly,
  onViewModeChange,
  query,
  viewMode,
}: FullAppsToolbarProps) {
  const { language } = useLanguage();
  const text = fullAppsUiText[language];

  return (
    <Card className="mb-8">
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={text.searchPlaceholder}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={viewMode === 'grid' ? 'primary' : 'secondary'} onClick={() => onViewModeChange('grid')}>
            <LayoutGrid className="h-4 w-4" /> {text.grid}
          </Button>
          <Button type="button" variant={viewMode === 'list' ? 'primary' : 'secondary'} onClick={() => onViewModeChange('list')}>
            <ListFilter className="h-4 w-4" /> {text.list}
          </Button>
          <Button type="button" variant={favoritesOnly ? 'primary' : 'secondary'} onClick={onToggleFavoritesOnly}>
            <Star className={`h-4 w-4 ${favoritesOnly ? 'fill-current' : ''}`} /> {text.saved}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
