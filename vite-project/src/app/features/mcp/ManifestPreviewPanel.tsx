import { CheckCircle2, Copy, Download, PackageCheck } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import type { SupportedPlatform } from './types';

type ManifestPreviewPanelProps = {
  canDownloadPackage: boolean;
  copied: boolean;
  copyStatus: string;
  manifestPreview: string;
  onCopyManifest: () => void;
  onDownloadPackage: () => void;
  platform: SupportedPlatform;
};

export function ManifestPreviewPanel({
  canDownloadPackage,
  copied,
  copyStatus,
  manifestPreview,
  onCopyManifest,
  onDownloadPackage,
  platform,
}: ManifestPreviewPanelProps) {
  const downloadManifest = () => {
    const blob = new Blob([manifestPreview], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${platform.id}-mcp-manifest.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="card-title">Manifest Preview</h2>
            <p className="card-description">{platform.label} package metadata</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onCopyManifest} className="shrink-0 whitespace-nowrap">
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </span>
            </Button>
            <Button variant="secondary" onClick={downloadManifest} className="shrink-0 gap-2 whitespace-nowrap">
              <Download className="h-4 w-4" />
              JSON
            </Button>
            <Button
              variant="secondary"
              onClick={onDownloadPackage}
              disabled={!canDownloadPackage}
              className="shrink-0 gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Package
            </Button>
          </div>
        </div>
        <pre className="max-h-80 overflow-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
          <code>{manifestPreview}</code>
        </pre>
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">{copyStatus}</p>
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
