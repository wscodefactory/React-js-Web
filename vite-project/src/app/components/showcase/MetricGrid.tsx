import type { MetricItem } from '@/app/types/showcase';

interface MetricGridProps {
  items: MetricItem[];
  columnsClassName?: string;
}

const accentClassMap: Record<NonNullable<MetricItem['accent']>, string> = {
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  yellow: 'text-amber-600 dark:text-amber-400',
  gray: 'text-gray-900 dark:text-white',
};

export function MetricGrid({ items, columnsClassName = 'grid-cols-2 md:grid-cols-4' }: MetricGridProps) {
  return (
    <div className={`grid ${columnsClassName} gap-4`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.label} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                <p className={`text-2xl font-semibold ${accentClassMap[item.accent ?? 'gray']}`}>{item.value}</p>
              </div>
              {Icon ? (
                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                  <Icon className={`h-5 w-5 ${accentClassMap[item.accent ?? 'gray']}`} />
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
