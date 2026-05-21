import { extensionTemplates } from './data';

type TemplateSelectorProps = {
  onSelect: (id: string) => void;
  selectedId: string;
};

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      {extensionTemplates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelect(template.id)}
          className={`w-full rounded-2xl border p-4 text-left transition ${selectedId === template.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-white hover:border-green-300 dark:border-gray-700 dark:bg-gray-800'}`}
        >
          <span className="mb-1 block text-sm font-semibold text-gray-900 dark:text-white">{template.name}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">{template.category}</span>
        </button>
      ))}
    </div>
  );
}
