import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Copy, Download } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { useLanguage } from '../../context/LanguageContext';
import { copyTextToClipboard } from '../../utils/clipboard';
import { chromeExtensionText } from './data';
import { buildManifest, downloadManifest } from './manifest';
import type { ExtensionTemplate } from './types';

type ManifestPanelProps = {
  template: ExtensionTemplate;
};

export function ManifestPanel({ template }: ManifestPanelProps) {
  const { language } = useLanguage();
  const text = chromeExtensionText[language].manifest;
  const manifest = useMemo(() => buildManifest(template), [template]);
  const [copied, setCopied] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string>(text.ready);

  useEffect(() => {
    setCopyStatus(text.ready);
  }, [text.ready]);

  const copyManifest = async () => {
    const wasCopied = await copyTextToClipboard(manifest);

    if (!wasCopied) {
      setCopied(false);
      setCopyStatus(text.copyBlocked);
      return;
    }

    setCopied(true);
    setCopyStatus(text.copied);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Card className="min-w-0 max-w-[calc(100vw_-_2rem)] overflow-hidden md:max-w-full">
      <CardContent className="min-w-0 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-gray-900 dark:text-white">{text.title}</h2>
            <p className="break-words text-sm text-gray-500 [overflow-wrap:anywhere] dark:text-gray-400">{text.description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="secondary" onClick={copyManifest} aria-label={language === 'ko' ? `${template.name} 매니페스트 복사` : `Copy ${template.name} manifest`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? text.copiedButton : text.copy}
            </Button>
            <Button variant="secondary" onClick={() => downloadManifest(template)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <Download className="h-4 w-4" /> {text.download}
            </Button>
          </div>
        </div>
        <pre className="max-h-80 max-w-full overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
          <code>{manifest}</code>
        </pre>
        <p className="break-words rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 [overflow-wrap:anywhere] dark:bg-gray-900 dark:text-gray-400">{copyStatus}</p>
      </CardContent>
    </Card>
  );
}
