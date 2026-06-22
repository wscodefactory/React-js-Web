import { SearchX } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { fullAppsUiText } from '../../i18n';

type FullAppsEmptyStateProps = {
  onClearFilters: () => void;
};

export function FullAppsEmptyState({ onClearFilters }: FullAppsEmptyStateProps) {
  const { language } = useLanguage();
  const text = fullAppsUiText[language];

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-14 text-center">
        <SearchX className="mb-4 h-10 w-10 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{text.emptyTitle}</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          {text.emptyDescription}
        </p>
        <Button variant="secondary" onClick={onClearFilters} className="mt-5">
          {text.clearFilters}
        </Button>
      </CardContent>
    </Card>
  );
}
