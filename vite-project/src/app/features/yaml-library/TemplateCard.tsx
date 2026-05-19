import { Check, Copy } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import type { YamlTemplate } from './types';

type TemplateCardProps = {
  copiedId: string | null;
  onCopy: (template: YamlTemplate) => void;
  template: YamlTemplate;
};

export function TemplateCard({ copiedId, onCopy, template }: TemplateCardProps) {
  const copied = copiedId === template.id;

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{template.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
          </div>
          <Button variant="secondary" onClick={() => onCopy(template)} aria-label={`Copy ${template.title}`}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <pre className="max-h-64 overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
          <code>{template.code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
