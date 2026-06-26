import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { formBuilderCopy } from './copy';

type ExportCodePanelProps = {
  code: string;
};

export function ExportCodePanel({ code }: ExportCodePanelProps) {
  const { language } = useLanguage();
  const text = formBuilderCopy[language].code;
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(text.initialStatus);

  const copyCode = async () => {
    const wasCopied = await copyTextToClipboard(code);

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
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'generated-form.html';
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
            <Button variant="secondary" onClick={copyCode}>{copied ? text.copied : text.copyCode}</Button>
            <Button variant="secondary" onClick={downloadCode} className="gap-2">
              <Download className="h-4 w-4" />
              HTML
            </Button>
          </div>
        )}
      />
      <CardContent className="space-y-3">
        <pre className="max-h-[520px] overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
          <code>{code}</code>
        </pre>
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{status}</p>
      </CardContent>
    </Card>
  );
}
