import type { ReactNode } from 'react';
import type { OptionCardItem } from '@/app/types/showcase';

interface SelectionGridProps {
  items: OptionCardItem[];
  columnsClassName?: string;
  trailing?: (item: OptionCardItem) => ReactNode;
}

/**
 * Generic selectable grid used by demo pages for style, category, and tool palettes.
 */
export function SelectionGrid({ items, columnsClassName = 'grid-cols-2', trailing }: SelectionGridProps) {
  return (
    <div className={`grid ${columnsClassName} gap-2`}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
            item.selected
              ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-300'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {item.icon ? <span className="text-lg">{item.icon}</span> : null}
              <span className="truncate text-sm font-medium">{item.label}</span>
            </div>
            {trailing?.(item)}
          </div>
          {item.description ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.description}</p> : null}
        </button>
      ))}
    </div>
  );
}
