import { History, RotateCcw, Trash2 } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedPlatforms, mcpCopy } from './copy';
import type { ImportedSource } from './types';

type ImportHistoryPanelProps = {
  onClearHistory: () => void;
  onRemoveImport: (id: string) => void;
  history: ImportedSource[];
  onRestoreImport: (source: ImportedSource) => void;
};

export function ImportHistoryPanel({
  onClearHistory,
  onRemoveImport,
  history,
  onRestoreImport,
}: ImportHistoryPanelProps) {
  const { language } = useLanguage();
  const text = mcpCopy[language].history;
  const platforms = getLocalizedPlatforms(language);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-600" />
            <h2 className="card-title">{text.title}</h2>
          </div>
          {history.length > 0 ? (
            <Button variant="secondary" onClick={onClearHistory} className="shrink-0 gap-2 text-red-600 dark:text-red-300">
              <Trash2 className="h-4 w-4" />
              {text.clear}
            </Button>
          ) : null}
        </div>
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => {
              const platform = platforms.find((entry) => entry.id === item.platform) ?? platforms[0];

              return (
                <article
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-gray-900 dark:text-white">{item.name}</span>
                      <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                        {platform.label} / {item.importedAt}
                      </span>
                      <span className="mt-1 block truncate text-xs text-gray-400 dark:text-gray-500">{item.url}</span>
                    </div>
                    <Button variant="secondary" onClick={() => onRemoveImport(item.id)} aria-label={text.remove(item.name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="secondary" onClick={() => onRestoreImport(item)} className="mt-3 w-full justify-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    {text.restore}
                  </Button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {text.empty}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
