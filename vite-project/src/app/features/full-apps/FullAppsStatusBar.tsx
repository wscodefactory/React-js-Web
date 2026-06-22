import { Button } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { fullAppsUiText } from '../../i18n';

type FullAppsStatusBarProps = {
  favoritesCount: number;
  filteredCount: number;
  onClearFilters: () => void;
  showClearFilters: boolean;
  statusMessage: string;
  totalCount: number;
};

export function FullAppsStatusBar({
  favoritesCount,
  filteredCount,
  onClearFilters,
  showClearFilters,
  statusMessage,
  totalCount,
}: FullAppsStatusBarProps) {
  const { language } = useLanguage();
  const text = fullAppsUiText[language];

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {text.count(filteredCount, totalCount, favoritesCount)}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{statusMessage}</p>
      </div>
      {showClearFilters ? (
        <Button variant="secondary" onClick={onClearFilters}>
          {text.clearFilters}
        </Button>
      ) : null}
    </div>
  );
}
