import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../../components/common';
import { copyTextToClipboard } from '../../utils/clipboard';

type ExportCodePanelProps = {
  code: string;
};

export function ExportCodePanel({ code }: ExportCodePanelProps) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('Generated code is ready to copy or download.');

  const copyCode = async () => {
    const wasCopied = await copyTextToClipboard(code);

    if (!wasCopied) {
      setCopied(false);
      setStatus('Clipboard copy failed. Use HTML download instead.');
      return;
    }

    setCopied(true);
    setStatus('Code copied to clipboard.');
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
    setStatus('Generated form markup queued for download.');
  };

  return (
    <Card>
      <CardHeader
        title="Export Code"
        description="Generated HTML-style form markup based on the current builder state."
        badge={(
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={copyCode}>{copied ? 'Copied' : 'Copy Code'}</Button>
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
