import { History } from 'lucide-react';
import { Card, CardContent } from '../../components/common';
import { supportedPlatforms } from './data';
import type { ImportedSource } from './types';

type ImportHistoryPanelProps = {
  history: ImportedSource[];
  onRestoreImport: (source: ImportedSource) => void;
};

export function ImportHistoryPanel({
  history,
  onRestoreImport,
}: ImportHistoryPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-green-600" />
          <h2 className="card-title">Import History</h2>
        </div>
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item) => {
              const platform = supportedPlatforms.find((entry) => entry.id === item.platform) ?? supportedPlatforms[0];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onRestoreImport(item)}
                  className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-green-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-green-700"
                >
                  <span className="block font-medium text-gray-900 dark:text-white">{item.name}</span>
                  <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    {platform.label} / {item.importedAt}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            No imports yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
