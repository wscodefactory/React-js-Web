import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { formBuilderCopy } from './copy';

type ExportCodePanelProps = {
  code: string;
  zodSchema: string;
};

export function ExportCodePanel({ code, zodSchema }: ExportCodePanelProps) {
  const { language } = useLanguage();
  const text = formBuilderCopy[language].code;
  const [copied, setCopied] = useState(false);
  const [exportMode, setExportMode] = useState<'html' | 'zod'>('html');
  const [status, setStatus] = useState(text.initialStatus);
  const activeCode = exportMode === 'html' ? code : zodSchema;
  const activeExtension = exportMode === 'html' ? 'html' : 'ts';

  const copyCode = async () => {
    const wasCopied = await copyTextToClipboard(activeCode);

    if (!wasCopied) {
      setCopied(false);
      setStatus(text.copyBlocked);
      return;
    }

    setCopied(true);
    setStatus(text.copiedStatus);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const downloadCode = () => {
    const blob = new Blob([activeCode], { type: exportMode === 'html' ? 'text/html;charset=utf-8' : 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `generated-form.${activeExtension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus(text.downloadReady);
  };

  return (
    <Card>
      <CardHeader
        title={text.title}
        description={text.description}
        badge={(
          <div className="flex flex-wrap gap-2">
            <div className="grid grid-cols-2 rounded-lg border border-gray-200 p-1 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setExportMode('html')}
                className={`rounded-md px-3 py-1.5 text-sm ${exportMode === 'html' ? 'bg-green-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                HTML
              </button>
              <button
                type="button"
                onClick={() => setExportMode('zod')}
                className={`rounded-md px-3 py-1.5 text-sm ${exportMode === 'zod' ? 'bg-green-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                Zod
              </button>
            </div>
            <Button variant="secondary" onClick={copyCode}>{copied ? text.copied : text.copyCode}</Button>
            <Button variant="secondary" onClick={downloadCode} className="gap-2">
              <Download className="h-4 w-4" />
              {activeExtension.toUpperCase()}
            </Button>
          </div>
        )}
      />
      <CardContent className="space-y-3">
        <pre className="max-h-[520px] overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
          <code>{activeCode}</code>
        </pre>
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{status}</p>
      </CardContent>
    </Card>
  );
}
