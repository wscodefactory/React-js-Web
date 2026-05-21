import { useEffect, useMemo, useState } from "react";
import { SearchX, Star } from "lucide-react";
import type { ComponentShowcaseConfig } from "@/app/types/component-showcase";
import { Button, Card, CardContent } from "@/app/components/common";
import { ComponentPreviewCard, getPreviewSectionId, savedPreviewStorageKey } from "./ComponentPreviewCard";

export interface ComponentShowcasePageProps {
  config: ComponentShowcaseConfig;
}

function readSavedPreviewIds() {
  try {
    return JSON.parse(window.localStorage.getItem(savedPreviewStorageKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/**
 * Shared page shell for the component gallery.
 * Detailed preview content is injected through the config object so page files stay tiny.
 */
export function ComponentShowcasePage({ config }: ComponentShowcasePageProps) {
  const [savedPreviewIds, setSavedPreviewIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const savedInPageCount = useMemo(
    () => config.sections.filter((section) => savedPreviewIds.includes(getPreviewSectionId(section.title))).length,
    [config.sections, savedPreviewIds],
  );
  const visibleSections = useMemo(
    () => showSavedOnly
      ? config.sections.filter((section) => savedPreviewIds.includes(getPreviewSectionId(section.title)))
      : config.sections,
    [config.sections, savedPreviewIds, showSavedOnly],
  );

  useEffect(() => {
    setSavedPreviewIds(readSavedPreviewIds());

    function handleSavedPreviewChange(event: Event) {
      const customEvent = event as CustomEvent<string[]>;
      setSavedPreviewIds(Array.isArray(customEvent.detail) ? customEvent.detail : readSavedPreviewIds());
    }

    function handleStorageChange() {
      setSavedPreviewIds(readSavedPreviewIds());
    }

    window.addEventListener("web5:saved-preview-change", handleSavedPreviewChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("web5:saved-preview-change", handleSavedPreviewChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
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
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {savedInPageCount} saved
          </span>
          <Button
            type="button"
            variant={showSavedOnly ? "primary" : "secondary"}
            onClick={() => setShowSavedOnly((current) => !current)}
            disabled={savedInPageCount === 0 && !showSavedOnly}
            className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap"
          >
            <Star className={`h-4 w-4 ${showSavedOnly ? "fill-current" : ""}`} />
            Saved only
          </Button>
        </div>
      </header>

      {visibleSections.length > 0 ? (
        <div className="space-y-6">
          {visibleSections.map((section) => (
            <ComponentPreviewCard key={section.title} item={section} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <SearchX className="mb-4 h-10 w-10 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No saved previews here</h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">Save a preview from the card menu to keep it visible in this filtered view.</p>
            <Button variant="secondary" onClick={() => setShowSavedOnly(false)} className="mt-5">Show all previews</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
