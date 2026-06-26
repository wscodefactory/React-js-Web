import type { KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import type { SearchModalText } from "./types";

type SearchModalInputProps = {
  onChange: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  searchQuery: string;
  text: SearchModalText;
};

export function SearchModalInput({
  onChange,
  onClear,
  onClose,
  onKeyDown,
  searchQuery,
  text,
}: SearchModalInputProps) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 dark:border-gray-700">
      <Search className="h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder={text.placeholder}
        value={searchQuery}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        autoFocus
        className="flex-1 bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
      />
      {searchQuery.trim() ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          aria-label={text.clearSearch}
        >
          <X className="h-5 w-5" />
        </button>
      ) : null}
      <button type="button" onClick={onClose} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={text.closeSearchModal}>
        <X className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
}
