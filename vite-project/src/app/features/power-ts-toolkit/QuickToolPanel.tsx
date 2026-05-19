import { Button } from '../../components/common';
import { quickToolOptions } from '../../data/showcase';
import { toolPlaceholders } from './data';
import type { ConversionTarget, QuickToolValue, ToolProcessResult } from './types';

type QuickToolPanelProps = {
  conversionTarget: ConversionTarget;
  input: string;
  onClear: () => void;
  onInputChange: (value: string) => void;
  onLoadSample: () => void;
  onProcess: () => void;
  onTargetChange: (value: ConversionTarget) => void;
  onToolChange: (value: QuickToolValue) => void;
  result: ToolProcessResult;
  selectedHelp: string;
  selectedTool: QuickToolValue;
};

export function QuickToolPanel({
  conversionTarget,
  input,
  onClear,
  onInputChange,
  onLoadSample,
  onProcess,
  onTargetChange,
  onToolChange,
  result,
  selectedHelp,
  selectedTool,
}: QuickToolPanelProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Tool</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{selectedHelp}</p>
        </div>
        <select
          value={selectedTool}
          onChange={(event) => onToolChange(event.target.value as QuickToolValue)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {quickToolOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-2">
        <div>
          {selectedTool === 'powerfx' ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Output target</span>
              <select
                value={conversionTarget}
                onChange={(event) => onTargetChange(event.target.value as ConversionTarget)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                aria-label="Power Fx output target"
              >
                <option value="react">React handler</option>
                <option value="javascript">Plain JavaScript</option>
              </select>
            </div>
          ) : null}
          <textarea
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            className="h-56 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            placeholder={toolPlaceholders[selectedTool]}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={onLoadSample}>Load Sample</Button>
            <Button variant="secondary" onClick={onClear}>Clear</Button>
            <Button onClick={onProcess}>Process</Button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Result</h3>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
              {selectedTool}
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{result.status}</p>
          <pre className="min-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
            <code>{result.output || 'Processed output will appear here.'}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
