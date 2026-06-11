import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { checklistItems } from './data';

type BuildChecklistProps = {
  templateId: string;
  templateName: string;
};
type ChecklistProgress = Record<string, string[]>;

const checklistStorageKey = 'web5:chrome-extension-checklists:v1';

function isChecklistProgress(value: unknown): value is ChecklistProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((items) => Array.isArray(items) && items.every((item) => typeof item === 'string'));
}

function readStoredChecklistProgress(): ChecklistProgress {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(checklistStorageKey) ?? '{}') as unknown;

    if (!isChecklistProgress(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).map(([templateId, items]) => [
        templateId,
        items.filter((item) => checklistItems.includes(item)),
      ]),
    );
  } catch {
    return {};
  }
}

export function BuildChecklist({ templateId, templateName }: BuildChecklistProps) {
  const [progressByTemplate, setProgressByTemplate] = useState<ChecklistProgress>(() => readStoredChecklistProgress());
  const completedItems = useMemo(() => progressByTemplate[templateId] ?? [], [progressByTemplate, templateId]);
  const completedCount = completedItems.length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);
  const allComplete = completedCount === checklistItems.length;

  useEffect(() => {
    window.localStorage.setItem(checklistStorageKey, JSON.stringify(progressByTemplate));
  }, [progressByTemplate]);

  const toggleItem = (item: string) => {
    setProgressByTemplate((current) => {
      const templateItems = current[templateId] ?? [];
      const nextItems = templateItems.includes(item)
        ? templateItems.filter((entry) => entry !== item)
        : [...templateItems, item];

      return {
        ...current,
        [templateId]: nextItems,
      };
    });
  };

  const completeAll = () => {
    setProgressByTemplate((current) => ({
      ...current,
      [templateId]: checklistItems,
    }));
  };

  const resetChecklist = () => {
    setProgressByTemplate((current) => {
      const nextProgress = { ...current };
      delete nextProgress[templateId];

      return nextProgress;
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Build checklist</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {templateName} / {completedCount} of {checklistItems.length} complete
            </p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {progress}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
          <div className="h-full rounded-full bg-green-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="space-y-2">
          {checklistItems.map((item) => {
            const done = completedItems.includes(item);

            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleItem(item)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${done ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'}`}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                {item}
              </button>
            );
          })}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={completeAll} disabled={allComplete} className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
            Mark all done
          </Button>
          <Button variant="secondary" onClick={resetChecklist} disabled={completedCount === 0} className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-50">
            Reset checklist
          </Button>
        </div>
        {completedCount > 0 ? (
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            Checklist progress is saved for this template.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
