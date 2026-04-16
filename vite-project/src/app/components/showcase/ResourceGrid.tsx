import type { ToolResourceItem } from '@/app/types/showcase';

interface ResourceGridProps {
  title: string;
  items: ToolResourceItem[];
}

/**
 * Card grid for tool and resource catalogs used by richer detail pages.
 */
export function ResourceGrid({ title, items }: ResourceGridProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-100 p-3 transition-colors group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
