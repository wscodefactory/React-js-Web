import { SearchX } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';

type FullAppsEmptyStateProps = {
  onClearFilters: () => void;
};

export function FullAppsEmptyState({ onClearFilters }: FullAppsEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <SearchX className="mb-4 h-10 w-10 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No apps found</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          Try a broader keyword or clear the current search.
        </p>
        <Button variant="secondary" onClick={onClearFilters} className="mt-5">
          Clear filters
        </Button>
      </CardContent>
    </Card>
  );
}
