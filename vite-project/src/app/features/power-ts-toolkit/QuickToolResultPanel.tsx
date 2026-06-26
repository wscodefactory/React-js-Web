import { Check, Copy, Download } from "lucide-react";
import { Button } from "../../components/common";
import type { PowerToolkitCopy } from "./copy";
import type { QuickToolValue, ToolProcessResult } from "./types";

type QuickToolResultPanelProps = {
  actionStatus: string;
  copied: boolean;
  hasOutput: boolean;
  onCopy: () => void;
  onDownload: () => void;
  result: ToolProcessResult;
  selectedTool: QuickToolValue;
  text: PowerToolkitCopy["quick"];
};

export function QuickToolResultPanel({
  actionStatus,
  copied,
  hasOutput,
  onCopy,
  onDownload,
  result,
  selectedTool,
  text,
}: QuickToolResultPanelProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{text.result}</h3>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
          {text.options[selectedTool]}
        </span>
      </div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{result.status}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onCopy} disabled={!hasOutput} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? text.buttons.copied : text.buttons.copy}
        </Button>
        <Button variant="secondary" onClick={onDownload} disabled={!hasOutput} className="gap-2">
          <Download className="h-4 w-4" />
          {text.buttons.download}
        </Button>
      </div>
      <pre className="min-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-950 p-4 text-sm text-gray-100">
        <code>{result.output || text.emptyOutput}</code>
      </pre>
      {actionStatus ? (
        <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">{actionStatus}</p>
      ) : null}
    </div>
  );
}
