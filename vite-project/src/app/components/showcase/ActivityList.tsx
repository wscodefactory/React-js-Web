import type { ActivityItem } from '@/app/types/showcase';

interface ActivityListProps {
  title: string;
  items: ActivityItem[];
}

/**
 * Shared stacked list for recent activity and compact feed-style content.
 */
export function ActivityList({ title, items }: ActivityListProps) {
  return (
    <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={`${item.title}-${item.detail ?? item.subtitle ?? ''}`}
            className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900"
          >
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h3>
              {item.subtitle ? <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              {item.badge ? (
                <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {item.badge}
                </span>
              ) : null}
              {item.detail ? <span className="text-sm text-gray-500 dark:text-gray-400">{item.detail}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
