import { Button } from '../../components/common';

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
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredCount} of {totalCount} apps / {favoritesCount} saved
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{statusMessage}</p>
      </div>
      {showClearFilters ? (
        <Button variant="secondary" onClick={onClearFilters}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
