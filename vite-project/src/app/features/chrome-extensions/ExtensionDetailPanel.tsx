import { ExternalLink, Moon, Sun } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { chromeExtensionText } from './data';
import { PopupPreview } from './PopupPreview';
import type { ExtensionTemplate, PreviewTheme } from './types';

type ExtensionDetailPanelProps = {
  notesOpen: boolean;
  onNotesOpenChange: (open: boolean) => void;
  onThemeChange: (theme: PreviewTheme) => void;
  template: ExtensionTemplate;
  theme: PreviewTheme;
};

export function ExtensionDetailPanel({
  notesOpen,
  onNotesOpenChange,
  onThemeChange,
  template,
  theme,
}: ExtensionDetailPanelProps) {
  const { language } = useLanguage();
  const text = chromeExtensionText[language].panel;

  return (
    <Card className="min-w-0 max-w-[calc(100vw_-_2rem)] overflow-hidden md:max-w-full">
      <CardContent className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        <div className="min-w-0 space-y-4">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {template.category}
          </span>
          <h2 className="break-words text-2xl font-semibold text-gray-900 dark:text-white">{template.name}</h2>
          <p className="break-words text-gray-600 [overflow-wrap:anywhere] dark:text-gray-400">{template.description}</p>
          <div className="flex flex-wrap gap-2">
            {template.permissions.map((permission) => (
              <span key={permission} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                {permission}
              </span>
            ))}
          </div>
          <Button variant="secondary" onClick={() => onNotesOpenChange(!notesOpen)}>
            <ExternalLink className="h-4 w-4" />
            {notesOpen ? text.hideNotes : text.openNotes}
          </Button>
        </div>
        <div className="min-w-0">
          <div className="mb-3 flex justify-end gap-2">
            <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => onThemeChange('light')} aria-label={text.lightTheme}>
              <Sun className="h-4 w-4" />
            </Button>
            <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => onThemeChange('dark')} aria-label={text.darkTheme}>
              <Moon className="h-4 w-4" />
            </Button>
          </div>
          <PopupPreview theme={theme} />
        </div>
      </CardContent>
    </Card>
  );
}
