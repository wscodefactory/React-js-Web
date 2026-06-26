import { Button } from "../../components/common";
import { quickToolOptions } from "../../data/showcase";
import type { PowerToolkitCopy } from "./copy";
import type { ConversionTarget, QuickToolValue } from "./types";

type QuickToolInputPanelProps = {
  conversionTarget: ConversionTarget;
  input: string;
  onClear: () => void;
  onInputChange: (value: string) => void;
  onLoadSample: () => void;
  onProcess: () => void;
  onTargetChange: (value: ConversionTarget) => void;
  selectedHelp: string;
  selectedTool: QuickToolValue;
  text: PowerToolkitCopy["quick"];
};

export function QuickToolInputPanel({
  conversionTarget,
  input,
  onClear,
  onInputChange,
  onLoadSample,
  onProcess,
  onTargetChange,
  selectedHelp,
  selectedTool,
  text,
}: QuickToolInputPanelProps) {
  return (
    <div>
      {selectedTool === "powerfx" ? (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{text.outputTarget}</span>
          <select
            value={conversionTarget}
            onChange={(event) => onTargetChange(event.target.value as ConversionTarget)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            aria-label={text.outputTarget}
          >
            <option value="react">{text.targetOptions.react}</option>
            <option value="javascript">{text.targetOptions.javascript}</option>
          </select>
        </div>
      ) : null}
      <textarea
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        className="h-56 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        placeholder={text.placeholders[selectedTool]}
        aria-label={selectedHelp}
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onLoadSample}>{text.buttons.loadSample}</Button>
        <Button variant="secondary" onClick={onClear}>{text.buttons.clear}</Button>
        <Button onClick={onProcess}>{text.buttons.run}</Button>
      </div>
    </div>
  );
}

type QuickToolSelectProps = {
  onToolChange: (value: QuickToolValue) => void;
  selectedTool: QuickToolValue;
  text: PowerToolkitCopy["quick"];
};

export function QuickToolSelect({ onToolChange, selectedTool, text }: QuickToolSelectProps) {
  return (
    <select
      value={selectedTool}
      onChange={(event) => onToolChange(event.target.value as QuickToolValue)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
    >
      {quickToolOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {text.options[option.value as QuickToolValue] ?? option.label}
        </option>
      ))}
    </select>
  );
}
