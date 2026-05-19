import { ExternalLink, Moon, Sun } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
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
  return (
    <Card>
      <CardContent className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
            {template.category}
          </span>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{template.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{template.description}</p>
          <div className="flex flex-wrap gap-2">
            {template.permissions.map((permission) => (
              <span key={permission} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                {permission}
              </span>
            ))}
          </div>
          <Button variant="secondary" onClick={() => onNotesOpenChange(!notesOpen)}>
            <ExternalLink className="h-4 w-4" />
            {notesOpen ? 'Hide implementation notes' : 'Open implementation notes'}
          </Button>
        </div>
        <div>
          <div className="mb-3 flex justify-end gap-2">
            <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => onThemeChange('light')} aria-label="Preview light theme">
              <Sun className="h-4 w-4" />
            </Button>
            <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => onThemeChange('dark')} aria-label="Preview dark theme">
              <Moon className="h-4 w-4" />
            </Button>
          </div>
          <PopupPreview theme={theme} />
        </div>
      </CardContent>
    </Card>
  );
}
