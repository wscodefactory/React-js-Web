import { CornerDownLeft, Search } from "lucide-react";
import type { SearchItem } from "@/app/types/navigation";

type SearchResultListProps = {
  activeIndex: number;
  onSelect: (item: SearchItem) => void;
  results: SearchItem[];
};

export function SearchResultList({ activeIndex, onSelect, results }: SearchResultListProps) {
  return (
    <div className="py-2">
      {results.map((item, index) => (
        <button
          key={item.path}
          type="button"
          onClick={() => onSelect(item)}
          className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
            activeIndex === index ? "bg-green-50 dark:bg-green-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
        >
          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded bg-green-100 dark:bg-green-900/30">
            <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                {item.category}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
          </div>
          {activeIndex === index ? <CornerDownLeft className="mt-3 h-4 w-4 text-gray-400" /> : null}
        </button>
      ))}
    </div>
  );
}
