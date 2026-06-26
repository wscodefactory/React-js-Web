import { Search, X } from "lucide-react";
import { Button } from "@/app/components/common";
import type { SearchItem } from "@/app/types/navigation";
import type { HomeText } from "./types";

type HomeSearchBoxProps = {
  onClear: () => void;
  onQueryChange: (query: string) => void;
  onSelectResult: (item: SearchItem) => void;
  onSubmit: () => void;
  query: string;
  results: SearchItem[];
  text: HomeText;
};

function SearchResultList({ onClear, onSelectResult, query, results, text }: HomeSearchBoxProps) {
  if (!query.trim()) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-sm dark:border-gray-800">
        <span className="text-gray-500 dark:text-gray-400">{text.searchResults}</span>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label={text.clearSearch}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {results.length > 0 ? (
        <div className="max-h-[360px] overflow-y-auto p-2">
          {results.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => onSelectResult(item)}
              className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="mt-0.5 rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Search className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium text-gray-900 dark:text-white">{item.name}</span>
                  <span className="badge badge-success shrink-0">{item.category}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>{text.searchNoResults}</p>
          <p className="mt-1">{text.searchTryDifferent}</p>
        </div>
      )}
    </div>
  );
}

export function HomeSearchBox({
  onClear,
  onQueryChange,
  onSelectResult,
  onSubmit,
  query,
  results,
  text,
}: HomeSearchBoxProps) {
  return (
    <>
      <div className="relative mt-8 max-w-full md:max-w-3xl">
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800/80 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-1">
            <Search className="h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSubmit();
                }
              }}
              placeholder={text.searchPlaceholder}
              className="w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
          <Button
            type="button"
            className="w-full shrink-0 justify-center disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            onClick={onSubmit}
            disabled={!query.trim() || results.length === 0}
          >
            {text.searchButton}
          </Button>
        </div>
        <SearchResultList
          onClear={onClear}
          onQueryChange={onQueryChange}
          onSelectResult={onSelectResult}
          onSubmit={onSubmit}
          query={query}
          results={results}
          text={text}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {text.suggestedSearches.map((item) => (
          <button
            key={item.query}
            type="button"
            onClick={() => onQueryChange(item.query)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
