import { Code, Download, Eye, RotateCcw } from 'lucide-react';
import { Button } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { formBuilderCopy } from './copy';
import type { BuilderMode } from './types';

type BuilderActionsProps = {
  draftStatus: string;
  mode: BuilderMode;
  onDownloadSchema: () => void;
  onModeChange: (mode: BuilderMode) => void;
  onReset: () => void;
};

export function BuilderActions({
  draftStatus,
  mode,
  onDownloadSchema,
  onModeChange,
  onReset,
}: BuilderActionsProps) {
  const { language } = useLanguage();
  const text = formBuilderCopy[language].actions;

  return (
    <div className="space-y-3">
      <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{draftStatus}</p>
      <Button variant={mode === 'preview' ? 'primary' : 'secondary'} className="w-full justify-center gap-2" onClick={() => onModeChange(mode === 'preview' ? 'build' : 'preview')}>
        <Eye className="h-4 w-4" />
        {mode === 'preview' ? text.editForm : text.previewForm}
      </Button>
      <Button variant={mode === 'code' ? 'primary' : 'secondary'} className="w-full justify-center gap-2" onClick={() => onModeChange(mode === 'code' ? 'build' : 'code')}>
        <Code className="h-4 w-4" />
        {mode === 'code' ? text.backToBuilder : text.exportCode}
      </Button>
      <Button variant="secondary" className="w-full justify-center gap-2" onClick={onDownloadSchema}>
        <Download className="h-4 w-4" />
        {text.downloadSchema}
      </Button>
      <Button variant="secondary" className="w-full justify-center gap-2" onClick={onReset}>
        <RotateCcw className="h-4 w-4" />
        {text.resetBuilder}
      </Button>
    </div>
  );
}
