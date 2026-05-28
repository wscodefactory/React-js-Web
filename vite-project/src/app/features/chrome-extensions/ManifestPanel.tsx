import { useMemo, useState } from 'react';
import { CheckCircle, Copy, Download } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { copyTextToClipboard } from '../../utils/clipboard';
import { buildManifest, downloadManifest } from './manifest';
import type { ExtensionTemplate } from './types';

type ManifestPanelProps = {
  template: ExtensionTemplate;
};

export function ManifestPanel({ template }: ManifestPanelProps) {
  const manifest = useMemo(() => buildManifest(template), [template]);
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Manifest is ready to copy or download.');

  const copyManifest = async () => {
    const wasCopied = await copyTextToClipboard(manifest);

    if (!wasCopied) {
      setCopied(false);
      setCopyStatus('Clipboard copy failed. Use JSON download instead.');
      return;
    }

    setCopied(true);
    setCopyStatus('Manifest copied to clipboard.');
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manifest preview</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generated from the selected template data.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={copyManifest} aria-label={`Copy ${template.name} manifest`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="secondary" onClick={() => downloadManifest(template)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <Download className="h-4 w-4" /> JSON
            </Button>
          </div>
        </div>
        <pre className="max-h-80 overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
          <code>{manifest}</code>
        </pre>
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{copyStatus}</p>
      </CardContent>
    </Card>
  );
}
