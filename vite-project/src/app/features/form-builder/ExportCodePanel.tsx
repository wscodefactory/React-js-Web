import { useState } from 'react';
import { Button, Card, CardContent, CardHeader } from '../../components/common';

type ExportCodePanelProps = {
  code: string;
};

export function ExportCodePanel({ code }: ExportCodePanelProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Card>
      <CardHeader
        title="Export Code"
        description="Generated HTML-style form markup based on the current builder state."
        badge={<Button variant="secondary" onClick={copyCode}>{copied ? 'Copied' : 'Copy Code'}</Button>}
      />
      <CardContent>
        <pre className="max-h-[520px] overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
