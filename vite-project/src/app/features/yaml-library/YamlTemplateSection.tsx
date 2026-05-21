import { Search, SearchX } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { TemplateCard } from './TemplateCard';
import type { YamlTemplate } from './types';

type YamlTemplateSectionProps = {
  copiedId: string | null;
  onCopy: (template: YamlTemplate) => void;
  onQueryChange: (query: string) => void;
  query: string;
  templates: YamlTemplate[];
};

export function YamlTemplateSection({
  copiedId,
  onCopy,
  onQueryChange,
  query,
  templates,
}: YamlTemplateSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Starter templates</h2>
        <label className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search templates"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </label>
      </div>
      {templates.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} copiedId={copiedId} onCopy={onCopy} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <SearchX className="mb-4 h-10 w-10 text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">No templates found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Clear the query to see all starter templates.</p>
            <Button variant="secondary" onClick={() => onQueryChange('')} className="mt-5">
              Clear search
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
