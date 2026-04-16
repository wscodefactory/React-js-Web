import { ActivityList } from '@/app/components/showcase/ActivityList';
import { MetricGrid } from '@/app/components/showcase/MetricGrid';
import { PageIntro } from '@/app/components/showcase/PageIntro';
import { ResourceGrid } from '@/app/components/showcase/ResourceGrid';
import { Button } from '@/app/components/common';
import { powerToolkitMetrics, powerToolkitRecentActivity, powerToolkitResources, quickToolActions, quickToolOptions } from '@/app/data/showcase';

/**
 * Power toolkit landing page built from shared showcase building blocks.
 * The page now reads like a composed React screen instead of a long static HTML template.
 */
export function PowerTsToolkitPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <PageIntro
        highlight="PowerT's"
        title="Toolkit"
        description="Essential tools for TypeScript developers and power users"
      />

      <MetricGrid items={powerToolkitMetrics} columnsClassName="grid-cols-1 sm:grid-cols-3" />

      <ActivityList title="Recently Used" items={powerToolkitRecentActivity} />

      <ResourceGrid title="All Tools" items={powerToolkitResources} />

      <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Tool</h2>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
            <option>Select a tool...</option>
            {quickToolOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4">
          <textarea
            className="h-48 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            placeholder="Paste your code or data here..."
          />
          <div className="mt-4 flex justify-end gap-2">
            {quickToolActions.map((action) => (
              <Button key={action.id} variant={action.variant}>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
