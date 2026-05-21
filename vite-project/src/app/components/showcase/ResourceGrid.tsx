import type { ToolResourceItem } from '@/app/types/showcase';

export interface ResourceGridProps {
  title: string;
  items: ToolResourceItem[];
  selectedItemId?: number;
  onSelect?: (item: ToolResourceItem) => void;
}

/**
 * Card grid for tool and resource catalogs used by richer detail pages.
 */
export function ResourceGrid({ title, items, selectedItemId, onSelect }: ResourceGridProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedItemId === item.id;
          const content = (
              <div className="flex items-start gap-4">
                <div className={[
                  'rounded-lg p-3 transition-colors group-hover:bg-green-200 dark:group-hover:bg-green-900/50',
                  isSelected ? 'bg-green-200 dark:bg-green-900/50' : 'bg-green-100 dark:bg-green-900/30',
                ].join(' ')}>
                  <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {item.category}
                  </span>
                </div>
              </div>
          );

          if (onSelect) {
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(item)}
                className={[
                  'group rounded-lg border bg-white p-6 text-left transition hover:shadow-lg dark:bg-gray-800',
                  isSelected
                    ? 'border-green-500 shadow-md shadow-green-500/10 dark:border-green-500'
                    : 'border-gray-200 dark:border-gray-700',
                ].join(' ')}
              >
                {content}
              </button>
            );
          }

          return (
            <article
              key={item.id}
              className="group rounded-lg border border-gray-200 bg-white p-6 transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
