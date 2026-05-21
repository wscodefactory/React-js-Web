import { CheckCircle2, Copy, PackageCheck } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import type { SupportedPlatform } from './types';

type ManifestPreviewPanelProps = {
  copied: boolean;
  manifestPreview: string;
  onCopyManifest: () => void;
  platform: SupportedPlatform;
};

export function ManifestPreviewPanel({
  copied,
  manifestPreview,
  onCopyManifest,
  platform,
}: ManifestPreviewPanelProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="card-title">Manifest Preview</h2>
            <p className="card-description">{platform.label} package metadata</p>
          </div>
          <Button variant="secondary" onClick={onCopyManifest} className="shrink-0 whitespace-nowrap">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </span>
          </Button>
        </div>
        <pre className="max-h-80 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
          <code>{manifestPreview}</code>
        </pre>
        <div className="grid gap-2 sm:grid-cols-3">
          {platform.assets.map((asset) => (
            <div key={asset} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <PackageCheck className="h-4 w-4 text-green-600" />
              {asset}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
