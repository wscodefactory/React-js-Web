import type { ComponentShowcaseConfig } from "@/app/types/component-showcase";
import { ComponentPreviewCard } from "./ComponentPreviewCard";

interface ComponentShowcasePageProps {
  config: ComponentShowcaseConfig;
}

/**
 * Shared page shell for the component gallery.
 * Detailed preview content is injected through the config object so page files stay tiny.
 */
export function ComponentShowcasePage({ config }: ComponentShowcasePageProps) {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8 max-w-3xl">
        {config.eyebrow ? (
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            {config.eyebrow}
          </p>
        ) : null}
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">
          {config.title} <span className="text-green-600 dark:text-green-400">{config.titleHighlight}</span>
        </h1>
        <p className="mb-2 text-gray-600 dark:text-gray-400">{config.description}</p>
        {config.updatedAt ? (
          <p className="text-sm text-gray-500 dark:text-gray-500">Last updated: {config.updatedAt}</p>
        ) : null}
      </header>

      <div className="space-y-6">
        {config.sections.map((section) => (
          <ComponentPreviewCard key={section.title} item={section} />
        ))}
      </div>
    </div>
  );
}
