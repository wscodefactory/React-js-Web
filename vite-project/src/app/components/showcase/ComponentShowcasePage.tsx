import { useEffect, useMemo, useState } from "react";
import { Search, SearchX, Star, X } from "lucide-react";
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
  const [query, setQuery] = useState("");

  const savedInPageCount = useMemo(
    () => config.sections.filter((section) => savedPreviewIds.includes(getPreviewSectionId(section.title))).length,
    [config.sections, savedPreviewIds],
  );
  const matchingSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return config.sections;
    }

    return config.sections.filter((section) => {
      const searchableText = [
        section.title,
        section.description,
        section.badge?.label ?? "",
      ].join(" ").toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [config.sections, query]);
  const visibleSections = useMemo(
    () => showSavedOnly
      ? matchingSections.filter((section) => savedPreviewIds.includes(getPreviewSectionId(section.title)))
      : matchingSections,
    [matchingSections, savedPreviewIds, showSavedOnly],
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
        <div className="flex w-full flex-col gap-2 lg:max-w-md">
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search previews"
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-green-700 dark:focus:ring-green-950"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear preview search"
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>
          <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {savedInPageCount} saved
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {visibleSections.length} showing
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {query ? "No previews match this search" : "No saved previews here"}
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              {query ? "Clear the search or try another component name." : "Save a preview from the card menu to keep it visible in this filtered view."}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setShowSavedOnly(false);
              }}
              className="mt-5"
            >
              Show all previews
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
