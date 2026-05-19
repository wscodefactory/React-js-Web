import { ArrowLeftRight, Check, Copy } from 'lucide-react';
import { Button, Card, CardContent } from '../../components/common';
import type { ConverterMode } from './types';

type YamlConverterPanelProps = {
  copiedId: string | null;
  input: string;
  mode: ConverterMode;
  onConvert: () => void;
  onCopyOutput: () => void;
  onInputChange: (input: string) => void;
  onLoadSample: () => void;
  onModeChange: (mode: ConverterMode) => void;
  output: string;
};

export function YamlConverterPanel({
  copiedId,
  input,
  mode,
  onConvert,
  onCopyOutput,
  onInputChange,
  onLoadSample,
  onModeChange,
  output,
}: YamlConverterPanelProps) {
  return (
    <Card className="mb-10">
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">YAML / JSON Converter</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Convert common YAML maps and arrays into JSON, or format JSON back into YAML.
            </p>
          </div>
          <select
            value={mode}
            onChange={(event) => onModeChange(event.target.value as ConverterMode)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            aria-label="Converter mode"
          >
            <option value="yaml-to-json">YAML to JSON</option>
            <option value="json-to-yaml">JSON to YAML</option>
          </select>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <textarea
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              className="h-64 w-full rounded-xl border border-gray-300 bg-gray-50 p-4 font-mono text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              placeholder={mode === 'yaml-to-json' ? 'Paste YAML here' : 'Paste JSON here'}
            />
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={onLoadSample}>
                Load sample
              </Button>
              <Button onClick={onConvert}>
                <ArrowLeftRight className="h-4 w-4" /> Convert
              </Button>
            </div>
          </div>

          <div>
            <pre className="h-64 overflow-auto rounded-xl bg-gray-950 p-4 text-sm text-gray-100">
              <code>{output || 'Converted output will appear here.'}</code>
            </pre>
            <div className="mt-3 flex justify-end">
              <Button variant="secondary" onClick={onCopyOutput} disabled={!output}>
                {copiedId === 'converter-output' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy output
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
