import type { ComponentPreviewItem } from "@/app/types/component-showcase";

const badgeToneClasses = {
  free: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  pro: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  featured: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
} as const;

interface ComponentPreviewCardProps {
  item: ComponentPreviewItem;
}

/**
 * Reusable card for component demo pages.
 * Keeps the layout consistent while individual previews remain flexible.
 */
export function ComponentPreviewCard({ item }: ComponentPreviewCardProps) {
  const tone = item.badge?.tone ?? "free";

  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
        </div>
        {item.badge ? (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeToneClasses[tone]}`}>
            {item.badge.label}
          </span>
        ) : null}
      </div>

      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <div className="rounded-xl bg-white p-4 dark:bg-gray-900">{item.preview}</div>
      </div>
    </section>
  );
}
