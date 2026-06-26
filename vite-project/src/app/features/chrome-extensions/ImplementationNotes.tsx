import { Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { chromeExtensionText } from './data';
import type { ExtensionTemplate } from './types';

type ImplementationNotesProps = {
  template: ExtensionTemplate;
};

export function ImplementationNotes({ template }: ImplementationNotesProps) {
  const { language } = useLanguage();
  const text = chromeExtensionText[language].implementation;
  const hasStoragePermission = template.permissions.includes('storage');

  return (
    <Card className="min-w-0 max-w-[calc(100vw_-_2rem)] overflow-hidden md:max-w-full">
      <CardContent className="grid min-w-0 gap-4 md:grid-cols-3">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-gray-900 dark:text-white">{text.storageTitle}</h3>
          <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">{text.storageBody(hasStoragePermission)}</p>
        </div>
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-gray-900 dark:text-white">{text.popupTitle}</h3>
          <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">{text.popupBody}</p>
        </div>
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-gray-900 dark:text-white">{text.testingTitle}</h3>
          <p className="mt-1 break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">{text.testingBody}</p>
        </div>
      </CardContent>
    </Card>
  );
}
