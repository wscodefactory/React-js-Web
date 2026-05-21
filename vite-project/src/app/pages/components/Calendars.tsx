import { ComponentPreviewCard } from "@/app/components/showcase/ComponentPreviewCard";
import { calendarShowcaseConfig } from "@/app/features/calendars";

export function Calendars() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
          {calendarShowcaseConfig.eyebrow}
        </p>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white md:text-4xl">
          {calendarShowcaseConfig.title}{" "}
          <span className="text-green-600 dark:text-green-400">{calendarShowcaseConfig.titleHighlight}</span>
        </h1>
        <p className="mb-2 text-gray-600 dark:text-gray-400">{calendarShowcaseConfig.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Last updated: {calendarShowcaseConfig.updatedAt}</p>
      </header>

      <div className="space-y-6">
        {calendarShowcaseConfig.sections.map((section) => (
          <ComponentPreviewCard key={section.title} item={section} />
        ))}
      </div>
    </div>
  );
}
