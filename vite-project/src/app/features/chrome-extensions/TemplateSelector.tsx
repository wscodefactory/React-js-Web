import { useLanguage } from '../../context/LanguageContext';
import { extensionTemplates, getExtensionTemplateCopy } from './data';

type TemplateSelectorProps = {
  onSelect: (id: string) => void;
  selectedId: string;
};

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  const { language } = useLanguage();

  return (
    <div className="min-w-0 space-y-3">
      {extensionTemplates.map((template) => {
        const templateCopy = getExtensionTemplateCopy(language, template);

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={`w-full min-w-0 max-w-[calc(100vw_-_2rem)] rounded-2xl border p-4 text-left transition md:max-w-full ${selectedId === template.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-white hover:border-green-300 dark:border-gray-700 dark:bg-gray-800'}`}
          >
            <span className="mb-1 block break-words text-sm font-semibold text-gray-900 dark:text-white">{templateCopy.name}</span>
            <span className="block break-words text-xs text-gray-500 dark:text-gray-400">{templateCopy.category}</span>
          </button>
        );
      })}
    </div>
  );
}
