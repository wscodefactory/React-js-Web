import { Search } from "lucide-react";

type SearchEmptyStateProps = {
  description: string;
  title: string;
};

export function SearchEmptyState({ description, title }: SearchEmptyStateProps) {
  return (
    <div className="px-4 py-12 text-center text-gray-400 dark:text-gray-500">
      <Search className="mx-auto mb-3 h-12 w-12 opacity-50" />
      <p>{title}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}
