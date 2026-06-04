import { Check, Copy, Download, X } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import { getLineCount } from './yamlConverter';
import type { UploadedYaml } from './types';

type UploadedYamlCardProps = {
  copiedId: string | null;
  file: UploadedYaml;
  onCopy: (file: UploadedYaml) => void;
  onDownload: (file: UploadedYaml) => void;
  onRemove: (id: string) => void;
};

export function UploadedYamlCard({
  copiedId,
  file,
  onCopy,
  onDownload,
  onRemove,
}: UploadedYamlCardProps) {
  const copied = copiedId === file.id;

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{file.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{getLineCount(file.content)} lines imported</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onCopy(file)} aria-label={`Copy ${file.name}`}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="secondary" onClick={() => onDownload(file)} aria-label={`Download ${file.name}`}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => onRemove(file.id)} aria-label={`Remove ${file.name}`}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <pre className="max-h-72 overflow-auto rounded-xl bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <code>{file.content}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
