import { Download, History, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { quickToolOptions } from '../../data/showcase';
import { powerToolkitCopy } from './copy';
import type { ConversionTarget, QuickToolValue } from './types';
import type { ToolHistoryItem } from './types';

type HistoryPanelProps = {
  history: ToolHistoryItem[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onLoadHistoryItem: (item: ToolHistoryItem) => void;
};

function formatHistoryDate(value: string, language: 'en' | 'ko', unknownTime: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return unknownTime;
  }

  return date.toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function downloadHistory(history: ToolHistoryItem[]) {
  const blob = new Blob([JSON.stringify({
    exportedAt: new Date().toISOString(),
    history,
  }, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'powerts-toolkit-history.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function HistoryPanel({
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onLoadHistoryItem,
}: HistoryPanelProps) {
  const { language } = useLanguage();
  const text = powerToolkitCopy[language].history;
  const toolLabelMap = Object.fromEntries(quickToolOptions.map((option) => [
    option.value,
    powerToolkitCopy[language].quick.options[option.value as QuickToolValue] ?? option.label,
  ]));

  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{text.title}</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{text.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => downloadHistory(history)} disabled={history.length === 0} className="gap-2 disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="h-4 w-4" />
            {text.export}
          </Button>
          <Button variant="secondary" onClick={onClearHistory} disabled={history.length === 0} className="gap-2 text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300">
            <Trash2 className="h-4 w-4" />
            {text.clear}
          </Button>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((item) => (
            <article key={item.id} className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {toolLabelMap[item.tool] ?? item.tool}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                    {text.targetLabels[item.target as ConversionTarget] ?? item.target}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatHistoryDate(item.createdAt, language, text.unknownTime)}</span>
                </div>
                <p className="truncate font-mono text-sm text-gray-700 dark:text-gray-200">{item.input || text.emptyInput}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.result.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => onLoadHistoryItem(item)} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  {text.load}
                </Button>
                <Button variant="secondary" onClick={() => onDeleteHistoryItem(item.id)} className="gap-2 text-red-600 dark:text-red-300">
                  <Trash2 className="h-4 w-4" />
                  {text.delete}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {text.empty}
        </div>
      )}
    </section>
  );
}
