import type { MouseEvent } from "react";
import { Clock, CornerDownLeft, X } from "lucide-react";
import type { AppLanguage } from "@/app/context/LanguageContext";
import { localizeRouteLabel } from "@/app/i18n";
import type { StoredRecentSearch } from "@/app/types/common";
import type { SearchModalText } from "./types";

type RecentSearchListProps = {
  activeIndex: number;
  language: AppLanguage;
  onClearAll: () => void;
  onRemove: (path: string, event: MouseEvent) => void;
  onSelect: (path: string) => void;
  recentSearches: StoredRecentSearch[];
  text: SearchModalText;
};

export function RecentSearchList({
  activeIndex,
  language,
  onClearAll,
  onRemove,
  onSelect,
  recentSearches,
  text,
}: RecentSearchListProps) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>{text.recent}</span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-green-600 hover:underline dark:text-green-400"
        >
          {text.clearAll}
        </button>
      </div>
      {recentSearches.map((item, index) => {
        const localizedName = localizeRouteLabel(language, item.path, item.name);

        return (
          <div
            key={item.path}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors group ${
              activeIndex === index ? "bg-green-50 dark:bg-green-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(item.path)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <Clock className="h-5 w-5 shrink-0 text-gray-400" />
              <span className="flex-1 text-gray-900 dark:text-white">{localizedName}</span>
              {activeIndex === index ? <CornerDownLeft className="h-4 w-4 text-gray-400" /> : null}
            </button>
            <button
              type="button"
              onClick={(event) => onRemove(item.path, event)}
              className="rounded p-1 text-gray-500 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:text-gray-400 dark:hover:bg-gray-600"
              aria-label={text.removeRecent(localizedName)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
