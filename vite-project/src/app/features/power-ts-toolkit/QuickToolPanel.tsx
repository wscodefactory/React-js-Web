import { useState } from "react";
import { copyTextToClipboard } from "../../utils/clipboard";
import { useLanguage } from "../../context/LanguageContext";
import { powerToolkitCopy } from "./copy";
import { QuickToolInputPanel, QuickToolSelect } from "./QuickToolInputPanel";
import { QuickToolResultPanel } from "./QuickToolResultPanel";
import { downloadToolResult } from "./toolResultExport";
import type { ConversionTarget, QuickToolValue, ToolProcessResult } from "./types";

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
  const { language } = useLanguage();
  const text = powerToolkitCopy[language].quick;
  const [copied, setCopied] = useState(false);
  const [actionStatus, setActionStatus] = useState("");
  const hasOutput = result.output.trim().length > 0;

  const copyResult = async () => {
    if (!hasOutput) {
      setActionStatus(text.actionStatus.copyFirst);
      return;
    }

    try {
      const wasCopied = await copyTextToClipboard(result.output);

      if (!wasCopied) {
        throw new Error("Clipboard copy failed.");
      }

      setCopied(true);
      setActionStatus(text.actionStatus.copied);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setActionStatus(text.actionStatus.copyBlocked);
    }
  };

  const downloadResult = () => {
    if (!hasOutput) {
      setActionStatus(text.actionStatus.downloadFirst);
      return;
    }

    downloadToolResult(result.output, selectedTool, conversionTarget);
    setActionStatus(text.actionStatus.downloaded);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{text.title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{selectedHelp}</p>
        </div>
        <QuickToolSelect onToolChange={onToolChange} selectedTool={selectedTool} text={text} />
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-2">
        <QuickToolInputPanel
          conversionTarget={conversionTarget}
          input={input}
          onClear={onClear}
          onInputChange={onInputChange}
          onLoadSample={onLoadSample}
          onProcess={onProcess}
          onTargetChange={onTargetChange}
          selectedHelp={selectedHelp}
          selectedTool={selectedTool}
          text={text}
        />
        <QuickToolResultPanel
          actionStatus={actionStatus}
          copied={copied}
          hasOutput={hasOutput}
          onCopy={copyResult}
          onDownload={downloadResult}
          result={result}
          selectedTool={selectedTool}
          text={text}
        />
      </div>
    </section>
  );
}
