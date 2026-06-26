import { useEffect, useRef } from 'react';
import { Clipboard, Download, RotateCcw, RotateCw, Trash2, Upload, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common';
import { svgEditorCopy } from './copy';

type ActionsPanelProps = {
  canRedo: boolean;
  canUndo: boolean;
  onCopySvg: () => void;
  onExport: () => void;
  onHideSource: () => void;
  onImportClick: () => void;
  onRedo: () => void;
  onReset: () => void;
  onUndo: () => void;
  showSource: boolean;
  svgMarkup: string;
};

export function ActionsPanel({
  canRedo,
  canUndo,
  onCopySvg,
  onExport,
  onHideSource,
  onImportClick,
  onRedo,
  onReset,
  onUndo,
  showSource,
  svgMarkup,
}: ActionsPanelProps) {
  const { language } = useLanguage();
  const text = svgEditorCopy[language].actions;
  const sourceRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showSource) {
      sourceRef.current?.focus();
      sourceRef.current?.select();
    }
  }, [showSource, svgMarkup]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="icon-sm" />
          {text.undo}
        </Button>
        <Button
          variant="secondary"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCw className="icon-sm" />
          {text.redo}
        </Button>
      </div>
      <Button variant="secondary" onClick={onCopySvg} className="flex w-full items-center justify-center gap-2">
        <Clipboard className="icon-sm" />
        {text.copySvg}
      </Button>
      <Button onClick={onExport} className="flex w-full items-center justify-center gap-2">
        <Download className="icon-sm" />
        {text.exportSvg}
      </Button>
      <Button variant="secondary" onClick={onImportClick} className="flex w-full items-center justify-center gap-2">
        <Upload className="icon-sm" />
        {text.importSvg}
      </Button>
      <Button variant="secondary" onClick={onReset} className="flex w-full items-center justify-center gap-2">
        <Trash2 className="icon-sm" />
        {text.resetCanvas}
      </Button>
      {showSource ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{text.sourceTitle}</span>
            <button
              type="button"
              onClick={onHideSource}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-label={text.hideSource}
            >
              <X className="icon-sm" />
            </button>
          </div>
          <textarea
            ref={sourceRef}
            readOnly
            value={svgMarkup}
            className="h-36 w-full resize-y rounded-md border border-gray-300 bg-white p-2 font-mono text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
          />
        </div>
      ) : null}
    </div>
  );
}
