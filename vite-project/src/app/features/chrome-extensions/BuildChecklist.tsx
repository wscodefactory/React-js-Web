import { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { checklistItems } from './data';

export function BuildChecklist() {
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const completedCount = completedItems.length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);

  const toggleItem = (item: string) => {
    setCompletedItems((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Build checklist</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {completedCount} of {checklistItems.length} complete
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
        {completedCount > 0 ? (
          <Button variant="secondary" onClick={() => setCompletedItems([])} className="w-full justify-center">
            Reset checklist
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
